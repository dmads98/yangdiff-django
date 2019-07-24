from django.urls import path
from .views import(
	compare_page
)

urlpatterns = [
	path('', compare_page),
]