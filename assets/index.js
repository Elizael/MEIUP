
document.getElementById('root').innerHTML = `
  <div style="padding: 20px; font-family: sans-serif;">
    <h2>Consulta de CNPJ MEI</h2>
    <input id="cnpjInput" type="text" placeholder="Digite o CNPJ" style="width:100%;padding:10px;" />
    <button id="btnIniciar" style="margin-top:20px;width:100%;padding:12px;background-color:#1e90ff;color:white;border:none;border-radius:8px;">
      Iniciar
    </button>
    <p style="margin-top:20px;">Clique em "Iniciar" para abrir a Receita Federal. Após consultar, copie os dados da tela e cole abaixo.</p>
    <textarea id="resultadoRaw" placeholder="Cole aqui os dados copiados da Receita" style="width:100%;height:150px;padding:10px;margin-top:20px;"></textarea>
    <button id="btnProcessar" style="margin-top:10px;width:100%;padding:12px;background-color:#28a745;color:white;border:none;border-radius:8px;">
      Processar Dados
    </button>
    <div id="dadosProcessados" style="margin-top: 20px;"></div>
  </div>
`

document.getElementById('btnIniciar').addEventListener('click', () => {
  const cnpj = document.getElementById('cnpjInput').value;
  if (cnpj.length < 14) {
    alert("Digite um CNPJ válido.");
    return;
  }
  window.open("https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/cnpjreva_solicitacao.asp", "_blank");
});

document.getElementById('btnProcessar').addEventListener('click', () => {
  const raw = document.getElementById('resultadoRaw').value;
  const linhas = raw.split(/\n|\r/).map(l => l.trim()).filter(l => l.length > 0);
  const dados = {};
  for (let i = 0; i < linhas.length; i++) {
    if (linhas[i].includes(":")) {
      const partes = linhas[i].split(":");
      const chave = partes[0].trim();
      const valor = partes.slice(1).join(":").trim();
      dados[chave] = valor;
    }
  }

  const renderCampo = (label) => dados[label] ? `<p><strong>${label}:</strong> ${dados[label]}</p>` : "";

  let html = `
    <h3>📄 Dados Cadastrais</h3>
    ${renderCampo("NÚMERO DE INSCRIÇÃO")}
    ${renderCampo("DATA DE ABERTURA")}
    ${renderCampo("NOME EMPRESARIAL")}
    ${renderCampo("TÍTULO DO ESTABELECIMENTO (NOME DE FANTASIA)")}
    ${renderCampo("PORTE")}

    <h3>🏢 Atividades</h3>
    ${renderCampo("CÓDIGO E DESCRIÇÃO DA ATIVIDADE ECONÔMICA PRINCIPAL")}
    ${renderCampo("CÓDIGO E DESCRIÇÃO DAS ATIVIDADES ECONÔMICAS SECUNDÁRIAS")}
    ${renderCampo("CÓDIGO E DESCRIÇÃO DA NATUREZA JURÍDICA")}

    <h3>📍 Endereço</h3>
    ${renderCampo("LOGRADOURO")} ${renderCampo("NÚMERO")}
    ${renderCampo("COMPLEMENTO")}
    ${renderCampo("CEP")}
    ${renderCampo("BAIRRO/DISTRITO")}
    ${renderCampo("MUNICÍPIO")} - ${dados["UF"] || ""}

    <h3>📞 Contato</h3>
    ${renderCampo("ENDEREÇO ELETRÔNICO")}
    ${renderCampo("TELEFONE")}

    <h3>📌 Situação</h3>
    ${renderCampo("SITUAÇÃO CADASTRAL")}
    ${renderCampo("DATA DA SITUAÇÃO CADASTRAL")}
    ${renderCampo("MOTIVO DE SITUAÇÃO CADASTRAL")}
    ${renderCampo("SITUAÇÃO ESPECIAL")}
    ${renderCampo("DATA DA SITUAÇÃO ESPECIAL")}
  `;

  document.getElementById('dadosProcessados').innerHTML = html;
});
