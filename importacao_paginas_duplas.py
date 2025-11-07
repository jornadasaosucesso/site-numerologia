import os
from PIL import Image
from pillow_heif import register_heif_opener
import pytesseract

# 🔧 Configurações
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
os.environ["TESSDATA_PREFIX"] = r"C:\tessdata"
register_heif_opener()

# Diretórios
entrada = r"C:\site-numerologia\paginas_natalicias"
saida = os.path.join(entrada, "textos_extraidos")
os.makedirs(saida, exist_ok=True)

def processar_metade(img, lado, base_nome):
    """Faz OCR em uma das metades da imagem"""
    largura, altura = img.size
    if lado == "esq":
        corte = (0, 0, largura // 2, altura)
    else:
        corte = (largura // 2, 0, largura, altura)

    parte = img.crop(corte)
    texto = pytesseract.image_to_string(parte, lang="por")

    nome_arquivo = f"{base_nome}_{lado}.txt"
    caminho_txt = os.path.join(saida, nome_arquivo)

    with open(caminho_txt, "w", encoding="utf-8") as f:
        f.write(texto)

    print(f"✅ Texto salvo em: {nome_arquivo}")

# 🔍 Processa todas as imagens
for arquivo in os.listdir(entrada):
    if arquivo.lower().endswith((".jpg", ".jpeg", ".png")):
        caminho_img = os.path.join(entrada, arquivo)
        nome_base = os.path.splitext(arquivo)[0]

        print(f"\n📷 Processando imagem dupla: {arquivo}")
        try:
            img = Image.open(caminho_img).convert("RGB")

            # Divide e processa esquerda e direita
            processar_metade(img, "esq", nome_base)
            processar_metade(img, "dir", nome_base)

        except Exception as e:
            print(f"❌ Erro ao processar {arquivo}: {e}")

print("\n🎯 Finalizado! As páginas esquerda e direita foram extraídas em:")
print(saida)
