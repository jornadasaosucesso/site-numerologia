Papa.parse("dados/arcanos_completos_alma.csv", {
  download: true,
  header: true,
  complete: function(arcanosResult) {
    const arcanos = arcanosResult.data;

    Papa.parse("dados/analise_numerologica_alma.csv", {
      download: true,
      header: true,
      complete: function(numerologiaResult) {
        const numerologia = numerologiaResult.data;

        const resultadoFundido = numerologia.map(n => {
          const arcano = arcanos.find(a => parseInt(a.Arca) === parseInt(n.Numero));
          return {
            Numero: n.Numero,
            Vibracao: n.Vibracao,
            Ego: n.Ego,
            Aparencia: n.Aparencia,
            Missao: n.Missao,
            Herancas: n.Herancas,
            Harmonia: n.Harmonia,
            Nome: arcano?.Nome || "",
            Significado: arcano?.Significado || "",
            Habilidades: arcano?.Habilidades || "",
            "Descrição dos Dons": arcano?.["Descrição dos Dons"] || "",
            Barreiras: arcano?.Barreiras || "",
            Potenciais: arcano?.Potenciais || ""
          };
        });

        console.log("Resultado das Almas:", resultadoFundido);

        // Se quiser gerar CSV em string:
        const csvFinal = Papa.unparse(resultadoFundido);
        baixarCSV("resultado_das_almas.csv", csvFinal);

      }
    });
  }
});
function baixarCSV(nomeArquivo, conteudoCSV) {
  const blob = new Blob([conteudoCSV], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.setAttribute("href", URL.createObjectURL(blob));
  link.setAttribute("download", nomeArquivo);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}