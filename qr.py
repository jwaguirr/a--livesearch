# Only for generating qr code one time use
import qrcode

def generate_fingerprint_qr(base_url):
    # Create QR code instance
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    
    # Add the URL data
    qr.add_data(f"{base_url}/check-route?node=A&number=3")
    qr.make(fit=True)
    
    # Create an image from the QR Code
    qr_image = qr.make_image(fill_color="black", back_color="white")
    
    # Save it
    qr_image.save("node1-qr.png")

# Usage example
generate_fingerprint_qr("http://168.5.141.192:3000")