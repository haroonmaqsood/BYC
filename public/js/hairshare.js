(function($, window) {
	var hairShaire = window.hs || {},
		hs = { 
		init:function(){
			"use strict";
			$( document ).ready(function() {
			hs.createForm();
			hs.createPhotoEditor();
			});
			return false;
		},
		createForm: function(){
		},
		createPhotoEditor: function(){

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