/**
 * Created by GIISO on 2017/5/23.
 */
var GIISO={};
GIISO.shareInterface = {
    weixinInterface:{
        appId: '',
        timestamp: '',
        nonceStr: '',
        signature: ''
    },
    shareParms:{
        title : '',
        link : "",
        desc : '',
        imgUrl : ''
    },
    uaMatch : {
        isIphone: !!navigator.userAgent.match(/iphone/gi),
        isWeixin: !!navigator.userAgent.match(/MicroMessenger/gi),
        isQQ: !!navigator.userAgent.match(/QQ\//i)
    },
    shareInit : function (title,link,desc,imgUrl) {
        if(!link){
            link=location.href.split('#')[0];
        }
        GIISO.shareInterface.shareParms={
            title : title || '抓到一只可爱的写作机器人，好友邀你来围观！！',
            link : link,
            desc : desc || '震惊！！这么逆天的文章居然出自写作机器人，火速围观！！！',
            imgUrl : imgUrl || 'http://robot.giiso.com//images/share-icon.jpg'
        };
        GIISO.shareInterface.requestData();
    },
    createScripts : function () {
        var src = {
            wechat : 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js',
            qq : 'http://qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js'
        };
        var scripts = {
            wechatShare : function () {
                if(!GIISO.shareInterface.uaMatch.isWeixin) return false;
                if(document.getElementById("wechat-sharejs")){
                    GIISO.shareInterface.wechatConfig();
                }else {
                    var head = document.getElementsByTagName('head')[0];
                    var wechatScript = document.createElement('script');
                    wechatScript.src = src.wechat;
                    wechatScript.setAttribute('type','text/javascript');
                    wechatScript.setAttribute('id','wechat-sharejs');
                    head.appendChild(wechatScript);
                    wechatScript.onload = wechatScript.onredystatechange = function () {
                        if(!this.redyState || this.readyState == 'loaded' || this.readyState == 'complete'){
                            GIISO.shareInterface.wechatConfig();
                        }
                    }
                }

            },
            qqShare : function () {
                if(!GIISO.shareInterface.uaMatch.isQQ || !GIISO.shareInterface.uaMatch.isIphone) return false;
                if(document.getElementById("qq-sharejs")){
                    GIISO.shareInterface.qqConfig();
                }else {
                    var head = document.getElementsByTagName('head')[0];
                    var qqScript = document.createElement('script');
                    qqScript.setAttribute('type', 'text/javascript');
                    qqScript.setAttribute('id', 'qq-sharejs');
                    qqScript.src = src.qq;
                    head.appendChild(qqScript);
                    qqScript.onload = qqScript.onredystatechange = function () {
                        if(!this.redyState || this.readyState == 'loaded' || this.readyState == 'complete'){
                            GIISO.shareInterface.qqConfig();
                        }
                    }
                }

            }
        };
        return scripts;
    },
    requestData: function () {
        if(GIISO.shareInterface.uaMatch.isWeixin || GIISO.shareInterface.uaMatch.isQQ){
            $.ajax({
                 type: 'GET',
                 url: 'http://bnews.giiso.com/wx/wxsign.do?appId=0&uid=0',
                 data: {url: GIISO.shareInterface.shareParms.link},
                 async: false,
                 success: function (data) {
                     if(typeof(data)=='string' ){
                         data=JSON.parse(data);
                     }
                     GIISO.shareInterface.weixinInterface = data;
                     GIISO.shareInterface.createScripts().qqShare();
                     GIISO.shareInterface.createScripts().wechatShare();
                 }
            })
        }
    },
    wechatConfig: function () {
        wx.config({
            debug: false,
            appId: GIISO.shareInterface.weixinInterface.appId,
            timestamp: GIISO.shareInterface.weixinInterface.timestamp,
            nonceStr: GIISO.shareInterface.weixinInterface.nonceStr,
            signature: GIISO.shareInterface.weixinInterface.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        GIISO.shareInterface.wechatReady();
        GIISO.shareInterface.wechatError();
        GIISO.shareInterface.wechatPackage(GIISO.shareInterface.shareParms.title, GIISO.shareInterface.shareParms.link, GIISO.shareInterface.shareParms.imgUrl, GIISO.shareInterface.shareParms.desc);
    },
    wechatError: function () {
        wx.error(function (res) {
        });
    },
    wechatReady: function () {
        console.log("wechatReady");
        wx.ready(function () {
            GIISO.shareInterface.wechatPackage(GIISO.shareInterface.shareParms.title, GIISO.shareInterface.shareParms.link, GIISO.shareInterface.shareParms.imgUrl, GIISO.shareInterface.shareParms.desc);
        })
    },
    wechatPackage: function (title, link, imageUrl, desc) {
        var _title = title || '',
            _link = link || '',
            _imageUrl = imageUrl || '',
            _desc = desc || '';

        //分享到朋友圈
        wx.onMenuShareTimeline({
            title: _title,
            link: _link,
            desc: _desc,
            imgUrl: _imageUrl
        });
        // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
        wx.onMenuShareAppMessage({
            title: _title,
            link: _link,
            desc: _desc,
            imgUrl: _imageUrl
        });

        wx.onMenuShareQQ({
            title: _title,
            desc: _desc,
            link: _link,
            imgUrl: _imageUrl
        });

        wx.onMenuShareQZone({
            title: _title,
            desc: _desc,
            link: _link,
            imgUrl: _imageUrl
        });
        wx.onMenuShareWeibo({
            title: _title,
            desc: _desc,
            link: _link,
            imgUrl: _imageUrl
        });
    },
    qqConfig: function () {
        setShareInfo({
            title: GIISO.shareInterface.shareParms.title,
            summary: GIISO.shareInterface.shareParms.desc,
            pic: GIISO.shareInterface.shareParms.imgUrl,
            url: GIISO.shareInterface.shareParms.link
        });
    }
};