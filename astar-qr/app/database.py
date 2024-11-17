from pymongo import MongoClient

def init_db(uri):
    client = MongoClient(uri)
    db = client['fingerprint_db']
    return db

def get_users_collection(db):
    return db['users']