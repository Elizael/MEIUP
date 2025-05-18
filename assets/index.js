document.getElementById('root').innerHTML = `
  <div style="padding: 20px; font-family: sans-serif;">
    <h2>Consulta de CNPJ MEI</h2>
    <input id="cnpjInput" type="text" placeholder="Digite o CNPJ" style="width:100%;padding:10px;" />
    <button id="btnIniciar" style="margin-top:20px;width:100%;padding:12px;background-color:#1e90ff;color:white;border:none;border-radius:8px;">
      Iniciar
    </button>
    <p style="margin-top:20px;">Clique no botão para abrir o site da Receita Federal e consultar os dados do MEI.</p>
  </div>
`

document.getElementById('btnIniciar').addEventListener('click', () => {
  const cnpj = document.getElementById('cnpjInput').value;
  if (cnpj.length < 14) {
    alert('Digite um CNPJ válido.');
    return;
  }
  window.open("https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/cnpjreva_solicitacao.asp", "_blank");
});
