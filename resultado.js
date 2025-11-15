document.addEventListener("DOMContentLoaded", () => {
    const nomeRaw = localStorage.getItem("nome") || "";
    const nome = nomeRaw.toUpperCase();

    // --- CORREÇÃO DE FORMATO DE DATA ---
    let data = localStorage.getItem("data_nascimento") || "";
    if (/^\d{8}$/.test(data)) {
        data = data.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    }
    console.log("📅 Data formatada:", data);

    // === FUNÇÕES AUXILIARES DE NUMEROLOGIA ===
    function reduzir(n, forcarReducaoPura = false) { // Adicionamos um novo parâmetro
        if (!Number.isFinite(n)) return 0;
        
        let shouldStop = !forcarReducaoPura && [11, 22].includes(n);

        while (n > 9 && !shouldStop) {
            n = String(n).split("").reduce((acc, d) => acc + parseInt(d || 0, 10), 0);
            
            // Re-checa se deve parar após a redução
            shouldStop = !forcarReducaoPura && [11, 22].includes(n);
        }
        
        // No caso do 11+11=22, ele para aqui e retorna 22.
        // Se for 22+10=32, ele reduz para 5.
        // Se for forcarReducaoPura=true, ele reduz 11->2, 22->4.
        
        // Se após o while, o número ainda for 11 ou 22 E a redução pura for ativada, reduza-o.
        if (forcarReducaoPura && (n === 11 || n === 22)) {
            n = String(n).split("").reduce((acc, d) => acc + parseInt(d || 0, 10), 0); // 11->2, 22->4
        }
        
        return n;
    }

    const tabela = {
        A: 1, J: 1, S: 1, B: 2, K: 2, T: 2, C: 3, L: 3, U: 3,
        D: 4, M: 4, V: 6, E: 5, N: 5, W: 5, F: 6, O: 6, X: 6,
        G: 7, P: 7, Y: 7, H: 8, Q: 8, Z: 8, I: 9, R: 9
    };

    function calcularNumero(letras) {
        letras = (letras || "").toUpperCase().replace(/[^A-Z]/g, "");
        const soma = letras.split("").reduce((acc, ch) => acc + (tabela[ch] || 0), 0);
        return reduzir(soma);
    }

    function separarVogaisConsoantes(nomeStr) {
        const vogais = "AEIOU";
        const letras = (nomeStr || "").toUpperCase().replace(/[^A-Z]/g, "");
        const v = [...letras].filter(l => vogais.includes(l)).join("");
        const c = [...letras].filter(l => !vogais.includes(l)).join("");
        return [v, c];
    }

    function somaData(dataStr) {
        return [...(dataStr || "")].filter(ch => /\d/.test(ch)).reduce((a, ch) => a + parseInt(ch, 10), 0);
    }
    
    // Função auxiliar para obter D, M, A reduzidos
    // NOVO CÓDIGO AUXILIAR PARA CORREÇÃO DO ERRO:
    function obterDMAReduzidos(dataStr) {
        const partes = (dataStr || "").split("/").map(Number);
        
        // 1. Reduz o Dia (D)
        const d = partes[0] ? reduzir(partes[0]) : 0;
        
        // 2. Reduz o Mês (M)
        const m = partes[1] ? reduzir(partes[1]) : 0;
        
        // 3. Soma os dígitos do Ano (ex: 2025 -> 9), e depois Reduz o total (A)
        const anoRaw = partes[2] ? partes[2] : 0;
        const a = reduzir(String(anoRaw).split("").reduce((acc, digit) => acc + parseInt(digit, 10), 0));
        
        return { d, m, a };
    }

    function calcularArcano(dataStr) { return reduzir(somaData(dataStr)); }
    function calcularPotencial(dataStr) { return reduzir(somaData(dataStr)); }
    function calcularAprendizado(dia) { return reduzir(String(dia).split("").reduce((a, b) => a + parseInt(b || 0, 10), 0)); }
    function calcularCompromisso(expressao, potencial) { return reduzir(expressao + potencial); }


    // === FUNÇÕES DOS DESAFIOS (CORRIGIDAS) ===

// D1: Desafio Mês - Dia
    function calcularDesafio1(dataStr) {
        const partes = (dataStr || "").split("/");
        const dRaw = partes[0] ? parseInt(partes[0]) : 0;
        const mRaw = partes[1] ? parseInt(partes[1]) : 0;
        
        const d = reduzir(dRaw, true); // <--- FORÇANDO REDUÇÃO PURA (22 -> 4)
        const m = reduzir(mRaw, true); // <--- FORÇANDO REDUÇÃO PURA (11 -> 2)
        
        return Math.abs(m - d); // RESULTADO FINAL: |2 - 4| = 2
    }

    // D2: Desafio Dia - Ano
    function calcularDesafio2(dataStr) {
        const partes = (dataStr || "").split("/");
        const dRaw = partes[0] ? parseInt(partes[0]) : 0;
        const aRaw = partes[2] ? partes[2] : "0";

        const d = reduzir(dRaw, true); // <--- FORÇANDO REDUÇÃO PURA (22 -> 4)
        // O Ano (A) já estava reduzindo para 9, mas vamos garantir:
        const a = reduzir(somaData(aRaw), true); // <--- FORÇANDO REDUÇÃO PURA (2025 -> 9)
        
        return Math.abs(d - a); // RESULTADO FINAL: |4 - 9| = 5
    }

    // D4: Desafio Mês - Ano
    function calcularDesafio4(dataStr) {
        const partes = (dataStr || "").split("/");
        const mRaw = partes[1] ? parseInt(partes[1]) : 0;
        const aRaw = partes[2] ? partes[2] : "0";

        const m = reduzir(mRaw, true); // <--- FORÇANDO REDUÇÃO PURA (11 -> 2)
        const a = reduzir(somaData(aRaw), true); // <--- FORÇANDO REDUÇÃO PURA (2025 -> 9)
        
        return Math.abs(m - a); // RESULTADO FINAL: |2 - 9| = 7
    }

    // D3: Desafio Principal (D1 - D2)
    function calcularDesafioPrincipal(D1, D2) {
        // Usa o resultado 0-8 do D1 e D2
        return Math.abs(D1 - D2); // Pitagórico Puro (3)
    }

    let campos = [];
    let dadosNumerologia = [];
    let dadosDiaNatal = [];

    // === FUNÇÃO PARA CARREGAR CSV (Promisified) ===
    function carregarCSV(caminho) {
        // ... (restante da função carregarCSV)
        return new Promise((resolve, reject) => {
            Papa.parse(caminho, {
                download: true,
                header: true,
                skipEmptyLines: true,
                complete: (results) => resolve(results.data),
                error: (err) => reject(err)
            });
        });
    }

    // === FUNÇÃO SÍNCRONA PARA BUSCA NO CSV DIA NATAL ===
    function buscarDiaNatal(dia) {
        const linha = dadosDiaNatal.find(row => parseInt(row.numero, 10) === dia);
        if (linha) {
            return `${linha.perfil}${linha.natureza}<br><strong>🚀 Impulsos para o Sucesso</strong><br>${linha.impulsos}`;
        }
        return "Informação não encontrada.";
    }

    // === INICIA CARREGAMENTO PARALELO DOS CSVs ===
    Promise.all([
        carregarCSV("dados/resultado_numerologia.csv"),
        carregarCSV("dados/dia_natal.csv")
    ])
    
    .then(([numerologia, diaNatal]) => {
        // Armazena os dados carregados
        dadosNumerologia = numerologia;
        dadosDiaNatal = diaNatal;

        // Função para buscar descrição no CSV principal
        function buscarDescricao(numero, campo) {
            const linha = dadosNumerologia.find(row => {
                const n = parseInt(row.numero, 10);
                // A busca precisa ser ajustada para o Desafio 0-8. 
                // Se o CSV só tem 1-9, o Desafio 0 e 9 não serão encontrados
                return !isNaN(n) && (n === numero || reduzir(n) === numero);
            });
            return linha ? (linha[campo] || "Informação não encontrada.") : "Informação não encontrada.";
        }

        // === CÁLCULOS PRINCIPAIS ===
        const [vogais, consoantes] = separarVogaisConsoantes(nome);
        // Não utilizado: const num_arcano = calcularArcano(data);
        const num_ego = calcularNumero(vogais);
        const num_aparencia = calcularNumero(consoantes);
        const num_missao = calcularNumero(vogais + consoantes);
        const potencial = calcularPotencial(data);
        const dia = parseInt((data || "").split("/")[0], 10) || 0;
        const aprendizado = calcularAprendizado(dia);
        const compromisso = calcularCompromisso(num_missao, potencial);
        

        // --- LOGS DE DIAGNÓSTICO ---
        const d_log = reduzir(parseInt((data || "").split("/")[0], 10) || 0); // Dia Reduzido (4)
        const m_log = reduzir(parseInt((data || "").split("/")[1], 10) || 0); // Mês Reduzido (2)
        const a_log = reduzir(somaData((data || "").split("/")[2] || "0")); // Ano Reduzido (9)
        
        console.log(`[DEBUG DESAFIO] D, M, A Reduzidos (Esperado: 4, 2, 9): ${d_log}, ${m_log}, ${a_log}`);
        console.log(`[DEBUG DESAFIO] D1 |M-D| = |${m_log}-${d_log}| = ${Math.abs(m_log - d_log)} (Esperado: 2)`);
        console.log(`[DEBUG DESAFIO] D2 |D-A| = |${d_log}-${a_log}| = ${Math.abs(d_log - a_log)} (Esperado: 5)`);
        console.log(`[DEBUG DESAFIO] D4 |M-A| = |${m_log}-${a_log}| = ${Math.abs(m_log - a_log)} (Esperado: 7)`);
        // -----------------------------

        // CORREÇÃO AQUI: Chamando as novas funções de Desafio 1, 2 e 4.
        // NOVO CÁLCULO DOS DESAFIOS:
        const desafio_abertura = calcularDesafio1(data);  // D1 -> 2
        const desafio_liberdade = calcularDesafio2(data); // D2 -> 5
        const desafio_sabedoria = calcularDesafio4(data); // D4 -> 7

        // CÁLCULO DO D3 usando D1 e D2
        const desafio_entrega = calcularDesafioPrincipal(desafio_abertura, desafio_liberdade); // D3 -> 3
        
        const potencia_combinada = 3;


        
        // Busca a descrição do dia natal agora de forma síncrona
        const descricaoEuSou = buscarDiaNatal(dia);

        // CORREÇÃO AQUI: Atualizando os IDs e valores nos campos
        campos = [
            { id: "eu_sou", titulo: "EU SOU", valor: dia, descricao: descricaoEuSou },
            { id: "aprendizado", titulo: "APRENDIZADO", valor: aprendizado, descricao: buscarDescricao(aprendizado, "aprendizado") },
            { id: "dons", titulo: "DONS  POTENCIAL", valor: potencial, descricao: buscarDescricao(potencial, "dons_potencial") },
            { id: "desafio_abertura", titulo: "DESAFIO ABERTURA", valor: desafio_abertura, descricao: buscarDescricao(desafio_abertura, "desafio_abertura") }, // D1
            { id: "desafio_liberdade", titulo: "DESAFIO LIBERDADE", valor: desafio_liberdade, descricao: buscarDescricao(desafio_liberdade, "desafio_liberdade") }, // D2
            { id: "desafio_entrega", titulo: "DESAFIO ENTREGA", valor: desafio_entrega, descricao: buscarDescricao(desafio_entrega, "desafio_entrega") }, // D3
            { id: "desafio_sabedoria", titulo: "DESAFIO SABEDORIA", valor: desafio_sabedoria, descricao: buscarDescricao(desafio_sabedoria, "desafio_sabedoria") }, // D4
            { id: "potencia", titulo: "POTÊNCIA", valor: potencia_combinada, descricao: buscarDescricao(potencia_combinada, "potencia") },
            { id: "alma", titulo: "ALMA", valor: num_ego, descricao: buscarDescricao(num_ego, "alma") },
            { id: "aparencia", titulo: "APARÊNCIA", valor: num_aparencia, descricao: buscarDescricao(num_aparencia, "aparencia") },
            { id: "missao", titulo: "EXPRESSÃO", valor: num_missao, descricao: buscarDescricao(num_missao, "missao") },
            { id: "compromisso", titulo: "COMPROMISSO", valor: compromisso, descricao: buscarDescricao(compromisso, "compromisso") }
        ];

        // === RENDERIZAÇÃO DOS DADOS NA TELA ===
        // ... (restante do código de renderização e modais)

        campos.forEach(c => {
            const el = document.getElementById(c.id);
            if (!el) return;
            el.textContent = c.valor;
            const botao = el.closest(".botao-resultado");
            if (botao) {
                botao.style.cursor = "pointer";
                botao.onclick = () => abrirDetalhe(c);
            }
        });

    })
    .catch(err => {
        console.error("❌ Erro ao carregar CSVs. Verifique os caminhos e a biblioteca Papa Parse.", err);
        // Implementar feedback visual de erro ao usuário aqui
    });

    // === MODAL DETALHE ===
    function abrirDetalhe(campo) {
        // Assume que 'bootstrap' está carregado globalmente
        document.getElementById("resumoTexto").innerHTML = destacarResumoComAlerta(campo.descricao);
        new bootstrap.Modal(document.getElementById("modalResumo")).show();
    }

    function getEmoji(titulo) {
        switch (titulo) {
            case "EU SOU": return "🧬";
            case "APRENDIZADO": return "📘";
            case "DONS/POTENCIAL": return "🎁";
            case "DESAFIO ABERTURA": return "🌊";
            case "DESAFIO LIBERDADE": return "🕊️";
            case "DESAFIO ENTREGA": return "🤲";
            case "DESAFIO SABEDORIA": return "🧠";
            case "POTÊNCIA": return "⚡";
            case "ALMA": return "❤️";
            case "APARÊNCIA": return "👁️";
            case "EXPRESSAO": return "🚀";
            case "COMPROMISSO": return "🤝";
            default: return "✨";
        }
    }

    function destacarResumoComAlerta(texto) {
        if (!texto) return "";
        const indiceBr = texto.indexOf("<br>");
        const temBr = indiceBr !== -1;
        const destaque = temBr ? texto.slice(0, indiceBr) : texto;
        const depoisDoBr = temBr ? texto.slice(indiceBr + 4) : "";
        // Ajuste para pegar um resumo de 150 caracteres após o destaque
        const resumo = depoisDoBr.slice(0, 1500000).trim(); 
        const continua = resumo.length >=  1500000 ? "..." : "";
        const alerta = `<span style="font-size:15px; color:#c0392b; font-weight:bold;">
          🚨📣📅 Fique atento! Conteúdo completo disponível no site a partir de 22/11/2025.
        </span>`;
        return `
          <span style="font-weight:bold; font-size:16px;">${destaque}</span><br><br>
          <span style="font-size:16px; color:#333;">${resumo}${continua}</span><br><br>
        `;
    }

    // === MONTAGEM DO RESUMO COMPLETO ===
    function montarResumoCompleto() {
        // ... (restante do código de montagem do resumo)
        let html = `
          <div class="dados-pessoa">
            <div style="font-size:24px; font-weight:bold; color:#0044cc; text-align:center; text-transform:uppercase; margin-bottom:6px;">
              ${nome}
            </div>
            <div style="text-align:center; font-size:16px; color:#333; margin-bottom:10px;">
              ${data}
            </div>
          </div>

          <h3 style="text-align:center; color:#0044cc; margin:12px 0 6px;">
            🌟 IDENTIDADE PESSOAL 🌟<br>
          </h3>
          <p style="text-align:center; font-style:italic; color:#888; margin-bottom:16px;">
            “Conhecer a si mesmo é o primeiro passo para transformar o mundo ao seu redor.”
          </p>
        `;

        // PARTE I
        const temasParte1 = ["eu_sou", "aprendizado", "dons"];
        temasParte1.forEach(id => {
            const campo = campos.find(c => c.id === id);
            if (!campo) return;
            html += `
              <div class="box-tema">
                <h5>${getEmoji(campo.titulo)} ${campo.titulo} — <span class="valor"> ${campo.valor} </span></h5>
                <p class="descricao">${destacarResumoComAlerta(campo.descricao)}</p>
              </div>
            `;
        });

        // PARTE II
        html += `
          <h3 style="text-align:center; color:#c0392b; margin-top:40px;">
            🔥 DESAFIOS E POTENCIAIS 🔥<br>
            <span style="font-size:16px; color:#666;">Os pontos de tensão que impulsionam sua evolução</span>
          </h3>
          <p style="text-align:center; font-style:italic; color:#888; margin-bottom:30px;">
            “Todo desafio é uma oportunidade disfarçada de crescimento.”
          </p>
        `;
        const temasParte2 = ["desafio_abertura", "desafio_liberdade", "desafio_entrega", "desafio_sabedoria", "potencia"];
        temasParte2.forEach(id => {
            const campo = campos.find(c => c.id === id);
            if (!campo) return;
            html += `
              <div class="box-tema">
                <h5>${getEmoji(campo.titulo)} ${campo.titulo} — <span class="valor"> ${campo.valor} </span></h5>
                <p class="descricao">${destacarResumoComAlerta(campo.descricao)}</p>
              </div>
            `;
        });

        // PARTE III
        html += `
          <h3 style="text-align:center; color:#2c3e50; margin-top:40px;">
            🌌 PROPÓSITO E EXPRESSÃO 🌌<br>
            <span style="font-size:16px; color:#666;">Os pilares que sustentam sua presença no mundo</span>
          </h3>
          <p style="text-align:center; font-style:italic; color:#888; margin-bottom:30px;">
            “Sua missão é o fio condutor entre quem você é e o que veio realizar.”
          </p>
        `;
        const temasParte3 = ["alma", "aparencia", "missao", "compromisso"];
        temasParte3.forEach(id => {
            const campo = campos.find(c => c.id === id);
            if (!campo) return;
            html += `
              <div class="box-tema">
                <h5>${getEmoji(campo.titulo)} ${campo.titulo} — <span class="valor"> ${campo.valor} </span></h5>
                <p class="descricao">${destacarResumoComAlerta(campo.descricao)}</p>
              </div>
            `;
        });

        return html;
    }

    // === BOTÕES (Funções globais para serem chamadas pelo onclick no HTML) ===

    window.verResumo = function () {
        if (!campos.length) {
            alert("Aguarde: os dados ainda estão carregando.");
            return;
        }
        document.getElementById("resumoTexto").innerHTML = montarResumoCompleto();
        // Assume que 'bootstrap' está carregado globalmente
        new bootstrap.Modal(document.getElementById("modalResumo")).show();
    };

    window.gerarPDF = function () {
        if (!campos.length) {
            alert("Aguarde: os dados ainda estão carregando.");
            return;
        }
        const areaPDF = document.getElementById("areaPDF");
        areaPDF.innerHTML = montarResumoCompleto();
        areaPDF.style.display = "block";

        const opcoes = {
            margin: [10, 10, 10, 10],
            filename: `relatorio-${nome}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 1.3 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Assume que 'html2pdf' está carregado globalmente
        setTimeout(() => {
            html2pdf().set(opcoes).from(areaPDF).save().then(() => {
                areaPDF.style.display = "none";
            });
        }, 300);
    };

    window.voltar = () => window.location.href = "index.html";
});