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
})