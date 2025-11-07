// Obtém o ID do arcano da URL
const urlParams = new URLSearchParams(window.location.search);
const id = parseInt(urlParams.get("id"));
console.log("🔍 ID recebido da URL:", id);

// Função para falar o texto
function falarTexto(texto) {
  console.log("🔊 Texto para falar:", texto);
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = "pt-BR";
  fala.rate = 1;
  fala.pitch = 1;
  speechSynthesis.speak(fala);
}

// Carrega os dados técnicos do arcano
fetch("arcanos_completos_alma.csv")
  .then((response) => {
    console.log("📦 CSV carregado com sucesso");
    return response.text();
  })
  .then((csv) => {
    const resultado = Papa.parse(csv, { header: true });
    console.log("📊 Dados parseados:", resultado.data);

    const linha = resultado.data.find((l) => parseInt(l.Arca) === id);
    console.log("🔎 Linha encontrada:", linha);

    if (!linha) {
      console.warn("⚠️ Nenhum arcano encontrado com esse ID");
      document.getElementById("conteudo").innerHTML = `
        <h2>⚠️ Arcano não encontrado</h2>
        <p>Verifique se o ID está correto ou se o arquivo arcanos_completos.csv contém os dados necessários.</p>
      `;
      return;
    }

    const arcano = {
      ...linha,
      branco1: linha.branco1.split(";").map((h) => h.trim()),
      branco2: linha.branco2.split(";").map((h) => h.trim()),
      branco3: linha.branco3.split(";").map((h) => h.trim()),
      Habilidades: linha.Habilidades.split(";").map((h) => h.trim()),
      Barreiras: linha.Barreiras.split(";").map((b) => b.trim()),
      Potenciais: linha.Potenciais.split(";").map((p) => p.trim()),
      Dons: linha["Descrição dos Dons"]
    };
    console.log("🧠 Arcano estruturado:", arcano);

    // Carrega a narrativa poética separada
    fetch("narrativas.csv")
      .then((response) => {
        console.log("📜 Narrativas carregadas");
        return response.text();
      })
      .then((csvNarrativas) => {
        const narrativas = Papa.parse(csvNarrativas, { header: true });
        const narrativa = narrativas.data.find((n) => parseInt(n.Arcano) === id);
        const textoNarrativo = narrativa?.Narrativa || arcano.Dons;
        console.log("📝 Texto narrativo:", textoNarrativo);

        document.getElementById("audio").innerHTML = `
          <div class="botoes-narrativa">
              <button onclick="falarTexto(\`${textoNarrativo}\`)">🔊 Ouvir Narrativa</button>
              <button onclick="window.location.href='index.html'">🔙 Voltar</button>
          </div>
        `;
      });

    // Monta o HTML do arcano
    const html = `
      <h1>🔢 Arcano ${arcano.Arca} – ${arcano.Nome}</h1>
      <img src="imagens/arca${arcano.Arca}.png" alt="Imagem do Arcano ${arcano.Arca}" class="imagem-arcano">      <h2>🌟 Significado</h2>
      <p>${arcano.Significado}</p>
      <h2>🎁 branco1</h2>
      <ul>${arcano.branco1.map((h) => `<li>${h}</li>`).join("")}</ul>
      <h2>🎁 barnco2</h2>
      <ul>${arcano.branco2.map((h) => `<li>${h}</li>`).join("")}</ul>
      <h2>🎁 branco3</h2>
      <ul>${arcano.branco3.map((h) => `<li>${h}</li>`).join("")}</ul>
      <h2>🎁 Habilidades</h2>
      <ul>${arcano.Habilidades.map((h) => `<li>${h}</li>`).join("")}</ul>
      <h2>✨ Dons</h2>
      <p>${arcano.Dons}</p>
      <h2>🚧 Barreiras</h2>
      <ul>${arcano.Barreiras.map((b) => `<li>${b}</li>`).join("")}</ul>
      <h2>🌱 Potenciais</h2>
      <ul>${arcano.Potenciais.map((p) => `<li>${p}</li>`).join("")}</ul>
      <div class="reflexao">
        <h2>🪞 Espaço de Reflexão</h2>
        <p>Como você tem vivido seus dons ultimamente?</p>
        <p>Que barreira você reconhece com mais força?</p>
        <p>O que seu coração pede hoje?</p>
      </div>
    `;
    document.getElementById("conteudo").innerHTML = html;
  })
  .catch((error) => {
    console.error("❌ Erro ao carregar os dados:", error);
    document.getElementById("conteudo").innerHTML = `
      <h2>❌ Erro ao carregar os dados</h2>
      <p>${error.message}</p>
      <p>Verifique se os arquivos <strong>arcanos_completos.csv</strong> e <strong>narrativas.csv</strong> estão na pasta correta e bem formatados.</p>
    `;
  });

 //*<figcaption>Iniciador</figcaption>*