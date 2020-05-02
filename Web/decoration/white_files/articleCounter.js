function __request(param)
{
	try {
		var aParams = new Array();
		var sUrlParam = document.location.search.substring(1);
		for(var nIdx=0; nIdx<sUrlParam.split("&").length; nIdx++)
			aParams[sUrlParam.split("&")[nIdx].split("=")[0].toString()] = sUrlParam.split("&")[nIdx].split("=")[1].toString();
		if(aParams[param]){return aParams[param];}else{return "";}
	} catch(e) {
		return "";
	}
}


function __getParams(name, url) {
	if (!url) return
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return results[2].replace(/\+/g, " ");
}


function __getCookieVal(offset)
{
    var endstr = document.cookie.indexOf (";", offset);
    if (endstr == -1) endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}

function __getCookie(name)
{
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen)
    {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg) return __getCookieVal (j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}

function __getCookieA(name1, name2)
{
	var string = __getCookie(name1);
	if(string == null) string="";

	var flag = string.indexOf(name2 +"=");
	if (flag != -1)
	{
		flag += name2.length + 1;
		var end = string.indexOf("&", flag);
		if (end == -1) end = string.length;
		return unescape(string.substring(flag, end));
	}
	else
	{
		return "";
	}
}



function __getIsVod(){
	try{
		return $(".tag_vod").length>0 ? "Y" : "";
	}
	catch(e) {
		return "";
	}
}

function fnArticleCounterCheck(totalID, serviceCode, masterCode, siteType, sGubun, forcedAgent)
{
	var rsCLOC = "0";
	try { rsCLOC = __request("cloc"); } catch(e) {}
	if(typeof(rsCLOC) == "undefined" || rsCLOC == "undefined" || rsCLOC == "") rsCLOC = "0";

	var _dt = joins_device_detect_type1();
	if(typeof(forcedAgent) != "undefined") _dt = forcedAgent;
	var _uv = "0";
	var tmpstr = __getCookie("vFlagJoinsArticle");
	if(tmpstr == null || tmpstr == false || tmpstr == "") tmpstr = ",";
	if(tmpstr.indexOf(","+totalID +",") < 0)
	{
		var today = new Date();
		var expireDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		expireDate.setDate(expireDate.getDate() + 1);

		tmpstr = __getCookie("vFlagJoinsArticle"); // 날짜가 바뀔때 없어져야하는 값일 수 있으므로 다시 조사
		if(tmpstr == null || tmpstr == false || tmpstr == "") tmpstr = ",";
		var domain = "joins.com";
		document.cookie = "vFlagJoinsArticle" + "=" + escape(tmpstr + totalID +",") + "; path=/; expires=" + expireDate.toGMTString() + ";";
		_uv = "1";
	}
	var _ref = __conversion_referer(document.referrer);
	if(_ref == "XR") { _ref = __conversion_referer_ex(); }
	var _joins_memid = __getCookieA("MemArray", "MemID"); if(_joins_memid == null) _joins_memid = "";
	var _joins_pcid = __getCookie("PCID"); if(_joins_pcid == null) _joins_pcid = "";

	var rsrc = "";
	var rkwd = "";
	var refr = document.referrer;
	if (refr.indexOf('search.naver.com')>-1) { rsrc="N"; rkwd = __getParams('query',refr); }
	if (refr.indexOf('search.daum.net')>-1) { rsrc="D"; rkwd = __getParams('q',refr); }
	var _vod = __getIsVod();
	try{
		var _kwd_pattern = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s]+$/
		if (_kwd_pattern.test(decodeURIComponent(rkwd))==false || decodeURIComponent(rkwd)=="null")
		{
			rsrc="";
			rkwd="";
		}
	}catch(e){
		rsrc="";
		rkwd="";
	}
	document.write("<iframe src=\"https://counter.joins.com/bin/ArticleCounterLogger.dll?Total_ID=" + totalID + "&Ctg_ID=" + serviceCode + "&Master_Code=" + masterCode + "&gubun=" + _uv + "&cloc=" + rsCLOC + "&svc="+ __conversion_site_type(siteType.toUpperCase(), masterCode) +"&comm1="+ _dt +"&comm2="+ _joins_pcid +"&memid="+ _joins_memid +"&vod="+ _vod +"&ref="+ _ref +"&rsrc="+ rsrc +"&rkwd="+ rkwd +"\" width=\"0\" height=\"0\" frameborder=\"0\" marginheight=\"0\" topmargin=\"0\" scrolling=\"no\" style=\"display:none\"></iframe>");

}

