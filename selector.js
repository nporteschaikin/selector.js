(function( $ ){

	$.fn.select = function( options ) {  
		
		return this.each(
			function() {
				
				var defaults = { 
					'url': false,
					'placeholder': null,
					'pfx': 'selector',
					'z': '99'
				}

				var settings = $.extend(defaults, options);
				
				$this = $(this);
				if ( $this.is( 'select' )  ) {
					var select, build, blocks;
					select = {
						name: $this.attr('name'),
						id: $this.attr('id'),
						options: $this.find('option')
					}

					build = $('<ul class="' + settings.pfx + '" />');
					build.html( '<li class="' + settings.pfx + '-title"><a href="#"></a></li>' );
					build.prepend( '<input type="hidden" />' );
					build.append( '<li class="' + settings.pfx + '-list"><ul></ul></li>' );

					blocks = {
						title: build.find('.' + settings.pfx + '-title a'),
						list: build.find('.' + settings.pfx + '-list ul'),
						input: build.find('input')
					}
					
					blocks.list.parent().css( { 
						'display': 'none', 
						'position': 'absolute', 
						'z-index': settings.z,
						'margin': 0,
						'padding': 0,
						'border': 0
					} )
					

					if ( select.name.length > 0 ) {
						blocks.input.attr('name', select.name);
					}

					if ( select.options.length > 0 ) {
						select.options.each(
							function() {
								var key = $(this).attr('value'),
									value = $(this).html();
								item = $( '<li><a href="#"></a></li>' );
								item.attr( 'data-value', key );
								item.find('a').html( value );
								blocks.list.append( item );
							}
						)
					}
					
					blocks.items = blocks.list.find('li a');
					
					blocks.title.bind( 'click',
						function( e ) {
							e.preventDefault();
							if ( blocks.list.parent().css('display') == 'none' ) {
								blocks.list.parent().css('display', 'block');
							} else if ( blocks.list.parent().css('display') == 'block' ) {
								blocks.list.parent().css('display', 'none');
							}
						}
					)
					
					blocks.items.bind( 'click',
						function() {
							var parent = $(this).parent(),
								key = parent.attr('value'),
								value = $(this).html();
							blocks.title.html( value );
							blocks.input.val( key );
							if ( blocks.list.parent().css('display') == 'block' ) {
								blocks.title.click();
							}
						}
					)
					
					if ( settings.placeholder !== null ) {
						blocks.title.html( placeholder );
					}else{
						blocks.items.first().click();
					}
					
					$this.replaceWith( build );
					
				} else {
					return false;
				}
			}
		);
		
  };

})( jQuery );