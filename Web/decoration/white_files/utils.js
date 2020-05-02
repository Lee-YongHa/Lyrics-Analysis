/**
* utils.js
* utils
* polyfill : String.trim, String.getByteLength, Array.filter, Array.forEach, Array.contains
*/
document.domain = 'joins.com';
(function (window, document, $) {

    // global constant var
    window.COOKIE_NAMES = {
        fontSize: 'article_fontSizePx',
        userId: 'Joins_MemID',
        socialuserId: 'JCUBE_SOCIAL_ID',		//소셜로그인 추가.161208
        socialuserName: 'JCUBE_SOCIAL_NAME',	//소셜로그인 추가.161208
        snsInfo: 'SNSInfo',
        articleCover: 'cover_on',
        pcId: 'PCID',
        wide: 'openwide',
        searchKeyword: 'searchkeyword',
        isSavingKeyword: 'isSavingKeyword',
        favoritemenus: 'favoritemenus',
        ignoreUserAgent: 'IgnoreUserAgent'
    };

    window.COOKIE_CONDITION = { path: '/', domain: document.domain };

    window.CONFIG_NAMES = { isLogin: 'isLogin', apiPath: 'apiPath' };

    window.DOM_SELECTOR = { article: '.article', articleBody: '#article_body' };

    window.ARTICLE_TYPE = { general: 'General', cover: 'Cover', live: 'Live', piki: 'Piki', wide: 'Wide', spCover: 'SpCover', spWide: 'SpWide', spInterview: 'SpInterview', spGallery: 'SpGallery', spVideo: 'SpVideo' };

    window.APPLICATION_TYPE = { pc: 'pc', mobile: 'mobile' };
    window.DEVICE_TYPE = { pc: 'pc', mobile: 'mobile' };

    window.PAGE_TYPE = { index: 'Home', section: 'Section', list: 'List', article: 'Article', search: 'Search', unique: 'Unique', reporter: 'Reporter', issue: 'Issue', special: 'Special' };

    window.GNB_STYLES = {
    	general: 'https://static.joins.com/joongang_15re' + '/styles/pc/gnb.css',
    	gray: 'https://static.joins.com/joongang_15re' + '/styles/pc/gnb_gray.css',
    	black: 'https://static.joins.com/joongang_15re' + '/styles/pc/gnb_black.css',
    	rio2016: 'https://static.joins.com/joongang_15re' + '/styles/pc/gnb_rio2016.css'
    };

    window.DEFAULTS_IMAGE = {
        reporter: '/pc/article/i_noimg_journalist.jpg',
        reporter40: '/pc/main/v_noimg_profile40.jpg',
        reporter64: '/pc/article/v_noimg_journalist.jpg'
    };

    //window.URL = {
    //    reporter: '/images/pc/article/i_noimg_journalist.jpg'
    //};

    function isMobile() {
        var rtn = false;

        if (navigator.userAgent.match(/Android|Mobile|iP(hone|od|ad)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)) {
            rtn = true;
        }

        if (location.host.indexOf('mnews.joins.com') > -1 || location.host.indexOf('m.') > -1) {
            rtn = true;
        }

        return rtn;
    };

    /**
    * @method : defaults
    * @params : object
    * @depends: config [Object]
    */
    var
        defaults = {
            'useLog': { 'editable': false, 'value': false },
            'isLogin': { 'editable': true, 'value': false },
            'root': { 'editable': true, 'value': '/' },
            'applicationType': { 'editable': true, 'value': 'pc' },
            'homePath': { 'editable': true, 'value': 'https://joongang.joins.com' },
            'staticPath': { 'editable': true, 'value': 'https://static.joins.com/joongang_15re' },
            'staticRootPath': { 'editable': true, 'value': 'https://static.joins.com' },
            'imagePath': { 'editable': true, 'value': 'https://images.joins.com/ui_joongang/news' },
            'imageRootPath': { 'editable': true, 'value': 'https://images.joins.com' },
            'searchWebPath': { 'editable': true, 'value': 'https://search.joins.com' },
            'searchEnginePath': { 'editable': true, 'value': 'https://searchapi.joins.com' },
            'apiPath': { 'editable': true, 'value': 'https://apis.joins.com' },
            'cruzPath': { 'editable': true, 'value': 'https://cruz.joins.com' },
            'pdsPath': { 'editable': true, 'value': 'https://pds.joins.com' },
            'irPath': { 'editable': true, 'value': 'https://ir.joins.com' },
            'JtbcImagePath': { 'editable': true, 'value': 'https://photo.jtbc.joins.com' },
            'jtbcNewsPath': { 'editable': true, 'value': 'https://news.jtbc.joins.com' },
            'jtbcCounterPath': { 'editable': true, 'value': 'http://counter.jtbc.joins.com' },
            'webPcPath': { 'editable': true, 'value': 'https://news.joins.com' },
            'webMobilePath': { 'editable': true, 'value': 'https://mnews.joins.com' },
            'jplusPath': { 'editable': true, 'value': 'https://jplus.joins.com' },
            'bbsPath': { 'editable': true, 'value': 'http://bbs.news.joins.com' },
            'cmsHost': { 'editable': false, 'value': 'jcms.joins.com' },
            'appPath': { 'editable': true, 'value': 'https://app.joins.com' },
            'counterPath': { 'editable': true, 'value': 'https://counter.joins.com' },
            'logNewsPath': { 'editable': true, 'value': 'https://log-news.joins.com' },
            'apiJpickPath': { 'editable': true, 'value': 'https://api-jpick.joins.com' },
            'pageType': { 'editable': true, 'value': PAGE_TYPE.section },
            'articleType': { 'editable': true, 'value': ARTICLE_TYPE.general },
            'deviceType': { 'editable': true, 'value': isMobile() ? DEVICE_TYPE.mobile : DEVICE_TYPE.pc },
            'menus': { 'editable': true, 'value': '' }
        };

    function Utils() {

        var _utils = this;
        /**
		 * @depends: defaults (private)
		 * @type : method
		 * @name : config
		 * @param {object or string} n
		 * @return
		 */
        this.config = function (n, v) {

            if ($.type(n) === 'object') {
                setObj(n);
            } else if ($.type(n) === 'string' && arguments.length == 2) {
                setStr(n, v);
            } else if ($.type(n) === 'string' && arguments.length == 1) {
                return get(n);
            } else {
                _utils.error('parameter is only json or string. current type : ' + $.type(n));
            }

            /**
	    	 * Description
	    	 * @method set
	    	 * @param {} obj
	    	 * @return
	    	 */

            function setObj(obj) {
                $.each(obj, function (n) {

                    if (defaults[n] && defaults[n].editable) {
                        if (typeof obj[n] === 'string' && (obj[n] === 'True' || obj[n] === 'False')) {
                            obj[n] = obj[n] == 'True';
                        }

                        defaults[n].value = obj[n] || defaults[n].value;
                        defaults[n].editable = false;
                    }
                });
            }

            function setStr(n, v) {
                if (defaults[n] && defaults[n].editable) {
                    if (typeof v === 'string' && (v === 'True' || v === 'False')) {
                        v == true;
                    }

                    defaults[n].value = v;
                    defaults[n].editable = false;
                } else {
                    _utils.error(n + ' name is not editabled');
                }
            }

            /**
	    	 * Description
	    	 * @method get
	    	 * @param {} n
	    	 * @return MemberExpression
	    	 */
            function get(n) {

                if (defaults[n] === undefined && n !== 'all') {
                    _utils.error('undefined property name : ' + n);
                }

                var returnVal;

                if (n == 'all') {
                    returnVal = {};
                    for (var item in defaults) {
                        returnVal[item] = defaults[item];
                    }
                } else {
                    returnVal = defaults[n].value;
                }
                return returnVal;
            }

            return this;
        };

        /**
		 * Description
		 * @params : object
		 * @method log
		 * @param {} obj
		 */
        this.log = function (obj) {
            var useLog = this.config('useLog') == true && window.console;
            if (useLog) {
                if (typeof obj == "object" && console.dir) {
                    console.dir && console.dir(obj);
                    //console.log && console.log(obj);
                } else {
                    console.log && console.log(obj);
                }
            }
        };

        this.getCookieForSearch = function (sKey) {

            return unescape(utils.getCookie(sKey) || '');
        };

        // return string.
        this.getCookie = function (sKey) {
            if (!sKey) {
                return null;
            }

            var cookie = document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1") || null;

            if (cookie) {
                try {
                    cookie = decodeURIComponent(cookie);
                } catch (e) {
                    cookie = decodeURIComponent(unescape(cookie));  // escape 처리된 문자열이 저장된 경우, catch.
                }
            }
            return cookie;
        };

        this.setCookie = function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
                return false;
            }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd * 60 * 60 * 24;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                }
            }

            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        };

        this.removeCookie = function (sKey, sPath, sDomain) {
            if (!this.hasCookie(sKey)) {
                return false;
            }
            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
            return true;
        };

        this.hasCookie = function (sKey) {
            if (!sKey) {
                return false;
            }
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        };

        this.cookieKeys = function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nLen = aKeys.length,
                    nIdx = 0; nIdx < nLen; nIdx++) {
                aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
            }
            return aKeys;
        };

        this.isMobile = function () {
            var rtn = false;

            if (navigator.userAgent.match(/Android|Mobile|iP(hone|od|ad)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)) {
                rtn = true;
            }

            return rtn;
        };

        this.isJoongangApp = function () {
        	var rtn = false;

        	if (navigator.userAgent.toLowerCase().match(/joongangilbo/)) {
        		rtn = true;
        	}

        	return rtn;
        };

        this.isJoongangAppCheck = function () {
        	var rtn = '';
        	var nav = navigator.userAgent.toLowerCase();

        	if (nav.indexOf('joongangilbo') !== -1 && nav.indexOf('android') !== -1 && nav.indexOf('phone') !== -1) {
        		rtn = 'andapp';
        	} else if (nav.indexOf('joongangilbo') !== -1 && nav.indexOf('android') !== -1 && nav.indexOf('pad') !== -1) {
        		rtn = 'andpad';
        	} else if (nav.indexOf('joongangilbo') !== -1 && nav.indexOf('ios') !== -1 && nav.indexOf('phone') !== -1) {
        		rtn = 'iosapp';
        	} else if (nav.indexOf('joongangilbo') !== -1 && nav.indexOf('ios') !== -1 && nav.indexOf('pad') !== -1) {
        		rtn = 'iospad';
        	}

        	return rtn;
        };

        this.isCoverTypeCheck = function () {
        	var rtn = false;
        	switch (utils.config('articleType')) {
        		case ARTICLE_TYPE.cover:
        		case ARTICLE_TYPE.wide:
        		case ARTICLE_TYPE.spCover:
        		case ARTICLE_TYPE.spWide:
        		case ARTICLE_TYPE.spInterview:
        		case ARTICLE_TYPE.spGallery:
        		case ARTICLE_TYPE.spVideo:
        			rtn = true;
        			break;
        	}

        	return rtn;
        };

        this.isSpCoverTypeCheck = function () {
        	var rtn = false;
        	switch (utils.config('articleType')) {
        		case ARTICLE_TYPE.spCover:
        		case ARTICLE_TYPE.spWide:
        		case ARTICLE_TYPE.spInterview:
        		case ARTICLE_TYPE.spGallery:
        		case ARTICLE_TYPE.spVideo:
        			rtn = true;
        			break;
        	}

        	return rtn;
        };

        this.getMetaValue = function (name) {
            var metaTag = $('meta'),
                rtn = '',
                $this = null;

            metaTag.each(function () {
                $this = $(this);

                if ($this.attr('property') !== undefined && $this.attr('property') === name) {
                    rtn = $this.attr('content');
                } else if ($this.attr('name') !== undefined && $this.attr('name') === name) {
                    rtn = $this.attr('content');
                }
            });

            return rtn;
        };

        this.isNoneADCheck = function () {
        	var rtn = false;
        	switch (utils.config('articleType')) {
        		case ARTICLE_TYPE.spCover:
        		case ARTICLE_TYPE.spWide:
        		case ARTICLE_TYPE.spInterview:
        		case ARTICLE_TYPE.spGallery:
        		case ARTICLE_TYPE.spVideo:
        			rtn = true;
        			break;
        	}

        	if (utils.getMetaValue("news_keywords").indexOf('e글중심') !== -1) {
        		rtn = true;
        	}

        	return rtn;
        };

        /**
	    * @name : decodeEntities [function]
	    * @desc : decode html entities.
	    */
        this.decodeEntities = function (s) {
            var r,
                t = document.createElement('textarea');
            t.innerHTML = s;
            r = t.textContent || t.innerText;
            t = null;
            return r;
        };
        /**
	    * @name : strip [function]
	    * @desc : return remove html tag from argument
	    */
        this.strip = function (s) {

            if ($.trim(s) === '') {
                return s;
            }

            var reg_tag = /(<([^>]+)>)/ig,
                r = '';
            s = s.replace(reg_tag, '');
            if (_utils.decodeEntities) {
                s = _utils.decodeEntities(s);
            }
            r = s.replace(reg_tag, '');
            return r;
        };

        var usedRandomNumbers = {};
        this.getRandomNumber = function (min, max, name) {

            var rdnNumber = 0,
                randomIndex = 0,
                targetArray = [],
                excludeNumbers = usedRandomNumbers[name] || [];

            if (name && !usedRandomNumbers[name]) {
                usedRandomNumbers[name] = [];
            }

            for (var j = min; j <= max; j++) {
                targetArray.push(j);
            }

            var filterIndex = [];

            targetArray = targetArray.filter(function (v, i) {
                return excludeNumbers.indexOf(v) == -1;
            });

            filterIndex.forEach(function (v, i, a) {
                targetArray.splice(i, 1);
            });

            randomIndex = Math.floor(Math.random() * targetArray.length);
            rdnNumber = targetArray.splice(randomIndex, 1);

            if (name) {
                usedRandomNumbers[name].push(rdnNumber[0]);
            }
            if (name && targetArray.length == 0) {
                usedRandomNumbers[name] = [];
            }
            return rdnNumber[0];
        };

        this.getRandomNumberArray = function (array) {
            for (var i = array.length - 1; i > 0; i--) {
                var randomIndex = Math.floor(Math.random() * i);
                var randomValue = array[i];

                array[i] = array[randomIndex];
                array[randomIndex] = randomValue;
            }

            return array;
        };

        this.getElementFromEvent = function (e) {
            return e.target || e.srcElement;
        };

        this.getKeyCode = function (e) {
            return e.keyCode || e.which;
        };

        this.getIFrameBody = function (iframe) {
            var iframeWindow = iframe.contentWindow || iframe.contentDocument;
            return iframeWindow.document.body;
        };

        this.getHtmlFromUrl = function (url, success) {
            var $iframe = $('<iframe id="hiddenLoadHtml"></iframe>');
            $iframe.appendTo(document.body);
            $iframe.on('load', iframeLoaded);
            $iframe.attr('src', url);

            function iframeLoaded() {
                var iframe = $iframe[0],
                    iframeWindow = iframe.contentWindow || iframe.contentDocument;

                success && success(iframeWindow.document.body);
            }
        };

        this.stringify = function (obj) {
            var t = typeof (obj);
            if (t != "object" || obj === null) {
                // simple data type
                if (t == "string") {
                    obj = '"' + obj + '"';
                }
                return String(obj);
            } else {
                // recurse array or object
                var n,
                    v,
                    json = [],
                    arr = (obj && obj.constructor == Array);

                for (n in obj) {
                    v = obj[n];
                    t = typeof (v);
                    if (obj.hasOwnProperty(n)) {
                        if (t == "string") {
                            v = '"' + v + '"';
                        } else if (t == "object" && v !== null) {
                            v = app.stringify(v);
                        }
                        json.push((arr ? "" : '"' + n + '":') + String(v));
                    }
                }
                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        };

        this.setPCID = function () {

            var self = this,
                today = new Date(),
                expiredDate = new Date(),
                val = self.getCookie(COOKIE_NAMES.pcId);
            expiredDate.setDate(today.getDate() + 30);

            if (!val) {
                val = getNewPCID(today.getTime());
            }

            self.setCookie(COOKIE_NAMES.pcId, val, expiredDate, COOKIE_CONDITION.path, COOKIE_CONDITION.domain);

            function getNewPCID(prefix) {

                var arrVal = [],
                    rtn = '';

                for (i = 0; i < 10; i++) {
                    arrVal.push("" + Math.random());
                }

                for (i = 0; i < arrVal.length; i++) {
                    rtn += arrVal[i].charAt(2);
                }
                return prefix + rtn;
            }
        };

        this.getPCID = function () {
            var rtn = 0;
            try {
                rtn = utils.getCookie('PCID');
            }
            catch (e) { }

            return rtn;
        }

        this.getLastPCID = function () {
            var i = utils.getPCID();
            var last = i.substring(i.length - 1, i.length);

            return last;
        }

        this.isLiveServer = function () {
            return location.host.indexOf('local') == -1 && location.host.indexOf('dev') == -1;
        };

        this.getJsonp = function (obj) {

            utils.log('## utils.getJsonp');
            utils.log('url : ' + obj.url);

            $.ajax({
                url: obj.url,
                contentType: 'text/plain',
                data: obj.data || {},
                dataType: 'jsonp'
                //cache: false
            }).done(function (res) {
                //utils.log('##-------------------- jsonp done');
                obj.success && obj.success(res);
            }).fail(function (e) {
                //utils.log('##-------------------- jsonp fail');
            });
        };

        this.ajaxGet = function (obj) {

            utils.log('## utils.ajaxGet');
            utils.log('## url : ' + obj.url);
            utils.log(obj.data);

            var ajaxOptions = {
                url: obj.url,
                data: obj.data || {},
                type: 'GET',
                dataType: obj.dataType || "json",
                //crossDomain: true,
                success: function (res) {
                    utils.log('## ajaxGet : success : ' + obj.url);
                    obj.success && obj.success(res);
                },
                error: function (e) {
                    utils.log('## ajaxGet : error : ' + obj.url);
                    //utils.log(e);
                    obj.error && obj.error();
                    //utils.log(e);
                }
            };

            if (obj.cache) {
                ajaxOptions.cache = true;
            }
            // ***********************************************
            // 수정이 필요한 경우 공유바람.
            $.ajax(ajaxOptions);
        };

        this.ajaxPost = function (obj) {

            if (!obj.url) {
                this.error('not defined url');
            }
            utils.log('## utils.ajaxPost');
            utils.log('## obj.url : ' + obj.url);

            var data = (obj.data !== undefined ? obj.data : {});

            data.deviceType = utils.config('deviceType');

            //utils.log(data);
            $.ajax({
                url: obj.url,
                type: 'POST',
                headers: {},
                async: true,
                contentType: 'text/plain',
                dataType: 'json',
                crossDomain: true,
                cache: false,
                data: data,
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function (xhr, settings) {
                    xhr.setRequestHeader("Content-type", 'Application/x-www-form-urlencoded');
                },
                success: function (res) {
                    utils.log('## ajaxPost : success : ' + obj.url);
                    obj.success && obj.success(res);
                },
                error: function (e) {
                    utils.log('## ajaxPost : error : ' + obj.url);
                    utils.log(e.responseText);
                    return;
                }
            });
        };

        this.getImageSize = function (src) {
            var img = new Image();
            img.src = src;
            return { width: img.width, height: img.height };
        };

        this.imageErrorHandler = function (img) {

            var $target = $(img),
                data = $target.data(),
                src = $target.attr('src');

            if (!$target.data('edit_src') && src !== undefined && src.indexOf('pds.joins.com') > -1) {
                //$target.attr('src', src.replace('pds.joins.com/', 'photo.jtbc.joins.com/'));
                $target.attr('src', this.getJtbcImageFullPath(src.replace('pds.joins.com/', 'photo.jtbc.joins.com/')));
            } else {
                $target.data('edit_src', true);
                $target.setDefaultImage();
            }
        };

        this.mvcAjaxCallbackQueue = new function () {
            var queue = {

            };

            this.set = function (name, callback) {
                queue[name] = callback;
            };

            this.callback = function ($btn) {
                var name = $btn.data('ajaxUpdate');

                if (typeof queue[name] == 'function') {
                    queue[name]($btn);
                }
            };
        };

        this.getLocalStorage = function (name) {
            return localStorage.getItem(name);
        };

        this.setLocalStorage = function (k, v) {
            var str = '';

            if (Array.isArray(v)) {

                for (var i = 0,
                        len = v.length; i < len; i++) {
                    if (str === '') {
                        str = v[i];
                    } else {
                        str = str + ',' + v[i];
                    }
                }

                setItem(k, str);
            }

            setItem(k, v);

            function setItem(key, value) {
                if (localStorage.key(key)) {
                    localStorage.removeItem(key);
                }

                localStorage.setItem(key, value);
            }
        };

        function getInternetExplorerVersion() {
            var rv = -1; // Return value assumes failure.
            if (navigator.appName == 'Microsoft Internet Explorer') {
                var ua = navigator.userAgent;
                var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null)
                    rv = parseFloat(RegExp.$1);
            }
            return rv;
        }
        this.browser = { msie: getInternetExplorerVersion() == -1 ? false : true, version: getInternetExplorerVersion() };

        this.isLowBrowser = function (version) { // version 이하의 IE 브라우저 체크
            version = version || 9;
            return utils.browser && utils.browser.msie == true && parseInt(utils.browser.version, 10) <= version;
        };

        this.loading = function (close) {
            if (close) {
                $('#loading').hide();
            } else {
                $('#loading').show();
            }
        };

        this.error = function (str, isLog) {
            if (isLog) {
                _utils.log('ERROR : ' + str);
            } else {
                $.error(str);
            }

            //throw new Error(str);
        };

        this.loadStyle = function (href, callback) {
            $('head').append('<link type="text/css" href="' + href + '" rel="stylesheet" />');
            callback && callback();
        };

        this.setStartPage = function () {

            if (document.all) {
                document.body.style.behavior = 'url(#default#homepage)';
                document.body.setHomePage(utils.config('homePath'));
            } else if (window.sidebar) {
                if (window.netscape) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                    } catch (e) {
                        alert("this action was aviod by your browser，if you want to enable，please enter about:config in your address line,and change the value of signed.applets.codebase_principal_support to true");
                    }
                }
                var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                prefs.setCharPref('browser.startup.homepage', 'url you site');
            }
        };

        //For Internet Explorer, Chrome, Firefox, Opera, and Safari:

        //window.innerHeight - the inner height of the browser window
        //window.innerWidth - the inner width of the browser window
        //For Internet Explorer 8, 7, 6, 5:

        //document.documentElement.clientHeight
        //document.documentElement.clientWidth
        //or
        //document.body.clientHeight
        //document.body.clientWidth
        this.windowSize = function () {
            return {
                width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            };
        };

        this.getIsCartoon = function () {
            var rtn = false,
                $isCartoon = $('#is_cartoon');

            if ($isCartoon.length && $isCartoon.val() == 'True') {
                rtn = true;
            }
            return rtn;
        };

        this.getPdsFullPath = function (imageUrl) {

            imageUrl = imageUrl || '';

            if (imageUrl == '.tn_250.jpg' || imageUrl == '.tn_120.jpg') {
                return '';
            }
            imageUrl = imageUrl.replace('.tn_250.jpg', '').replace('.tn_120.jpg', '');

            if (imageUrl.indexOf('/component') == 0) {
                imageUrl = '/news' + imageUrl
            }

            if (imageUrl.length > 0 && imageUrl.indexOf('http') < 0) {
                imageUrl = utils.config('pdsPath') + ((imageUrl[0] != '/') ? '/' : '') + imageUrl;
            }

            if (imageUrl.indexOf("http:") >= 0) {
            	imageUrl = imageUrl.replace('http:', 'https:');
            }

            return imageUrl;
        };

        this.getPdsFullPathSize = function (imageUrl, imageSize) {
            switch (imageSize) {
                case 120:
                    imageSize = '.tn_120.jpg';
                    break;
                case 250:
                    imageSize = '.tn_250.jpg';
                    break;
                case 350:
                    imageSize = '.tn_350.jpg';
                    break;
                default:
                    imageSize = '';
                    break;
            }
            imageUrl = imageUrl || '';

            if (imageUrl == '.tn_250.jpg' || imageUrl == '.tn_120.jpg') {
                return '';
            }
            imageUrl = imageUrl.replace('.tn_250.jpg', '').replace('.tn_120.jpg', '');

            if (imageUrl.indexOf('/component') == 0) {
                imageUrl = '/news' + imageUrl;
            }

            if (imageUrl.length > 0 && imageUrl.indexOf('http') < 0) {
                imageUrl = utils.config('pdsPath') + ((imageUrl[0] != '/') ? '/' : '') + imageUrl;
            }

            if (imageUrl.length > 0) {
                imageUrl = imageUrl + imageSize;
            }
            
            if (imageUrl.indexOf("http:") >= 0) {
            	imageUrl = imageUrl.replace('http:', 'https:');
            }

            return imageUrl;
        };

        this.getJtbcImageFullPath = function (imageUrl) {
            imageUrl = imageUrl || '';

            if (imageUrl.indexOf('.tn') < 0) {
                imageUrl = imageUrl + ".tn150.jpg";
            }

            if (imageUrl.length > 0 && imageUrl.indexOf('http') < 0) {
                imageUrl = utils.config('JtbcImagePath') + ((imageUrl[0] != '/') ? '/' : '') + imageUrl;
            }

            return imageUrl;
        };

        this.getJtbcImageFullPathSize = function (imageUrl, imageSize) {
            switch (imageSize) {
                case 120:
                    imageSize = '.tn_120.jpg';
                    break;
                case 250:
                    imageSize = '.tn_250.jpg';
                    break;
                case 350:
                    imageSize = '.tn_350.jpg';
                    break;
                default:
                    imageSize = '';
                    break;
            }
            imageUrl = imageUrl || '';

            if (imageUrl.indexOf('.tn') < 0) {
                imageUrl = imageUrl + ".tn150.jpg";
            }

            if (imageUrl.length > 0 && imageUrl.indexOf('http') < 0) {
                imageUrl = utils.config('JtbcImagePath') + ((imageUrl[0] != '/') ? '/' : '') + imageUrl;
            }

            if (imageUrl.length > 0) {
                imageUrl = imageUrl + imageSize;
            }

            return imageUrl;
        };

        window.URL_NAMES = {
            search: 'search',
            article: 'article',
            issue: 'issue',
            reporter: 'reporter',
            section: 'section',
            people: 'people',
            jtbc: 'jtbc'
        };

        this.getUrlFormat = function (key, value) {
            // search는 제거해야 할 듯
            var applicationType = utils.config('applicationType'),
                webRoot = applicationType == APPLICATION_TYPE.pc ? utils.config('webPcPath') : utils.config('webMobilePath'),

                searchRoot = utils.config('searchWebPath'),
                URL_FORMAT = {
                    search: searchRoot + '?keyword={VALUE}',
                    article: webRoot + '/article/{VALUE}',
                    issue: webRoot + '/issue/{VALUE}',
                    reporter: webRoot + '/reporter/{VALUE}',
                    section: webRoot + '/{VALUE}',
                    people: 'http://people.joins.com/Search/?pgi=1&ps=&q={VALUE}',
                    jtbc: '/jtbc'
                };

            var urlFormat = URL_FORMAT[key] || '';
            return value ? urlFormat.replace('{VALUE}', encodeURIComponent(value)) : '';
        };

        this.setIgnoreUserAgent = function () {
            utils.setCookie(COOKIE_NAMES.ignoreUserAgent, 'Y', '', COOKIE_CONDITION.path, COOKIE_CONDITION.domain);
        };

        this.removeIgnoreUserAgent = function () {
            utils.removeCookie(COOKIE_NAMES.ignoreUserAgent, COOKIE_CONDITION.path, COOKIE_CONDITION.domain);
        };

        // cloc 반환 함수
        this.getClocUrl = function (url, cloc) {
            if (typeof url != "undefined" && url.indexOf('cloc') < 0) {
                if (url.indexOf("java" + "script") == -1) {
                    var split = url.split('#'),
                        hash = '';
                    if (split[1] != null) {
                        hash = '#' + split[1];
                    }
                    cloc = resetPageName(cloc);
                    if (url == '#') {
                        url = '?cloc=' + cloc;
                    } else if (url.indexOf('?') > -1 || url.indexOf('&') > -1) {
                        url = url.replace(hash, '') + '&cloc=' + cloc + hash;
                    } else {
                        url = url.replace(hash, '') + '?cloc=' + cloc + hash;
                    }
                }
            }

            function resetPageName(cloc) {

                var filterSectionName = ['unique'];

                filterSectionName.forEach(function (v) {
                    if (cloc.indexOf(v)) {
                        cloc.replace(v, 'section');
                    }
                });

                return cloc;
            }
            return url;
        };

        this.peopleSearch = function (keyword) {
            window.open(utils.getUrlFormat(URL_NAMES.people, keyword));
        };

        this.getIrPath = function (url, w, h, addStr, b) {

            addStr = addStr || '';

            var
                irParams = {
                    u: url + addStr,
                    w: w || (h || 240),
                    h: h || (w || 140),
                    t: 'c',
                    bg: b || (b || 'ffffff')
                },
                irPath = '';

            if (url) {
                irPath = utils.config('irPath') + '?' + $.param(irParams);
            }
            return irPath;
        };

        this.getBlurImage = function (imageUrl) {
            //http://dev.ir.joins.com/?u=http://dev.pds.joins.com/news/component/article_template/html_content/201508/maxresdefault.jpg&w=100&h=200&t=c&b=
            if (imageUrl) {
                imageUrl = utils.config('irPath') + '/?u=' + imageUrl + '&w=100&h=200&t=c&b=3';
            }
            return imageUrl;
        };

        var totalId = '';
        this.getTotalId = function () {
            if (totalId == '') {
                totalId = $('#total_id').val() || '';
            }
            return totalId;
        };

        var isLoginContents = '';
        this.getIsLoginContents = function () {
            if (isLoginContents == '') {
                isLoginContents = $('#is_login_contents').val() !== undefined && $('#is_login_contents').val().toLowerCase() == 'true' ? true : false;
            }
            return isLoginContents;
        };

        var reporterId = '';
        this.getReporterId = function () {
            if (reporterId == '') {
                reporterId = $('#reporterId').val() || '';
            }
            return reporterId;
        };

        var servCode = '';
        this.getServCode = function () {
            if (servCode == '') {
                servCode = $('#servcode').val() || '';
            }
            return servCode;
        };

        var articleTitle = '';
        this.getArticleTitle = function () {
            if (articleTitle == '') {
                articleTitle = $('#article_title').text() || '';
            }
            return articleTitle;
        };

        var articleSourceCode = '';
        this.getArticleSourceCode = function () {
            if (articleSourceCode == '') {
                articleSourceCode = $('#sourceCode').val() || '';
            }
            return articleSourceCode;
        };

        var issueId = '';
        this.getIssueId = function () {
            if (issueId == '') {
                issueId = $('#issue_id').val() || '';
            }
            return issueId;
        };

        this.getDisplayCount = function (num) {
            var displayCount = num,
                suffix = 'k',
                isSuffix = false;

            if (typeof num != 'number') {
                num = parseInt(num, 10);
            }

            if (num > 1000) {
                isSuffix = true;

                num = parseInt(num / 100, 10);
                num = num / 10;
            }

            displayCount = num;

            if (isSuffix) {
                displayCount = displayCount + 'k';
            }
            return displayCount;
        };
        /**
         *
         */
        this.menu = new function () {

            var _self = this,
                menus = null,
                searchObj = [],
                callbackQueue = [];

            this.loaded = false;
            this.getMenus = function () {
                return menus;
            };
            this.getPageMenuKey = function () {
                return $('#menu_key').val() || 'Society';
            };
            this.getSearchObj = function () {
                return searchObj;
            };
            this.getMenusIsShowMegaMenu = function () {
                return menus;
            };
            this.getMenuFromKey = function (key, callback) {

                //utils.log('#key : ' + key);

                var arrKey = key.split(','),
                    arrKeyLen = arrKey.length,
                    rtnObj = null;

                searchObj.forEach(function (v) {

                    if (arrKeyLen == 1) {
                        if (arrKey[0].toLowerCase() == v.Key.toLowerCase()) {
                            rtnObj = v;
                            return false;
                        }
                    } else if (arrKeyLen > 1) {
                        if (v.Parent) {
                            if (arrKey[arrKeyLen - 1].toLowerCase() == v.Key.toLowerCase() && arrKey[arrKeyLen - 2].toLowerCase() == v.Parent.Key.toLowerCase()) {
                                rtnObj = v;
                                return false;
                            }
                        }
                    }
                });

                return rtnObj;
            };

            this.callback = function (func) {
                if (_self.loaded) {
                    func();
                } else {
                    callbackQueue.push(func);
                }
            };

            function excuteCallback() {
                callbackQueue.forEach(function (v) {
                    if (typeof v == 'function') {
                        v(_self);
                    }
                });

                var pageType = utils.config('pageType');


            };

            this.init = function (callback) {
                var apiPath = utils.config('applicationType') == APPLICATION_TYPE.mobile ? utils.config('webMobilePath') : utils.config('webPcPath'),
                    url = apiPath + '/api/menu/';

                if (window.menu) {
                    ajaxCallback(window.menu);
                } else {
                    utils.getJsonp({
                        url: url,
                        success: ajaxCallback
                    });
                }

                function ajaxCallback(res) {
                    _self.loaded = true;
                    menus = res.Menu;

                    //utils.log('## get Menu');
                    //utils.log(res);

                    setSearchObj(menus);
                    callback && callback(_self);
                    excuteCallback();
                }

                function setSearchObj(obj, parentObj) {

                    if ($.type(obj) == 'object') {
                        add(obj, parentObj);
                    } else if ($.type(obj) == 'array') {
                        obj.forEach(function (v) {
                            add(v, parentObj);
                        });
                    }

                    function add(obj, parentObj) {
                        if (parentObj && obj.Key) {
                            obj.Parent = parentObj;
                        }
                        if (obj.Key) {
                            searchObj.push(obj);
                        }

                        if (obj.Children && obj.Children.length) {
                            setSearchObj(obj.Children, obj);
                        }
                    }
                }
            };
        };

        this.articleLogForSection = function () {

            //utils.log('### articleLogForSection');

            var referrer = document.referrer;

            //utils.log(referrer);

            if (referrer === '') {
                trackingPage();
            } else {
                trackingArticle(referrer);
            }
        };

        function trackingPage() {
            setTrackingLog(_utils.menu.getPageMenuKey());
        }

        function trackingArticle(referrer) {
            var ref = referrer.toLowerCase(),
                arrowDomain = 'joins.com',
                pathname = '',
                menuKey = '',
                menuObject = null,
                regExp = null;

            if (ref.indexOf(arrowDomain) !== -1) {
                pathname = referrer.substring(ref.indexOf(arrowDomain) + arrowDomain.length);
            }

            if (pathname === '') {
                return trackingPage();
            }

            menuKey = pathname.replace(/^\//, '').replace(/\//, ',');

            menuObject = _utils.menu.getMenuFromKey(menuKey);

            if (menuObject === null || menuObject.IsTrackable === false) {
                return trackingPage();
            }

            setTrackingLog(menuKey);
        }

        function setTrackingLog(keys) {

            var arrKeys = keys.split(',');
            var dType = "web";

            if (location.pathname.toLowerCase().indexOf('/app/mobile/') !== -1) {
                dType = "appmobile";
            }
            else if (location.pathname.toLowerCase().indexOf('/app/tablet/') !== -1) {
                dType = "apptablet";
            }

            utils.setTrackingLog && utils.setTrackingLog({
                type: 'article',
                device: dType,
                params: {
                    'loc1': arrKeys[0] ? arrKeys[0].toLowerCase() : '',
                    'loc2': arrKeys[1] ? arrKeys[1].toLowerCase() : ''
                }
            });
        }

        this.serverDate = new function () {
            var _serverDate = this,
                sDate = null,
                term = 0,
                dateDomSelector = '#_daytimer',
                dateFile = _utils.config('staticRootPath') + '/common/data/nowdaytime/daytimer.js';
				//dateFile = 'http://static.joins.com/common/data/nowdaytime/daytimer.js';
        	

            this.loaded = false;
            this.get = function (callback) {
                return sDate;
            };
            this.isWeekend = function () {
                var day = sDate.getDay();
                return day == 0 || day == 5 || day == 6 ? true : false;
            };
			//중앙 선데이용
            this.isSunday = function () {
                return false;
            	//var day = sDate.getDay();
            	//return (day == 0 || day == 6) ? true : false;   //선데이 메뉴 노출안함
            };
            // edate + 1일로, stime은 -1분, etime은 +1분
            this.betweenDate = function (sDate, eDate, sTime, eTime) {
                var rtnValue = false;
                var date = parseInt(__Ndaytime.ymdhm.toString().substr(2), 10);
                var nDD = date.toString().substr(0, 6)
                var nHM = date.toString().substr(6, 10)

                if (nDD >= sDate && eDate > nDD && (nHM >= sTime && eTime > nHM)) {
                    rtnValue = true;
                }

                return rtnValue;
            };

            // stime은 -1분, etime은 +1분
            this.betweenTime = function (sTime, eTime) {
                var rtnValue = false;
                var date = parseInt(__Ndaytime.ymdhm.toString().substr(2), 10);
                var nDD = date.toString().substr(0, 6)
                var nHM = date.toString().substr(6, 10)

                if (nHM >= sTime && eTime > nHM) {
                    rtnValue = true;
                }

                return rtnValue;
            };

            (function init() {

                //_utils.log('## serverDate init');
                //_utils.log(window.__Ndaytime);

                if (window.__Ndaytime) {
                    setDate();
                } else {
                    //_utils.log(dateFile);

                    //dateFile = $(dateDomSelector).attr('src');
                    if (!dateFile) {
                        return;
                    }
                    $.getScript(dateFile, function () {

                        if (window.__Ndaytime) {
                            setDate();
                        }
                    });
                }

                function setDate() {
                    _serverDate.loaded = true;

                    try {
                        sDate = new Date(__Ndaytime.ba.year, __Ndaytime.ba.month - 1, __Ndaytime.ba.day, __Ndaytime.ba.hour24, __Ndaytime.ba.minute, __Ndaytime.ba.second);
                    } catch (e) {
                        utils.log(e);
                        sDate = new Date();
                    };
                }

            })();
        };

        this.newsRoom = new function () {

            var _isOnAir = false;
            var _isOnAirSet = false;

            //_utils.log('### utils.newsRoom');

            var serverDate = _utils.serverDate.get();

            //_utils.log('serverDate');
            //_utils.log(serverDate);

            var programId = 'PR10000403';
            var broadYYYYMMDD = '';
            var checkTimer = 60 * 1000;
            var timeout = null;
            var onAirInfo = { sDate: null, eDate: null };

            //var checkTimer = 5000;


            //var nowDate


            function checkOnAir(initial) {

                //utils.log('## checkOnAir');

                if (!serverDate) {
                    serverDate = _utils.serverDate.get();
                }
                initial = initial || false;

                //_utils.log('## _isOnAir : ' + _isOnAir);
                //_utils.log('## _isOnAirSet : ' +_isOnAirSet);
                // _utils.log(serverDate);
                // _utils.log(onAirInfo.sDate);
                //utils.log(serverDate);
                //utils.log(serverDate >= onAirInfo.sDate)
                //utils.log(serverDate >= onAirInfo.sDate && serverDate < onAirInfo.eDate);

                if (serverDate >= onAirInfo.sDate && serverDate < onAirInfo.eDate) {

                    //_utils.log('initial : ' + initial);

                    if (initial || !_isOnAirSet) {
                        //utils.log('function : ' + _utils.newsRoom.onAir);
                        _utils.newsRoom.onAir && _utils.newsRoom.onAir();
                    }
                    _isOnAir = true;

                } else {
                    if (initial || _isOnAirSet) {
                        _utils.newsRoom.offAir && _utils.newsRoom.offAir();
                    }
                    _isOnAir = false;
                }

                if (timeout != null) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(function () {

                    var addSeconds = serverDate.getSeconds() + checkTimer / 1000;
                    serverDate = new Date(serverDate.setSeconds(addSeconds));
                    checkOnAir();
                }, checkTimer);
            }

            return {
                isOnAirSet: function (onOff) {
                    _isOnAirSet = onOff;
                },
                init: function () {

                    var nowDate = new Date().format('yyyyMMdd');
                    broadYYYYMMDD = window.__Ndaytime ? __Ndaytime.ymdhm.toString().substr(0, 8) : nowDate;

                    var jtbcScheduleFile = '//fs.jtbc.joins.com/common/data/schedule/schedule_day3.js';

                    if (!jtbcScheduleFile) return;

                    $.getScript(jtbcScheduleFile, function () {
                        var obj = null;

                        var minutes = 0;

                        try {
                            obj = window['mSchedule' + broadYYYYMMDD + 'Set'];

                            var yyyy = broadYYYYMMDD.substr(0, 4);
                            var MM = parseInt(broadYYYYMMDD.substr(4, 2) || 0, 10) - 1;
                            var dd = broadYYYYMMDD.substr(6, 2);

                            $.each(obj.DATA, function (n, v) {
                                if (v.PROG_ID == programId) {
                                    onAirInfo = v;
                                    onAirInfo.sDate = new Date(yyyy, MM, dd, v.BROAD_STIME, v.BROAD_SSEC, 0);
                                    onAirInfo.eDate = new Date(yyyy, MM, dd, v.BROAD_ETIME, v.BROAD_ESEC, 0);
                                }
                            });

                        } catch (e) { utils.log(e); };

                        checkOnAir(true);
                    });
                },
                timerReset: checkOnAir
            };

        };

        this.opinionCast = new function () {

            // 오피니언 방송 OnAir 확인.
            var onAirInfo = { title: '', content: '', progid: '', sDate: null, eDate: null, image: '' },
                serverDate = _utils.serverDate.get(),
                checkTimer = 60 * 1000;

            var timeout = null;
            var _isOnAir = false;
            var _isOnAirSet = false;


            //checkTimer = 5000;


            function checkOnAir(initial) {

                if (!serverDate) {
                    serverDate = _utils.serverDate.get();
                }
                //setOnAir();
                //_utils.log('## opinionCast _isOnAir : ' + _isOnAir);
                //_utils.log('## opinionCast _isOnAirSet : ' +_isOnAirSet);
                //_utils.log(serverDate);
                //_utils.log(onAirInfo.sDate);
                //utils.log('## opinionCast checkOnAir : ' +initial);
                //utils.log(serverDate)

                if (serverDate >= onAirInfo.sDate && serverDate < onAirInfo.eDate) {
                    if (initial || !_isOnAirSet) {


                        utils.opinionCast.onAir && utils.opinionCast.onAir(onAirInfo);
                        setTimeout(function () {
                            utils.opinionCast.onAirSlide && utils.opinionCast.onAirSlide(onAirInfo);
                        }, 400);

                    }
                    _isOnAir = true;
                } else {
                    if (initial || _isOnAirSet) {


                        utils.opinionCast.offAir && utils.opinionCast.offAir(onAirInfo);
                        setTimeout(function () {
                            utils.opinionCast.offAirSlide && utils.opinionCast.offAirSlide(onAirInfo);
                        }, 400);

                    }
                    _isOnAir = false;
                }

                if (timeout != null) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(function () {
                    var addSeconds = serverDate.getSeconds() + checkTimer / 1000;
                    serverDate = new Date(serverDate.setSeconds(addSeconds));
                    checkOnAir();
                }, checkTimer);
            }

            return {
                isOnAirSet: function (onOff) {
                    _isOnAirSet = onOff;
                },
                init: function () {

                    var opinionCastSchedule = utils.config('staticPath') + '/scripts/data/opinioncast/js/index_onair_schedule.js';

                    //_utils.log('## opinionCast init');

                    if (!opinionCastSchedule) return;

                    $.getScript(opinionCastSchedule, function () {

                        try {
                            //_utils.log(index_onair_schedule);
                            $.each(index_onair_schedule, function (n, v) {
                                onAirInfo[n] = v[0].value;
                            });
                            onAirInfo.yyyy = onAirInfo.date.substr(0, 4);
                            onAirInfo.MM = onAirInfo.date.substr(4, 2);
                            onAirInfo.dd = onAirInfo.date.substr(6, 2);
                            onAirInfo.sDate = new Date(onAirInfo.yyyy, onAirInfo.MM - 1, onAirInfo.dd, onAirInfo.stime.substr(0, 2), onAirInfo.stime.substr(2, 2), 0);
                            onAirInfo.eDate = new Date(onAirInfo.yyyy, onAirInfo.MM - 1, onAirInfo.dd, onAirInfo.etime.substr(0, 2), onAirInfo.etime.substr(2, 2), 0);
                        } catch (e) { utils.log(e); };

                        _utils.log(onAirInfo);
                        //setOnAir(); // onair test
                        checkOnAir(true);
                    });
                },
                timerReset: checkOnAir
            };
        };

        this.convertList = function (origin) {
            var list = [];

            $.each(origin, function (n, v) {
                v.forEach(function (_v, _i) {
                    if (!list[_i]) {
                        list[_i] = {};
                    }
                    list[_i][n] = _v.value;
                });
            });
            return list;
        };

        this.setTrackingLog = function (options) {

            var deviceType = _utils.config('deviceType');
            var logMaps = {
            	'photo': { url: utils.config('logNewsPath') + '/PhotoGalleryLogCollector.html?div=' },
            	'image': { url: utils.config('logNewsPath') + '/BundlePhotoLogCollector.html?div=' },
            	'article': { url: utils.config('logNewsPath') + '/NewsArticleLogCollector.html?div=' }
            };

            var params = $.param(options.params);

            if (options.type == 'image' || options.type == 'article') {
                params += '&servcode=' + utils.getServCode();
            }

            if (options.type == 'article') {
                if (options.device == 'apptablet' || options.device == 'appmobile') deviceType = options.device;
            }

            var referrer = document.referrer;
            if (referrer) {
                if (referrer.indexOf('?') > 0) {
                    referrer = referrer.substring(0, referrer.indexOf('?'));
                }
            }
            params += '&oref=' + referrer;
            setTrackingFrame({ url: logMaps[options.type].url + deviceType + '&' + params });

            function setTrackingFrame(opts) {

                var frameId = 'tracking_log',
                    $targetFrame = $('#' + frameId);

                if ($targetFrame.length == 0) {
                    $('<iframe id="' + frameId + '" src="' + opts.url + '" style="display:none;"></iframe>').appendTo(document.body);
                } else {
                    $targetFrame.remove();
                    $('<iframe id="' + frameId + '" src="' + opts.url + '" style="display:none;"></iframe>').appendTo(document.body);
                }
            };
        };

        this.createIFrame = function (opts) {
            if (opts.id && $('#' + opts.id).length == 0) {
                $('<iframe id="' + opts.id + '" src="' + opts.url + '" style="display:none;"></iframe>').appendTo(document.body);
            } else if (opts.id && $('#' + opts.id).length > 0) {
                $('#' + opts.id).remove();
                $('<iframe id="' + opts.id + '" src="' + opts.url + '" style="display:none;"></iframe>').appendTo(document.body);
            }
        };

        function getParamString(params) {
            var strParams = '';//'?';
            $.each(params, function (i, v) {
                if (v != '') {
                    if (strParams.length > 0) {
                        strParams += "&"
                    }
                    strParams += i + '=' + v;
                }
            });
            return '?' + strParams;
        }

        this.shareHandler = new function () {
            var iOS = /iPad|iPhone|iPod/.test(navigator.platform);
            var
                config = {
                    isMobile: _utils.isMobile(),
                    appkey: '62547e7c5e294f7836425fb3a755e4a1',
                    kakaotalk: {
                        id: 'kakao-link',
                        width: '300',
                        height: '200',
                        text: ''
                    },
                    title: _utils.getMetaValue('og:title'),
                    image: _utils.getMetaValue('og:image'),
                    url: _utils.getMetaValue('og:url')
                },
                services = {
                    facebook: function facebook(url) {
                        //utils.log('url  : ' +url);
                        //utils.log('config.url  : ' +config.url);
                        url = url || config.url;
                        //아티클 페이스북 공유시 url을 mnews로 준다. (news.joins.com 도메인이 차단됨)
                        if (utils.config('pageType') == PAGE_TYPE.article) { url = url.replace(utils.config('webPcPath'), utils.config('webMobilePath')); }
                        var params = { u: setDomain(url) },
                            path = 'https://www.facebook.com/sharer/sharer.php',
                            openUrl = path + getParamString(params);

                        window.open(openUrl, 'share_facebook', 'directories=no,location=no,menubar=no,status=no,toolbar=no,scrollbars=no,resizable=no,width=420,height=370');
                    },
                    twitter: function twitter(url, title) {
                        url = url || config.url;
                        title = title || utils.getMetaValue('twitter:title');

                        var twitterWindow = window.open('', 'share_twitter', 'directories=no,location=no,menubar=no,status=no,toolbar=no,scrollbars=no,resizable=no,width=640, height=440');
                    	var params = { text: title, url: setDomain(url) },
                            path = 'https://twitter.com/intent/tweet',
                            openUrl = path + '?' + $.param(params);

						twitterWindow.location.href = openUrl;
                    },
                    googleplus: function googleplus(url) {
                        url = url || config.url;
                        var params = { url: setDomain(url), hl: 'ko' },
                            path = 'https://plus.google.com/share',
                            openUrl = path + '?' + $.param(params);

                        window.open(openUrl, 'share_google', 'directories=no,location=no,menubar=no,status=no,toolbar=no,scrollbars=no,resizable=no,width=500,height=370');
                    },
                    pinterest: function pinterest(url, title) {
                        url = url || config.url;
                        title = title || config.title;
                        var params = { url: setDomain(url), media: config.image, description: title },
                            path = 'https://www.pinterest.com/pin/create/button/',
                            openUrl = path + '?' + $.param(params);

                        window.open(openUrl, 'share_pinterest', 'directories=no,location=no,menubar=no,status=no,toolbar=no,scrollbars=no,resizable=no,width=500,height=370');
                    },
                    kakaostory: function kakaostory(url, title) {
                        url = url || config.url;
                        title = title || config.title;
                        Kakao.Story.share({
                            url: setDomain(url),
                            //url: 'http://news.joins.com/article/554/18532554.html?ctg=1000&cloc=joongang|home|top', //test
                            text: title
                        });
                    },
                    kakaotalk: function kakaotalk(url) {
                    	url = url || config.url;
                        //Kakao.Link && Kakao.Link.sendDefault({
                        //    objectType: "feed",
                        //    content: {
                        //    	title: title,
                        //        description: "",
                        //        imageUrl: image || utils.config('imagePath') + '/mw/kakao_share.png',
                        //        link: {
                        //        	mobileWebUrl: setDomain(url),
                        //        	webUrl: setDomain(url)
                        //        }
                        //    },
                        //    fail: function () {
                        //        alert('지원하지 않는 플랫폼입니다.');
                        //    }
                        //});

                        Kakao.Link.sendScrap({
                        	requestUrl: setDomain(url),
                        	fail: function () {
                        		alert('지원하지 않는 플랫폼입니다.');
                        	}
                        });
                    },
                    pocket: function pocket(url) {
                        url = url || config.url;
                        var path = { mobile: utils.config('webMobilePath'), web: utils.config('webPcPath') },
                            openUrl = (config.isMobile === true ? path.mobile : path.web) + '/sns/share?snstype=pocket&url=' + encodeURIComponent(setDomain(url));

                        window.open(openUrl, 'share_pocket', 'directories=no,location=no,menubar=no,status=no,toolbar=no,scrollbars=no,resizable=no,width=500,height=370');
                    },
                    email: function () {
                        utils.shareArticleForMail && utils.shareArticleForMail();
                    },
                    naverband: function naverband(url, title) {
                        var _url = encodeURIComponent(url || config.url);
                        var _title = encodeURIComponent(title || config.title);
                        var _br = encodeURIComponent('\r\n');
                        var oBand = {
                            param: 'create/post?text=' + _title + _br + _url,
                            a_store: 'itms-apps://itunes.apple.com/app/id542613198?mt=8',
                            g_store: 'market://details?id=com.nhn.android.band',
                            a_proto: 'bandapp://',
                            g_proto: 'scheme=bandapp;package=com.nhn.android.band'
                        };
                        if (navigator.userAgent.match(/android/i)) {
                            setTimeout(function () { location.href = 'intent://' + oBand.param + '#Intent;' + oBand.g_proto + ';end' }, 100);
                        }
                        else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
                            setTimeout(function () { location.href = oBand.a_store; }, 200);
                            setTimeout(function () { location.href = oBand.a_proto + oBand.param }, 100);
                        }
                        else {
                            alert('지원하지 않는 플랫폼입니다.');
                        }
                    }
                };

            (function init() {
                if (window.Kakao && window.Kakao.Auth === undefined) {
                    Kakao.init(config.appkey);
                }
            })();

            function setDomain(path) {
                var domainPath = utils.isMobile() ? utils.config('webMobilePath') : utils.config('webPcPath'); // 'http://' + location.host;

                if (path && path.indexOf('http') != 0) {
                    path = domainPath + path;
                }
                return path;
            }

            function shortenUrl(url, callback) {

                $.getJSON(utils.config('apiPath') + '/shortenurl', {
                    url: encodeURIComponent(url)
                }).done(function (res) {
                    callback && callback(res);
                });
            }

            function snsCounting(target, service, id) {
                // TODO : 공유 Count Api 호출 작성.
                // @params : totalId, service

                //http://local.apis.joins.com/news/17336581/share (DeviceType=Mobile, SharedType={Facebook,Twitter,Instagram,GooglePlus,KakaoTalk,KakaoStory,Pinterest,Email)
                //http://local.apis.joins.com/issue/123423/share (DeviceType=Mobile)

                var API_INFO = {
                    news: '/article/{id}/share',
                    issue: '/issue/{id}/share',
                    digitalspecial: '/digitalspecial/{id}/share'
                },
                    api = API_INFO[target];

                if (!api) {
                    utils.error('not defined ' + target + ' > API_INFO', true);
                    return;
                }

                api = api.replace('{id}', id);
                utils.ajaxPost({
                    url: utils.config('apiPath') + api,
                    data: { SharedType: service },
                    success: function (res) {
                        if (res && res.IsSuccess == true && typeof utils.shareCountCallback == 'function') {
                            utils.shareCountCallback && utils.shareCountCallback(target);
                        }
                    }
                });
            }

            function clickHandler() {

                config.title = utils.getMetaValue('og:title');
                config.image = utils.getMetaValue('og:image');
                config.url = utils.getMetaValue('og:url');

                var $btn = $(this),
                    id = $('#total_id').val() || $btn.data('id') || '',
                    target = $btn.data('target'), // news, issue, keyword     
                    service = $btn.data('service'), // twitter, facebook....
                    url = $btn.data('url'),
                    title = $btn.data('title'),
                    func = services[service];

                if (id) {
                    snsCounting(target, service, id);
                }

                if (typeof func == 'function') {
                    func(url, title);
                }

                return false;
            };

            this.bind = function ($t) {
                //utils.log('## utils.shareHandler.bind : ' + $t.data('service'));
                if (!$t || !$t.length || !$t.data('service')) {
                    return;
                }
                $t.on('click', clickHandler);

                //_utils.log('#### pcPath' + _utils.config('webPcPath'));
            };

            this.unbind = function ($t) {
                //utils.log('## utils.shareHandler.unbind : ' + $t.data('service'));
                if (!$t || !$t.length || !$t.data('service')) {
                    return;
                }
                $t.off('click', clickHandler);
            };

            this.todoSearch = function () {
                alert('검색엔진 작업 후, 처리');
                return false;
            };

            this.todoDefinedNeed = function () {
                alert('기능 정의 필요.');
                return false;
            };

        };

        this.favoriteMenus = new function () {
            var codeMap = { // A : 고정 그룹, B : 뉴스그룹, C : 섹션그룹, D : 서비스그룹
                //플리킹 메뉴제거 'A2': 'realtimenews',
                'A1': 'visualnews',
                'B1': 'opinion',
                'B2': 'politics',
                'B3': 'money',
                'B4': 'society',
                'B5': 'world',
                'B6': 'culture',
                'B7': 'sports',
                'B8': 'star',
                'B9': 'pic',
                'C1': 'jplus',
                'C2': 'travel',
                'C3': 'gangnam',
                'C4': 'nk',
                'C5': 'retirement',
                'C6': 'cartoon',
                'C7': 'sectionnews',
                'D1': 'trend'
            },
            defaultMenuCode = 'A1,D1,C7,B9,C1';

            //set menuKeys
            this.set = function (menuKeys) {
                var cookieDatas = [];

                $.each(menuKeys, function (i, v) {
                    $.each(codeMap, function (key, value) {
                        if (v === value) {
                            cookieDatas.push(key);
                        }
                    });
                });
                utils.setCookie(COOKIE_NAMES.favoritemenus, cookieDatas.toString(), 30, COOKIE_CONDITION.path, COOKIE_CONDITION.domain);
            };

            //get > arg : favoriteCodeName, return menukey.
            this.get = function (name) {
                var cookieDatas = utils.getCookie(COOKIE_NAMES.favoritemenus),
                    rtnDatas = [];

                if (cookieDatas === null) { cookieDatas = defaultMenuCode; }

                rtnDatas = cookieDatas.split(',').filter(function (v) { return v == name });

                return rtnDatas[0];
            };

            //get > return menukeys
            this.getList = function () {
                var fixedMenu = this.getFixedList();
                var cookieDatas = utils.getCookie(COOKIE_NAMES.favoritemenus),
                    rtnDatas = [];

                if (cookieDatas === null) { cookieDatas = defaultMenuCode; }

                $.each(cookieDatas.split(','), function (key, value) {
                    rtnDatas.push(codeMap[value]);
                });

                for (var i2 = 0; i2 < fixedMenu.length; i2++) {
                    var bExistMenu = false;
                    for (var i = 0, len = rtnDatas.length; i < len; i++) {
                        if (fixedMenu[i2].toString() == rtnDatas[i].toString()) {
                            bExistMenu = true;
                            break;
                        }
                    }
                    if (!bExistMenu) {
                        rtnDatas.unshift(fixedMenu[i2].toString());
                    }
                }

                return rtnDatas;
            };

            //get > return menukeys.toString()
            this.getListToString = function () {
                var rtnDatas = this.getList();
                return rtnDatas.toString();
            };

            //get > return fixed menukeys
            this.getFixedList = function () {
                var rtnDatas = [];
                $.each(codeMap, function (key, value) {
                    if (key.substr(0, 1) == "A") {
                        rtnDatas.push(value);
                    }
                });
                return rtnDatas;
            };
        };

        this.redirectUrl = function () {
            var webPcPath = utils.config('webPcPath'),
                webMobilePath = utils.config('webMobilePath'),
                applicationType = utils.config('applicationType'),
                redirectApplication = utils.config('applicationType') === APPLICATION_TYPE.pc ? APPLICATION_TYPE.mobile : APPLICATION_TYPE.pc, //application type 이 반대로 변경 pc -> mobile
                menuKey = utils.menu.getPageMenuKey().toLowerCase(),
                host = location.host,
                path = location.pathname,
                search = location.search,
                externalList = ['survey', 'realestate', 'jplus', 'gangnam'],
                urlMapperList = ["/politics/", "/money/", "/society/", "/world/", "/culture/", "/opinion/", "/sports/", "/star/", "/travel/", "/retirement/", "/trend/"],
                exceptionList = [{
                    path: '/nk/photo/list',
                    redirectPath: '/nk'
                }, {
                    path: '/stock',
                    redirectPath: '/money'
                }, {
                    path: '/find/list',
                    redirectPath: '/find/list'
                }, {
                    path: '/retirement/news/list',
                    redirectPath: '/retirement'
                }, {
                    path: '/time7/subscribe',
                    redirectPath: '/time7'
                }, {
                    path: '/opinion/editorialcolumn/list',
                    redirectPath: '/opinion/editorialcolumn/list'
                }, {
                	path: '/opinion/opinioncast',
                	redirectPath: '/opinion/opinioncast'
                }, {
                	path: '/series',
                	redirectPath: '/'
                }, {
                	path: '/ranking',
                	redirectPath: '/'
                }],
                webPath = applicationType === APPLICATION_TYPE.pc ? webMobilePath : webPcPath,
                url = '';

            //search
            function getSearchRedirectObject() {
                var mapper = {
                    mobile: webMobilePath + '/find' + search,
                    pc: utils.config('searchWebPath') + search
                }

                return mapper;
            }
            //외부 도메인 페이지
            function getExternalRedirectObject(type) {
                var mapper = {
                    'suvery': {
                        mobile: webMobilePath + '/politics',
                        pc: webPcPath + '/politics'
                    },
                    'realestate': {
                        mobile: webMobilePath + '/money',
                        pc: webPcPath + '/money'
                    },
                    'jplus': {
                        mobile: 'http://m.jplus.joins.com' + path + search,
                        pc: 'http://jplus.joins.com' + path + search
                    },
                    'gangnam': {
                        mobile: 'http://m.gangnam.joins.com',
                        pc: 'http://gangnam.joins.com'
                    }
                };

                return mapper[type];
            }

            //host 비교
            if (url === '') {
                externalList.forEach(function (v, i, a) {
                    if (host.indexOf(v) !== -1) {
                        var externalObject = getExternalRedirectObject(v);
                        url = externalObject[redirectApplication];
                    }
                });
            }

            if (url === '') {
                //search 비교 -> menukey
                if (menuKey.indexOf('find') !== -1) {
                    var searchObject = getSearchRedirectObject();
                    url = searchObject[redirectApplication];
                }
            }

            if (url === '') {
                //exception
                exceptionList.forEach(function (v, i, a) {
                    if (path.indexOf(v.path) === 0) {
                        url = webPath + v.redirectPath;

                        if (v.path === '/find/list') {
                            var queryString = search.replace('?', '').split('&'),
                                param = '';

                            for (var i = 0, len = queryString.length; i < len ; i++) {
                                var query = queryString[i].toLowerCase();
                                if (query.indexOf('page') !== 0 && query.indexOf('cloc') !== 0) {
                                    param = param === '' ? query : param + '&' + query;
                                }
                            }

                            url = url + '?' + param;
                        } else {
                            url = url + search;
                        }
                    }
                });
            }

            if (url === '') {
                //defaults type
                urlMapperList.forEach(function (v, i, a) {
                    if (path.indexOf(v) === 0) {
                        url = webPath + v;
                    }
                });
            }

            //모두 통과한 경우엔 도메인만 바꿔준다.
            if (url === '') { url = webPath + path; }

            location.href = url;
        }

        this.getOvpOneTimeUrl = function (obj) {
            this.ajaxGet({
                url: utils.config("apiPath") + '/video/getOvpUrl/?mediaKey=' + obj.ovpUrl + '&ro=' + obj.ro,
                success: function (res) {
                    obj.success && obj.success(res || '');
                },
                error: function (e) { obj.success && obj.success(''); }
            });
        }
		
        this.setSearchKeywordLog = function (keyword) {
        	var data = { Word: keyword };

        	utils.ajaxPost({
        		url: utils.config("apiPath") + '/Find/SetSearchKeywordLog',
        		data: { Word: keyword }
        	});
        };
    };

    window.utils = new Utils();
    utils.setPCID && utils.setPCID();

    window.userInfo = new function UserInfo() {

    	var USER_TYPE = { joins: 'joins', twitter: 'twitter', facebook: 'facebook', kakao: 'kakao' },
            COOKIE_NAMES = { socialname: 'JCUBE_SOCIAL_NAME', id: 'Joins_MemID', name: 'Joins_MemName', status: 'Joins_LoginStatus', valid: 'Joins_ValidLogin', memArray: 'MemArray', ssoInfo: 'SSOInfo', snsInfo: 'SNSInfo' }, //소셜로그인 추가.161208
            INFO_MAP = { MemID: 'id', MemName: 'name', MemType: 'memType', MemStatus: 'memStatus', ValidLogin: 'valid', LoginStatus: 'status', adult: 'adult', Myselfcfm: 'mySelfcfm' },
            userType = 'joins',
            info = {
                id: utils.getCookie(COOKIE_NAMES.socialname) || utils.getCookie(COOKIE_NAMES.id), //소셜로그인 추가.161208
                name: '',
                status: '',
                valid: '',
                ssoInfo: utils.getCookie(COOKIE_NAMES.ssoInfo),
                memArray: utils.getCookie(COOKIE_NAMES.memArray),
                memType: '',
                memStatus: '',
                adult: '',
                mySelfcfm: '',
                snsInfo: utils.getCookie(COOKIE_NAMES.snsInfo)
            };

        (function init() {
            if (info.memArray === null) {
                return;
            }

            var memInfos = info.memArray.split('&');

            for (var i = 0,
                    len = memInfos.length; i < len; i++) {
                var minfo = memInfos[i].split('='),
                    key = INFO_MAP[minfo[0]],
                    value = minfo[1];

                if (key === 'name') {
                    value = unescape(value);
                }

                info[key] = value;
            }

        })();

        this.getId = function () {
            return info.id || '';
        };

        this.getInfo = function () {
            return info;
        };

        this.isLogin = function () {
        	return (utils.getCookie(COOKIE_NAMES.memArray) && utils.getCookie(COOKIE_NAMES.ssoInfo) || (utils.getCookie(COOKIE_NAMES.socialname) && utils.getCookie(COOKIE_NAMES.snsinfo))) ? true : false; //소셜로그인 추가.161208
        };

        this.logout = function () {
            $.each(COOKIE_NAMES, function (i, v) {
                utils.removeCookie(v, COOKIE_CONDITION.path, COOKIE_CONDITION.domain);
            });
        };
    };

    window.commentUserInfo = new function CommentUserInfo() {
        var _commentUserInfo = this,
            SERVICE_TYPE = { joins: 'joins', twitter: 'twitter', facebook: 'facebook', kakao: 'kakao' },
            COOKIE_NAMES = { id: 'JCUBE_SOCIAL_ID', name: 'JCUBE_SOCIAL_NAME', profileImage: 'JCUBE_SOCIAL_IMAGE', userKey: 'JCUBE_SOCIAL_USERKEY', type: 'JCUBE_SOCIAL_TYPE', ip: 'JCUBE_SOCIAL_IP', snsInfo: 'SNSInfo' },
            joinsUserInfo = userInfo.getInfo(),
            info = {
                type: SERVICE_TYPE.joins,
                id: joinsUserInfo.id,
                name: joinsUserInfo.name,
                profileImage: '',
                userKey: '',
            	snsInfo: utils.getCookie(COOKIE_NAMES.snsInfo)
            };

        (function init() {
            $.each(COOKIE_NAMES, function (i, v) {
                info[i] = utils.getCookie(v) || info[i];
            });
        })();

        this.getInfo = function () {
            return info;
        };

        this.getType = function () {
            return info.type;
        };

        this.isLogin = function () {
        	return info.id || info.snsInfo != null ? true : false;
        };

        this.login = function (obj) {

            _commentUserInfo.logout();

            $.each(obj, function (i, v) {
                switch (v.name) {
                    case 'Id':
                        setInfoItem('id', v.value);
                        break;
                    case 'Name':
                        setInfoItem('name', v.value);
                        break;
                    case 'Profile':
                        setInfoItem('profileImage', v.value);
                        break;
                    case 'Key':
                        setInfoItem('userKey', v.value);
                        break;
                    case 'Origin':
                        setInfoItem('type', v.value);
                        break;
                }
            });
        };

        this.logout = function () {
            $.each(COOKIE_NAMES, function (i, v) {
                utils.removeCookie(v, COOKIE_CONDITION.path, COOKIE_CONDITION.domain);
            });
            userInfo.logout();
        };

        this.init = function () {
            $.each(COOKIE_NAMES, function (i, v) {
                info[i] = utils.getCookie(v) || '';
            });
        };

        function setInfoItem(name, value) {
            utils.setCookie(COOKIE_NAMES[name], value, 1, COOKIE_CONDITION.path, COOKIE_CONDITION.domain);
            info[name] = value;
        }
    };

    utils.getTargetFilter = function (_url) {
    	var blankFilter = ['nk.joins.com', 'tong.joins.com', 'paper.joins.com', 'www.joins.com', 'jmembership.joins.com', 'subscribe.joins.com', 'people.joins.com', 'weather.joins.com', 'mediaspider.joins.com', 'gangnam.joins.com', 'peoplemic.joins.com'],
            target = '',
            url = _url;

        if (blankFilter.filter(function (v) {
            return url.indexOf(v) > -1;
        }).length > 0) {
            target = 'target="_blank"';
        }

        return target;
    };

    utils.decorators = {
        menuLink: {
            href: function () {
                return this.link && this.link.href;
            },
            target: function () {
                var href = this.link && this.link.href ? this.link.href : '';
                return utils.getTargetFilter(href).length > 0 ? '_blank' : '_self';
            },
            text: function (params) {
                var $ele = $(params.element);
                if ($ele.children().length == 0) {
                    return this.link && this.link.text;
                }
            },
            html: function (params) {
                var $ele = $(params.element);
                if ($ele.find('img').length == 0) {
                    return this.link && this.link.html;
                }
            }
        },
        link: {
            href: function () {
                return this.link && this.link.href;
            },
            target: function () {
                return this.link && this.link.target;
            },
            text: function (params) {
                var $ele = $(params.element);
                if ($ele.children().length == 0) {
                    return this.link && this.link.text;
                }
            },
            html: function (params) {
                var $ele = $(params.element);
                if ($ele.find('img').length == 0) {
                    return this.link && this.link.html;
                }
            },
            'class': function () {
                if (this.link && this.link.cls) {
                    return this.link.cls;
                }
            },
            'className': function () {
                if (this.link && this.link.cls) {
                    return this.link.cls;
                }
            },
            title: function () {
                var title = this.link && this.link.target == '_blank' ? '(새창) ' + this.link && this.link.text || utils.decodeEntities(this.link.html) + '(으)로 이동' : this.link && this.link.text;
                if (this.link && this.link.title) {
                    title = this.link.title;
                }
                return title;
            },
            image: {
                alt: function () {
                    return this.text;
                }
            }
        },
        image: {
            src: function () {
                return this.image && this.image.src;
            },
            alt: function () {
                return (this.image && this.image.alt) || (this.link && this.link.text);
            }

        },
        text: {
            text: function (params) {
                return this.text;
            }
        },
        icon: {
            html: function (params) {
                if (this.icon && this.icon.newIcon) {
                    var ele = params.element;
                    $(ele).prepend('<span class="icon_new">NEW</span>');
                }
            }
        }
    };

    utils.models = {
        getLinkFromMenu: function (menu) {
            var link = {};
            try {
                link = { key: menu.Key, link: { text: menu.Display, href: menu.Url.Path } };
            } catch (e) {
            };
            return link;
        },
        getListFromMenus: function (list) {
            var items = [];

            list.forEach(function (v, i, a) {
                items.push(utils.models.getLinkFromMenu(v));
            });
            return items;
        },
        getLinkFromApiArticle: function (article) {

            var obj = {};

            try {
                obj = { type: article.Type, link: { text: article.Title, href: article.Link }, image: { src: article.Thumbnail, alt: article.Title } };
            } catch (e) {
            };

            return obj;
        }
    };

})(window, document, jQuery);

