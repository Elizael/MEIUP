
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

  const chavesEsperadas = [
    "NÚMERO DE INSCRIÇÃO", "DATA DE ABERTURA", "NOME EMPRESARIAL", 
    "TÍTULO DO ESTABELECIMENTO (NOME DE FANTASIA)", "PORTE",
    "CÓDIGO E DESCRIÇÃO DA ATIVIDADE ECONÔMICA PRINCIPAL",
    "CÓDIGO E DESCRIÇÃO DAS ATIVIDADES ECONÔMICAS SECUNDÁRIAS",
    "CÓDIGO E DESCRIÇÃO DA NATUREZA JURÍDICA", "LOGRADOURO", "NÚMERO",
    "COMPLEMENTO", "CEP", "BAIRRO/DISTRITO", "MUNICÍPIO", "UF",
    "ENDEREÇO ELETRÔNICO", "TELEFONE", "SITUAÇÃO CADASTRAL",
    "DATA DA SITUAÇÃO CADASTRAL", "MOTIVO DE SITUAÇÃO CADASTRAL",
    "SITUAÇÃO ESPECIAL", "DATA DA SITUAÇÃO ESPECIAL"
  ];

  const dados = {};
  let dataEmissao = "";
  let i = 0;
  while (i < linhas.length - 1) {
    const linha = linhas[i].toUpperCase();

    if (linha.startsWith("EMITIDO NO DIA")) {
      dataEmissao = linhas[i];
    }

    if (chavesEsperadas.includes(linha)) {
      if (linha === "CÓDIGO E DESCRIÇÃO DAS ATIVIDADES ECONÔMICAS SECUNDÁRIAS") {
        let atividades = [];
        let j = i + 1;
        while (j < linhas.length && !chavesEsperadas.includes(linhas[j].toUpperCase())) {
          atividades.push(linhas[j]);
          j++;
        }
        dados[linha] = atividades;
        i = j - 1;
      } else {
        dados[linha] = linhas[i + 1];
        i++;
      }
    }
    i++;
  }

  const renderCampo = (label) => {
    if (!dados[label]) return "";
    if (Array.isArray(dados[label])) {
      return `<p><strong>${label}:</strong><br><ul>` + dados[label].map(v => `<li>${v}</li>`).join("") + `</ul></p>`;
    }
    return `<p><strong>${label}:</strong> ${dados[label]}</p>`;
  };

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

    ${dataEmissao ? `<h3>🕓 Emissão</h3><p>${dataEmissao}</p>` : ""}
  `;

  document.getElementById('dadosProcessados').innerHTML = html;
});
