import requests
import traceback
import re
import pandas as pd
import os
import json
from bs4 import BeautifulSoup
import lxml
import boto3
# from tattva import db
# from tattva.models import Entity

PMCID_REGEX = re.compile("^PMC[0-9]{7,8}$")
PMID_REGEX = re.compile("^(PM){0,1}[0-9]{7,8}$")
# PUBMED_API_TEXT = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db={}&id={}&retmode=text&rettype=medline"
PUBMED_API_XML = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db={}&id={}"
PUBMED_API_TERM = (
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term={}"
)
PUBMED_DB = "pubmed"
PUBMED_CENTRAL_DB = "pmc"
TEMP_FILE = "temp.txt"
ARTICLE_FILE = os.path.abspath("article.txt")
ATTR_REQUIRED = ["pmid", "pmcid", "Title", "Abstract"]


def get_required_data_from_article(text: str, db: str) -> dict:
    required_data = {attr: "" for attr in ATTR_REQUIRED}
    soup = BeautifulSoup(text, "xml")

    if db == PUBMED_CENTRAL_DB:
        try:
            required_data[ATTR_REQUIRED[0]] = (
                soup.find("article-meta")
                .find("article-id", {"pub-id-type": ATTR_REQUIRED[0]})
                .string.strip()
            )
        except AttributeError:
            print(f"{ATTR_REQUIRED[0]} not found in the article")
        try:
            required_data[ATTR_REQUIRED[1]] = (
                soup.find("article-meta")
                .find("article-id", {"pub-id-type": PUBMED_CENTRAL_DB})
                .string.strip()
            )
        except AttributeError:
            print(f"{ATTR_REQUIRED[1]} not found in the article")
        try:
            required_data[ATTR_REQUIRED[2]] = re.sub(
                "\s\s+", " ", soup.find("title-group").find("article-title").string
            )
        except AttributeError:
            print(f"{ATTR_REQUIRED[2]} not found in the article")
        try:
            required_data[ATTR_REQUIRED[3]] = re.sub(
                "\s\s+", " ", soup.abstract.get_text()
            )
        except AttributeError:
            print(f"{ATTR_REQUIRED[3]} not found in the article")

    elif db == PUBMED_DB:
        try:
            required_data[ATTR_REQUIRED[0]] = soup.PubmedData.ArticleIdList.find(
                "ArticleId", {"IdType": PUBMED_DB}
            ).string.strip()
        except AttributeError:
            print(f"{ATTR_REQUIRED[0]} not found in the article")
        try:
            required_data[ATTR_REQUIRED[1]] = soup.PubmedData.ArticleIdList.find(
                "ArticleId", {"IdType": PUBMED_CENTRAL_DB}
            ).string.strip()
        except AttributeError:
            print(f"{ATTR_REQUIRED[1]} not found in the article")
        try:
            required_data[ATTR_REQUIRED[2]] = re.sub(
                "\s\s+", " ", soup.MedlineCitation.Article.ArticleTitle.get_text()
            )
        except AttributeError:
            print(f"{ATTR_REQUIRED[2]} not found in the article")
        try:
            required_data[ATTR_REQUIRED[3]] = re.sub(
                "\s\s+", " ", soup.MedlineCitation.Article.Abstract.get_text()
            )
        except AttributeError:
            print(f"{ATTR_REQUIRED[3]} not found in the article")

    elif db == "search":
        required_data["article_ids"] = soup.IdList.get_text().split("\n")

    return required_data