// Polyfill (s)
/*
* @name : trim [String]
* @desc : 공백 제거
*/
if (typeof String.prototype.trim != 'function') {
    String.prototype.trim = function () {
        return this.replace(/(^[\s　]+)|([\s　]+$)/g, "");
    };
};

/*
* @name : isEmpty [String]
* @desc : Empty 여부
* ie8 동작 안함.
*/
if (typeof String.prototype.isEmpty != 'function') {
    String.prototype.isEmpty = function () {
        return (this.length === 0);
    };
};

/*
* @name : getByteLength [String]
* @desc : 문자열의 Byte 길이 반환.
*/
if (typeof String.prototype.getByteLength != 'function') {
    String.prototype.getByteLength = function () {
        var self = this,
            b,
            i,
            c;
        for (b = i = 0; c = self.charCodeAt(i++) ; b += c >> 11 ? 3 : c >> 7 ? c : 1) {;
        }
        return b;
    };
};

/*
* @name : cut [String]
* @desc : ??
*/
if (typeof String.prototype.cut != 'function') {
    String.prototype.cut = function (len) {
        var s = '',
            i = 0;
        while (i++ < len) {
            s += this;
        }
        return s;
    };
};

/*
* @name : zf
* @desc : ??
*/
if (typeof String.prototype.zf != 'function') {
    String.prototype.zf = function (len) {
        return "0".cut(len - this.length) + this;
    };
};

