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

var moduleCompare = function(upload){
	$('#compare-btn').addClass('loading')
	$('#diff pre').empty()
	if (!upload){
		let url = 'ajax/findDiff/' + 
			$('#version-dropdown1').dropdown('get value') + '/' +
			$('#module-dropdown1').dropdown('get value') + '/' +
			$('#version-dropdown2').dropdown('get value') + '/'
		if ($('#module-dropdown2').is(':hidden')){
			url += $('#module-dropdown1').dropdown('get value') + '/' + 
					$('#difftype').dropdown('get value');
			checkFileExistsAndDiff($('#version-dropdown2').dropdown('get value'), $('#module-dropdown1').dropdown('get value'), url)
		}
		else{
			url += $('#module-dropdown2').dropdown('get value') + '/' + 
				$('#difftype').dropdown('get value');
			findDiff(url)
		}
	}
	else{
		$('#upload-form').submit()
	}
};

$('#upload-form').submit(function () {
	var data = new FormData();

  	$.each($("#file-input1")[0].files, function(i, file) {
    	data.append("old_modules", file);
  	});
  	data.append("csrfmiddlewaretoken", $("#file-input1").attr("data-csrf-token"));

  	$.each($("#file-input2")[0].files, function(i, file) {
    	data.append("new_modules", file);
  	});
  	data.append("csrfmiddlewaretoken", $("#file-input2").attr("data-csrf-token"));

  	let url = 'ajax/fileUpload/' + $('#file-upload-select1').dropdown('get value') + '/' + 
  		$('#file-upload-select2').dropdown('get value') + '/' + $('#difftype').dropdown('get value');

	$.ajax({
		url: url,
		type: 'POST',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		success: function(response) {
			console.log(response)
    		if (response.errors.length != 0){
    			$('#error-msg pre').empty()
    			response.errors.forEach(function(element) {
    				$('#error-msg pre').append(element + "\n")
				});
    			$('#error-msg').css('display', 'inline-block');
    		}
    		else{
    			if (response.warnings.length != 0){
	    			$('#post-diff-warning pre').empty()
	    			response.warnings.forEach(function(element) {
	    				$('#post-diff-warning pre').append(element + "\n")
					});
	    			$('#post-diff-warning').css('display', 'inline-block');
    			}		
    			$('#diff pre').append(response.diff)
    			// $('#diff').css('display', 'inline-block');
    			$('#diff').show()
    		}
    		$('#compare-btn').removeClass('loading')
		},
		error: function(response){
			console.log(response)
			alert("error in ajax form submission");
		}
	});
  return false;
});

function findDiff(url){
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
    			$('#error-msg').css('display', 'inline-block');
    		}
    		else{
    			if (response.warnings.length != 0){
	    			$('#post-diff-warning pre').empty()
	    			response.warnings.forEach(function(element) {
	    				$('#post-diff-warning pre').append(element + "\n")
					});
	    			$('#post-diff-warning').css('display', 'inline-block');
    			}		
    			$('#diff pre').append(response.diff)
    			// $('#diff').css('display', 'inline-block');
    			$('#diff').show()
    		}
    		$('#compare-btn').removeClass('loading')
    	},
    	error: function(response){
			console.log(response)
		}
    });
}

function checkFileExistsAndDiff(vers, file, url){
	if ($('#no-module-msg pre').html() == ""){
		$.ajax({
	    	url: '/compare/ajax/view/' + vers + '/' + file,
	    	type: 'GET',
	    	success: function(response){
	    		findDiff(url)
	    	},
	    	error : function(response){
				let message = "The " + $('#module-dropdown1').dropdown('get value') + " module does not exist in the " 
					+ $('#version-dropdown2').dropdown('get value') + " release.\nPlease make another selection."
				$('#no-module-msg pre').append(message)
				$('#no-module-msg').css('display', 'inline-block');
				$('#compare-btn').removeClass('loading')
			}
		});
	}
	else{
		$('#no-module-msg').css('display', 'inline-block');
		$('#compare-btn').removeClass('loading')
	}
}

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
		if ($('#no-module-msg pre').html() == ""){
			var url = '/compare/ajax/view/'
			if (id == 2){
				if ($('#module-dropdown2').is(':hidden')){
					url += $('#version-dropdown2').dropdown('get value') + '/' + $('#module-dropdown1').dropdown('get value');
				}
				else{
					url += $('#version-dropdown2').dropdown('get value') + '/' + $('#module-dropdown2').dropdown('get value');
				}
			}
			else{
				url += $('#version-dropdown1').dropdown('get value') + '/' + $('#module-dropdown1').dropdown('get value');
			}
			$.ajax({
		    	url: url,
		    	type: 'GET',
		    	success: function(response){
		    		console.log(response)
		    		$('#module-view' + id + ' pre').append(response.content)
		    		$('#module-view' + id).modal('show')
		    	},
		    	error: function(response){
					console.log(response)
					let message = "The " + response.responseJSON.file + " module does not exist in the " + response.responseJSON.version + 
						" release.\nPlease make another selection."
					$('#no-module-msg pre').append(message)
					$('#no-module-msg').css('display', 'inline-block');
				}
	    	});
		}
		else{
			$('#no-module-msg').css('display', 'inline-block');
		}
	}
	else{
		$('#module-view' + id).modal('show')
	}
}

