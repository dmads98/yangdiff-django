from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
import requests
import json

# Create your views here.

def compare_page(request):
	context = {"title": "Yang Compare"}
	template_name = "yang_compare/compare.html"
	#template_obj = get_template(template_name)
	#rendered_item = template_obj.render(context)
	return render(request, template_name, context)

def changeOutput(request):
	if request.method == "GET" and request.is_ajax():
		text = request.GET.get("button_info")
		print(text)
		info = {"text": "test"}
		return JsonResponse({"info": info}, status=200)
	return JsonResponse({"success":False}, status=400)

def getVersions(request):
	if request.method == "GET" and request.is_ajax():
		text = request.GET.get("button_info")
		print(text)
		vers_req = requests.get('https://api.github.com/repos/YangModels/yang/contents/vendor/cisco/xr')
		json = vers_req.json()
		versions = []
		for el in json:
			if (el["type"] == "dir"):
				versions.append((el["name"]))
		return JsonResponse({"versions" :versions}, status=200)
	return JsonResponse({"success":False}, status=400)