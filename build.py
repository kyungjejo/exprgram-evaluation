import subprocess, re, os

# move build folder from exprgram-front to backend
# subprocess.call("rm ./backend/build")
PATH = os.getcwd()

subprocess.call("cp -rf %s/build %s/backend/" %(PATH,PATH), shell=True)

# 
# subprocess.call("python ./backend/manage.py collectstatic", shell=True)

subprocess.call("mv ./backend/build/manifest.json ./backend/static", shell=True)

with open("./backend/build/index.html") as text:
    html = "{% load static %}"+text.read()
    html = re.sub('/manifest.json', "{% static 'manifest.json' %}", html)
    css = re.compile("/static/css/main.*.css").search(html).group().replace("/static/",'')
    new_css = "{% static '"+css+"' %}"
    js = re.compile("/static/js/main.*.js").search(html).group().replace("/static/",'')
    new_js = "{% static '"+js+"' %}"

    html = re.sub("/static/css/main.*.css",new_css,html)
    html = re.sub("/static/js/main.*.js",new_js,html)

with open("./backend/build/index.html",'w') as text:
    text.write(html)

with open('./backend/build/static/'+css) as text:
    new_css = text.read()
    url = re.findall("url\((/static/media.*?)\)", new_css)
    for idx,u in enumerate(url):
        _u = u.strip("/static/")
        _u = "{% static "+_u+" %}"
        new_css = re.sub(u, _u, new_css)
with open('./backend/build/static/'+css, 'w') as text:
    text.write("{% load static %}"+new_css)