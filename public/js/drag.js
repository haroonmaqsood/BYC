(function($) {
    $.fn.drags = function(opt) {
       
        opt = $.extend({handle:"",cursor:"move"}, opt);

        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX,
               // imageHeight = $el.height(),
               // frameHeight = $('#photoEditor').height(),
                heightDifference = $el.height()- $('#photoEditor').height(),
                widthDifference = $el.width()- $('#photoEditor').width(),
                topPos=0,
                leftPos=0;
            
            $el.css({'marging-left':0});

            $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
      console.log(opt.orientation, e.pageY + pos_y - drg_h)
				if(opt.orientation == 'port'){
		    	 	topPos = $el.position().top*-1;

		    		if((topPos>=0)&&(topPos <= heightDifference)){
			    		$('.draggable').offset({
		                    top:e.pageY + pos_y - drg_h//,
		                   // left:offsetLeft//e.pageX + pos_x - drg_w
		                }).on("mouseup", function() {
		                    $(this).removeClass('draggable').css('z-index', z_idx);
		                });
	           		}
	           		else if (topPos < 0){
	           			$el.css({top:0})
	           		}
	           		else if (topPos > heightDifference){
	           			$el.css({top:heightDifference*-1})
	           		}
		    	} 

		    	else if(opt.orientation == 'land'){
		    		leftPos = $el.position().left;

		    		if((leftPos >= widthDifference*-1)&&(leftPos<=0)){
			    		
			    		$('.draggable').offset({
		                    //top:e.pageY + pos_y - drg_h//,
		                    left:e.pageX + pos_x - drg_w
		                }).on("mouseup", function() {
		                    $(this).removeClass('draggable').css('z-index', z_idx);
		                });
	           		}
	           		 if (leftPos > 0){
	           			$el.css({left:0})
	           		}
	           		 if (leftPos < widthDifference*-1){
	           			$el.css({left:widthDifference*-1})
	           		}
		    	}


            $('input[name=cropX]').val(leftPos);
            $('input[name=cropY]').val(topPos);
           //	$('input[name=cropW]').val($el.width());
           // $('input[name=cropH]').val($el.height());

            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }

        });

    }
})(jQuery);