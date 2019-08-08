var getVersions = function(){
    $.ajax({
    	url: 'ajax/versions',
    	type: 'GET',
    	success: function(response){
    		console.log(response);
    		let list = '';
        	response.versions.forEach(vers => {
        		list += `<li class="list-group-item">${vers}</li>`;
			});
    		$('#versions-list').append(list);
    	},
    	error : function(response){
			console.log(response)
		}
    });
};

$(document).ready(() => {
	$('#test').on('mouseenter', () => {
	    $('#test').css({
	      color: 'green'
	    })
  	}).on('mouseleave', () => {
	    $('#test').css({
	      color: 'red'
	    })
  	})
  	$("#versions").hide()
	getVersions()
	$("#versions-button").on('click', () => {
		$("#versions").toggle()
		var content = $('#versions-button').html()
		if (content == "Show XR Versions"){
			$('#versions-button').html("Hide XR Versions")
		}
		else{
			$('#versions-button').html("Show XR Versions")
		}
	});
	$('#gender').dropdown();
	$('#states').dropdown();
	$('#language').dropdown();
})
