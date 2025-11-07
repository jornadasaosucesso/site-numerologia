document.addEventListener("DOMContentLoaded", () => {
  const nome = localStorage.getItem("nome")?.toUpperCase() || "";
  const data = localStorage.getItem("data_nascimento") || "";

  if (!nome || !data) {
    alert("Dados não encontrados. Volte e preencha os campos.");
    return;
  }

  // 🔢 Funções de cálculo
  function reduzir(n) {
    while (n > 9 && ![11, 22].includes(n)) {
      n = [...String(n)].reduce((acc, d) => acc + parseInt(d), 0);
    }
    return n;
  }

  function calcularNumero(letras) {
    const tabela = {
      A:1,J:1,S:1, B:2,K:2,T:2, C:3,L:3,U:3, D:4,M:4,V:4,
      E:5,N:5,W:5, F:6,O:6,X:6, G:7,P:7,Y:7, H:8,Q:8,Z:8, I:9,R:9
    };
    const numeros = letras.split("").map(l => tabela[l] || 0);
    return reduzir(numeros.reduce((a,b) => a+b, 0));
  }

  function separarVogaisConsoantes(nome) {
    const vogais = "AEIOU";
    const letras = nome.replace(/[^A-Z]/g, "");
    const v = [...letras].filter(l => vogais.includes(l)).join("");
    const c = [...letras].filter(l => !vogais.includes(l)).join("");
    return [v, c];
  }

  function calcularPotencial(data) {
    const soma = [...data].filter(d => /\d/.test(d)).reduce((acc, d) => acc + parseInt(d), 0);
    return reduzir(soma);
  }

  function calcularAprendizado(dia) {
    return reduzir([...String(dia)].reduce((a,b) => a + parseInt(b), 0));
  }

  function calcularCompromisso(expressao, potencial) {
    return reduzir(expressao + potencial);
  }

  function calcularAbertura(data) {
    const [d, m] = data.split("/").map(Number);
    return reduzir(Math.abs(m - d));
  }

  function calcularLiberdade(data) {
    const [d,,a] = data.split("/").map(Number);
    return reduzir(Math.abs(a - d));
  }

  function calcularSabedoria(data) {
    const [,m,a] = data.split("/").map(Number);
    return reduzir(Math.abs(a - m));
  }

  function calcularDesafio(abertura, liberdade) {
    const dif = Math.abs(abertura - liberdade);
    return dif === 0 ? reduzir(abertura + liberdade) : reduzir(dif);
  }

  // 📊 Cálculos principais
  const [vogais, consoantes] = separarVogaisConsoantes(nome);
  const num_ego = calcularNumero(vogais);
  const num_aparencia = calcularNumero(consoantes);
  const num_missao = calcularNumero(vogais + consoantes);
  const potencial = calcularPotencial(data);
  const dia = parseInt(data.split("/")[0]);
  const aprendizado = calcularAprendizado(dia);
  const compromisso = calcularCompromisso(num_missao, potencial);
  const abertura = calcularAbertura(data);
  const liberdade = calcularLiberdade(data);
  const sabedoria = calcularSabedoria(data);
  const desafio = calcularDesafio(abertura, liberdade);

  // 🎵 Trilha sonora por número
  const trilhasPorNumero = {
    1: "sons/iniciador.mp3",
    2: "sons/sensitivo.mp3",
    3: "sons/comunicador.mp3",
    4: "sons/construtor.mp3",
    5: "sons/explorador.mp3",
    6: "sons/harmonizador.mp3",
    7: "sons/mistico.mp3",
    8: "sons/realizador.mp3",
    9: "sons/humanitario.mp3"
  };

  const trilha = trilhasPorNumero[num_missao];
  const audio = new Audio(trilha);
  audio.loop = true;
  audio.volume = 0.5;

  document.addEventListener("click", () => {
    audio.play();
  }, { once: true });

  // 🔁 Variável global para resumo
  let campos = [];

  // 📁 Carregar CSV
  Papa.parse("dados/resultado_das_almas.csv", {
    download: true,
    header: true,
    complete: function(results) {
      const dados = results.data;
      console.log("📁 CSV carregado com sucesso:");
      console.table(dados);

      function buscarDescricao(numero, campo) {
        const linha = dados.find(d => reduzir(parseInt(d.numero)) === numero);
        return linha ? linha[campo] : "Informação não encontrada.";
      }

      campos = [
        { id: "nome", titulo: "ARCANO", valor: num_missao, descricao: buscarDescricao(num_missao, "nome") },
        { id: "significado", titulo: "SIGNIFICADO", valor: num_missao, descricao: buscarDescricao(num_missao, "significado") },
        { id: "alma", titulo: "ALMA", valor: num_ego, descricao: buscarDescricao(num_ego, "alma") },
        { id: "aparencia", titulo: "APARÊNCIA", valor: num_aparencia, descricao: buscarDescricao(num_aparencia, "aparencia") },
        { id: "missao", titulo: "MISSÃO", valor: num_missao, descricao: buscarDescricao(num_missao, "missao") },
        { id: "dons_potencial", titulo: "DONS/POTENCIAL", valor: potencial, descricao: buscarDescricao(potencial, "dons_potencial") },
        { id: "aprendizado", titulo: "APRENDIZADO", valor: aprendizado, descricao: buscarDescricao(aprendizado, "aprendizado") },
        { id: "compromisso", titulo: "COMPROMISSO", valor: compromisso, descricao: buscarDescricao(compromisso, "compromisso") },
        { id: "desafio_principal", titulo: "DESAFIO - ENTREGA", valor: desafio, descricao: buscarDescricao(desafio, "desafio_principal") },
        { id: "Abertura_emocional", titulo: "ABERTURA", valor: abertura, descricao: buscarDescricao(abertura, "Abertura_emocional") },
        { id: "Liberdade", titulo: "LIBERDADE", valor: liberdade, descricao: buscarDescricao(liberdade, "Liberdade") },
        { id: "Sabedoria_doadora", titulo: "SABEDORIA", valor: sabedoria, descricao: buscarDescricao(sabedoria, "Sabedoria_doadora") },
        { id: "Herancas", titulo: "HERANÇAS", valor: num_missao, descricao: buscarDescricao(num_missao, "Herancas") },
        { id: "Harmonia", titulo: "HARMONIA", valor: num_missao, descricao: buscarDescricao(num_missao, "Harmonia") },
        { id: "Vibracao", titulo: "VIBRAÇÃO", valor: num_missao, descricao: buscarDescricao(num_missao, "Vibracao") },
      ];

      campos.forEach(campo => {
        const el = document.getElementById(campo.id);
        if (el) {
          el.textContent = campo.valor;
          el.parentElement.querySelector(".titulo").textContent = campo.titulo;
          const botao = el.closest(".botao-resultado");
          if (botao) {
            botao.addEventListener("click", () => {
              abrirModal(campo.titulo, campo.descricao);
            });
          }
        }
      });

      // Diagnóstico de elementos HTML
      console.log("🔍 Verificando elementos HTML:");
      campos.forEach(campo => {
        const el = document.getElementById(campo.id);
        if (!el) {
          console.warn(`⚠️ Elemento com id="${campo.id}" não encontrado no HTML.`);
        } else {
          console.log(`✅ Elemento "${campo.id}" encontrado. Valor atribuído: ${campo.valor}`);
        }
      });
    },
    error: function(err) {
      console.error("❌ Erro ao carregar CSV:", err);
    }
  });

  // 🪟 Modal interativo
  function abrirModal(titulo, texto) {
    document.getElementById("modalTitulo").textContent = titulo;
    document.getElementById("modalTexto").innerHTML = texto;
    document.getElementById("modal").style.display = "block";
  }

 document.getElementById("fecharModal").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
  });

  // ⬅️ Botão Voltar
  window.voltar = function() {
    window.location.href = "index.html"; // ajuste conforme sua página de origem
  };

  // 📋 Ver Resumo
  window.verResumo = function() {
    let resumo = "<h2>Resumo da Jornada da Alma</h2><ul>";
    campos.forEach(campo => {
      resumo += `<li><strong>${campo.titulo} (${campo.valor}):</strong> ${campo.descricao}</li>`;
    });
    resumo += "</ul>";
    abrirModal("Resumo da Jornada", resumo);
  };
}); // 👈 fechamento final do DOMContentLoaded
