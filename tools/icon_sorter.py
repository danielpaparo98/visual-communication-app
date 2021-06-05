import os
import json
import re

icons = os.listdir(r'../img/icons/')

output = []

for icon in icons:
    alt = re.sub(r'-\d\d\d-', ' ', icon)
    desc = ''

    output.append(
        {
            'addr': 'img/icons/'+icon,
            'alt': alt ,
            'desc': desc,
        }
    )

print(output)
json = json.dumps(output)

with open("icons.json", "w") as fd:
    #print(json)
    fd.write(json)