$( document ).ready(function() {
	console.log('hello');


	$('input#btn-login').on('click', function(e){
		e.preventDefault();
		var formData = {};

		formData.username = $('input[name="username"]').val();
		formData.password = $('input[name="password"]').val();
		
		$.ajax({
		  url:"login",
		  type: "post",
		  data: formData
		})
		.done(function(){
			window.location.href = "/";
		})
		.fail(function(){
			$('form .form-group').addClass('has-error').append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
			$('form .message').addClass('error').html('Wrong login');
		})
	});

	$('input#btn-signup').on('click', function(e){
		e.preventDefault();
		var formData = {};

		formData.email = $('input[name="email"]').val();
		formData.username = $('input[name="username"]').val();
		formData.password = $('input[name="password"]').val();

		$.ajax({
		  url:"Signup",
		  type: "post",
		  data: formData
		})
		.done(function(){ 
			window.location.href = "/steptwo";
		})
		.fail(function(responseTxt){ 
			$('form .form-group').addClass('has-error').append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
			$('form .message').addClass('error').html(responseTxt.status);
		})
	});
	$('input#btn-steptwo').on('click', function(e){
		e.preventDefault();
		var formData = {};

		formData.q1 = $('select[name="q1"]').val();
		formData.q2 = $('input[name="q2"]').val();
		formData.q3 = $('select[name="q3"]').val();
		formData.q4 = $('select[name="q4"]').val();
		formData.q5 = $('select[name="q5"]').val();
		formData.q6 = $('input[name="q6"]').val();
		formData.q7 = $('select[name="q7"]').val();

		$.ajax({
		  url:"steptwo",
		  type: "post",
		  data: formData
		})
		.done(function(){ 
			window.location.href = "/";
		})
		.fail(function(responseTxt){
			$('form .form-group').addClass('has-error').append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
			$('form .message').addClass('error').html(responseTxt.status);
		})
	});

	$('.countable').jqEasyCounter({
		'minChars': 3,
		'maxChars': 80,
		'maxCharsWarning': 85,
		'msgFontSize': '12px',
		'msgFontColor': '#000',
		'msgFontFamily': 'Verdana',
		'msgTextAlign': 'left',
		'msgWarningColor': '#F00',
		'msgAppendMethod': 'insertAfter'				
	});

});