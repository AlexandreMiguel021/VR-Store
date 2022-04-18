import { addProdutoCarrinho, atualizaCarrinho } from "./carrinho.js";
import { removeProdutoCarrinho } from "./carrinho.js";
import { limpaItem } from "./carrinho.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const listaProdutos = $('.produtos__selecionados');
let key;
let produtosSelecionados = getProdutos();

const montaListaProdutos = () => {
   listaProdutos.innerHTML = ''
   produtosSelecionados.forEach(produto => {
      listaProdutos.innerHTML += `
      <div class="produto__escolhido" data-key="${produto.id}">
         <div class="campo__imagem">
            <img class="produto__imagem" src="${produto.imagem}" alt="">
            </div>
            <div class="campo__nome">
            <h4 class="produto__nome">${produto.nome}</h4>
            </div>
            <div class="campo__preco">
            <p class="produto__preco"><strong>Preço: </strong>${produto.preco.toFixed(2)}</p>
            </div>
            <div class="produto__quantidade">
            <i class="fas fa-sort-up" id="btnMais"></i>
            <span class="produto__quantidade--escolhida" id="qntd-produto">${produto.quantidade}</span>
            <i class="fas fa-sort-down" id="btnMenos"></i>
         </div>
         <i class="far fa-trash-alt" id="btnRemove"></i>
      </div>
      `;
   });
}

montaListaProdutos();

const montaAside = (valorComDesconto) => {
   let produtos = getProdutos()
   let total = precoTotal(produtos).toFixed(2);
   if (valorComDesconto > 1) total = valorComDesconto;
   $('#total').innerHTML = `<strong>R$${total}</strong>`;
   $('#subtotal').innerHTML = `R$${total}`
   $('#qntdTotal').innerHTML = `Subtotal (${quantidadeTotal(produtos)} itens)`;
}

const quantidadeTotal = (produtos) => {
   return produtos.reduce((a, b) => a + b.quantidade, 0);
}

const precoTotal = (produtos) => {
   return produtos.reduce((a, b) => a + b.preco * b.quantidade, 0);
}

const btnMais = $$('#btnMais');
const btnMenos = $$('#btnMenos');
const btnRemove = $$('#btnRemove');
const inputCupom = $('#input-cupom');
const produtoQuantidade = $$('#qntd-produto');
const btnCupom = $('#btn-cupom');
const btnFinalizarCompra = $('#finalizar-compra');
const msgCompra = $('#msg-compra');
const campoMsgCompra = $('#campo-msg-compra');

const attQuantidadeMais = (key) => {
   produtoQuantidade.forEach(el => {
      if (el.closest('.produto__escolhido').getAttribute('data-key') == key)
         el.textContent++;
   })
   produtosSelecionados.map(el => {
      if (el.id == key) el.quantidade++
   })
}

const attQuantidadeMenos = (key) => {
   produtoQuantidade.forEach(el => {
      if (el.closest('.produto__escolhido').getAttribute('data-key') == key) {
         if (el.textContent == 1) return;
         el.textContent--;
      }
   })
   produtosSelecionados.map(el => {
      if (el.id == key && el.quantidade > 1)
         el.quantidade--
   })
}

const cupons = [
   {
      nome: 'UTFPR',
      desconto: 15
   },
   {
      nome: 'metaverso',
      desconto: 10
   },
];

const aplicaDesconto = (cupomIndex) => {
   const produtos = getProdutos();
   const valorTotal = precoTotal(produtos);
   const desconto = cupons[cupomIndex].desconto;
   const valorComDesconto = calculaDesconto(valorTotal, desconto);
   montaAside(valorComDesconto);
}

const calculaDesconto = (valorTotal, desconto) => {
   const valorDesconto = (valorTotal * desconto) / 100;
   return valorTotal - valorDesconto;
}

const validaInputCupom = () => {
   const msgErroCupom = $('.input-mensagem-erro');
   if (!validaCupom() && inputCupom.value.length > 0) {
      inputCupom.parentElement.classList.add('input-container--invalido');
      msgErroCupom.textContent = 'O cupom informado não existe.'
   } else {
      inputCupom.parentElement.classList.remove('input-container--invalido');
      msgErroCupom.textContent = ''
   }
}

const validaCupom = () => {
   let isValido = true;
   const cIndex = cupons.findIndex(cupom => cupom.nome == inputCupom.value);
   cIndex > -1 ? isValido : isValido = false;
   if (isValido) aplicaDesconto(cIndex);
   return isValido
}

const removerProduto = (e) => {
   e.closest('.produto__escolhido').classList.add('apagar');
   setTimeout(() => {
      e.closest('.produto__escolhido').remove();
      mostraCarrinhoVazio()
   }, 500);
}

const suspenderCompra = () => {
   msgCompra.innerHTML = 'É necessário fazer o login para realizar a compra!'
   campoMsgCompra.classList.add('compra__mensagem--pendente');
}

const finalizaCompra = () => {
   localStorage.removeItem('produtos');
   msgCompra.innerHTML = 'Seu pedido de compra foi gerado com sucesso!';
   campoMsgCompra.classList.add('compra__mensagem--finalizada');
   setTimeout(() => {
      document.location.reload(true);
      mostraCarrinhoVazio()
   }, 2000);

}

const temProdutosCarrinho = () => {
   if (produtosSelecionados.length < 1) return;
   verificaLogin();
}

const mostraCarrinhoVazio = () => {
   const produtos = getProdutos();
   if (produtos.length < 1) {
      $('.carrinho__vazio').classList.add('carrinho__vazio--ativo');
      $('aside').classList.remove('aside--ativo');
   } else {
      $('.carrinho__vazio').classList.remove('carrinho__vazio--ativo');
      $('aside').classList.add('aside--ativo');
   }
}

const verificaLogin = () => {
   if (produtosSelecionados.length < 1) return;
   if (getClientes('clientes').length === 0) suspenderCompra()
   const clientes = getClientes();
   clientes.forEach(el => {
      el.login === true ? finalizaCompra() : suspenderCompra();
   });
}

btnCupom.addEventListener('click', validaInputCupom);

btnRemove.forEach(el => {
   el.addEventListener('click', e => {
      key = e.target.closest('.produto__escolhido')
         .getAttribute('data-key');
      limpaItem(key)
      removerProduto(e.target);
      atualizaCarrinho();
      montaAside()
      validaCupom()
   })
});

btnMais.forEach(el => {
   el.addEventListener('click', e => {
      key = e.target.closest('.produto__escolhido')
         .getAttribute('data-key');
      addProdutoCarrinho(produtosSelecionados, key);
      attQuantidadeMais(key);
      montaAside();
      validaCupom();
   })
})

btnMenos.forEach(el => {
   el.addEventListener('click', e => {
      key = e.target.closest('.produto__escolhido')
         .getAttribute('data-key');
      removeProdutoCarrinho(produtosSelecionados, key);
      attQuantidadeMenos(key);
      montaAside();
      validaCupom();
   })
})

btnFinalizarCompra.addEventListener('click', temProdutosCarrinho);

montaAside()
mostraCarrinhoVazio()