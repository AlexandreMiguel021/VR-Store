let clientes = [];

const getClientes = () => {
   return JSON.parse(localStorage.getItem('clientes')) ?? [];
}

const setClientes = (clientes) => {
   localStorage.setItem('clientes', JSON.stringify(clientes))
}