function getIframeArticleCounterCheck(totalID, serviceCode, masterCode, siteType, sGubun, forcedAgent)
{
	var rsCLOC = "0";
	try { rsCLOC = __request("cloc"); } catch(e) {}
	if(typeof(rsCLOC) == "undefined" || rsCLOC == "undefined" || rsCLOC == "") rsCLOC = "0";

	var _dt = joins_device_detect_type1();
	if(typeof(forcedAgent) != "undefined") _dt = forcedAgent;
	var _uv = "0";
	var tmpstr = __getCookie("vFlagJoinsArticle");
	if(tmpstr == null || tmpstr == false || tmpstr == "") tmpstr = ",";
	if(tmpstr.indexOf(","+totalID +",") < 0)
	{
		var today = new Date();
		var expireDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		expireDate.setDate(expireDate.getDate() + 1);

		tmpstr = __getCookie("vFlagJoinsArticle"); // 날짜가 바뀔때 없어져야하는 값일 수 있으므로 다시 조사
		if(tmpstr == null || tmpstr == false || tmpstr == "") tmpstr = ",";
		var domain = "joins.com";
		document.cookie = "vFlagJoinsArticle" + "=" + escape(tmpstr + totalID +",") + "; path=/; expires=" + expireDate.toGMTString() + ";";
		_uv = "1";
	}
	var _ref = __conversion_referer(document.referrer);
	if(_ref == "XR") { _ref = __conversion_referer_ex(); }
	var _joins_memid = __getCookieA("MemArray", "MemID"); if(_joins_memid == null) _joins_memid = "";
	var _joins_pcid = __getCookie("PCID"); if(_joins_pcid == null) _joins_pcid = "";
	return "<iframe src=\"https://counter.joins.com/bin/ArticleCounterLogger.dll?Total_ID=" + totalID + "&Ctg_ID=" + serviceCode + "&Master_Code=" + masterCode + "&gubun=" + _uv + "&cloc=" + rsCLOC + "&svc="+ __conversion_site_type(siteType.toUpperCase(), masterCode) +"&comm1="+ _dt +"&comm2="+ _joins_pcid +"&memid="+ _joins_memid +"&ref="+ _ref +"\" width=\"0\" height=\"0\" frameborder=\"0\" marginheight=\"0\" topmargin=\"0\" scrolling=\"no\" style=\"display:none\"></iframe>";
}

function fnArticleCounterCheckOut(totalID, serviceCode, masterCode, siteType, sGubun) { fnArticleCounterCheck(totalID, serviceCode, masterCode, siteType, sGubun); }

function fnArticleDummyCallCheck(totalID, serviceCode, masterCode, siteType, sRef)
{
	var _dt = joins_device_detect_type1();
	var _ref = "";
	if(typeof(sRef) == "undefined") { _ref = __conversion_referer(document.referrer); if(_ref == "XR") { _ref = __conversion_referer_ex(); } }
	else { _ref = __conversion_referer(sRef); }
	var _joins_memid = __getCookieA("MemArray", "MemID"); if(_joins_memid == null) _joins_memid = "";
	var _joins_pcid = __getCookie("PCID"); if(_joins_pcid == null) _joins_pcid = "";
	document.write("<iframe src=\"https://counter.joins.com/bin/ArticleCounterLogger.dll?Total_ID=" + totalID + "&Ctg_ID=" + serviceCode + "&Master_Code=" + masterCode + "&gubun=2&cloc=0&svc="+ __conversion_site_type(siteType.toUpperCase()) +"&comm1="+ _dt +"&comm2="+ _joins_pcid +"&memid="+ _joins_memid +"&ref="+ _ref +"\" width=\"0\" height=\"0\" frameborder=\"0\" marginheight=\"0\" topmargin=\"0\" scrolling=\"no\" style=\"display:none\"></iframe>");
}

function fnArticlePVCheck(totalID, serviceCode, masterCode, siteType, sGubun)
{
	var rsCLOC = "0";
	if(typeof(sGubun) == "undefined" || sGubun == "") { sGubun = "0"; }
	try { rsCLOC = __request("cloc"); } catch(e) {}
	if(typeof(rsCLOC) == "undefined" || rsCLOC == "undefined" || rsCLOC == "") { rsCLOC = "0"; }
	var _dt = joins_device_detect_type1();
	var _joins_memid = __getCookieA("MemArray", "MemID"); if(_joins_memid == null) _joins_memid = "";
	var _joins_pcid = __getCookie("PCID"); if(_joins_pcid == null) _joins_pcid = "";
	document.write("<iframe src=\"https://counter.joins.com/bin/ArticleCounterLogger.dll?Total_ID=" + totalID + "&Ctg_ID=" + serviceCode + "&Master_Code=" + masterCode + "&gubun=0&cloc=" + rsCLOC + "&svc=" + siteType + "&comm1="+ _dt +"&comm2="+ _joins_pcid +"&memid="+ _joins_memid +"\" width=\"0\" height=\"0\" frameborder=\"0\" marginheight=\"0\" topmargin=\"0\" scrolling=\"no\" style=\"display:none\"></iframe>");
	document.write("<iframe src=\"https://counter.joins.com/bin/ArticleCounterLogger.dll?Total_ID=" + totalID + "&Ctg_ID=" + serviceCode + "&Master_Code=" + masterCode + "&gubun=0&cloc=" + rsCLOC + "&svc=ZZY" + siteType + "&comm1="+ _dt +"&comm2="+ _joins_pcid +"&memid="+ _joins_memid +"\" width=\"0\" height=\"0\" frameborder=\"0\" marginheight=\"0\" topmargin=\"0\" scrolling=\"no\" style=\"display:none\"></iframe>");
}

