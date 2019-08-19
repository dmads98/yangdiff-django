// var getVersions = function(){
//     $.ajax({
//     	url: 'ajax/test',
//     	type: 'GET',
//     	success: function(response){
//     		let list = '';
//         	response.versions.forEach(vers => {
//         		list += `<div class="item">${vers}</div>`;
// 			});
//     		$('#versions-list').append(list);
//     	},
//     	error : function(response){
// 			console.log(response)
// 		}
//     });
// };

var findDiff = function(){
	$('#compare-btn').addClass('loading')
	$('#diff pre').empty()
	url = 'ajax/findDiff/' + 
		$('#version-dropdown1').dropdown('get value') + '/' +
		$('#module-dropdown1').dropdown('get value') + '/' +
		$('#version-dropdown2').dropdown('get value') + '/' +
		$('#module-dropdown2').dropdown('get value') + '/' + 
		$('#difftype').dropdown('get value');
    $.ajax({
    	url: url,
    	type: 'GET',
    	success: function(response){
    		console.log(response)
    		if (response.errors.length != 0){
    			$('#error-msg pre').empty()
    			response.errors.forEach(function(element) {
    				$('#error-msg pre').append(element + "\n")
				});
    			$('#error-msg').show()
    		}
    		else{
    			if (response.warnings.length != 0){
	    			$('#post-diff-warning pre').empty()
	    			response.warnings.forEach(function(element) {
	    				$('#post-diff-warning pre').append(element + "\n")
					});
	    			$('#post-diff-warning').show()
    			}		
    			$('#diff pre').append(response.diff)
    			$('#diff').show()
    		}
    		$('#compare-btn').removeClass('loading')
    	},
    	error: function(response){
			console.log(response)
		}
    });
};

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

function contentDownload(content, filename){
	// Create an invisible A element
	const $temp = $("<a>", {id: "download-temp"});
	$temp.hide()
	$('body').append($temp);

	// Set the HREF to a Blob representation of the data to be downloaded
	$("#download-temp").attr("href", window.URL.createObjectURL(new Blob([content], {type: "text/plain"})));

	// Use download attribute to set desired file name
	$("#download-temp").attr("download", filename);

	// Trigger the download by simulating click
	// Cannot simulate click on jquery anchor element for security reasons
	document.getElementById('download-temp').click();

	// Cleanup
	window.URL.revokeObjectURL($("#download-temp").attr("href"));
	$("#download-temp").remove();
}

function handleModal(id){
	if ($('#module-view' + id + ' pre').html() == ""){
		var url = '/compare/ajax/view/' + $('#version-dropdown' + id).dropdown('get value') + '/' + $('#module-dropdown' + id).dropdown('get value');
		$.ajax({
	    	url: url,
	    	type: 'GET',
	    	success: function(response){
	    		$('#module-view' + id + ' pre').append(response.content)
	    		$('#module-view' + id).modal('show')
	    	},
	    	error : function(response){
				console.log(response)
			}
    	});
	}
	else{
		$('#module-view' + id).modal('show')
	}
}

var inputChanged = false;

$(document).ready(() => {
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
	$('#difftype').dropdown();

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
		$('#module-dropdown1 .menu').empty()
		$('#module-dropdown1').dropdown('clear')
		if($('#version-dropdown1').dropdown('get value') == ""){
			$('#module-dropdown1').addClass('disabled')
		}
		else{
			var url = '/compare/ajax/files/' + $('#version-dropdown1').dropdown('get value');
			$('#module-dropdown1').removeClass('disabled')
			$('#module-dropdown1').dropdown({
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

	$('#module-dropdown1').on('change', () => {
		$('#module-view1 pre').empty()
		if ($('#module-dropdown1').dropdown('get value') != ""){
			$('#view-module-btn1').removeClass('disabled')
		}
		else{
			$('#view-module-btn1').addClass('disabled')
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
		$('#module-dropdown2 .menu').empty()
		$('#module-dropdown2').dropdown('clear')
		if($('#version-dropdown2').dropdown('get value') == ""){
			$('#module-dropdown2').addClass('disabled')
		}
		else{
			var url = '/compare/ajax/files/' + $('#version-dropdown2').dropdown('get value');
			$('#module-dropdown2').removeClass('disabled')
			$('#module-dropdown2').dropdown({
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

	$('#module-dropdown2').on('change', () => {
		$('#module-view2 pre').empty()
		if ($('#module-dropdown2').dropdown('get value') != ""){
			$('#view-module-btn2').removeClass('disabled')
		}
		else{
			$('#view-module-btn2').addClass('disabled')
		}
	})

	$('#compare-btn').on('click', () => {
		if (($('#version-dropdown1').dropdown('get value') == "") ||
				($('#version-dropdown2').dropdown('get value') == "") ||
				($('#module-dropdown1').dropdown('get value') == "") ||
				($('#module-dropdown2').dropdown('get value') == "")){
			$('#module-missing-msg').show()
		}
		else if (($('#version-dropdown1').dropdown('get value') == $('#version-dropdown2').dropdown('get value')) &&
				($('#module-dropdown1').dropdown('get value') == $('#module-dropdown2').dropdown('get value'))) {
			$('#same-module-msg').show()
		}
		else if (inputChanged) {
			inputChanged = false;
			$('#diff').hide()
			findDiff()
		}
	})

	$('#download-btn').on('click', () => {
		let content = $('#diff pre').html();
		let filename = $('#version-dropdown1').dropdown('get text') + "_" + 
			$('#module-dropdown1').dropdown('get text') + "_" + 
			$('#version-dropdown2').dropdown('get text') + "_" + 
			$('#module-dropdown2').dropdown('get text') + "_diff" + ".txt"
		contentDownload(content, filename)
	})

	$('.ui.dropdown').on('change', () => {
		inputChanged = true;
		$('.ui.diff.message').hide()
	})

	$('.ui.diff.message .icon').on('click', () => {
		$('.ui.diff.message').hide();
	})

	$('#clear-btn').on('click', () => {
		$('#version-dropdown1').dropdown('clear')
		$('#version-dropdown2').dropdown('clear')
		$('#module-dropdown1').dropdown('clear')
		$('#module-dropdown2').dropdown('clear')
	})

	$('#different-module-btn').on('click', () => {
		console.log("test test")
	})

	$('#view-module-btn1').on('click', () => {
		handleModal(1)
	})

	$('#modal1-download-btn').on('click', () => {
		let content = $('#module-view1 pre').html();
		let filename = $('#version-dropdown1').dropdown('get text') + "_" + 
			$('#module-dropdown1').dropdown('get text') + ".yang"
		contentDownload(content, filename)
	})

	$('#view-module-btn2').on('click', () => {
		handleModal(2)
	})

	$('#modal2-download-btn').on('click', () => {
		let content = $('#module-view2 pre').html();
		let filename = $('#version-dropdown2').dropdown('get text') + "_" + 
			$('#module-dropdown2').dropdown('get text') + ".yang"
		contentDownload(content, filename)
	})
	
})
