from django.urls import path
from .views import(
	compare_page, getDropDownVersions, getDropDownFiles, getVersions
)

urlpatterns = [
	path('', compare_page),
	path('ajax/versions', getDropDownVersions, name = 'ajax_versions'),
	path('ajax/files/<str:vers>', getDropDownFiles, name = 'ajax_files'),
	path('ajax/test', getVersions, name = 'ajax_test'),
]