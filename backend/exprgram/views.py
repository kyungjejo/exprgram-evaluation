from django.shortcuts import render
from django.contrib.staticfiles.templatetags.staticfiles import static
from glob import glob
import os
import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import networkx as nx
import matplotlib.pyplot as plt
import random
from .models import *
from django.core import serializers
from django.db.models import Count
from django.db.models import Q
from .common import fetch_topic
from random import shuffle
from pattern.text.en import singularize
from django.utils import timezone

data = open(static('subtitle_aggregated.txt')).readlines()
SUBTITLE_PATH = static('subtitle/')
INDEX_PATH = static('filename_index.json')
f_index = json.load(open(INDEX_PATH))
EXPR_PATH = static('filtered_threshold_combined.tsv')
EXPR_EXPR_PATH = static('expressionPairs.tsv')

def sentenceInfo(g):
    videoList = {}
    L = f_index[str(g)][:3]
    videoList[0] = L[0]
    videoList[1] = {}
    videoList[1]['sentStart'] = f_index[str(g)][1]['start']
    videoList[1]['sentEnd'] = f_index[str(g)][1]['end']
    videoList[1]['sent'] = L[1]['sent']
    start = int(f_index[str(g)][1]['start']) - 15
    start_ind = f_index[str(g)][2] - 5 if (f_index[str(g)][2])-5>0 else 0
    with open(SUBTITLE_PATH+f_index[str(g)][0]) as f:
        subtitleJS = json.load(f)
        s = int(subtitleJS[str(start_ind)]['start'])
        end_ind = f_index[str(g)][2] + 5 if f_index[str(g)][2] + 5<(len(subtitleJS)-1) else len(subtitleJS)-1
        e = int(subtitleJS[str(end_ind)]['end'])
        end = int(f_index[str(g)][1]['end']) + 15
    videoList[1]['start'] = s if s>start else start
    videoList[1]['end'] = e if e<end else end
    
    videoList[2]=g
    return videoList

def generate_graph(size_words=4):
    global data
    G = nx.Graph()
    with open(static('score.json')) as f:
        js = json.load(f)
        for i in js.keys():
            s = set([x[0] for x in js[i] if len(x[0].split())>size_words])
            if len(s)>size_words:
                for j in range(len(js[i])):
                    if len(js[i][j][0].split())>4:
                        if not js[i][j][0].strip() == data[int(i)]:
                            G.add_edge(int(i),js[i][j][2],weight=js[i][j][1])
    return G

def group(G=nx.Graph(),size_min_set=3, size_max_set=7):
    global data
    groups = {}
    for node in G.nodes:
        size = 0
        root = ''
        group = nx.node_connected_component(G,node)
        for n in group:
            l = len([x for x in G.neighbors(n)])
            if l >= size:
                size=l
                root=n
        if root and not root in groups.keys() and \
            len(list(set([data[x] for x in list(group)])))>=size_min_set and \
            len(list(set([data[x] for x in list(group)])))<=size_max_set and \
            len(list([data[x] for x in list(group)]))<len(list(set([data[x] for x in list(group)])))+3:
            groups[root] = group
    lst_remove = []
    count=0
    for g in groups.keys():
        group = [data[x] for x in groups[g]]
        topic = fetch_topic(group)
        topic = topic.split(' ')
        _count = 0
        for t in topic:
            if '_____' in t:
                _count+=1
        if _count>2 or _count>=len(topic)/2:
            lst_remove.append(g)
        if len(topic)<4:
            lst_remove.append(g)
        if '_____' in topic[0]:
            lst_remove.append(g)
        if g not in lst_remove:
            count+=1
            # print ("%d, Topic: %s, Representative: %s, length: %d" %(g, " ".join(topic),data[g].strip(), len(groups[g])))
            # print ("https://exprgram.kyungjejo.com/video/%s/%s/%s/%s/%s/{userid}" %(sentenceInfo(g)[0],sentenceInfo(g)[1]['start'],sentenceInfo(g)[1]['end'],sentenceInfo(g)[2],sentenceInfo(g)[3]))
            # print ("\n")
            # "http://localhost:3000/video/NZ6_ucAP5Ag/183/197/71/4829/kyungjejo"
            # print ("Related Expressions: %s" %" ".join([data[x] for x in groups[g]]))

    for l in lst_remove:
        groups.pop(l,None)
    # print("Number of groups: %d"  %len(groups))
    # print("Total number of expressions: %d" %len([x for x in groups.values() for x in x]))
    return groups

# Create your views here.
groups = group(generate_graph(0),5,8)
# for idx in [12186,28633,37080,6365,30300,19158,24667,22392,23187,37715,27572,23826]:
#     for val in groups.values():
#         if idx in val:
#             print (len(val),print(val))

