# Fetch and convert static solar system dataset from CSV to JSON

CSV_TO_JSON = ../node_modules/csvtojson/bin/csvtojson


SYSTEM_DATA_URL    = https://www.fuzzwork.co.uk/dump/latest/mapSolarSystems.csv
SYSTEM_DATA_INPUT  = ./mapSolarSystems.csv
SYSTEM_DATA_OUTPUT = ./mapSolarSystems.json

systems:
	rm -rf $(SYSTEM_DATA_INPUT)
	rm -rf $(SYSTEM_DATA_OUTPUT)
	curl $(SYSTEM_DATA_URL) > $(SYSTEM_DATA_INPUT)
	$(CSV_TO_JSON) $(SYSTEM_DATA_INPUT) > $(SYSTEM_DATA_OUTPUT)


#ITEM_DATA_URL    = https://www.fuzzwork.co.uk/dump/latest/invTypes-nodescription.csv
ITEM_DATA_URL    = https://www.fuzzwork.co.uk/dump/latest/invTypes.csv
ITEM_DATA_INPUT  = ./invTypes.csv
ITEM_DATA_OUTPUT = ./invTypes.json

items:
	rm -rf $(ITEM_DATA_INPUT)
	rm -rf $(ITEM_DATA_OUTPUT)

	curl $(ITEM_DATA_URL) > $(ITEM_DATA_INPUT)
	$(CSV_TO_JSON) $(ITEM_DATA_INPUT) > $(ITEM_DATA_OUTPUT)


clean:
	rm -rf $(SYSTEM_DATA_INPUT)
	rm -rf $(SYSTEM_DATA_OUTPUT)
	rm -rf $(ITEM_DATA_INPUT)
	rm -rf $(ITEM_DATA_OUTPUT)
