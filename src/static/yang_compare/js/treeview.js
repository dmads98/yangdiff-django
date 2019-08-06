$(document).ready(() => {
	$('#test').on('mouseenter', () => {
    $('#test').addClass('green')
  }).on('mouseleave', () => {
    $('#test').removeClass('green')
  })
})