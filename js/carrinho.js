const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const btnComprar = $$('#comprar');

btnComprar.forEach(el => {
   el.addEventListener('click', e => {
      e.preventDefault();
      let key = 0;
      key = e.target.closest('.produto__card')
         .getAttribute('data-key');
      addProdutoCarrinho(produtos, key);
      console.log('ss');
   });
});

export const addProdutoCarrinho = (produtosSelecionados, key) => {
   let produtosCarrinho = getProdutos('produtosCarrinho');
   const produtoIndex = produtosCarrinho.findIndex(item => item.id == key);
   if (produtoIndex > -1) {
      produtosCarrinho[produtoIndex].quantidade++;
   } else {
      produtosSelecionados.forEach(produto => {
         if (produto.id == key) produtosCarrinho.push(produto);
      });
   }
   setProdutos(produtosCarrinho);
   atualizaCarrinho(produtosCarrinho);
}

export const removeProdutoCarrinho = (produtosSelecionados, key) => {
   let produtosCarrinho = getProdutos('produtosCarrinho');
   const produtoIndex = produtosCarrinho.findIndex(item => item.id == key);
   if (produtoIndex > -1) {
      if (produtosCarrinho[produtoIndex].quantidade == 1) return;
      produtosCarrinho[produtoIndex].quantidade--;
   } else {
      produtosSelecionados.forEach(produto => {
         if (produto.id == key) produtosCarrinho.remove(produto);
      });
   }
   setProdutos(produtosCarrinho);
   atualizaCarrinho(produtosCarrinho);
}

export const atualizaCarrinho = (produtos) => {
   const carrinhoQntd = $$('.cart__quantidade');
   produtos = getProdutos('produtos');
   let quantidadeProdutos = + produtos.reduce((a, b) => a + b.quantidade, 0);
   carrinhoQntd.forEach(el => el.innerHTML = quantidadeProdutos);
}

export const limpaItem = (key) => {
   let produtosCarrinho = getProdutos('produtosCarrinho');
   let produtoIndex = produtosCarrinho.findIndex(item => item.id == key);
   produtosCarrinho.splice(produtoIndex, 1);
   setProdutos(produtosCarrinho);
}

atualizaCarrinho();



