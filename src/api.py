import urllib.parse
import requests

def main():
	# people = requests.get('http://api.open-notify.org/astros.json')
	# people_json = people.json()
	# #To print the number of people in space
	# print("Number of people in space:",people_json['number'])
	# #To print the names of people in space using a for loop
	# for p in people_json['people']:
	#     print(p['name'])

	# parameter = {"rel_rhy":"jingle"}
	# request = requests.get('https://api.datamuse.com/words',parameter)
	# rhyme_json = request.json()
	# for i in rhyme_json[0:3]:
 # 		print(i['word'])
	# print(request.status_code)
	github_request()

def github_request():
	request = requests.get('https://raw.githubusercontent.com/YangModels/yang/master/vendor/cisco/xr/633/Cisco-IOS-XR-cdp-oper.yang')
	print(request.text)
	print(request.status_code)

if __name__ == "__main__":
	main()