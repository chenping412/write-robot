/**
 * Created by GIISO on 2017/5/11.
 */
import './less/main.less';
import Vue from 'vue';
import { Message } from 'element-ui';
Vue.prototype.$message = Message;

Vue.config.productionTip = false;

var app = new Vue({
    el: '#app',
    data: {
        keyWord:"",
        articleData:"",
        text:" ",
        mm:0,
        config:{
            version:1000,
            itype:2,
            q:"",
            token:"0"
        },
        penShow:false,
        stateShow:false,
        state:0,
        stateBar1:0,
        stateBar2:0,
        stateBar3:0,
        stateBar5:0,
        timeInterval:{},
        timeOut:{},
        hideUp:false
    },
    computed:{
        stateBar4:function(){
            if(this.text.length==0){
                return 100;
            }else {
                var m=parseInt(this.mm/this.text.length*100);
                return m;
            }
        }
    },
    watch:{
        articleData:function(){
            var self=this;
            self.$nextTick(function(){
                var height=$("#text-area-text")[0].scrollHeight;
                $("#text-area-text").scrollTop(height);
                $("#text-area-div").scrollTop(height);
                this.penLocation();
                self.penShow=true;

            })
        },
        penShow:function(){
            var self=this;
            self.$nextTick(function(){
                self.penLocation();
            });
        },
        stateShow:function(){
            var self=this;
            self.penLocation();
            setTimeout(function(){
                self.penLocation();
            },700)
        }
    },
    mounted:function(){
        this.init();
        GIISO.shareInterface.shareInit();
    },
    methods:{
        init:function(){
            var self=this;
            self.penLocation();
            setTimeout(function(){
                $(".model").fadeOut();
            },3000);
            window.onresize=function(){
                self.penLocation();
            }
        },
        //获取数据后，模拟写作
        writeArticle:function(){
            var self=this;
            $('#text-input').blur();
            clearInterval(self.timeInterval);
            clearTimeout(self.timeOut);
            self.articleData="";
            self.stateShow=true;
            self.timeOut=setTimeout(function(){
                self.state=1;
                self.penShow=true;
                self.changeStateBar('stateBar1',1000);
                self.timeOut=setTimeout(function(){
                    self.state=2;

                    self.changeStateBar('stateBar2',2000);
                    self.timeOut=setTimeout(function(){
                        var url="http://robot.giiso.com/service/rwnews/rw/"+self.config.version+"/?token="+self.config.token;
                        $.ajax({
                            method : 'POST',
                            url:url,
                            data:{
                                q:self.keyWord,
                                itype:self.config.itype
                            },
                            success:function(data){
                                if(data.result && typeof(data.result.result)){
                                    self.state=3;
                                    self.changeStateBar('stateBar3',1000);
                                    self.timeOut=setTimeout(function(){
                                        self.state=4;
                                        self.text=data.result.result;
                                        if(data.result.status==-1){
                                            self.$message({
                                                showClose: true,
                                                message: '对不起，无有效内容,请修改题目',
                                                duration:7000
                                            });
                                        }

                                        var m=0;
                                        function writeArticle(){
                                            clearInterval(self.timeInterval);
                                            self.timeInterval=setInterval(function(){
                                                if(m==0){
                                                    self.articleData+="    ";
                                                }
                                                self.articleData+=self.text.slice(m,m+1);
                                                if(self.text.slice(m,m+1)=="。" || self.text.slice(m,m+1)=="！"){
                                                    clearInterval(self.timeInterval);
                                                    self.timeOut=setTimeout(function(){
                                                        writeArticle()
                                                    },700)
                                                }

                                                var isN=self.text.slice(m,m+1);
                                                if(isN.indexOf("\n") >= 0){
                                                    self.articleData+="      ";
                                                }


                                                m++;
                                                self.mm=m;
                                                if(m>self.text.length){
                                                    clearInterval(self.timeInterval);
                                                    setTimeout(function(){
                                                        self.state=5;
                                                    },1000)
                                                }
                                            },40);
                                        }
                                        writeArticle();
                                    },2000)
                                }else {
                                    self.$message({
                                        showClose: true,
                                        message: '对不起，无有效内容,请修改题目',
                                        duration:7000
                                    });
                                }
                            },
                            error : function() {
                                self.$message({
                                    showClose: true,
                                    message: '对不起，服务器繁忙，请重新提交',
                                    duration:7000
                                });
                            }
                        });
                    },3000)
                },2000);
            },500)


        },
        //进度条计算，过渡增加进度条百分比
        changeStateBar:function(stateBar,time){
            var self=this;
            setTimeout(function(){
                var m=0;
                var timerIIII=setInterval(function(){
                    self[stateBar]=m;
                    m++;
                    if(m>100){
                        clearInterval(timerIIII);
                    }
                },time/100)
            },700)
        },
        //文本域滚动时，隐藏div也跟着滚动
        textAreaScroll:function(){
            var top=$("#text-area-text").scrollTop();
            $("#text-area-div").scrollTop(top);
        },
        //重新定位笔的位置
        penLocation:function(){
            var offset=$("#pen-box").offset();
            $("#pen-ico").css({
                top:offset.top,
                left:offset.left
            });
            $(".article").height('auto');
            $(".article").height($(".article").height());

            //监控机器人超出屏幕之外时滚动窗口
            var winHeight=$(window).height();
            var winScrollTop=$(document).scrollTop();
            if(winHeight-(offset.top-winScrollTop)<250){
                $(document).scrollTop(offset.top-winHeight+250)
            }

        }
    }
});