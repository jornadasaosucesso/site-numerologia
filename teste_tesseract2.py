import pytesseract
import os

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
os.environ["TESSDATA_PREFIX"] = r"C:\\"

print("🔍 Verificando configuração...")
print("Tesseract exe:", pytesseract.pytesseract.tesseract_cmd)
print("TESSDATA_PREFIX:", os.environ["TESSDATA_PREFIX"])

idiomas = pytesseract.get_languages(config='')
print("Idiomas reconhecidos:", idiomas)
