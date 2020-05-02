/**
 * Pc 에서 사용되는 jquery plugin 들을 작성한다.
 *
 * @name : jquery.fn.sample
$.fn.sample = function (options) {
	var defaults = {},
		config = $.extend(true, defaults, options);

	return this.each(function (i, v) {
	});
};
 */

(function ($, window, document) {

	// $(전체선택버튼).checkGroup(options);
	// @options wrap :
	// @options items :
	// @options permission :
	// @options cancel :
	$.fn.checkGroup = function (options) {

		if (!options.list) {
			utils.error('OPTIONS ERROR : not defind options.list.', true);
			return this;
		}

		var defaults = { list: '', items: 'input[type=checkbox]', cancel: '' },
			config = $.extend(true, defaults, options),
			$allCheck = this,
			$allCancel = $(config.cancel),
			$wrap = $(config.list),
			$items = $(config.items, $wrap),
			useBtnCancel = config.cancel ? true : false,
			permission = config.permission || $items.length,
			allCheckData = 'allcheck';

		if (!$wrap.length || !$items.length || !$allCheck.length) {
			utils.error('TARGET ERROR  > checkGroup : not defind element.', true);
			return this;
		}

		if ($items.filter(':not(disabled)').length == $items.filter(':not(disabled):checked').length) {
			$allCheck.data(allCheckData, true);
		} else {
			$allCheck.data(allCheckData, false);
		}

		$allCheck.on('click', function () {
			var checked = $allCheck.data(allCheckData);

			if (useBtnCancel) {
				checked = false;
			}

			$allCheck.data(allCheckData, !checked);
			$items.filter(':not(disabled)').prop('checked', !checked);

			if (!$allCheck.is('input')) {
				return false;
			}
		});

		if (useBtnCancel) {
			$allCancel.on('click', function () {
				$items.filter(':not(disabled)').prop('checked', false);
				return false;
			});
		}

		$items.on('click', function () {

			if ($allCheck.attr('id') != $(this).attr('id')) {
				var checkLength = $items.filter(':not(disabled):checked').length;

				if (permission === checkLength) {
					$items.filter('input:not(:checked)').prop('disabled', true);
					$allCheck.data(allCheckData, true);
					$allCheck.filter('input[type=checkbox]').prop('checked', true);
				} else {
					$items.filter('input:not(:checked)').prop('disabled', false);
					$allCheck.data(allCheckData, false);
					$allCheck.filter('input[type=checkbox]').prop('checked', false);
				}
			}

		});

		return this;
	};

	$.fn.getIFrameHtml = function () {

		var $iframe = this,
			html = '';

		if ($iframe.length == 1) {
			html = utils.getIFrameHtml(this[0]);
		}

		return html;
	};

	$.fn.layerNewsLetter = function (options) {

		var $layerNewsLetter = this;
		$('#btnNewsLetter').on('click', function () {
			if (userInfo.isLogin()) {	//소셜로그인 추가.161208
				if (userInfo.getInfo().ssoInfo == null || userInfo.getInfo().ssoInfo == '' ) {
					if (confirm('트랜드 뉴스레터를 신청하시려면 조인스 계정으로 로그인해야 합니다.\n\r로그인 창으로 이동하시겠습니까? 기존 소셜 로그인은 로그아웃 상태로 변경됩니다.')) {
						location.href = 'https://my.joins.com/login/';
					}
				} else {
					$layerNewsLetter.addClass('layeron');
				}
			} else {
			    if (confirm('트렌드 뉴스레터를 신청하시려면 로그인이 필요합니다.\n\r로그인 창으로 이동하시겠습니까?')) {
                    location.href = 'https://my.joins.com/login/';
                }
			}
			return false;
		});

		$layerNewsLetter.find('#btn_close_layer_newsletter').on('click', function () {
			closeLayerNewsLetter();
			return false;
		});

		$layerNewsLetter.find('#btn_edit_userinfo').on('click', function () {
			location.href = 'https://my.joins.com/';
			return false;
		});

		$layerNewsLetter.find('#btn_apply_newsletter').on('click', function () {
			if ($('input[name=layer_newsletter_agree]:checked', $layerNewsLetter).val() != '1') {
				return alert('개인정보 보호를 위한 이용자 동의사항에 동의하셔야 합니다.');
			}

			utils.ajaxPost({
				url: utils.config('apiPath') + '/trend/subscribe',
				success: function (res) {
					if (res.IsSuccess) {
						alert('신청되었습니다.');
					} else {
						var code = res.Code,
							message = '';

						switch (code) {
							case 'Duplicated':
								message = '이미 신청하였습니다.';
								break;
							case 'NotFound':
								message = '신청 사용자 ID를 찾을 수 없습니다.';
								break;
							case 'Bad':
								message = '잘못된 요청입니다.';
								break;
							case 'NotLoginUser':
								message = '로그인이 필요한 서비스입니다.';
								break;
						}

						alert(message);
					}
				}
			});

			closeLayerNewsLetter();
			return false;
		});

		function closeLayerNewsLetter() {
			$layerNewsLetter.removeClass('layeron');
		}

		return this;
	};

	$.fn.layerLetterPreView = function (options) {
	    var $layerLetterPreView = this;

	    $('#btnTime7Letter_PreView_1').on('click', function () {
	        $layerLetterPreView.find('.layer_newsletter').removeClass("layer_trend");
	        $layerLetterPreView.find('#ifrPreView').attr('src', '/mail/letter?type=r');
	        $layerLetterPreView.find('#ifrPreView').attr('width', '657');
	        $layerLetterPreView.addClass('layeron');
	    });

	    $('#btnTime7Letter_PreView_2').on('click', function () {
	        $layerLetterPreView.find('.layer_newsletter').removeClass("layer_trend");
	        $layerLetterPreView.find('#ifrPreView').attr('src', '/mail/letter?type=n');
	        $layerLetterPreView.find('#ifrPreView').attr('width', '657');
	        $layerLetterPreView.addClass('layeron');
	    });

	    $('#btnNewsLetter_PreView').on('click', function () {
	        $layerLetterPreView.find('.layer_newsletter').addClass("layer_trend");
	        $layerLetterPreView.find('#ifrPreView').attr('src', '/mail/trend');
	        $layerLetterPreView.find('#ifrPreView').attr('width', '677');
	        $layerLetterPreView.addClass('layeron');
	    });

	    $layerLetterPreView.find('.btn_close').on('click', function () {
	        $layerLetterPreView.removeClass('layeron');
	        $layerLetterPreView.find('#ifrPreView').attr('src', '');
	        return false;
	    });

	    return this;
	};

	$.fn.layerTime7Letter = function (options) {

	    var $layerTime7Letter = this;
	    $('#btnTime7Letter_1').on('click', function () {
	    	if (userInfo.isLogin()) {
	    		if (userInfo.getInfo().ssoInfo == null) { //소셜로그인 추가.161208
	    			if (confirm('미리보늘 오늘 뉴스레터를 신청하시려면 조인스 계정으로 로그인해야 합니다.\n\r로그인 창으로 이동하시겠습니까? 기존 소셜 로그인은 로그아웃 상태로 변경됩니다.')) {
	    				location.href = 'https://my.joins.com/login/';
	    			}
	    		} else {
	    			$layerTime7Letter.addClass('layeron');
	    		}
	        } else {
	            if (confirm('미리보는 오늘 뉴스레터를 신청하시려면 로그인이 필요합니다.\n\r로그인 창으로 이동하시겠습니까?')) {
	                location.href = 'https://my.joins.com/login/';
	            }
	        }
	        return false;
	    });

	    $('#btnTime7Letter_2').on('click', function () {
	    	if (userInfo.isLogin()) {
	    		if (userInfo.getInfo().ssoInfo == null) { //소셜로그인 추가.161208
	    			if (confirm('뉴스룸레터를 신청하시려면 조인스 계정으로 로그인해야 합니다.\n\r로그인 창으로 이동하시겠습니까? 기존 소셜 로그인은 로그아웃 상태로 변경됩니다.')) {
	    				location.href = 'https://my.joins.com/login/';
	    			}
	    		} else {
	    			$layerTime7Letter.addClass('layeron');
	    		}
	        } else {
	            if (confirm('뉴스룸레터를 신청하시려면 로그인이 필요합니다.\n\r로그인 창으로 이동하시겠습니까?')) {
	                location.href = 'https://my.joins.com/login/';
	            }
	        }
	        return false;
	    });

	    $layerTime7Letter.find('#btn_close_layer_time7letter').on('click', function () {
	        closeLayerTime7Letter();
	        return false;
	    });

	    $layerTime7Letter.find('#btn_edit_userinfo').on('click', function () {
	        location.href = 'https://my.joins.com/';
	        return false;
	    });

	    $layerTime7Letter.find('#btn_apply_time7letter').on('click', function () {
	        if ($('input[name=layer_time7letter_agree]:checked', $layerTime7Letter).val() != '1') {
	            return alert('개인정보 보호를 위한 이용자 동의사항에 동의하셔야 합니다.');
	        }

	        utils.ajaxPost({
	            url: utils.config('apiPath') + '/time7/subscribe',
	            success: function (res) {
	                if (res.IsSuccess) {
	                    alert('신청되었습니다.');
	                } else {
	                    var code = res.Code,
                            message = '';

	                    switch (code) {
	                        case 'Duplicated':
	                            message = '이미 신청하였습니다.';
	                            break;
	                        case 'NotFound':
	                            message = '신청 사용자 ID를 찾을 수 없습니다.';
	                            break;
	                        case 'Bad':
	                            message = '잘못된 요청입니다.';
	                            break;
	                        case 'NotLoginUser':
	                            message = '로그인이 필요한 서비스입니다.';
	                            break;
	                    }

	                    alert(message);
	                }
	            }
	        });

	        closeLayerTime7Letter();
	        return false;
	    });

	    function closeLayerTime7Letter() {
	        $layerTime7Letter.removeClass('layeron');
	    }

	    return this;
	};

	$.fn.browserNotice = function (_version) {
		var $target = this,
			html = '<div class="ab_notice">' +
				'<p>Internet Explorer{version} (IE{version}) 이상에서 보실 수 있는 요소입니다.<br>IE{version} 이상 또는 다른 브라우저를 이용해 주십시오.</p>' +
			'</div>',
			version = _version || 9;

		html = html.replaceAll('{version}', version);
		$target.replaceWith(html);
	};

	/*
	* 아티클 이미지뷰어
	* options : content(array), index( current image number ), activeClass
	*/
	$.fn.imageViewer = function (items) {

		if (this.length == 0) return this;
		var
			ITEM_TYPE = { image: 'image', ad: 'ad', list: 'list' },
			VIEWER_TYPE = { image: 'image', photo: 'photo' },
			CLASS_NAMES = {
				viewer: { image: 'image_viewer', photo: 'photo_viewer' },
				image: 'image_area',
				ad: 'ad_wrap',
				list: 'list_wrap clearfx'
			},
			DOM_SELECTOR = { layer: '#photo_viewer', closeLayer: '#close_photo_viewer', viewerBody: '#photo_viewer_body' },
			apiRoot = utils.config('apiPath'),
			$body = $(document.body),
			$items = this,
			$item = null,
			itemData = $items.data(),
			config = {
				items: items || [],
				apiPath: apiRoot + '/gallery/',
				pdsPath: utils.config('pdsPath'),
				newsLinkPath: utils.config('webPcPath') + '/article/'
			},
			$viewerLayer = $(DOM_SELECTOR.layer),
			$keyboardControl = $('#viewerKeyboardControl', $viewerLayer),
			$slide = {};
		_viewer = null,
		windowSize = utils.windowSize(),
		imageViewPort = { width: (windowSize.width - 240), height: windowSize.height - 80 };  //최소 너비값 760px 높이값 550px {1000, 640}

		$items.on('click', function () {

			windowSize.width = windowSize.width < 800 ? 800 : windowSize.width;
			windowSize.height = windowSize.height < 640 ? 640 : windowSize.height;
			imageViewPort = { width: (windowSize.width - 240), height: windowSize.height - 80 };

			$item = $(this);
			var itemData = $(this).data();

			var viewerConfig = {
				id: itemData.id,
				photoItems: [],
				index: itemData.index || 0,
				frstcode: itemData.frstcode || 0,
				type: itemData.viewer,
				wrap: itemData.wrap,
				close: itemData.close,
				isPhotoViewer: itemData.photoViewer == undefined ? false : true,
				isPhotoList: itemData.photoList == undefined ? false : true
			};

			//utils.log('## itemData.photoViewer : ' + itemData.photoViewer);

			if (viewerConfig.type == VIEWER_TYPE.photo && !viewerConfig.id) {
				utils.error('VIEWER ERROR : not defined data-id property', true);
				return false;
			};

			utils.log('## viewerConfig');
			utils.log(viewerConfig);
			//utils.log($items.closest('.ab_photo'));
			//utils.log($item.closest('.ab_photo'));
			//utils.log($items.closest('.ab_photo').index($item.closest('.ab_photo')))

			utils.loading();
			showViewer(viewerConfig);
			setTimeout(function () { utils.loading(true); }, 5000);
			return false;
		});

		function showViewer(viewerConfig) {

			var size = { viewer: windowSize };

			if ($viewerLayer.length === 0) {
				createViewerLayer();
			} else {
				showViewerLayer();
			}

			if (viewerConfig.type == VIEWER_TYPE.photo) {
				_viewer = new PhotoViewer(viewerConfig);
				_viewer.open();
			} else {
				_viewer = new ImageViewer(viewerConfig);
				_viewer.open(viewerConfig.items);
			}

			// Keyboard Control : Prev/Next
			$(document.body).on('keydown', viewerKeyboardControl);

			$viewerLayer.on('click', DOM_SELECTOR.closeLayer, function () {

				hideViewerLayer();

				return false;
			});

			$(window).on('resize', layerResizeHandler);

			function createViewerLayer() {
				var head = '<div class="hd"><strong class="hide">화보 뷰어</strong></div>',
					logo = '<strong class="logo"><a href="//joongang.joins.com">중앙일보</a></strong>',
					body = '<div id="photo_viewer_body" class="bd"></div>',
					foot = '<div class="ft"><button type="button" id="close_photo_viewer" class="viewer_close">close</button><input type="hidden" id="viewerKeyboardControl" /></div>';

				$viewerLayer = $('<div id="photo_viewer" class="' + CLASS_NAMES.viewer[viewerConfig.type] + '"><div class="viewer_overlay"></div><div class="viewer_wrap"></div></div>');
				$viewerLayer.find('.viewer_wrap').css(size.viewer).append(head).append(body).append(foot);

				if (viewerConfig.isPhotoViewer) {
					$viewerLayer.find('.hd').append(logo);
					$viewerLayer.find('#close_photo_viewer').hide();
				}
				$body.append($viewerLayer);
				showViewerLayer();
			}

			function showViewerLayer() {
				$body.css('overflow', 'hidden');
				$keyboardControl = $('#viewerKeyboardControl', $viewerLayer);
				$keyboardControl.focus();
				$viewerLayer.show();
			}
		}

		function viewerKeyboardControl(e) {
			var keyCode = utils.getKeyCode(e);
			//utils.log('keyCode : ' +keyCode);

			var prevCode = 37;
			var nextCode = 39;

			if (keyCode == prevCode || keyCode == nextCode) {
				if (keyCode == prevCode) {
					$slide.slide && $slide.slide('prev');
				}
				if (keyCode == nextCode) {
					$slide.slide && $slide.slide('next');
				}
				return false;
			}
		}

		function layerResizeHandler() {

			windowSize = utils.windowSize();	// reset : window size
			windowSize.width = windowSize.width < 800 ? 800 : windowSize.width;
			windowSize.height = windowSize.height < 640 ? 640 : windowSize.height;
			imageViewPort = { width: (windowSize.width - 240), height: windowSize.height - 80 };

			$viewerLayer.find('.viewer_wrap').css(windowSize);
			$viewerLayer.find('.viewer_view').css(imageViewPort);
			$viewerLayer.find('.image_area').css(imageViewPort);
			$viewerLayer.find('.image_center').css(imageViewPort);

			_viewer.resize();
			return false;
		}

		function hideViewerLayer() {
			$(window).off('resize', layerResizeHandler);
			$(document.body).off('keydown', viewerKeyboardControl);
			$body.css('overflow', '');
			$viewerLayer.hide().find(DOM_SELECTOR.viewerBody).empty();
			utils.loading(true);
		}

		function PhotoViewer(viewerConfig) {
			var _imageViewer = this;

			this.open = function () {

				utils.getJsonp({
					url: config.apiPath + viewerConfig.id,
					success: function (res) {
						try {
							viewerConfig.title = res.Photo.Title;
							viewerConfig.photoItems = res.List;

						} catch (e) { };

						render();
					}
				});
			};

			this.resize = function () {

				$viewerLayer.find('.image_area img').each(function () {
					imageLoad(this);
				});
			};

			function imageLoad(img) {

				var size = utils.getImageSize(img.src);
				var $img = $(img);
				var Astyles = { width: 0, height: 0, 'margin-top': 0 };
				var Bstyles = {};
				var imageRatio = size.width / size.height;
				var viewerRatio = imageViewPort.width / imageViewPort.height;

				// 이미지 가로 기준으로 사이즈를 맞춘다.
				if (imageRatio > viewerRatio) {

					Astyles.width = imageViewPort.width;
					Astyles.height = parseInt(Astyles.width / imageRatio, 10);
					// 가로 기준일때만 margin-top 조절.
					Astyles['margin-top'] = parseInt((imageViewPort.height - Astyles.height) / 2, 10);

					// 이미지 세로 기준으로 사이즈를 맞춘다.
				} else {
					Astyles.height = imageViewPort.height;
				}

				if (Astyles.width > 0) {
					Bstyles.width = Astyles.width;
				}
				if (Astyles.height > 0) {
					Bstyles.height = Astyles.height;
				}
				if (Astyles['margin-top'] > 0) {
					Bstyles['margin-top'] = Astyles['margin-top'];
				}

				$img.css(Bstyles).show();
			}

			function render() {
				//utils.log('## render');

				var totalCount = viewerConfig.photoItems && viewerConfig.photoItems.length,
					viewer = {
						view: '<div class="viewer_view" data-bind="list" style="width:' + imageViewPort.width + 'px;height:' + imageViewPort.height + 'px;overflow:hidden;"><div data-bind="item"></div></div>',
						desc: '<div class="viewer_desc">' +
							'<span class="desc_overlay"></span>' +
							'<span class="desc_wrap">' +
								'<strong class="mg"><a href="#none" data-bind="link"></a></strong>' +
								'<em class="mg"><a href="#none" data-bind="link" style="display:none;">기사보기</a></em>' +
							'</span>' +
							'<span class="share_wrap"><a href="#none" class="share_button"><span class="icon">SNS 공유</span></a></span>' +
						'</div>',
						nav: '<div class="viewer_nav"><button type="button" class="btn-prev">prev</button><span class="info mg"><em>1</em> / ' + totalCount + '</span><button type="button" class="btn-next">next</button></div>'
					},
					directives = {
						list: {
							item: {
								html: function (params) {
									var $item = $(params.element);
									if (this.Type == ITEM_TYPE.image) {
										$item.css({ width: imageViewPort.width, height: imageViewPort.height, float: 'left', overflow: 'hidden' });
									}
									return itemDecorator.apply(this);
								},
								'class': function () { return CLASS_NAMES[this.Type] },
								'data-page': function () { return this.page; },
								'data-frstcode': function () { return this.FrstCode; }
							}
						},
						link: {
							href: function () { return this.link; },
							text: function (params) { return params.value ? params.value : this.title; }
						}
					},
					listHtml = '', descHtml = '',
					viewerItems = [];

				function itemDecorator() {

					var html = '';

					if (this.Type == ITEM_TYPE.image) {
						html = '<div class="image_center" style="width:' + imageViewPort.width + 'px;height:' + imageViewPort.height + 'px;"><img src="' + config.pdsPath + this.Image + '" alt="" style="display:none;" onload="utils.photoViewerOnload(this)" onerror="utils.imageErrorHandler(this)"></div>';
					} else if (this.Type == ITEM_TYPE.ad) {
						html = '<iframe scrolling="no" frameborder="0" marginheight="0" marginwidth="0" width="300" height="250" id="DASlot807" name="DASlot807" src="https://dgate.joins.com/hc.aspx?ssn=807&b=joins.com"></iframe>';
					} else if (this.Type == ITEM_TYPE.list) {
						html = '' +
						'<dl class="clearfx" data-bind="topItem">' +
							'<dt>' +
								'<strong class="mg"><a data-bind="link"></a></strong>' +
							'</dt>' +
							'<dd>' +
								'<span class="thumb"><a data-bind="link"><img data-bind="image"><span class="mask"></span></a></span>' +
								//'<a href="#none" class="btn_viewer mg"><span class="icon"></span>19</a>' +
							'</dd>' +
						'</dl>' +
						'<ul class="clearfx" data-bind="list">' +
							'<li>' +
								'<span class="thumb"><a data-bind="link"><img data-bind="image"></a></span>' +
								'<strong><a data-bind="link"></a></strong>' +
							'</li>' +
						'</ul>' +
						'<div class="ad">' +
							'<iframe scrolling="no" frameborder="0" marginheight="0" marginwidth="0" width="300" height="250" id="DASlot681" name="DASlot681" src="https://dgate.joins.com/hc.aspx?ssn=681&amp;b=joins.com" title="광고"></iframe>' +
						'</div>';
					}
					return html;
				}

				utils.photoViewerOnload = function (img) {
					imageLoad(img);
				};

				function setRenderData() {

					viewerConfig.photoItems.forEach(function (v, i, a) {
						v.Type = ITEM_TYPE.image;
						v.page = i + 1;
						v.frstcode = a[i].FrstCode;
						viewerItems.push(v);
					});

					// add ad_item.
					for (var i = 0, len = parseInt((viewerItems.length - 1) / 5, 10) ; i < len; i++) {
						viewerItems.splice((i + 1) * 5 + i, 0, { Type: ITEM_TYPE.ad });
					}

					if (viewerItems.length < 5) {
						viewerItems.push({ Type: ITEM_TYPE.ad });
					}

					viewerItems.push({ Type: ITEM_TYPE.list });
				}

				setRenderData();
				listHtml = $.renderTemplate({
					data: { list: viewerItems },
					template: viewer.view,
					directives: directives
				});

				//utils.log('#################');
				//utils.log(viewerItems);

				$viewerLayer.find('.bd').html('');
				$viewerLayer.find('.bd').append(listHtml).append(viewer.desc).append(viewer.nav);

				utils.getJsonp({
					url: utils.config('apiPath') + '/static/popularphotos',
					success: function (res) {
						setPhotos(res);
					}
				});

				//utils.log('-------------------------viewerConfig');
				//utils.log(viewerConfig);

				$('.share_wrap', $viewerLayer).sharePlate('/pic/photoviewer/' + viewerConfig.id, viewerConfig.title);
				var $desc = $('.desc_wrap', $viewerLayer);

				function setPhotos(d) {

					var data = {
						topItem: {},
						list: []
					},
					directives = {
						topItem: { link: utils.decorators.link, image: utils.decorators.image },
						list: { link: utils.decorators.link, image: utils.decorators.image }
					};

					try {
						data.topItem = { link: { href: '#' + d.List[0].Link, text: d.List[0].Title }, image: { src: d.List[0].Thumbnail } };

						for (var i = 1, len = 7; i < len; i++) {
							data.list.push({ link: { href: '#' + d.List[i].Link, text: d.List[i].Title }, image: { src: d.List[i].Thumbnail } });
						}
					} catch (e) { utils.log(e); };

					$viewerLayer.find('.list_wrap').render(data, directives);
					$viewerLayer.find('.list_wrap').on('click', 'a', function () {
						//utils.log('## list click');
						var $link = $(this);
						var id = $link.attr('href').replace('#', '');

						viewerConfig.id = id;
						_imageViewer.open();
						return false;
					});
					//utils.log($viewerLayer.find('.list_wrap'));
				}

				setDesc(0);

				function setDesc(index) {

					//utils.log(viewerItems);
					//utils.log('$#### setDesc : ' + index)

					var item = viewerItems.filter(function (v) { return v.page == index + 1; }),
						$itemDesc = $desc.find('>strong'),
						$link = $desc.find('a'),
						text = '';

					if (index == -1) {
						hide();
						return;
					}
					if (item.length == 0) return;

					text = item[0].Link ? '<a href="' + item[0].Link + '">' + item[0].Title + '</a>' : item[0].Title;

					if (item.length == 0) {
						hide();
					} else {

						$itemDesc.html(text).show();
						if (item[0].Link) {
							$link.attr('href', item[0].Link).show();
						} else {
							$desc.find('>em>a').hide();
						}
					}
					function hide() {
						$itemDesc.hide();
						$link.hide();
					}
				}

				var nextSlideIndex = -1;
				$slide = $viewerLayer.find('.viewer_view').slideMotion({
					infinite: false,
					slidesToShow: 1,
					slidesToScroll: 1,
					swipe: false,
					prevArrow: $viewerLayer.find('.btn-prev'),
					nextArrow: $viewerLayer.find('.btn-next'),
					beforeChange: function (event, slick, currentIndex, nextIndex) {

						if (nextSlideIndex == nextIndex) {

							if (viewerConfig.close != 'window') {
								if (viewerConfig.isPhotoList) {
									checkNextPhotoViewer();
								} else {
									hideViewerLayer();
								}
							}

							return false;
						}

						function checkNextPhotoViewer() {

							var itemIndex = $items.index($item),
								viewerId = '';

							if ((event.type == 'prev' && itemIndex != 0) || (event.type == 'next' && itemIndex < $items.length - 1)) {

								if (event.type == 'next') {
									$item = $items.eq(itemIndex + 1);
								} else {
									$item = $items.eq(itemIndex - 1);
								}

								viewerId = $item.data('id');

								if (viewerConfig.id == viewerId) {
									checkNextPhotoViewer();
								} else {
									viewerConfig.id = viewerId;
									_imageViewer.open();
								}
							} else {
								hideViewerLayer();
							}

						}

						nextSlideIndex = nextIndex;
						var data = $viewerLayer.find('.viewer_view').find('[data-bind="item"]').eq(nextIndex).data();

						if (data.page) {
							$viewerLayer.find('.viewer_nav em').text(data.page);
							setDesc(data.page - 1);
						} else {
							setDesc(-1);
						}

						if (data.frstcode != 0) {
							viewerConfig.frstcode = data.frstcode;
						}
						utils.setTrackingLog({
							type: 'photo',
							params: {
								gid: viewerConfig.id,
								no: nextIndex,
								servcode: viewerConfig.frstcode
							}
						});
					}
				});
				utils.loading(true);
			}
		}

		// ImageViewer
		function ImageViewer(viewerConfig) {

			//utils.log('## ImageViewer');

			var _imageViewer = this;

			this.open = function (items) {

				//utils.log('## ImageViewer.open');
				//utils.log(viewerConfig);

				//utils.log($('div.ab_photo.photo_center[data-type!=photo]', '#article_body'));
				//utils.log(items);

				var $list = $('div.ab_photo.photo_center[data-type!=photo]', '#article_body');
				items = [];

				$list.each(function () {
					var $item = $(this), images = $item.data('images');
					var imageSize = $item.css('width').replace('px', '').replace('Px', '').replace('PX', '');
					if (imageSize >= 580) {
						if (images) {
							items = items.concat(images);
						} else {
							items.push({ Image: $item.find('img').attr('src'), Description: $item.find('.caption').text() });
						}
					}
				});

				//utils.log('**********************');
				//utils.log(imageViewPort);
				viewerConfig.photoItems = items;
				render();
			};
			this.resize = function () {
				$viewerLayer.find('.image_area img').each(function () {
					imageLoad(this);
				});
			};
			function imageLoad(img) {
				var size = utils.getImageSize(img.src);
				var $img = $(img);
				var Astyles = { width: 0, height: 0, 'margin-top': 0 };
				var Bstyles = {};
				var imageRatio = size.width / size.height;
				var viewerRatio = imageViewPort.width / imageViewPort.height;

				// 이미지 가로 기준으로 사이즈를 맞춘다.
				if (imageRatio > viewerRatio) {

					//if (size.width > imageViewPort.width) {
					//	Astyles.width = imageViewPort.width;
					//} else {
					//	Astyles.width = size.width;
					//}
					Astyles.width = imageViewPort.width;

					// 가로 기준일때만 margin-top 조절.
					Astyles.height = parseInt(Astyles.width / imageRatio, 10);
					Astyles['margin-top'] = parseInt((imageViewPort.height - Astyles.height) / 2, 10);

					// 이미지 세로 기준으로 사이즈를 맞춘다.
				} else {
					//if (size.height > imageViewPort.height) {
					//	Astyles.height = imageViewPort.height;
					//} else {
					//	Astyles['margin-top'] = parseInt((imageViewPort.height - size.height) / 2, 10);
					//}
					Astyles.height = imageViewPort.height;
				}

				if (Astyles.width > 0) {
					Bstyles.width = Astyles.width;
				}
				if (Astyles.height > 0) {
					Bstyles.height = Astyles.height;
				}
				if (Astyles['margin-top'] > 0) {
					Bstyles['margin-top'] = Astyles['margin-top'];
				}

				$img.css(Bstyles).show();
			}
			function render() {
				//utils.log('## render');

				var totalCount = viewerConfig.photoItems && viewerConfig.photoItems.length,
					viewer = {
						view: '<div class="viewer_view" data-bind="list" style="width:' + imageViewPort.width + 'px;height:' + imageViewPort.height + 'px;overflow:hidden;"><div data-bind="item"></div></div>',
						desc: '<div class="viewer_desc">' +
							'<span class="desc_overlay"></span>' +
							'<span class="desc_wrap">' +
								'<strong class="mg"><a href="#none" data-bind="link"></a></strong>' +
							'</span>' +
						'</div>',
						nav: '<div class="viewer_nav"><button type="button" class="btn-prev">prev</button><span class="info mg" style="width: initial;left: initial;bottom: 16px;right: 71px;"><em>1</em> / ' + totalCount + '</span><button type="button" class="btn-next">next</button></div>'
					},
					directives = {
						list: {
							item: {
								html: function (params) {
									var $item = $(params.element);
									$item.css({ width: imageViewPort.width, height: imageViewPort.height, position: 'relative', overflow: 'hidden', top: 0, left: 0 });
									//'width:' + + 'px;height:' + + 'px;float:left;overflow:hidden;'
									return itemDecorator.apply(this);
								},
								'class': function () { return CLASS_NAMES[this.Type] },
								//'style': function () { return 'width:' + imageViewPort.width + 'px;height:' + imageViewPort.height + 'px;float:left;overflow:hidden;' },
								'data-page': function () { return this.page; }
							}
						},
						link: {
							href: function () { return this.link; },
							text: function (params) {
								return params.value ? params.value : this.title;
							}
						}
					},
					listHtml = '', descHtml = '',
					viewerItems = [];

				function itemDecorator() {

					var html = '<div class="image_center" style="width:' + imageViewPort.width + 'px;height:' + imageViewPort.height + 'px;"><img src="' + this.Image + '" alt="" onload="utils.photoViewerOnload(this)" onerror="utils.imageErrorHandler(this)"></div>';

					return html;
				}

				utils.photoViewerOnload = function (img) {
					imageLoad(img);
				};

				function setRenderData() {
					//utils.log('####');
					//utils.log(viewerConfig.photoItems);
					viewerConfig.photoItems.forEach(function (v, i, a) {
						v.Type = ITEM_TYPE.image;
						v.page = i + 1;
						viewerItems.push(v);
					});
				}

				setRenderData();
				listHtml = $.renderTemplate({
					data: { list: viewerItems },
					template: viewer.view,
					directives: directives
				});

				$viewerLayer.find('.bd').append(listHtml).append(viewer.desc).append(viewer.nav);
				$('.share_wrap', $viewerLayer).sharePlate();
				$viewerLayer.find('.viewer_nav em').text(viewerConfig.index + 1);

				var $desc = $('.desc_wrap', $viewerLayer);

				// TODO : min 사이즈 설정.
				// set slideMotion.
				//utils.log('$$$$$$$$$$$$$$$$$$$$');
				//utils.log($viewerLayer.find('.btn-prev'));slideMotion

				setDesc(viewerConfig.index);

				function setDesc(index) {

					//utils.log(viewerItems);
					//utils.log('$#### setDesc : ' + index)

					var item = viewerItems.filter(function (v) { return v.page == index + 1; }),
						$itemDesc = $desc.find('>strong'),
						$link = $desc.find('a'),
						text = '';

					if (index == -1) {
						hide();
						return;
					}
					if (item.length == 0) return;

					text = item[0].Link ? '<a href="' + item[0].Link + '">' + item[0].Description + '</a>' : item[0].Description;

					if (item.length == 0) {
						hide();
					} else {
						utils.log('#####');
						utils.log(text);
						$itemDesc.html(text).show();
						if (item[0].Link) {
							$link.attr('href', item[0].Link).show();
						} else {
							$desc.find('>em>a').hide();
						}
					}
					function hide() {
						$itemDesc.hide();
						$link.hide();
					}
				}

				var nextSlideIndex = -1;
				$slide = $viewerLayer.find('.viewer_view').slideMotion({
					infinite: false,
					initialSlide: viewerConfig.index || 0,
					slidesToShow: 1,
					slidesToScroll: 1,
					swipe: false,
					prevArrow: $viewerLayer.find('.btn-prev'),
					nextArrow: $viewerLayer.find('.btn-next'),
					beforeChange: function (event, slick, currentIndex, nextIndex) {

						//utils.log('$$$$$ beforeChange');
						if (nextSlideIndex == nextIndex) {
							//utils.log('$$$$$$$$$$$$$$$$$ close');
							hideViewerLayer();
							return false;
						}
						nextSlideIndex = nextIndex;

						var data = $viewerLayer.find('.viewer_view').find('[data-bind="item"]').eq(nextIndex).data();

						//utils.log('nextIndex : ' + nextIndex);
						//utils.log('## data.page : ' + data.page);

						if (data.page) {
							$viewerLayer.find('.viewer_nav em').text(data.page);
							setDesc(data.page - 1);
						} else {
							setDesc(-1);
						}

						utils.setTrackingLog({
							type: 'image',
							params: {
								tid: utils.getTotalId(),
								no: nextIndex
							}
						});
					}
				});
				utils.loading(true);
			}
		}

		// ImageViewer
		function ImageViewer_() {

			//utils.log('## ImageViewer');

			var viewerConfig = { id: '', photoItems: [], desc: {} },
				_imageViewer = this;

			this.open = function (items) {

				utils.log('## ImageViewer.open');
				utils.log($('div.ab_photo[data-type!=photo]', '#article_body'));
				utils.log(items);

				var $list = $('div.ab_photo[data-type!=photo]', '#article_body');
				items = [];

				$list.each(function () {
					var $item = $(this), images = $item.data('images');

					utils.log('roof');
					utils.log(images);
					if (images) {
						items = items.concat(images);
					} else {
						items.push({ Image: $item.find('img').attr('src'), Description: $item.find('.caption').text() });
					}
				});

				utils.log('**********************');
				utils.log(imageViewPort);
				viewerConfig.photoItems = items;
				render();
			};

			function render() {
				//utils.log('## render');

				var totalCount = viewerConfig.photoItems && viewerConfig.photoItems.length,
					viewer = {
						view: '<div class="viewer_view" data-bind="list" style="width:' + imageViewPort.width + 'px;height:' + imageViewPort.height + 'px;overflow:hidden;"></div>',
						nav: '<div class="viewer_nav"><button class="btn-prev">prev</button><span class="info mg"><em>1</em> / ' + totalCount + '</span><button type="button" class="btn-next">next</button></div>'
					},
					viewerItems = [],
					directives = {
						item: { 'data-page': function () { return this.page; } },
						desc: { text: function () { return this.desc; } },
						image: { src: utils.decorators.image.src }
					},
					html = '',
					template = '<div class="image_area" data-bind="item">' +
						'<div class="image_center">' +
							'<span class="thumb"><img data-bind="image" onload="utils.imageViewerOnload(this)"></span>' +
							'<strong class="mg" data-bind="desc"></strong>' +
						'</div>' +
					'</div>';

				utils.imageViewerOnload = function (img) {
					var size = utils.getImageSize(img.src);
					imageLoad(img, size);
				};
				function imageLoad(img, size) {

					var $img = $(img);
					var styls = { width: size.width, height: size.height };

					$img.closest('.image_center').css({ width: size.width, height: size.height });
					$img.closest('.image_area').css({ width: size.width, height: size.height, 'margin-top': -parseInt(size.height / 2, 10), 'margin-left': -parseInt(size.width / 2, 10) });
				}

				try {
					viewerConfig.photoItems.forEach(function (v, i, a) {
						viewerItems.push({ image: { src: v.Image }, desc: this.Description, page: i + 1, Type: ITEM_TYPE.image });
					});

				} catch (e) { };

				html = $.renderTemplate({ template: template, data: viewerItems, directives: directives });

				//utils.log(html);

				$viewerLayer.find('.bd').append(viewer.view).append(viewer.nav);
				$viewerLayer.find('.viewer_view').html(html);

				// set slideMotion.
				$slide = $viewerLayer.find('.viewer_view').slideMotion({
					infinite: true,
					slidesToShow: 1,
					slidesToScroll: 1,
					swipe: false,
					prevArrow: $viewerLayer.find('.btn-prev'),
					nextArrow: $viewerLayer.find('.btn-next'),
					beforeChange: function (event, slick, currentIndex, nextIndex) {
						$viewerLayer.find('.viewer_nav em').text(nextIndex + 1);
					}
				});
				utils.loading(true);
			}
		}
	};

	/**
	 *
	 * @param options {type[String]}
	 */
	$.fn.loadAd = function (options) {
		try {
			if (this.length === 0) {
				return this;
			}
			var adJs = '//cast.imp.joins.com/persona.js';
			var AD_INFO = {
				'da_300': { src: adJs, 'data-id': '_9eCcKooTN6Z6qdaL3rJxA', name: 'joongang_p/article/article@article_top_right_300x250?mlink=3', adtype: "js", displaytype: "single", isshapepopup: false },
				'da_300_money': { src: adJs, 'data-id': 'ueO9cm3wSWmDUafjLLC__Q', name: 'joongang_p/article/article@article_economy_top_right_network_300x250?mlink=139', adtype: "js", displaytype: "single", isshapepopup: false }, //경제
				'da_300_type2': { src: adJs, 'data-id': 'tistOaAQT2Gd_VC0UJS0ew', name: 'joongang_p/article/article@section_main_300x250?mlink=314', adtype: "js", displaytype: "single", isshapepopup: false }, //오피니언,정치,경제 섹션홈
				'da_250': { src: adJs, 'data-id': 'PbT97zl7S-Cua4-iFVxONQ', name: 'joongang_p/article/article@article_middle_right_network_250x250?mlink=105', adtype: "js", displaytype: "single", isshapepopup: false },	   //디스플레이_250x250(섹션공통 , 리스트 공통)
				'da_250_857': { src: adJs, 'data-id': 'vl3U5S4kQEaIhD5O2Y04Ew', name: 'joongang_p/main/main@main_bottom_right_network_250x250?mlink=101', adtype: "js", displaytype: "single", isshapepopup: false },   //디스플레이_250x250(메인)
				'premium_text': { width: '260', height: '193', src: 'https://adbiz2.co.kr/joongang_wrt.html', title: '프리미엄링크 광고', id: 'premium_text', name: 'premium_text' },
				'biz_link': { width: '260', height: '172', src: '//ad.reople.co.kr/cgi-bin/PelicanC.dll?impr?pageid=0BDp&out=iframe', title: '비즈링크 광고' },
				'power_link': { width: '280', height: '90', src: 'http://agate.opap.co.kr/html/joongang/joongang14', title: '브랜드링크' },
				'popular_link': { width: '260', height: '194', src: 'https://adv.imadrep.co.kr/991_03.html', title: '인기링크 광고' },
				'sponsored_link': { width: '260', height: '320', src: 'https://adv.imadrep.co.kr/1262_02.html', title: '스폰서 광고' },
				'hotissue_link': { width: '260', height: '166', src: 'http://neops.co.kr/doublelift2/joongang_news.html', title: '핫이슈 광고', id: 'hotissue_link', name: 'hotissue_link' },
				'special_link': { width: '280', height: '90', src: 'https://adv.imadrep.co.kr/1263_02.html' },
				'special_link1': { width: '100%', height: '50', src: 'http://adv.mediaharbor.co.kr/nad/media/02VA1RdVsM/xmrSTHnprD_5.html', title: '텍스트 광고', id: 'nad_02VA1RdVsMxmrSTHnprD', name: 'nad_02VA1RdVsMxmrSTHnprD' },
				'special_link2': { width: '100%', height: '25', src: 'http://adv.imadrep.co.kr/1020_01.html', title: '텍스트 광고' },
				'band_ad_1': { width: '320', height: '50', src: 'http://dgate.joins.com/hc.aspx?ssn=732&b=joins.com', id: 'DASlot732', name: 'DASlot732' },
				'band_ad_2': { width: '320', height: '50', src: 'http://dgate.joins.com/hc.aspx?ssn=733&b=joins.com', id: 'DASlot733', name: 'DASlot733' },
				'band_ad_3': { width: '320', height: '50', src: 'http://dgate.joins.com/hc.aspx?ssn=734&b=joins.com', id: 'DASlot734', name: 'DASlot734' },
				'shopping_box': { width: '640', height: '211', src: 'http://exttag.about.co.kr/cgi-bin/PelicanC.dll?impr?pageid=01Lm&out=copy', id: 'M13201', name: 'M13201' },
				'premium_link': { width: '260', height: '136', src: '//ad.reople.co.kr/cgi-bin/PelicanC.dll?impr?pageid=0BDq&out=iframe' },
				'premium_image1': { width: '100%', height: '135', src: 'http://ad.reople.co.kr/cgi-bin/PelicanC.dll?impr?pageid=00O0&out=iframe', id: '' },
				'premium_image2': { width: '100%', height: '135', src: 'http://adin.ad4980.kr/s/2014/11/25/z1123128412.html', id: '' },
				'today_link1': { width: '100%', height: '30', src: 'http://static.joins.com/common/ui/ad/ad_joongang_mobile_article_text.html', id: '' },
				'today_link2': { width: '100%', height: '60', src: 'http://adpingpong1.co.kr/joongang_mo.html', id: '' },
				'today_link3': { width: '100%', height: '90', src: 'http://ad.reople.co.kr/cgi-bin/PelicanC.dll?impr?pageid=00Ez&out=iframe', id: '' },
				'today_link4': { width: '100%', height: '60', src: 'http://ad.reople.co.kr/cgi-bin/PelicanC.dll?impr?pageid=00FY&out=iframe', id: '' },
				'da_250_1': { src: adJs, 'data-id': '7TzXV_PfR6u5epgxyPjtOA', name: 'joongang_p/article/article@article_body_250x250?mlink=5', adtype: "js", displaytype: "multi", isshapepopup: false },
				//'da_250_culture': { width: '250', height: '250', src: 'http://dgate.joins.com/hc.aspx?ssn=574&b=joins.com&slotsn=839', id: 'DASlot574', name: 'DASlot574' },                      //사용안함_20171214
				//'da_250_politics': { width: '250', height: '250', src: 'http://dgate.opap.co.kr/hc.aspx?ssn=1057&b=opap.co.kr', id: 'DASlot1057', name: 'DASlot1057' },                           //사용안함_20171214
				'display_679': { src: adJs, 'data-id': 'Y-IIVnQORrubegCS97pyhg', name: 'joongang_p/main/main@main_top_right_300x250?mlink=1', adtype: "js", displaytype: "single", isshapepopup: false },//디스플레이_300x250(메인)(신)
				//'display_679': { width: '300', height: '250', src: 'http://dgate.joins.com/hc.aspx?ssn=679&b=joins.com', id: 'DASlot679', name: 'DASlot679' },//디스플레이_300x250(메인)(구)
				'display_571': { width: '300', height: '250', src: 'http://dgate.joins.com/hc.aspx?ssn=571&b=joins.com', id: 'DASlot571', name: 'DASlot571' }, //디스플레이_300x250(메인2)
				'display_680': { src: adJs, 'data-id': '_9eCcKooTN6Z6qdaL3rJxA', name: 'joongang_p/article/article@article_top_right_300x250?mlink=3', adtype: "js", displaytype: "single", isshapepopup: false },//디스플레이_300x250(섹션공통 , 리스트 공통)
				'display_748': { src: adJs, 'data-id': '_9eCcKooTN6Z6qdaL3rJxA', name: 'joongang_p/article/article@article_top_right_300x250?mlink=3', adtype: "js", displaytype: "single", isshapepopup: false },//캐나다,미국 여행
				//'display_749': { width: '250', height: '250', src: 'http://dgate.joins.com/hc.aspx?ssn=749&b=joins.com', id: 'DASlot749', name: 'DASlot749' }, //디스플레이_250x250(여행레저)      //사용안함_20171214
				'display_799': { src: adJs, 'data-id': '_9eCcKooTN6Z6qdaL3rJxA', name: 'joongang_p/article/article@article_top_right_300x250?mlink=3', adtype: "js", displaytype: "single", isshapepopup: false }, //디스플레이_300x250(선데이홈)
				'display_800': { width: '300', height: '250', src: 'http://dgate.joins.com/hc.aspx?ssn=800&b=joins.com', id: 'DASlot800', name: 'DASlot800' }, //디스플레이_300x250(선데이 기사면)
				'display_1056': { width: '300', height: '250', src: 'http://dgate.joins.com/hc.aspx?ssn=1056&b=joins.com', id: 'DASlot1056', name: 'DASlot1056' }, //디스플레이_300x250(정치홈, 기사면)
				'left_592': { src: adJs, 'data-id': 'G9ClswP7RKuBv2wz4UqIfQ', name: 'joongang_p/main/main@main_top_left_120x200?mlink=2', adtype: "js", displaytype: "single", isshapepopup: false },//메인_좌측상단_120x200(신)
				'left_592_2': { src: adJs, 'data-id': 'DDg3iAGvRC-TT0UXCv7krA', name: 'joongang_p/main/main@(test)main_top_left_120x200?mlink=320', adtype: "js", displaytype: "single", isshapepopup: false },//메인_좌측상단_120x200(플래시)
				'left_593': { src: adJs, 'data-id': 'FW0VC96mSiiwcqV016DNcQ', name: 'joongang_p/article/article@article_top_left_120x200?mlink=4', adtype: "js", displaytype: "single", isshapepopup: false },// 섹션_좌측
				'left_593_type2': { src: adJs, 'data-id': '_g7eWQ7WRZmMF6qVF8wZDg', name: 'joongang_p/article/article@section_main_120x200?mlink=315', adtype: "js", displaytype: "single", isshapepopup: false },  //오피니언,정치,경제 섹션_좌측
				'wide_797': { src: adJs, 'data-id': 'wlGUHhh6Ttam2kadpKsv3w', name: 'joongang_p/main/main@main_middle_right_house_260x80?mlink=155', adtype: "js", displaytype: "single", isshapepopup: false },//메인 우측 여백 - 와이드
				'wide_798': { src: adJs, 'data-id': 'eaB47LYoQ9iZJUKMbahl1g', name: 'joongang_p/article/article@article_middle_right_house_260x80?mlink=158', adtype: "js", displaytype: "single", isshapepopup: false },//기사면 우측 여백 - 와이드
				'bottom_513': { src: adJs, 'data-id': 'uBojJJMsS5G7XVraHg2DBg', name: 'joongang_p/article/article@article_bottom_left_network_300x250?mlink=107', adtype: "js", displaytype: "single", isshapepopup: false },//기사면 최하단
				'bottom_514': { src: adJs, 'data-id': 'OjBljObVTnenCluWvN05cA', name: 'joongang_p/article/article@article_bottom_middle_network_300x250?mlink=108', adtype: "js", displaytype: "single", isshapepopup: false },//기사면 최하단
				'bottom_745': { src: adJs, 'data-id': '57yewdxiQ0Wy4r2xtvJGWg', name: 'joongang_p/article/article@article_bottom_right_network_300x250?mlink=106', adtype: "js", displaytype: "single", isshapepopup: false },//기사면 최하단
				'shapepopup_589': { src: adJs, 'data-id': 'ElDgV__pQaK_iYKbDBEChA', name: 'joongang_p/main/main@main_popup_300x250?mlink=6', adtype: "js", displaytype: "single", isshapepopup: true },// 메인_레이어팝업 광고
				'shapepopup_590': { src: adJs, 'data-id': 'MTvQHUNFRKGZGNrGng-HCQ', name: 'joongang_p/article/article@article_popup_300x250?mlink=7', adtype: "js", displaytype: "single", isshapepopup: true },// 기사면 레이어팝업 광고
				'shoppingbox_496': { src: adJs, 'data-id': 'z0N7sbzPSqeI4B0jmOZeVA', name: 'joongang_p/article/article@article_top_network_728x90?mlink=104', adtype: "js", displaytype: "single", isshapepopup: true },//j플러스
				'ad_article_shoppingbox_640_211': { width: '640', height: '220', src: 'http://exttag.about.co.kr/cgi-bin/PelicanC.dll?impr?pageid=01Lm&out=copy' }, //아티클 하단 쇼핑박스
				'home_ci_806': { src: adJs, 'data-id': 'si8AWj0OTquJkYFVjJqktw', name: 'joongang_p/main/main@main_top_left_house_248x50?mlink=154', adtype: "js", displaytype: "single", isshapepopup: false }, //홈 제호옆 베너
				'da_photo_807': { width: '300', height: '250', src: 'https://dgate.joins.com/hc.aspx?ssn=807&b=joins.com', id: "DASlot807", name: "DASlot807" },
				'da_imc_260': { src: adJs, 'data-id': 'fYSmViKuQ-yTvjCSHMTQPw', name: 'joongang_p/article/article@article_bottom_right_house_260x52?mlink=159', adtype: "js", displaytype: "single", isshapepopup: false },
				'home_ci_820': { src: adJs, 'data-id': 'wwyangzmSgux29e7psHLtw', name: 'joongang_p/main/main@main_bottom_house_520x50?mlink=157', adtype: "js", displaytype: "single", isshapepopup: false }, //홈 디지털스페셜 위 배너
				'home_ci_821': { src: adJs, 'data-id': 'k4OkQURYRmWM7sVk9wtoWA', name: 'joongang_p/main/main@main_middle_house_520x50?mlink=156', adtype: "js", displaytype: "single", isshapepopup: false }, //홈 트랜드뉴스 위 배너
				'favorite_ad': { width: '260', height: '36', src: 'https://adv.imadrep.co.kr/1518_02.html', id: "DA1518_01", name: "DA1518_01" }, //많이본 기사 하단 AD
				'mainTopAd': { src: adJs, 'data-id': 'baW-8g5OQgqA7A-s65B1Hg', name: 'joongang_p/main/main@main_top_1060x317?mlink=367', adtype: "js", displaytype: "single", isshapepopup: false, closeButton: false },// mainTopAd
				'mainMiddleAd': { src: adJs, 'data-id': 'dkBYPKdeS-WWgSmqMBJLRQ', name: 'joongang_p/main/main@main_middle_1060x317?mlink=368', adtype: "js", displaytype: "single", isshapepopup: false, closeButton: false },// mainMiddleAd
				'mainBottomAd': { src: adJs, 'data-id': '_PpgS5orSIadENAjLnS7pQ', name: 'joongang_p/main/main@main_bottom_1060x317?mlink=369', adtype: "js", displaytype: "single", isshapepopup: false, closeButton: false },// mainBottomAd
                'ad_article_shoppingbox_1': { width: '200', height: '200', src: '//adex.ednplus.com/xc/h/Fz55Cvca' }, //아티클 하단 쇼핑박스1
				'ad_article_shoppingbox_2': { width: '200', height: '200', src: '//adex.ednplus.com/xc/h/Fz55CjWZ' }, //아티클 하단 쇼핑박스2
				'ad_article_shoppingbox_3': { width: '200', height: '200', src: '//adex.ednplus.com/xc/h/Fz55CcjT' }, //아티클 하단 쇼핑박스3
				'ab_adtxt_lt_1': { width: '300', height: '84', src: 'https://adbiz2.co.kr/joongang_wby.html', title: '아티클 바이라인 하단 광고1', id: 'ab_adtxt_lt_1', name: 'ab_adtxt_lt_1' },
				'ab_adtxt_lt_2': { width: '300', height: '57', src: 'https://adv.imadrep.co.kr/1517_01.html', title: '아티클 바이라인 하단 광고2', id: 'ab_adtxt_lt_2', name: 'ab_adtxt_lt_2' },
				'ab_adtxt_lt_4': { width: '300', height: '28', src: 'https://adv.imadrep.co.kr/1754_01.html', title: '아티클 바이라인 하단 광고4', id: 'ab_adtxt_lt_4', name: 'ab_adtxt_lt_4' },
				'ab_adtxt_rt': { width: '240', height: '205', src: '//ad.reople.co.kr/cgi-bin/PelicanC.dll?impr?pageid=0BDv&out=iframe', title: '아티클 바이라인 하단 광고5', id: 'ab_adtxt_rt', name: 'ab_adtxt_rt' },
				'ad_text_recommanded': { width: '260', height: '42', src: 'https://io1.innorame.com/imp/MKBOLbE418PX.iframe', title: '아티클 우측 추천기사 텍스트', id: 'ad_text_recommanded', name: 'ad_text_recommanded' },
				'left_915': { src: adJs, 'data-id': 'ALrxVsJZSbSKVbiLNtSluA', name: 'joongang_p/article/article@article_economy_top_left_network_120x600?mlink=138', adtype: "js", displaytype: "single", isshapepopup: false },  //경제 섹션_좌측
				'da_slot_926': { src: adJs, 'data-id': 'onktRvK8QcaQZDlQRqkMEg', name: 'joongang_p/main/main@military_main_260x52?mlink=260', adtype: "js", displaytype: "single", isshapepopup: false }, //Mr. 밀리터리
				'left_120': { src: adJs, 'data-id': 'QkBpU-R0TCe2ImAqMwQsNg', name: 'joongang_p/article/article@retirement_120x600?mlink=153', adtype: "js", displaytype: "single", isshapepopup: false },  //더오래 좌측
				'ja_home_left_915': { src: adJs, 'data-id': 'DFpgbJUNR-qsOKg4-vjbjw', name: 'joongang_p/main/main@main_left_120x600?mlink=161', adtype: "js", displaytype: "single", isshapepopup: false },  //중앙홈_좌측
				'right_120': { src: adJs, 'data-id': 'vOtlEKlvR9q-5dtetTXZgg', name: 'joongang_p/article/article@retirement_right_120x600?mlink=198', adtype: "js", displaytype: "single", isshapepopup: false },  //더오래 우측
				'mainTopAd_test': { src: adJs, 'data-id': 'V9a9wmy9SI-79Wg3XmTdhw', name: 'joongang_p/main/main@main_top_1060x317(test)?mlink=384', adtype: "js", displaytype: "single", isshapepopup: false, closeButton: false },//테스트용
				'mainMiddleAd_test': { src: adJs, 'data-id': 'aLd8zunxR5qiOsDkXMI2Og', name: 'joongang_p/main/main@main_middle_1060x317(test)?mlink=385', adtype: "js", displaytype: "single", isshapepopup: false, closeButton: false },//테스트용
				'mainBottomAd_test': { src: adJs, 'data-id': 'l0RTSYyDQjy72WwA2VjzSw', name: 'joongang_p/main/main@main_bottom_1060x317(test)?mlink=386', adtype: "js", displaytype: "single", isshapepopup: false, closeButton: false },//테스트용
				'display_679_test': { src: adJs, 'data-id': 'RlU1LkAuSSmMDgj8W3TpCA', name: 'joongang_p/main/main@main_300x250(test)?mlink=387', adtype: "js", displaytype: "single", isshapepopup: false },//테스트용
				'da_250_857_test': { src: adJs, 'data-id': '65h_onx4SLq3ajOJKWoUuQ', name: 'joongang_p/main/main@main_250x250(test)?mlink=388', adtype: "js", displaytype: "single", isshapepopup: false }//테스트용
			};
			var $p = this,
				html = '<div class="bd"></div>'
			$element = $('<iframe></iframe>'),
			url = {},
			attr = {
				scrolling: 'no',
				frameborder: '0',
				marginheight: '0',
				marginwidth: '0',
				width: '300',
				height: '250',
				title: '광고'
			},
			$ele = null,
			defaults = {
				type: 'da_300'
			},
			randomVal = 0,
			iframSrc = '',
			config = $.extend(true, defaults, options);

			attr = $.extend(attr, AD_INFO[config.type]);

			var staticPath = utils.config('staticPath');
			var middlePath = 'joongang_15re';

			if (staticPath.indexOf(middlePath) == -1) {
				staticPath = staticPath + '/' + middlePath;
			}

			if (attr.adtype === "js") {
				switch (attr.displaytype) {
					case "multi":
						$p.append('<div id="imp_ad_' + config.type + '"></div>');
						break;
					case "single":
						$p.append('<div class="bd"><div id="imp_ad_' + config.type + '"></div>' + (attr.closeButton == true ? '<a class="btn_close"></a>' : '') + '</div>');
						break;
					default:
						$p.append('<div class="bd"><div id="imp_ad_' + config.type + '"></div>' + (attr.closeButton == true ? '<a class="btn_close"></a>' : '') + '</div>');
						break;
				}
				if (!attr.isshapepopup) {
					$p.show();
				}

				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = AD_INFO[config.type].src;
				script.setAttribute('data-id', AD_INFO[config.type]['data-id']);
				script.setAttribute('name', AD_INFO[config.type]['name']);

				var obj = document.getElementById("imp_ad_" + config.type);
				if (obj !== null && obj !== undefined) {
					obj.appendChild(script);
				}
			} else {
				$element.data({ 'type': config.type, 'onload': config.onload });
				$element.on('load', function () {

					var $iframe = $(this),
						iframeData = $iframe.data();

					$p.show();

					iframeData.onload && iframeData.onload($p);

					var $sub = $('#sub'),
						widgetName = 'ad_' + iframeData.type,
						widgets = $sub.data('widgets') || '';

					if (widgets.indexOf(widgetName) == -1) {
						$sub.data('widgets', widgets + ',' + widgetName);
					}
					utils.resetArticleSubWidget && utils.resetArticleSubWidget();
				});

				//// 아티클 바이라인 하단 iframe src setting
				//if (config.type === 'ab_adtxt_lt_1' || config.type === 'ab_adtxt_lt_3') {
				//    randomVal = Math.floor(Math.random() * 5) + 1;
				//    attr.src = attr.src + randomVal + ".html";
				//}

				//  다수의 iframe 필요한 경우가 있어서 제어문 추가 (2016-04-29)
				switch (config.type) {
				    case "ab_adtxt_lt_1":
					case "ab_adtxt_lt_2":
					case "ab_adtxt_lt_4":
					case "ab_adtxt_rt":
					case "ad_text_recommanded":
					case "da_slot_926":
						$p.append($element.attr(attr));
						break;
					default:
						$p.html(html).find('.bd').html($element.attr(attr));
						break;
				}
			}

			return this;
		} catch (e) {}
	};

	/**
	 * articl font size 변경 모듈
	 * @param options
	 */
	$.fn.changeFontSize = function () {
		var config = { step: 1, max: 5, min: 1, cls: 'fs' },
			BTN_TYPE = { plus: 'plus', minus: 'minus' },
			fontSize = utils.getCookie(COOKIE_NAMES.fontSize) || 4,
			self = this,
			removeCls = 'fs1 fs2 fs3 fs4 fs5',
			$el = $(DOM_SELECTOR.articleBody),
			$btns = self.find('button'),
			isLoginContents = utils.getIsLoginContents();

		(function init() {

			fontSize = parseInt(fontSize, 10);
			$btns.each(function (v) {

				var $btn = $(v),
					type = $btn.data('type');

				if (type == BTN_TYPE.plus && fontSize == config.max) {
					$btn.attr('disabled', 'disabled');
				} else if (type == BTN_TYPE.minus && fontSize == config.min) {
					$btn.attr('disabled', 'disabled');
				}

			});
		})();

		$btns.on('click', function () {
			if (isLoginContents && !userInfo.isLogin()) {
				alert('로그인을 해야 이용하실 수 있습니다.');
				return false;
			}
			var $btn = $(this), type = $btn.data('type');

			setFont($btn, type);
			return false;
		});

		function setFont(target, type) {

			var cheeckSize = type === BTN_TYPE.plus ? fontSize + config.step : fontSize - config.step;

			if (validateFontSize(cheeckSize)) {
				$btns.removeAttr('disabled');
				fontSize = cheeckSize;

				$.when(
					utils.setCookie(COOKIE_NAMES.fontSize, fontSize, 90, COOKIE_CONDITION.path, COOKIE_CONDITION.domain)
				).done(function () {
					$el.removeClass(removeCls).addClass(config.cls + fontSize);
					utils.resetArticleSubWidget && utils.resetArticleSubWidget();
				});
			} else {
				target.attr('disabled', 'disabled');
			}
		}

		function validateFontSize(checkSize) {
			var message = checkSize < config.min ? '최소 사이즈 입니다.' : '최대 사이즈 입니다.';

			if (config.min <= checkSize && config.max >= checkSize) {
				return true;
			} else {
				alert(message);
				return false;
			}
		}

		return this;
	};
	// Template 으로 Html 생성.
	// @depends transprency
	// @param options {template[String], data[Object], directives[Object]}
	// @return html[String]
	$.renderTemplate = function (options) {

		var defaults = {
			template: '',
			data: {},
			directives: {},
			debug: false
		},
			config = $.extend(true, defaults, options);

		//utils.log('config.debug : ' + config.debug);
		var $a = $('<div></div>').wrapInner(config.template);
		//utils.log($a.html());

		return $('<div></div>').wrapInner(config.template).render(config.data, config.directives, { debug: config.debug }).html();
	};
	/**
	 *
	 * @param options
	 */
	$.fn.sticky = function (options) {

		var
			defaults = {
				top: 100,
				cls: 'sticky',
				callback: function () { }
			},

			config = $.extend(true, defaults, options || {}),
			$win = $(window),
			isSticky = false,
			$head = this,
			$html = $('html');

		$(window).scroll(function () {
			move($win.scrollTop());
		});

		function move(scrollTop) {

			if (scrollTop > config.top) {

				if (!isSticky) {
					activeSticky();
				}
			} else {
				if (isSticky) {
					unactiveSticky();
				}
			}
		}

		function activeSticky() {
			isSticky = true;
			$html.addClass(config.cls);
			$head.addClass(config.cls);
			config.callback && config.callback($head);
		}

		function unactiveSticky() {
			isSticky = false;
			$html.removeClass(config.cls);
			$head.removeClass(config.cls);
			config.callback && config.callback($head);
		}

		(function init() {
			move($win.scrollTop());
		})();

		return this;
	};

	/**
	 *
	 * @param options
	 */
	$.fn.reporterCard = function (options) {
		var API_PATH = utils.config('apiPath') + '/reporter';

		var NO_IMAGE = utils.config('imagePath') + '/pc/article/v_noimg_journalist.jpg';

		var defaults = {
			container: '.journalist_area',
			activeClass: 'on',
			id: '',
			reporterId: '',
			layerClass: 'layer_journalist_wrap',
			template: {
				wrapper: '<div id="" class=""></div>',
				item: '' +
				'<div class="layer_journalist_area">' +
					'<span class="profile">' +
						'<span class="photo"></span>' +
						'<strong class="mg"><a data-bind="link"></a></strong>' +
						'<em class="departments"></em>' +
						'<span class="share_area"><a data-bind="item"></a></span>' +
					'</span>' +
					'<p data-bind="profileMessage"></p>' +
					'<dl>' +
						'<dt class="mg">기자에게 한마디 -</dt>' +
						'<dd data-bind="toReporter"></dd>' +
					'</dl>' +
				'</div>'
			}
		};

		return this.each(function (i, v) {

			var config = $.extend(true, options || {}, defaults),
				$container = $(config.container),
				$this = $(v);

			function render($el) {

				var $wrapper = null,
					id = config.id,
					wrapperId = id,
					wrapperClass = config.layerClass;

				if ($container.find('#' + id).length > 0) {
					$container.find('#' + id).toggle();
				} else {

					$wrapper = $(config.template.wrapper);
					$wrapper.attr('id', wrapperId).addClass(wrapperClass);
					$el.append($wrapper);
					getData({
						success: function (data) {
							utils.log(data);
							var directives = {
								photo: {
									html: function () {
										return '<a href="/reporter/' + this.photo.id + '"><img src="' + this.photo.src + '" alt="' + this.photo.alt + '" data-type="reporter64" onerror="utils.imageErrorHandler(this)" /><span class="frame"></span></a>';
									}
								},
								link: {
									href: function () { return '/reporter/' + this.link.id; },
									text: function () { return this.link.text; }
								},
								profileMessage: {
									html: function () {
										var ele = arguments[0].element;

										if (this.profileMessage === '') {
											$(ele).hide();
										}
										return '<span class="text">' + this.profileMessage + '</span>'
									}
								},
								toReporter: {
									html: function () {
										var ele = arguments[0].element;

										if (this.toReporter === '') {
											$(ele).hide();
											$(ele).prev().hide();
										}
										return '<span class="text">' + this.toReporter + '</span>'
									}
								},
								'share_area': {
									item: {
										href: function () { return this.href; },
										title: function () { return this.title; },
										html: function () {
											if (this.href === '') {
												$(arguments[0].element).hide();

											}
											return '<span class="' + this.cls + '">' + this.name + '</span>';
										}
									}
								}
							};
							$wrapper.html(config.template.item).render(data, directives);

							if (data.Articles !== undefined && data.Articles.length > 0) {
								var list = data.Articles.slice(0, 2);
								var html = '<dt class="mg">기자의 인기기사 -</dt>';

								$.each(list, function (i, v) {
									html += '<dd><a href="/article/' + v.TotalId + '">' + v.Title + '</a></dd>';
								});

								$wrapper.find('dl').append(html);
							}
						}
					});
				}
			}

			function getData(obj) {
				var url = API_PATH + '/' + config.reporterId + '/card';

				utils.getJsonp({
					url: url,
					success: function (res) {
						var originData = res.card,
							jobInfo = (originData.Company || '') + (originData.Company !== '' ? ' ' : '') + (originData.JobInfo || '')
						data = {
							photo: {
								id: originData.Id,
								src: originData.ProfileImage === undefined ? NO_IMAGE : originData.ProfileImage,
								alt: originData.Name || '',
								name: originData.Name || ''
							},
							link: {
								id: originData.Id,
								text: originData.Name || ''
							},
							departments: jobInfo,
							'share_area': [],
							profileMessage: originData.ProfileMessage || '',
							toReporter: originData.ToReporter || '',
							Articles: originData.Articles
						};

						$.each(originData.SnsLinks, function (i, v) {
							var tmp = {};

							if (v.Type === 'Facebook' && (v.Link !== undefined && v.Link !== '')) {
								tmp.cls = 'icon_facebook';
								tmp.href = v.Link;
								tmp.target = '_blank';
								tmp.title = '(새창) 페이스북으로 이동';
								tmp.name = '페이스북';
							} else if (v.Type === 'Twitter' && (v.Link !== undefined && v.Link !== '')) {
								tmp.cls = 'icon_twitter';
								tmp.href = v.Link;
								tmp.target = '_blank';
								tmp.title = '(새창) 트위터로 이동';
								tmp.name = '트위터';
							}

							if (!$.isEmptyObject(tmp)) { data['share_area'].push(tmp); }
						});

						if (originData.EMail !== '') {

							data['share_area'].push({
								cls: 'icon_email',
								href: 'mailto:' + originData.EMail,
								target: '_blank',
								title: '',
								name: '이메일'
							});
						}

						obj.success && obj.success(data);
					}
				});
			};

			config.reporterId = $this.data('reporterid');

			$this.on('click', function (e) {

				var $t = $(this),
					$parent = $t.closest('dd'),
					layerClass = config.layerClass,
					reporterId = $t.data('reporterid') || '';

				if (!reporterId) {
					utils.error('not defined reporter id.', true);
					return false;
				}

				config.id = 'layer_journalist' + reporterId;

				$parent.toggleClass(config.activeClass);
				$container.find('dd').not($parent).removeClass(config.activeClass).find('.layer_journalist_wrap').hide();

				render($parent);

				return false;
			});

			$('body').on('click', function (e) {
				var $target = $(e.target);

				if ($target.closest(config.container).length === 0) {

					$('.' + config.layerClass).hide();

					$(config.container).find('dd').removeClass('on');
				}
			});
		});
	};

	$.fn.setDefaultImage = function () {

		var imagePath = utils.config('imagePath');

		return this.each(function () {
			var $image = $(this),
				data = $image.data();

			if (!data.src && data.type) {
				$image.attr('src', imagePath + DEFAULTS_IMAGE[data.type]);
			} else {
				if (data.src) {
					$image.attr('src', utils.getPdsFullPath(data.src));
				} else if (data.origin) {
					$image.attr('src', utils.getPdsFullPath(data.origin));
				} else {
					$image.hide();
				}
			}
		});
	};

	$.fn.slideMotion = function (options) {

		var defaults = {},
			config = $.extend(true, defaults, options),
			$slide = this;

		return $slide.visualMotion(config);

		if (utils.browser.msie) {

			$slide = $slide.visualMotion(config);
			return $slide;

		} else {

			$slide.slick(config);
			if (config.thumbnails && config.thumbnails.length) {
				config.thumbnails.on('click', function () {
					var $item = $(this),
						index = config.thumbnails.index($item);

					$slide.slick('slickGoTo', index);
				});
			}

			if (config.play && config.play.length) {
				config.play.on('click', function () {
					var $item = $(this),
						classNames = { play: 'btn-play', pause: 'btn-pause' };

					if ($item.hasClass(classNames.play)) {
						$slide.slick('slickPlay');
						$item.removeClass(classNames.play).addClass(classNames.pause);
					} else {
						$slide.slick('slickPause');
						$item.removeClass(classNames.pause).addClass(classNames.play);
					}
				});
			}

			if (config.beforeChange) {
				$slide.on('beforeChange', config.beforeChange);
			}

			this.slide = function (_order) {
				var METHODS = {
					prev: function () { $slide.slick('slickPrev'); },
					next: function () { $slide.slick('slickNext'); },
					move: function (page) { $slide.slick('slickGoTo', page - 1); },
					addSlide: function (html, index) {

						utils.log('$$$$$$$$$$$$$ addSlide');
						index = index || 0;
						$slide.slick('slickAdd', html, index, true);
					},
					removeSlide: function (index) {
						index = index || 0;
						$slide.slick('slickRemove', index, true);
					}
				}

				//utils.log('asasdasdasddasd : ' + _order);
				var method = METHODS[_order];
				if (typeof method == 'function') {
					method(arguments[1], arguments[2], arguments[3]);
				}
			}

			return this;
		}
	};

	/**
	 *
	 * @param options
	 */
	$.fn.visualMotion = function (options) {

		var
			defaults = {
				'none': true,
				'active': 'active',
				'infinite': true,
				'initialSlide': 0,
				'slidesToShow': 1,
				'slidesToScroll': 1,
				'play': null,
				'autoplay': false,
				'autoplaySpeed': 3000,
				'prevArrow': null,
				'nextArrow': null,
				'thumbnails': null,
				'beforeChange': function () { },
				'afterChange': function () { }
			},
			config = $.extend(true, defaults, options),
			$list = this,
			$items = $list.children(),
			itemWidth = $list.width() / config.slidesToShow,
			itemStyles = {
				//'width': itemWidth,
				//'height': '100%',
				//'float': 'left'
			},
			currentGroup = config.initialSlide + 1,
			maxGroup = 10;

		//utils.log('## visualMotion currentGroup : ' + currentGroup);
		function init() {

			setIndex();

			if (config.play && config.play.length) {
				config.play.on('click', function () {
					autoPlay();
					return false;
				});
			}

			if (config.prevArrow && config.prevArrow.length) {
				config.prevArrow.on('click', function () {
					move('prev');
					return false;
				});
			}

			if (config.nextArrow && config.nextArrow.length) {
				config.nextArrow.on('click', function () {
					move('next');
					return false;
				});
			}
			if (config.thumbnails && config.thumbnails.length) {
				config.thumbnails.on('click', function () {
					var $item = $(this);
					currentGroup = config.thumbnails.index($item) + 1;
					activeItem();
				});
			}
			if (config.autoplay && config.play.length) {//autoplay 속성 추가
				autoPlay();
			}
		}
		var timeout = null;

		function autoPlay() {
			//margin 값 삭제
			config.play.css('margin', 0);
			if (config.play.hasClass('btn-play')) {
				play();
			} else {
				pause();
			}
		}

		function pause() {
			config.play.removeClass('btn-pause').addClass('btn-play');
			clearTimeout(timeout);
		}

		function play() {
			config.play.removeClass('btn-play').addClass('btn-pause');
			move('next');
			timeout = setTimeout(play, config.autoplaySpeed);
		}

		function setIndex() {

			var group = 1;
			$items = $list.children();
			$items.css(itemStyles);

			$items.each(function (i, v) {

				group = parseInt(i / config.slidesToShow, 10) + 1;
				maxGroup = group;

				$(v).data('group', group);
			});
			activeItem();
		}
		init();

		function activeItem(type) {

			var eventType = type == undefined ? 'move' : type;

			config.beforeChange && config.beforeChange({ type: eventType }, null, null, (currentGroup - 1) * config.slidesToShow);
			if (config.none) {
				$items.hide().removeClass(config.active);
				$items.find('[data-group=' + currentGroup + ']').show().addClass(config.active);
			} else {
				$items.removeClass(config.active);
				$items.find('[data-group=' + currentGroup + ']').addClass(config.active);
			}

			$items.find('[data-group=' + currentGroup + ']').show().addClass(config.active);

			$items.each(function (i, v) {
				var $item = $(v);
				if ($item.data('group') == currentGroup) {
					$item.show();
					// afterChange 이벤트 추가
					config.afterChange && config.afterChange({ type: eventType }, null, currentGroup);
				}
			});
		}

		function move(type) {
			if (type == 'next') {
				currentGroup = (currentGroup > maxGroup - 1) ? (config.infinite ? 1 : maxGroup) : currentGroup + 1;
			} else {
				currentGroup = (currentGroup == 1 ? (config.infinite ? maxGroup : 1) : currentGroup - 1);
			}

			activeItem(type);
		}

		$list.slide = function (_order) {
			var METHODS = {
				prev: function () { move('prev'); },
				next: function () { move('next'); },
				move: function (page) { currentGroup = page; activeItem(); },
				addSlide: function (html, pos) {

					$list.prepend(html);
					setIndex();
				},
				removeSlide: function (index) {

					$list.find('.slide').eq(index).remove();
					setIndex();
				}
			}

			var method = METHODS[_order];
			if (typeof method == 'function') {
				method(arguments[1], arguments[2], arguments[3]);
			}
		}

		return this;
	};

	$.fn.sharePlate = function (url, title) {

		var $plate = this,
			id = $plate.data('id'),				 // news : totalId, issue : issueId, reporter : reporterId
			target = $plate.data('target');		 // news, issue, reporter

		function getSnsHtml() {

			var
				html = '',
				data = {
					list: [
						{ name: '페이스북', title: '페이스북 공유', iconCls: 'icon_facebook', service: 'facebook' },
						//{ name: '카카오톡', title: '카카오톡 공유', iconCls: 'icon_kakaotalk', service: 'kakaotalk' },
						{ name: '트위터', title: '트위터 공유', iconCls: 'icon_twitter', service: 'twitter' },
						{ name: '카카오스토리', title: '카카오스토리 공유', iconCls: 'icon_kakaostory', service: 'kakaostory' },
						//{ name: '구글+', title: '구글+ 공유', iconCls: 'icon_googleplus', service: 'googleplus' },
						//{ name: '인스타그램', title: '인스타그램 공유', iconCls: 'icon_instagram' },
						{ name: '핀터레스트', title: '핀터레스트 공유', iconCls: 'icon_pinterest', service: 'pinterest' },
						{ name: '메일', title: '메일 공유', iconCls: 'icon_email', service: 'email' }
						//data.sns.push({ key: 'email', link: { text: '이메일', cls: 'email' } });
					]
				},
				directives = {
					list: {
						icon: { 'class': function () { return this.iconCls; }, 'className': function () { return this.iconCls; } },
						btn: {
							title: function () { return this.name; },
							text: function () { return this.name; },
							'data-service': function () { return this.service; },
							'data-id': function () { return id; },
							'data-target': function () { return target; }
						}
					}
				};

			if (url) {
				directives.list.btn['data-url'] = function () { return url; };
			}
			if (title) {
				directives.list.btn['data-title'] = function () { return title; };
			}

			html += '<span class="share_list mg" style="display:;z-index:1000;" data-bind="list">';
			html += '<a href="#none" data-bind="btn"><span class="icon"></span></a>';
			html += '</span>';

			return $('<div></div>').wrapInner(html).render(data, directives).html();
		}

		var $area = $(this),
			$btn = $area.find('.share_button'),
			$list = null;

		// close event : mouseleave

		function closeHandler() {
			if ($list) {
				$list.hide();
				$area.off('mouseleave', closeHandler);
				//utils.shareHandler.unbind($list.find('a'));
			}
		}

		$btn.on('click', function () {
			if ($list == null) {
				$list = $(getSnsHtml());
				$area.append($list);
				utils.shareHandler.bind($list.find('a'));

				if (target !== 'news') { //트랜드 뉴스 페이지와 같이 totalid 가 없는 경우 메일 공유하기 아이콘 hide
					$list.find('.icon_email').closest('a').hide();
				}

			} else {
				$list.show();
			}
			setTimeout(function () {
				$area.on('mouseleave', closeHandler);
			}, 400);
			return false;
		});
	};

	$.fn.setPagingDate = function () {

		if (this.length === 0) return false;

		var $wrap = this,
			nowDate = new Date(),
			changeDate = new Date('Mar 17 2018'),
			changelastDate = new Date('Mar 11 2018'),
			datepickerId = 'search_date',
			$displayDate = $("#display_search_date", $wrap),
			$datepicker = $("#" + datepickerId, $wrap),
			$btnOpen = $datepicker.parent().find('a'),
			selectDate = $displayDate.text() ? $displayDate.text().toDate() : nowDate,
			defaultLink = $datepicker.data('link'),
			$prev = $('.btn_prev', $wrap),
			$next = $('.btn_next', $wrap);

		$datepicker.datepicker({
			maxDate: nowDate,
			onSelect: function (val, inst) {
				location.href = getLink(val.replaceAll('.', '-'));
			},
			beforeShow: function (ele, inst) {
				var buttonSize = { width: 15, height: 18 },
					dialogWidth = inst.dpDiv.outerWidth();

				inst.dpDiv.css({ marginTop: -ele.offsetHeight + buttonSize.height + 'px', marginLeft: ele.offsetWidth - dialogWidth + buttonSize.width + 'px' });

			},
			beforeShowDay: function (date) {
				if (window.location.pathname.toLowerCase().indexOf('/sunday/') > -1 && window.location.pathname.toLowerCase().indexOf('/sundaymagazine/') == -1) {
					if (changeDate > date) {
						var day = date.getDay();
						return [(true, day == 0)];
					} else {
						var day = date.getDay();
						return [(true, day == 6)];
					}
				} else {
					var result = [true, ""];
					return result;
				}
			},
			onClose: function () {
				$btnOpen.addClass('toggle_off').removeClass('toggle_on');
			}
		}).datepicker("setDate", selectDate);

		$btnOpen.on('click', function () {
			$btnOpen.addClass('toggle_on').removeClass('toggle_off');
			$datepicker.datepicker("show");
			return false;
		});

		if (selectDate > nowDate.addDate(1)) {
			$prev.addClass('disable');
			$next.addClass('disable');
		} else if (selectDate >= nowDate) {
			$next.addClass('disable');
		}

		$prev.on('click', function () {
			if (window.location.pathname.toLowerCase().indexOf('/sunday/') > -1 && window.location.pathname.toLowerCase().indexOf('/sundaymagazine/') == -1) {
		    	if (changeDate.getTime() == selectDate.getTime()) {
		    		moveDate(-6);
		    	} else {
		    		moveDate(-7);
		    	}
		    }
		    else {
		        moveDate(-1);
		    }
			return false;
		});

		$next.on('click', function () {
			if (window.location.pathname.toLowerCase().indexOf('/sunday/') > -1 && window.location.pathname.toLowerCase().indexOf('/sundaymagazine/') == -1) {
		    	if (changelastDate.getTime() == selectDate.getTime()) {
		    		moveDate(6);
		    	} else {
		    		moveDate(7);
		    	}
		    }
		    else {
		        moveDate(1);
		    }
			return false;
		});

		function moveDate(val) {
			var d = selectDate.addDate(val);
			if (d <= nowDate) {
				location.href = getLink(d.format('yyyy-MM-dd'));
			}
		}

		function getLink(strDate) {
			var link = defaultLink ? defaultLink.toLocation() : location;
			return link.pathname + '?' + link.search.replaceParams({
				date: strDate
			});
		}
		return this;
	};

	/**
	 * @param obj
	 */
	$.fn.setShareForArticle = function (isBind) {

		isBind = isBind == undefined ? true : isBind;
		var totalId = $('#total_id').val() || '';

		function commentHandler() {
			var $btn = $(this);

			var selector = $btn.attr('href'),
				offsetTop = $(selector).offset().top - 76;

			$(document.body).scrollTop(offsetTop);
			return false;
		}

		return this.each(function () {
			var $btn = $(this),
				service = $btn.data('service'),
				TEXT_INFO = { bind: '(새창) {service} 공유', unbind: '(새창) {service}(으)로 이동' },
				serviceText = $btn.text(),
				title = '';

			if ($btn.length == 0 || !service) return;
			if (service == 'comment') {
				$btn.on('click', commentHandler);
			} else {
				if (isBind) {
					utils.shareHandler.bind($btn);
					title = TEXT_INFO.bind.replace('{service}', serviceText);
					$btn.data('target', 'news');
					$btn.data('id', totalId);
				} else {
					utils.shareHandler.unbind($btn);
					title = TEXT_INFO.unbind.replace('{service}', serviceText);
				}
				$btn.attr('title', title);
			}
		});
	};

	$.fn.imageTile = function (options) {
		var defaults = {
			minTileWidth: 90,
			maxTileWidth: 400,
			margin: 10,
			height: 180,
			type: 'image',
			currentPage: 1,
			perPage: 50,
			data: [],
			paramFormId: 'formFieldSet',
			params: {}
		},
		tileArray = [],
		queue = [],
		config = $.extend(true, defaults, options || {}),
		$self = this,
		$more = $('#tile-wrap').find('.more'),
		maxWidth = $self.width(),
		apiPATH = utils.config('apiPath'),
		irPATH = utils.config('irPath'),
		domainPATH = utils.config('webPcPath'),
		rowWidth = 0;

		(function init() {
			var fieldSet = $('#formFieldSet').serializeArray();

			$.each(fieldSet, function (i, v) {
				config.params[v.name] = v.value;
			});

			getList();

			$more.on('click', function () {
				tileArray = [];

				config.params.Page = parseInt(config.params.Page, 10) + 1;
				getList();
				return false;
			});
		})();

		function render(obj) {
			var margin = (obj.tileWidth - obj.width) / 2;
			var html = '<div class="title item" style="width:' + obj.tileWidth + 'px;height:180px;background-color:#efefef;text-align:center">' +
				'<a href="' + domainPATH + '/article/' + obj.Id + '" target="_blank">' +
				'<img src="' + utils.getPdsFullPathSize(obj.Thumbnail, 350) + '" style="height:' + obj.height + 'px;margin-left:' + margin + 'px;display:inline">' +
				'<span class="shadow"></span><h2>' + obj.Title + '</h2>' +
				'</a></div>';

			$self.append(html);
		}

		function completeLoadImg() {
			//var rowWidth = 0;

			if ($.isArray(tileArray) && tileArray.length > 0) {
				tileArray.sort(function (a, b) { return a.index - b.index; });

				tileArray.forEach(function (v, i, a) {
					rowWidth = rowWidth + v.itemsInfo.width;

					queue.push(v);

					if (rowWidth >= maxWidth - config.minTileWidth) { //들어갈 수 있는 공간이 최소사이즈보다 작게 나오는 경우가 있어서 최소 사이즈만큼 미리 빼준다.
						var largestItem = queue.sort(function (a, b) { return a.itemsInfo.width - b.itemsInfo.width; })[queue.length - 1];
						var subjectLargeWidth = 0;
						var shareWidth = Math.ceil((rowWidth - maxWidth) / queue.length + config.margin);
						var currentTileWidth = 0;

						//re sort index
						queue.sort(function (a, b) { return a.index - b.index; });
						queue.forEach(function (v, i, a) {
							if (v.index !== largestItem.index) {

								var itemsInfo = v.itemsInfo,
									itemWidth = itemsInfo.width - shareWidth;

								if (itemWidth < config.minTileWidth) {
									subjectLargeWidth = subjectLargeWidth + shareWidth;

									itemsInfo.tileWidth = itemsInfo.width;
								} else {
									itemsInfo.tileWidth = itemsInfo.width - shareWidth;
								}

								currentTileWidth = currentTileWidth + itemsInfo.tileWidth;

								render(itemsInfo);
							}

						});

						//가장 큰놈 width 수정
						largestItem.itemsInfo.tileWidth = subjectLargeWidth !== 0 ? largestItem.itemsInfo.width - (subjectLargeWidth + shareWidth) : largestItem.itemsInfo.width - shareWidth;

						if (largestItem.itemsInfo.tileWidth < 0) {
							largestItem.itemsInfo.tileWidth = maxWidth - currentTileWidth;
						}

						render(largestItem.itemsInfo);

						queue = [];
						largestItem = [];
						rowWidth = 0;
					}
				});

				utils.loading(true);

				if (config.params.Page * config.params.PageSize >= totalCount) {
					$more.hide();

					if (queue.length > 0) {
						queue.forEach(function (v, i, a) {
							v.itemsInfo.tileWidth = v.itemsInfo.width;

							render(v.itemsInfo);
						});
					}
				}

			} else {
				utils.loading(true);
			}
		}

		//image preload
		function preload(index, info) {
			var img = new Image();

			img.onload = function () {
				var width = this.width,
					height = this.height,
					_index = index,
					_itemInfo = info;

				_itemInfo.width = Math.ceil((width * config.height) / height);
				_itemInfo.height = 180;

				tileArray.push({
					index: _index,
					itemsInfo: _itemInfo
				});

				if (tileArray.length === config.data.length) {
					completeLoadImg();
				}
			};

			img.onerror = function () {
				var width = config.minTileWidth,
					height = config.height,
					_index = index,
					_itemInfo = info;

				_itemInfo.width = width;
				_itemInfo.height = height;

				tileArray.push({
					index: _index,
					itemsInfo: _itemInfo
				});

				if (tileArray.length === config.data.length) {
					completeLoadImg();
				}
			};

			img.src = info.Thumbnail.replace('http:', 'https:');
		}

		function getList() {
			utils.loading();
			utils.getJsonp({
				url: apiPATH + '/find',
				data: config.params,
				success: function (res) {
					callback(res.item);
				}
			});

			function callback(data) {
				totalCount = data.TotalCount;
				config.data = data.SearchItems;

				$.each(config.data, function (i, v) {
					var pos = v.Thumbnail.indexOf('.tn_120');

					if (pos !== -1) {
						v.Thumbnail = v.Thumbnail.substring(0, v.Thumbnail.indexOf('.tn_120'));
					}

					preload(i, v);
				});
			}
		};

		return this;
	};

	/*
	* 기자 페이지 / 이슈
	* param : [string] id
	* param : [string] type
	*/
	$.fn.chartComponent = function (options) {
		var defaults = {
			id: '',
			type: '',
			data: []
		},
		isReporter = utils.getReporterId() == '' ? false : true,
		setting = {
			lang: { thousandsSep: ',' },
			chart: {
				animation: utils.isLowBrowser(),
				type: 'spline', 'fontFamily': 'Helvetica-Light, Helvetica-Medium, "Apple SD Gothic Neo light", "Apple SD Gothic Neo medium", "Noto Sans", "Noto Sans Bold", Roboto-Light, Roboto-Medium, "Malgun Gothic", "맑은 고딕", dotum, 돋움, sans-serif, sans-serif-light'
			},
			title: { text: '' },
			subtitle: { text: '' },
			legend: { enabled: false },
			exporting: { enabled: false },
			tooltip: { enabled: false },
			credits: { enabled: false },
			xAxis: {
				type: 'category',
				tickWidth: 0
			},
			yAxis: {
				title: { text: '' },
				min: 0,
				tickWidth: 0,
				gridLineWidth: 0,
				labels: { enabled: false }
			},
			plotOptions: {
				spline: {
					color: '#ff4418',
					lineWidth: 5,
					marker: {
						fillColor: '#fff',
						lineWidth: 2,
						lineColor: null,
						states: {
							hover: { enabled: false }
						}
					},
					dataLabels: {
						enabled: isReporter ? false : true,
						color: '#666',
						padding: 10,
						style: {
							'fontSize': '13px',
							'fontWeight': 'normal'
						}
					}
				}
			}
		};

		return this.each(function (i, v) {
			Highcharts.setOptions(setting); // set init chart options

			var config = $.extend(true, defaults, options);

			var rtn = {
				series: [{
					data: config.data
				}]
			};

			$(v).highcharts(rtn);
		});
	};

	/*
	* parallax scroll
	*/
	$.parallaxScrolling = function () {
		var deviceType = pageType = utils.config('deviceType'),
			minWidth = $('#body').outerWidth(true) + 17,
			windowWidth = utils.windowSize().width;

		if ((utils.browser && utils.browser.msie == true && parseInt(utils.browser.version, 10) < 9) || deviceType != DEVICE_TYPE.pc || minWidth > windowWidth) {
			return this;
		}

		var $win = $(window),
			$dom = $(document),
			pageType = utils.config('pageType'),
			articleType = utils.config('articleType'),
			$gn = $('#gnb'),
			$head = $('#head .head_top'),
			$nav = $('#nav'),
			$wrap = $('#wrap'),
			$bd = $('#body'),
			$doc = $('#doc'),
			$ft = $('#foot'),
			$aside = $('#aside'),
			$content = $('#content'),
			$sub = $('#sub'),
			ftOffset = $ft.offset(),
			eleInfos = [];

		var arrTarget = [
			{ type: 'content', selector: '#content', refPosi: '', chkHeight: true }
			, { type: 'sub', selector: '#sub', refPosi: '#content', chkHeight: true }
			, { type: 'wide', selector: '#aside', refPosi: 'div#wrap', chkHeight: false }
		];

		var exceptTarget = "";
		var setBodyHeight = false;

		var wide = { type: 'wide', selector: '#aside', refPosi: 'div#wrap' },
			STOP_STYLES = { content: { 'position': 'fixed' }, sub: { 'position': 'fixed' }, wide: { 'position': 'fixed' } },
			menuKey = utils.menu.getPageMenuKey().toLowerCase();

		(function init() {
			//검색 페이지일 경우 sub 영역 parallax 제거
			arrTarget.forEach(function (item) {
				var $t = $(item.selector), offset = {};
				if ($t.length > 0 && $t.is(':visible')) {
					offset = $t.offset();
					offset.left = parseFloat(offset.left, 10);// + (utils.browser.msie == true ? 0 : 1);
					eleInfos.push({
						type: item.type, $ele: $t, name: item.selector, width: $t.outerWidth(), height: $t.outerHeight(), offset: offset, chkHeight: item.chkHeight
					});
				}
			});

			initWidePosition();
			$(window).on('scroll', scrollHandler);
			$(window).on('resize_layout', resizeHandler);

			setTimeout(function () { $(window).trigger('resize_layout'); }, 500);
		})();

		function resizeHandler() {
			$(window).off('scroll', scrollHandler);
			reset();
		}

		function reset() {
			arrTarget.forEach(function (item) {
				var $t = $(item.selector),
					offset = {},
					height = $t.outerHeight(true),
					checkEle = eleInfos.filter(function (v) { return v.type == item.type }),
					nPosiLeft = 0,
					nPosiLMagin = 0;

				if ($t.length > 0 && $t.is(':visible')) {
					nPosiLeft = parseFloat($t.css("left").replace("px", ""), 10);
					if ($t.css('position') == 'fixed') {
						if (item.type == "sub") {
							nPosiLMagin = parseFloat($t.css('margin-left').replace("px", ""), 10);
							nPosiLMagin = nPosiLMagin < 0 ? nPosiLMagin * (-1) : nPosiLMagin;
							nPosiLeft = ($content.outerWidth(true) + $content.offset().left) + nPosiLMagin;
							$t.css({ 'left': parseFloat(nPosiLeft, 10) });
						}
						else if (item.type == "content") {
							nPosiLeft = $bd.offset().left + parseFloat($bd.css('padding-left').replace("px", ""), 10);
							$t.css({ 'left': parseFloat(nPosiLeft, 10) });
						}
					}

					offset = $t.offset();
					offset.left = nPosiLeft;// + (utils.browser.msie == true ? 0 : 1);

					if (checkEle.length > 0) {
						checkEle[0].height = checkEle[0].$ele.outerHeight();
						checkEle[0].offset = offset;
					} else {
						eleInfos.push({
							type: item.type, $ele: $t, name: item.selector, width: $t.outerWidth(), height: height, offset: offset
						});
					}
				}
				else {
					if (!$t.is(':visible') && item.type == "wide") {
						if (eleInfos.filter(function (v) { return v.type == item.type }).length > 0) {
							eleInfos.splice(eleInfos.indexOf(eleInfos.filter(function (v) { return v.type == item.type })[0]), 1);
						}
					}
				}
			});
			initWidePosition();
			eleInfos.sort(function (a, b) { return a.height - b.height; });
			movePosition(eleInfos[eleInfos.length - 1]);	//왜 호출하는건지 모르겠음
			$(window).on('scroll', scrollHandler);
		}

		function initWidePosition() {
			var $t = $(wide.selector), offset = {};
			if ($t.length > 0 && $t.is(':visible')) {
				if ($t.css('position') == 'fixed') {
					var newPosiLeft = ($wrap.width() + $wrap.offset().left + 10);
					$t.css({ 'left': parseFloat(newPosiLeft, 10) });
				}
				offset = $t.offset();
				wide.$ele = $t;
				wide.name = wide.selector;
				wide.width = $t.outerWidth(true);
				wide.height = $t.outerHeight(true);
				wide.offset = offset;
			}
			else {
				$bd.removeAttr("style");
			}
		}

		function checkWidePosition(winScrollBottom, bodyBottom) {
			var v = wide;
			if (v.$ele == undefined || v.$ele.length == 0) {
				return;
			}
			v.height = v.$ele.outerHeight(true);
			//targetBottom = v.offset.top + v.height;
			targetBottom = v.height;
			v.bottom = winScrollBottom > bodyBottom ? winScrollBottom - bodyBottom : 0;
			if (winScrollBottom >= targetBottom) {
				stopPosition(v);
			} else {
				movePosition(v);
			}
		}

		function scrollHandler() {
			//if ($aside.height() > $wrap.height() && $aside.is(':visible')) {
			/*if (!setBodyHeight && $aside.is(':visible')) {
				var setBodyH1 = $aside.outerHeight() - ($gn.outerHeight() + $head.outerHeight() + $nav.outerHeight() + $ft.outerHeight());
				var setBodyH2 = Math.max($sub.height(), $content.height()) + Math.max(parseInt(($sub.length > 0 ? $sub.position().top : 0), 10), parseInt(($content.length > 0 ? $content.position().top : 0), 10));
				$bd.css({ 'height': Math.max(setBodyH1, setBodyH2) });
				setBodyHeight = true;
			}*/
			/*if (!setBodyHeight && $aside.is(':visible')) {
				if($bd.height() < $aside.height()) {
					if($("#divEmptyHeight").length > 0) {
						$("#divEmptyHeight").css({'height': $aside.height()-$bd.height()});
					}
					else {
						$bd.append('<div id="divEmptyHeight" style="height:'+($aside.height()-$bd.height())+'px;"></div>');
					}
					setBodyHeight = true;
				}
			}*/
			checkPosition();
		}

		function checkPosition() {
			var winScrollTop = $win.scrollTop(),
				winHeight = $win.height(),
				bodyHeight = $doc.height(),
				winScrollBottom = winScrollTop + winHeight;
			winScrollBottomFt = winScrollTop + winHeight + $ft.outerHeight(true),
			bodyBottom = parseInt($doc.offset().top + $doc.height(), 10),
			targetBottom = 0;
			eleInfos.sort(function (a, b) { return a.height - b.height; });

			checkWidePosition(winScrollBottom, bodyBottom);

			var exceptTargetHeight = 0;
			var exceptTarget = "";
			for (var i = 0; i < eleInfos.length; i++) {
				if (exceptTargetHeight < eleInfos[i].height && eleInfos[i].chkHeight) {
					exceptTargetHeight = eleInfos[i].height;
					exceptTarget = eleInfos[i].type;
				}
			}
			if ($wrap.height() < $aside.height()) {
				exceptTarget = "";
			}

			if (menuKey.split(",")[0].toString() != 'find' && !(menuKey.split(",")[0].toString() == 'retirement' && pageType == "Section")) {
				eleInfos.filter(function (v, i) { return i < eleInfos.length - 1; }).forEach(function (v) {
					v.height = v.$ele.outerHeight();
					v.bottom = winScrollBottomFt > bodyBottom ? (winScrollBottomFt - bodyBottom) : 0;
					//targetBottom = v.offset.top + v.height; //fixed가 되기 전 원래 offset.top을 가져와야 한다.
					targetBottom = v.height + 80;

					if (v.chkHeight) {
						var headTop = $("div.article_head").length == 0 ? v.offset.top : parseInt($("div.article_head").offset().top + $("div.article_head").outerHeight(true), 10);
						//headTop = v.offset.top
						targetBottom = targetBottom + headTop;
					}
					//if (v.chkHeight && v.type != exceptTarget) {
					if (v.chkHeight) {
						if (winScrollBottom >= targetBottom) {
							stopPosition(v);
						} else {
							movePosition(v);
						}
					}
				});
			}
		}

		function stopPosition(targetObj) {
			var styles = STOP_STYLES[targetObj.type] || {};
			var nPosiLeft = 0, nPosiLMagin = 0;
			styles.bottom = targetObj.bottom;
			nPosiLeft = targetObj.offset.left;

			if (targetObj.type == "sub") {
				if (menuKey != 'find') {
					nPosiLMagin = parseFloat(targetObj.$ele.css('margin-left').replace("px", ""), 10);
					nPosiLMagin = nPosiLMagin < 0 ? nPosiLMagin * (-1) : nPosiLMagin;
					nPosiLeft = ($content.outerWidth(true) + $content.offset().left) + nPosiLMagin - parseFloat($(window).scrollLeft(), 10);
					targetObj.$ele.css({ 'left': parseFloat(nPosiLeft, 10) });
					styles.bottom = targetObj.bottom - parseFloat(targetObj.$ele.css('margin-bottom').replace("px", ""), 10)
				}
			}
			if (targetObj.type == "content") {
				nPosiLeft = $bd.offset().left + parseFloat($bd.css('padding-left').replace("px", ""), 10) - parseFloat($(window).scrollLeft(), 10);
				targetObj.$ele.css({ 'left': parseFloat(nPosiLeft, 10) });
				styles.bottom = targetObj.bottom - parseFloat(targetObj.$ele.css('margin-bottom').replace("px", ""), 10)
			}
			if (targetObj.type == "wide") {
				styles.bottom = 0;
				nPosiLeft = ($wrap.width() + $wrap.offset().left + 10) - parseFloat($(window).scrollLeft(), 10);
				targetObj.$ele.css({ 'left': parseFloat(nPosiLeft, 10) });
			}
			targetObj.offset.left = nPosiLeft;
			styles.left = nPosiLeft;
			targetObj.$ele.css(styles);

			if (!setBodyHeight && $aside.is(':visible') && $aside.height() > $wrap.height()) {
			    var setBodyH1 = $aside.outerHeight() - ($gn.outerHeight() + $head.outerHeight() + $nav.outerHeight() + $ft.outerHeight());
			    var setBodyH2 = Math.max($sub.height(), $content.height()) + Math.max(parseInt(($sub.length > 0 ? $sub.position().top : 0), 10), parseInt(($content.length > 0 ? $content.position().top : 0), 10));
				//$bd.css({ 'height': Math.max(setBodyH1, setBodyH2) });
			    if ($("#divEmptyHeight").length > 0) {
			    	$("#divEmptyHeight").css({ 'height': Math.max(setBodyH1, setBodyH2), 'float': 'left', 'width': 0 });
			    }
			    else {
			    	$bd.append('<div id="divEmptyHeight" style="height:' + (Math.max(setBodyH1, setBodyH2)) + 'px;float:left;width:0px;"></div>');
			    }
			    setBodyHeight = true;
			}
		}

		function movePosition(targetObj) {
			var styles = {
				'position': '',
				'bottom': '',
				'left': ''
			};
			if (targetObj !== null && targetObj !== undefined) {
				targetObj.$ele.css(styles);
			}

			if ($aside.is(':visible')) {
				//$bd.css({ 'height': '' });
				$("#divEmptyHeight").remove();
			    setBodyHeight = false;
			}
		}
		return this;
	};


	/*
	* 검색 자동완성
	*/
	$.fn.searchAutoComplete = function (options) {

		var SAVING = {
			'true': {
				type: 'false',
				text: '검색어 저장 끄기'
			},
			'false': {
				type: 'true',
				text: '검색어 저장 켜기'
			}
		};

		var ALERT = {
			empty: '저장된 검색어가 없습니다.',
			saving: '검색어 저장 기능이 꺼져있습니다.'
		};

		var API_PATH = utils.config('searchEnginePath') + '/jsonp_trans.jsp?type=ark&charset=utf-8&convert=fw&query=';

		var defaults = {
			el: '#searchArea',
			autoCompleteField: '.autocomplete',
			enabledFoot: true,
			enabledRemoveHistory: true,
			enabledStopSaving: true
		},
		config = $.extend(defaults, options || {}),
		html = '';

		function render(data) {
			var html = '',
				$autoComplete = $(config.autoCompleteField);

			html += '<ul class="mg" data-bind="list"><li data-bind="item"></li></ul>';

			var directive = {
				list: {
					item: {
						html: function () {
							if (this.url === '#') {
								return '<p style="padding:3px;margin:0 11px 3px">' + this.text + '</p>';
							} else {
								return '<a href="' + this.url + '" data-keyword="' + this.keyword + '">' + this.text + '</a>';
							}

						}
					}
				}
			};

			if ($autoComplete.find('ul[data-bind="list"]').length == 0) $autoComplete.prepend(html);

			$autoComplete.render(data, directive);

			//광고용 코드
			if ($("#searchArea > div.auto_ad").css("display") != "none") {
				$autoComplete.hide();
			}
		}

		function getData(type, keyword) {
			var isSaving = utils.getCookie(COOKIE_NAMES.isSavingKeyword) === null ? 'true' : utils.getCookie(COOKIE_NAMES.isSavingKeyword),
				resData = { list: [] };

			if (type === 'search') {
				utils.getJsonp({
					url: API_PATH + encodeURIComponent(keyword),
					success: function (res) {
						if (res.responsestatus !== -1) { // -1: 실패 , 0 : 성공
							var result = res.result[0], // result[0] : 순방향, result[1] : 역방향
								items = result.items;

							if (result.totalcount > 0) {

								$.each(items, function (i, v) {
									var text = v.keyword,
										hkeyword = v.hkeyword.replace(/font/gi, 'span').replace(/\<\/span\>$/, '').replace(/style\=\'color\:\#CC6633\'/, 'class="keyword"'),
										keyword = hkeyword.substring(hkeyword.indexOf('>') + 1);

									var pathName = location.pathname.toLowerCase(),
										parameter = $.deparam(location.search.replace('?', '')),
										url = '';

									if (typeof parameter['SearchCategoryType'] != 'undefined') {
										url = pathName + '?keyword=' + encodeURI(text) + '&searchcategorytype=' + parameter['SearchCategoryType'];
									}
									else {
										url = pathName + '?keyword=' + encodeURI(text);
									}

									resData.list.push({ url: url, text: keyword, keyword: text });

								});
							} else {
								resData.list.push({ url: '#', text: '검색결과가 없습니다.' });
							}

							render(resData);
						}
					}
				});
			} else {
				var data = [];

				data = utils.getCookie(COOKIE_NAMES.searchKeyword);

				if (isSaving === 'false') {
					data = { url: '#', text: ALERT.saving };
					resData.list.push(data);

				} else {

					if (data === null) {
						data = { url: '#', text: ALERT.empty };
						resData.list.push(data);

					} else {
						var d = data.split(',');

						for (var i = 0, len = d.length; i < len ; i++) {
							resData.list.push({
								url: '/find?keyword=' + d[i],
								text: d[i],
								keyword: d[i]
							});
						}
					}
				}

				render(resData);
			}
		}

		function displayList($input) {
			var $search = $(config.el),
				val = $input.val();

			if (val.length >= 2) {
				getData('search', val);
			}

			if (val.length === 0) {
				getData('history');
			}
		}

		function toggleField(status) {
			var $search = $(config.el);

			$search.find(config.autoCompleteField).toggle(status);
		}

		function renderFoot($wrap) {
			var isSaving = utils.getCookie(COOKIE_NAMES.isSavingKeyword) === null ? 'true' : utils.getCookie(COOKIE_NAMES.isSavingKeyword),
				foot = '',
				savingData = SAVING[isSaving];

			foot += '<span class="func">';

			if (config.enabledRemoveHistory) {
				foot += '<a href="#none" class="removeHistory">기록삭제</a>';
			}

			if (config.enabledRemoveHistory && config.enabledStopSaving) {
				foot += ' | ';
			}

			if (config.enabledStopSaving) {
				foot += '<a href="#none" class="saving" data-issaving="' + savingData.type + '">' + savingData.text + '</a></span>';
			}

			$wrap.append(foot);
		}

		this.each(function (i, v) {
			var $input = $(v),
				$search = $(config.el),
				$autocompleField = null,
				html = '<div class="autocomplete" style="display:none"></div>',
				foot = '';

			$search.append(html);
			$autocompleField = $search.find(config.autoCompleteField);

			if (config.enabledFoot) {
				renderFoot($autocompleField);
			};

			$input.on('click, focus', function () {
				toggleField(true);
				displayList($(this));

				return false;

			}).on('keyup', function (e) {
				var keyCode = e.which ? e.which : e.keyCode;

				if (keyCode === 40) {
					$autocompleField.find('a:first').focus();
				} else {
					displayList($(this));
				}
			});

			$('body').on('click', function (e) {
				var $target = $(e.target);

				if ($target.closest('#searchArea').length === 0) toggleField(false);
			});

			$autocompleField.on('click', '.removeHistory', function () {
				utils.removeCookie(COOKIE_NAMES.searchKeyword, COOKIE_CONDITION.path, COOKIE_CONDITION.domain);

				getData('history');

				return false;
			}).on('click', '.saving', function () {
				var $saving = $(this),
					isSaving = $saving.data('issaving');

				utils.setCookie(COOKIE_NAMES.isSavingKeyword, isSaving, 90, COOKIE_CONDITION.path, COOKIE_CONDITION.domain);
				utils.removeCookie(COOKIE_NAMES.searchKeyword, COOKIE_CONDITION.path, COOKIE_CONDITION.domain);

				$saving.data('issaving', SAVING[isSaving].type).html(SAVING[isSaving].text);
				return false;
			}).on('mouseleave', function () {
				toggleField(false);

				$input.focus();
			}).on('click', 'li a', function () {
				var keyword = $(this).data('keyword');

				$('#searchKeyword').val(keyword);
				$('#btnSearch').trigger('click');

				return false;
			}).on('keydown', 'li a', function (e) {
				var keyCode = e.which ? e.which : e.keyCode;
				if (keyCode === 40) {
					var $nextNode = $(e.target).parent().next();

					if ($nextNode.length > 0) {
						$nextNode.find('a').focus();
					}

					e.preventDefault();

				} else if (keyCode === 38) {
					var $prevNode = $(e.target).parent().prev();

					if ($prevNode.length > 0) {
						$prevNode.find('a').focus();
					}

					e.preventDefault();
				}
			});
		});
	};

})(jQuery, window, document);