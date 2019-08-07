from django.urls import path
from .views import(
	compare_page, changeOutput, getVersions
)

urlpatterns = [
	path('', compare_page),
	path('ajax/test', changeOutput, name = 'ajax_test'),
	path('ajax/versions', getVersions, name = 'ajax_versions'),
]