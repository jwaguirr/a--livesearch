# Only for generating qr code one time use
import qrcode

def generate_fingerprint_qr(route: str, qr_name: str):
    # Create QR code instance
    base_url = "http://168.5.158.135:3000"
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    
    # Add the URL data
    qr.add_data(f"{base_url}/{route}")
    qr.make(fit=True)
    
    # Create an image from the QR Code
    qr_image = qr.make_image(fill_color="black", back_color="white")
    
    # Save it
    qr_image.save(qr_name)


generate_fingerprint_qr("/check-route?node=A&number=2", "node1-qr.png")
generate_fingerprint_qr("/check-route?node=B&number=2", "node2-qr.png")
generate_fingerprint_qr("/check-route?node=C&number=2", "node3-qr.png")
generate_fingerprint_qr("/initialize", 'init.png')

# http://168.5.158.135:3000/
#http://168.5.158.135:3000/check-route?node=A&number=3