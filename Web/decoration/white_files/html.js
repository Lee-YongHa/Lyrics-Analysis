(function($, window, document) {
    document.domain = 'joins.com';

    var noImage = utils.config('imagePath') + '/pc/article/v_noimg_60x60.png',
        commentLanguage = window.commentLanguage;

    var commentHtml = function(lang) {
        var lang = 'ko',
            html = {
                'head': '<strong class="subtit_comm"></strong><p><a href="//bbs.joins.com/app/myjoins_policy/163124" target="_blank">' + commentLanguage[lang].standard + '</a></p>',
                'form': '<div class="select_sns clearfx">' +
                    '   <dt class="hide">' + commentLanguage[lang].selectSnsHide + '</dt>' +
                    '   <dl class="clearfx" data-bind="list">' +
                    '       <dd data-bind="item"></dd>' +
                    '   </dl>' +
                    '   <span class="mg sns_cmt"></span>' +
                    '   <div class="sns_cmt_fb"></div>' +
                    '</div>' +
                    '<div class="form_rt">' +
                    '   <span class="logout_area">' +
                    '       <button type="button" class="btn_logout">' + commentLanguage[lang].btnLogout + ' | </button>' +
                    '   </span>' +
                    '   <div class="social_comment">' +
                    '       <a href="#none" class="mg">' + commentLanguage[lang].socialComment + '</a>' +
                    '       <div class="layer_social_comment" style="display: none;">' +
                    '           <dl class="mg">' +
                    '               <dt><strong>' + $.trim(commentLanguage[lang].socialComment) + '</strong></dt>' +
                    '               <dd class="content">' + commentLanguage[lang].layerSocialComment + '</dd>' +
                    '           </dl>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>' +
                    '<form method="post" id="commentForm" data-seq="0">' +
                    '   <fieldset class="fieldset">' +
                    '       <legend class="hide">' + commentLanguage[lang].submitHide + '</legend>' +
                    //'       <span class="nick_img">' +
                    //'           <span class="profile"></span>' +
                    //'       </span>' +
                    '       <div class="cont">' +
                    '           <div class="cont_textarea">' +
                    '               <textarea class="content" name="content" cols="80" rows="10" maxlength="500" data-placeholder="' + commentLanguage[lang].placeholder + '" title="' + commentLanguage[lang].textareaTitle + '">' + commentLanguage[lang].placeholder + '</textarea>' +
                    '           </div>' +
                    '           <span class="count">0/500</span>' +
                    '           <button class="btn_submit mg" type="submit">' + commentLanguage[lang].btnSubmit + '</button>' +
                    '       </div>' +
                    '   </fieldset>' +
                    '</form>',
                'sort': '<ul class="clearfx" data-bind="list"><li data-bind="item"></li></ul>',
                'list': '<ul class="list"><li class="item"></li></ul>',
                'card': '<div class="cmt_wrap">' +
                    //'       <span class="nick_img">' +
                    //'           <a class="userSnsLink"><span class="frame"></span><img class="profile"/></a>' +
					//'           <span class="frame"></span>' +
                    //'           <img class="profile" onerror="this.src=\''+ noImage +'\'" />' +
                    //'       </span>' +
                    '   <div class="cmt_area">' +
                    '       <dl class="cmt_info">' +
                    '           <dt>' +
                    '               <strong class="mg"></strong>' +
                    '               <span class="date"></span>' +
                    '               <a class="btn_report" style="cursor: pointer;">' + commentLanguage[lang].btnReport + '</a>' +
                    '           </dt>' +
                    '           <dd>' +
                    '               <p class="content"></p>' +
                    '               <a class="btn_reply" style="cursor:pointer;">' + commentLanguage[lang].btnReply + '</a>' +
                    '           </dd>' +
                    '       </dl>' +
                    '       <span class="btn_recomm">' +
                    '           <a class="up" style="cursor:pointer;"><span class="hide">' + commentLanguage[lang].btnGood + '</span><em class="good"></em></a>' +
                    '           <a class="down" style="cursor:pointer;"><span class="hide">' + commentLanguage[lang].btnBad + '</span><em class="bad"></em></a>' +
                    '       </span>' +
                    '   </div>' +
                    '   <div class="comment_form" style="display:none">' +
                    '       <form method="post" class="reply">' +
                    '           <fieldset>' +
                    '               <legend class="hide">' + commentLanguage[lang].submitHide + '</legend>' +
                    '                   <div class="cont">' +
                    '                       <div class="cont_textarea">' +
                    '                           <textarea class="content" name="content" cols="80" rows="10" maxlength="500" data-placeholder="' + commentLanguage[lang].placeholder + '" title="' + commentLanguage[lang].textareaTitle + '">' + commentLanguage[lang].placeholder + '</textarea>' +
                    '                       </div>' +
                    '                       <span class="count">0/500</span>' +
                    '                       <button class="btn_submit mg" type="submit">' + commentLanguage[lang].btnSubmit + '</button>' +
                    '                   </div>' +
                    '           </fieldset>' +
                    '       </form>' +
                    '   </div>' +
                    '</div>',
                'reply': '<li><div class="cmt_area">' +
                    '  <dl class="cmt_info">' +
                    '    <dt>' +
                    '      <strong class="mg"></strong>' +
                    '      <span class="date"></span>' +
                    '      <a class="btn_report" href="#" style="cursor: pointer;">' + commentLanguage[lang].btnReport + '</a>' +
                    '    </dt>' +
                    '    <dd>' +
                    '      <p class="content"></p>' +
                    '    </dd>' +
                    '  </dl>' +
                    '  <span class="btn_recomm">' +
                    '      <a class="up" href="#"><span class="hide">' + commentLanguage[lang].btnGood + '</span><em class="good"></em></a>' +
                    '      <a class="down" href="#"><span class="hide">' + commentLanguage[lang].btnBad + '</span><em class="bad"></em></a>' +
                    '  </span>' +
                    '</div></li>',
                'foot': '<a href="#" class="mg"></a>'
            };

        return {
            getHtml: function(name) {
                return html[name];
            }
        };
    };
    window.commentHtml = commentHtml;

})(jQuery, window, document);