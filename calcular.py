# 🧠 Recalcula número de missão
vogais, consoantes = separar_vogais_consoantes(nome)
num_missao = calcular_numero(vogais + consoantes)

def reduzir_numero(n):
    while n not in [9, 11, 22] and n > 9:
        n = sum(int(d) for d in str(n))
    return n

def calcular_abertura_emocional(data):
    dia, mes, ano = [int(x) for x in data.split("/")]
    abertura = abs(mes - dia)
    return reduzir_numero(abertura)

def calcular_liberdade(data):
    dia, mes, ano = [int(x) for x in data.split("/")]
    liberdade = abs(ano - dia)
    return reduzir_numero(liberdade)

def calcular_desafio_principal(abertura, liberdade):
    desafio = abs(abertura - liberdade)
    return reduzir_numero(desafio)

def calcular_sabedoria_doadora(data):
    dia, mes, ano = [int(x) for x in data.split("/")]
    sabedoria = abs(ano - mes)
    return reduzir_numero(sabedoria)

# Validação de data parcial
def validar_data(texto):
    if texto == "":
        return True
    padrao = r"^\d{0,2}/?\d{0,2}/?\d{0,4}$"
    return re.match(padrao, texto) is not None

# Cálculo do arcano (1 a 9)
def calcular_arcano(data):
    digitos = [int(char) for char in data if char.isdigit()]
    soma = sum(digitos)
    while soma > 9:
        soma = sum(int(d) for d in str(soma))
    return soma

# 🧮 Cálculo de Potencial (soma total da data de nascimento)
def calcular_potencial(data):
    digitos = [int(d) for d in data if d.isdigit()]
    soma = sum(digitos)
    while soma > 9 and soma not in [11, 22]:
        soma = sum(int(d) for d in str(soma))
    return soma

# 📚 Cálculo de Aprendizado (baseado no dia do nascimento)
def calcular_aprendizado(dia):
    soma = sum(int(d) for d in str(dia))
    while soma > 9 and soma not in [11, 22]:
        soma = sum(int(d) for d in str(soma))
    return soma

# 🧭 Cálculo de Compromisso (Expressão + Potencial)
def calcular_compromisso(expressao, potencial):
    soma = expressao + potencial
    while soma > 9 and soma not in [11, 22]:
        soma = sum(int(d) for d in str(soma))
    return soma

# 🚪 Abertura Emocional: diferença entre mês e dia
def calcular_abertura_emocional(data):
    dia, mes, _ = [int(x) for x in data.split("/")]
    aber = None
    aber = abs(mes - dia)
    return abs(mes - dia)

# 🕊️ Liberdade: diferença entre ano e dia
def calcular_liberdade(data):
    dia, _, ano = [int(x) for x in data.split("/")]
    return abs(ano - dia)

# 🎯 Desafio Principal: diferença entre abertura e liberdade
def calcular_desafio_principal(abertura, liberdade):
    return abs(abertura - liberdade)

# 🎁 Sabedoria Doadora: diferença entre ano e mês
def calcular_sabedoria_doadora(data):
    _, mes, ano = [int(x) for x in data.split("/")]
    return abs(ano - mes)



# Cálculo de número com base nas letras
def calcular_numero(letras):
    tabela = {
        'A':1, 'J':1, 'S':1,
        'B':2, 'K':2, 'T':2,
        'C':3, 'L':3, 'U':3,
        'D':4, 'M':4, 'V':4,
        'E':5, 'N':5, 'W':5,
        'F':6, 'O':6, 'X':6,
        'G':7, 'P':7, 'Y':7,
        'H':8, 'Q':8, 'Z':8,
        'I':9, 'R':9
    }
    numeros = [tabela[letra] for letra in letras if letra in tabela]
    soma = sum(numeros)
    while soma > 9:
        soma = sum(int(d) for d in str(soma))
    return soma

dia, mes, ano = [int(x) for x in data.split("/")]
potencial = reduzir_numero(calcular_potencial(data))
aprendizado = reduzir_numero(calcular_aprendizado(dia))
compromisso = reduzir_numero(calcular_compromisso(num_expressao, potencial))

dia, mes, ano = [int(x) for x in data_nascimento.split("/")]
abertura = reduzir_numero(calcular_abertura_emocional(data_nascimento))
liberdade = reduzir_numero(calcular_liberdade(data_nascimento))
sabedoria = reduzir_numero(calcular_sabedoria_doadora(data_nascimento))
desafio = abs(abertura - liberdade)
if desafio == 0:
    desafio = reduzir_numero(abertura + liberdade)
else:
    desafio = reduzir_numero(desafio)

textos_desafios = buscar_desafios(abertura, liberdade, sabedoria, desafio)
textos_arcanos = buscar_arcanos_extras(potencial, aprendizado, compromisso)


arcano = calcular_arcano(data)
vogais, consoantes = separar_vogais_consoantes(nome)
num_ego = calcular_numero(vogais)
num_aparencia = calcular_numero(consoantes)
num_missao = calcular_numero(vogais + consoantes)

info_arcano = buscar_arcano_completo(arcano)
info_analise_ego = buscar_analise_numerologica(num_ego)
info_analise_aparencia = buscar_analise_numerologica(num_aparencia)
info_analise_missao = buscar_analise_numerologica(num_missao)







