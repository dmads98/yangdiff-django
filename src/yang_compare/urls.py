from django.urls import path
from .views import(
	compare_page, changeOutput
)

urlpatterns = [
	path('', compare_page),
	path('ajax/test', changeOutput, name = 'ajax_test'),
]