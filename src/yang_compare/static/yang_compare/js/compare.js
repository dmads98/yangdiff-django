var getVersions = function(){
    $.ajax({
    	url: 'ajax/test',
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

var findDiff = function(){
    $.ajax({
    	url: 'ajax/findDiff',
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
	$('#start-btn').on('click', (e) => { 
		$('html, body').animate({
      		scrollTop: $($(e.currentTarget).attr('href')).outerHeight() - 
      		$('.ui.menu .header.item').height() - 
      		$('.ui.menu .header.item').outerHeight()
    	},
    	500,
    	'linear'
  		)
	});
	$('#version-dropdown1').dropdown({
		forceSelection: false,
		clearable: true,
      	filterRemoteData: true,
      	saveRemoteData: false,
		apiSettings: {
      		// this url parses query server side and returns filtered results
      		url: '/compare/ajax/versions',
      		cache: false
    	},
	});

	$('#version-value1').on('change', () => {
		if($('#version-dropdown1').dropdown('get value') == ""){
			$('#file-dropdown1').addClass('disabled')
			$('#file-dropdown1').dropdown('clear')
		}
		else{
			var url = '/compare/ajax/files/' + $('#version-value1').attr('value');
			$('#file-dropdown1').removeClass('disabled')
			$('#file-dropdown1').dropdown({
				forceSelection: false,
				clearable: true,
		      	filterRemoteData: true,
		      	saveRemoteData: false,
				apiSettings: {
		      		// this url parses query server side and returns filtered results
		      		url: url,
		      		cache: false,
		    	},
			});
		}
	})

	$('#version-dropdown2').dropdown({
		forceSelection: false,
		clearable: true,
      	filterRemoteData: true,
      	saveRemoteData: false,
		apiSettings: {
      		// this url parses query server side and returns filtered results
      		url: '/compare/ajax/versions',
      		cache: false
    	},
	});

	$('#version-value2').on('change', () => {
		if($('#version-dropdown2').dropdown('get value') == ""){
			$('#file-dropdown2').addClass('disabled')
			$('#file-dropdown2').dropdown('clear')
		}
		else{
			var url = '/compare/ajax/files/' + $('#version-value2').attr('value');
			$('#file-dropdown2').removeClass('disabled')
			$('#file-dropdown2').dropdown({
				forceSelection: false,
				clearable: true,
		      	filterRemoteData: true,
		      	saveRemoteData: false,
				apiSettings: {
		      		// this url parses query server side and returns filtered results
		      		url: url,
		      		cache: false,
		    	},
			});
		}
	})

	$('#compare-btn').on('click', () => {
		if (($('#version-dropdown1').dropdown('get value') == "") ||
			($('#version-dropdown2').dropdown('get value') == "") ||
			($('#file-dropdown1').dropdown('get value') == "") ||
			($('#file-dropdown2').dropdown('get value') == "")){
			$('.ui.warning.message').show()
		}
		else{
			$('.ui.warning.message').hide()
		}
	})

	$('.ui.warning.message .icon').on('click', () => {
		$('.ui.warning.message').hide();
	})



	$('#clear-btn').on('click', () => {
		$('#version-dropdown1').dropdown('clear')
		$('#version-dropdown2').dropdown('clear')
		$('#file-dropdown1').dropdown('clear')
		$('#file-dropdown2').dropdown('clear')
	})
	
})
