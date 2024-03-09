import random
import traceback
import pandas as pd
from skr_web_api import Submission
from tattva.process_entities import ARTICLE_FILE
import re
import os
import json
import ssl

SEMREP_RELATION_REGEX = re.compile("^(\d{7,8})_((PMC){0,1}\d{0,8})\.tx\.(\d+)\|")
SEMREP_SENTENCE_REGEX = re.compile("^(\d{7,8}_(PMC){0,1}\d{0,8}\.tx\.\d+)")
INDEX_REQUIRED = [[3, 7], [2, 6], [5], [8], [10, 14], [9, 13], [12]]
RELATION_FILE = os.path.abspath("relations.txt")
RELATION_KEYS = [
    "PMID",
    "PMCID",
    "SENTENCE",
    "ENTITY_1",
    "CID_1",
    "TYPE_1",
    "RELATION",
    "ENTITY_2",
    "CID_2",
    "TYPE_2",
]

import warnings
import contextlib

import requests
from urllib3.exceptions import InsecureRequestWarning

old_merge_environment_settings = requests.Session.merge_environment_settings

@contextlib.contextmanager
def no_ssl_verification():
    opened_adapters = set()

    def merge_environment_settings(self, url, proxies, stream, verify, cert):
        # Verification happens only once per connection so we need to close
        # all the opened adapters once we're done. Otherwise, the effects of
        # verify=False persist beyond the end of this context manager.
        opened_adapters.add(self.get_adapter(url))

        settings = old_merge_environment_settings(self, url, proxies, stream, verify, cert)
        settings['verify'] = False

        return settings

    requests.Session.merge_environment_settings = merge_environment_settings

    try:
        with warnings.catch_warnings():
            warnings.simplefilter('ignore', InsecureRequestWarning)
            yield
    finally:
        requests.Session.merge_environment_settings = old_merge_environment_settings

        for adapter in opened_adapters:
            try:
                adapter.close()
            except:
                pass


def relation_keys_gen():
    for key in RELATION_KEYS:
        yield key


def get_semrep_relations():
    try:
        with no_ssl_verification():
            email = "sudipkumarsahu999@gmail.com"
            api_key = "cf7de993-3ed0-4f98-8bf7-5ce952b2a4f4"
            if os.path.isfile(ARTICLE_FILE):
                inst = Submission(email, api_key)
                inst.init_generic_batch("semrep", "-D")
                inst.set_batch_file(ARTICLE_FILE)
                response = inst.submit()
                with open(RELATION_FILE, "w", encoding="utf-8") as f:
                    f.write(response.text)
                response = {
                    "code:": 200,
                    "status": "SUCCESS",
                    "msg": "Entities are detected",
                    "data" : get_semrep_relation_json(response.text)
                }
                return response
    except Exception as exc:
        traceback.print_exc()

def get_semrep_relation_json(text: str) -> dict:
    relations_evidences = {"relations": [], "evidences": []}
    last_entry = ""
    try:
        relation_text = text
        relation_text_lines = relation_text.split("\n")
        for line in relation_text_lines:
            if not line.strip():
                continue
            if match_obj := re.match(SEMREP_RELATION_REGEX, line):
                relation_keys = relation_keys_gen()
                params = line.split("|")
                relation = {}
                relation[next(relation_keys)] = (
                    match_obj.group(1) if match_obj.group(1) else ""
                )
                relation[next(relation_keys)] = (
                    match_obj.group(2) if match_obj.group(2) else ""
                )
                relation[next(relation_keys)] = (
                    match_obj.group(4) if match_obj.group(4) else ""
                )
                for index_i in INDEX_REQUIRED:
                    for index_a in index_i:
                        if params[index_a]:
                            relation[next(relation_keys)] = params[index_a]
                            break
                        relation[next(relation_keys)] = ""
                relation["EVIDENCE_TEXT"] = relations_evidences["evidences"][-1]["EVIDENCE_TEXT"]
                relations_evidences["relations"].append(relation)
                last_entry = "relation"

            elif match_obj := re.match(SEMREP_SENTENCE_REGEX, line):
                if last_entry == "evidence":
                    relations_evidences["evidences"].pop()
                evidence = {
                    "EVIDENCE_ID": (
                        match_obj.group(1).replace(".tx.", "_")
                        if match_obj.group(1)
                        else ""
                    ),
                    "EVIDENCE_TEXT": line.split(" ", 1)[-1],
                }
                relations_evidences["evidences"].append(evidence)
                last_entry = "evidence"

        if last_entry == "evidence":
            relations_evidences["evidences"].pop()

    except Exception as exc:
        traceback.print_exc()
    # instantiate_dash_plot(relations_evidences['relations'])
    with open('relation.json', 'w') as fp:
        json.dump(relations_evidences["relations"], fp)
    return relations_evidences

# def _process_relations(relations):
#     edges, nodes = [], []
#     # with open('C:\\Users\\uday_gunjal\\Downloads\\relation.json','r') as fp:
#     #     relations = json.load(fp).get('relations')
#     # print(relations)
#     for each in relations:
#         if not any(map(lambda x:x['id']==each['ENTITY_1'], nodes)):
#             nodes.append({'id':each['ENTITY_1'],
#                           'entity_name':each['ENTITY_1'],
#                           'type':each['TYPE_1'],
#                           'screentime':1,
#                           'Cluster':True})
#         else:
#             for ev in nodes:
#                 if ev['id']==each['ENTITY_1']:
#                     ev['screentime'] += 1
#         if not any(map(lambda x:x['id']==each['ENTITY_2'], nodes)):
#             nodes.append({'id':each['ENTITY_2'],
#                           'entity_name':each['ENTITY_2'],
#                           'type':each['TYPE_2'],
#                           'screentime':1,
#                           'Cluster':True})
#         else:
#             for ev in nodes:
#                 if ev['id']==each['ENTITY_2'] or ev['id'] == each['ENTITY_1']:
#                     ev['screentime'] += 1
#         if not any(map(lambda x:x['from']==each['ENTITY_1'] and x['to']==each['ENTITY_2'], edges)):
#             edges.append({'from':each['ENTITY_1'],
#                         'to':each['ENTITY_2'],
#                           'label':each['RELATION'],
#                         #   'id':f"{each['ENTITY_1']}_{each['ENTITY_2']}",
#                         "weight":random.randint(10,90),
#                         "strength":['high', 'medium', 'low'][random.randint(0,2)]})
#     return pd.DataFrame(edges), pd.DataFrame(nodes)


# def instantiate_dash_plot(relations):
#     from tattva.process_graph import DashPoweredNetworkGraph
#     edge_df, node_df = _process_relations(relations=relations)
#     DashPoweredNetworkGraph(edge_df, node_df).plot(directed=True)
