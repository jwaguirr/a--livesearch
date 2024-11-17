import hashlib
import json
import uuid
from datetime import datetime

def generate_device_hash(fingerprint_data):
    # Extract only the stable hardware characteristics
    stable_features = {
        'screen': fingerprint_data['screen'],
        'hardware': {
            'cores': fingerprint_data['hardware']['cores'],
            'gpu': fingerprint_data['hardware']['gpu'],
            'platform': fingerprint_data['hardware']['platform']
        },
        'touch': fingerprint_data['touch'],
        'mobile': fingerprint_data['mobile']
    }
    
    # Create a deterministic string representation
    stable_string = json.dumps(stable_features, sort_keys=True)
    
    # Generate hash
    return hashlib.sha256(stable_string.encode()).hexdigest()

def create_user_document(netID, group, device_hash, fingerprint_data, ip_address):
    return {
        'netID': netID,
        'group': group,
        'unique_id': str(uuid.uuid4()),
        'device_hash': device_hash,
        'registration_time': datetime.utcnow(),
        'registration_ip': ip_address,
        # Store basic device info for reference
        'device_info': {
            'screen_resolution': f"{fingerprint_data['screen']['width']}x{fingerprint_data['screen']['height']}",
            'platform': fingerprint_data['hardware']['platform'],
            'is_mobile': fingerprint_data['mobile'],
            'gpu': fingerprint_data['hardware']['gpu']['renderer']
        }
    }