#!/usr/bin/python3

from prepa import prepa
import json

with open('strings.json') as json_data:
    d = json.load(json_data)
    print(d)

