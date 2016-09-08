# Filters the database of cities
import json

def main():
	f = open("worldcitiespop.txt")

	data = [i.split(",") for i in f.readlines()]
	result = {}
	for i in range(1, len(data)):
		line = [i.replace("\n", "") for i in data[i]]
		pop = line[4].strip()
		if(len(pop) == 0):
			continue

		if(int(pop) < 100000):
			continue

		country = line[0]
		if(country not in result):
			result[country] = []

		result[country].append({"name": line[1].title(), "pop": pop, "lat": line[5], "lng": line[6]})

	print(result)
	print(len(result))

	output = open("cities-filtered.json", "w")
	output.write(json.dumps(result))
	

if __name__ == "__main__":
	main()
