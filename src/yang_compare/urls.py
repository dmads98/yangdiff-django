from django.urls import path
from .views import(
	compare_page, getDropDownVersions, getDropDownFiles, compareFiles, getFileContent, fileUpload
)

urlpatterns = [
	path('', compare_page),
	path('ajax/versions', getDropDownVersions, name = 'ajax_versions'),
	path('ajax/files/<str:vers>', getDropDownFiles, name = 'ajax_files'),
	path('ajax/findDiff/<str:oldvers>/<str:oldfile>/<str:newvers>/<str:newfile>/<str:difftype>', compareFiles, name = 'ajax_findDiff'),
	path('ajax/view/<str:vers>/<str:file>', getFileContent),
	path('ajax/fileUpload/<str:oldPrimary>/<str:newPrimary>/<str:difftype>', fileUpload)
]