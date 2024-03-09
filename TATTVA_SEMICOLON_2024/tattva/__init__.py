from flask import Flask
from arango import ArangoClient
from arango_orm import Database
from datetime import timedelta
# from tattva.process_graph import DashPoweredNetworkGraph

# Initialize flask app
tattva = Flask(__name__) 

# Set app secret key
# Keep this private!
tattva.secret_key = 'semicolon_2024'

# Change this URI if you are working with this project on your machine
# Configure database connection 
tattva.config['ARANGO_ORM_DATABASE_URI'] = 'http://localhost:8529'


# Configure app to remember user login for 180 seconds on browser terminate
tattva.config['REMEMBER_COOKIE_DURATION'] = timedelta(seconds=180)


client = ArangoClient(hosts=tattva.config['ARANGO_ORM_DATABASE_URI'])
test_db = client.db('_system', username='root', password='rootpassword')

db = Database(test_db)

from tattva import controllers