function fnArticlePVCheck2(totalID, serviceCode, masterCode, siteType, sGubun)
{
	var rsCLOC = "0";
	if(typeof(sGubun) == "undefined" || sGubun == "") { sGubun = "0"; }
	try { rsCLOC = __request("cloc"); } catch(e) {}
	if(typeof(rsCLOC) == "undefined" || rsCLOC == "undefined" || rsCLOC == "") { rsCLOC = "0"; }
	var _dt = joins_device_detect_type1();
	var _joins_memid = __getCookieA("MemArray", "MemID"); if(_joins_memid == null) _joins_memid = "";
	var _joins_pcid = __getCookie("PCID"); if(_joins_pcid == null) _joins_pcid = "";
	return "<iframe src=\"https://counter.joins.com/bin/ArticleCounterLogger.dll?Total_ID=" + totalID + "&Ctg_ID=" + serviceCode + "&Master_Code=" + masterCode + "&gubun=0&cloc=" + rsCLOC + "&svc=" + siteType + "&comm1="+ _dt +"&comm2="+ _joins_pcid +"&memid="+ _joins_memid +"\" width=\"0\" height=\"0\" frameborder=\"0\" marginheight=\"0\" topmargin=\"0\" scrolling=\"no\" style=\"display:none\"></iframe>";
}

function joins_device_detect_type1() {
	var sDeviceCheck = "0"; // pc
	var _agent = navigator.userAgent.toLowerCase();
	if (_agent.indexOf("iphone") != -1 || _agent.indexOf("ipod") != -1) sDeviceCheck = "2";
	else if (_agent.indexOf("ipad") != -1) sDeviceCheck = "4";
	else if (_agent.indexOf("android") != -1)
	{
		if(_agent.indexOf("mobile") != -1) sDeviceCheck = "1";
		else sDeviceCheck = "3";
	}
	else
	{
		var mobile = (/blackberry|mini|windows\sce|palm/i.test(_agent));
		if (mobile) sDeviceCheck = "5";
		else
		{
			if (_agent.indexOf("mac") != -1) sDeviceCheck = "8";
			else if (_agent.indexOf("x11") != -1) sDeviceCheck = "9";
		}
	}
	return sDeviceCheck;
}

function __conversion_site_type(t, exd)
{
	if(t == "A" || t == "JMA") return "JMA";
	else if(t == "G" || t == "GAL") return "GAL";
	else if(t == "I" || t == "IPW") return "IPW";
	else if(t == "IMW") return "IMW";
	else if(t == "J" || t == "JPW") { if(typeof(exd) != "undefined" && exd == "inter") return "ITR"; else return "JPW"; }
	else if(t == "ITR") return "ITR";
	else if(t == "JA" || t == "JPN") return "JPN";
	else if(t == "JD" || t == "JAD") return "JAD";
	else if(t == "S" || t == "JSR") return "JSR";
	else if(t == "P" || t == "JNS") return "JNS";
	else if(t == "JAH") return "JAH";
	else if(t == "JGA") return "JGA";
	else if(t == "JAP") return "JAP";
	else if(t == "JAS") return "JAS";
	else if(t == "APP") return "APP";
	else if(t == "SBH") return "SBH";
	else if(t == "JSP") return "JSP";
	else return "ZZZ"+ t;
}

function __conversion_referer(r)
{
	var _ref = "ZZ";
	if(r.indexOf("newsstand.naver.com") != -1) _ref = "NN";
	else if(r.indexOf("sports.news.naver.com/") != -1 || r.indexOf("sports.naver.com/") != -1 || r.indexOf("entertain.naver.com/") != -1) _ref = "NP";
	else if(r.indexOf("news.naver.com/") != -1) _ref = "NW";
	else if(r.indexOf("search.naver.com/") != -1) _ref = "NS";
	else if(r.indexOf(".naver.com/") != -1) _ref = "NV";
	else if(r.indexOf(".daum.net/") != -1) _ref = "DC";
	else if(r.indexOf(".nate.com/") != -1) _ref = "SK";
	else if(r.indexOf(".joins.com/") != -1) _ref = "JA";
	else if(r.indexOf("google.co") != -1) _ref = "GG";
	else if(r.indexOf(".facebook.com/") != -1 || r.indexOf("fb.me/") != -1) _ref = "FB";
	else if(r.indexOf("twitter.com/") != -1 || r.indexOf("t.co/") != -1) _ref = "TW";
	else if(r == "") _ref = "XR";
	return _ref;
}

function __conversion_referer_ex()
{
	var _ref_ex = navigator.userAgent.toLowerCase();
	if(_ref_ex.indexOf("kakaotalk") != -1) return "KT";

	try {
		var _ref_cloc = __request("cloc").toLowerCase();
		if(_ref_cloc.indexOf("cashslide") != -1) return "CC";
	} catch(e) { }
	return "XR";
}
