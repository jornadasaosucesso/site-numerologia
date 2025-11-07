import os
from PIL import Image
from pillow_heif import register_heif_opener
import pytesseract

# 🔧 Configurações CORRETAS
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
os.environ["TESSDATA_PREFIX"] = r"C:\tessdata"
register_heif_opener()

# Diretórios
entrada = r"C:\site-numerologia\paginas_natalicias"
saida = os.path.join(entrada, "textos_extraidos")

os.makedirs(saida, exist_ok=True)

# 🔍 Processa cada arquivo da pasta
for arquivo in os.listdir(entrada):
    if arquivo.lower().endswith((".jpg", ".jpeg", ".png")):
        caminho_img = os.path.join(entrada, arquivo)
        nome_base = os.path.splitext(arquivo)[0]
        caminho_txt = os.path.join(saida, f"{nome_base}.txt")

        print(f"📷 Lendo imagem: {arquivo}")

        try:
            # Abre e converte imagem
            img = Image.open(caminho_img).convert("RGB")

            # 🧠 Executa OCR em português
            texto = pytesseract.image_to_string(img, lang="por")

            # Grava resultado
            with open(caminho_txt, "w", encoding="utf-8") as f:
                f.write(texto)

            print(f"✅ Texto salvo em: {caminho_txt}")

        except Exception as e:
            print(f"❌ Erro ao processar {arquivo}: {e}")

print("\n🎯 Finalizado! Todos os textos foram extraídos para a pasta:")
print(saida)
