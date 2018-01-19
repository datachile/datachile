import os
import json

#for filename in os.listdir("."):
#    os.rename(filename, filename.split("_")[0]+".jpg")

data = json.load(open('data.json'))

def find_value(code):
    for item in data:
        if item["code"] == code:
            return item["id"]
    return code

for filename in os.listdir("."):
    code = filename.split(".")[0]
    
    os.rename(filename, find_value(code)+".jpg")