from django.http import HttpResponse
from django.shortcuts import render
from django.template.loader import get_template

# def home_page(request):
# 	qs = BlogPost.objects.all()[:5]
# 	context = {"title": "Welcome to Django Blog", "list": qs}
# 	return render(request, "home.html", context)

# def about_page(request):
# 	return render(request, "about.html", {"title": "About"})

# def contact_page(request):
# 	form = ContactForm(request.POST or None)
# 	if form.is_valid():
# 		print(form.cleaned_data)
# 		form = ContactForm()
# 	context = {
# 		"title": "Contact Us",
# 		"form": form
# 	}
# 	return render(request, "form.html", context)

def example_page(request):
	context = {"title": "YangDiff App"}
	template_name = "example.html"
	template_obj = get_template(template_name)
	rendered_item = template_obj.render(context)
	return HttpResponse(rendered_item)