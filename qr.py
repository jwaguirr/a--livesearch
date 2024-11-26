import qrcode
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import base64
from dotenv import load_dotenv
import os 

load_dotenv(".env.local")

def encrypt_params(params: str, key: bytes) -> str:
    """Encrypt URL parameters using AES with URL-safe encoding."""
    iv = os.getenv("NEXT_PUBLIC_ENCRYPTION_IV").encode('utf-8')
    cipher = AES.new(key, AES.MODE_CBC, iv)
    
    # Only replace & with AND
    params_simplified = params.replace('&', 'AND')
    
    padded_data = pad(params_simplified.encode('utf-8'), AES.block_size)
    encrypted_data = cipher.encrypt(padded_data) 
    combined = iv + encrypted_data
    
    # Use URL-safe base64 encoding
    encoded = base64.urlsafe_b64encode(combined).decode('utf-8')
    return encoded

def generate_fingerprint_qr(route: str, params: str, qr_name: str, encryption_key: bytes):
    """Generate QR code with encrypted parameters."""
    base_url = "http://192.168.1.223:3000"
    
    encrypted_params = encrypt_params(params, encryption_key) if params else ""
    
    full_url = f"{base_url}{route}"
    if encrypted_params:
        full_url += f"?data={encrypted_params}"
    
    print(f"Full URL generated: {full_url}")
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(full_url)
    qr.make(fit=True)
    qr_image = qr.make_image(fill_color="black", back_color="white")
    qr_image.save(qr_name)
    return full_url

ENCRYPTION_KEY = os.getenv("NEXT_PUBLIC_ENCRYPTION_KEY").encode('utf-8')

# Test URLs
generate_fingerprint_qr("/check-route", "node=A&number=2", "node1-qr.png", ENCRYPTION_KEY)
generate_fingerprint_qr("/check-route", "node=B&number=2", "node2-qr.png", ENCRYPTION_KEY)
generate_fingerprint_qr("/check-route", "node=C&number=2", "node3-qr.png", ENCRYPTION_KEY)
generate_fingerprint_qr("/check-route", "node=D&number=2", "node4-qr.png", ENCRYPTION_KEY)
generate_fingerprint_qr("/check-route", "node=E&number=2", "node5-qr.png", ENCRYPTION_KEY)
generate_fingerprint_qr("/check-route", "node=F&number=2", "node6qr.png", ENCRYPTION_KEY)
generate_fingerprint_qr("/initialize", "", "init.png", ENCRYPTION_KEY)