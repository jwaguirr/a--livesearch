from flask import Flask
from config import Config
from app.database import init_db

app = Flask(__name__,
            template_folder='templates',  # Specify template folder
            static_folder='static')       # Specify static folder
app.config.from_object(Config)
db = init_db(app.config['MONGO_URI'])

from app import routes