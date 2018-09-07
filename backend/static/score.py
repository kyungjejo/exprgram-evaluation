import json
import networkx as nx
import matplotlib.pyplot as plt

count=0
data = open('./subtitle_aggregated.txt').readlines()

def generate_graph(size_words=4):
    global data
    G = nx.Graph()
    with open('./score.json') as f:
        js = json.load(f)
        for i in js.keys():
            s = set([x[0] for x in js[i] if len(x[0].split())>4])
            if len(s)>size_words:
                for j in range(len(js[i])):
                    if len(js[i][j][0].split())>4:
                        if not js[i][j][0].strip() == data[int(i)]:
                            G.add_edge(int(i),js[i][j][2],weight=js[i][j][1])
    return G

def group(G=nx.Graph()):
    global data
    groups = {}
    for node in G.nodes:
        size = 100
        root = ''
        group = nx.node_connected_component(G,node)
        for n in group:
            l = len([x for x in G.neighbors(n)])
            if l < size:
                size=l
                root=n
        if not data[n] in groups.keys():
            groups[data[n]] = group
    return groups
groups = group(generate_graph(3))
for k in groups.keys():
    print (k.strip(),'\n','\n'.join([data[x].strip() for x in groups[k]]),'\n')
print(len(groups.keys()))
# elarge=[(u,v) for (u,v,d) in G.edges(data=True) if d['weight'] >0.13]
# esmall=[(u,v) for (u,v,d) in G.edges(data=True) if d['weight'] <=0.13]

# pos = nx.spring_layout(G)
# # nodes
# nx.draw_networkx_nodes(G,pos,node_size=10)

# # edges
# nx.draw_networkx_edges(G,pos,edgelist=elarge,
#                     width=6)
# nx.draw_networkx_edges(G,pos,edgelist=esmall,
#                     width=6,alpha=0.5,edge_color='b',style='dashed')

# # labels
# nx.draw_networkx_labels(G,pos,font_size=5,font_family='sans-serif')

# plt.axis('off')
# plt.savefig("weighted_graph.png") # save as png
# plt.show() # displa