def expression_save_to_database():
    with open(EXPR_PATH) as f:
        line = f.readline()
        while line:
            line = line.strip()
            _id, _expr, _target = line.split('\t')
            expr_count, created = expressionEvaluationCount.objects.get_or_create(target=_target,expression=_expr)
            if not created:
                print(_expr)
            line = f.readline()
expression_save_to_database()

def exprexpr_save_to_database():
    with open(EXPR_EXPR_PATH) as f:
        line = f.readline()
        while line:
            line = line.strip()
            _small, _big = line.split('\t')
            expr_count, created = exprExprEvaluationCount.objects.get_or_create(target=_small,expression=_big)
            if not created:
                print(_expr)
            line = f.readline()
exprexpr_save_to_database()

def HandleUndone(mode):
    if mode==1:
        exprs = expressionEvaluationCount.objects.filter(allocated__gte=3, count__lt=3).order_by('target')
        for e in exprs:
            _target = e.target
            _expr = e.expression
            time_delta = timezone.now()-e.last_allocated
            hour_delta = time_delta.seconds//3600
            if hour_delta>=1:
                _count = 3 - e.count
                e.allocated = 3-_count
                e.save()
    elif mode==2:
        exprs = exprExprEvaluationCount.objects.filter(allocated__gte=3, count__lt=3).order_by('target')
        for e in exprs:
            _target = e.target
            _expr = e.expression
            time_delta = timezone.now()-e.last_allocated
            hour_delta = time_delta.seconds//3600
            if hour_delta>=1:
                _count = 3 - e.count
                e.allocated = 3-_count
                e.save()
        # expressionEvaluationCount.objects.filter(target=_target,expression=_expr).count()

@csrf_exempt
def Expression(request):
    HandleUndone(1)
    exprs = expressionEvaluationCount.objects.filter(allocated__lt=3).order_by('target')[:15]
    data = {}
    for e in exprs:
        size = len(data)
        _target = e.target
        _expr = e.expression
        data[size] = (sentenceInfo(_target),_expr)
        _allocated = e.allocated+1
        _allocated_time = timezone.now()
        e.allocated = _allocated
        e.last_allocated = _allocated_time
        e.save()
    return HttpResponse(json.dumps(data), content_type="application/json")

@csrf_exempt
def ExpressionSave(request):
    # {'similarity': 7, 'appropriateness': 6, 'grammar': '', 'expr': "Don't leave me long"} 
    data = json.loads(request.body.decode('utf-8'))
    workerID=data['workerID']
    meaningSimilarity=data['similarity']
    appropriateness=data['appropriateness']
    grammar=data['grammar']
    target=data['target']
    expression=data['expr']
    e = expressionEvaluationCount.objects.get(target=target,expression=expression)
    e.count = e.count+1
    e.save()
    result, created = expressionEvaluationResult.objects.get_or_create(target=target,expression=expression,meaningSimilarity=meaningSimilarity,
                                                        appropriateness=appropriateness,grammar=grammar,workerID=workerID)
    data = {}
    return HttpResponse(json.dumps(data), content_type="application/json")

@csrf_exempt
def Expression2(request):
    HandleUndone(2)
    exprs = exprExprEvaluationCount.objects.filter(allocated__lt=3).order_by('target')[:15]
    data = {}
    for e in exprs:
        size = len(data)
        _target = e.target
        _expr = e.expression
        data[size] = (sentenceInfo(_target),sentenceInfo(_expr))
        _allocated = e.allocated+1
        _allocated_time = timezone.now()
        e.allocated = _allocated
        e.last_allocated = _allocated_time
        e.save()
    return HttpResponse(json.dumps(data), content_type="application/json")

@csrf_exempt
def Exprexprsave(request):
    print('exprexprsave')
    # {'similarity': 7, 'appropriateness': 6, 'grammar': '', 'expr': "Don't leave me long"} 
    data = json.loads(request.body.decode('utf-8'))
    print(data)
    workerID=data['workerID']
    meaningSimilarity=data['similarity']
    appropriateness1=data['appropriateness1']
    appropriateness2=data['appropriateness2']
    target1=data['target1']
    target2=data['target2']
    e = exprExprEvaluationCount.objects.get(target=target1,expression=target2)
    e.count = e.count+1
    e.save()
    result, created = exprExprEvaluationResult.objects.get_or_create(target=target1,expression=target2,meaningSimilarity=meaningSimilarity,
                                                        appropriateness1=appropriateness1,appropriateness2=appropriateness2,workerID=workerID)
    data = {}
    return HttpResponse(json.dumps(data), content_type="application/json")