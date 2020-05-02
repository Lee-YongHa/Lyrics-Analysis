(function ($, window, document) {
    document.domain = 'joins.com';

    var noImage = utils.config('imagePath') + '/pc/article/v_noimg_60x60.png';
    var reporterDataUrl = utils.config('staticPath') + '/scripts/data/reporter.info.js';

    $.fn.comment = function (options) {
        //set css
        var comment_cssUrl = ['https://static.joins.com/joongang_15re/styles/pc/article_cmt.css'];

        var joinsLogin_url = {
        	pc: 'https://my.joins.com/login/login.asp',
            mobile: 'https://my.joins.com/login/login_mobile_web_type2.asp'
        };

        var snsLogin_url = {
            Facebook: '/sns/login?snstype=facebook',
            Twitter: '/sns/login?snstype=twitter'
        };

        var SNSPOST_URL = {
            facebook: '/sns/share?snstype=facebook', 
            twitter: '/sns/share?snstype=twitter'
        };

        var web_paths = {
            pc: utils.config('webPcPath'),
            mobile: utils.config('webMobilePath')
        };

        var reffer_url = {
            article: 'joongang.joins.com/article',
            reporter: 'joongang.joins.com/reporter',
            jtbc: 'joongang.joins.com/jtbc',
            jpod: 'joongang.joins.com/jpod'
        };

        var isShare = false, // sns 공유 선택 여부
            isLogin = false, // 로그인 상태 여부
            isWrite = true; // 글을 등록할 수 있는지 여부

        var apiPath = utils.config('apiPath'),
            webPath = '';

        var per_page = 10;

        var totalId = utils.getTotalId();

        var defaults = {
            id: '',
            language: 'ko',
            page: 'article',
            user: {},
            currentPage: 1,
            perPage: per_page,
            enabledPaste: false,
            enabledCopy: false,
            enabledDrag: false,
            enabledSort: true,
            sortType: 'new', //new, good, bad
            referUrl: ''
        },
        snsList = [{
            id: '1',
            url: web_paths.pc + '/comment/',
            cls: 'i_js',
            code: 'joins',
            name: '조인스',
            nameEN: 'Joins',
            target: '_self',
            loginUrl: ''
        }, {
            id: '2',
            url: 'https://www.facebook.com/app_scoped_user_id/',
            cls: 'i_fb',
            code: 'facebook',
            name: '페이스북',
            nameEN: 'Facebook',
            target: '_self',
            loginUrl: snsLogin_url.Facebook
        }, {
            id: '3',
            url: 'https://twitter.com/intent/user?user_id=',
            cls: 'i_tw',
            code: 'twitter',
            name: '트위터',
            nameEN: 'Twitter',
            target: '_self',
            loginUrl: snsLogin_url.Twitter
        }, {
        	id: '4',
        	url: web_paths.pc + '/comment/',
        	cls: 'i_kk',
        	code: 'kakao',
        	name: '카카오',
        	nameEN: 'KaKao',
        	target: '_self',
        	loginUrl: ''
        }],
        config = $.extend(true, defaults, options),
        userInfo = null,
        $container = this,
        commentLanguage = window.commentLanguage[config.language],
        commentHtml = window.commentHtml(config.lang),
        commentDatas = { displayCount : 0, Count : 0, List: [] },
        reporterCookieName = 'reporterInfo';

        var $head = null,
            $body = null,
            $foot = null;

        var listDirective = {
            //'nick_img': {
            //    userSnsLink: {
            //        href: function () {
            //            var url = '',
            //                id = this.userSnsLink.UserId;

            //            for (var i = 0,
            //                    len = snsList.length; i < len; i++) {
            //                if (snsList[i].nameEN === this.userSnsLink.UserLoginType) {
            //                    url = snsList[i].url;
            //                }
            //            }

            //            return url !== '' ? url + id : '';
            //        }
            //    },
            //    profile: {
            //        src: function () {
            //            var src = '';

            //            if (this.profile.IsReporter === true || this.profile.IsJplusJouralist === true) {
            //                if (this.profile.ReporterProfile === undefined) {
            //                    src = noImage;
            //                } else {
            //                    src = this.profile.ReporterProfile;
            //                }
            //            } else if (this.profile.UserImage !== '') {
            //                src = this.profile.UserImage//.replace('http:', 'https:');
            //            } else {
            //                src = noImage;
            //            }

            //            return src;
            //        },
            //        alt: function () {
            //            return this.profile.UserId;
            //        }
            //    }
            //},
            'cmt_area': {
                'cmt_info': {
                    mg: {
                        html: function () {
                            var $ele = $(arguments[0].element),
                                cls = '',
                                commentListUrl = '',
                                target = '_self',
                                userName = '';

                            if (this.mg.UserLoginType === 'Joins' && this.mg.IsReporter === true) {
                                userName = this.mg.UserName + ' ' + commentLanguage.isReporter;
                            } else if (this.mg.UserLoginType === 'Joins' && this.mg.IsJplusJouralist === true) {
                                userName = this.mg.UserName;
                            } else {
                                userName = this.mg.UserId;
                            }

                            if (this.mg.UserLoginType !== 'Joins' && this.mg.IsReporter !== true) {
                                userName = this.mg.UserName;
                            }

                            if (this.mg.IsReporter !== true) {
                            	if (userName.length > 4) {
                            		userName = userName.substring(0, 4) + "****";
                            	} else {
                            		var len = userName.length / 2;
                            		userName = userName.substring(0, len) + "****";
                            	}
                            }

                            for (var i = 0, len = snsList.length; i < len; i++) {
                                if (snsList[i].nameEN === this.mg.UserLoginType) {

                                	cls = snsList[i].cls;
                                    target = snsList[i].target;

                                    if (this.mg.UserLoginType === 'Joins' && this.mg.IsReporter) {
                                        commentListUrl = '/reporter/' + this.mg.ReporterId;
                                    } else {
                                        commentListUrl = snsList[i].url + this.mg.UserId;
                                    }
                                }
                            }

                            if (cls !== '') {
                                $ele.addClass(cls);
                            }

                        	//return '<a href="' + commentListUrl + '" target="' + target + '">' + userName + '</a>';
                            return userName;
                        }
                    },
                    'btn_report': {
                        html: function () {
                            var $ele = $(arguments[0].element);
                            if (isLogin === true && userInfo.id === this.mg.UserId || this.mg.IsDelete === 'D' || this.mg.IsDelete === 'N') {
                                $ele.hide();
                            }
                            $ele.attr('data-reportid', this.btn_report.Id);
                        }
                    },
                    'btn_reply': {
                        html : function() {
                            var $ele = $(arguments[0].element);

                            if (this.mg.IsDelete === 'D' || this.mg.IsDelete === 'N') {
                                $ele.hide();
                            }
                        }
                    },
                    date: {
                        html: function () {
                            return this.mg.RegistedDateTime && this.mg.RegistedDateTime.toDateISO8061().format('yyyy-MM-dd HH:mm:ss');
                        }
                    },
                    content: {
                        html: function () {
                            var $ele = $(arguments[0].element),
                                content = this.mg.Content,
                                deletButton = ' <a class="btn_delete" href="#" data-deleteid="' + this.mg.Id + '" data-targetid="' + (config.page === 'article' ? this.mg.TotalId : this.mg.ReporterId) + '">삭제</a>';

                            content = utils.strip(content) || '';

                            if (isLogin === true && userInfo.id === this.mg.UserId) {
                                content = content + deletButton;
                            }
                            if (this.mg.IsDelete === 'D' || this.mg.IsDelete === 'N') {
                                $ele.addClass('del');
                                content = content = this.mg.IsDelete === 'D' ? commentLanguage.removeMessageUser : commentLanguage.removeMessageAdmin;
                            } else {
                                $ele.removeClass('del');
                            }

                            return content + ' ';
                        }
                    }
                },
                'btn_recomm': {
                    good: {
                        text: function () {
                            var $ele = $(arguments[0].element);

                            if (isLogin === true && userInfo.id === this.good.UserId || this.good.IsDelete === 'D' || this.good.IsDelete === 'N') {
                                $ele.parent().addClass('not disable');
                            }

                            $ele.parent().attr('data-voiteid', this.good.Id);
                            return this.good.GoodCount;
                        }
                    },
                    bad: {
                        text: function () {
                            var $ele = $(arguments[0].element);

                            if (isLogin === true && userInfo.id === this.bad.UserId || this.bad.IsDelete === 'D' || this.bad.IsDelete === 'N') {
                                $ele.parent().addClass('not disable');
                            }

                            $ele.parent().attr('data-voiteid', this.bad.Id);
                            return this.bad.BadCount;
                        }
                    }
                }
            }
        };

        //load css
        (function () {
            $.when.apply($,
                $.map(comment_cssUrl, function (url) {
                    url += '?' + new Date().getTime();

                    return $('<link>', { rel: 'stylesheet', type: 'text/css', 'href': url }).appendTo('head');
                })
            ).then(function () {
                var reporterInfo = utils.getCookie(reporterCookieName),
                    rInfos = {};

                userInfo = commentUserInfo.getInfo();
                isLogin = commentUserInfo.isLogin();
                webPath = web_paths.pc;

                if (reporterInfo !== null) {

                    reporterInfo = reporterInfo.split('&');

                    for (var i = 0,len = reporterInfo.length; i < len; i++) {
                        var minfo = reporterInfo[i].split('='),
                            key = minfo[0],
                            value = minfo[1];

                        if (key === 'REP_NAME') {
                            value = decodeURIComponent(value);
                        }

                        if (key === 'REP_VIEW_IMG') {
                            value = decodeURIComponent(value);
                        }

                        rInfos[key] = value;
                    }

                    if (rInfos.JOINS_ID === userInfo.id) { //기자이다!

                        userInfo.profileImage = rInfos.REP_VIEW_IMG;
                        userInfo.reporterSEQ = rInfos.REP_SEQ;

                    } else {
                        //remove cookie
                        utils.removeCookie(reporterCookieName, COOKIE_CONDITION.path, COOKIE_CONDITION.domain);
                    }
                } else {
                    if (isLogin === true) {
                        getReporterList(function () { //기자정보 서치
                            rInfos = fnGetRepoterInfoByJoinsId(userInfo.id);
                            //rInfos = fnGetRepoterInfoByJoinsId('choyg94');//test

                            if (rInfos !== null) {
                                userInfo.profileImage = rInfos.REP_VIEW_IMG;
                                userInfo.reporterSEQ = rInfos.REP_SEQ;

                                utils.setCookie('reporterInfo', $.param(rInfos), 1, COOKIE_CONDITION.path, COOKIE_CONDITION.domain);
                            }
                        });
                    }
                }

                init();

            });
        })();

        function userLogin(type, device) {
            var url = '',
                currentUrl = location.href,
                returnPath = utils.config('webPcPath');

            if (type === 'joins' || type === 'kakao' || type === 'facebook' || type === 'twitter') {
                url = joinsLogin_url[device] + '?targeturl=' + encodeURIComponent(location.href);
                location.href = url;
            } else {
                url = returnPath + '/sns/login?snstype=' + type;
                window.open(url, '_blank');
            }
        }

        function loginFirst() {
			$container.find('.comment_form').find('.select_sns').find('a:first').focus();
            if (confirm(commentLanguage.errorLoginCmt)) {
                userLogin('joins', 'pc');
            }
			return false;
        }

        function emptyComment($t) {
            alert(commentLanguage.errorEmptyContent);
            $t.focus();
        }

        function commentVotePost(obj) {
            utils.ajaxPost({
                url: apiPath + '/comment/' + obj.id + '/' + obj.type + '/' + utils.getCookie('PCID'),
                success: function (res) {
                    obj.callback && obj.callback(res);
                }
            });
        }

        function commentReportPost(obj) {
            utils.ajaxPost({
                url: apiPath + '/comment/' + obj.id + '/report',
                success: function (res) {
                    if (res.IsSuccess) {
                        alert(commentLanguage.reportTrue);
                        obj.callback && obj.callback();
                    } else {
                        alert(commentLanguage.reportFail);
                    }
                }
            });
        }

        function commentDeletePost(obj) {
            var params = {};

            if (config.page === 'article') {
                params.TotalId = obj.totalid;
            }

            if (config.page === 'reporter') {
                params.ReporterId = obj.reporterid;
            }
            if (config.page === 'jpod') {
            	params.TotalId = obj.id;
            }

            params.Id = obj.id;

            utils.ajaxPost({
                url: apiPath + '/comment/' + obj.id + '/delete',
                data: params,
                success: function (resData) {
                    obj.callback && obj.callback(resData);
                }
            });
        }

        function sendSNS(obj) {
            var type = userInfo.type.toLowerCase(),
                loc = location.href,
                url = webPath + SNSPOST_URL[type];

            if (type === 'facebook') {
                url = url + '&msg=' + obj.message + '&url=' + loc;
                window.open(encodeURI(url), 'share_facebook', 'directories=no,location=no,menubar=no,status=no,toolbar=no,scrollbars=no,resizable=no,width=640,height=440');
            } else if (type === 'twitter') {
                url = url + '&msg=' + obj.message + ' ' + loc;
                window.open(encodeURI(url), 'share_twitter', 'width=640, height=440');
            }
        }

        function moreList() {
            getCommentList({
                currentPage: config.currentPage,
                perPage: config.perPage,
                callback: function (datas) {

                    updateCommentDatas(datas, false);

                    renderHeader($head, commentDatas);
                    renderList($body, commentDatas);
                    renderFoot($foot, commentDatas);

                    $(window).trigger('resize_layout');
                }
            });
        }

        function reRenderAll() {
        	// data 없을 시
        	renderHeader($head, commentDatas);
        	renderForm($body);
        	renderSort($body, commentDatas);
        	renderList($body);
        	renderFoot($foot, commentDatas);

            getCommentList({
                currentPage: config.currentPage,
                perPage: config.perPage,
                callback: function (datas) {
                    updateCommentDatas(datas, true);

                    renderHeader($head, commentDatas);
                    renderForm($body);
                    renderSort($body, commentDatas);
                    renderList($body, commentDatas);
                    renderFoot($foot, commentDatas);

                    if ($('.share_article').length > 0 && $('.share_article').find('.text_comment').length > 0) {
                        $('.share_article').find('.text_comment').find('.mg').html(commentDatas.displayCount);
                    }
                }
            });
        }

        function submitComment(obj) {
            var params = {
                ParentId: obj.seq,
                Content: obj.content.replace(/<[^>]*>/g, ' '),
                UserId: userInfo.id,
                UserName: userInfo.name,
                UserImage: userInfo.profileImage,
                UserLoginType: userInfo.type,
                GroupId: 0,
                UsedCache: false,
                ReferUrl: config.referUrl
            };

            if (config.page === 'article') {
                params.TotalId = config.id;
            }

            if (config.page === 'reporter') {
                params.ReporterId = config.id;
            }

            if (config.page === 'jpod') {
            	params.TotalId = config.id;
            }

            utils.ajaxPost({
                url: apiPath + '/comment',
                data: params,
                success: function (res) {
                    var errorText = '';
                    if (res.IsSuccess == true) {
                        alert(commentLanguage.success);
                    } else {
                        switch(res.Code) {
                            case 'BadIp':
                                errorText = commentLanguage.errorBadIp;
                                break;
                            case 'BadWord':
                                errorText = res.Target + commentLanguage.errorBadWord;
                                break;
                            case 'BadUserId':
                                errorText = res.Target + commentLanguage.errorBadUser;
                                break;
                            default:
                                errorText = commentLanguage.fail;
                        }
                        alert(errorText);
                    }

                    if (isShare === true) {
                        sendSNS({ message: obj.content });
                    }

                    obj.callback && obj.callback(res);

                    isWrite = false;

                    setTimeout(function () {
                        isWrite = true;
                    }, 60000);
                }
            });
        }

        function getReporterList(callback) {
            $.getScript(reporterDataUrl, function () {
                try {
                    callback && callback();
                } catch (e) {

                }
            });
        }

        function getCommentList(obj) {
            var url = '';
            if (config.page === 'jtbc' || config.page === 'event') {
                url = apiPath + '/event/comment';
            } 
            else {
                url = apiPath + '/' + config.page + '/' + config.id + '/comment';
            }

            var params = {
                page: obj.currentPage || config.currentPage,
                pagesize: obj.perPage || config.perPage,
                sort: config.sortType,
                UsedCache: false,
                referurl: config.referUrl
            };

            if (config.page !== 'jtbc') { params.UserId = userInfo.id; }

            utils.getJsonp({
                url: url,
                data: params,
                success: function (res) {
                    obj.callback && obj.callback(res);
                }
            });
        }

        function renderHeader($el, d) {
            var directive = {
                'subtit_comm': {
                        html: function () {
                            return commentLanguage.totalCount + '<span>' + (this.subtit_comm === undefined ? 0 : this.subtit_comm) + '</span>';
                        }
                    }
                },
                html = commentHtml.getHtml('head'),
                data = {
                    subtit_comm: d.displayCount
                };

            if ($el.find('.subtit_comm').length === 0) {
                $el.html(html);
            }

            $el.render(data, directive);

            $("#cmt_total_count").text(commentDatas.displayCount);
        }

        // 댓글 입력 폼
        function renderForm($el) {
            var directive = {
                'select_sns': {
                    list: {
                        item: {
                            html: function () {
                                var $ele = $(arguments[0].element),
                                    active = '',
                                    loginUrl = webPath + this.loginUrl,
                                    target = '_blank';

                                $ele.addClass(this.cls);

                                active = isLogin === true && userInfo.type.toLowerCase() === this.code ? 'on' : '';

                                if (this.code === 'joins' || this.code === 'kakao') {
                                    loginUrl = joinsLogin_url.pc;
                                    target = '_self';
                                }

                                return '<a href="' + loginUrl + '" class="snsLogin ' + active + '" data-code="' + this.code + '" data-id="' + this.id + '" target="' + target + '">' + this.name + '</a>';
                            }
                        }
                    },
                    'sns_cmt': {
                        html: function () {
                            var $ele = $(arguments[0].element);

                            $ele.toggle(!isLogin);

                            return commentLanguage.messageLogin;
                        }
                    },
                    'sns_cmt_fb': {
                        html: function () {

                            var html = '<input type="checkbox" id="sns_fb" class="' + (isShare ? ' checked' : '') + '" ' + (isShare ? 'checked' : '') + '><label for="sns_fb" class="mg"></label>',
                                directive = {
                                    mg: {
                                        html: function () {
                                            return '<span class="icon"></span>' + this.mg.type + commentLanguage.shareSNS;
                                        }
                                    }
                                },
                                data = {
                                    mg: userInfo
                                },
                                $ele = $(arguments[0].element);

                            $ele.toggle(isLogin);

                            if (userInfo.type !== 'joins' && userInfo.type !== 'kakao' && userInfo.type !== 'twitter' && userInfo.type !== 'facebook') {
                                return $('<div></div>').wrapInner(html).render(data, directive).html();
                            }
                        }
                    }
                },
                'logout_area': {
                    'btn_logout': {
                        html: function () {
                            var $ele = $(arguments[0].element);

                            $ele.parent().toggle(isLogin);

                            return commentLanguage.btnLogout;
                        }
                    }
                },
                'fieldset': {
                    'class': function () {
                        var $ele = $(arguments[0].element),
                            cls = $ele.attr('class');

                        return isLogin === true ? cls + ' comment_login' : cls;
                    },
                    //'nick_img': {
                    //    profile: {
                    //        html: function () {
                    //            var $ele = $(arguments[0].element);
                    //            var imageUrl = this.profile.profileImage !== '' && this.profile.profileImage !== undefined ? this.profile.profileImage : noImage;
								
                    //            $ele.toggle(isLogin);

                    //            return '<img src="' + imageUrl.replace('http:', 'https:') + '" onerror="' + noImage + '"><span class="frame">';
                    //        }
                    //    }
                    //},
                    content: function () {
                        var text = isLogin === true ? '' : commentLanguage.placeholder;

                        $form.find('.fieldset').find('.content').empty().val(text);
                    }
                }
            },
                html = commentHtml.getHtml('form'),
                data = {
                    'select_sns': {
                        list: snsList
                    },
                    'logout_area': {
                        'btn_logout': isLogin
                    },
                    'fieldset': {
                        //'nick_img': {
                        //    profile: userInfo
                        //}
                    }
                },
                $form = $el.find('.comment_form');

            if ($form.find('.select_sns').length === 0) {
                $form.html(html);
            }

            $form.render(data, directive);
        }

        function renderSort($el, d) {
            var directive = {
                list: {
                    item: {
                        html: function () {
                            var $ele = $(arguments[0].element);

                            $ele.attr('data-sorttype', this.code);

                            if (this.code === config.sortType) {
                                $ele.addClass('on');
                            } else {
                                $ele.removeClass('on');
                            }

                            return '<a href="#">' + commentLanguage[this.text] + '</a>';
                        }
                    }
                }
            },
                html = commentHtml.getHtml('sort'),
                data = {
                    list: [
                        {
                            code: 'new',
                            text: 'sortNew'
                        }, {
                            code: 'like',
                            text: 'sortGood'
                        }, {
                            code: 'bad',
                            text: 'sortBad'
                        }
                    ]
                },
                $sort = $el.find('.list_sort');

            if ($sort.find('ul[data-bind="list"]').length === 0) {
                $sort.html(html);
            }

            if (commentDatas.List.length === 0) {
                $sort.hide();
            } else {
                $sort.show();
            }

            $sort.render(data, directive);
        }

        // 댓글 리스트
        function renderList($el) {

            var html = commentHtml.getHtml('list'),
                cardHtml = commentHtml.getHtml('card'),
                $commentListWrap = $el.find('.comment_list'),
                cDatas = [],
                rDatas = [];

            if (commentDatas.List.length > 0) {

                $.each(commentDatas.List, function (i, v) {
                    if (IsActiveComment(v, commentDatas.List)){
                        if (v.ParentId === v.Id)  {
                            cDatas.push(v);
                        } else  {
                            rDatas.push(v);
                        }
                    }
                });
                if ($commentListWrap.find('.list').length === 0) {
                    $commentListWrap.html(html);
                }
                $commentListWrap.render({ list: cDatas });

                $commentListWrap.find('.item').each(function (i) {
                    var html = $.renderTemplate({
                        data: {
                            //'nick_img': { 'userSnsLink': cDatas[i], 'profile': cDatas[i] },
                            'cmt_area': {
                                'cmt_info': { 'mg': cDatas[i], 'btn_report': cDatas[i] },
                                'btn_recomm': { 'good': cDatas[i], 'bad': cDatas[i] }
                            }
                        },
                        directives: listDirective,
                        template: cardHtml
                    });

                    $(this).attr('data-commentid', cDatas[i].Id).html(html).find('form.reply').attr('data-seq', cDatas[i].ParentId);

                    if (isLogin) {
                        $(this).find('textarea').text('');
                    }
                });

                renderReply($commentListWrap, rDatas);
            }
        }
        function IsActiveComment(comment, commentList) {
            if (comment.IsDelete != 'D') { return true; }
            else {
                for (var i = 0; i < commentList.length; i++) {
                    if (commentList[i].Id == comment.Id) continue;
                    if ((comment.Id == commentList[i].ParentId) && (commentList[i].IsDelete == 'A')) {
                        return true;
                    }
                }
                return false;
           }
        }
        function renderReply($el, d) {
            if (d.length === 0) {
                return;
            }

            var replyHtml = commentHtml.getHtml('reply');

            $.each(d, function (i, v) {
                var html = $.renderTemplate({
                    data: {
                        //'nick_img': { 'userSnsLink': d[i], 'profile': d[i] },
                        'cmt_area': {
                            'cmt_info': { 'mg': d[i], 'btn_report': d[i] },
                            'btn_recomm': { 'good': d[i], 'bad': d[i] }
                        }
                    },
                    directives: listDirective,
                    template: replyHtml
                });

                var $target = $el.find('.item[data-commentid="' + d[i].ParentId + '"]');

                if ($target.find('.reply_area').length === 0) {

                    $target.append('<div class="reply_area"><ul></ul></div>');

                }
                $target.find('.reply_area ul').append(html);
            });
        }

        function renderFoot($el, d) {
            var directive = {
                mg: {
                    html: function () {
                        var $ele = $(arguments[0].element);
                        if (this.mg.Count > 0 && this.mg.Count > config.currentPage * config.perPage) {
                            $ele.parent().show();

                            return commentLanguage.totalCountPaging + ' <span class="icon"></span>';
                        } else {
                            $ele.parent().hide();
                        }
                    }
                }
            },
                html = commentHtml.getHtml('foot'),
                data = { mg: d };

            if ($el.find('>a').length == 0) {
                $el.html(html);
            }

            $el.render(data, directive);
        }

        function init() {
            var html = '<div class="hd"></div>' +
                '<div class="bd">' +
                '<div class="comment_form"></div>' +
                '<div class="mg list_sort"></div>' +
                '<div class="comment_list"></div>' +
                '</div>' +
                '<div class="ft"></div>';

            $container.html(html);

            try {
                config.referUrl = config.referUrl !== '' ? config.referUrl : reffer_url[config.page];
            } catch (e) { alert('잘못된 호출입니다.'); }

            $head = $container.find('.hd');
            $body = $container.find('.bd');
            $foot = $container.find('.ft');

            //처음 무조건 그리기~~
            renderHeader($head, commentDatas);
            renderForm($body);
            renderSort($body, commentDatas);
            renderList($body);
            renderFoot($foot, commentDatas);

            getCommentList({
                callback: function (datas) {
                    //commentDatas = datas;
                    updateCommentDatas(datas, true);

                    renderHeader($head, commentDatas);
                    renderForm($body);
                    renderSort($body, commentDatas);
                    renderList($body);
                    renderFoot($foot, commentDatas);
                }
            });
        }

        function updateCommentDatas(data, isReplace) {

            commentDatas.Count = data.Count;

            if (isReplace) {
                commentDatas.displayCount = data.displayCount;
                commentDatas.List = data.List;
            } else {
                for (var i = 0, len = data.List.length; i < len; i++) {
                    commentDatas.List.push(data.List[i]);
                }
            }
        }

        function insertCommentDatas(obj) {
            if (obj !== undefined) {
                var insertObject = obj.item,
                    parentId = insertObject.ParentId,
                    insertIndex = 0;

                var maxListLength = config.currentPage * per_page;

                commentDatas.Count = commentDatas.Count + 1;
                commentDatas.displayCount = commentDatas.displayCount + 1;

                commentDatas.List.forEach(function (v, i, a) {
                    var listId = v.Id;

                    if (listId === parentId) {
                        insertIndex = i + 1; //부모의 다음 노드에 삽입
                    }
                });

                commentDatas.List.splice(insertIndex, 0, insertObject);

                if(maxListLength < commentDatas.List.length) {
                    commentDatas.List.pop();
                }
            }
        }

        function reSetPageValue() {
            config.currentPage = 1;
            config.perPage = per_page;
        }

        return this.each(function () {
            //button events
            $container.on('click', '.btn_logout', function () {

                window.userInfo.logout();
                window.commentUserInfo.logout();
			if (window.layout)
                window.layout.logout();

                isLogin = window.userInfo.isLogin();

                reSetPageValue();

                reRenderAll();

                return false;
            }).on('click', '.social_comment a', function () {
                $(this).next().toggle();

                return false;
            }).on('click', '.btn_reply', function () {
                $(this).closest('.cmt_area').next().toggle();

                return false;
            }).on('click', '#sns_fb', function () {
                var $checkbox = $(this);

                $checkbox.toggleClass('checked');

                if ($checkbox.is(':checked')) {
                    isShare = true;
                } else {
                    isShare = false;
                }

            }).on('click', '.btn_recomm .up', function () {
                var $up = $(this),
                    voiteid = $up.data('voiteid');

                if ($up.hasClass('not') === false) {

                    commentVotePost({
                        type: 'like',
                        id: voiteid,
                        callback: function (res) {
                            var code = res.Code;

                            if (res.IsSuccess) {
                                //alert(commentLanguage.voteMessage);
                                var goodCount = parseInt($up.find('.good').text(), 10);
                                $up.addClass('on').find('.good').html(goodCount + 1);

                                //update data
                                var updateData = commentDatas.List.filter(function (v) {
                                    return v.Id === voiteid;
                                })[0];

                                updateData.GoodCount = updateData.GoodCount + 1;
                            } else {

                                switch (code) {
                                    case 'Duplicated':
                                        msg = '중복된 참여입니다.';
                                        break;
                                    case 'NotPeriod':
                                        msg = '투표 참여기간이 아닙니다.';
                                        break;
                                    default:
                                        msg = '데이타 처리에 문제가 발생하였습니다.';
                                        break;
                                }
                                alert(msg);
                            }
                        }
                    });
                }

                return false;
            }).on('click', '.btn_recomm .down', function () {
                var $down = $(this),
                    voiteid = $down.data('voiteid');

                if ($down.hasClass('not') === false) {

                    commentVotePost({
                        type: 'hate',
                        id: voiteid,
                        callback: function (res) {
                            var code = res.Code;

                            if (res.IsSuccess) {
                                //alert(commentLanguage.voteMessage);
                                var badCount = parseInt($down.find('.bad').text(), 10);
                                $down.addClass('on').find('.bad').html(badCount + 1);

                                //update data
                                var updateData = commentDatas.List.filter(function (v) {
                                    return v.Id === voiteid;
                                })[0];

                                updateData.BadCount = updateData.BadCount + 1;

                            } else {

                                switch (code) {
                                    case 'Duplicated':
                                        msg = '중복된 참여입니다.';
                                        break;
                                    case 'NotPeriod':
                                        msg = '투표 참여기간이 아닙니다.';
                                        break;
                                    default:
                                        msg = '데이타 처리에 문제가 발생하였습니다.';
                                        break;
                                }
                                alert(msg);
                            }
                        }
                    });
                }

                return false;
            }).on('click', '.btn_report', function () {
                var $report = $(this);

                var result = confirm(commentLanguage.reportMessage);

                if (result === true) {
                    commentReportPost({ id: $report.data('reportid') });
                    $report.addClass('on');
                }

                return false;
            }).on('click', '.btn_delete', function () {
                var $delete = $(this),
                    deleteId = $delete.data('deleteid');

                var opts = {
                    id: deleteId,
                    callback: function (resData) {
                        alert(commentLanguage.deleteComment);

                        commentDatas.displayCount = commentDatas.displayCount - 1; //실제 카운트 하나 삭제
                        commentDatas.List.forEach(function (v, i, a) {
                            var listId = v.Id;

                            if(listId === deleteId) { //삭제된 데이터
                                v.IsDelete = 'D';
                            }

                        });

                        renderHeader($head, commentDatas);
                        renderList($body);
                    }
                };

                if (config.page === 'article') {
                    opts.totalid = $delete.data('targetid');
                }

                if (config.page === 'reporter') {
                    opts.reporterid = $delete.data('targetid');
                }

                commentDeletePost(opts);

                return false;
            });

            //textarea events
            $container.on('keyup', 'textarea', function () {
                var $textarea = $(this),
                    value = $textarea.val(),
                    $count = $textarea.closest('.comment_form').find('.count'),
                    maxLength = parseInt($textarea.attr('maxlength'), 10);

                value = value.replace(/\r(?!\n)|\n(?!\r)/g, '\r\n'); //브라우저별 개행문자 크기 인식다름(IE,크롬:2byte, Firefox:1byte). 모두 2byte처리 하도록 변경.. 2015.10.20 지창현
                if (value.length > maxLength) {
                    alert(maxLength + commentLanguage.errorMaxlength);

                    value = value.substring(0, maxLength);
                    $textarea.val(value);
                    return false;
                }

                $count.text(value.length + '/' + maxLength);

            }).on('focus', 'textarea', function (e) {
                var $textarea = $(this),
                    value = $textarea.val(),
                    placeholder = $textarea.data('placeholder');

                if (isLogin === false) {
                    loginFirst();
                }

            }).on('blur', 'textarea', function (e) {
                var $textarea = $(this),
                    value = $textarea.val(),
                    placeholder = $textarea.data('placeholder');

                if (isLogin === false && value === '') {
                    $textarea.val(placeholder);
                }
            });

            if (config.enabledCopy === false) {
                $container.on('copy', 'textarea', function () {
                    alert(commentLanguage.errorCopy);
                    return false;
                });
            }

            if (config.enabledPaste === false) {
                $container.on('paste', 'textarea', function () {

                    alert(commentLanguage.errorPast);
                    return false;
                });
            }

            //form submit events
            $container.on('submit', '#commentForm, .reply', function () {

                var value = '',
                    $form = null,
                    $textarea = null;

                $form = $(this);

                if ($form.find('.btn_submit').hasClass('disable')) {
                    return false;
                }

                if (isLogin === false) {
                    return loginFirst();
                }

                $textarea = $form.find('textarea'),
                    value = $textarea.val();

                if (value.length === 0 || value.replace(/(^\s*)|(\s*$)/g, "").length === 0) {
                    emptyComment($textarea);
                    return false;
                }

                if (isWrite === false) {
                    alert(commentLanguage.errorWrite);
                    return false;
                }

                var seq = $form.data('seq');

                $form.find('.btn_submit').addClass('disable');

                submitComment({
                    seq: seq,
                    content: value,
                    callback: function (resData) {
                    	if (resData.IsSuccess == true) {
                    		if (seq === 0) { //새글 등록
                    			reSetPageValue();
                    			reRenderAll();
                    		} else { // 답글 등록
                    			insertCommentDatas({ item: resData.Item });
                    			renderHeader($head, commentDatas);
                    			renderList($body);
                    			renderFoot($foot, commentDatas);
                    		}
                    	}
                        $form.find('.btn_submit').removeClass('disable');
                    }
                });

				//GA코드 통합의 댓글 등록 이벤트 추가
            	try {
            		ga('send', 'event', 'Engaging', 'Comment', document.title, 1);
            	}
            	catch (e) {
            	}

                return false;
            });

            //sort events
            $container.on('click', '.list_sort a', function () {
                var $sort = $(this).parent(),
                    sortType = $sort.data('sorttype');

                config.sortType = sortType;
                reSetPageValue();

                reRenderAll();

                return false;
            });

            //more events
            $container.find('.ft').on('click', 'a', function () {
                var page = config.currentPage + 1;

                config.currentPage = page;
                moreList();

                return false;
            });

            //sns select login
            $container.on('click', '.snsLogin', function () {
                commentUserInfo.logout(); //cookie remove

                var code = $(this).data('code');

                userLogin(code, 'pc');

                return false;
            });
        });
    };
})(jQuery, window, document);