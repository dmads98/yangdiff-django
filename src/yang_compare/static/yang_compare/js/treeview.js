function getTree() {
	  // Some logic to retrieve, or generate tree structure
	  var tree = [
		  {
		    text: "Parent 1",
		    nodes: [
		      {
		        text: "Child 1",
		        nodes: [
		          {
		            text: "Grandchild 1"
		          },
		          {
		            text: "Grandchild 2"
		          }
		        ]
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

$(document).ready(() => {
	$('#test').on('mouseenter', () => {
    $('#test').css({
      color: 'green'
    })
  	}).on('mouseleave', () => {
    $('#test').css({
      color: 'red'
    })
    $('#test').html('Select Files to Compare:')
  	})

	$('#tree').treeview({data: getTree()});

	$("#myClickButton").on('click', () => {
		var info = $("#myClickButton").html();
	    $.ajax({
	    	url: 'ajax/test',
	    	type: 'GET',
	    	data:{
	    		button_info: info
	    	},
	    	success: function(response){
	    		console.log(response)
	    		$('#myOutput').html(response.info.text)
	    	},
	    	error : function(response){
   				console.log(response)
   			}

	    });
	});
})