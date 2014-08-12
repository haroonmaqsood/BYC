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
			$('form .form-group').addClass('has-error');
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
		.done(function(responseTxt){ 
			//$('form .message').html(responseTxt.status);
			window.location.href = "/steptwo";
		})
		.fail(function(responseTxt){
			$('form .form-group').addClass('has-error');
			$('form .message').addClass('error').html(responseTxt.status);
		})
	});
	$('input#btn-steptwo').on('click', function(e){
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
		.done(function(responseTxt){ 
			//$('form .message').html(responseTxt.status);
			window.location.href = "/steptwo";
		})
		.fail(function(responseTxt){
			$('form .form-group').addClass('has-error');
			$('form .message').addClass('error').html(responseTxt.status);
		})
	});

});