var getVersions = function(){
    $.ajax({
    	url: 'ajax/test',
    	type: 'GET',
    	success: function(response){
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
	url = 'ajax/findDiff/' + 
		$('#version-dropdown1').dropdown('get value') + '/' +
		$('#file-dropdown1').dropdown('get value') + '/' +
		$('#version-dropdown2').dropdown('get value') + '/' +
		$('#file-dropdown2').dropdown('get value');
	console.log(url)
    $.ajax({
    	url: url,
    	type: 'GET',
    	success: function(response){
    		console.log(response);
    	},
    	error : function(response){
			console.log(response)
		}
    });
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleModal(id){
	if ($('#file-view' + id + ' pre').html() == ""){
		var url = '/compare/ajax/view/' + $('#version-dropdown' + id).dropdown('get value') + '/' + $('#file-dropdown' + id).dropdown('get value');
		$.ajax({
	    	url: url,
	    	type: 'GET',
	    	success: function(response){
	    		$('#file-view' + id + ' pre').append(response.content)
	    	},
	    	error : function(response){
				console.log(response)
			}
    	});
    	await sleep(300)
	}
	if ($('#file-view' + id + ' pre').html() != ""){
		$('#file-view' + id).modal('show')
	}
}

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
		$('#file-dropdown1 .menu').empty()
		$('#file-dropdown1').dropdown('clear')
		if($('#version-dropdown1').dropdown('get value') == ""){
			$('#file-dropdown1').addClass('disabled')
		}
		else{
			var url = '/compare/ajax/files/' + $('#version-dropdown1').dropdown('get value');
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

	$('#file-dropdown1').on('change', () => {
		$('#file-view1 pre').empty()
		if ($('#file-dropdown1').dropdown('get value') != ""){
			$('#view-file-btn1').removeClass('disabled')
		}
		else{
			$('#view-file-btn1').addClass('disabled')
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
		$('#file-dropdown2 .menu').empty()
		$('#file-dropdown2').dropdown('clear')
		if($('#version-dropdown2').dropdown('get value') == ""){
			$('#file-dropdown2').addClass('disabled')
		}
		else{
			var url = '/compare/ajax/files/' + $('#version-dropdown2').dropdown('get value');
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

	$('#file-dropdown2').on('change', () => {
		$('#file-view2 pre').empty()
		if ($('#file-dropdown2').dropdown('get value') != ""){
			$('#view-file-btn2').removeClass('disabled')
		}
		else{
			$('#view-file-btn2').addClass('disabled')
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
			$('.ui.warning.message').hide();
			findDiff()
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

	$('#view-file-btn1').on('click', () => {
		handleModal(1)
	})

	$('#view-file-btn2').on('click', () => {
		handleModal(2)
	})

	$('#compare-btn').on('click', () => {
		$('.ui.modal').modal('show')
	})
	
})
