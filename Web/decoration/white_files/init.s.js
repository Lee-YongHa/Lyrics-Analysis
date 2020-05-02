/**
* init.s.js
* @use : special page에서 사용하는 초기화 스크립트
*/
(function (window, document, $, utils) {
	var p = /([dD]igital[sS]pecial\/)(\d*)/g;
	var matchedGroups = p.exec(location.href);
	var targetData;

	if( matchedGroups != null && matchedGroups[2] > 0) {
		targetData = {"seq":matchedGroups[2]};
	} else {
		targetData = {"url":location.href.split('?')[0]};
	}

	//console.log(targetData);

	utils.getJsonp({
		url: "https://gen.joins.com/joongang/digital_special/digital_special_info_js.asp",
	    data: targetData,
	    success: function(resData){
	        //validation
	        if(resData.usedYN == "Y") {
	        	if (matchedGroups == null || matchedGroups[2] <= 0){
		            if(utils.isMobile() && location.href.split('?')[0] != resData.mobUrl){
						$(location).attr('href', resData.mobUrl);
		                 return false;
		            }
	        	}
	        } else {
	            if (utils.isMobile()) {
	                $(location).attr('href', utils.config("webMobilePath"));
	                return false;
	            }else {
	                $(location).attr('href', utils.config("homePath"));
	                return false;
	            }
	        }

	        //web log
	        try{
	            var adLogSrc;
	            if(utils.isMobile()){
	                adLogSrc = (resData.joinsADTagMob) ? resData.joinsADTagMob : "http://dgate.opap.co.kr/imp/?ssn=566&adsn=7478&cresn=5362";
	            }else{
	                adLogSrc = (resData.joinsADTag) ? resData.joinsADTag : "http://dgate.opap.co.kr/imp/?ssn=566&adsn=7630&cresn=5362";
	            }
	            var googleLogCd = (resData.googleTag) ? resData.googleTag : "UA-40895666-10";
	            
	            //article counter
	            $("body").append(getIframeArticleCounterCheck(resData.seqNo, resData.cdNo, '0', 'JSP', 'r'));
	            //console.log(getIframeArticleCounterCheck(resData.seqNo, resData.cdNo, '0', 'JSP', 'r'));
	            
	            //ad web log (.tag)	
	            //$("body").append("<iframe src='" + adLogSrc + "' style='display:block; visibility:hidden; width:0; height:0;'></iframe>");
				
				if(googleLogCd.indexOf("GTM-") >= 0){
					//Google Tag Manager
					(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
					new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
					j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
					'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
					})(window,document,'script','dataLayer', googleLogCd);
				}else{
					//google web log
					(function (i, s, o, g, r, a, m) {
						i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
							(i[r].q = i[r].q || []).push(arguments)
						}, i[r].l = 1 * new Date(); a = s.createElement(o),
						m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
					})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
					ga('create', googleLogCd, 'auto');
					ga('send', 'pageview');
				}
				//차트비트
//				$("head").append("<link rel='canonical' href='http://news.joins.com/Digitalspecial/" + resData.seqNo + "' />");

	        }catch(err){
	            utils.log(err);
	        }
	    }
	});	
})(window, document, jQuery, utils);	


var _sf_startpt = (new Date()).getTime()
var _sf_async_config = {};
/** CONFIGURATION START **/
_sf_async_config.uid = 62500;
_sf_async_config.domain = 'news.joins.com';
_sf_async_config.useCanonical = true;
_sf_async_config.sections = 'special';
_sf_async_config.authors = 'special';


/** CONFIGURATION END **/
//(function () {
//	   function loadChartbeat() {
//			window._sf_endpt = (new Date()).getTime();
//			var e = document.createElement('script');
//			e.setAttribute('language', 'javascript');
//			e.setAttribute('type', 'text/javascript');
//			e.setAttribute('src', '//static.chartbeat.com/js/chartbeat.js');
//			document.body.appendChild(e);
//	   }
//	   var oldonload = window.onload;
//	   window.onload = (typeof window.onload != 'function') ? loadChartbeat : function () { oldonload(); loadChartbeat(); };
//})();