/*
* @name : toDate [String]
* @desc : yyyy.MM.dd or yyyy-MM-dd 형태의 string 을 date 객체로 parsing.
*/
if (typeof String.prototype.toDate != 'function') {
    String.prototype.toDate = function () {

        var d = this.replaceAll('.', '/').replaceAll('-', '/');
        return new Date(d);
    };
};

/*
* @name : toDateISO8061 [String]
* @desc : ISO8061 형식의 String 을 Date 객체로 parsing.
*/
if (typeof String.prototype.toDateISO8061 != 'function') {
    String.prototype.toDateISO8061 = function () {

        if (!this.valueOf()) {
            return " ";
        }

        var s = this.replace('T', ' ').split(/[- :]/);

        return new Date(s[0], s[1] - 1, s[2], s[3] || 0, s[4] || 0, s[5] || 0);
    };
};

/*
* @name : toLocation [String]
* @desc : url(loaction.href type) string 을 객체 형태로 분리해서 전달.
* @param : object
* @depends : $.deparam, $.param
*/
if (typeof String.prototype.toLocation != 'function') {
    String.prototype.toLocation = function () {
        var a = document.createElement('a'),
            loc = { hash: '', host: '', hostname: '', href: '', origin: '', pathname: '', port: '', protocol: '', search: '' };

        a.href = this;
        $.each(loc, function (n, v) {
            if (n == 'pathname' && a[n].indexOf('/') != 0) {
                loc[n] = '/' + a[n];
            } else {
                loc[n] = a[n];
            }
        });

        return loc;
    };
};

