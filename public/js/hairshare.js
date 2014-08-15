(function($, window) {
	var hairShaire = window.hs || {},
		hs = { 
			init:function(){
				"use strict";
				$( document ).ready(function() {
					hs.createForm();
					hs.createPhotoEditor();
					hs.followButton();
					hs.likeButton();
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
					var imgWidth = 0,
					    imgHeight =0 ,
					    imgRotate = 0,
					    img = $('#cropbox'); 

			    	function initPhotoEditor(){ 
			    	 	imgWidth = img.width();
			    		imgHeight = img.height();
			    		imgRotate = 0;
	
						var imgOT = resize();
//console.log(imgOT)
			  			img.drags({orientation:imgOT});

			  		//console.log(img, img.css.height,imgHeight,imgWidth, img.length, img.width())	//$('input[name=cropX]').val(leftPos);
			            //$('input[name=cropY]').val(topPos);
			           //	$('input[name=cropW]').val(imgWidth);
			            //$('input[name=cropH]').val(imgHeight);

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
			   // };
			    
			   
				$(window).load(function(){
			  		initPhotoEditor();
			  	});
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
				  url:location.href,
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
				//.fail(function(responseTxt){
					//$('form .form-group').addClass('has-error').append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
					//$('form .message').addClass('error').html(responseTxt.status);
				//})
				
			});
		},
		likeButton: function(){
			$('#btn-like').on('click', function(e){ //console.log('test')
				e.preventDefault();
				var formData = {};

				formData.like = ' ';
		
				$.ajax({
				  url: location.href +'/like',//'http://localhost:3000/picture/mini-552d/like'
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
					//}
				})
				//.fail(function(responseTxt){
					//$('form .form-group').addClass('has-error').append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
					//$('form .message').addClass('error').html(responseTxt.status);
				//})
				
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