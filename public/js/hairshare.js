(function($, window) {
	var hairShaire = window.hs || {},
		hs = { 
			init:function(){
				"use strict";
				$( document ).ready(function() {
					hs.registeration();
					hs.login();
					hs.createPhotoEditor();
					hs.followButton();
					hs.likeButton();
					hs.commentButton();
				});
				return false;
			},
			registeration: function(){
				if($('#signup-form').length){

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
				}
			
			},
			login: function(){
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
			},
			createPhotoEditor: function(){
				if($('#photoEditor').length){
					var imgWidth = 0,
					    imgHeight =0 ,
					    imgRotate = 0,
					    img = $('#cropbox'); 

			    	function initPhotoEditor(){ 
			    	 	imgWidth = img.width();
			    		imgHeight = img.height();
			    		imgRotate = 0;
	
						var imgOT = resize();

			  			img.drags({orientation:imgOT});

			  			addCounter();

			  			$('#btn-rotate').on('click', function(){ 
					    	rotate(); 
					    });

			    	};
			    	function resize(){  
			    		var containerWidth = $('#photoEditor').width(),
			    			ratioContainer = containerWidth/600,
			    			heightFrame = 730*ratioContainer,
				    		widthImg = imgWidth,
				  			heightImg = imgHeight,
				  			rotateVal = $('input[name=rotate]').val(),
				  			orientation;

			  			$('#photoEditor').css({width:'100%', height:heightFrame});

			  			if(widthImg < heightImg){
			  				if ((rotateVal == 90)||(rotateVal == 270)){// rotated landscape
				  				//console.log('rotated land')
				  				img.css({width:heightFrame, height:'auto', 'margin-left':0});
				  				orientation = 'land';
				  			}else{ //portrait
				  				//console.log('port')
				  				img.css({width:'100%', height:'auto', 'margin-left':0});
				  				orientation = 'port';
				  			}
			  			}else if (widthImg > heightImg){ 
			  				if ((rotateVal == 90)||(rotateVal == 270)){// rotated portrait
				  				//console.log('rotated po')
				  				img.css({width:'auto', height:'100%', 'margin-left':'-50%'});
				  				orientation = 'port';
				  			}else{//landscape
				  				//console.log('land')
				  				img.css({width:'auto', height:'100%', 'margin-left':0});
				  				orientation = 'land';
				  			}
			  			}else{
			  				console.log('dont know what sort of image this is')
			  			}

			  			$('input[name=cropW]').val(imgWidth);
			            $('input[name=cropH]').val(imgHeight);

			            return orientation;
			  		};
			  		function rotate(){
			  			imgRotate = imgRotate +90;

				    	if(imgRotate>=360){
				    		imgRotate =0;
				    	}
				    	$('input[name=rotate]').val(imgRotate);

				    	resize();
				    	
				    	img.rotate(imgRotate);
			  		}
			   		
			   		function addCounter(){
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
			    	}
			   
					$(window).load(function(){
				  		initPhotoEditor();
				  	});
				  	$(window).resize(function(){
				  		resize();
				  	});
				    
				}
			},
			followButton: function(){
				if($('#follow-form').length){
					$('#btn-follow').on('click', function(e){ //console.log('test')
						e.preventDefault();
						var formData = {};

						formData.follow = ' ';
				
						$.ajax({
						  url:location.href,
						  type: "post",
						  data: formData
						})
						.done(function(responseTxt){ 
							var follow = '';
							if(responseTxt.status == 'unfollowed'){
								follow = 'Follow';
								$('#btn-follow').removeClass('btn-link').addClass('btn-primary');
							}else{
								follow = 'Unfollow';
								$('#btn-follow').removeClass('btn-primary').addClass('btn-link');
							}
								$('#btn-follow').html(follow);
						});
					});
				};
			},
			likeButton: function(){
				if($('#like-form').length){
					$('#btn-like').on('click', function(e){ //console.log('test')
						e.preventDefault();
						var formData = {};

						formData.like = ' ';
				
						$.ajax({
						  url: location.href +'/like',
						  type: "post",
						  data: formData
						})
						.done(function(responseTxt){ 
							var follow = '';
							if(responseTxt.status == 'unliked'){
								follow = 'like';
								$('#btn-like').removeClass('btn-link');
							}else{
								follow = 'unlike';
								$('#btn-like').addClass('btn-link');
							}
								$('#btn-like').html(follow);
						});
					});
				};
			},
			commentButton: function(){
				$('#btn-comment').on('click', function(e){
					e.preventDefault();
					var formData = {};

					formData.comment = $('input[name="comment"]').val();

					if(formData.comment.trim().length > 0){
						$.ajax({
						  url:location.href,
						  type: "post",
						  data: formData
						})
						.done(function(){ 
							//window.location.href = location.href;
							var position,
								comment = '<a class="pull-left" href="#"><img src="/img/place-holder.jpg"  alt="place-holder" /></a>';
								comment = comment + '<div class="media-body"><span class="username">'+$('input[name=username]').val()+' </span>';
								comment = comment + '<span class="comment">'+$('input[name=comment]').val()+'</span></div>';

							$('#comments').find('ul').prepend('<li class="media">' + comment +'</li>');

							 position = $('#comments ul li:first-child').position().top;
							 $.scrollTo( position, 500 );//change this later
						})
						.fail(function(responseTxt){
							$('form .form-group').addClass('has-error').append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
							$('form .message').addClass('error').html(responseTxt.status);
						})
					}else{
						$('form .input-group').addClass('has-error'); //.append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
						$('form .message').addClass('error').html('Please write a comment');
					}
				});
			}

		}

	hs.init($); 
  	
  	// IE fails to execute the script randomly without the timeout, /shrug
	$(window).load(function () {		
		//hs.customFormElements();
	});

	window.hs = $.extend(hairShaire, hs);
}) (jQuery, window);
