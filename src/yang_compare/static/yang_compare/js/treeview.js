var getTree = function() {
	// Some logic to retrieve, or generate tree structure
	var tree = [
	  {
	    text: "Parent 1",
	    nodes: [
	      {
	        text: "Child 1",
	        // nodes: [
	        //   {
	        //     text: "Grandchild 1"
	        //   },
	        //   {
	        //     text: "Grandchild 2"
	        //   }
	        // ]
	      },
	      {
	        text: "Child 2"
	      }
	    ]
	  },
	  {
	    text: "Parent 2"
	  },
	  {
	    text: "Parent 3"
	  },
	  {
	    text: "Parent 4"
	  },
	  {
	    text: "Parent 5"
	  }
	];
	return tree;
}

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

	$('#tree').treeview({data: getTree()});
	getVersions()
	$("#versions").hide()
	$("#myClickButton").on('click', () => {
		$("#versions").toggle()
		var content = $('#myClickButton').html()
		if (content == "Show XR Versions"){
			$('#myClickButton').html("Hide XR Versions")
		}
		else{
			$('#myClickButton').html("Show XR Versions")
		}
	});
})
