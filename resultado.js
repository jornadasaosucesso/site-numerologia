window.addEventListener('load', () => {
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
            
            shouldStop = !forcarReducaoPura && [11, 22].includes(n);
        }
        
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
    
    // Função auxiliar para obter D, M, A reduzidos (com redução pura forçada)
    function obterDMAReduzidos(dataStr) {
        const partes = (dataStr || "").split("/").map(Number);
        
        // 1. Reduz o Dia (D) - Pura
        const d = partes[0] ? reduzir(partes[0], true) : 0;
        
        // 2. Reduz o Mês (M) - Pura
        const m = partes[1] ? reduzir(partes[1], true) : 0;
        
        // 3. Soma os dígitos do Ano, e depois Reduz o total (A) - Pura
        const anoRaw = partes[2] ? partes[2] : 0;
        const aSoma = String(anoRaw).split("").reduce((acc, digit) => acc + parseInt(digit, 10), 0);
        const a = reduzir(aSoma, true);
        
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
        
        const d = reduzir(dRaw, true); 
        const m = reduzir(mRaw, true); 
        
        let resultado = Math.abs(m - d);
    
        // Regra: Se o resultado for 0, ele é substituído pelo Desafio 9
        return (resultado === 0) ? 9 : resultado;

    }

    // D2: Desafio Dia - Ano
    function calcularDesafio2(dataStr) {
        const partes = (dataStr || "").split("/");
        const dRaw = partes[0] ? parseInt(partes[0]) : 0;
        const aRaw = partes[2] ? partes[2] : "0";

        const d = reduzir(dRaw, true); 
        const a = reduzir(somaData(aRaw), true); 

        let resultado = Math.abs(d - a);
    
        // Regra: Se o resultado for 0, ele é substituído pelo Desafio 9
        return (resultado === 0) ? 9 : resultado;

    }

    // D4: Desafio Mês - Ano
    function calcularDesafio4(dataStr) {
        const partes = (dataStr || "").split("/");
        const mRaw = partes[1] ? parseInt(partes[1]) : 0;
        const aRaw = partes[2] ? partes[2] : "0";

        const m = reduzir(mRaw, true); 
        const a = reduzir(somaData(aRaw), true); 

        let resultado = Math.abs(m - a);
    
        // Regra: Se o resultado for 0, ele é substituído pelo Desafio 9
        return (resultado === 0) ? 9 : resultado;

    }

    // D3: Desafio Principal (D1 - D2)
    function calcularDesafioPrincipal(D1, D2) {
        let resultado = Math.abs(D1 - D2); 
        
        // Regra: Se o resultado for 0, ele é substituído pelo Desafio 9
        return (resultado === 0) ? 9 : resultado; 
    }
    
    // === FUNÇÕES DOS PINÁCULOS (NOVAS FUNÇÕES PARA OS 4 CÁLCULOS) ===

    // Pináculo 1: Dia + Mês
    function calcularPinaculo1(d, m) {
        return reduzir(d + m); // Redução normal (permite 11, 22)
    }

    // Pináculo 2: Dia + Ano
    function calcularPinaculo2(d, a) {
        return reduzir(d + a); // Redução normal (permite 11, 22)
    }

    // Pináculo 3: Pináculo 1 + Pináculo 2
    function calcularPinaculo3(p1, p2) {
        return reduzir(p1 + p2); // Redução normal (permite 11, 22)
    }

    // Pináculo 4: Mês + Ano
    function calcularPinaculo4(m, a) {
        return reduzir(m + a); // Redução normal (permite 11, 22)
    }

    /**
     * Calcula os períodos dos 4 Pináculos de forma dinâmica.
     * @param {number} numMissao - O número da Missão (Expressão) da pessoa.
     * @returns {object} Um objeto com as idades de transição (XX, YY, WW).
     */
    function calcularPeriodosPinaculos(numMissao) {
        if (!Number.isFinite(numMissao) || numMissao < 1) {
            return { XX: 36, YY: 45, WW: 54 }; // Valores default
        }

        // 1. Idade da 1ª Mudança (XX): Fim do P1 / Início do P2
        const XX = 36 - numMissao;
        
        // 2. Idade da 2ª Mudança (YY): Fim do P2 / Início do P3 (Ciclo padrão de 9 anos)
        const YY = XX + 9; 
        
        // 3. Idade da 3ª Mudança (WW): Fim do P3 / Início do P4 (Ciclo padrão de 9 anos)
        const WW = YY + 9;

        return { XX, YY, WW };
    }

    let campos = [];
    let dadosNumerologia = [];
    let dadosDiaNatal = [];

    // === FUNÇÃO PARA CARREGAR CSV (Promisified) ===
    function carregarCSV(caminho) {
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

        // Função para buscar descrição no CSV principal (usada para campos não-Pináculos)
        function buscarDescricao(numero, campo) {
            const linha = dadosNumerologia.find(row => {
                const n = parseInt(row.numero, 10);
                // A busca aceita tanto o número reduzido quanto o mestre (11, 22)
                return !isNaN(n) && (n === numero || reduzir(n) === numero);
            });
            return linha ? (linha[campo] || "Informação não encontrada.") : "Informação não encontrada.";
        }

        // === NOVO CÓDIGO DE BUSCA ESPECÍFICA PARA PINÁCULOS (USA AS COLUNAS pinaculo1, pinaculo2, etc.) ===
        function buscarDescricaoPinaculo(numero, indicePinaculo) {
            const coluna = `pinaculo${indicePinaculo}`; // Ex: 'pinaculo1', 'pinaculo2'
            
            const linha = dadosNumerologia.find(row => {
                const n = parseInt(row.numero, 10);
                return !isNaN(n) && (n === numero || reduzir(n) === numero);
            });

            return linha ? (linha[coluna] || `Conteúdo não encontrado para esta fase (${coluna}).`) : "Número do Pináculo não encontrado no CSV.";
        }
        // ====================================================================================================

        // === CÁLCULOS PRINCIPAIS ===
        const [vogais, consoantes] = separarVogaisConsoantes(nome);
        const num_ego = calcularNumero(vogais);
        const num_aparencia = calcularNumero(consoantes);
        const num_missao = calcularNumero(vogais + consoantes); // ESSENCIAL PARA CALCULAR AS IDADES
        const potencial = calcularPotencial(data);
        const dia = parseInt((data || "").split("/")[0], 10) || 0;
        const aprendizado = calcularAprendizado(dia);
        const compromisso = calcularCompromisso(num_missao, potencial);
        
        // CÁLCULO DOS DESAFIOS (MANTIDO)
        const desafio_abertura = calcularDesafio1(data); 
        const desafio_liberdade = calcularDesafio2(data); 
        const desafio_sabedoria = calcularDesafio4(data); 
        const desafio_entrega = calcularDesafioPrincipal(desafio_abertura, desafio_liberdade); 
        
        
        // === CÁLCULO DOS PINÁCULOS ===
        const { d, m, a } = obterDMAReduzidos(data); // Obtém D, M, A PURAMENTE reduzidos
        
        const pinaculo1 = calcularPinaculo1(d, m);
        const pinaculo2 = calcularPinaculo2(d, a);
        const pinaculo4 = calcularPinaculo4(m, a); 
        const pinaculo3 = calcularPinaculo3(pinaculo1, pinaculo2);

        // === CÁLCULO DINÂMICO DOS PERÍODOS ===
        const { XX, YY, WW } = calcularPeriodosPinaculos(num_missao); 
        
        // O valor principal do campo 'potencia' será o P1
        const potencia_valor = pinaculo1; 
        
        
        // --- MONTAGEM DA DESCRIÇÃO CONSOLIDADA DOS PINÁCULOS ---
        let descricaoPinaculos = `
            <h4 style="color:#0044cc; margin-top:20px;">Ciclos de Experiência (Pináculos)</h4>
            <p style="font-style:italic;">As idades de transição são calculadas com base no seu Número de Expressão (${num_missao}).</p>
        `;

        // Função auxiliar para montar o bloco de Pináculo com período dinâmico
        function formatarPinaculoHTML(pValor, pIndice, pCor) {
            let periodo_texto = "";
            let fase_titulo = "";
            
            if (pIndice === 1) {
                fase_titulo = "Pináculo de Formação (Jovem)";
                periodo_texto = `Da infância até os ${XX} anos.`;
            } else if (pIndice === 2) {
                fase_titulo = "Pináculo de Realização (Adulto Jovem)";
                periodo_texto = `Dos ${XX + 1} anos aos ${YY} anos.`;
            } else if (pIndice === 3) {
                fase_titulo = "Pináculo de Amadurecimento (Meia-Idade)";
                periodo_texto = `Dos ${YY + 1} anos aos ${WW} anos.`;
            } else if (pIndice === 4) {
                fase_titulo = "Pináculo de Colheita (Maturidade)";
                periodo_texto = `A partir dos ${WW + 1} anos.`;
            }

            // Busca o conteúdo na coluna específica do CSV (pinaculo1, pinaculo2, etc.)
            let html = buscarDescricaoPinaculo(pValor, pIndice); 

            // Formata o bloco de saída
            return `
                <div style="border-left: 3px solid ${pCor}; padding-left: 10px; margin-bottom: 25px;">
                    <p style="font-weight: bold; margin-bottom: 5px;">
                        ${pIndice === 1 ? '🌟' : pIndice === 2 ? '💫' : pIndice === 3 ? '🌍' : '🏆'} Pináculo ${pIndice} (${pValor}) - ${fase_titulo}
                    </p>
                    <p style="font-style: italic; color: #555; margin-bottom: 5px;">
                        Período: ${periodo_texto}
                    </p>
                    ${html}
                </div>
            `;
        }

        const cores = { cor1: '#ff69b4', cor2: '#00aaff', cor3: '#ffaa00', cor4: '#4caf50' };

        // Pináculo 1 (P1)
        descricaoPinaculos += formatarPinaculoHTML(pinaculo1, 1, cores.cor1);
        
        // Pináculo 2 (P2)
        descricaoPinaculos += formatarPinaculoHTML(pinaculo2, 2, cores.cor2);

        // Pináculo 3 (P3)
        descricaoPinaculos += formatarPinaculoHTML(pinaculo3, 3, cores.cor3);
        
        // Pináculo 4 (P4)
        descricaoPinaculos += formatarPinaculoHTML(pinaculo4, 4, cores.cor4);
        
        // ----------------------------------------------------------------------
        
        // Busca a descrição do dia natal agora de forma síncrona
        const descricaoEuSou = buscarDiaNatal(dia);

        // CORREÇÃO AQUI: Atualizando os IDs e valores nos campos
        campos = [
            { id: "eu_sou", titulo: "EU SOU", valor: dia, descricao: descricaoEuSou },
            { id: "aprendizado", titulo: "APRENDIZADO", valor: aprendizado, descricao: buscarDescricao(aprendizado, "aprendizado") },
            { id: "dons", titulo: "DONS POTENCIAL", valor: potencial, descricao: buscarDescricao(potencial, "dons_potencial") },
            { id: "desafio_abertura", titulo: "DESAFIO ABERTURA", valor: desafio_abertura, descricao: buscarDescricao(desafio_abertura, "desafio_abertura") }, // D1
            { id: "desafio_liberdade", titulo: "DESAFIO LIBERDADE", valor: desafio_liberdade, descricao: buscarDescricao(desafio_liberdade, "desafio_liberdade") }, // D2
            { id: "desafio_entrega", titulo: "DESAFIO ENTREGA", valor: desafio_entrega, descricao: buscarDescricao(desafio_entrega, "desafio_entrega") }, // D3
            { id: "desafio_sabedoria", titulo: "DESAFIO SABEDORIA", valor: desafio_sabedoria, descricao: buscarDescricao(desafio_sabedoria, "desafio_sabedoria") }, // D4
            
            // === CAMPO POTÊNCIA AGORA CONSOLIDA OS 4 PINÁCULOS ===
            { 
                id: "potencia", 
                titulo: "CICLOS (PINÁCULOS)", 
                valor: potencia_valor, 
                descricao: descricaoPinaculos // Descrição consolidada dos 4 Pináculos
            },
            // =======================================================
            
            { id: "alma", titulo: "ALMA", valor: num_ego, descricao: buscarDescricao(num_ego, "alma") },
            { id: "aparencia", titulo: "APARÊNCIA", valor: num_aparencia, descricao: buscarDescricao(num_aparencia, "aparencia") },
            { id: "missao", titulo: "EXPRESSÃO", valor: num_missao, descricao: buscarDescricao(num_missao, "missao") },
            { id: "compromisso", titulo: "COMPROMISSO", valor: compromisso, descricao: buscarDescricao(compromisso, "compromisso") }
        ];

        // === RENDERIZAÇÃO DOS DADOS NA TELA ===
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
            case "DONS POTENCIAL": return "🎁";
            case "DESAFIO ABERTURA": return "🌊";
            case "DESAFIO LIBERDADE": return "🕊️";
            case "DESAFIO ENTREGA": return "🤲";
            case "DESAFIO SABEDORIA": return "🧠";
            case "CICLOS (PINÁCULOS)": return "🌀"; // Novo Emoji
            case "ALMA": return "❤️";
            case "APARÊNCIA": return "👁️";
            case "EXPRESSÃO": return "🚀";
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
        // NOTE: Usamos o array 'campos' que é preenchido no .then para garantir que os dados estejam carregados.
        
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

        // PARTE I (EU SOU, APRENDIZADO, DONS)
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
        
        // PARTE DE PINÁCULOS (INSERIDO AQUI PARA CONSOLIDAR NO RELATÓRIO)
        const pinaculoCampo = campos.find(c => c.id === "potencia");
        if (pinaculoCampo) {
            html += `
              <h3 style="text-align:center; color:#1abc9c; margin-top:40px;">
                🌀 CICLOS (PINÁCULOS) 🌀<br>
                <span style="font-size:16px; color:#666;">As experiências chave de cada fase</span>
              </h3>
              <div class="box-tema">
                <h5>${getEmoji(pinaculoCampo.titulo)} ${pinaculoCampo.titulo} — <span class="valor"> ${pinaculoCampo.valor} (Primeiro Ciclo) </span></h5>
                <p class="descricao">${destacarResumoComAlerta(pinaculoCampo.descricao)}</p>
              </div>
            `;
        }

        // PARTE II (DESAFIOS)
        html += `
          <h3 style="text-align:center; color:#c0392b; margin-top:40px;">
            🔥 DESAFIOS E POTENCIAIS 🔥<br>
            <span style="font-size:16px; color:#666;">Os pontos de tensão que impulsionam sua evolução</span>
          </h3>
          <p style="text-align:center; font-style:italic; color:#888; margin-bottom:30px;">
            “Todo desafio é uma oportunidade disfarçada de crescimento.”
          </p>
        `;
        const temasParte2 = ["desafio_abertura", "desafio_liberdade", "desafio_entrega", "desafio_sabedoria"];
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

        // PARTE III (PROPÓSITO E EXPRESSÃO)
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
        new bootstrap.Modal(document.getElementById("modalResumo")).show();
    };

//    window.gerarPDF = function () {
//        if (!campos.length) {
//            alert("Aguarde: os dados ainda estão carregando.");
//            return;
//        }
//        const areaPDF = document.getElementById("areaPDF");
//        areaPDF.innerHTML = montarResumoCompleto();
//        areaPDF.style.display = "block";

//        const opcoes = {
//            margin: [10, 10, 10, 10],
//            filename: `relatorio-${nome}.pdf`,
//            image: { type: 'jpeg', quality: 0.98 },
//            html2canvas: { scale: 1.3 },
//            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//        };

//        setTimeout(() => {
//            html2pdf().set(opcoes).from(areaPDF).save().then(() => {
//                areaPDF.style.display = "none";
//            });
//        }, 300);
//    };

    window.voltar = () => window.location.href = "index.html";
});
