var getVersions = function(){
    $.ajax({
    	url: 'ajax/versions',
    	type: 'GET',
    	success: function(response){
    		console.log(response);
    		let list = '';
        	response.versions.forEach(vers => {
        		list += `<div class="item">${vers}</div>`;
			});
    		$('#versions-list').append(list);
    	},
    	error : function(response){
			console.log(response)
		}
    });
};

$(document).ready(() => {
  	$(".versions").hide()
	getVersions()
	$("#versions-button").on('click', () => {
		$(".versions").toggle()
		var content = $('#versions-button').html()
		if (content == "Show XR Versions"){
			$('#versions-button').html("Hide XR Versions")
		}
		else{
			$('#versions-button').html("Show XR Versions")
		}
	});
})
