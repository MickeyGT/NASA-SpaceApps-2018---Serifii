import json
import csv

with open('Meteorite_Labels.csv', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

with open('labels.json', 'w') as f:
    json.dump(rows, f)