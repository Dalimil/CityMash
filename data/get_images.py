import json
import requests
import sys



def main():
	count = 0
	f = open("cities-filtered.json")
	data = json.loads(f.read())

	cities = {}
	for country in data:
		print(country, len(data[country]))
		for city in data[country]:
			count += 1

			print(count)
			name = city["name"].replace(" ", "+") + "+city"
			urls = []
			response = requests.get("https://api.cognitive.microsoft.com/bing/v5.0/images/search?q={}&count=10".format(name),
				headers={"Ocp-Apim-Subscription-Key": "751a1feaa6d74b91a27e83b64fee640d"})
			try:
				result = response.json()["value"];
				urls = [{"big": i["contentUrl"], "small": i["thumbnailUrl"]} for i in result]

				cities[city["name"]] = urls
			except:
				print(city["name"])


	print(json.dumps(cities))
	output = open("cities-images.json", "w")
	output.write(json.dumps(cities))
	

if __name__ == "__main__":
	main()

