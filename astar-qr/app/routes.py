from flask import render_template, request, jsonify
from app import app, db
from app.utils import generate_device_hash, create_user_document
import random

@app.route('/')
def index():
    return render_template('welcome.html')

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        netID = data.get('netID')
        fingerprint_data = data.get('fingerprint')
        
        if not netID or not fingerprint_data:
            return jsonify({'error': 'Missing required data'}), 400
            
        device_hash = generate_device_hash(fingerprint_data)
        
        # Check if device is already registered
        users_collection = db['users']
        existing_device = users_collection.find_one({'device_hash': device_hash})
        if existing_device:
            return jsonify({'error': 'This device has already been registered'}), 400
            
        # Generate random group (0-3)
        group = random.randint(0, 3)
        
        # Create and insert user document
        user_data = create_user_document(
            netID, 
            group, 
            device_hash, 
            fingerprint_data, 
            request.remote_addr
        )
        
        users_collection.insert_one(user_data)
        
        return jsonify({
            'success': True,
            'group': group,
            'unique_id': user_data['unique_id']
        })
        
    except Exception as e:
        print(f"Error during registration: {e}")
        return jsonify({'error': 'Registration failed'}), 500