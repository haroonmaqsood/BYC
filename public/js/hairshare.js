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
					hs.loadMorePhotos();
					hs.uploadPhoto();
					hs.loadImages();
				});
				return false;
			},
			registeration: function(){
				if($('#signup-form').length){

					$('input#btn-signup').on('click', function(e){
						e.preventDefault();
						var formData = {},
							url = "Signup";

						formData.email = $('input[name="email"]').val();
						formData.username = $('input[name="username"]').val();
						formData.password = $('input[name="password"]').val();

						$.ajax({
						  url: url,
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
						var formData = {},
							url = "steptwo";

						formData.q1 = $('select[name="q1"]').val();
						formData.q2 = $('input[name="q2"]').val();
						formData.q3 = $('select[name="q3"]').val();
						formData.q4 = $('select[name="q4"]').val();
						formData.q5 = $('select[name="q5"]').val();
						formData.q6 = $('input[name="q6"]').val();
						formData.q7 = $('select[name="q7"]').val();

						$.ajax({
						  url: url,
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
						var formData = {},
							url = "login";

						formData.username = $('input[name="username"]').val();
						formData.password = $('input[name="password"]').val();
						
						$.ajax({
						  url:url,
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
				if(!$('#editForm').length)
					return false;


					var cropHS 				= new CROP(''),
					unCroppedPicture 	= $('#unCroppedPicture').val();
					cropHS.init('.hs');
					cropHS.loadImg(unCroppedPicture);

					function crop() {
						if ($(window).width() <= 600) {
							$('.cropMain').html('');
							$('.cropSlider').html('');
							$('#crop').removeClass('hs');
							$('#crop').addClass('hs-mobile');
							cropHS.init('.hs-mobile');
							cropHS.loadImg(unCroppedPicture);
						} else {
							$('.cropMain').html('');
							$('.cropSlider').html('');
							$('#crop').removeClass('hs-mobile');
							$('#crop').addClass('hs');
							cropHS.init('.hs');
							cropHS.loadImg(unCroppedPicture);
						}
					}

					crop();
					$(window).resize(function() {
						crop();
					});

					// send coordinates for processing
					// you may call the coordinates with the function coordinates(one);
					$(document).on('click', 'button', function(e) {
						e.preventDefault();
						coordinates(cropHS);
						var title = $('#title').val();
						if ( title.trim().length >= 3 && title.length <= 80 ) {
							
							var formData = {};

							formData.title = $('#title').val();
							formData.cropX = $('#cropX').val();
							formData.cropY = $('#cropY').val();
							formData.cropW = $('#cropW').val();
							formData.cropH = $('#cropH').val();
							console.log(formData.cropX)
				      console.log(formData.cropY)
				      console.log(formData.cropW)
				      console.log(formData.cropH)

							$.ajax({
							  url: 	document.URL,
							  type: "post",
							  data: formData
							})
							.done(function(response){
								window.location.href = response.redirect;
							})
							.fail(function(response){
								$('.alert-danger').html(response.responseJSON.reason).slideDown();
							})

							// $('#editForm').submit();
			      } else {     	
			        $('.alert-danger').html('Title Size must be between 3-80 Characters').slideDown();
			      }

						
					});


				// $('input#imageTitle').on('click', function(e){
				// 	e.preventDefault();
					
				// });
			},
			followButton: function(){
				var btn = $('#btn-follow');
				if(btn.length){

					jQuery('.btn-follow').each(function() {
					    var currentBtn 	= $(this),
					    		value 			= currentBtn.data('username');

					    
					});

					btn.on('click', function(e){ 
						e.preventDefault();
						var formData = {},
							url = location.href;

						formData.follow = ' ';
				
						$.ajax({
						  url:url,
						  type: "post",
						  data: formData
						})
						.done(function(responseTxt){ 
							var follow = '';
							if(responseTxt.status == 'unfollowed'){
								follow = 'Follow';
								btn.removeClass('btn-link').addClass('btn-primary');
							}else{
								follow = 'Unfollow';
								btn.removeClass('btn-primary').addClass('btn-link');
							}
								btn.html(follow);
						});
					});
				};
			},
			likeButton: function(){
				if($('#like-form').length){
					$('#btn-like').on('click', function(e){
						e.preventDefault();
						var formData = {},
							url = location.href +'/like';

						formData.like = ' ';
				
						$.ajax({
						  url: url,
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
				if($('#btn-comment').length){
					$('#btn-comment').on('click', function(e){
						e.preventDefault();
						var formData = {},
							url = location.href;

						formData.comment = $('input[name="comment"]').val();

						if(formData.comment.trim().length > 0){
							$.ajax({
							  url:url,
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
			},
			loadMorePhotos:function(){
				if($('#btn-loadMorePhotos').length){
					var btn = $('#btn-loadMorePhotos'),
						//container = btn.closest('div.mobile-only'),
						hiddenDiv = $('#morePhotos'),
						imgSize;

					function setBtnSize(){
						imgSize = container.prev('div').find('img').height();

						btn.height(imgSize);	
					}

					$(window).load(function(){
				  		//setBtnSize();
				  		btn.on('click', function(e){
							e.preventDefault(); 
							hiddenDiv.fadeIn();
						})
				  	});

				  	$(window).resize(function(){
				  		//setBtnSize();
				  	});
				}
			},
			uploadPhoto: function(){
				if($('#upload-form').length){
					var form = $('#upload-form'),
						fileUpload = form.find('input[type="file"]'),
						filename = form.find('input[name="filename"]'),
						progress = form.find('.progress'),
						progressBar = progress.find('.progress-bar'),
						value = 0,
						interval= null;

					function animateProgressBar(){
						if(value < 100) {
							value = value + 10; 
							progressBar.attr('style', 'width: '+value+'%');
							progressBar.attr('aria-valuenow',value);
						}else{
							form.submit();
							clearInterval(interval);
						}
					}

					fileUpload.on('change',function(){
													
		        var avatar = $(this).val();
		        var extension = avatar.split('.').pop().toUpperCase();
		        if(avatar.length < 1) {
		            avatarok = 0;
		            $('.alert-danger').html("Woops looks like you have not selected an image yet.");
		        }
		        else if (extension!="PNG" && extension!="JPG" && extension!="JPEG"){
		            avatarok = 0;
		            $('.alert-danger').html("invalid file type please only upload PNG or JPEG images. You upload a "+extension);
		        }
		        else {
		            avatarok = 1;
		        }
		        if(avatarok == 1) {
		            
		          value = 0;
							filename.val($(this).val());
							progress.show();
							interval = setInterval(animateProgressBar,200);

		        }
		        else {
		            $('.alert-danger').slideDown();
		        }
		        return false;



					})
				}
			},
			loadPopular :function(){
				var formData = {},
					url = '/api/popular',
					activeTab = $('.tab-pane.active'); 

				formData.from = 0;
				formData.too = 10;

				$.ajax({
				  url: url,
				  type: "get",
				  data: formData
				})
				.done(function(response){ 
					var html = '';

					$.each($(response), function(){ console.log(response)
						html = html + '<div class="photo-sm"><div class="photo-holder">';
						html = html + '<a href="/picture/'+this.slug+'" title="'+this.title+'">';
						html = html + '<img src="/uploads/cropped/'+this.picture+'" class="img-responsive" alt="'+this.title+'">';
						html = html + '</a></div></div>';
					})
					
					$('#popular').html(html);
					 
				})
				.fail(function(responseTxt){
					console.log('something went wrong:' + responseTxt)
				})	

			},
			loadFollowing :function(){
				var formData = {},
					url = '/api/following',
					activeTab = $('.tab-pane.active'); 

				formData.from = 0;
				formData.too = 10;

				$.ajax({
				  url: url,
				  type: "get",
				  data: formData
				})
				.done(function(response){ 
					var html = '';

					$.each($(response), function(){ console.log(response)
						html = html + '<div class="photo-sm"><div class="photo-holder">';
						html = html + '<a href="/picture/'+this.slug+'" title="'+this.title+'">';
						html = html + '<img src="/uploads/cropped/'+this.picture+'" class="img-responsive" alt="'+this.title+'">';
						html = html + '</a></div></div>';
					})
					
					$('#following').html(html);
					 
				})
				.fail(function(responseTxt){
					console.log('something went wrong:' + responseTxt)
				})	
			},
			loadImages: function(){
				if($('#index').length){
					hs.loadPopular();
					hs.loadFollowing();
					
					hs.addTabs('#tab-menu');
				}
			},
			addTabs:function(tabName){
				$(tabName+' a').click(function (e) { console.log(this);
				  e.preventDefault()
				  $('.tab').removeClass('selected');
				  $(this).closest('.tab').addClass('selected');
				  $(this).tab('show')
				})
			}

		}

	hs.init($); 
  	
  	// IE fails to execute the script randomly without the timeout, /shrug
	$(window).load(function () {		
		//hs.customFormElements();
	});

	window.hs = $.extend(hairShaire, hs);
}) (jQuery, window);
