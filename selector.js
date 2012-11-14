(function( $ ){

	$.fn.select = function( options ) {  
		
		return this.each(
			function() {
				
				var defaults = { 
					'url': false,
					'placeholder': null,
					'pfx': 'selector',
					'z': '99',
					'fade': true,
					'fadeSpeed': 100
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
						blocks.input.attr( 'name', select.name );
						build.attr( 'data-name', select.name );
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
								if( settings.fade ) {
									blocks.list.parent().stop().fadeIn( options.fadeSpeed );
								} else {
									blocks.list.parent().css('display', 'block');
								}
								build.addClass( settings.pfx + '-open' );
								if ( settings.placeholder == null ) {
									blocks.items.parent().filter('[data-value="' + blocks.input.val() + '"]').css('display', 'none');
								} else {
									blocks.title.html( settings.placeholder );
								}
								$(document).bind('click',
									function( e ) {
										e.preventDefault();
										if ( build.has( e.target ).length === 0 ) {
											blocks.title.click();
										}
									}
								)
							} else {
								if( settings.fade ) {
									blocks.list.parent().stop().fadeOut( options.fadeSpeed );
								} else {
									blocks.list.parent().css('display', 'none');
								}
								build.removeClass( settings.pfx + '-open' );
								blocks.items.parent().css('display', 'block');
								$(document).unbind( 'click' );
							}
						}
					)
					
					blocks.items.bind( 'click',
						function() {
							var parent = $(this).parent(),
								key = parent.attr('data-value'),
								value = $(this).html();
							blocks.title.html( value );
							blocks.input.val( key );
							if( settings.url == true ) {
								window.location = key;
							}
							if ( blocks.list.parent().css('display') !== 'none' ) {
								blocks.title.click();
							}
						}
					)
					
					if ( settings.placeholder !== null ) {
						blocks.title.html( settings.placeholder );
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