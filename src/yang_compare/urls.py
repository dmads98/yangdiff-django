from django.urls import path
from .views import(
	compare_page, getDropDownVersions, getVersions
)

urlpatterns = [
	path('', compare_page),
	path('ajax/test', getDropDownVersions, name = 'ajax_test'),
	path('ajax/versions', getVersions, name = 'ajax_versions'),
]