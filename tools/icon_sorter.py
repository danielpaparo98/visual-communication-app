import os
import json

icons = os.listdir(r'../img/icons/')

output = []

for icon in icons:
    alt = icon[4:-4]
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
    fd.write(json)