# Filters the database of cities
import json

def main():
	f = open("worldcitiespop.txt")

	seen_pops = []

	data = [i.split(",") for i in f.readlines()]
	result = {}
	for i in range(1, len(data)):
		line = [i.replace("\n", "") for i in data[i]]
		pop = line[4].strip()
		if(len(pop) == 0):
			continue

		pop = int(pop)
		if(pop < 400000):
			continue

		if pop in seen_pops:
			continue

		seen_pops.append(pop)
		
		country = line[0]
		if(country not in result):
			result[country] = []

		result[country].append({"name": line[1].title(), "pop": pop, "lat": line[5], "lng": line[6]})


	count = 0
	for country in result:
		if(len(result[country]) > 50): # max 50 cities per country
			city_set = sorted(result[country], key=lambda x: -x["pop"])[:50]
			result[country] = city_set
		print(country, len(result[country]))
		count += len(result[country])

	print(result)
	print(len(result), count)

	output = open("cities-filtered.json", "w")
	output.write(json.dumps(result))
	

if __name__ == "__main__":
	main()
