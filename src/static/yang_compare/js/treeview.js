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
	var info = $("#myClickButton").html();
    $.ajax({
    	url: 'ajax/versions',
    	type: 'GET',
    	data:{
    		button_info: info
    	},
    	success: function(response){
    		let rows =  '';
        	response.versions.forEach(vers => {
        		rows += `
		        <tr>
		            <td>${room.room_number}</td>
		            <td>${room.name}</td>
		            <td>${room.nobeds}</td>
		            <td>${room.room_type}</td>
		            <td>
		                <button class="btn deleteBtn" data-id="${room.id}">Delete</button>
		                <button class="btn updateBtn" data-id="${room.id}">Update</button>
		            </td>
		        </tr>`;
			});
    		console.log(response)
    		//$('#myOutput').html(response.info.text)
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

  	//$("#versions").hide()

	$('#tree').treeview({data: getTree()});

	$("#myClickButton").on('click', getVersions);
})
