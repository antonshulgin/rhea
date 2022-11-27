# Fetch and convert static solar system dataset from CSV to JSON

CSV_TO_JSON        = ../node_modules/csvtojson/bin/csvtojson
CSV_TO_JSON_INPUT  =  ./mapSolarSystems.csv
CSV_TO_JSON_OUTPUT =  ./mapSolarSystems.json

systems:
	rm -rf ./mapSolarSystems.csv
	rm -rf ./mapSolarSystems.json
	curl https://www.fuzzwork.co.uk/dump/latest/mapSolarSystems.csv > $(CSV_TO_JSON_INPUT)
	$(CSV_TO_JSON) $(CSV_TO_JSON_INPUT) > $(CSV_TO_JSON_OUTPUT)
