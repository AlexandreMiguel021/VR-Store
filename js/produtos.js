import { iniModal } from "./produtoModal.js";
import { addProdutoCarrinho } from "./carrinho.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const containerProdutos = $('#container-produtos');
const nomeAsc = $('#nome-asc');
const nomeDesc = $('#nome-desc');
const precoAsc = $('#preco-asc');
const precoDesc = $('#preco-desc');

nomeAsc.addEventListener('click', ordenarNomeAsc);
nomeDesc.addEventListener('click', ordenarNomeDesc);
precoAsc.addEventListener('click', ordenarPrecoAsc);
precoDesc.addEventListener('click', ordenarPrecoDesc);

const inicializarLoja = produtos => {
   containerProdutos.innerHTML = '';
   produtos.map((produto, key) => {
      containerProdutos.innerHTML += montaLoja(produto, key);
   });
   iniModal();
   botaoComprar()
};

function criaModalAddCarrinho() {
   $('.produto-add').classList.add('produto-add--ativo');
   setTimeout(() => {
      $('.produto-add').classList.remove('produto-add--ativo');
   }, 1500);
}

function ordenarNomeAsc() {
   produtos.sort(function (a, b) {
      if (a.nome < b.nome) {
         return -1;
      } else {
         return true;
      }
   });
   inicializarLoja(produtos);
}

function ordenarNomeDesc() {
   produtos.sort(function (a, b) {
      if (a.nome > b.nome) {
         return -1;
      } else {
         return true;
      }
   });
   inicializarLoja(produtos);
};

function ordenarPrecoAsc() {
   produtos.sort(function (a, b) {
      if (a.preco < b.preco) {
         return -1;
      } else {
         return true;
      }
   });
   inicializarLoja(produtos);
};

function ordenarPrecoDesc() {
   produtos.sort(function (a, b) {
      if (a.preco > b.preco) {
         return -1;
      } else {
         return true;
      }
   });
   inicializarLoja(produtos);
};

function montaLoja(produto) {
   return `
   <div class="produto__card" data-key="${produto.id}" >
      <div class="img">
         <img class="produto__imagem" id="imagem" src="${produto.imagem}" alt="Valve index kit">
      </div>
      <h4 class="produto__nome" id="nome">${produto.nome}</h4>
      <p class="produto__preco">R$${produto.preco.toFixed(2)}</p>
      <a class="produto__comprar" href="#" id="comprar">Comprar</a>
      <div class="modal">
      <div><p class="modal__descricao"><strong>Descrição: </strong>${produto.descricao}</p>
      <p class="modal__descricao"><strong>Marca: </strong>${produto.marca}</p>
      <p class="modal__descricao"><strong>Cor: </strong>${produto.cor}</p>
      <p class="modal__descricao"><strong>Peso: </strong>${produto.peso}</p></div>
      <div class="modal--fechar">Ocultar mais informações<div>
  </div>
   </div>
   `;
};

function botaoComprar() {
   const btnComprar = $$('#comprar');
   btnComprar.forEach(el => {
      el.addEventListener('click', e => {
         e.preventDefault();
         let key = 0;
         key = e.target.closest('.produto__card')
            .getAttribute('data-key');
         addProdutoCarrinho(produtos, key);
         criaModalAddCarrinho()
      });
   });
}


inicializarLoja(produtos);

