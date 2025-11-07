import os
from PIL import Image, ImageEnhance, ImageFilter
from pillow_heif import register_heif_opener
import pytesseract

# 🔧 Configuração do Tesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
os.environ["TESSDATA_PREFIX"] = r"C:\tessdata"
register_heif_opener()

# Diretórios
entrada = r"C:\site-numerologia\paginas_natalicias"
saida = os.path.join(entrada, "textos_extraidos")
os.makedirs(saida, exist_ok=True)

def preparar_imagem(img):
    """Melhora a imagem antes do OCR"""
    img = img.convert("L")  # tons de cinza
    img = ImageEnhance.Contrast(img).enhance(2.0)  # aumenta contraste
    img = ImageEnhance.Sharpness(img).enhance(1.5)  # nitidez
    img = img.filter(ImageFilter.MedianFilter(size=3))  # remove ruído
    img = img.point(lambda x: 0 if x < 140 else 255)  # binarização
    return img

def processar_metade(img, lado, base_nome):
    """Faz OCR em uma das metades da imagem"""
    largura, altura = img.size
    margem = int(largura * 0.02)  # 2% de margem pra evitar a sombra central

    if lado == "esq":
        corte = (0, 0, largura // 2 - margem, altura)
    else:
        corte = (largura // 2 + margem, 0, largura, altura)

    parte = img.crop(corte)
    parte = preparar_imagem(parte)

    # ⚙️ Configuração personalizada do Tesseract
    custom_config = r'--oem 1 --psm 3'
    texto = pytesseract.image_to_string(parte, lang="por", config=custom_config)

    # 🔍 Debug opcional para verificar caracteres especiais
    print(repr(texto))

    nome_arquivo = f"{base_nome}_{lado}.txt"
    caminho_txt = os.path.join(saida, nome_arquivo)

    with open(caminho_txt, "w", encoding="utf-8") as f:
        f.write(texto)

    print(f"✅ Texto salvo em: {nome_arquivo}")

# 🔍 Processa todas as imagens
for arquivo in os.listdir(entrada):
    if arquivo.lower().endswith((".heic", ".jpg", ".jpeg", ".png")):
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

print("\n🎯 Finalizado! Textos extraídos e limpos salvos em:")
print(saida)