var inputChanged = false;
var fileInputAdded = false;
var fileNumError = false;

$(document).ready(() => {
	
	//get-started button
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

	//output-type dropdown initialization
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

	$('#version-dropdown1').on('change', () => {
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

	$('#version-dropdown2').on('change', () => {
		if (!$('#module-dropdown2').is(':hidden')){
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
		}
		else{
			$('#module-view2 pre').empty()
			if ($('#version-dropdown2').dropdown('get value') == ""){
				$('#view-module-btn2').addClass('disabled')
			}
			else{
				$('#view-module-btn2').removeClass('disabled')
			}
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

	$('#upload-button1').on('click', () => {
		$('#file-input1').click()
	})

	$('#file-input1').on('change', () => {
		let input = document.getElementById('file-input1')
		if (input.files.length == 0){
			$('#file-upload-select1').hide()
			$('#file-upload-select1 .menu').empty()
		}
		else if (input.files.length > 15){
			$('#file-upload-select2').hide()
			$('#file-upload-select2 .menu').empty()
			fileNumError = true
		}
		else{
			$('#file-upload-select1').dropdown('clear')
	 		$('#file-upload-select1 .menu').empty()
		  	for (var i = 0; i < input.files.length; i++) {
		  		let moduleName = input.files[i].name.substring(0, input.files[i].name.length - 5)
		  		let element = `<div class="item" data-value="` + input.files[i].name + `" data-text="` + 
		  			moduleName + `">` + moduleName + `</div>`
		    	$('#file-upload-select1 .menu').append(element);
		    }
		    $('#file-upload-select1').css('display', 'inline-block');
		    $('#file-upload-select1').dropdown()
		}
  	});

  	$('#upload-button2').on('click', () => {
		$('#file-input2').click()
	})

	$('#file-input2').on('change', () => {
		let input = document.getElementById('file-input2')
		if (input.files.length == 0){
			$('#file-upload-select2').hide()
			$('#file-upload-select2 .menu').empty()
		}
		else if (input.files.length > 15){
			$('#file-upload-select2').hide()
			$('#file-upload-select2 .menu').empty()
			fileNumError = true
		}
		else{
			$('#file-upload-select2').dropdown('clear')
	 		$('#file-upload-select2 .menu').empty()
		  	for (var i = 0; i < input.files.length; i++) {
		  		let moduleName = input.files[i].name.substring(0, input.files[i].name.length - 5)
		  		let element = `<div class="item" data-value="` + input.files[i].name + `" data-text="` + 
		  			moduleName + `">` + moduleName + `</div>`
		    	$('#file-upload-select2 .menu').append(element);
		    }
		    $('#file-upload-select2').css('display', 'inline-block');
		    $('#file-upload-select2').dropdown()
		}
  	});

  	$('.upload.input').on('change', () => {
  		inputChanged = true
  		$('.ui.diff.message').hide()
  		fileInputAdded = true
  		$('#version-dropdown1').dropdown('clear')
		$('#version-dropdown2').dropdown('clear')
		fileInputAdded = false
		$('.ui.upload.message').hide()
		$('.ui.upload.custom.message pre').empty()
		if (fileNumError){
			fileNumError = false
			$('#upload-num-msg').css('display', 'inline-block');
		}
  	})

  	$('.upload.dropdown').on('change', () => {
  		inputChanged = true
  		$('.ui.diff.message').hide()
		$('#upload-module-msg').hide()
		$('#upload-module-msg pre').empty()
  	})

	$('#compare-btn').on('click', () => {
		let input1 = document.getElementById('file-input1')
		let input2 = document.getElementById('file-input2')
		let upload = false
		if (input1.files.length > 0 || input2.files.length > 0){
			upload = true
			if (input1.files.length == 0){
				$('#upload-missing-msg pre').append("The set of Old Modules is missing.")
				$('#upload-missing-msg').css('display', 'inline-block');
			}
			else if (input2.files.length == 0){
				$('#upload-missing-msg pre').append("The set of New Modules is missing.")
				$('#upload-missing-msg').css('display', 'inline-block');
			}
			else if ($('#file-upload-select1').dropdown('get value') == ""){
				$('#upload-module-msg pre').append("A primary module for the set of Old Modules has not been selected.")
				$('#upload-module-msg').css('display', 'inline-block');
			}
			else if ($('#file-upload-select2').dropdown('get value') == ""){
				$('#upload-module-msg pre').append("A primary module for the set of New Modules has not been selected.")
				$('#upload-module-msg').css('display', 'inline-block');
			}
			else if (inputChanged) {
				inputChanged = false;
				$('#diff').hide()
				moduleCompare(upload)
			}
		}
		else {
			$('.ui.upload.message').hide()
			if (($('#version-dropdown1').dropdown('get value') == "") ||
					($('#version-dropdown2').dropdown('get value') == "") ||
					($('#module-dropdown1').dropdown('get value') == "") || 
					(!$('#module-dropdown2').is(':hidden') && ($('#module-dropdown2').dropdown('get value') == ""))){
				$('#module-missing-msg').css('display', 'inline-block');
			}
			else if (($('#version-dropdown1').dropdown('get value') == $('#version-dropdown2').dropdown('get value')) &&
					($('#module-dropdown2').is(':hidden') || ($('#module-dropdown1').dropdown('get value') == $('#module-dropdown2').dropdown('get value')))) {
				$('#same-module-msg').css('display', 'inline-block');
			}
			else if ($('#no-module-msg pre').html() != ""){
				$('#no-module-msg').css('display', 'inline-block');
			}
			else if (inputChanged) {
				inputChanged = false;
				$('#diff').hide()
				moduleCompare(upload)
			}
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

	$('.ui.main.dropdown').on('change', () => {
		inputChanged = true;
		$('.ui.diff.message').hide()
		$('#no-module-msg pre').empty()
		if (!fileInputAdded){
			if (($('#version-dropdown1').dropdown('get value') != "") ||
					($('#version-dropdown2').dropdown('get value') != "") ||
					($('#module-dropdown1').dropdown('get value') != "") || 
					($('#module-dropdown2').dropdown('get value') != "")) {
				if ($('#show-upload-btn').html() == "Hide Upload Options"){
					$('#show-upload-btn').click()
				}
			}
		}
	})

	$('.ui.diff.message .icon').on('click', () => {
		$('.ui.diff.message').hide();
	})

	$('#clear-btn').on('click', () => {
		$('.ui.dropdown').dropdown('clear')
		if ($('#show-upload-btn').html() == "Hide Upload Options"){
			$('#show-upload-btn').click()
		}
		$('#difftype').dropdown('restore default value');
	})

	$('#different-module-btn').on('click', () => {
		if ($('#different-module-btn').html() == "Compare Different Modules"){
			$('#different-module-btn').html("Compare Same Module")
			$('#module-dropdown2').css('display', 'inline-block');
		}
		else{
			$('#different-module-btn').html("Compare Different Modules")
			$('#module-dropdown2').hide()
		}
	})

	$('#show-upload-btn').on('click', () => {
		//Show Upload Click
		if ($('#show-upload-btn').html() == "Show Upload Options"){
			$('#show-upload-btn').html("Hide Upload Options")
		}
		//Hide Upload Click
		else{
			$('.ui.upload.message').hide()
			$('.ui.upload.message pre').empty()
			$('.ui.upload.dropdown').hide()
			$('.upload.input').val("")
			$('#show-upload-btn').html("Show Upload Options");
		}
		$('#upload-section').toggle();
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
