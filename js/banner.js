import { atualizaCarrinho } from "./carrinho.js";
atualizaCarrinho();

const time = 4000;
let currentImagemIndex = 0;
const imagens = document.querySelectorAll('[imagem]');
const max = imagens.length;

function proxImagem() {
   removeClass();
   currentImagemIndex++;
   if(currentImagemIndex >= max) currentImagemIndex = 0;
   imagens[currentImagemIndex].classList.add('selected');
}

function iniciar() {
   setInterval(() => {
      proxImagem();
   }, time);
}

function removeClass(){
   imagens[currentImagemIndex].classList.remove('selected');
}

window.addEventListener('load', iniciar());

