from django.test import TestCase

# Create your tests here.
import networkx as nx
import matplotlib.pyplot as plt
import json, os
from gensim.parsing.preprocessing import *
from gensim.utils import lemmatize
import heapq

data = open('../static/subtitle_aggregated.txt').readlines()

def generate_graph(size_words=4):
    global data
    G = nx.Graph()
    with open('../static/score.json') as f:
        js = json.load(f)
        for i in js.keys():
            s = set([x[0] for x in js[i] if len(x[0].split())>size_words])
            if len(s)>size_words:
                for j in range(len(js[i])):
                    if len(js[i][j][0].split())>4:
                        if not js[i][j][0].strip() == data[int(i)]:
                            G.add_edge(int(i),js[i][j][2],weight=js[i][j][1])
    # print(G.edges)
    return G

def group(G=nx.Graph(),size_min_set=3, size_max_set=7):
    global data
    groups = {}
    for node in G.nodes:
        size = 0
        root = ''
        group = nx.node_connected_component(G,node)
        for n in sorted(list(group)):
            l = len([x for x in G.neighbors(n)])
            if l > size:
                size=l
                root=n        
        if not root in groups.keys() \
            and len(list(set([data[x] for x in list(group)])))>=size_min_set:
            # and len(list(set([data[x] for x in list(group)])))<=size_max_set:
            # groups[root] = group
            groups[data[int(root)]] = [data[int(x)] for x in group]
    count = 0
    for g in groups:
        count+=len(groups[g])
    print(count)
    # for g in groups.keys():
    #     dct = {}
    #     lemmatized_group = []
    #     for x in groups[g]:
    #         lemmatized = []
    #         for y in x.split():
    #             lemmed = lemmatize(strip_punctuation(y).split()[0], stopwords=[], min_length=0, max_length=30)
    #             if len(lemmed)>0:
    #                 lemmed = lemmed[0]
    #                 lemmed = lemmed.decode('utf-8').split('/')[0]
    #                 lemmatized.append(lemmed)
    #                 if lemmed in dct.keys():
    #                     dct[lemmed] = dct[lemmed]+1
    #                 else:
    #                     dct[lemmed] = 1
    #             else:
    #                 y_original = y.lower().strip('.').strip('!').strip('?')
    #                 if y_original in dct.keys():
    #                     dct[y_original] = dct[y_original]+1
    #                 else:
    #                     dct[y_original] = 1
    #                 lemmatized.append(y_original)
    #         lemmatized_group.append(lemmatized)
    #         # for y in preprocess_string(x, filters=(strip_tags,strip_punctuation,strip_multiple_whitespaces,strip_numeric,stem_text)):
    #     _max = 0
    #     _sent = ''
    #     pop_list = []
    #     for x,val in dct.items():
    #         if val<int(len(groups[g])/2):
    #             pop_list.append(x)
    #     for p in pop_list:
    #         dct.pop(p)
    #     count_list = []
    #     for idx, x in enumerate(lemmatized_group):
    #         count = 0
    #         # for y in preprocess_string(x, filters=(strip_tags,strip_punctuation,strip_multiple_whitespaces,strip_numeric,stem_text)):
    #         for y in x:
    #             if y in dct.keys():
    #                 count += 1
    #         count_list.append(count)
    #         # if count>_max:
    #         #     _max = count
    #         #     _sent = idx
    #     _sent = heapq.nlargest(3, range(len(count_list)), key=count_list.__getitem__)[1]
    #     sent = groups[g][_sent]
    #     topic = []
    #     for idx, word in enumerate(lemmatized_group[_sent]):
    #         if word in dct.keys():
    #             topic.append(sent.split()[idx])
    #         else:
    #             if len(topic)>0 and topic[-1] == "000":
    #                 continue
    #             topic.append("000")
    #     if topic.count("000")>(len(topic)/2):
    #         continue
    #     print('Topic Sentence: %s\n' %(" ".join(topic).strip()))
    #     for idx,_sent in enumerate(groups[g]):
    #         print("%d. %s" %(idx,_sent.strip()))
    #     print("\n")

        
    # print(len(groups.keys()))
    # node_list = []
    # positions=nx.spring_layout(G)
    # for idx, (key, g) in enumerate(groups.items()):
    #     # node_list.extend(list(g))
    #     node_list = list(g)
    #     edges=[(u,v) for (u,v,d) in G.edges(data=True) if u in node_list and v in node_list]
    #     # remove_nodes = [n for n in G.nodes() if n not in node_list]
    #     # for r in remove_nodes:
    #     #     G.remove_node(r)
    #     pos = {}
    #     labels = {}
    #     for n in node_list:
    #         pos[n] = positions[n]
    #         labels[n] = data[n]
    #     plt.figure(idx)
    #     nx.draw_networkx_nodes(G,pos,nodelist=node_list, node_size=10)
    #     nx.draw_networkx_edges(G,pos, edgelist=edges, width=1)
    #     nx.draw_networkx_labels(G,pos,labels=labels,font_size=8,font_family='sans-serif')
    #     plt.axis('off')
    #     # plt.savefig("../static/graph/"+str(size_min_set)+"/weighted_graph"+str(idx)+".png")
    #     plt.savefig("../static/graph/"+str(size_min_set)+"/"+data[key]+".png")
    #     plt.close(idx)
    #     plt.show()
    return groups
# os.mkdir('../static/graph/'+str(19))
group(generate_graph(0),3,18)
# groups = group(generate_graph(0),15,15)