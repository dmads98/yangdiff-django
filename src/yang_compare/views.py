from django.shortcuts import render, get_object_or_404, redirect

# Create your views here.

def compare_page(request):
	context = {"title": "Yang Compare"}
	template_name = "yang_compare/compare.html"
	#template_obj = get_template(template_name)
	#rendered_item = template_obj.render(context)
	return render(request, template_name, context)