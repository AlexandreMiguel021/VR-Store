import { atualizaCarrinho } from "./carrinho.js";
atualizaCarrinho();

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function iniValidacao() {
   const inputs = $$('.input');
   const dataNascimento = $('#user-birthDate');
   const cpf = $('#user-cpf');
   const cep = $('#user-cep');
   const btnCadastrar = $('.cadastro__form');

   if (btnCadastrar)
      btnCadastrar.addEventListener('submit', e => {
         console.log('enviado');
         registraCliente();
      })

   inputs.forEach(input => {
      input.addEventListener('blur', event => {
         valida(event.target);
      });
   });

   if (dataNascimento)
      dataNascimento.addEventListener('keypress', e => {
         formataInputData(e.target);
      });

   if (cpf)
      cpf.addEventListener('keyup', e => {
         formataInputCPF(e.target);
      });

   if (cep)
      cep.addEventListener('keyup', e => {
         formataInputCEP(e.target);
      });

   const valida = input => {
      checaSeVazio(input);
      if (validadores[input.name]) validadores[input.name](input);
   }

   const tiposDeInputs = {
      nome: 'nome',
      email: 'e-mail',
      cpf: 'CPF',
      cep: 'CEP',
      dataNascimento: 'data de nascimento',
      rua: 'rua',
      bairro: 'bairro',
      cidade: 'cidade',
      estado: 'estado',
      assunto: 'assunto',
      mensagem: 'mensagem',
      numeroResidencia: 'numero da residencia',
      senha: 'senha'
   }

   const validadores = {
      dataNascimento: input => validaDataNascimento(input),

      cpf: input => {
         validaCPF(input),
            formataInputCPF(input)
      },

      cep: input => {
         validaCEP(input),
            formataInputCEP(input),
            recuperarCEP(input)
      },

      email: input => validaEmail(input),
      senha: input => validaSenha(input)
   }

   const patternNumeros = new RegExp(/\d+/);
   const patternInput = new RegExp(/^[ \t]+$/);
   const patternEmail = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
   const patternCEP = new RegExp(/^[\d]{5}-?[\d]{3}$/);

   const isVazio = input => input.value.length < 1;

   const limitaInput = (input, limite) => input.value = input.value.substring(0, limite);

   const desabilitaInput = input => input.disabled = true;

   const checaSeVazio = input => {
      const inputNome = tiposDeInputs[input.name];
      let isValido = true;
      if (isVazio(input) || patternInput.test(input.value)) isValido = false;
      getMensagemErro(input, `O campo ${inputNome} não pode estar vazio`, isValido);
   }

   const formataInputData = input => {
      if (input.value.length == 2) input.value += '/'
      if (input.value.length == 5) input.value += '/'
      limitaInput(input, 9);
   }

   const formataInputCPF = input => {
      input.value = input.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
   }

   const formataInputCEP = input => {
      input.value = input.value.replace(/^([\d]{2})\.*([\d]{3})-*([\d]{3})/, "$1$2-$3");
   }

   const formataData = input => {
      const dataRecebida = input.value;
      const dataConvertida = dataRecebida.split('/').reverse().join('/');
      const data = new Date(dataConvertida);
      return data;
   }

   const apagarLetras = input => {
      if (!patternNumeros.test(input.value)) input.value = '';
   }

   const maiorQue18 = data => {
      const dataAtual = new Date();
      const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate());
      return dataMais18 <= dataAtual;
   }

   function validaDataNascimento(input) {
      let isValido = true;
      const dataFormatada = formataData(input);
      if (!maiorQue18(dataFormatada) && !isVazio(input)) {
         isValido = false;
         let mensagem = 'Você deve ser maior que 18 anos para se cadastrar';
         getMensagemErro(input, mensagem, isValido);
      }
      apagarLetras(input);
   }

   function validaEmail(input) {
      if (!patternEmail.test(input.value) && !isVazio(input)) {
         const mensagem = 'Insira um Email válido.';
         const isValido = false;
         getMensagemErro(input, mensagem, isValido)
      }
   }

   function validaCEP(input) {
      if (!patternCEP.test(input.value) && !isVazio(input)) {
         const mensagem = 'Insira um CEP válido.'
         const isValido = false;
         getMensagemErro(input, mensagem, isValido);
      }
      apagarLetras(input);
   }

   function validaCPF(input) {
      limitaInput(input, 14)
      const cpfFormatado = input.value.replace(/\D/g, '');
      if (!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)) {
         if (!isVazio(input))
            getMensagemErro(input, 'O CPF digitado não é válido.');
      }
      apagarLetras(input);
   }

   function checaCPFRepetido(cpf) {
      const valoresRepetidos = [
         '00000000000',
         '11111111111',
         '22222222222',
         '33333333333',
         '44444444444',
         '55555555555',
         '66666666666',
         '77777777777',
         '88888888888',
         '99999999999'
      ]
      let cpfValido = true;

      valoresRepetidos.forEach(valor => {
         if (valor == cpf) cpfValido = false;
      })

      return cpfValido;
   }

   function checaEstruturaCPF(cpf) {
      const multiplicador = 10;
      return checaDigitoVerificador(cpf, multiplicador);
   }

   function checaDigitoVerificador(cpf, multiplicador) {
      if (multiplicador >= 12) return true;

      let multiplicadorInicial = multiplicador;
      let soma = 0;
      const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('');
      const digitoVerificador = cpf.charAt(multiplicador - 1);
      for (let i = 0; multiplicadorInicial > 1; multiplicadorInicial--) {
         soma = soma + cpfSemDigitos[i] * multiplicadorInicial;
         i++;
      }

      if (digitoVerificador == confirmaDigito(soma))
         return checaDigitoVerificador(cpf, multiplicador + 1)

      return false;
   }

   function confirmaDigito(soma) {
      let resto = 11 - (soma % 11);
      if (resto === 10 || resto === 11) resto = 0;
      return resto;
   }

   function validaSenha(input) {
      if (input.value.length < 8 && !isVazio(input))
         getMensagemErro(input, 'A senha deve ter no mínimo 8 caracteres.');
   }

   function recuperarCEP(input) {
      const cep = input.value.replace(/\D/g, '');
      const url = `https://viacep.com.br/ws/${cep}/json/`;
      const options = {
         method: 'GET',
         mode: 'cors',
         headers: {
            'content-type': 'application/json;charset=utf-8'
         }
      }
      if (patternCEP.test(input.value)) {
         fetch(url, options).then(
            response => response.json()
         ).then(
            data => {
               if (data.erro) {
                  getMensagemErro(input, 'CEP não encontrado.');
                  return;
               }
               preencheCamposComCEP(data);
            }
         )
      }
   }

   function preencheCamposComCEP(data) {
      const rua = $('#user-rua');
      const cidade = $('#user-cidade');
      const estado = $('#user-estado');
      const bairro = $('#user-bairro');

      const inputsEndereco = [rua, cidade, estado, bairro];
      inputsEndereco.forEach(input => {
         desabilitaInput(input);
      })

      rua.value = data.logradouro;
      cidade.value = data.localidade;
      estado.value = data.uf;
      bairro.value = data.bairro;
   }

   function getMensagemErro(input, mensagem, isValido) {
      if (!isValido) {
         input.parentElement.classList.add('input-container--invalido');
         input.parentElement.querySelector('.input-mensagem-erro')
            .innerHTML = mensagem;
      } else {
         input.parentElement.classList.remove('input-container--invalido');
         input.parentElement.querySelector('.input-mensagem-erro')
            .innerHTML = '';
      }
   }

   const registraCliente = () => {
      clientes = getClientes();
      clientes.push({ nome: $('#user-nome').value, email: $('#user-email').value, senha: $('#user-senha').value, login: false });
      setClientes(clientes);
   }
}

iniValidacao()