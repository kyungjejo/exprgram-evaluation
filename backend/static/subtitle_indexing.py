from glob import glob
import json, os

g = glob('./subtitle/*')
idx = {}
count = 0
with open('./subtitle_aggregated.txt','w') as w:
	for sub in g:
		with open(sub) as f:
			js = json.load(f)
		sents = [js[str(i)] for i in range(len(js))]
		for s in sents:
			if '\n' in s:
				print (s,sub)
		count+=len(sents)
		para = '\n'.join([s['sent'] for s in sents])
		for i in range(len(sents)):
			idx[len(idx)]=(sub.split('/')[-1],sents[i],i)
		w.write(para+'\n')
# print(count)
open('./filename_index.json','w').write(json.dumps(idx))

'''
with open(t) as f:
	js = json.load(f)

sents = [js[str(i)]['sent'] for i in range(len(js))]
sub = ' '.join(sents)
print(keywords(sub,words=5,split=True,scores=True))
'''
