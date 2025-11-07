# === MATRIZ BASE ===
matriz_modelo = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 19, 20, 21],
    [1, 3, 4, 7, 9, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21],
    [2, 5, 6, 7, 8, 9, 10, 13, 14, 15, 17, 18, 19, 20, 21]
]

# === LISTA BASE DE 1 A 25 ===
base = list(range(1, 26))

# === ENTRADA DO USUÁRIO ===
entrada = input("Digite 4 números separados por vírgula: ")
expurgos = [int(x.strip()) for x in entrada.split(",")]

# === REMOVE OS NÚMEROS DIGITADOS ===
restantes = [n for n in base if n not in expurgos]

print("\n--- NÚMEROS RESTANTES ---")
print(restantes)

# === DISTRIBUIÇÃO NAS LINHAS ===
print("\n--- DISTRIBUIÇÃO FINAL (15 NÚMEROS POR LINHA) ---")

# Índice para percorrer os números restantes
indice = 0
linhas_resultado = []

for i, modelo in enumerate(matriz_modelo, start=1):
    linha = []
    for num in modelo:
        if num in restantes and num not in linha:
            linha.append(num)
    # completa com próximos da lista restante até ter 15
    while len(linha) < 15 and indice < len(restantes):
        prox = restantes[indice]
        if prox not in linha:
            linha.append(prox)
        indice += 1

    linhas_resultado.append(linha)
    print(f"Linha {i}: {linha}")

print("\nTotal de números restantes:", len(restantes))
