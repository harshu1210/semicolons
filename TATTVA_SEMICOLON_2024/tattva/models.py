from flask import abort, flash, request, redirect, url_for,render_template
from collections import String, Date, Integer, Boolean
from arango_orm import Collection
from datetime import datetime

from tattva import app, db

class Entity(Collection):

    __collection__ = 'entity'

    _key = String(required=True) #entity_name
    type = String()
    confidence_score = String()

    def __repr__(self) -> str:
        return f'{self._key, self.type}'

class Relation(Collection):

    __collection__ = 'relation'

    #_key = String(required=True)
    node_1 = Entity(required=True)
    node_2 = Entity(required=True)
    relation = String(required=True)
    pmid = String()
    pmcid = String()
    evidence_id = String() #sentence number in the article
    evidence_text = String()
    confidence_score = String()

    def __repr__(self) -> str:
        return f'{self.node_1, self.relation, self.node_2, self.evidence_text}'
