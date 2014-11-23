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
					hs.settings();
					hs.photoHover();
					hs.welcomeBanner();
				});
				return false;
			},
			registeration: function(){
				if($('#signup-form').length){
					var formData = {};

					$('#btn-signup').on('click', function(e){
						e.preventDefault();
						formData.email = $('input[name="email"]').val();
						formData.username = $('input[name="username"]').val();
						formData.password = $('input[name="password"]').val();

						$.ajax({
						  url: 'signup',
						  type: 'post',
						  data: formData
						})
						.done(function(responseTxt){ 
							console.log(responseTxt)
				      $('.form-group').removeClass('has-error');
				      $('.form-group').addClass('has-success');
				      $('.control-label').remove();
      				window.location.href = responseTxt.redirect;
						})
						.fail(function(responseTxt){ 
				      $('.control-label').remove();
				      $('.form-group').removeClass('has-error');
				      for (var i = responseTxt.responseJSON.length - 1; i >= 0; i--) {
				        $('#'+responseTxt.responseJSON[i].param).addClass('has-error');
				        $('<label class="control-label pull-right">'+responseTxt.responseJSON[i].msg+'</label>').insertAfter('#'+responseTxt.responseJSON[i].param+' label');
				      };
						})
					});
					
					$('#male').on('click', function(e){
						e.preventDefault();
						$(this).addClass('selected');
						$('#female').removeClass('selected');
						$('input[name="gender"]').val('1');
					});

					$('#female').on('click', function(e){
						e.preventDefault();
						$(this).addClass('selected');
						$('#male').removeClass('selected');
						$('input[name="gender"]').val('');
					});


					$('#btn-steptwo').on('click', function(e){
						e.preventDefault();
						formData.gender = $('input[name="gender"]').val();
						formData.firstName = $('input[name="firstName"]').val();
						formData.lastName = $('input[name="lastName"]').val();
						formData.hairType = $('select[name="hairType"]').val();
						formData.course = $('select[name="course"]').val();
						formData.lastHairSalon = $('select[name="lastHairSalon"]').val();
						formData.lastCutCost = $('input[name="lastCutCost"]').val();

						$.ajax({
						  url: 'steptwo',
						  type: 'post',
						  data: formData
						})
						.done(function(responseTxt){ 
							console.log(responseTxt)
				      $('.form-group').removeClass('has-error');
				      $('.form-group').addClass('has-success');
				      $('.control-label').remove();
      				window.location.href = responseTxt.redirect;
						})
						.fail(function(responseTxt){ 
				      $('.control-label').remove();
				      $('.form-group').removeClass('has-error');
				      for (var i = responseTxt.responseJSON.length - 1; i >= 0; i--) {
				        $('#'+responseTxt.responseJSON[i].param).addClass('has-error');
				        $('<label class="control-label">'+responseTxt.responseJSON[i].msg+'</label>').insertAfter('#'+responseTxt.responseJSON[i].param+' label');
				      };
						})

					});
				}
			
			},
			login: function(){
				$('#btn-login').on('click', function(e){
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
							$('form .form-group').addClass('has-error');
							$('.alert').addClass('alert-danger').html('Incorrect Login').slideDown();
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
					$(document).on('click', '#btn-editPhoto', function(e) {
						e.preventDefault();
						coordinates(cropHS);
						// var title = $('#title').val();
						// if ( title.trim().length >= 3 && title.length <= 80 ) {
							
							var formData = {};

							// formData.title = $('#title').val();
							formData.cropX = $('#cropX').val();
							formData.cropY = $('#cropY').val();
							formData.cropW = $('#cropW').val();
							formData.cropH = $('#cropH').val();

							$.ajax({
							  url: 	document.URL,
							  type: "post",
							  data: formData
							})
							.done(function(response){
								console.log('done')
								console.log(response)
								window.location.href = response.redirect;
							})
							.fail(function(response){
								console.log('fail')
								console.log(response)
								$('.alert-danger').html(response.responseJSON.reason).slideDown();
							})

							// $('#editForm').submit();
			      // } else {     	
			      //   $('.alert-danger').html('Title Size must be between 3-80 Characters').slideDown();
			      // }

						
					});


				// $('input#imageTitle').on('click', function(e){
				// 	e.preventDefault();
					
				// });
			},
			followButton: function(){

				
				var $followUser = $('.followUser');
				if(!$followUser.length) return;
				var status = cssClass = "";

				$.ajax({
				  url:'/api/checkFollow/'+ $followUser.data('username'),
				  type: "get"
				})
				.done(function(responseTxt) {
					
					if (responseTxt.result === 0) {
						status = 'Follow';
						cssClass = 'btn-hs';
					} else if (responseTxt.result === 1) {
						status = 'Unfollow';
						cssClass = 'btn-hs-two';
					};

					$followUser.html('<a href="#" class="none btn btn-hs btn-block '+cssClass+'">'+status+'</a>');
					$('.followUser a').slideDown();

				})
				.fail(function(responseTxt) {
					console.log('$followUser: error this broke! 2');
					console.log(responseTxt)
				});
					

				$followUser.on('click', function(e){ 
					e.preventDefault();
					var $this = $(this);

					$.ajax({
					  url:'/api/doFollow/'+ $(this).data('username'),
					  type: "post"
					})
					.done(function(responseTxt) {

						if (responseTxt.status === 'unfollowed') {
							$this.find('.btn').html('Follow').addClass('btn-hs').removeClass('btn-hs-two');
						} else if (responseTxt.status === 'followed') {
							$this.find('.btn').html('Unfollow').addClass('btn-hs-two').removeClass('btn-hs');
						};

					})
					.fail(function(responseTxt) {
						console.log('$followUser: error this broke! 2');
						console.log(responseTxt)
					});



				});

			},
			likeButton: function(){

				var $photoBtn = $('.photo-btn');
				if(!$photoBtn.length) return;
				var status = cssClass = "";

				$.ajax({
				  url:'/api/checkLike/'+ $photoBtn.data('id'),
				  type: "get"
				})
				.done(function(responseTxt) {
					if (responseTxt.status === 0) {
						status = 'like';
						cssClass = 'heart-empty';
					} else if (responseTxt.status === 1) {
						status = 'unlike';
						cssClass = 'heart';
					};

					$photoBtn.html('<button class="like-btn '+status+'"><i class="entypo '+cssClass+'"></i>'+responseTxt.count+'</button>');
					$('.like-btn').slideDown();

				})
				.fail(function(responseTxt) {
					console.log('$photoBtn: error this broke! 2');
					console.log(responseTxt)
				});


				$photoBtn.on('click', function(e){ 
					e.preventDefault();
					var $this = $(this);

					$.ajax({
					  url:'/api/doLike/'+ $(this).data('id'),
					  type: "post"
					})
					.done(function(responseTxt) {
						if (responseTxt.status === 'unliked') {
							$this.find('.like-btn').html('<i class="entypo heart-empty"></i>'+responseTxt.count).addClass('like').removeClass('unlike');
						} else {
							$this.find('.like-btn').html('<i class="entypo heart"></i>'+responseTxt.count).addClass('unlike').removeClass('like');
						};

					})
					.fail(function(responseTxt) {
						console.log('$photoBtn: error this broke! 3');
						console.log(responseTxt)
					});



				});

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

					$(".upload-btn").click(function () {
						var id = $(this).data('id');
    				$('#position').val( id );
    				$('#uploadPicture').trigger('click');
    				console.log(id)
						var form 			= $('#upload-form'),
							fileUpload 	= $('#uploadPicture'),
							filename 		= form.find('input[name="filename"]'),
							progress 		= form.find('.progress'),
							progressBar = progress.find('.progress-bar'),
							value 			= 0,
							interval 		= null;

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



						});


					});


				}
			},
			loadPopular :function(){
				var formData = {},
					url = '/api/popular',
					activeTab = $('.tab-pane.active'); 

				formData.from = 0;
				formData.too = 36;

				// $.ajax({
				//   url: url,
				//   type: "get",
				//   data: formData
				// })
				// .done(function(response){ 
				// 	var html = '';

				// 	console.log('this')
				// 	$.each($(response), function() {
				// 		console.log('this2')
				// 		var status = cssClass = "";
				// 		var $this = this;
				// 		$.ajax({
				// 		  url:'/api/checkLike/'+ $this.id,
				// 		  type: "get",
				// 		  async: false
				// 		})
				// 		.done(function(responseTxt) {
							
				// 			if (responseTxt.status === 0) {
				// 				status = 'like';
				// 				cssClass = 'heart-empty';
				// 			} else if (responseTxt.status === 1) {
				// 				status = 'unlike';
				// 				cssClass = 'heart';
				// 			};

				// 			html += '<div class="photo-sm"><div class="photo-holder">';
				// 			html += '<div class="img-holder"><a href="/picture/'+$this.slug+'" title="'+$this.title+'">';
				// 			html += '<div class="photo-btn mini" data-id="'+$this.id+'"><button class="like-btn '+status+'"><i class="entypo '+cssClass+'"></i>'+responseTxt.count+'</button></div>';
				// 			html += '<img src="/uploads/cropped/'+$this.picture+'" class="img-responsive" alt="'+$this.title+'">';
				// 			html += '</a></div></div></div>';
				// 		})
				// 		.fail(function(responseTxt) {
				// 			console.log('$photoBtn: error this broke! 2');
				// 			console.log(responseTxt)
				// 		});
				// });

				// 	console.log('this3')
				// 	$('#popular').html(html);
					 
				// })
				// .fail(function(responseTxt){
				// 	console.log('something went wrong:' + responseTxt)
				// })	

			},
			loadFollowing :function(){
				var formData = {},
					url = '/api/following',
					activeTab = $('.tab-pane.active'); 

				formData.from = 0;
				formData.too = 36;

				// $.ajax({
				//   url: url,
				//   type: "get",
				//   data: formData
				// })
				// .done(function(response){ 
				// 	var html = '';

				// 	$.each($(response), function(){
				// 		html += '<div class="photo-sm"><div class="photo-holder"><div class="img-holder">';
				// 		html += '<a href="/picture/'+this.slug+'" title="'+this.title+'">';
				// 		html += '<img src="/uploads/cropped/'+this.picture+'" class="img-responsive" alt="'+this.title+'">';
				// 		html += '</a></div></div></div>';
				// 	})
					
				// 	$('#following').html(html);
					 
				// })
				// .fail(function(responseTxt){
				// 	console.log('something went wrong:' + responseTxt)
				// })	
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
			},

			photoHover:function(){
				// $('.photo-btn.mini').delay(1000).animate({ left: '-48px'});
				// $('#photoContainer').hover(
				//   function() {
				//     $( this ).find('.photo-btn.mini').animate({ left: '0'});
				//   }, function() {
				//     $( this ).find('.photo-btn.mini').delay(250).animate({ left: '-48px'});
				//   }
				// );

			},

			welcomeBanner:function(){
				$('#welcome-banner .close').click(function (e) {
				  e.preventDefault()
				  $('#welcome-banner').slideUp();
				})
			},

					

			settings:function(){
			  $('#testPostSubmit').on('click', function(e){
			    e.preventDefault();
			    var formData = {};

			    formData.email = $('input[name="email"]').val();
			    formData.password = $('input[name="password"]').val();

			    $.ajax({
			      url:location.href,
			      type: "post",
			      data: formData
			    })
			    .done(function(responseTxt){ 
			    	console.log()
			      $('.form-group').removeClass('has-error');
			      $('.form-group').addClass('has-success');
			      window.location.href = responseTxt.responseJSON.redirect;
			    })
			    .fail(function(responseTxt){
			      // console.log(responseTxt.responseJSON)
			      $('.control-label').remove();
			      $('.form-group').removeClass('has-error');
			      for (var i = responseTxt.responseJSON.length - 1; i >= 0; i--) {
			        $('#'+responseTxt.responseJSON[i].param).addClass('has-error');
			        $('<label class="control-label pull-right">'+responseTxt.responseJSON[i].msg+'</label>').insertAfter('#'+responseTxt.responseJSON[i].param+' label');
			      };
			      // $('form .form-group').addClass('has-error').append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
			      // $('form .message').addClass('error').html(responseTxt.status);
			    })

			  });
		},

	}

	hs.init($); 
  	
  	// IE fails to execute the script randomly without the timeout, /shrug
	$(window).load(function () {		
		//hs.customFormElements();
	});

	window.hs = $.extend(hairShaire, hs);
}) (jQuery, window);
