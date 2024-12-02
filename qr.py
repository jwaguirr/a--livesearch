import qrcode
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import base64
from dotenv import load_dotenv
import os 

load_dotenv("/Users/jwaguirr/Documents/Projects/A*/astar-livesearch/.env.local")

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
    # base_url = "https://astar-livesearch.vercel.app"
    base_url = "http://168.5.182.94:3000"
    encrypted_params = encrypt_params(params, encryption_key) if params else ""
    
    full_url = f"{base_url}{route}"
    if encrypted_params:
        full_url += f"?data={encrypted_params}"
    
    # print(f"Full URL generated: {full_url}")
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(full_url)
    qr.make(fit=True)
    qr_image = qr.make_image(fill_color="black", back_color="white")
    qr_image.save(qr_name)
    return full_url

ENCRYPTION_KEY = os.getenv("NEXT_PUBLIC_ENCRYPTION_KEY").encode('utf-8')

# nums = [1,2,3,4]
# letters = ["A","B", "C", "D", "E", "F", "G", "H", "I", "J"]
# mapping  = {1:"Yellow", 2:'Red', 3: "Green", 4:"Blue"}

# urls=  []
# for num in nums:
#     print(f"Route color: {mapping[num]} \n")
#     for letter in letters:
#         url = generate_fingerprint_qr("/check-route", f"node={letter}&number={num}", "node1-qr1.png", ENCRYPTION_KEY)
#         print(f"{letter:}: ", url)
#         urls.append(url)
#     print("\n\n")

# print("\n\n")
# print(urls, "\n\n", len(urls))

# # Test URLs
generate_fingerprint_qr("/check-route", "node=A&number=1", "node1-qr1.png", ENCRYPTION_KEY)
generate_fingerprint_qr("/check-route", "node=B&number=1", "node2-qr1.png", ENCRYPTION_KEY)
generate_fingerprint_qr("/check-route", "node=F&number=1", "node3-qr1.png", ENCRYPTION_KEY)
generate_fingerprint_qr("/check-route", "node=G&number=1", "node4-qr1.png", ENCRYPTION_KEY)
generate_fingerprint_qr("/check-route", "node=C&number=1", "node5-qr1.png", ENCRYPTION_KEY)
generate_fingerprint_qr("/check-route", "node=D&number=1", "node6-qr1.png", ENCRYPTION_KEY)
generate_fingerprint_qr("/check-route", "node=E&number=1", "node7-qr1.png", ENCRYPTION_KEY)
generate_fingerprint_qr("/initialize", "", "init.png", ENCRYPTION_KEY)

# https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NtjGqFLK6rDb7YZDHLnt35tKAWK69I9mXN8bXa5VF9J4
