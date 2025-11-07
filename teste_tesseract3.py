from pillow_heif import register_heif_opener
from PIL import Image
register_heif_opener()
img = Image.open("pag2.heic")
img.save("pagina_teste.jpg")

