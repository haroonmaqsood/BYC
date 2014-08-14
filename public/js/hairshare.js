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
	$('#btn-comment').on('click', function(e){
		e.preventDefault();
		var formData = {};

		formData.comment = $('textarea[name="comment"]').val();
		if(formData.comment.trim().length > 0){
			$.ajax({
			  url:location.href,
			  type: "post",
			  data: formData
			})
			.done(function(){ 
				window.location.href = location.href;

			})
			.fail(function(responseTxt){
				$('form .form-group').addClass('has-error').append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
				$('form .message').addClass('error').html(responseTxt.status);
			})
		}else{
			$('form .form-group').addClass('has-error').append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
			$('form .message').addClass('error').html('Please write a comment');
		}
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


	if($('#photoEditor').length){

	    var photoEdit = {
	    	imgWidth:$('#cropbox').width(),
	    	imgHeight:$('#cropbox').height(),
	    	imgRotate:0,

	    	init:function(){
	    	 	orgWidth = $('#cropbox').width(),
	    	 	orgHeight = $('#cropbox').height();

				photoEdit.resize();
	  			$('#cropbox').drags();

	    	},
	    	resize: function(){  

	    		var containerWidth = $('#photoEditor').width(),
	    			ratioContainer = containerWidth/600,
	    			heightFrame = 730*ratioContainer,
		    		widthImg = photoEdit.imgWidth,
		  			heightImg = photoEdit.imgHeight,
		  			rotateVal = $('input[name=rotate]').val();

	  			$('#photoEditor').css({width:'100%', height:heightFrame});

	  			if(widthImg < heightImg){
	  				if ((rotateVal == 90)||(rotateVal == 270)){// rotated landscape
		  				//console.log('rotated land')
		  				$('#cropbox').css({width:'100%', height:'auto', 'margin-left':0});
		  			}else{ //portrait
		  				//console.log('port')
		  				$('#cropbox').css({width:'100%', height:'auto', 'margin-left':0});
		  			}
	  			}else if (widthImg > heightImg){ 
	  				if ((rotateVal == 90)||(rotateVal == 270)){// rotated portrait
		  				//console.log('rotated po')
		  				$( '#cropbox' ).css({width:'auto', height:'100%', 'margin-left':'-50%'});
		  			}else{//landscape
		  				//console.log('land')
		  				$( '#cropbox' ).css({width:'auto', height:'100%', 'margin-left':0});
		  			}
	  			}else{
	  				console.log('dont know what sort of image this is')
	  			}

	  		},
	  		rotate:function(){
	  			photoEdit.imgRotate = photoEdit.imgRotate +90;

		    	if(photoEdit.imgRotate>=360){
		    		photoEdit.imgRotate =0;
		    	}
		    	$('input[name=rotate]').val(photoEdit.imgRotate);

		    	photoEdit.resize();
		    	
		    	$('#cropbox').rotate(photoEdit.imgRotate);
	  		}
	    };
	    
	    photoEdit.init();

	  	$(window).resize(function(){
	  		photoEdit.resize();
	  	});
	  
	    $('.btn-rotate').on('click', function(){ 
	    	photoEdit.rotate();
	    });
	}
});