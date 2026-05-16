"""
מייצר מפתח RSA כדי לקבע את מזהה התוסף.
מפיק:
  - extension_key.pem  (פרטי - שמור במקום בטוח, לא להעלות לגיט!)
  - מדפיס את ה-public key לשים ב-manifest.json
"""
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization, hashes
import base64, os

OUT_DIR = os.path.dirname(__file__)
PEM_PATH = os.path.join(OUT_DIR, "extension_key.pem")

if os.path.exists(PEM_PATH):
    print(f"כבר קיים: {PEM_PATH}")
    with open(PEM_PATH, "rb") as f:
        key = serialization.load_pem_private_key(f.read(), password=None)
else:
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    with open(PEM_PATH, "wb") as f:
        f.write(key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption(),
        ))
    print(f"נוצר: {PEM_PATH}")

pub_der = key.public_key().public_bytes(
    encoding=serialization.Encoding.DER,
    format=serialization.PublicFormat.SubjectPublicKeyInfo,
)
pub_b64 = base64.b64encode(pub_der).decode()

# מזהה התוסף הוא 32 התווים הראשונים של sha256(public_key_der) ממופים a-p
digest = hashes.Hash(hashes.SHA256())
digest.update(pub_der)
ext_id = "".join(chr(ord("a") + int(c, 16)) for c in digest.finalize().hex()[:32])

print("\n=== הוסף למניפסט ===")
print(f'"key": "{pub_b64}"')
print(f"\nExtension ID יהיה: {ext_id}")
