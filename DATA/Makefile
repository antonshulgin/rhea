# Fetch and convert static solar system dataset from CSV to JSON

# https://github.com/Keyang/node-csvtojson
CSV_TO_JSON = ../node_modules/csvtojson/bin/csvtojson


SYSTEM_DATA_URL    = https://www.fuzzwork.co.uk/dump/latest/mapSolarSystems.csv
SYSTEM_DATA_INPUT  = ./SYSTEM_DATA.csv
SYSTEM_DATA_OUTPUT = ./SYSTEM_DATA.json

CSV_TO_JSON_PARAMS_SYSTEM_DATA += --includeColumns="/\b(solarSystemName|solarSystemID|security)\b/"

systems:
	rm -rf $(SYSTEM_DATA_INPUT)
	rm -rf $(SYSTEM_DATA_OUTPUT)

	# Fetch latest CSV system data
	curl $(SYSTEM_DATA_URL) > $(SYSTEM_DATA_INPUT)

	# Convert the CSV to JSON
	$(CSV_TO_JSON) $(CSV_TO_JSON_PARAMS_SYSTEM_DATA) $(SYSTEM_DATA_INPUT) > $(SYSTEM_DATA_OUTPUT)


ITEM_DATA_INPUT_FILENAME = invTypes-nodescription
ITEM_DATA_URL            = https://www.fuzzwork.co.uk/dump/latest/$(ITEM_DATA_INPUT_FILENAME).csv
ITEM_DATA_INPUT_HEAD     = ./$(ITEM_DATA_INPUT_FILENAME)-head.txt
ITEM_DATA_INPUT_BODY     = ./$(ITEM_DATA_INPUT_FILENAME).csv
ITEM_DATA_INPUT          = ./ITEM_DATA.csv
ITEM_DATA_OUTPUT         = ./ITEM_DATA.json

CSV_TO_JSON_PARAMS_ITEM_DATA += --includeColumns="/\b(typeName|typeId)\b/"

items:
	rm -rf $(ITEM_DATA_INPUT)
	rm -rf $(ITEM_DATA_INPUT_BODY)
	rm -rf $(ITEM_DATA_OUTPUT)

	# Fetch latest CSV item data
	curl $(ITEM_DATA_URL) > $(ITEM_DATA_INPUT_BODY)

	# Add headers to the downloaded CSV
	cat $(ITEM_DATA_INPUT_HEAD) $(ITEM_DATA_INPUT_BODY) > $(ITEM_DATA_INPUT)

	# Convert the CSV to JSON
	$(CSV_TO_JSON) $(CSV_TO_JSON_PARAMS_ITEM_DATA) $(ITEM_DATA_INPUT) > $(ITEM_DATA_OUTPUT)


clean:
	rm -rf $(SYSTEM_DATA_INPUT)
	rm -rf $(SYSTEM_DATA_OUTPUT)
	rm -rf $(ITEM_DATA_INPUT)
	rm -rf $(ITEM_DATA_OUTPUT)
