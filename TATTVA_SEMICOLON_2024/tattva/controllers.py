from flask import render_template, request, jsonify, Response
from tattva import db, tattva 
from tattva.process_entities import *
from tattva.process_relations import *
import subprocess
#from tattva.models import Edges, Nodes

# App home page
@tattva.route('/', methods=["GET"])
def index():
    return jsonify("Hello World !!")
    #return render_template('home.html')

# about the product
@tattva.route('/about')
def about():
    """Render about.html file."""
    return render_template('about.html')


@tattva.route("/search", methods=["GET"])
def search_data():
    if pm_id := request.args.get("search_string", False):
        try:
            p = subprocess.Popen(["netstat", "-a", "-o", "-n", "|", "findstr", ":8050"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
            out, err = p.communicate()
            pid = out.decode("utf-8").strip().split()[-1]
            p = subprocess.Popen(["taskkill", "/PID", pid, "/F"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
            out, err = p.communicate()
        except:
            pass
        response = fetch_data(pm_id)
        return Response(response=json.dumps(response), status=200)
    else:
        response = {"code": 403, "msg": "Invalid Arguments", "status": "Error"}
    return jsonify(response)


@tattva.route("/entities", methods=["GET"])
def extract_entities_aws():
    data = extract_entities()
    response = {"code": 200, "data": data, "status": "SUCCESS"}
    return jsonify(response)


@tattva.route("/relations", methods=["GET"])
def extract_relations_semrep():
    data = get_semrep_relations()
    response = {"code": 200, "data": data, "status": "SUCCESS"}
    return jsonify(response)
