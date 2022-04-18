const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const inputEmail = $('#login-email');
const inputSenha = $('#login-senha');
const btnLogin = $('#form-login');
const msgDeLogin = $('#msg-login');
const containerLogin = document.querySelector('#container-login');
const containerSair = document.querySelector('#container-sair');
const btnSair = document.querySelector('#btn-sair');

const entrarNaConta = (isLogado, indiceCliente) => {
   if (!isLogado) return;
   const i = Number(indiceCliente);
   const clientes = getClientes();
   clientes[i].login = true;
   setClientes(clientes);
   verificaLogin();
};

btnSair.addEventListener('click', sairDaConta);

btnLogin.addEventListener('submit', e => {
   e.preventDefault();
   validaCampo();
});

function alteraPaginaLogin(isLogado, indexCliente) {
   const clientes = getClientes()
   if (isLogado === true) {
      containerLogin.classList.add('login--desativo')
      containerSair.classList.add('sair--ativo');
      $('#msg-sair').textContent = `Olá! ${clientes[indexCliente].nome} :)`
   } else {
      containerLogin.classList.remove('login--desativo')
      containerSair.classList.remove('sair--ativo');
   }
}

function verificaLogin() {
   const clientes = getClientes()
   const indexCliente = clientes.findIndex(cliente => cliente.login === true);
   if (indexCliente > -1) alteraPaginaLogin(true, indexCliente);
}

function sairDaConta() {
   const clientes = getClientes();
   console.log(clientes);
   clientes.map(function (el) {
      if (el.login === true) el.login = false;
   })
   setClientes(clientes);
   verificaLogin();
   alteraPaginaLogin();
}

function validaCampo() {
   const clientes = getClientes();
   const indexEmail = clientes.findIndex(cliente => cliente.email == inputEmail.value);
   const indexSenha = clientes.findIndex(cliente => cliente.senha == inputSenha.value);
   const indiceCliente = clientes.map(function (e) { return e.email; }).indexOf(inputEmail.value);
   indexEmail > -1 && indexSenha > -1 ? retiraMensagemErro(indiceCliente) : criaMensagemErro();
}

function criaMensagemErro() {
   msgDeLogin.parentElement.classList.add('login-invalido');
   msgDeLogin.innerHTML = 'Email ou senha incorretos';
   entrarNaConta(false);
}

function retiraMensagemErro(indiceCliente) {
   msgDeLogin.parentElement.classList.remove('login-invalido');
   msgDeLogin.innerHTML = '';
   criaMensagemLogin();
   entrarNaConta(true, indiceCliente);
   setTimeout(() => {
      redirecionaUsuario();
   }, 1000);
}

function criaMensagemLogin() {
   msgDeLogin.parentElement.classList.add('login-valido');
   msgDeLogin.innerHTML = 'Login realizado!';
}

function redirecionaUsuario() {
   window.location.href = 'index.html';
}

verificaLogin();