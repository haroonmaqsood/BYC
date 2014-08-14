(function($, window) {
	var hairShaire = window.hs || {},
		hs = { 
			init:function(){
				"use strict";
				$( document ).ready(function() {
					hs.createForm();
					hs.createPhotoEditor();
					hs.createPhotoEditor();
					hs.followButton();
				});
				return false;
			},
			createForm: function(){
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
							//window.location.href = location.href;
							$('ul').prepend('<li><span>' + $('.comments li:first-child').find('.picId').html() +'</span><span>'+$('textarea').val()+'</span><span>'+$('.comments li:first-child').find('.username').html()+'</span></li>');
							 $.scrollTo( 1000, 800 );//change this later
						})
						.fail(function(responseTxt){
							$('form .form-group').addClass('has-error').append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
							$('form .message').addClass('error').html(responseTxt.status);
						})
					}else{
						$('form .form-group').addClass('has-error'); //.append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
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
			},
			createPhotoEditor: function(){
				if($('#photoEditor').length){
				//	var photoEdit = {
			    	
					var imgWidth,
					    imgHeight,
					    imgRotate; 

			    	function init(){
			    	 	imgWidth = $('#cropbox').width();
			    		imgHeight = $('#cropbox').height();
			    		imgRotate = 0;

	
						resize();
			  			$('#cropbox').drags();

			  			//$('input[name=cropX]').val(leftPos);
			            //$('input[name=cropY]').val(topPos);
			           	$('input[name=cropW]').val(imgWidth);
			            $('input[name=cropH]').val(imgHeight);

			    	};
			    	function resize(){  
			    		var containerWidth = $('#photoEditor').width(),
			    			ratioContainer = containerWidth/600,
			    			heightFrame = 730*ratioContainer,
				    		widthImg = imgWidth || $('#cropbox').width(),
				  			heightImg = imgHeight || $('#cropbox').height(),
				  			rotateVal = $('input[name=rotate]').val();

			  			$('#photoEditor').css({width:'100%', height:heightFrame});
console.log(heightImg,widthImg)
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

			  			$('input[name=cropW]').val(imgWidth);
			            $('input[name=cropH]').val(imgHeight);

			  		};
			  		function rotate(){
			  			imgRotate = imgRotate +90;

				    	if(imgRotate>=360){
				    		imgRotate =0;
				    	}
				    	$('input[name=rotate]').val(imgRotate);

				    	resize();
				    	
				    	$('#cropbox').rotate(imgRotate);
			  		}
			   // };
			    
			    init();

			  	$(window).resize(function(){
			  		resize();
			  	});
			  
			    $('.btn-rotate').on('click', function(){ 
			    	rotate();
			    });
			}
		},
		followButton: function(){
			$('#btn-follow').on('click', function(e){ //console.log('test')
				e.preventDefault();
				var formData = {};

				formData.follow = ' ';
		
				$.ajax({
				  url:'http://localhost:3000/kaorina1',//location.href,
				  type: "post",
				  data: formData
				})
				.done(function(responseTxt){ 
					var follow = '';
					if(responseTxt.status == 'unfollowed'){
						follow = 'Follow';
						$('#btn-follow').removeClass('btn-link');
					}else{
						follow = 'Unfollow';
						$('#btn-follow').addClass('btn-link');
					}
						$('#btn-follow').html(follow);
					//}
				})
				.fail(function(responseTxt){
					$('form .form-group').addClass('has-error').append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
					$('form .message').addClass('error').html(responseTxt.status);
				})
				
			});
		}

	}

	hs.init($); 
  	
  	// IE fails to execute the script randomly without the timeout, /shrug
	$(window).load(function () {		
		//Bookadate.customFormElements();
	});

	window.hs = $.extend(hairShaire, hs);
}) (jQuery, window);

//});