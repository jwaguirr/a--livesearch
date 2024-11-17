import segno
from app import app

if __name__ == "__main__":
    # Generate QR code
    base_url = "http://168.5.134.30:8001/"  # Replace with your server URL
    qrcode = segno.make_qr(base_url)
    qrcode.save("registration_qrcode.png")
    
    app.run(host="0.0.0.0", port=8001, debug=True)