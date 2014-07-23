;(function($, undefined) {

	$.keynav = {
		current_level : 0,
		onClass: 'withfocus',
		openClass: 'open',

		getCurrent: function(times) { 
       		return (new Array(times + 2)).join('.' + $.keynav.openClass + ' ');
    	},

		go: function (direction) {
			var current_level = $.keynav.current_level;
			var current_index = parseInt($($.keynav.getCurrent(current_level) + ' [data-level=' + current_level + '].' + $.keynav.onClass).data('index'));

			//$($.keynav.getCurrent(current_level) + ' [data-level=' + current_level + '].' + $.keynav.onClass).removeClass($.keynav.onClass);

			var current = $($.keynav.getCurrent(current_level) + ' [data-level=' + current_level + ']').filter('.' + $.keynav.onClass);
			if(current.data('keynav') == 'stop'){return ;}

			current.removeClass($.keynav.onClass);


			var valid_indexes = $($.keynav.getCurrent(current_level) +' [data-level=' + current_level + ']').not('.disabled').map( function(index, element) {
			    return $(element).data('index');
			}).get();


			var n = valid_indexes.indexOf(current_index)
			var length = valid_indexes.length
			var next_index = valid_indexes[(((n+direction)%length)+length)%length]

			var next = $($.keynav.getCurrent(current_level) + ' [data-level=' + current_level + '][data-index=' + next_index + ']').not('.disabled');
			next.addClass($.keynav.onClass);
		},

		activate: function () {
			var current_level = $.keynav.current_level;

			//var current = $( $.keynav.getCurrent(current_level) + ' [data-level=' + current_level + '].' + $.keynav.onClass).not('.disabled');

			var current = $( $.keynav.getCurrent(current_level) + ' [data-level=' + current_level + ']').filter('.' + $.keynav.onClass);
			if(current.data('keynav') == 'stop'){return ;}

			current = current.not('.disabled');

			if(current.size() == 0 ) {return ;}

			if(current.find('[data-level=' + (current_level +1 ) + ']').size() != 0){
				// descend level

				current.addClass($.keynav.openClass);

				current.removeClass( $.keynav.onClass );
				current_level++;
				// set focus in level 1
				$($.keynav.getCurrent(current_level) +' [data-level=' + current_level + '][data-index=0]').addClass($.keynav.onClass);
				$.keynav.current_level = current_level;

			} else {
				// click and stay
				current.click();
			}	
		},

		deactivate: function () {
			var current_level = $.keynav.current_level;
			if(current_level == 0) {return;}


			var current = $($.keynav.getCurrent(current_level) +' [data-level=' + current_level + ']').not('.disabled').filter('.' + $.keynav.onClass);
			current.trigger('deactivated');
			if(current.data('keynav') == 'stop'){
				current.removeData('keynav');
				return ;
			}

			// clear level 1
			current.removeClass($.keynav.onClass);

			current_level--;
			var parent = $($.keynav.getCurrent(current_level) +' [data-level=' + current_level + '].' + $.keynav.openClass);
			parent.removeClass($.keynav.openClass);
			parent.addClass($.keynav.onClass);

			$.keynav.current_level = current_level;
		},

	}

  $.fn.keynav = function () {
	  //Initialization
	  //var kn = $.keynav;
	  if(!$.keynav.initialiazed || $.keynav.initialiazed === false) {
		  

		  $(document).keydown(function(e) {
				var key = 0;
				if (e == null) {
					key = event.keyCode;
				} else { // mozilla
					key = e.which;
				}
				switch(key) {
					case 37: 
						$.keynav.go(-1);
						break;
					case 38: 
						// $.keynav.goUp();
						break;
					case 39: 
						$.keynav.go(1);
						break;
					case 40: 
						// $.keynav.goDown();
						break;
					case 13: 
						$.keynav.activate();
						break;
					case 27:
						$.keynav.deactivate();
						break;
				}
		  });
		  $.keynav.initialiazed = true;
		  $.keynav.go(1);
	  }
  }


})(jQuery)
