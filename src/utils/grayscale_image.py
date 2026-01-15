from PIL import Image
import io
import base64
import js

def grayscale_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    grayscaled_image = image.convert("L")
    
    original_format = image.format or "PNG"
    
    output = io.BytesIO()
    grayscaled_image.save(output, format=original_format)
    return output.getvalue()

image_bytes = base64.b64decode(image_data)

processed_bytes = grayscale_image(image_bytes)
js.processed_data = base64.b64encode(processed_bytes).decode("utf-8")
