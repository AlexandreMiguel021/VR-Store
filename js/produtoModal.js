const $$ = document.querySelectorAll.bind(document);

export function iniModal() {
   const produtoNome = $$('#nome');
   const produtoImg = $$('#imagem');
   const botaoFecharModal = $$('.modal--fechar');

   produtoNome.forEach(el => {
      el.addEventListener('click', event => {
         abreModal(event.target);
      });
   });

   produtoImg.forEach(el => {
      el.addEventListener('click', event => {
         abreModal(event.target);
      });
   });

   botaoFecharModal.forEach(el => {
      el.addEventListener('click', event => {
         fechaModal(event.target);
      });
   });

   function abreModal(event) {
      event.closest('.produto__card')
         .classList.add('modal--ativo');
   };

   function fechaModal(event) {
      event.closest('.produto__card')
         .classList.remove('modal--ativo');
   };
};


