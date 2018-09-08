from gensim.parsing.preprocessing import *
from gensim.utils import lemmatize
import heapq, nltk
import math
# nltk.download('averaged_perceptron_tagger')
def fetch_topic(groups):
    dct = {}
    lemmatized_group = []
    for x in groups:
        lemmatized = []
        for y in x.split():
            lemmed = lemmatize(strip_punctuation(y).split()[0], stopwords=[], min_length=0, max_length=30)
            if len(lemmed)>0:
                lemmed = lemmed[0]
                lemmed = lemmed.decode('utf-8').split('/')[0]
                lemmatized.append(lemmed)
                if lemmed in dct.keys():
                    dct[lemmed] = dct[lemmed]+1
                else:
                    dct[lemmed] = 1
            else:
                y_original = y.lower().strip('.').strip('!').strip('?').strip(',')
                if y_original in dct.keys():
                    dct[y_original] = dct[y_original]+1
                else:
                    dct[y_original] = 1
                lemmatized.append(y_original)
        lemmatized_group.append(lemmatized)
        # for y in preprocess_string(x, filters=(strip_tags,strip_punctuation,strip_multiple_whitespaces,strip_numeric,stem_text)):
    _max = 0
    _sent = ''
    pop_list = []
    for x,val in dct.items():
        tag = nltk.pos_tag([x])[0][1]
        if tag == 'NN' or tag == 'NNS':
            if val<int(math.ceil(float(len(groups))/3*2)):
                pop_list.append(x)
        else:
            if val<int(len(groups)/3*2):
                pop_list.append(x)
    for p in pop_list:
        dct.pop(p)
    count_list = []
    total = 0
    for idx, x in enumerate(lemmatized_group):
        count = 0
        total+=len(x)
        # for y in preprocess_string(x, filters=(strip_tags,strip_punctuation,strip_multiple_whitespaces,strip_numeric,stem_text)):
        for y in x:
            if y in dct.keys():
                count += 1
        count_list.append(count)
        # if count>_max:
        #     _max = count
        #     _sent = idx
    avg = int(total/len(lemmatized_group))
    len_list = []
    for idx, x in enumerate(lemmatized_group):
        len_list.append(abs(len(x)-avg))
    count_rank = heapq.nlargest(len(count_list), range(len(count_list)), key=count_list.__getitem__)
    len_rank = heapq.nsmallest(len(len_list), range(len(len_list)), key=len_list.__getitem__)
    rank = [0] * len(lemmatized_group)
    for i in range(len(lemmatized_group)):
        rank[count_rank[i]] += i
        rank[len_rank[i]] += (i+1)
    _sent = heapq.nsmallest(len(rank), range(len(rank)), key=rank.__getitem__)[0]
    sent = groups[_sent]
    topic = []
    for idx, word in enumerate(lemmatized_group[_sent]):
        _w = sent.split()
        if word in dct.keys() and nltk.pos_tag([word])[0][1] != 'NNP':
            topic.append(_w[idx])
        else:
            if len(topic)>0 and "_____" in topic[-1]:
                continue
            if _w[idx][-1] == ',':
                topic.append("_____,")
            elif _w[idx][-1] == '.':
                topic.append("_____.")
            elif _w[idx][-1] == '!':
                topic.append("_____!")
            elif _w[idx][-1] == "?":
                topic.append("_____?")
            else:
                topic.append("_____")
    # if topic.count("000")>(len(topic)/2):
    #     return
    # print('Topic Sentence: %s\n' %(" ".join(topic).strip()))
    # for idx,_sent in enumerate(groups):
    #     print("%d. %s" %(idx,_sent.strip()))
    # print("\n")
    return (" ".join(topic).strip())

# def expressionPairSort():
#     with open('expressionpairs.csv') as f:
#         line = f.readline()
#         dct = {}
#         while line:
#             line = line.strip()
#             small,big,vote = line.split(',')
#             if int(small)<=int(big):
#                 s=int(small)
#                 b=int(big)
#             else:
#                 s=int(big)
#                 b=int(small)
#             if s not in dct.keys():
#                 dct[s] = set()
#                 dct[s].add(b)
#             else:
#                 dct[s].add(b)
#             line=f.readline()
#     count = 0
#     for x in sorted(dct.keys()):
#         for y in dct[x]:
#             count+=1
#             print("%d, %d" %(x,y))
#     print(count)

# expressionPairSort()