def get_pubmed_doc_by_id(pubmed_id: str) -> dict:
    response_dict = dict()
    query_api = db = None

    try:
        if re.match(PMID_REGEX, pubmed_id):
            query_api = PUBMED_API_XML.format(PUBMED_DB, pubmed_id)
            db = PUBMED_DB
        if re.match(PMCID_REGEX, pubmed_id):
            query_api = PUBMED_API_XML.format(PUBMED_CENTRAL_DB, pubmed_id)
            db = PUBMED_CENTRAL_DB
        if not query_api:
            response_dict = {
                "code": requests.codes.bad_request,
                "msg": f"Invalid PubMed ID: { pubmed_id } - Please check the PM/ PMC ID",
                "status": "ERROR",
            }
            return response_dict

        response = requests.get(query_api, verify=False)

        if response.status_code == requests.codes.ok:
            print(f"Fetching the article for PubMed ID - {pubmed_id}")
            data = get_required_data_from_article(text=response.text, db=db)
            data_to_save = (
                "PMID: "
                + data[ATTR_REQUIRED[0]]
                + "_"
                + data[ATTR_REQUIRED[1]]
                + "\n"
                + data[ATTR_REQUIRED[2]]
                + "\n"
                + data[ATTR_REQUIRED[3]]
                + "\n\n"
            )
            with open(ARTICLE_FILE, "a+", encoding="utf-8") as article_file:
                article_file.write(data_to_save)
            response_dict = {
                "code": response.status_code,
                "msg": f"PubMed article is fetched and saved - {ARTICLE_FILE}",
                "status": "SUCCESS",
                "data": [{
                    "pmid": data[ATTR_REQUIRED[0]],
                    "title": data[ATTR_REQUIRED[2]],
                    "summary": data[ATTR_REQUIRED[3]],
                }],
            }
        else:
            response_dict = {
                "code": response.status_code,
                "msg": f"ERROR: Failed to fetch the article with PubMed ID - { pubmed_id }",
                "status": "ERROR",
            }
        return response_dict

    except Exception as exc:
        traceback.print_exc()
        response_dict = {"code": 500, "msg": traceback.format_exc(), "status": "ERROR"}
        return response_dict


def fetch_data_by_search_term(search_term: str):
    try:
        search_term_encoded = re.sub("\s\s+", "+", search_term.strip())
        query_api = PUBMED_API_TERM.format(search_term_encoded)
        response = requests.get(query_api, verify=False)
        if response.status_code == requests.codes.ok:
            response_list = []
            pubmed_ids = get_required_data_from_article(text=response.text, db="search")
            for pubmed_id in pubmed_ids["article_ids"]:
                pub_data = get_pubmed_doc_by_id(pubmed_id)
                if pub_data and pub_data.get("data"):
                    response_list.append(pub_data.get("data")[0])
            response_dict = {
                "code:": response.status_code,
                "status": "SUCCESS",
                "msg": "Total 20 recent articles are fetched",
                "data" : response_list
            }
            return response_dict
        else:
            response_dict = { 
                "code:": response.status_code,
                "status": "SUCCESS",
                "msg": "Error occurred while fetching pubmed data"
            }
            return response_dict
    except Exception as exc:
        traceback.print_exc()
        response_dict = { 
                "code:": 500,
                "status": "ERROR",
                "msg": "Internal Server Error"
            }
        return response_dict

def fetch_data(input_string: str):
    search_string = input_string.strip()
    if os.path.isfile(ARTICLE_FILE):
        os.remove(ARTICLE_FILE)
    if re.match(PMID_REGEX, search_string) or re.match(PMCID_REGEX, search_string):
        return get_pubmed_doc_by_id(search_string)
    else:
        return fetch_data_by_search_term(search_string)


def extract_entities():
    client = boto3.client(
        service_name="comprehendmedical",
        region_name="us-west-2",
        aws_access_key_id="AKIATCKARADB2HOFKCUX",
        aws_secret_access_key="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",
    )

    article_text = ""
    with open(ARTICLE_FILE, "r") as fp:
        article_text = fp.read()
    
    length = len(article_text)
    execute_text = ""
    entities = []
    while length > 20000:
        execute_text = article_text[:20000]
        result = client.detect_entities_v2(Text=execute_text)
        entities.extend(result["Entities"])
        article_text = article_text[20000:]
        length = len(article_text)

    response_dict = {
        "code:": 200,
        "status": "SUCCESS",
        "msg": "Entities are detected",
        "data" : entities,
    }
    return response_dict