/*
* @name : replaceParams [String]
* @desc : 파라미터 형식의 string 에서 특정 파라미터의 값을 치환.
* @param : object
* @depends : $.deparam, $.param
*/
if (typeof String.prototype.replaceParams != 'function') {
    String.prototype.replaceParams = function (obj) {

        if (typeof $.deparam != 'function') {
            utils.error('$.deparam is not defined.');
        }
        if (typeof $.param != 'function') {
            utils.error('$.param is not defined.');
        }

        var params = $.deparam(this.replace('?', ''));

        $.each(obj, function (n, v) {
            params[n] = v;
        });

        //utils.log(params);
        return $.param(params);
    };
};

/*
* @name : replaceAll [String]
* @desc : 대상 문자열 전체를 대상으로 치환.
* @param : find, replace
*/
if (typeof String.prototype.replaceAll != 'function') {
    String.prototype.replaceAll = function (f, r) {
        f = f.escapeRegExp();
        return this.replace(new RegExp(f, 'g'), r);
    };
};

/*
* @name : escapeRegExp [String]
* @desc : 정규식 filter keyword 형태 치환.
*/
if (typeof String.prototype.escapeRegExp != 'function') {
    String.prototype.escapeRegExp = function () {
        return this.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    };
};

/*
* @name :
* @desc :
*/
if (typeof Number.prototype.zf != 'function') {
    Number.prototype.zf = function (len) {
        return this.toString().zf(len);
    };
};

/*
* @name : filter [Array]
* @desc : 배열 필터, 새로운 배열 반환
* @param : [filter condition function.]
*/
if (typeof Array.prototype.filter != 'function') {
    Array.prototype.filter = function (func) {
        var newArray = [],
            self = this;

        for (var i = 0,
                len = self.length; i < len; i++) {
            if (func(self[i], i, self)) {
                newArray.push(self[i]);
            }
        }
        return newArray;
    };
};

/*
* @name : forEach [Array]
* @desc : 배열 순회
* @param : function
*/
if (typeof Array.prototype.forEach != 'function') {
    Array.prototype.forEach = function (func) {
        var self = this;

        for (var i = 0,
                len = self.length; i < len; i++) {
            func.call(self, self[i], i, self);
        }
    };
};

/*
* @name : contains [Array]
* @desc : 원소의 존재 여부.
* @param : array item [...]
*/
if (typeof Array.prototype.contains != 'function') {
    Array.prototype.contains = function (compareValue) {
        var self = this;
        for (var i = 0,
                len = self.length; i < len; i++) {
            if (self[i] === compareValue) {
                return true;
            }
        }
        return false;
    };
};

/*
* @name : isArray [Array]
* @des : 배열 여부
*/
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.21
// Reference: http://es5.github.io/#x15.4.4.21
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function (callback /*, initialValue*/) {
        'use strict';
        if (this == null) {
            throw new TypeError('Array.prototype.reduce called on null or undefined');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        var t = Object(this),
            len = t.length >>> 0,
            k = 0,
            value;
        if (arguments.length == 2) {
            value = arguments[1];
        } else {
            while (k < len && !(k in t)) {
                k++;
            }
            if (k >= len) {
                throw new TypeError('Reduce of empty array with no initial value');
            }
            value = t[k++];
        }
        for (; k < len; k++) {
            if (k in t) {
                value = callback(value, t[k], k, t);
            }
        }
        return value;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {

        var k;

        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        var len = O.length >>> 0;

        if (len === 0) {
            return -1;
        }

        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        if (n >= len) {
            return -1;
        }

        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        while (k < len) {
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

/*
* @name : addDate [Date]
* @desc : 날짜 증가/감소
* @param : days[Number]
*/
if (typeof Date.prototype.addDate != 'function') {
    Date.prototype.addDate = function (days) {
        var dat = new Date(this.valueOf());

        dat.setDate(dat.getDate() + days);

        return dat;
    };
};

/*
* @name :
* @des :
*/
if (typeof Date.prototype.format != 'function') {
    Date.prototype.format = function (f) {
        if (!this.valueOf()) {
            return " ";
        }

        var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
            shortWeekName = ["일", "월", "화", "수", "목", "금", "토"],
            d = this;

        return f.replace(/(yyyy|yy|MM|dd|E|e|hh|mm|ss|a\/p)/gi, function ($1) {
            switch ($1) {
                case "yyyy":
                    return d.getFullYear();
                case "yy":
                    return (d.getFullYear() % 1000).zf(2);
                case "MM":
                    return (d.getMonth() + 1).zf(2);
                case "dd":
                    return d.getDate().zf(2);
                case "E":
                    return weekName[d.getDay()];
                case "e":
                    return shortWeekName[d.getDay()];
                case "HH":
                    return d.getHours().zf(2);
                case "hh":
                    return ((h = d.getHours() % 12) ? h : 12).zf(2);
                case "mm":
                    return d.getMinutes().zf(2);
                case "ss":
                    return d.getSeconds().zf(2);
                case "a/p":
                    return d.getHours() < 12 ? "오전" : "오후";
                default:
                    return $1;
            }
        });
    };
};

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () { },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP
                       ? this
                       : oThis,
                       aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        if (this.prototype) {
            // Function.prototype doesn't have a prototype property
            fNOP.prototype = this.prototype;
        }
        fBound.prototype = new fNOP();

        return fBound;
    };
}

/*
*
*/
//function sendXMLHttpRequest(method, options) {
//    var xhr = new XMLHttpRequest(),
//        params = options.params !== undefined ? $.param(options.params) : '',
//        url = method === 'GET' ? options.url + '?' + params : options.url;

//    //utils.log('url : ' + url);

//    xhr.open(method, url, false);
//    xhr.onload = function(e) {
//        var res = JSON.parse(xhr.responseText);
//        options.callback && options.callback(res);
//    };

//    if(method === 'POST') {
//        if(params !== '') {
//            xhr.send(params);
//        } else {
//            xhr.send();
//        }
//    } else {
//        xhr.send();
//    }
//}

// ajax configuration.
//$.ajaxSetup({ cache: false, timeout: 30000 });
$.ajaxSetup({ cache: false });
$.support.cors = true;

//utils.log('browser version : ' + parseInt(utils.browser.version, 10));

$.ajaxPrefilter(function (options, originalOptions, jqXHR) {

    utils.log('%%% url : ' + options.url);
    utils.log('%% type : ' + options.dataType);

    if (utils.browser && utils.browser.msie == true && parseInt(utils.browser.version, 10) <= 9) {

        // TODO : Proxy url 도메인이 포함된 셋팅.
        // TODO : 자기 도메인 프록시 필터.
        var proxyUrl = '/api/proxy',
            deviceType = utils.config('deviceType'),
            proxyDomain = (deviceType == DEVICE_TYPE.pc ? utils.config('webPcPath') : utils.config('webMobilePath'));

        utils.log('proxyDomain : ' + proxyDomain);
        utils.log('location.host : ' + location.host);
        utils.log('options.dataType : ' + options.dataType);
        utils.log(proxyDomain.indexOf(location.host));

        if (options.dataType != 'script' && options.dataType != 'jsonp' && options.url.indexOf(proxyUrl) == -1) {

            utils.log('##-------------------- ajaxPrefilter start type : ' + options.type);

            if (options.type == 'POST') {

                utils.log('##-------------------- ajaxPrefilter : POST');

                // only proxy those requests
                // that are marked as crossDomain requests.
                if (!options.crossDomain) {
                    return;
                }

                var url = encodeURIComponent(options.url),
                    jsonData = $.deparam(options.data);

                options.url = proxyDomain + proxyUrl + '?url=' + url;
                options.crossDomain = false;
                options.data = 'json=' + encodeURIComponent(utils.stringify(jsonData));

                return;
            }

            if (options.type == 'GET' && proxyDomain.indexOf(location.host) == -1) {

                utils.log('##-------------------- ajaxPrefilter : get');

                var url = options.url;
                //utils.log(options.data);

                if (options.data) {
                    url += '?' + (typeof options.data == 'string' ? options.data : $.param(options.data));
                }


                var jsonpOptions = {
                    url: url,
                    success: options.success
                };

                utils.getJsonp(jsonpOptions);
                jqXHR.abort();
            }
        }
    }
});


(function (deparam) {
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        var jquery = require('jquery');
        module.exports = deparam(jquery);
    } else if (typeof define === 'function' && define.amd) {
        define(['jquery'], function (jquery) {
            return deparam(jquery);
        });
    } else {
        var global
        try {
            global = (false || eval)('this'); // best cross-browser way to determine global for < ES5
        } catch (e) {
            global = window; // fails only if browser (https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives)
        }
        global.deparam = deparam(jQuery); // assume jQuery is in global namespace
    }
})(function ($) {
    var deparam = function (params, coerce) {
        var obj = {},
        coerce_types = { 'true': !0, 'false': !1, 'null': null };

        // Iterate over all name=value pairs.
        $.each(params.replace(/\+/g, ' ').split('&'), function (j, v) {
            var param = v.split('='),
            key = decodeURIComponent(param[0]),
            val,
            cur = obj,
            i = 0,

            // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
            // into its component parts.
            keys = key.split(']['),
            keys_last = keys.length - 1;

            // If the first keys part contains [ and the last ends with ], then []
            // are correctly balanced.
            if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) {
                // Remove the trailing ] from the last keys part.
                keys[keys_last] = keys[keys_last].replace(/\]$/, '');

                // Split first keys part into two parts on the [ and add them back onto
                // the beginning of the keys array.
                keys = keys.shift().split('[').concat(keys);

                keys_last = keys.length - 1;
            } else {
                // Basic 'foo' style key.
                keys_last = 0;
            }

            // Are we dealing with a name=value pair, or just a name?
            if (param.length === 2) {
                val = decodeURIComponent(param[1]);

                // Coerce values.
                if (coerce) {
                    val = val && !isNaN(val) && ((+val + '') === val) ? +val        // number
                    : val === 'undefined' ? undefined         // undefined
                    : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
                    : val;                                                          // string
                }

                if (keys_last) {
                    // Complex key, build deep object structure based on a few rules:
                    // * The 'cur' pointer starts at the object top-level.
                    // * [] = array push (n is set to array length), [n] = array if n is
                    //   numeric, otherwise object.
                    // * If at the last keys part, set the value.
                    // * For each keys part, if the current level is undefined create an
                    //   object or array based on the type of the next keys part.
                    // * Move the 'cur' pointer to the next level.
                    // * Rinse & repeat.
                    for (; i <= keys_last; i++) {
                        key = keys[i] === '' ? cur.length : keys[i];
                        cur = cur[key] = i < keys_last
                        ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : [])
                        : val;
                    }

                } else {
                    // Simple key, even simpler rules, since only scalars and shallow
                    // arrays are allowed.

                    if ($.isArray(obj[key])) {
                        // val is already an array, so push on the next value.
                        obj[key].push(val);

                    } else if ({}.hasOwnProperty.call(obj, key)) {
                        // val isn't an array, but since a second value has been specified,
                        // convert val into an array.
                        obj[key] = [obj[key], val];

                    } else {
                        // val is a scalar.
                        obj[key] = val;
                    }
                }

            } else if (key) {
                // No value was defined, so set something meaningful.
                obj[key] = coerce
                ? undefined
                : '';
            }
        });

        return obj;
    };
    $.fn.deparam = $.deparam = deparam;
    return deparam;
});

// App용 비디오태그 멈춤 함수
function WebViewDisappeared() {
    $("video").each(function () { this.pause() });
}
