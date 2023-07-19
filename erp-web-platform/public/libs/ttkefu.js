
/**/
if(window.location.href.substring(0,8)!="file:///" && window.location.href.substring(0,17)!="http://localhost/" && window.location.href.substring(0,17)!="https://localhost/" && window.location.href.substring(0,17)!="http://127.0.0.1/" && window.location.href.substring(0,17)!="https://127.0.0.1/"){



/*=======================================================Global======================================================================================*/
/*--cookie添加、查询--*/
    function setCookie(name,value,time)
    {
        var strsec = getsec(time);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec*1);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/;";
    };
    function getsec(str)
    {
       var str1=str.substring(1,str.length)*1;
       var str2=str.substring(0,1);
       if (str2=="s")
       {
            return str1*1000;
       }
       else if (str2=="h")
       {
           return str1*60*60*1000;
       }
       else if (str2=="d")
       {
           return str1*24*60*60*1000;
       };
    };
    function getCookie(name)
    {
            var offset = document.cookie.indexOf(name + "=");
            if (offset != -1)
            {
                offset += name.length + 1;
                var end = document.cookie.indexOf(";", offset);
                if (end == -1)
                {
                    end = document.cookie.length;
                }
                return document.cookie.substring(offset, end);
            }
            else
            {
                return "";
            };
    };

    function ttkefu_setCookie(name,value,time)
    {
        var strsec = ttkefu_getsec(time);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec*1);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/;";
    };
    function ttkefu_getsec(str)
    {
       var str1=str.substring(1,str.length)*1;
       var str2=str.substring(0,1);
       if (str2=="s")

       {
            return str1*1000;
       }
       else if (str2=="h")
       {
           return str1*60*60*1000;
       }
       else if (str2=="d")
       {
           return str1*24*60*60*1000;
       };
    };
    function ttkefu_getCookie(name)
    {
            var offset = document.cookie.indexOf(name + "=");
            if (offset != -1)
            {
                offset += name.length + 1;
                var end = document.cookie.indexOf(";", offset);
                if (end == -1)
                {
                    end = document.cookie.length;
                }
                return document.cookie.substring(offset, end);
            }
            else
            {
                return "";
            };
    };

function ttkefu_gb2utf8(data){

	if(document.characterSet=="UTF-8"){
        if(data.length>30){
        	data=data.substring(0,30) +"...";
        }
    	return data;
    }
       
	return escape(data);

};

/*--来路、关键词、客户编号--*/
    var src1,sjs,ttmp,lailu,guanjianzi;
    function getlailu(){
        var url=document.referrer;
        var reg=new RegExp("https://","g");
        url=url.replace(reg,"");
        var righturl=url.split("/");
        return righturl[0]
    }
    lailu=getlailu();
    
    function getKeyword(){
        var url=document.referrer,reg=new RegExp("https://","g"),keyword="";
        url=url.replace(reg,"");
        var keywordsname = {s0:"word",s1:"q",s2:"p",s3:"w",s4:"query",s5:"name",s6:"_searchkey",s7:"wd",s8:"bs"};
        for(var one in keywordsname){
            keyword=getQueryString(url,keywordsname[one])
            if(keyword!=null&&keyword!="") return keyword
        }
        if(keyword="") return null
    }
    guanjianzi=getKeyword();
	if(typeof(guanjianzi)=="undefined")guanjianzi="";

    if (getCookie("kfltjs")=="") {
        sjs=191519334;
        setCookie("kfltjs",sjs,"d3000");
    } else{
        sjs=""+getCookie("kfltjs")+"";
    };
    
/*--当前页面信息采集--*/
/*强制留名*/
var ttkefu_isleave_name="False";
/**/
var ttkefu_limitwbsite="",ttkefu_pageurl="",ttkefu_pageurl1="",ttkefu_pagetitle="",ttkefu_pagetitle1="",ttkefu_Ut="",ttkefu_minipagetitle="";



/*--页面事件注册--*/
function ttkefu_EventReg(){

	/*消息监听*/
    ttkefu_Event_Listener();
    
    /*元素拖动*/
    ttkefu_Event_Drag();
        
    /*音频播放结束事件*/
    ttkefu_Event_SoundEnded();
    
    
    
}
function ttkefu_Event_Listener(){
        /*消息监听*/
        if(window.addEventListener){
            //跨域消息传递
             window.addEventListener("message",ttkefu_HandleMsg,false);
             
        }else if(window.attachEvent){
            //兼容ie8之流
            window.attachEvent('onmessage',ttkefu_HandleMsg);
        }
}

function ttkefu_Event_Drag(){
	
    
	
}

function ttkefu_addEvent(obj,iEvent,EventHandler){
        if(window.addEventListener){
             obj.addEventListener(iEvent,EventHandler,false);
             
        }else if(window.attachEvent){
            obj.attachEvent('on'+iEvent,EventHandler);
        }
}

function ttkefu_Event_SooundImgClick(){

        /*图片点击事件wws*/
        var limg=document.getElementsByClassName("voceStyle");
        for(var i=0;i<limg.length;i++){
            var iImg=limg.item(i);
            if(!iImg.getAttribute("addevent")){
                    iImg.addEventListener("click",function(){
                            iImg.setAttribute("addevent","1");
                            //语言文件处理voicesrc
                            var ivoicesrc=iImg.getAttribute("voicesrc");
                            if(iImg.getAttribute("src").indexOf("sound_stop.png")>0){
                                //1.设置图标为播放状态					
                                iImg.setAttribute("src","https://w1011.ttkefu.com/images/sound_play.gif");
                                
                                //2.播放音频文件
                                document.getElementById('soundfile').setAttribute("src",ivoicesrc);
                                document.getElementById('soundfile').play();
                                                    
                            }else{
                                //1.设置图标为停止状态	
                                iImg.setAttribute("src","https://w1011.ttkefu.com/images/sound_stop.png");
                                
                                //2.去除音频文件
                                document.getElementById('soundfile').removeAttribute("src");
                            }
                    });
            }

        }
}

/*音频播放结束事件*/
function ttkefu_Event_SoundEnded(){
    document.getElementById('soundfile').addEventListener('ended', function () { 
            var iSrc=document.getElementById('soundfile').getAttribute("src");
            //
            var limg=document.getElementsByClassName("voceStyle");
            for(var i=0;i<limg.length;i++){
                var iImg=limg.item(i);
                if(iImg.getAttribute("voicesrc")==iSrc){
                        //1.设置图标为停止状态	
                        iImg.setAttribute("src","https://w1011.ttkefu.com/images/sound_stop.png");
                }
            }
    }, false);
}

/*--公用函数--*/
function ttkefu_IsNum(str){
	 /*大于等于0正整数*/
	return /^(0|([1-9]\d*))$/.test(str);
}
/*拖动*/
var ttkefu_diffX=0,ttkefu_diffY=0,ttkefu_Drag_Start=0;
function ttkefu_Drag(drag){

            var drag = document.getElementById(drag);
            // //点击某物体时，用drag对象即可，move和up是全局区域，
            // 也就是整个文档通用，应该使用document对象而不是drag对象(否则，采用drag对象时物体只能往右方或下方移动)  
            drag.onmousedown = function(event){
			   ttkefu_Drag_Start=1;
			   console.log("drag.onmousedown");
               var event = event || window.event;  //兼容IE浏览器
               //鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
               ttkefu_diffX = event.clientX - drag.offsetLeft;
               ttkefu_diffY = event.clientY - drag.offsetTop;
               if(typeof drag.setCapture !== 'undefined'){
                      drag.setCapture();
               }
            }
            drag.onmouseup = function(event){
			   ttkefu_Drag_Start=0;
			   console.log("drag.onmouseup");
            }		
			
            document.onmousemove = function(event){
				console.log("document.onmousemove");
				if(ttkefu_Drag_Start==1){
						var event = event || window.event;
						var moveX = event.clientX - ttkefu_diffX;
						var moveY = event.clientY - ttkefu_diffY;
						if(moveX < 0){
							moveX = 0
						}else if(moveX > window.innerWidth - drag.offsetWidth){
							moveX = window.innerWidth - drag.offsetWidth
						}
						if(moveY < 0){
							moveY = 0
						}else if(moveY > window.innerHeight - drag.offsetHeight){
							moveY =  window.innerHeight - drag.offsetHeight
						}
						drag.style.left = moveX + 'px';
						drag.style.top = moveY + 'px'
				}
            }
            
            document.onmouseup = function(event){
				console.log("document.onmouseup");
				if(ttkefu_Drag_Start==1){
						this.onmousemove = null;
						this.onmouseup = null;
						 //修复低版本ie bug  
						if(typeof drag.releaseCapture!='undefined'){  
						   drag.releaseCapture();  
						}  
				}
            }
}

/*渐隐渐现*/
var ttkefu_fadeOut_i=0
function ttkefu_fadeOut(ele,speed){
		clearTimeout(ttkefu_fadeOut_i);
        var ele=document.getElementById(ele);
        ele.style.opacity=1;
        var opacitynum=ele.style.opacity;
        
        var speed=speed-1000;
        ttkefu_fadeOut_i=setTimeout(function(){
        	ttkefu_opacityOff(ele,100)
        },speed);
}

function ttkefu_opacityOff(ele,speed){

	clearTimeout(ttkefu_fadeOut_i);
    
    if(ele.style.opacity>0){
        ele.style.opacity=ele.style.opacity-0.1;
        
        ttkefu_fadeOut_i=setTimeout(function(){
        	ttkefu_opacityOff(ele,100)
        },100);
    }
}

function ttkefu_fadeIn(ele,hideTime){

		clearTimeout(ttkefu_fadeOut_i);
        var ele=document.getElementById(ele);
        ele.style.display="";
        ele.style.opacity=0.1;
        
        ttkefu_opacityIn(ele,100,hideTime);
}
function ttkefu_opacityIn(ele,speed,hideTime){

	clearTimeout(ttkefu_fadeOut_i);
    if(ele.style.opacity<1){
        ele.style.opacity=parseFloat(ele.style.opacity)+0.1;
        console.log("ttkefu_opacityIn_opacity:"+ele.style.opacity);
        
        ttkefu_fadeOut_i=setTimeout(function(){
        	ttkefu_opacityIn(ele,100,hideTime)
        },100);
    }else{
    	/*hideTime>0执行渐隐*/
        if(hideTime>0){
        	ttkefu_fadeOut(ele.id,hideTime);
        }
        
    }
}



/*正则区*/
function ttkefu_Replace_Img(str){
	return str.replace(/<\s?img[^>]*>/gi,'');
}

/*postMessage*/
function ttkefu_PostMessage(MsgData){
	/**/
    var vFraName=MsgData.FraName;
    
	/*frames[vFraName].postMessage(MsgData.Msg, '*');*/
    
    /*自定义网址状态:0.未能应用1.应用中*/
	
   		document.getElementById(vFraName).contentWindow.postMessage(MsgData.Msg, '*');
    
    
    
}
function ttkefu_HandleMsg(e){
    //
    if(console){
    	console.log("ttkefu_HandleMsg");
    	console.log(e);
    }
    
    var MsgData=e.data;
    if(MsgData.types){
    	  if(ttkefu_HandleMsg_JieTu){
    	  		ttkefu_HandleMsg_JieTu(MsgData);
          }
    }else{
    	  if(MsgData.ActName){
          		 
                 if(MsgData.ActName=="ttkefu_Ifa_MbMinWindow"){
                        /*手机迷你窗口*/
                         switch(MsgData.CmdKey){
                         
                            case "LinkParas_ttkefu_Ifa_MbMinWindow":
                            		/*记录对话连接-对话初始化完成*/
                                    var vLinkParas=MsgData.CmdVal;
                                    var vLinkParasAry=vLinkParas.split('|');
                                    var vKfId=vLinkParasAry[0];
                                    var vIcoStyle=vLinkParasAry[1];
                                    ttkefu_Mb_Min_LinkKfId_Set({KfId:vKfId});
                                    ttkefu_setCookie("ttkefu_Mb_Min_LinkIcoStyle",vIcoStyle,"d1");
                                    /*显示对话状态图标-隐藏其他图标*/
                                    ttkefu_Mb_MinWindow_TakingIco_Show();
                                    
                                    /*更新未读计数器以及弹出消息状态*/
                                    ttkefu_MinWidow_NoReadMsg_Contrl({row:1110});
                                    
                            break;
                            
                            case "state_ttkefu_Ifa_MbMinWindow":
                            		/*心跳-更新ttkefu_Mb_Min_LinkKfId*/
                                    ttkefu_Mb_MinWidow_LinkingSet();                   
                            break;
                         
                            case "Count_ttkefu_Ifa_MbMinWindow":
                                    /*更新未读记录数*/
                                    ttkefu_MinWidow_EditNoRead({Num:MsgData.CmdVal,row:1055});
                            break;
                            
                            case "Msg_ttkefu_Ifa_MbMinWindow":
                                    /*最新一条未读消息*/
                                    ttkefu_Mb_MinWidow_ShowMsg({Msg:MsgData.CmdVal,Name:MsgData.Name});
                            break;
                                                        
                            case "Shake_ttkefu_Ifa_MbMinWindow":
                                    /*震动*/
                                    ttkefu_Mb_MinWindow_Show();
                            break;
                            
                            
                            case "KfLx_ttkefu_Ifa_MbMinWindow":
                                    /*客服离线-手机版-小窗口-重置*/
                                    ttkefu_Mb_MinWindow_Reset();
                            break;
                            
                            
                            case "KfEndTalking_ttkefu_Ifa_MbMinWindow":
                            		/*结束对话-手机版-小窗口-重置*/
                                    ttkefu_Mb_MinWindow_Reset();
                            break;
                            
                            
                         }
                 }
          }
    }
}


/*窗口打开 device:0.Pc 1.手机 || openstyle:0.大窗口 1.小窗口 || */
var ttkefu_fk_device="0",ttkefu_fk_pc_openstyle="0";

function ttkefu_WindowOpen(url,paras){
	var vleft="0";
    if(paras.left){
    	vleft=paras.left;
    }
    
    var vwidth="849px";
    if(paras.width){
    	vwidth=paras.width;
    }
    
    var vheight="619px";
    if(paras.height){
    	vheight=paras.height;
    }
    
	window.open(url,"44630","top=0,left="+vleft+",width="+vwidth+",height="+vheight+",scrollbars=no,resizable=yes,status=no,z-look=yes,alwaysRaised=yes,location=no,depended=no,center:yes");

//    if(!document.getElementById("ttkefu_open_a")){
//        var vA=document.createElement("a");
//        vA.id="ttkefu_open_a";
//        vA.target="_blank";
//        document.getElementsByTagName("body")[0].appendChild(vA);
//    }
//    document.getElementById("ttkefu_open_a").style.display="none";
//    document.getElementById("ttkefu_open_a").setAttribute("href",url);
//    document.getElementById("ttkefu_open_a").click();
}

/*=====================================手机版=====================================*/
/*手机版-小窗口初始化*/
var G_ttkefu_Mb_Min_LinkKfId="";
if(ttkefu_getCookie("ttkefu_Mb_Min_LinkKfId")){
	G_ttkefu_Mb_Min_LinkKfId=ttkefu_getCookie("ttkefu_Mb_Min_LinkKfId")
}
var G_ttkefu_Mb_Min_IcoAndYq_Dispaly="",G_ttkefu_Mb_Min_TalkingIco_Dispaly="none";
if(G_ttkefu_Mb_Min_LinkKfId!=""){
	G_ttkefu_Mb_Min_IcoAndYq_Dispaly="none";
    G_ttkefu_Mb_Min_TalkingIco_Dispaly="";
}

function ttkefu_Mb_MinWindow_Init(){
        
    /*小窗口默认地址*/ 
    var vLinkUrl="";       
    if(ttkefu_getCookie("ttkefu_Mb_Min_LinkKfId")){
        
            var vKfId=ttkefu_getCookie("ttkefu_Mb_Min_LinkKfId");
            var vIcoStyle=ttkefu_getCookie("ttkefu_Mb_Min_LinkIcoStyle");
            if(vKfId!="" && vIcoStyle!=""){
            
                    /*生成记忆对话地址*/
                    vLinkUrl=ttkefu_Com_TalkLinkParas({Talking:1,R5s6eT:vKfId,icostyle:vIcoStyle});
                    ttkefu_Mb_MinWindow_SetLinkUrl(vLinkUrl);
                    
                    /*读取设置未读记录*/
                    ttkefu_Mb_MinWindow_SetNoReadByCookie();
                    
                    /*小窗口默认状态-打开or隐藏*/ 
                    if(ttkefu_getCookie("ttkefu_MinWidow_Close_State")){
                        /*显示*/
                        var vttkefu_MinWidow_Close_State=ttkefu_getCookie("ttkefu_MinWidow_Close_State");
                        if(vttkefu_MinWidow_Close_State=="1" && vLinkUrl!=""){
                            ttkefu_Mb_MinWindow_Show();
                        }
                    }
            }
    }
}
/*手机版-事件监听*/
function ttkefu_Mb_EventReg(){
	
    /*手机版-浏览器进出后台监听*/
    ttkefu_Mb_VisChange();
}
/*手机版-浏览器进入后台*/
function ttkefu_Mb_VisChange(){

        document.addEventListener("visibilitychange",function(){ 
            if(document.hidden) {
                /*页面被挂起*/
                ttkefu_Mb_PageHide();
                
            }
            else {
                /*页面呼出*/
                ttkefu_Mb_PageShow();
            }
        });
}

/*手机版-页面被挂起*/
function ttkefu_Mb_PageHide(){

		

}

/*手机版-页面呼出*/
function ttkefu_Mb_PageShow(){


}

/*手机版-小窗口-结束对话*/
function ttkefu_Mb_MinWindow_StopConsult(){

        /*手机版-小窗口-结束对话*/
        ttkefu_PostMessage({FraName:"ttkefu_Ifa_MbMinWindow",Msg:{ActName:"ttkefu_Ifa_MbMinWindow",CmdKey:"StopConsult_ttkefu_Ifa_MbMinWindow"}});

}

/*手机版-小窗口-重置*/
function ttkefu_Mb_MinWindow_Reset(){
        
    /*清除对话客服Id(刷新时的地址)*/
    ttkefu_setCookie("ttkefu_Mb_Min_LinkKfId","","s1");
    
    /*设置Iframe重新加载生成新对话*/
    ttkefu_Mb_MinWindow_SetLoad("0");
    
    /*隐藏对话状态图标-显示其他图标*/
    ttkefu_Mb_MinWindow_TakingIco_Hide();
}

/*手机版-小窗口-读取设置未读记录*/
function ttkefu_Mb_MinWindow_SetNoReadByCookie(){
        if(ttkefu_getCookie("ttkefu_Min_NoRead")){
            var vNum=parseInt(ttkefu_getCookie("ttkefu_Min_NoRead"));
            if(vNum>=0){            
                /*更新未读记录数*/
                ttkefu_MinWidow_EditNoRead({Num:vNum,row:1146});
            }
        }
}

/*公用对话连接参数 icostyle 必填*/
function ttkefu_Com_TalkLinkParas(MsgData){
	/*url参数整理*/
            var GoUrl="https://w1011.ttkefu.com/conversationormessage/ourcustomerservice/customerlist/chat_boxs.jsp?fgid=3525&t5Ys2R=44630&lang=0";
            
            /*必填*/
            GoUrl=GoUrl+"&dkfs="+MsgData.icostyle;
            
            
            /*T-指定客服*/
            if(MsgData.R5s6eT){
            	GoUrl=GoUrl+"&R5s6eT="+MsgData.R5s6eT;
            }
            /*T-手机小窗口记忆标记*/
            if(MsgData.Talking){
            	GoUrl=GoUrl+"&Talking="+MsgData.Talking;
            }
            
			

            GoUrl=GoUrl+"&tS4wJ7="+sjs;
            GoUrl=GoUrl+"&Purl="+ttkefu_pageurl;
            GoUrl=GoUrl+"&Pt="+ttkefu_pagetitleLimtit(ttkefu_pagetitle);
            GoUrl=GoUrl+"";
            
	return  GoUrl;   
}

/*手机版 | icostyle:0.邀请框 1.客服列表 2.浮动图标*/
function ttkefu_Mb_Open(MsgData){

	/*url参数整理*/
            var GoUrl=ttkefu_Com_TalkLinkParas(MsgData);
            
	/*打开窗口*/
    		MsgData.GoUrl=GoUrl;
        	
            ttkefu_Mb_BigWindow(MsgData);
        	
}


/*手机版-小窗口-开启*/
function ttkefu_Mb_MinWindow(MsgData){
	console.log(MsgData);
        
    /*重置计数器*/
    tkefu_Mb_MinWindow_SetNoReadNum(0);

    /*首次打开初始化*/
    if(document.getElementById("ttkefu_Ifa_MbMinWindow").getAttribute("load")=="0"){
    	  ttkefu_Mb_MinWindow_Open_Init(MsgData);
    }
    
    /*显示*/
    ttkefu_Mb_MinWindow_Show();
    
    /*通知聊天窗口-停止记录未读消息记录*/
    document.getElementById("ttkefu_Ifa_MbMinWindow").onload=function(){
    	ttkefu_MinWidow_NoReadMsg_Contrl({row:1305});
    }
    
}

/*手机版-小窗口-显示*/
function ttkefu_Mb_MinWindow_Show(){
	document.getElementById("ttkefuminitishiwrapper_MbMinWindow").style.display="";
    /*状态记忆*/
    ttkefu_setCookie("ttkefu_MinWidow_Close_State","1","d1");
    /*重置计数器*/
    ttkefu_MinWidow_EditNoRead({Num:0,row:1233});
    
}
/*手机版-小窗口-连接地址*/
function ttkefu_Mb_MinWindow_SetLinkUrl(GoUrl){
	document.getElementById("ttkefu_Ifa_MbMinWindow").src=GoUrl;
}

/*手机版-小窗口-load设置-仅对话连接为1,0代表重新加载地址*/
function ttkefu_Mb_MinWindow_SetLoad(state){
	document.getElementById("ttkefu_Ifa_MbMinWindow").setAttribute("load",state);
}
/*手机版-小窗口-开启-初始化*/
function ttkefu_Mb_MinWindow_Open_Init(MsgData){

	var vGoUrl=ttkefu_Com_TalkLinkParas(MsgData);
    ttkefu_Mb_MinWindow_SetLinkUrl(vGoUrl);
           
}
/*手机版-小窗口-设置记录数*/
function tkefu_Mb_MinWindow_SetNoReadNum(vNoReadNum){
		/**/
        ttkefu_MinWidow_EditNoRead({Num:vNoReadNum,row:1252});
}

/*手机版-大窗口*/
function ttkefu_Mb_BigWindow(MsgData){
    /**/
    ttkefu_WindowOpen(MsgData.GoUrl,{});
}

/*手机迷你窗口-关闭*/
function ttkefu_MinWidow_Close(){
        
		 /*隐藏聊天小窗口*/
	    document.getElementById("ttkefuminitishiwrapper_MbMinWindow").style.display="none";
        
        /*重置计数器*/
        tkefu_Mb_MinWindow_SetNoReadNum(0);
        
        /*记录状态*/
        ttkefu_setCookie("ttkefu_MinWidow_Close_State","0","d1");
        
        /*更新未读计数器以及弹出消息状态*/
        ttkefu_MinWidow_NoReadMsg_Contrl({row:1357});
        
}

/*手机迷你窗口-更新未读记录数*/
function ttkefu_MinWidow_EditNoRead(MsgData){
		
		var vNoReadNum=MsgData.Num;
		/*记录未读记录数*/
		ttkefu_setCookie("ttkefu_Min_NoRead",vNoReadNum,"d1");
		
        
		/*未读记录数显示*/
        if(parseInt(vNoReadNum)>0){
        		document.getElementById("ttkefu_Mb_MinWindow_TakingIco_Num").innerHTML=vNoReadNum;
                document.getElementById("ttkefu_Mb_MinWindow_TakingIco_Num").style.display="";
        }else{
        		document.getElementById("ttkefu_Mb_MinWindow_TakingIco_Num").innerHTML=0;
                document.getElementById("ttkefu_Mb_MinWindow_TakingIco_Num").style.display="none";
        }
}

/*手机迷你窗口-未读记录及弹出消息-控制器*/
function ttkefu_MinWidow_NoReadMsg_Contrl(MsgData){
		
		
        if(document.getElementById("ttkefuminitishiwrapper_MbMinWindow").style.display=="none"){
        		/*开启记录未读记录弹出显示未读消息*/
				ttkefu_PostMessage({FraName:"ttkefu_Ifa_MbMinWindow",Msg:{ActName:"ttkefu_Ifa_MbMinWindow",CmdKey:"Close_ttkefu_Ifa_MbMinWindow"}});
        }else{
        		/*关闭记录未读记录弹出显示未读消息*/
        		ttkefu_PostMessage({FraName:"ttkefu_Ifa_MbMinWindow",Msg:{ActName:"ttkefu_Ifa_MbMinWindow",CmdKey:"StopWrite_ttkefu_Ifa_MbMinWindow"}});
        }
}

/*手机迷你窗口-对话状态图标-显示*/
function ttkefu_Mb_icoAndYq(state){

	    /*浮动图标*/
    		//侧边图标背景色
            if(document.getElementById("ttkefu_Mb_Ico_Wrapper")){
				document.getElementById("ttkefu_Mb_Ico_Wrapper").style.display=state;
            }
            //侧边图标Vip
            if(document.getElementById("ttkefu_Mb_Ele_0")){
            	document.getElementById("ttkefu_Mb_Ele_0").style.display=state;
            }
            //侧边图标第三方客服
            if(document.getElementById("sj_ttkefu_ico")){
            	document.getElementById("sj_ttkefu_ico").style.display=state;
            }
            
            //底部图标
            if(document.getElementById("ttkefuico")){
            	document.getElementById("ttkefuico").style.display=state;
            }
                        
            
	  /*邀请框-循环邀请的-通过ttkefu_getCookie("ttkefu_Mb_Min_LinkKfId")来阻止 */
      		if(document.getElementById("sj_ttkefuyaoqing")){	
            	document.getElementById("sj_ttkefuyaoqing").style.display=state;
            }
}



/*手机迷你窗口-对话状态图标-显示*/
function ttkefu_Mb_MinWindow_TakingIco_Show(){
	
    /*隐藏-手机迷你窗口-对话状态图标*/
    ttkefu_Mb_icoAndYq("none");
    
    /*读取设置未读记录*/
    ttkefu_Mb_MinWindow_SetNoReadByCookie();

	/*显示-手机小窗口-对话状态图标*/
	document.getElementById("ttkefu_Mb_MinWindow_TakingIcoDiv").style.display="";
    
    /*设置手机小窗口为已加载状态*/
    ttkefu_Mb_MinWindow_SetLoad("1");
    
    /*绑定拖动事件*/
    //ttkefu_Drag("ttkefu_Mb_MinWindow_TakingIcoDiv");
    
}

/*手机迷你窗口-对话状态图标-隐藏*/
function ttkefu_Mb_MinWindow_TakingIco_Hide(){

    /*显示-手机迷你窗口-对话状态图标*/
	ttkefu_Mb_icoAndYq("");
	
    /*更新未读记录数*/
    ttkefu_MinWidow_EditNoRead({Num:0,row:1347});
    
    /*隐藏-手机小窗口-对话状态图标*/
    document.getElementById("ttkefu_Mb_MinWindow_TakingIcoDiv").style.display="none";
}

/*手机迷你窗口-最新消息*/
function ttkefu_Mb_MinWidow_ShowMsg(MsgData){
		var vName=MsgData.Name;
        var vMsg=MsgData.Msg;
        
        document.getElementById("ttkefu_Mb_MinWindow_MsgDivTitle_Name").innerHTML=vName;
        document.getElementById("ttkefu_Mb_MinWindow_MsgDivTxt").innerHTML=vMsg;
        
        ttkefu_fadeIn("ttkefu_Mb_MinWindow_MsgDiv",5000);
}

/*手机迷你窗口-持续对话状态维持 | */
function ttkefu_Mb_MinWidow_LinkingSet(){

	if(ttkefu_getCookie("ttkefu_Mb_Min_LinkKfId")){
            var vKfId=ttkefu_getCookie("ttkefu_Mb_Min_LinkKfId");
            if(vKfId!=""){
                    /*生成记忆对话地址*/
                    ttkefu_Mb_Min_LinkKfId_Set({KfId:vKfId,row:1380});
            }
     }
}
/*手机迷你窗口-持续对话状态维持*/
function ttkefu_Mb_Min_LinkKfId_Set(MsgData){


	if(ttkefu_getCookie("ttkefu_Mb_Min_LinkKfId")){
    		/*更新*/
            
     }else{
     		/*新增*/
            /*手机迷你窗口-新打开次数记录-适用未开通手机版且打开方式为手机小窗口*/
            ttkefu_Mb_MinWindow_FreeOpenNum_Set();
     }


    /*生成记忆对话地址*/
    ttkefu_setCookie("ttkefu_Mb_Min_LinkKfId",MsgData.KfId,"s120");
    
}
/*手机迷你窗口-新打开次数记录-适用未开通手机版且打开方式为手机小窗口*/
function ttkefu_Mb_MinWindow_FreeOpenNum_Set(){
	
    var vOpenNum=ttkefu_Mb_MinWindow_FreeOpenNum_Get();
	
    ttkefu_setCookie("ttkefu_Mb_MinWindow_FreeOpenNum",vOpenNum,"d3000");
}

function ttkefu_Mb_MinWindow_FreeOpenNum_Get(){
	
    var vOpenNum=1;
	if(ttkefu_getCookie("ttkefu_Mb_MinWindow_FreeOpenNum")){
    	vOpenNum=parseInt(ttkefu_getCookie("ttkefu_Mb_MinWindow_FreeOpenNum"))+1;
    }
	
    return vOpenNum;
}



/*手机-客服发起强制对话 or 访客点击邀请框-*/
function ttkefu_Mb_Kf_Tan(MsgData){

	/*关闭邀请框*/
    if(document.getElementById("sj_ttkefuyaoqing")){
    	document.getElementById("sj_ttkefuyaoqing").style.display="none";
    }
	/*消息提示框*/
    if(document.getElementById("ttkefu_Mb_Ele_110")){
    	document.getElementById("ttkefu_Mb_Ele_110").style.display="none";
    }

	ttkefu_Mb_Open(MsgData);    
}



/*初始加载*/
function ttkefu_Load(){
	        
        /*ttkefu事件注册*/
        ttkefu_EventReg();
        
        
    	
}

/**/
var ttkefu_Load_i=setTimeout(function(){ ttkefu_Load();},1000);
/*if (document.addEventListener){
    document.addEventListener("DOMContentLoaded", function(){
    }, false)
}
*/



function myReplace(str,key,key2){
    
    return str.replace(new RegExp(key,'g'),key2);
}

function FSenWords(str)
{
	var vSenWords="枪|炸药|色";
    var vAry=vSenWords.split("|");
    
    for(var i=0;i<vAry.length;i++)
    {
    	str=myReplace(str,vAry[i],"*");
    }
	
    return str;
}


function getQueryString(url,name){
	if(url==undefined || url==null || url.length<3)return null;
	var pt="?"+name+"=";
	var index;
	index=url.indexOf(pt);
	if(index<0){
		pt="&"+name+"=";
		index=url.indexOf(pt);
		if(index<0)return null
	}
	var url1=url.substring(index+pt.length);
	index=url1.indexOf("&");
	var temp=index<0?url1:url1.substring(0,index);
	return temp
}
var ttkefu_city="";
if (getCookie("mmaain")==document.domain&&getCookie("kuse")=="44630"){
	mmaain=document.domain;
	setCookie("mmaain",mmaain,"s20");
    setCookie("kuse","44630","d1");
	src1="";
}else{
	mmaain=document.domain;
    setCookie("mmaain",mmaain,"s20");
    setCookie("kuse","44630","d1");
    var Mreferrer=document.referrer;
    if(Mreferrer.length>200){
    	Mreferrer=Mreferrer.substring(0,200)+"...";
    }
    src1="https://w1011.ttkefu.com/online.jsp?k=3787&lailu="+Mreferrer+"&urll="+encodeURIComponent(document.location.href)+"&tS4wJ7="+sjs+"&t5Ys2R=44630&fid=3525&guanjianzi="+guanjianzi+"&zxrs=1";
    
}

document.write("<iframe id='ttkefu_by' name='by' xyz='0' style='display:none;' frameborder='0' width='0' height='0' src='"+src1+"'  ></iframe>");
/*获取浏览器版本*/
function ttkefu_getBrowserInfo(){
     var Sys = {};
     if(!!window.ActiveXObject || "ActiveXObject" in window)
     {
         Sys.browser ="msie";
         Sys.ver ="11";
     }else{
         var ua = navigator.userAgent.toLowerCase();
         var re =/(msie|firefox|chrome|opera|version).*?([\d.]+)/;
         var m = ua.match(re);
         Sys.browser = m[1].replace(/version/, "'safari");
         Sys.ver = m[2];
     }
     
     return Sys;
}

function tana(dkfs){

    
    /**/
	window.open("https://w1011.ttkefu.com/conversationormessage/ourcustomerservice/customerlist/chat_boxs.jsp?u=3525&t5Ys2R=44630&tS4wJ7="+sjs+"&fgid=3525&s2N6eL=44630&isshowstyle=1&dkfs="+dkfs+"&lang=0&Purl="+ttkefu_pageurl+"&Pt="+ttkefu_pagetitleLimtit(ttkefu_pagetitle)+"&xx=1","44630","top=0,left=100,width=849,height=619,scrollbars=no,resizable=yes,status=no,z-look=yes,alwaysRaised=yes,location=no,depended=no,center:yes")
	
}

function randtantel(){
	var iLeft = (window.screen.availWidth-330)/2;
    
    window.open("https://w1011.ttkefu.com/conversationormessage/ourcustomerservice/customerlist/randtel.jsp?u=3525&tS4wJ7="+sjs+"&kfid=3787&fgid=3525&s2N6eL=44630&isshowstyle=1&dkfs=tel","44630","top=200,left="+iLeft+",width=320,height=450,scrollbars=no,resizable=yes,status=no,z-look=yes,alwaysRaised=yes,location=no,depended=no,center:yes")
}

function ttkefu_randtantel(){
	var iLeft = (window.screen.availWidth-330)/2;

	window.open("https://w1011.ttkefu.com/conversationormessage/ourcustomerservice/customerlist/randtel.jsp?u=3525&tS4wJ7="+sjs+"&kfid=3787&fgid=3525&s2N6eL=44630&isshowstyle=1&dkfs=tel","44630","top=200,left="+iLeft+",width=320,height=450,scrollbars=no,resizable=yes,status=no,z-look=yes,alwaysRaised=yes,location=no,depended=no,center:yes")
}

function listtana(weburl,nicheng){
    var str=weburl;
	 
     	/*新窗口*/
        if(str.substr(str.indexOf("=")+1,str.indexOf("&")-str.indexOf("=")-1)==mini_dialog.zhidingkefu)
        {
        	/*新窗口客服与迷你窗口客服相同则关闭迷你窗口*/
            mini_dialog.isfirst=-1;
            mini_dialog.closewindow();  
        }
		window.open(weburl,"44630","top=0,left=100,width=849,height=619,scrollbars=no,resizable=yes,status=no,z-look=yes,alwaysRaised=yes,location=no,depended=no,center:yes")

	
}

function tanb(kuid,use,dkfs,nicheng){



	document.getElementById("sendMsgTxt_chat").removeAttribute("readonly");
    mini_dialog.state='0';
    document.getElementById("minidialog").style.display="";
    mini_dialog.zhidingkefu=kuid;
    mini_dialog.kfid=mini_dialog.zhidingkefu;
    document.getElementById('ttkefutitle').innerHTML='正与2'; //在minimsg.jsp里，这没用了。要删除
    
    if(nicheng.length>5){
      nicheng=nicheng.substring(0,5)+"...";
    }
    
    document.getElementById('ttkefuonlineKefuName').innerHTML=nicheng+'对话'; //在minimsg.jsp里，这没用了。要删除
    mini_dialog.getmsg({HH:"770"});
    

}

function tanac(str,dkfs){
	
	window.open("https://w1011.ttkefu.com/conversationormessage/ourcustomerservice/customerlist/chat_boxs.jsp?u=3525&t5Ys2R=44630&tS4wJ7="+sjs+"&zixun="+encodeURIComponent(str)+"&fgid=3525&s2N6eL=44630&dkfs="+dkfs+"&lang=0&Purl="+ttkefu_pageurl+"&Pt="+ttkefu_pagetitleLimtit(ttkefu_pagetitle)+"","44630","top=0,left=100,width=849,height=619,scrollbars=no,resizable=yes,status=no,z-look=yes,alwaysRaised=yes,location=no,depended=no,center:yes")
    
}

function tanbc(kuid,use,str,dkfs){

	try{
		var win=window.open('https://w1011.ttkefu.com/conversationormessage/ourcustomerservice/customerlist/chat_boxs.jsp?R5s6eT='+kuid+'&t5Ys2R=44630&zixun='+encodeURIComponent(str)+'&fgid=3525&s2N6eL='+use+'&tS4wJ7='+sjs+'&dkfs='+dkfs+"&lang=0&Purl="+ttkefu_pageurl+"&Pt="+ttkefu_pagetitleLimtit(ttkefu_pagetitle)+"",'44630','top=120,left=200,width=849,height=619,scrollbars=no,resizable=yes,status=no,z-look=yes,alwaysRaised=yes,location=no,depended=no,center:yes');
		if(win==null){
			window.location.href='https://w1011.ttkefu.com/conversationormessage/ourcustomerservice/customerlist/chat_boxs.jsp?R5s6eT='+kuid+'&t5Ys2R=44630&zixun='+encodeURIComponent(str)+'&fgid=3525&s2N6eL='+use+'&tS4wJ7='+sjs+'&dkfs='+dkfs+"&lang=0&Purl="+ttkefu_pageurl+"&Pt="+ttkefu_pagetitleLimtit(ttkefu_pagetitle);
		}
	}catch(e){
		window.location.href='https://w1011.ttkefu.com/conversationormessage/ourcustomerservice/customerlist/chat_boxs.jsp?R5s6eT='+kuid+'&t5Ys2R=44630&zixun='+encodeURIComponent(str)+'&fgid=3525&s2N6eL='+use+'&tS4wJ7='+sjs+'&dkfs='+dkfs+"&lang=0&Purl="+ttkefu_pageurl+"&Pt="+ttkefu_pagetitleLimtit(ttkefu_pagetitle);
	}

}

function tantel(s,dkfs){
    var iLeft = (window.screen.availWidth-330)/2;   
    window.open(s+"&fgid=3525&dkfs="+dkfs,"_blank","top=200,left="+iLeft+",width=320,height=450,align=center,crollbars=no,resizable=yes,status=yes,z-look=yes,alwaysRaised=yes,location=no,depended=no,center:yes");
}

function tanteluid(telu_id,sjs){
    var iLeft = (window.screen.availWidth-330)/2;   
    window.open("https://w1011.ttkefu.com/conversationormessage/ourcustomerservice/customerlist/tel.jsp?userid=44630&useid="+telu_id+"&khbh="+sjs+"&fgid=3525&dkfs=1","_blank","top=200,left="+iLeft+",width=320,height=450,align=center,crollbars=no,resizable=yes,status=yes,z-look=yes,alwaysRaised=yes,location=no,depended=no,center:yes");
}



function ttkefu_pagetitleLimtit(str){

	if(str!=""){
    
    	str=FSenWords(str); 
            
    	str=ttkefu_gb2utf8(str);
        
        return str;
    }
}

var isfrist="",mini_cytime,timerkkff,times2;
function onner(){
    var ycurl="https://w1011.ttkefu.com/yc.jsp?k=44630&j="+sjs+"&f=3525&r="+encodeURIComponent(document.location.href)+"&s="+Math.random();
    if(isfrist==""){
        var Onner_Referrer=document.referrer;
        if(Onner_Referrer.length>200){
            Onner_Referrer=Onner_Referrer.substring(0,200)+"...";
        }
        if(Onner_Referrer.indexOf("https://www.baidu.com")>=0){
        	Onner_Referrer="https://www.baidu.com";
        }
        
        ycurl="https://w1011.ttkefu.com/yc.jsp?k=44630&t="+encodeURIComponent(document.title)+"&j="+sjs+"&mini38=正与&mini39=对话&f=3525&r="+encodeURIComponent(document.location.href)+"&g="+guanjianzi+"&s="+Math.random()+"&l="+Onner_Referrer;
        isfrist="1";
    }
	
    mmaain=document.domain;
	setCookie("mmaain",mmaain,"s20");
	var new_script = document.createElement("script");
	new_script.src = ycurl;
	document.getElementsByTagName("HEAD")[0].appendChild(new_script);
    
	setTimeout("onner()",18000);
    
}
function ttkefu_hide(str){
document.getElementById(str).style.display='none'
}
function TTclosedivname(str)
{
	if(document.getElementById(str)!=null){
		document.getElementById(str).style.display="none";
    }
}
///
var ttkefu_flashVideoPlayer;
//连接
function ttkefu_connection_s(url){
	var ie = navigator.appName.indexOf("ttkefu_Microsoft") != -1;
	ttkefu_flashVideoPlayer = (ie) ? window['ttkefu_Mchannel_Fid'] : document['ttkefu_Mchannel_Fid'];
	ttkefu_flashVideoPlayer.ttkefu_connection_s(url);
}
//调用flash
function ttkefu_sendMessage(){
		ttkefu_flashVideoPlayer.ttkefu_sendMessage("PRIV|"+ttkefu_Mchannel.lguseid+"|"+ttkefu_Mchannel.receivers+"|"+ttkefu_Mchannel.txt+"|");
}
//flash调用
  function ttkefu_send2JS(mymsg){
  		 
		 if(mymsg=="ttkefu_flash_connection_s_ok"){
			  ttkefu_flashVideoPlayer.ttkefu_sendMessage("flash请求连接服务器");
		  }else if(mymsg=="ttkefu_flash_connection_s_fail" || mymsg=="ttkefu_flash_send_error"){
			  //3秒后重连
			  ttkefu_Mchannel.ResetLink({err:"833",tishi:"连接失败"});
		  }else{
			  //已经与服务器建立了连接
			  if(mymsg=="$ttkefu_flash_link_ok$"){

				  //账号登陆
				  ttkefu_Mchannel.LgServer();
			  }else if(mymsg=="login=ok"){
        		  document.getElementById("ttkefu_mini_tishi_parent").style.display='none';
			  	  //对话建立提醒
                  ttkefu_Mchannel.lg=true;
                  document.getElementById("sendMsgTxt_chat").removeAttribute("readonly");
				  ttkefu_Mchannel.Send("shengchengduihua");
                   ttkefu_Mchannel.TT_shengcheng=ttkefu_Mchannel.TT_shengcheng+1;
			  }else if(mymsg.indexOf("ttkefu_kaiqiyuzhi")>=0){
				 ttkefu_Mchannel.pme=true;
			  }else if(mymsg.indexOf("ttkefu_guanbiyuzhi")>=0){
				  ttkefu_Mchannel.pme=false;
              }else if(mymsg.indexOf("ttkefu_kaiqiLisWriting")>=0){
                 ttkefu_Mchannel.LisWriting=true;
              }else if(mymsg.indexOf("ttkefu_guanbiLisWriting")>=0){
                 ttkefu_Mchannel.LisWriting=false;
                 
              }else if(mymsg.indexOf("you_jieshuduihua_hao")>=0){
                 ttkekfu_yhAutoCloseTalkTs();
                  
			  }else if(mymsg.indexOf("ttkefu_xiaoxiyuzhi")>=0){
				   //访客正在输入提示
                   document.getElementById("ttkefu_minit0").style.display='none';
                   document.getElementById("ttkefu_minit1").style.display='';
                   
				   if(mymsg!="Fangkechats=ttkefu_xiaoxiyuzhi"){
				   		mini_dialog.getmsg({HH:"910"});
				   }
			  }else if(mymsg.indexOf("ttkefu_blur")>=0){
				   //访客正在输入关闭
                   document.getElementById("ttkefu_minit0").style.display='';
                   document.getElementById("ttkefu_minit1").style.display='none';
                   
				   if(mymsg!="Fangkechats=ttkefu_blur"){
				   		mini_dialog.getmsg({HH:"918"});
				   }  
			  }else if(mymsg.indexOf("m=fkjietuok")>=0){
				  if(mymsg.indexOf("m=fkjietuok0")>=0){
				  				//截图插件已安装
								mini_dialog.InStallJieTu();
				  
				  }else{
				  				//截图完成ttkefu_temp.bmp
								mini_dialog.BakCutImg({MsgData:mymsg});
				  }
															
                   
			  }else if(mymsg.indexOf("m=ttkefuretmsg")>=0){
					//客服消息撤回
                    var ikfmsglist=document.getElementsByClassName("ttkefu_kf_msg");
					var ilstele=ikfmsglist[ikfmsglist.length-1];
					ilstele.parentNode.removeChild(ilstele);
					
					var ikftimlist=document.getElementsByClassName("ttkefu_kf_timer");
					var ilsttm=ikftimlist[ikftimlist.length-1];
					ilsttm.parentNode.removeChild(ilsttm);
                    
                    
                                             
			  }else if(mymsg.length>1){
				   mini_dialog.getmsg({HH:"921"});
			  }
			  
		  }
      ttkefu_Mchannel.SendXTiaoTime1=new Date();
	  document.getElementById("ttkefusocketdiv").innerHTML=mymsg;
}

/*第三方网站反馈*/
var ttkefuGetWzLgInfo_i=0;

function ttkefuGetWzLgInfo(MsgData){

    if(MsgData.UserName==""){
        if(confirm("您尚未登录网站,点击确定将跳转至登录页面")){
            	window.location.href="";
        }else{
                /**/
                if(navigator.userAgent.toLowerCase().indexOf("micromessenger")>0){
                    WeixinJSBridge.call('closeWindow');
                }else{
                    window.close();
                    window.history.back();
                }
        }	
    }
    
    var DBdWzHy_Url="https://w1011.ttkefu.com/DBdWzHy.jsp";
    DBdWzHy_Url=DBdWzHy_Url+"?UserName="+MsgData.UserName;
    DBdWzHy_Url=DBdWzHy_Url+"&UserTel="+MsgData.UserTel;
    DBdWzHy_Url=DBdWzHy_Url+"&UserMobile="+MsgData.UserMobile;
    DBdWzHy_Url=DBdWzHy_Url+"&UserFax="+MsgData.UserFax;
    DBdWzHy_Url=DBdWzHy_Url+"&UserName="+MsgData.UserFax;
    DBdWzHy_Url=DBdWzHy_Url+"&UserQQ="+MsgData.UserQQ;
    DBdWzHy_Url=DBdWzHy_Url+"&UserEmail="+MsgData.UserEmail;
    DBdWzHy_Url=DBdWzHy_Url+"&UserMsn="+MsgData.UserMsn;
    DBdWzHy_Url=DBdWzHy_Url+"&UserCompany="+MsgData.UserCompany;
    DBdWzHy_Url=DBdWzHy_Url+"&UserAddr="+MsgData.UserAddr;
    DBdWzHy_Url=DBdWzHy_Url+"&UserRemark="+MsgData.UserRemark;
    
    DBdWzHy_Url=DBdWzHy_Url+"&kuse="+"44630";
    DBdWzHy_Url=DBdWzHy_Url+"&uid="+mini_dialog.khid;
    DBdWzHy_Url=DBdWzHy_Url+"&fgid="+"3525";
    DBdWzHy_Url=DBdWzHy_Url+"&sjs="+sjs;
    DBdWzHy_Url=DBdWzHy_Url+"&kfid="+mini_dialog.kfid;
    
    DBdWzHy_Url=DBdWzHy_Url+"&call=mini_dialog.getmsg({HH:1186});";
   

    var DBdWzHy_script = document.createElement("script");
    DBdWzHy_script.src =DBdWzHy_Url;
    DBdWzHy_script.charset="utf-8";
    document.getElementsByTagName("HEAD")[0].appendChild(DBdWzHy_script);

}
 
var ttkefu_ws,ttkefu_xmlHttp;
var ttkefu_Mchannel={
	types:0,
	firstload:0,
	firststr:"",
	ws:null,
	reset_i:0,
	rec_mode:168,
	senders:"",
	receivers:"",
	lguseid:"",
	txt:"",
    isrun:false,
    device:0,
    pushtype:0,
	pushi:0,
	pushlist:new Array(),
    pushsound:1,
    pme:false,
    /*客服是否有预知操作*/
    socyz:"",
    dhpush:false,
    uid:0,
    apns:"",
	/*Ios推送 nginx*/
    Plink:"https://w101.ttkefu.com:18430/wssios",
    ipp:"39.105.146.45",
	/*websocket推送 nginx*/
    servers:"w101.ttkefu.com",
    serverport:":18430/wss",
    Ci:"",
    Si:"",
    lg:false,
	nowtime:new Date(),
	zxtime:new Date(),
    LisWriting:false,
    IsSendWriting:false,
    TT_shengcheng:0,
    XinTiaoTime:0,
	SendXTiaoTime0:new Date(),
	SendXTiaoTime1:new Date(),
    ResetLinkTime:0,
	/*是否执行了退出操作*/
	ExitState:0,
	/*是否处于对话提示中*/
	TalkTs:0,
    
    
    
	initialize:function(lguseid,receivers,rec_mode){
    	//消息预知是否开启
    
        //初始化
              this.lguseid=lguseid;
              this.receivers=receivers;
              this.rec_mode=rec_mode;
              this.isrun=true;
              
			  this.ExitState=0;
			  this.TalkTs=0;
			  /*输入框设为只读*/
			  document.getElementById("sendMsgTxt_chat").removeAttribute("readonly");
        
        
        if(window.WebSocket){
        	this.SendXTiaoTime0=new Date();
            this.types=1;
            ttkefu_ToggleConnectionClicked();
        }else{
            var fls=this.flashChecker();
            if(fls.f){
                if(fls.v<9){
                    document.getElementById("ttkefu_mini_tishi_parent").style.display='none';
                }else{
                	this.SendXTiaoTime0=new Date();
                    this.types=2;
                    setTimeout(function(){ttkefu_connection_s(ttkefu_Mchannel.ipp)},100)
                }
            }
        }
	},
	LgServer:function(){
    
    
		  /*已经与服务器建立了连接*/
          ttkefu_Mchannel.SendXTiaoTime1=new Date();
          
		  /*登录*/
		  if(this.types==1){
			  ttkefu_ws.send("CONN|"+ttkefu_Mchannel.lguseid+"|0|");
		  }else if(this.types==2){
			  ttkefu_flashVideoPlayer.ttkefu_sendMessage("CONN|"+ttkefu_Mchannel.lguseid+"|0|");
		  }
         
		/*对话建立*/
 		if(!ttkefu_Mchannel.dhpush && ttkefu_Mchannel.pushtype==2){
			var dd=new Date();
			var pushtxt=dd.getHours()+":"+dd.getMinutes()+"分,访客给您发送了新对话.";
			ttkefu_Mchannel.PushTxt("5",ttkefu_Mchannel.uid,ttkefu_Mchannel.pushsound,pushtxt);
            ttkefu_Mchannel.dhpush=true;
		}
        
        /*心跳发送*/
              ttkefu_Mchannel.XinTiaoTime=setTimeout(function(){ ttkefu_Mchannel.SendXinTiao(); },50);
              
	},
	flashChecker:function(){
		var hasFlash = 0;
		var flashVersion = 0; 
		try{
			if (document.all) {
					  var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
					  if (swf) {
						hasFlash = 1;
						VSwf = swf.GetVariable("$version");
						flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
					  }
			  
			} else {
			  if (navigator.plugins && navigator.plugins.length > 0) {
				var swf = navigator.plugins["Shockwave Flash"];
				if (swf) {
				  hasFlash = 1;
				  var words = swf.description.split(" ");
				  for (var i = 0; i < words.length; ++i) {
					if (isNaN(parseInt(words[i]))) continue;
					flashVersion = parseInt(words[i]);
				  }
				}
			  }
			}
		}
		catch(e){
			
		}
		return { f: hasFlash, v: flashVersion };
	},
	ResetLink:function(MsgData){
    if(mini_dialog.state=="0"){
		//退出检测
              if(this.ExitState==1){
                  return false;
              }
		//与服务器连接断开,重连接中
              ttkefu_Mchannel.lg=false;
              document.getElementById("sendMsgTxt_chat").setAttribute("readonly","true");
              document.getElementById("ttkefu_mini_tishi").innerHTML="连接断开,重连接中["+MsgData.tishi+"]";
              document.getElementById("ttkefu_mini_tishi_parent").style.display='';

		//重连10次失败后，执行轮询
              ttkefu_Mchannel.reset_i=ttkefu_Mchannel.reset_i+1;
              if(ttkefu_Mchannel.reset_i>11){
                    ttkefu_Mchannel.lg=true;
                    document.getElementById("sendMsgTxt_chat").removeAttribute("readonly");
                    ttkefu_Mchannel.types=0;
                    mini_dialog.getmsg({HH:"1035"});
              }else{
                    //与服务器连接断开,3秒后重连
                    clearTimeout(ttkefu_Mchannel.ResetLinkTime);
                    ttkefu_Mchannel.ResetLinkTime=setTimeout(function(){
                          ttkefu_Mchannel.initialize(mini_dialog.chatid,mini_dialog.kfid,ttkefu_Mchannel.rec_mode);
                        },3000)
              }
            
       } 
	},
	/*心跳包发送*/
	SendXinTiao:function(){
                clearTimeout(ttkefu_Mchannel.XinTiaoTime);
                
                //仅在连接成功后执行
                if(ttkefu_Mchannel.lg){
                    //退出检测
                          if(this.ExitState==1){
                              return false;
                          }
                    //心跳检测
                          var XTiaoTimeCha=ttkefu_Mchannel.SendXTiaoTime1.getTime()-ttkefu_Mchannel.SendXTiaoTime0.getTime();
                          if(Math.floor(XTiaoTimeCha/1000)>120){
                              ttkefu_Mchannel.ResetLink({err:"1076",tishi:"长时间未响应"});
                              return false;
                          }
                    //心跳发送
                          ttkefu_Mchannel.SendXTiaoTime0=new Date();
                          if(ttkefu_Mchannel.types==1){
                              ttkefu_ws.send("xintiao|"+ttkefu_Mchannel.lguseid+"|");
                          }else if(ttkefu_Mchannel.types==2){
                              ttkefu_flashVideoPlayer.ttkefu_sendMessage("xintiao|"+ttkefu_Mchannel.lguseid+"|");
                          }
                    /*回调*/
                          ttkefu_Mchannel.XinTiaoTime=setTimeout(function(){ ttkefu_Mchannel.SendXinTiao(); },60000);
                   //在线访客状态
                          mini_dialog.getmsg({HH:"1086"});
                          
                          
                }
	},
	Send:function(txt){
    try{
          this.txt=txt;
          if(this.types==1){
              ttkefu_ws.send("PRIV|"+this.lguseid+"|"+this.receivers+"|"+txt+"|");
          }else if(this.types==2){
              ttkefu_sendMessage();	

          }else if(this.types==0 && this.device!=1){
          
              if(this.receivers==""){
              	this.receivers=mini_dialog.kfid;
              }
              
              
              var new_script = document.createElement("script");
              new_script.src ="https://"+ttkefu_Mchannel.servers+":18430/wss/pumsg.jsp?Myttkefu_fangke=dh_tishi&r="+this.receivers+"&m=fkxiaoxi&x="+Math.random();
              document.getElementsByTagName("HEAD")[0].appendChild(new_script); 
              
          }
        }
        catch(e){
        	setTimeout(function(){
               if(ttkefu_Mchannel.lg){
                  ttkefu_Mchannel.Send(txt)
               }
            },500);
        }

	},
	Push:function(MsgType,MsgId){
		if(this.pushtype==2){
			//
			var msg_script = document.createElement("script");
			msg_script.id="msg_script";
			msg_script.src ="https://w1011.ttkefu.com/push1.aspx?act="+MsgType+"&d="+MsgId+"&x="+Math.random();
			document.getElementsByTagName("HEAD")[0].appendChild(msg_script);
			
		}else if(this.pushtype==1){
        	
			
		}
		
	},
 
	PushTxt:function(type,id,sd,txt){
		if(this.pushtype==2 && txt!="undefined" && mini_dialog.imlixian==0){
        	txt=this.Ubb2Txt(txt);
			if(txt.length>45){
				txt=txt.substring(0,45)+"...";
			}
            txt=encodeURI(txt);
            
			var pmsg_script = document.createElement("script");
			pmsg_script.id="pmsg_script";
			pmsg_script.src =this.Plink+"/Myttkefu_fangke=push&r="+this.apns+"&m="+txt+"&t="+type+"&i="+id+"&s="+sd+"&x="+Math.random();
			document.getElementsByTagName("HEAD")[0].appendChild(pmsg_script); 
		}
	},
	YPost:function(url,parameter,callback){
		this.createXMLHttpRequest();
        //ttkefu_xmlHttp.onreadystatechange = callback;
        ttkefu_xmlHttp.open("POST",url,true);
        ttkefu_xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
        ttkefu_xmlHttp.send(parameter);
	},
	createXMLHttpRequest:function(){
		  //Mozilla 浏览器（将XMLHttpRequest对象作为本地浏览器对象来创建）
		  if(window.XMLHttpRequest){ //Mozilla 浏览器
			  ttkefu_xmlHttp = new XMLHttpRequest();
		  }else if(window.ActiveXObject) { //IE浏览器
		  //IE浏览器（将XMLHttpRequest对象作为ActiveX对象来创建）
			  try{
				  ttkefu_xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
			  }catch(e){
				  try {
					  ttkefu_xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				  }catch(e){}
			  }
		  }
		  if(ttkefu_xmlHttp == null){
			  //alert("不能创建XMLHttpRequest对象");
			  return false;
		  }
	},
    /*消息提示:访客等待超时0|访客无回复1|自动断开2*/
    TsId:0,
	InsertTs:function(MsgData){
		try{
            var m=document.createElement("div");
            m.style.margin="0px";
            m.style.padding="0px";
            m.style.width="98%";
            
			/*消息ID*/
			this.TsId=this.TsId+1;
			/*消息类型*/
			var inserttxt="";
			switch(MsgData.type){
				
				case 0:
					  inserttxt="<div align='center' style='overflow:hidden; margin:0px; padding:0px;'><p style='line-height:20px; font-size:12px; color:#889298;text-align:left; margin:8px; display:inline-block; *display:inline; *zoom:1;  padding:8px 16px; background:#e5eaed;'>"+MsgData.TiShi+"</p></div>";
				break;
				
				case 1:
                      inserttxt=mini_dialog.kfhtmlheader+MsgData.TiShi+mini_dialog.kfhtmlfooter+"<div class='ttkefu_jg' style='height:10px;padding:0px; margin:0px;font-size: 9pt; margin: 0px 0px 0px 0px;overflow: hidden; clear:both; '></div>"
				break;
				
				case 2:
					  inserttxt="<div align='center' style='overflow:hidden; margin:0px; padding:0px;'><p style='line-height:20px; font-size:12px; color:#889298;text-align:left; margin:8px; display:inline-block; *display:inline; *zoom:1;  padding:8px 16px; background:#e5eaed;'>"+MsgData.TiShi+"<span style='color:#4e97b9; padding:0px; margin:0px;'>本次对话将在<span id='DJS"+this.TsId+"'>110</span>秒后结束，回复消息将继续对话</span></p></div>";
				break;
			}
            m.innerHTML=inserttxt;
            
            document.getElementById("ttkefucontainer").appendChild(m);
document.getElementById("ttkefucontainer_wrapper").scrollTop=document.getElementById("ttkefucontainer_wrapper").scrollHeight;
			/*状态提示*/
			mini_dialog.clear(timerkkff);
            timerkkff = mini_dialog.show('新消息顶部提示，可能没用目前是传到minimsg.jsp里。');
            window.focus();
            
		}catch(ex){
			//alert(ex.message);
		}
		
	},
	Ubb2Txt:function(txt){
		//表情替换
		txt=txt.replace(/\[emo\](.+?)\[\/emo\]/ig,'[表情]');
		//图片替换
		txt=txt.replace(/\[img\](.+?)\[\/img\]/ig,'[图片]');
		//超链接替换
		txt=txt.replace(/\[url href='(.+?)'\](.+?)\[\/url\]/ig,'$1');
		//文件替换
		txt=txt.replace(/\[file\](.+?)\[\/file\]/ig,'[文件]');
		
		return txt;
	},
	IWriting:function(){
		if(this.LisWriting && !this.IsSendWriting){
			ttkefu_Mchannel.Send('ttkefu_xiaoxiyuzhi');
			this.IsSendWriting=true;
		}
	}, 
	CloseWriting:function(){
		if(this.LisWriting){
			setTimeout(function(){
				ttkefu_Mchannel.Send('ttkefu_blur');
				ttkefu_Mchannel.IsSendWriting=false;
				},500);
		}
	},
	Exit:function(){
    	this.isrun=false;
		if(this.types>0){
				   try{
                        this.Send("tuichu");
                        if(this.types==1){
                            ttkefu_ws.send("EXIT|"+this.lguseid+"|");
                        }else if(this.types==2){
                            ttkefu_flashVideoPlayer.ttkefu_sendMessage("EXIT|"+this.lguseid+"|");
                        }
				   }catch(ex){
				   
				   }
	     }
		/*输入框设为只读*/
			  document.getElementById("sendMsgTxt_chat").setAttribute("readonly","true");
		/*标记连接已断开*/
			  this.lg=false;
		/*标记已退出*/

			  this.ExitState=1;
    }
}

function ttkefu_ToggleConnectionClicked(){

			ttkefu_ws = new WebSocket("wss://"+ttkefu_Mchannel.servers+":18430/wss");//连接服务器
			ttkefu_ws.onopen = function(event){
				   //账号登陆
				   ttkefu_Mchannel.LgServer();
				};
			ttkefu_ws.onmessage = function(event){
				//获得消息

                        if(event.data=="login=ok"){
                            //对话建立提醒
                            ttkefu_Mchannel.lg=true;
                            document.getElementById("sendMsgTxt_chat").removeAttribute("readonly");
                            document.getElementById("ttkefu_mini_tishi_parent").style.display='none';
                            ttkefu_ws.send("PRIV|"+ttkefu_Mchannel.lguseid+"|"+ttkefu_Mchannel.receivers+"|shengchengduihua|");
                            ttkefu_Mchannel.TT_shengcheng=ttkefu_Mchannel.TT_shengcheng+1;
                        }else if(event.data.length>1){
                         	
                            if(event.data.indexOf("ttkefu_kaiqiyuzhi")>=0){
                                ttkefu_Mchannel.pme=true;
                            }else if(event.data.indexOf("ttkefu_guanbiyuzhi")>=0){
                               ttkefu_Mchannel.pme=false;
                            }else if(event.data.indexOf("ttkefu_kaiqiLisWriting")>=0){
                               ttkefu_Mchannel.LisWriting=true;
                            }else if(event.data.indexOf("ttkefu_guanbiLisWriting")>=0){
                               ttkefu_Mchannel.LisWriting=false;
                          	}else if(event.data.indexOf("you_jieshuduihua_hao")>=0){
                             	ttkekfu_yhAutoCloseTalkTs();
                               
                            }else if(event.data.indexOf("ttkefu_xiaoxiyuzhi")>=0){
                                 //访客正在输入提示
                                 document.getElementById("ttkefu_minit0").style.display='none';
                                 document.getElementById("ttkefu_minit1").style.display='';
                                 
                                 if(event.data!="Fangkechats=ttkefu_xiaoxiyuzhi"){
                                      mini_dialog.getmsg({HH:"1245"});
                                 }
                            }else if(event.data.indexOf("ttkefu_blur")>=0){
                                 //访客正在输入关闭
                   				 document.getElementById("ttkefu_minit0").style.display='';
                   				 document.getElementById("ttkefu_minit1").style.display='none';
                                 
                                 if(event.data!="Fangkechats=ttkefu_blur"){
                                      mini_dialog.getmsg({HH:"1253"});
                                 } 
                            }else if(event.data.indexOf("m=fkjietuok")>=0){
                                  if(event.data.indexOf("m=fkjietuok0")>=0){
                                                //截图插件已安装
                                                mini_dialog.InStallJieTu();
                                  
                                  }else{
                                                //截图完成ttkefu_temp.bmp
                                                mini_dialog.BakCutImg({MsgData:event.data});
                                  }
			  				}else if(event.data.indexOf("m=ttkefuretmsg")>=0){
                                    //客服消息撤回
                                    var ikfmsglist=document.getElementsByClassName("ttkefu_kf_msg");
                                    var ilstele=ikfmsglist[ikfmsglist.length-1];
                                    ilstele.parentNode.removeChild(ilstele);
                                    
                                    var ikftimlist=document.getElementsByClassName("ttkefu_kf_timer");
                                    var ilsttm=ikftimlist[ikftimlist.length-1];
                                    ilsttm.parentNode.removeChild(ilsttm);
                                                                     
                            }else{
                               mini_dialog.getmsg({HH:"1256"});
                            }
                        
                        
                        }
                    ttkefu_Mchannel.SendXTiaoTime1=new Date();
                    document.getElementById("ttkefusocketdiv").innerHTML=event.data;
				};
			ttkefu_ws.onclose = function(event){
				  if(mini_dialog.chatid>0){
                    //重连
                    ttkefu_Mchannel.ResetLink({err:"1268",tishi:"客户端异常断开"});         
				  }
				};
	
}

var ttkefu_d=new Date();

//系统消息状态配置
var ttkefu_fkleavestate="True",ttkefu_fkstaytime=300000*6,ttkefu_fknoreplystate="False",ttkefu_fknoreplytime="300",ttkefu_fkwaitstate="False",ttkefu_fkwaittime="180";
//FkSendTime:访客发送消息时间,FkTimeOut:等待超时延迟函数
var ttkefu_FkSendTime=new Date(),ttkefu_leavetime=new Date(),ttkefu_FkTimeOut=0;
//KfSendTime:客服回复消息时间,KfTimeOut:等待超时延迟函数
var ttkefu_KfSendTime=new Date(),ttkefu_KfTimeOut=0;



//访客状态0空闲1对话
var ttkefu_fk_state=0;
var mini_dialog={
    display:0,
	chatid:0,
    kfid:0,
    kfname:"",
    khid:0,
    imlixian:0,
    imlixian1:0,
    Timer:'',
    use:'',
    i:0,
    issend:0,
    /*true:对话结束false:对话中*/
    dialog:true,
    ycurl:"",
    yz:0,
    AutoClose_Ok:0,
    isfirst:0,
    iszhuanjie:0,
    windowstate:0,
    exiturl:'',
    zhidingkefu:0,
    state:'0',
    p:'0',
    waitno:'0',
    getmsg_i:0,
    location:'',
    kup:0,
    n:'0',
    id:0,
    mini_zs:'0',
    /*接待访客设置*/
    duihuaxuanze:1,
    statemsg:'<div id="ttkefu_closetsdiv" class="ttkefu_closetsdiv" style="padding:0px; margin:0 auto; text-align:center; overflow:hidden;background:#e5eaed; font-size:9pt; height:32px; line-height:32px; color:#ff0000;width:200px; border-radius:4px;">当前对话已结束！</div>',
    title:document.title,
    titlebg:'#E6941A',
    fontcolor:'#FFFFFF',
    jstime:'2022-01-19 15:21:09',
    tshtmlheader:'<div style=" width:85%; float:left; padding:; margin:0px;font-size: 9pt;overflow: hidden; "><div id="tt_kefdiv" style="padding:0px; margin:0px;float: left;margin-left: 5px; padding:1px 0px 0px 0px; max-width: 100%; min-height: 22px;min-width: 60px;"><div style="position: relative;padding:0px; margin:0px;"><div style="padding:0px; margin:0px;background-color: #FFF69B; border: 1px solid #c0ad20;border-radius: 5px 5px 5px 5px;box-shadow: 0 1px 0 #DBDBDB; "><div style="padding:0px; margin:0px;background-color: #fff69b;border-radius: 5px 5px 5px 5px;color: #030303;  min-height: 20px; min-width: 37px;overflow: hidden;padding:10px 10px 10px 10px;text-align: left; word-break: break-all; word-wrap: break-word;">',
    tshtmlfooter:'</div></div><div style="padding:0px; margin:0px;background: url(https://w1011.ttkefu.com/images/yellow_arrow.png) no-repeat;height: 24px;left: -3px;position: absolute; top: 11px; width: 13px;"></div></div></div></div>', 
    fkhtmlheader:"<div style='width:85%; float:right;padding:0px; margin:0px;font-size: 9pt;overflow: hidden; '><div id='tt_fkdiv' style='padding:0px; margin:0px;float: right;margin-right: 8px;max-width: 100%;min-height: 22px;min-width: 60px;'><div style='position: relative; padding:0px; margin:0px;'><div style='padding:0px; margin:0px;background-color: #6bc1fa;border: 0px solid #6bc1fa;border-radius: 5px 5px 5px 5px;box-shadow: 0 1px 0 #D5D5D5;margin-left: 18px;'><div style='padding:0px; margin:0px;background-color:#E6941A; border-radius: 4px 4px 4px 4px; color: #fff; min-width: 37px; overflow: hidden; padding:10px 10px 10px 10px;text-shadow: none; vertical-align: top;word-break: break-all;word-wrap: break-word;' class='jianjiao'>",
    fkhtmlfooter:"</div></div></div></div></div>",
    kfhtmlheader:"<div class='ttkefu_kf_msg' style='width:85%; float:left;padding:0px; margin:0px;font-size: 9pt;overflow: hidden;'><div id='tt_kefdiv' style='padding:0px; margin:0px;float: left;margin-left: 5px;padding:1px 0px 0px 0px; max-width: 100%; min-height: 22px;min-width: 60px;'><div style='position: relative; padding:0px; margin:0px;'><div style='padding:0px; margin:0px; border: 0px solid #dddddd;border-radius: 5px 5px 5px 5px;box-shadow: 0 1px 0 #DBDBDB;'><div style='padding:0px; margin:0px;border-radius: 5px 5px 5px 5px;color: #030303;background-color: #ededed;  min-height: 20px; min-width: 37px;overflow: hidden;padding:10px 10px 10px 10px;text-align: left; word-break: break-all; word-wrap: break-word;' class='kfjaja'>",
    kfhtmlfooter:"</div></div></div></div></div>",
    first_to_msg:'',
    lastid:'',
    sendtime:new Date(),
	getCSS:function(obj,style){
			if(window.getComputedStyle){
				return getComputedStyle(obj)[style];
			}
			return obj.currentStyle[style];	
	},
    /*删除客服列表*/
    clearKflb:function(){
    		if(document.getElementById("ttkefu_KfList_div")){
                    var miniP=document.getElementById("ttkefu_KfList_div").parentNode;
                    miniP.removeChild(document.getElementById("ttkefu_KfList_div"));
            }    
    },    
    /*迷你邀请*/
    yaoqing:function(){
        
        //删除结束对话提示
              var Divlist=document.getElementById("ttkefucontainer").getElementsByTagName("div");
              for(var i=0;i<Divlist.length;i++){
              	  if(Divlist[i].className=="ttkefu_closetsdiv"){
                  	  document.getElementById("ttkefucontainer").removeChild(Divlist[i]);
                  }
              }
              
         //去除输入框的只读
         	  document.getElementById("sendMsgTxt_chat").removeAttribute("readonly");
         //重置对话状态
         	   mini_dialog.state='0';
        //显示迷你窗口
        	  document.getElementById('minidialog').style.display='';
        
    },
    /*生成聊天记录*/
    CreateChats:function(){
    	//变量信息
        	 mini_dialog.state='0';
        //产品信息-产生对话后显示
             setTimeout(function(){ mini_dialog.ShowPrInfo();},1000)
    },
    /*产品信息*/
    ShowPrInfo:function(){
               if("0"=="1" && ttkefu_Curl_limit==1){
                var PJstr='<div align="center"  style="overflow:hidden; margin:0px 0px 8px 0px;padding:5px 8px;" >';
                    PJstr=PJstr+'<div  style="background:#ffffff; border-radius: 10px 10px 10px 10px;border:1px #D8DEE2 solid; line-height:20px; font-size:12px; color:#889298;text-align:left;  display:inline-block; *display:inline; *zoom:1; ">';
                    PJstr=PJstr+'<table style="height:auto; border:none;" width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td align="left" valign="top" style="padding:10px 8px 0px 8px;"><img src="https://w1011.ttkefu.com/images/WxFace.png" width="40" height="40" ></td><td  style="padding:10px 0px 0px 0px;word-wrap: break-word; overflow: hidden; word-break: break-all;" id="ttkefu_ProInfo_span" data="【页面信息】：'+ttkefu_Ut+'" valign="top" ><div style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:176px;">'+ttkefu_pagetitle+'</div><div style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:176px;">'+ttkefu_minipagetitle+'</div></td></tr><td colspan="2" align="center" style="padding:5px 0px 10px 0px;"><span  onclick="mini_dialog.fbb()" class="Djsblue" style="cursor:pointer; border:1px #8e664d solid; padding:3px 18px; color:#936045; border-radius:30px;">发送</span></td></table>';
                    
                    PJstr=PJstr+'</div>';
                PJstr=PJstr+'</div>';
                
                
                var m_Pstr=document.createElement("div");
                m_Pstr.style.margin="0px";
                m_Pstr.style.padding="0px";
                m_Pstr.style.width="98%";
                
                /*消息类型*/
                m_Pstr.innerHTML=PJstr;
                
                document.getElementById("ttkefucontainer").appendChild(m_Pstr);
                document.getElementById("ttkefucontainer_wrapper").scrollTop=document.getElementById("ttkefucontainer_wrapper").scrollHeight;
    		    }
    },
	shakeMove:function(json){
			//声明要进行抖动的元素
			var obj = json.obj;
			//声明元素抖动的最远距离
			var target = json.target;
			//默认值为20
			target = Number(target) || 20;
			//声明元素的变化样式
			var attr = json.attr;
			//默认为'left' 
			attr = attr || 'left'; 
			//声明元素的起始抖动方向
			var dir = json.dir;
			//默认为'1'，表示开始先向右抖动
			dir = Number(dir) || '1';
			//声明元素每次抖动的变化幅度
			var stepValue = json.stepValue;
			stepValue = Number(stepValue) || 2;
			//声明回调函数 
			var fn = json.fn;
			//声明步长step
			var step = 0;
			//保存样式初始值
			var attrValue = parseFloat(this.getCSS(obj,attr));
			//声明参照值value
			var value;
			//清除定时器
			if(obj.timer){return;}
			//开启定时器
			obj.timer = setInterval(function(){
                      //抖动核心代码
                      value = dir*(target - step);
                      //当步长值大于等于最大距离值target时
                      if(step >= target){
                      step = target
                      }
                      //更新样式值
                      obj.style[attr] = attrValue + value + 'px';
                      //当元素到达起始点时，停止定时器
                      if(step == target){
                      clearInterval(obj.timer);
                      obj.timer = 0;
                      //设置回调函数
                      fn && fn.call(obj); 
                      } 
                      //如果此时为反向运动，则步长值变化
                      if(dir === -1){
                      step = step + stepValue; 
                      }
                      //改变方向
                      dir = -dir; 
            
			},50); 
	
	},
    fbb:function(){
    	document.getElementById("sendMsgTxt_chat").value=document.getElementById("ttkefu_ProInfo_span").getAttribute("data");
        this.sendmsg();
    },
    tohtml:function(str){

            str=str.replace(/\[url/g,"<a target='_blank' href");
            str=str.replace(/\[\/url/g,"</a");

            str=str.replace(/\]/g,">");
  			return str;

    },
    
        /*强制留名检测*/
    qzlm:function(){
    
    	var ttkefu_qzlm_name=document.getElementById("ttkefu_qzlm_name").value;
        if(ttkefu_qzlm_name.length<2 || ttkefu_qzlm_name.length>20){
        		return "格式错误,姓名应在2-20个字符之间";
           
        }
         

        var ttkefu_qzlm_qq=document.getElementById("ttkefu_qzlm_qq").value;
        if(! /^[0-9]*$/.test(ttkefu_qzlm_qq)){
        		return "QQ格式错误";
        }
              
        var ttkefu_qzlm_phone=document.getElementById("ttkefu_qzlm_phone").value;
        if(! /1[0-9]{10}/.test(ttkefu_qzlm_phone)){
        		return "手机格式错误";
        }
     	
        /**/
        ttkefu_isleave_name="False";
        document.getElementById("ttkefu_qzlmDIv").style.display='none';
        document.getElementById("sendMsgTxt_chat").style.display='';
             
    	return "留名："+ttkefu_qzlm_name+"，手机："+ttkefu_qzlm_phone+"，QQ："+ttkefu_qzlm_qq;
    },
    /*去除全部加载中*/
    clearLoading:function(){
    	var MaxId=parseInt(mini_dialog.id);
        for(var i=0;i<=MaxId;i++){
        	if(document.getElementById("ttkefu_d"+i)){
            	document.getElementById("ttkefu_d"+i).style.display='none';
            }
        }
    },
    sendmsg:function(){

    	/*强制留名检测*/
        if(ttkefu_isleave_name=="True"){
        	
        	var qzlmstr=this.qzlm();
            if(qzlmstr.indexOf("格式错误")>0){
               document.getElementById("ttkefuminitishi_alert").style.display="block";
               document.getElementById("ttkefuminitishi_txt_alert").innerHTML=qzlmstr;
            	//alert(qzlmstr);
                return false;
            }
            document.getElementById("sendMsgTxt_chat").value=qzlmstr;
        }    

        var sendminitxtmsg=document.getElementById("sendMsgTxt_chat").value;
        sendminitxtmsg=sendminitxtmsg.replace(/\s+/g,'');
        if(sendminitxtmsg==''){
        	return false;
        }
    	if(this.duihuaxuanze==0 && this.zhidingkefu==0){
        	/*生成客服列表*/
            if(document.getElementById("ttkefu_KfList_div")){
            	return false;
            }else{
            	document.getElementById("sendMsgTxt_chat").setAttribute("readonly","true");
                var new_script = document.createElement("script");
                //act:err:82
                new_script.src = "https://w1011.ttkefu.com/minimsg.jsp?f=0&zhidingkefu=0&fgid=3525&act=x";
                new_script.charset="utf-8";
                document.getElementsByTagName("HEAD")[0].appendChild(new_script);
            	return false;
            }
        }
       //
    	clearTimeout(times2);
		var nnntime = new Date();
		var minsec = Date.parse(nnntime) - Date.parse(mini_dialog.sendtime);
		
		if(minsec<1000&&mini_dialog.i<31 ){
        	mini_dialog.i=mini_dialog.i+1;
        }else if(mini_dialog.i>30){
        	mini_dialog.i=30; 
        }else if(mini_dialog.i>=1){
        	mini_dialog.i=mini_dialog.i-1;
        }else{
        	mini_dialog.i=0;
        }
	
		mini_dialog.sendtime=nnntime;
		if(mini_dialog.i>0 ){
        	
            document.getElementById("ttkefu_mini_tishi").innerHTML="操作太过频繁,请"+mini_dialog.i+"秒后再试";
            document.getElementById("ttkefu_mini_tishi_parent").style.display='';
            document.getElementById("sendMsgTxt_chat").setAttribute("readonly","true");
			times2=setTimeout('mini_dialog.sendmsg()',1000)
		} else {
        	document.getElementById("ttkefu_mini_tishi_parent").style.display='none';
            document.getElementById("sendMsgTxt_chat").removeAttribute("readonly");
			
            if(mini_dialog.state=="1"){
            /*对话已结束*/
                var m=document.createElement("div");
                m.id="ttkefu_closetsdiv";
                m.className="ttkefu_closetsdiv";
                m.innerHTML=mini_dialog.tshtmlheader+"当前对话已结束！"+mini_dialog.tshtmlfooter+"<div style='height:10px;padding:0px; margin:0px;font-size: 9pt;line-height: 19px;margin: 0px 0px 0px 0px;overflow: hidden; clear:both; ' class='ttkefu_jg'></div>";
                document.getElementById("ttkefucontainer").appendChild(m);
                document.getElementById("ttkefucontainer_wrapper").scrollTop=document.getElementById("ttkefucontainer_wrapper").scrollHeight;
				document.getElementById("sendMsgTxt_chat").value="";
			}else if(document.getElementById("sendMsgTxt_chat").value.length>300){
            /*聊天文字不能大于300字*/
                var m=document.createElement("div");
                m.innerHTML="<div style='padding:0px; margin:0px; text-align:center; overflow:hidden;background:#e5eaed; font-size:9pt; height:28px; line-height:28px; color:#ff0000;'>聊天文字不能大于300字!</div>";
                document.getElementById("ttkefucontainer").appendChild(m);
                document.getElementById("ttkefucontainer_wrapper").scrollTop=document.getElementById("ttkefucontainer_wrapper").scrollHeight;
            }else if(document.getElementById("sendMsgTxt_chat").value==""){
            /*聊天文字不能为空*/
                var m=document.createElement("div");
                m.innerHTML="<div style='padding:0px; margin:0px; text-align:center; overflow:hidden;background:#e5eaed; font-size:9pt; height:28px; line-height:28px; color:#ff0000;'>聊天文字不能为空!</div>";
                document.getElementById("ttkefucontainer").appendChild(m);
                document.getElementById("ttkefucontainer_wrapper").scrollTop=document.getElementById("ttkefucontainer_wrapper").scrollHeight;
            }else if(document.getElementById("sendMsgTxt_chat").value==""){
            /*接待访客模式*/
            
            }else{
            /*消息发送*/
            
                  var txtttt=document.getElementById("sendMsgTxt_chat").value;
                  txtttt=txtttt.replace("[emo]","<img alt='表情' src='https://w1011.ttkefu.com/images/face/qq/");
                  txtttt=txtttt.replace("[/emo]",".gif' />");
                  var sendtxt="<span>"+txtttt+"</span>";
                  sendtxt=sendtxt.replace(/\r\n/ig,"<br/>") ;
                  sendtxt=sendtxt.replace(/\n/ig,"<br/>") ;
                  	//图片替换
					sendtxt=sendtxt.replace(/\[img\]/ig,"<img onload=ly_pic_load.autowidth(this)  src=");
					sendtxt=sendtxt.replace(/\[\/img\]/ig," >");

                  
                  
                  //sendtxt=sendtxt.replace(" ","&nbsp;");
                  sendtxt=mini_dialog.tohtml(sendtxt);
                  
                  mini_dialog.id=mini_dialog.id+1;
                  var jsonstr="{\"datalist\":[{\"type\":\"1\",\"msg\":\""+sendtxt+"\",\"id\":\""+mini_dialog.id+"\",\"reffer\":\"0\"}]}";
 				  mini_dialog.issend=1;
                  /*form*/
                  
                  /*END---form*/
                  if(document.getElementById("sendMsgTxt_chat").value!=""){
					var dd=new Date();
                    
					var sendtxtp=dd.getHours()+":"+dd.getMinutes()+"分,访客:"+document.getElementById("sendMsgTxt_chat").value; 
                    ttkefu_Mchannel.PushTxt("2",ttkefu_Mchannel.lguseid,ttkefu_Mchannel.pushsound,sendtxtp);
                  }
                  
                  mini_dialog.addtimes();
                  mini_dialog.insertmsg(jsonstr);
                  
                  mini_dialog.getmsg({HH:"1431"});
                  
                  ttkefu_Mchannel.CloseWriting();
                  if(mini_dialog.getmsg_i>0){
                  	//连接成功后执行
                  }else{
                  	 mini_dialog.first_to_msg="{\"datalist\":[{\"type\":\"1\",\"msg\":\""+sendtxt+"\"}]}";
                  }
                  
                  
			}
		}  

    },    
    getmsg:function(MsgData){
    	/*同步网站会员登录检测*/
        if(ttkefuGetWzLgInfo_i==1 && mini_dialog.kfid>0){
				var ts_script = document.createElement("script");
				ts_script.src ="?x="+Math.random();
				document.getElementsByTagName("HEAD")[0].appendChild(ts_script);
                setTimeout(function(){
                    if(ttkefuGetWzLgInfo_i==1){
                        alert("会员登录接口请求失败");
                    }				
                },5000)	;
                
				return false;        
        }
    
        /*发消息*/
        var sendmsgtxt="",ttkefu_posturl="";
        if(mini_dialog.issend==1 || (false && document.getElementById("sendMsgTxt_chat").value!="")){
        	
            sendmsgtxt=document.getElementById("sendMsgTxt_chat").value;
            sendmsgtxt=sendmsgtxt.replace(/\r\n/ig,"<br/>") ;
            sendmsgtxt=sendmsgtxt.replace(/\n/ig,"<br/>") ;
           // sendmsgtxt=sendmsgtxt.replace(" ","&nbsp;"); 
            //sendmsgtxt=sendmsgtxt.replace(/\%/g,"%25");
        
        	//仅当点击发送时获取发送内容
            if(mini_dialog.issend==1)
            {
            	ttkefu_posturl="&txt="+escape(sendmsgtxt)+"&txti="+mini_dialog.id;
            }
            if(false && document.getElementById("sendMsgTxt_chat").value!="")
            {
                ttkefu_posturl=ttkefu_posturl+"&v="+escape(sendmsgtxt);
            }

            //仅当点击发送时清空输入框内容
        	if(mini_dialog.issend==1)
            {
            	document.getElementById("sendMsgTxt_chat").value="";
            }
            
            if(mini_dialog.dialog){
                mini_dialog.dialog=false;
                mini_dialog.iarsfirst=2;
            }
        }

        /*首次应先产生对话连接,再发送消息，因发消息post提交，无法更新当前对话状态*/


        if(mini_dialog.chatid>0){
        	mini_dialog.getmsg_i=mini_dialog.getmsg_i+1;
            mini_dialog.ycurl="https://w1011.ttkefu.com/minimsg.jsp?c="+mini_dialog.chatid+"&f="+mini_dialog.isfirst+"&fgid=3525&ki="+mini_dialog.kfid+"&ku=44630&m=0&minikhid="+mini_dialog.khid+"&w=0&z="+mini_dialog.iszhuanjie+"&zhidingkefu="+mini_dialog.zhidingkefu+"&p="+mini_dialog.p+"&dkfs=5&mini41=新消息&wp="+mini_dialog.waitno+"&mp="+mini_dialog.n+"&tS4wJ7="+sjs+"&pst="+mini_dialog.issend+ttkefu_posturl+"&l="+ttkefu_Mchannel.types+"&Gl="+MsgData.HH+"&Timer="+mini_dialog.Timer;
            
		}else{
        
            mini_dialog.ycurl="https://w1011.ttkefu.com/minimsg.jsp?f="+mini_dialog.isfirst+"&tS4wJ7="+sjs+"&kfid=3787&fgid=3525&ki="+mini_dialog.kfid+"&z="+mini_dialog.iszhuanjie+"&zhidingkefu="+mini_dialog.zhidingkefu+"&p="+mini_dialog.p+"&dkfs=5&mini38=正与&mini39=对话&wp="+mini_dialog.waitno+"&mp="+mini_dialog.n+"&pst="+mini_dialog.issend+"&minikhid="+mini_dialog.khid+ttkefu_posturl+"&Gl="+MsgData.HH;
            mini_dialog.isfirst=2;

        }

        mini_dialog.p='1';
        var new_script = document.createElement("script");
        new_script.src = mini_dialog.ycurl;
        new_script.charset="utf-8";
        document.getElementsByTagName("HEAD")[0].appendChild(new_script);
        mini_dialog.yz=0;
        //重置发送,因post快于连接提交，在连接中用该参数确认为post后的链接提交
        mini_dialog.issend=0;
        clearTimeout(mini_cytime);
        if(ttkefu_Mchannel.types==0){
        	mini_cytime=setTimeout("mini_dialog.getmsg({HH:'1501'})",5000);
        }
        //自动断开
              ttkekfu_AutoCloseTalkTs();
    },
    tishifk:function(){
        //客服上线提示imlixian:服务器端更新imlixian1访客端更新
        if(mini_dialog.imlixian1==1 && mini_dialog.imlixian==0){
        	var fk_tishimsg='{"datalist":[{"type":"3","msg":"<span style=color:#ff0000;>"+mini_dialog.kfname+"上线了</span>"}]}';
            mini_dialog.insertmsg(fk_tishimsg);
        	
            mini_dialog.imlixian1=0;
        }        
    
    },
    yuzhimsg:function(){

    	if(false && mini_dialog.chatid>0 && ttkefu_Mchannel.lguseid!='' && ttkefu_Mchannel.pme ){
        	mini_dialog.kup=1;
            ttkefu_Mchannel.Send("ttkefu_xiaoxiyuzhi"+document.getElementById("sendMsgTxt_chat").value);
            mini_dialog.kup=0;
            ttkefu_Mchannel.IsSendWriting=true;
         }
        //发送正在输入
        var sendminitxtmsg=document.getElementById("sendMsgTxt_chat").value;
        sendminitxtmsg=sendminitxtmsg.replace(/\s+/g,'');
        if(sendminitxtmsg!=''){
            ttkefu_Mchannel.IWriting();
        }        
    
         
    },
    miniwindow:function(){
        if(mini_dialog.windowstate==0)
        {
          document.getElementById("minidialog").style.height="39px";
          document.getElementById("minidialog").style.width="215px";
		  
          
          document.getElementById("ttkefu_minwindow_min").style.display="none";
          //document.getElementById("ttkefu_minwindow_max").style.background="url(https://w1011.ttkefu.com/images/maxmize.gif)  no-repeat";
          document.getElementById("ttkefu_minwindow_max").style.margin="17px 10px 0px 0px";
          
          document.getElementById("ttkefu_minwindow_close").style.display="none";
          
          document.getElementById("chat_div_main").style.display="none";
          document.getElementById("cinv_dialogtool").style.display="none";

          setCookie("miniwindowstate","1","d1");
          setTimeout(function(){mini_dialog.windowstate=1;},500);
          
          
        }
    },
    insertmsg:function(data){
      if(data!="")
      {
          var json=eval("("+data+")");
          var m=document.createElement("div");
          m.style.margin="0px";
          m.style.padding="0px";
          m.style.width="98%";
          var htmlstr="";
          var TTKfMsg="";
          var KfMsg_ls="";
          //仅针对首次发送消息产生
          for(ji=0;ji<json.datalist.length;ji++)
          {
          	if(json.datalist[ji].type=="1")
            {
            	if(json.datalist[ji].sendtime)
                {
                	htmlstr=htmlstr+"<div style='color: #999;font-size: 12px; width:100%; display:block; margin:0px; text-align: center;'>"+json.datalist[ji].sendtime+"</div>";
                }
          		htmlstr=htmlstr+mini_dialog.fkhtmlheader;
                if(json.datalist[ji].id){
                	htmlstr=htmlstr+"<div id='ttkefu_d"+json.datalist[ji].id+"' style='position:absolute;left:0px; top:6px; padding:0px; margin:0px; width:16px; height:16px;background:url(https://w1011.ttkefu.com/images/loading2.gif);'></div>";
                }
                htmlstr=htmlstr+json.datalist[ji].msg+mini_dialog.fkhtmlfooter+"<div class='ttkefu_jg' style='height:10px;padding:0px; margin:0px;font-size: 9pt; margin: 0px 0px 0px 0px;overflow: hidden; clear:both; '></div>";
                
            }
          	if(json.datalist[ji].type=="2")
            {
            	if(json.datalist[ji].sendtime)
                {
                	htmlstr=htmlstr+"<div class='ttkefu_kf_timer' style='color: #999;font-size: 12px; width:100%; display:block; margin:0px; text-align: center;'>"+json.datalist[ji].sendtime+"</div>";
                }
                
                KfMsg_ls=json.datalist[ji].msg;
                if(KfMsg_ls=="<shake1q1w>" ){
                	if(json.datalist.length==1){
                    	var ox=document.getElementById("minidialog");
                    	mini_dialog.shakeMove({obj:ox,attr:'right'});
                    }
                    KfMsg_ls="发送了一个震动";
                }
          		htmlstr=htmlstr+mini_dialog.kfhtmlheader+KfMsg_ls+mini_dialog.kfhtmlfooter+"<div class='ttkefu_jg' style='height:10px;padding:0px; margin:0px;font-size: 9pt; margin: 0px 0px 0px 0px;overflow: hidden; clear:both; '></div>";
            }
          	if(json.datalist[ji].type=="3")
            {
                if(document.getElementById("ttkefucontainer").lastChild.innerHTML.indexOf(json.datalist[ji].msg)<0)
                {
          			htmlstr=htmlstr+"<div style='width:200px; border-radius:4px;padding:0px; margin:5px auto 0px auto; text-align:center; overflow:hidden;background:#e5eaed; font-size:9pt; height:32px; line-height:32px; color:#ff0000;'>"+json.datalist[ji].msg+"</div><div class='ttkefu_jg' style='height:10px;padding:0px; margin:0px;font-size: 9pt; margin: 0px 0px 0px 0px;overflow: hidden; clear:both; '></div>";
                }
            }
          	if(json.datalist[ji].type=="4")
            {
          		htmlstr=htmlstr+"<div  style='color: #999;font-size: 12px;width:100%; display:block; margin-bottom:10px; text-align: center;clear:both;'>"+json.datalist[ji].msg+"</div>";
            }
            
          	if(json.datalist[ji].type=="5")
            {
            	/*--*/
                while(document.getElementById("ttkefu_pd")){
                	var objdiv=document.getElementById("ttkefu_pd");
                    objdiv.parentNode.removeChild(objdiv);
                }
            	m.id="ttkefu_pd";
          		htmlstr=htmlstr+"<div style=' border-radius:4px;padding:0px; margin:5px auto 0px auto; text-align:left; overflow:hidden;background:#e5eaed; font-size:9pt; line-height:18px; color:#ff0000;'>"+json.datalist[ji].msg+"</div><div class='ttkefu_jg' style='height:10px;padding:0px; margin:0px;font-size: 9pt; margin: 0px 0px 0px 0px;overflow: hidden; clear:both; '></div>";
            }
            
          	if(json.datalist[ji].type=="6")
            {
            	m.id="ttkefu_KfList_div";
          		htmlstr=htmlstr+"<div style=' border-radius:4px;padding:0px; margin:5px auto 0px auto; text-align:left; overflow:hidden;background:#ffffff; font-size:9pt; line-height:18px; color:#ff0000;' id='ttkefu_KfList'><font style='width:100%;float:left;text-indent:0px; border-bottom:1px #cccccc solid; margin:0px 0px 2px 0px;'>请选择客服</font></div><div class='ttkefu_jg' style='height:10px;padding:0px; margin:0px;font-size: 9pt; margin: 0px 0px 0px 0px;overflow: hidden; clear:both; '></div>";
                 m.innerHTML=htmlstr;
                 document.getElementById("ttkefucontainer").appendChild(m);
                TTKfMsg=json.datalist[ji].msg;
                var ttkefuii_zxs=0;
                for(var ttkefuii=0; ttkefuii<TTKfMsg.length; ttkefuii++){
                    TTKfMsg[ttkefuii].Bh=ttkefuii+1;
                    mini_dialog.CreateKfList(TTKfMsg[ttkefuii]);
                    ttkefuii_zxs=ttkefuii_zxs+1;
                    if(ttkefuii_zxs>0 && ttkefuii_zxs<TTKfMsg.length){
                    	mini_dialog.CreateKfList({a:0});
                    }
                    
                }
                document.getElementById("ttkefucontainer_wrapper").scrollTop=document.getElementById("ttkefucontainer_wrapper").scrollHeight;
                return false;
            } 
            
          	if(json.datalist[ji].type=="7")
            {
            	m.id="ttkefu_JqrList_div";
          		htmlstr=htmlstr+mini_dialog.kfhtmlheader+"<div id='ttkefu_JqrList_content_div' style='padding:0px;margin:0px;'><div style='padding: 6px 0px;width: 98%;border-bottom: 1px solid rgb(204, 204, 204); margin-bottom: 10px;'>热门问题</div></div>"+mini_dialog.kfhtmlfooter+"<div class='ttkefu_jg' style='height:10px;padding:0px; margin:0px;font-size: 9pt; margin: 0px 0px 0px 0px;overflow: hidden; clear:both; '></div>";
                m.innerHTML=htmlstr;
                document.getElementById("ttkefucontainer").appendChild(m);
                
                //
                document.getElementById("ttkefu_JqrList_content_div").parentNode.parentNode.parentNode.style.width="96%";
                document.getElementById("ttkefu_JqrList_content_div").parentNode.parentNode.parentNode.parentNode.style.width="96%";
                document.getElementById("ttkefu_JqrList_content_div").parentNode.parentNode.parentNode.parentNode.parentNode.style.width="100%";
                
                var vMsgList=json.datalist[ji].msg;
                
                for(var ttkefuii=0; ttkefuii<vMsgList.length; ttkefuii++){
                     
                      var vdivli=document.createElement("div");
                      vdivli.style.margin="0px";
                      vdivli.style.padding="2px 0px";
                      vdivli.style.width="98%";
                      vdivli.style.cursor="default";
                      //vdivli.style.borderBottom="1px #ccc solid";
                      var xh="";
                      var wt="wt";
                      var nr=vMsgList[ttkefuii].rebot_quest;
                      vdivli.setAttribute("class",wt);
                      vdivli.setAttribute("title",nr);
                      vdivli.setAttribute("vid",vMsgList[ttkefuii].id);
                      vdivli.setAttribute("rebot_answer",vMsgList[ttkefuii].rebot_answer);
                      if(vMsgList[ttkefuii].rebot_quest.length>=17){vMsgList[ttkefuii].rebot_quest=vMsgList[ttkefuii].rebot_quest.substr(0,17)+"...";};
                      vdivli.innerHTML="·"+vMsgList[ttkefuii].rebot_quest;
                      
  					  vdivli.onclick=function(){
                              mini_dialog.id=mini_dialog.id+1;
                              var sendtxt=this.getAttribute("rebot_answer");
                              var jsonstr="{\"datalist\":[{\"type\":\"1\",\"msg\":\""+sendtxt+"\",\"id\":\""+mini_dialog.id+"\",\"reffer\":\"0\"}]}";
                              mini_dialog.insertmsg(jsonstr);
                              
                              //
                              document.getElementById("ttkefu_d"+mini_dialog.id).style.display="none";
                      }
                      document.getElementById("ttkefu_JqrList_content_div").appendChild(vdivli);
                }

                document.getElementById("ttkefucontainer_wrapper").scrollTop=document.getElementById("ttkefucontainer_wrapper").scrollHeight;
                return false;
            } 
            
            
            
            /*reffer:存在临时插入不存在reffer参数.服务器反馈成功 */
            if(json.datalist[ji].reffer){
            	/*--访客发送消息等成功有时结束不掉，结束倒计时--*/
                ttkefu_noleave();
            }else{
                /*更新离开时间*/
            	ttkefu_noleave();
            }
            
          }
          if(htmlstr!="")
          {
            m.innerHTML=htmlstr;
            document.getElementById("ttkefucontainer").appendChild(m);
            //wws
            if(htmlstr.indexOf("voicesrc")>0){
				ttkefu_Event_SooundImgClick();
            }   
          }
          document.getElementById("ttkefucontainer_wrapper").scrollTop=document.getElementById("ttkefucontainer_wrapper").scrollHeight;
	  }
    },
		/*截图反馈*/
		BakCutImg:function(BakData){
               
				var vMsg=BakData.MsgData;
				if(vMsg.indexOf("_")>0){
					var vCutImg="[img]https://pic1011.ttkefu.com/?"+vMsg.split("_")[1]+"[/img]";
                    document.getElementById("sendMsgTxt_chat").value=vCutImg;
					mini_dialog.sendmsg();
				}else{
					 mini_dialog.alert("截图完成，Ctrl+V粘贴到输入框即可发送");
				}
                
		},
		/*截图插件安装检测*/
		InStallJieTu:function(){
				setCookie("ttkefu_jietu","1","d3000");
		},
		InStallJieTuCk:function(){
				
				if(getCookie("ttkefu_jietu")==""){
                			//
                            document.getElementById("ttkefu_jietu_Install_minitishi").style.display="block";
				}
		},   
    CreateKfList:function(MsgData){
                var ttkefu_font=document.createElement("font");
                
                if(MsgData.a>0){
                        ttkefu_font.id="ttkefu_font"+MsgData.a;
                        ttkefu_font.style.color="#000000";
                        ttkefu_font.style.margin="5px 0px 0px 0px";
                        ttkefu_font.style.textAlign="center";
                        ttkefu_font.style.padding="5px 0px";
                        ttkefu_font.style.cursor="pointer";
        
                        ttkefu_font.setAttribute("kf",MsgData.a);
                        ttkefu_font.setAttribute("zt",MsgData.c);
                        ttkefu_font.setAttribute("nc",MsgData.b);
                        ttkefu_font.setAttribute("gh",MsgData.e);
                        
                        var ttkefu_font_glbh=MsgData.b,ttkefu_font_zxbz=MsgData.c,ttkefu_font_bm=MsgData.d;
                        var ttkefu_font_glbhshow=ttkefu_font_glbh;
                        if(ttkefu_font_glbh.length>6){
                            ttkefu_font_glbhshow=ttkefu_font_glbh.substring(0,6)+"...";
                        }
                        var ttkefu_font_bmshow=ttkefu_font_bm;
                        if(ttkefu_font_bm.length>6){
                            ttkefu_font_bmshow=ttkefu_font_bm.substring(0,6)+"...";
                        }
                        
                        ttkefu_font.innerHTML=ttkefu_font_glbhshow+" <font style='color:#666666;'>["+ttkefu_font_bmshow+"]</font>";
                        
                        ttkefu_font.onclick=function(){
                                if(this.getAttribute("zt")=="离线"){
                                        listtana('https://w1011.ttkefu.com/conversationormessage/ourcustomerservice/customerlist/chat_boxs.jsp?R5s6eT="+this.getAttribute("kf")+"&t5Ys2R=44630&s2N6eL=this.getAttribute("gh")&fgid=3525&tS4wJ7='+sjs,this.getAttribute("nc"));
                                    
                                }else{
                                        mini_dialog.zhidingkefu=this.getAttribute("kf");
                                        mini_dialog.kfid=mini_dialog.zhidingkefu;
                                        //ie不支持remove
                                        //document.getElementById("ttkefu_KfList_div").remove(0);
                                        
                                        var miniP=document.getElementById("ttkefu_KfList_div").parentNode;
                                        miniP.removeChild(document.getElementById("ttkefu_KfList_div"));
                                        
                                        document.getElementById("sendMsgTxt_chat").removeAttribute("readonly");
                                        if(document.getElementById("sendMsgTxt_chat").value!=""){
                                        	  document.getElementById("ttkefuMiniSendbtn").click();
                                        }else{
                                        	  mini_dialog.getmsg({HH:"1980"});
                                        }
                                }
                            
                        }
                            
                        ttkefu_font.onmouseover=function(){
                            if(this.getAttribute("zt")!="离线"){
                                ttkefu_minwindow_Over(ttkefu_font);
                            }
                        }
                        
                        ttkefu_font.onmouseout=function(){
                            if(this.getAttribute("zt")!="离线"){
                                ttkefu_minwindow_Out(ttkefu_font);
                            }
                        }
                }else{
                	  //竖线
                        ttkefu_font.style.margin="5px 0px 0px 0px";
                        ttkefu_font.style.color="#cccccc";
                        ttkefu_font.style.textAlign="center";
                        ttkefu_font.style.padding="5px 0px";
                        ttkefu_font.style.cursor="pointer";
                        ttkefu_font.innerHTML=" | ";                  
                }
                
                document.getElementById("ttkefu_KfList").appendChild(ttkefu_font);
    
    },
    alert:function(msg){
        document.getElementById("ttkefuminitishi_txt_alert").innerHTML=msg;
        document.getElementById("ttkefuminitishi_alert").style.display="";    
    },
    maxwindow:function(){
    	if(mini_dialog.windowstate==1)
        {
          document.getElementById("minidialog").style.height="auto";
          document.getElementById("minidialog").style.width="300px";
          


		  
          	document.getElementById("ttkefu_minwindow_max").style.margin="15px 0px 0px 0px";
		  
          
          
          document.getElementById("ttkefu_minwindow_min").style.display="";
          //document.getElementById("ttkefu_minwindow_max").style.background="url(https://w1011.ttkefu.com/images/yxjreply0.gif)  no-repeat";
          
          
          document.getElementById("ttkefu_minwindow_close").style.display="";
          
          document.getElementById("chat_div_main").style.display="";
          document.getElementById("cinv_dialogtool").style.display="";
          mini_dialog.windowstate=0;
          document.getElementById("ttkefucontainer_wrapper").scrollTop=document.getElementById("ttkefucontainer_wrapper").scrollHeight;
          setCookie("miniwindowstate","0","d1");
        }
        else
        {

            	/*关闭当前循环以及迷你窗口*/
                document.getElementById('minidialog').style.display='none';
                clearTimeout(mini_cytime);
           		/*弹出新窗口*/
                if(mini_dialog.dialog&&mini_dialog.zhidingkefu==0)
                {
                    /*tana('2');*/
                    window.open("https://w1011.ttkefu.com/conversationormessage/ourcustomerservice/customerlist/chat_boxs.jsp?u=3525&t5Ys2R=44630&tS4wJ7="+sjs+"&fgid=3525&s2N6eL=44630&isshowstyle=1&dkfs=6&lang=0&Purl="+ttkefu_pageurl+"&Pt="+ttkefu_pagetitleLimtit(ttkefu_pagetitle)+"","44630","top=0,left=100,width=849,height=619,scrollbars=no,resizable=yes,status=no,z-look=yes,alwaysRaised=yes,location=no,depended=no,center:yes")
                }
                else
                {
                   var weburl="https://w1011.ttkefu.com/conversationormessage/ourcustomerservice/customerlist/chat_boxs.jsp?R5s6eT="+mini_dialog.zhidingkefu+"&t5Ys2R=44630&s2N6eL="+mini_dialog.use+"&fgid=3525&tS4wJ7="+sjs+"&dkfs=6&lang=0&Purl="+ttkefu_pageurl+"&Pt="+ttkefu_pagetitleLimtit(ttkefu_pagetitle);
                   window.open(weburl,"44630","top=0,left=100,width=849,height=619,scrollbars=no,resizable=yes,status=no,z-look=yes,alwaysRaised=yes,location=no,depended=no,center:yes");
                }

            
        }
    },
    closetishi:function(){
 
       if(mini_dialog.isfirst>0)
        {
          document.getElementById("ttkefuminitishiwrapperdiv").style.height="151px";
          document.getElementById("ttkefuminitishi_txt").innerHTML="是否关闭该对话？请您对我的服务给予评价！";
          document.getElementById('ttkefuminitishi').style.display='';
          document.getElementById('ttkefuminitishiwrapper').style.display='';             
          
          document.getElementById('ttkefuminiqueding').onclick=function(){mini_dialog.pingfen();}
          
                  
        }
        else
        {
        	document.getElementById("ttkefuminitishiwrapperdiv").style.height="128px";
        	document.getElementById("ttkefuminitishi_txt").innerHTML="结束对话？";
            document.getElementById('ttkefuminitishi').style.display='';
            document.getElementById('ttkefuminitishiwrapper').style.display='';    
            document.getElementById('ttkefuminiqueding').onclick=function(){mini_dialog.closewindow();}
        }
    },
    pingfen:function(){
    
        document.getElementById('ttkefuminitishi').style.display='none';
        document.getElementById('ttkefuminitishiwrapper').style.display='none';
        
        document.getElementById("ttkefuminitishiwrapperdiv").style.height="238px";
        document.getElementById('minittkefutitletxt').innerHTML='';
        document.getElementById('ttkefuminitishi_close').style.display='none';
        /*document.getElementById('ttkefuminitishi_title').style.fontWeight="normal";*/
          
        document.getElementById('ttkefuminitxtlimit').style.display='';
        document.getElementById('ttkefuminitishi_txt').innerHTML='<input type="radio" name="ttkefuminirad" checked="checked" value="1" />满意 <input type="radio" name="ttkefuminirad" value="2" />较好 <input type="radio" name="ttkefuminirad" value="3" />一般 <br /><input type="radio" name="ttkefuminirad" value="4" />较差 <input type="radio" name="ttkefuminirad" value="5" />恶劣<br />您的建议<br /><textarea name="ttkefuminitxt" id="ttkefuminitxt" style="height:71px;" cols="20"></textarea>';
        document.getElementById('ttkefuminitishi_txt').style.padding="5px 0px 5px 10px";
        document.getElementById('ttkefuminiquxiao').style.display="none";

        document.getElementById('ttkefuminiqueding').onclick=function(){mini_dialog.tijiaopingfen();}
        document.getElementById('ttkefuminitishi').style.display='';
        document.getElementById('ttkefuminitishiwrapper').style.display='';
    },
    tijiaopingfen:function(){
        document.getElementById('ttkefuminitishi').style.display='none';
        document.getElementById('ttkefuminitishiwrapper').style.display='none';
       /*关闭循环*/
       if(mini_dialog.isfirst>0)
       {
       		mini_dialog.stoploop();
       }
       
       /*数据验证*/
       var ttkefuminipftxt=document.getElementById('ttkefuminitxt').value;
       if(ttkefuminipftxt.length>150)
       {
            document.getElementById("ttkefuminitxtlimit").style.color="#ff0000";
            return;
       }
       else
       {
       	  document.getElementById("ttkefuminitxtlimit").style.color="#555555";
       }
       var mypingfen=0;
       for(var i=0;i<document.getElementsByName("ttkefuminirad").length;i++)
       {
       		if(document.getElementsByName("ttkefuminirad").item(i).checked)
            {
       			mypingfen=document.getElementsByName("ttkefuminirad").item(i).value;
            }
       }
       /*评分数据*/       
        var new_script = document.createElement("script");
        new_script.src ="https://w1011.ttkefu.com/conversationormessage/ourcustomerservice/customerlist/pingfenyemian.jsp?act=exit&pf="+mypingfen+"&jy="+encodeURIComponent(ttkefuminipftxt)+"&id="+mini_dialog.chatid;
        new_script.charset="utf-8";
        //document.getElementsByTagName("HEAD")[0].appendChild(new_script);

        
        
        /*显示窗口*/
        
        document.getElementById("ttkefuminitishiwrapperdiv").style.height="128px";
        document.getElementById('minittkefutitletxt').innerHTML="";
        document.getElementById('ttkefuminitishi_close').style.display='';
        document.getElementById('ttkefuminitishi_txt').style.padding="0px 10px 10px 20px";
        document.getElementById('ttkefuminitishi_txt').innerHTML="提交成功，谢谢"; 
        document.getElementById('ttkefuminiqueding').onclick=function(){mini_dialog.closewindow();}
        document.getElementById('ttkefuminiquxiao').style.display="none";
        document.getElementById('ttkefuminitxtlimit').style.display="none";
        document.getElementById('ttkefuminitishi').style.display='';

        document.getElementById('ttkefuminitishiwrapper').style.display='';
        
        
    },
    shoucang:function(){
         /*关闭循环*/
         if(mini_dialog.isfirst>0)
         {
              mini_dialog.stoploop();
         }
/*		if(document.all)
        {window.external.AddFavorite('','');}
        else if(window.sidebar)
        {window.sidebar.addPanel('','','')};*/
       
    },
    closetishisign:function(){
    	if(document.getElementById('ttkefuminitishi_close').style.backgroundColor=="")
        {
        	document.getElementById('ttkefuminitishi_close').style.backgroundColor="#CC0000";
            document.getElementById('ttkefuminitishi_close').style.color="#ffffff";
        }
        else
        {
        	document.getElementById('ttkefuminitishi_close').style.backgroundColor="";
            document.getElementById('ttkefuminitishi_close').style.color="#555555";
        }
    },
    closetishiwindow:function(){
    
        document.getElementById('ttkefuminitishi').style.display='none';
        document.getElementById('ttkefuminitishiwrapper').style.display='none';
        
        document.getElementById('ttkefu_jietu_Install_minitishi').style.display='none';
        document.getElementById('ttkefu_jietu_minitishiwrapper').style.display='none';
        
        document.getElementById('ttkefuminitishi_jietu').style.display='none';
        document.getElementById('ttkefuminitishi_alert').style.display='none';
        document.getElementById('ttkefuminitishiwrapper_jietu_BigImg').style.display='none';
        
    }, 
    closeBigImg:function(){
    	document.getElementById('ttkefuminitishiwrapper_jietu_BigImg').style.display='none';
    },
    closewindow:function(){
          if(mini_dialog.isfirst>0)
          {
            mini_dialog.exiturl="https://w1011.ttkefu.com/minimsg.jsp?act=exit&ki="+mini_dialog.kfid+"&minikhid="+mini_dialog.khid+"&fgid=3525&dkfs=&c="+mini_dialog.chatid;
            var new_script = document.createElement("script");
            new_script.src = mini_dialog.exiturl;
            document.getElementsByTagName("HEAD")[0].appendChild(new_script);
          }
          document.getElementById('minidialog').style.display='none';
          document.getElementById('ttkefuminitishi').style.display='none';
          document.getElementById('ttkefuminitishiwrapper').style.display='none';
          
          clearTimeout(mini_cytime);
          mini_dialog.clear(timerkkff);
          var Jsinv_text="您好请问有什么可以帮您的？";
          
          document.getElementById("ttkefucontainer").innerHTML=''+mini_dialog.kfhtmlheader+Jsinv_text+mini_dialog.kfhtmlfooter+"<div class='ttkefu_jg' style='height:10px;padding:0px; margin:0px;font-size: 9pt; margin: 0px 0px 0px 0px;overflow: hidden; clear:both; '></div>";
          
          mini_dialog.chatid=0;
          mini_dialog.kfid=0;
          mini_dialog.khid=0;
          mini_dialog.use='';
          mini_dialog.i=0;
          mini_dialog.dialog=true;
          mini_dialog.isfirst=0;
          mini_dialog.iszhuanjie=0;
          mini_dialog.zhidingkefu=0;
          mini_dialog.state='0';
          mini_dialog.p='0';
          document.getElementById("ttkefuminitishi_txt").innerHTML="是否关闭该对话？请您对我的服务给予评价！";

      
    },
    stoploop:function(){
          if(mini_dialog.isfirst>0)
          {
            mini_dialog.exiturl="https://w1011.ttkefu.com/minimsg.jsp?act=exit&ki="+mini_dialog.kfid+"&minikhid="+mini_dialog.khid+"&fgid=3525&dkfs=&c="+mini_dialog.chatid;
            var new_script = document.createElement("script");
            new_script.src = mini_dialog.exiturl;
            document.getElementsByTagName("HEAD")[0].appendChild(new_script);
            clearTimeout(mini_cytime);
            mini_dialog.clear(timerkkff);
          }
          clearTimeout(mini_cytime);
          mini_dialog.clear(timerkkff);
          var Jsinv_text="您好请问有什么可以帮您的？";
          
          document.getElementById("ttkefucontainer").innerHTML=''+mini_dialog.kfhtmlheader+Jsinv_text+mini_dialog.kfhtmlfooter+'<div style="height:10px;padding:0px; margin:0px;font-size: 9pt;line-height: 19px;margin: 0px 0px 0px 0px;overflow: hidden; clear:both; " class="ttkefu_jg"></div>';
          
          mini_dialog.chatid=0;
          mini_dialog.kfid=0;
          mini_dialog.khid=0;
          mini_dialog.use='';
          mini_dialog.i=0;
          mini_dialog.dialog=true;
          mini_dialog.isfirst=0;
          mini_dialog.iszhuanjie=0;
          mini_dialog.zhidingkefu=0;
          mini_dialog.state='0';
          mini_dialog.p='0';
    },   
    exit:function(){
          if(mini_dialog.isfirst>0)
          {
            mini_dialog.exiturl="https://w1011.ttkefu.com/minimsg.jsp?act=exit&ki="+mini_dialog.kfid+"&minikhid="+mini_dialog.khid+"&fgid=3525&dkfs=&c="+mini_dialog.chatid;
            var new_script = document.createElement("script");
            new_script.src = mini_dialog.exiturl;
            document.getElementsByTagName("HEAD")[0].appendChild(new_script);
          }
          clearTimeout(mini_cytime);
          mini_dialog.clear(timerkkff);
          var Jsinv_text="您好请问有什么可以帮您的？";
          
          document.getElementById("ttkefucontainer").innerHTML=''+mini_dialog.kfhtmlheader+Jsinv_text+mini_dialog.kfhtmlfooter+'<div class="ttkefu_jg" style="height:10px;padding:0px; margin:0px;font-size: 9pt;line-height: 19px;margin: 0px 0px 0px 0px;overflow: hidden; clear:both; "></div>';
          
          mini_dialog.chatid=0;
          mini_dialog.kfid=0;
          mini_dialog.khid=0;
          mini_dialog.use='';
          mini_dialog.i=0;
          mini_dialog.dialog=true;
          mini_dialog.isfirst=0;
          mini_dialog.iszhuanjie=0;
          mini_dialog.zhidingkefu=0;
          mini_dialog.state='0';
          mini_dialog.p='0';
          document.getElementById("sendMsgTxt_chat").setAttribute("readonly","true");
          document.getElementById("ttkefutitle").innerHTML="当前对话已结束！";
          document.getElementById("ttkefuonlineKefuName").innerHTML="";
          
    },

    AutoDkexit:function(){
          if(mini_dialog.isfirst>0)
          {
            mini_dialog.exiturl="https://w1011.ttkefu.com/minimsg.jsp?act=exit&ki="+mini_dialog.kfid+"&minikhid="+mini_dialog.khid+"&fgid=3525&dkfs=&c="+mini_dialog.chatid;
            var new_script = document.createElement("script");
            new_script.src = mini_dialog.exiturl;
            document.getElementsByTagName("HEAD")[0].appendChild(new_script);
          }
          clearTimeout(mini_cytime);
          mini_dialog.clear(timerkkff);
          mini_dialog.chatid=0;
          mini_dialog.kfid=0;
          mini_dialog.khid=0;
          mini_dialog.use='';
          mini_dialog.i=0;
          mini_dialog.dialog=true;
          mini_dialog.isfirst=0;
          mini_dialog.iszhuanjie=0;
          mini_dialog.zhidingkefu=0;
          mini_dialog.state='0';
          mini_dialog.p='0';
          document.getElementById("sendMsgTxt_chat").setAttribute("readonly","true");
          document.getElementById("ttkefutitle").innerHTML="当前对话已结束！";
          document.getElementById("ttkefuonlineKefuName").innerHTML="";
          
    },    
    sendtxtfoucs:function(){
    	mini_dialog.clear(timerkkff);
        document.getElementById("uploadFileBox1").style.display="none";
       
    },
    xmyc:function(){
    	 xmycxx=document.getElementById("ttkefu_qzlm_name");
         if(xmycxx.value=="姓名"){
            xmycxx.value="";
         }
    },
    xmxs:function(){
    	 xmycmm=document.getElementById("ttkefu_qzlm_name");
         if(xmycmm.value==""){
            xmycmm.value="姓名";
         }
    },
    QQyc:function(){
         ycqq=document.getElementById("ttkefu_qzlm_qq");
         if(ycqq.value=="QQ"){
            ycqq.value="";
         }
    },
    QQxs:function(){
           xsqq=document.getElementById("ttkefu_qzlm_qq");
         if(xsqq.value==""){
            xsqq.value="QQ";
         }
    },
    peyc:function(){
         ycpe=document.getElementById("ttkefu_qzlm_phone");
         if(ycpe.value=="手机号"){
            ycpe.value="";
         }
    },
    pexs:function(){
           xspe=document.getElementById("ttkefu_qzlm_phone");
         if(xspe.value==""){
            xspe.value="手机号";
         }
    },
    sendtxtblur:function(){
		ttkefu_Mchannel.CloseWriting();
    },
    show:function(msgtype)
    {
        /*标题栏闪烁提示*/
              var step=0, 
              _title =mini_dialog.title;
              var timer = setInterval(function(){
                               step++; 
                               if (step==3) {step=1} 
                               if (step==1) {
                                  document.title="【　　　】"+_title;
                                  document.getElementById("ttkefutitle").style.color="#FF0000";
                                  document.getElementById("ttkefuonlineKefuName").style.color="#FF0000";
                                  document.getElementById("ttkefuminidialogtitle").style.background="#FFFF00  url(https://w1011.ttkefu.com/images/kf.png) no-repeat 10px center";
                               }
                               if (step==2) {
                                  document.title="【"+msgtype+"】"+_title;
                                  document.getElementById("ttkefutitle").style.color=mini_dialog.fontcolor;
                                  document.getElementById("ttkefuonlineKefuName").style.color=mini_dialog.fontcolor;
                                  document.getElementById("ttkefuminidialogtitle").style.background=mini_dialog.titlebg+"  url(https://w1011.ttkefu.com/images/kf.png) no-repeat 10px center";}
               }, 500);
                                                
        /*声音提示*/                             
       		  document.getElementById('soundMsg').setAttribute('src','https://w1011.ttkefu.com/sound/type.mp3');
        /*如果窗口没有最大化则最大化*/
              if(mini_dialog.windowstate==1){
                  mini_dialog.maxwindow()
              }
        
        document.getElementById("sendMsgTxt_chat").focus();
        return [timer, _title];    
    }, 
	clear : function(timerArr) {
    	if(timerArr) { 
        	clearInterval(timerArr[0]);
            setTimeout(function(){document.title = timerArr[1]},500);
            document.getElementById("ttkefuminidialogtitle").style.background=mini_dialog.titlebg+"  url(https://w1011.ttkefu.com/images/kf.png) no-repeat 10px center";
            document.getElementById("ttkefutitle").style.color=mini_dialog.fontcolor;
            document.getElementById("ttkefuonlineKefuName").style.color=mini_dialog.fontcolor;
            
            } 
     },
     addtimes:function(){
        var mynowtime=new Date();
        mynowtime=mynowtime.getFullYear()+"-"+(mynowtime.getMonth()+1)+"-"+(mynowtime.getDate()+1)+" "+(mynowtime.getHours()+1)+":"+(mynowtime.getMinutes()+1)+":"+(mynowtime.getSeconds()+1);
        /*1分钟添加一次时间*/
        if(mini_dialog.GetDateDiff(mini_dialog.jstime,mynowtime,"minute")>=1)
        {
            mini_dialog.jstime=mynowtime;
            var nowday=new Date();
            var m=document.createElement("div");
            m.style.margin="0px";
            m.style.padding="0px";
            m.innerHTML="<div style='margin:0px;padding:0px;color: #999;font-size: 12px; text-align: center;'>"+nowday.getHours()+":"+nowday.getMinutes()+":"+nowday.getSeconds()+"</div>";
            document.getElementById("ttkefucontainer").appendChild(m);
            document.getElementById('ttkefucontainer').scrollTop=document.getElementById('ttkefucontainer').scrollHeight;
        }
     },
     GetDateDiff:function(startTime, endTime, diffType) { 
        /*将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式*/ 
        startTime = startTime.replace(/\-/g, "/"); 
        endTime = endTime.replace(/\-/g, "/"); 
        /*将计算间隔类性字符转换为小写*/  
        diffType = diffType.toLowerCase(); 
        var sTime = new Date(startTime); //开始时间 
        var eTime = new Date(endTime); //结束时间 
        /*作为除数的数字 */ 
        var divNum = 1; 
        switch (diffType) { 
        case "second": 
        divNum = 1000; 
        break; 
        case "minute": 
        divNum = 1000 * 60; 
        break; 
        case "hour": 
        divNum = 1000 * 3600; 0
        break; 
        case "day": 
        divNum = 1000 * 3600 * 24; 
        break; 
        default: 
        break; 
       } 
      return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum)); 
     },
	importhtml:function(){
			//获取当前页面部分内容
			var txt="<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'><html><head></head><body>";
			var tongjiwrapper=document.getElementById("ttkefucontainer").innerHTML;
			txt=txt+tongjiwrapper+"</body></html>"; 
            var mynowtime=new Date();
            mynowtime=mynowtime.getFullYear()+"-"+(mynowtime.getMonth()+1)+"-"+(mynowtime.getDate()+1);
            							  
			var htmlname="聊天记录-"+mynowtime;
			ttkefuimport.document.location="about:blank";								  
			ttkefuimport.document.open("text/html","utf-8"); 
			ttkefuimport.document.write(txt);
			ttkefuimport.document.execCommand("SaveAs", true, htmlname+'.htm');
			ttkefuimport.close(); 
	}
         
}

/**/



document.addEventListener('paste', function (event) {

        var isChrome = false;
        if (event.clipboardData || event.originalEvent) {
            //某些chrome版本使用的是event.originalEvent
            var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
            if(clipboardData.items){
                // for chrome
                var  items = clipboardData.items,
                        len = items.length,
                        blob = null;
                isChrome = true;
                for (var i = 0; i < len; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                        //getAsFile() 此方法只是living standard firefox ie11 并不支持
                        blob = items[i].getAsFile();
                    }
                }
                 console.log("len:"+len);
                if(blob!==null){
                	console.log("blob!==null");
                    var blobUrl=URL.createObjectURL(blob);
                    console.log("blobUrl="+blobUrl);
                    //blob对象显示
                    //document.getElementById("ttkefu_jietu_yulan").src=blobUrl;
                    //document.getElementById("ttkefuminitishi_jietu").style.display="";
                    
                      var reader = new FileReader();
                    //base64码显示
                     reader.onloadstart = function (event) {
                     		 console.log("reader.onloadstart");
                     }

                     reader.onprogress = function (event) {
                     		 console.log("reader.onprogress");
                     }
                     reader.onabort = function (event) {
                     		 console.log("reader.onabort");
                     }
                     //onerror
                     reader.onerror = function (event) {
                     		 console.log("reader.onerror");
                     }

                     reader.onload = function (event) {
                     		 console.log("reader.onload");
                     }
                     reader.onloadend = function (event) {
                     		 console.log("reader.onloadend");
                             // event.target.result 即为图片的Base64编码字符串
                             var base64_str = event.target.result;
                             
                             document.getElementById("ttkefu_jietu_yulan").src=base64_str;
        					 document.getElementById("ttkefuminitishi_jietu").style.display="";
                             document.getElementById("ttkefuminiqueding_jietu_val").value=base64_str;                             
                     }
                     reader.readAsDataURL(blob);
                     
                }
            }
        }
})


function ttkefu_hide(str){
document.getElementById(str).style.display='none'
}

/*访客等待超时提示：以访客发送消息成功为起始点*/
function ttkefu_FkWaitOvTime(){
	//访客聊天状态设置vip是否开启
		if(mini_dialog.AutoClose_Ok==0){
			return false;
		}

	//客服是否在线
		if(mini_dialog.imlixian==1){
			return false;
		}
	//是否处于对话结束提示中
		if(ttkefu_Mchannel.TalkTs==1){
			return false;
		}
	
	//是否正处于对话中
		if(!ttkefu_Mchannel.lg){
			return false;
		}
	
	//是否开启
		 if(ttkefu_fkwaitstate!="True"){
		 	return false;
		 }

	//是否超时
		 var Ntime=new Date();
		 var OvTime_Cha=(Ntime.getTime()-ttkefu_FkSendTime.getTime())/1000;
		 if(parseInt(OvTime_Cha)<parseInt(ttkefu_fkwaittime)){
		 	return false;
		 }

	//插入消息提示
		 ttkefu_Mchannel.InsertTs({TiShi:'\u6211\u6B63\u5728\u4E3A\u60A8\u67E5\u8BE2\u8D44\u6599\uFF0C\u8BF7\u7A0D\u5019\uFF01',type:0});
}

//访客无回复超时提示:已客服发送消息为起始点
function ttkefu_KfWaitOvTime(){
	//访客聊天状态设置vip是否开启
		if(mini_dialog.AutoClose_Ok==0){
			return false;
		}
	//客服是否在线
		if(mini_dialog.imlixian==1){
			return false;
		}

	//是否处于对话结束提示中
		if(ttkefu_Mchannel.TalkTs==1){
			return false;
		}
	
	//是否正处于对话中
		if(!ttkefu_Mchannel.lg){
			return false;
		}
	
	//是否开启
		 if(ttkefu_fknoreplystate!="True"){
		 	return false;
		 }

	//是否超时
		 var Ntime=new Date();
		 var OvTime_Cha=(Ntime.getTime()-ttkefu_KfSendTime.getTime())/1000;
		 if(parseInt(OvTime_Cha)<parseInt(ttkefu_fknoreplytime)){
		 	return false;
		 }
	//插入消息提示
		 ttkefu_Mchannel.InsertTs({TiShi:'\u5DF2\u7ECF\u5F88\u4E45\u6CA1\u6709\u6536\u5230\u60A8\u7684\u8BAF\u606F\uFF0C\u60A8\u8FD8\u6709\u5176\u4ED6\u9700\u8981\u6211\u670D\u52A1\u7684\u4E48\uFF1F',type:1});
}

//访客无操作,自动结束对话提示-以访客，客服消息发送成功为判断时间点
function ttkekfu_AutoCloseTalkTs(){
	//客服是否在线
		if(mini_dialog.imlixian==1){
			return false;
		}
	//是否处于对话结束提示中
		if(ttkefu_Mchannel.TalkTs==1){
			return false;
		}
	//是否正处于对话中
		if(!ttkefu_Mchannel.lg){
			return false;
		}
	//是否超时,单位分钟
		 var Ntime=new Date();
		 var OvTime_Cha=Ntime.getTime()-ttkefu_leavetime.getTime();
		 if(parseInt(OvTime_Cha)<parseInt(ttkefu_fkstaytime)){
		 	return false;
		 }
        
	//是否开启-关闭自动结束对话且vip功能可以使用
		 if(ttkefu_fkleavestate!="True" && mini_dialog.AutoClose_Ok==1){
		 	return false;
		 }
	//插入消息提示
		 ttkefu_Mchannel.TalkTs=1;
		 ttkefu_Mchannel.InsertTs({TiShi:'\u5982\u65E0\u5176\u5B83\u95EE\u9898\uFF0C\u7CFB\u7EDF\u5C06\u5012\u8BA1\u65F6\u7ED3\u675F\u672C\u6B21\u5BF9\u8BDD\u3002\u518D\u6B21\u54A8\u8BE2\u8BF7\u91CD\u65B0\u53D1\u8D77\uFF0C\u795D\u60A8\u6109\u5FEB\uFF0C\u518D\u89C1\uFF01',type:2});
    //倒计时开始
    	 ttkekfu_QZCloseTalk(110);
}

//友好结束对话
function ttkekfu_yhAutoCloseTalkTs(){

	//访客聊天状态设置vip是否开启
		if(mini_dialog.AutoClose_Ok==0){
			return false;
		}
	//插入消息提示
		 ttkefu_Mchannel.TalkTs=1;
		 ttkefu_Mchannel.InsertTs({TiShi:'\u5982\u65E0\u5176\u5B83\u95EE\u9898\uFF0C\u7CFB\u7EDF\u5C06\u5012\u8BA1\u65F6\u7ED3\u675F\u672C\u6B21\u5BF9\u8BDD\u3002\u518D\u6B21\u54A8\u8BE2\u8BF7\u91CD\u65B0\u53D1\u8D77\uFF0C\u795D\u60A8\u6109\u5FEB\uFF0C\u518D\u89C1\uFF01',type:2});
    //倒计时开始
    	 ttkekfu_QZCloseTalk(110);
}
//强制结束对话
var ttkefu_leavetimes=0;
function ttkekfu_QZCloseTalk(i){
		  i--;
          clearTimeout(ttkefu_leavetimes);
          if(i==0){
              /*强制结束对话*/
              mini_dialog.AutoDkexit();
          }else{
              document.getElementById("DJS"+ttkefu_Mchannel.TsId).innerHTML=i;
              clearTimeout(ttkefu_leavetimes);
              ttkefu_leavetimes=setTimeout("ttkekfu_QZCloseTalk("+i+")",1000);
          }
}
/*取消倒计时,更新自动结束对话倒计时*/
function ttkefu_noleave(){
	ttkefu_leavetime=new Date();
	clearTimeout(ttkefu_leavetimes);
	ttkefu_Mchannel.TalkTs=0;
}
onner();


/*自定义邀请*/
var FJsinv_text="您好请问有什么可以帮您的？";


document.write('<div id="ttkefuyaoqing_zdy" style="display:none;position:fixed;_position:absolute;width:110px;height:36px; background:url(https://w1011.ttkefu.com/images/ico/yq.jpg) no-repeat;z-index:999999999999999;right:0px;bottom:0px;"><div id="ttkefuyaoqing_title"  style="position: absolute;text-indent:10px; top:8px; left: 0px;height:22px; width:350px; padding: 0px; margin: 0px; overflow: hidden; text-align: left; font-weight: bold; color:#ffffff   ; font-size: 14px; background:none;" >在线客服咨询</div><div id="ttkefuyaoqing_context" style="position: absolute; top:85px; left:150px; height:100px; width:350px; padding: 0px; margin: 0px; text-align: left; font-size: 12px; background:none;color:#333333;" >'+FJsinv_text+'</div><div id="ttkefuyaoqing_refuse" onClick="ttkefuyaoqing.hide()"  style="position: absolute; top:148px; left:165px; width:92px; height:40px; margin: 0px; padding: 0px; cursor:pointer;">&nbsp;</div><div id="ttkefuyaoqing_accept" onClick="ttkefuyaoqing.startchats()" style="cursor:pointer; position: absolute; top:0px; left:0px; width:130px; height:35px; margin: 0px; padding: 0px;"></div></div>');



/*系统漂浮图标邀请*/
document.write('<div id="ttkefuyaoqing"  style="position:fixed;_position:absolute;height:190px;z-index:999999999999999;display:none;top:200px;left:'+(document.body.clientWidth-400)/2+'px"><table id="yaoqingtable" width="400" height="222" border="0" cellpadding="0" cellspacing="0" style="background:url(https://w1011.ttkefu.com/images/yc/0.jpg); width:400px; height:222px;" ><tr style="height:30px;line-height:30px;"><td colspan="4" onMouseDown="ttkefuyqdown(\'left\')" style="font-size:14px; text-align:left;color:#ffffff   ;cursor:move;background:none; padding:0px; border:none; border-top:none;"  >&nbsp;&nbsp;在线客服咨询</td><td onClick="ttkefuyaoqing.hide()" style="cursor:hand;text-align:right; background:none;padding:0px; border:none;"></td></tr><tr><td colspan="2" width="200" height="100" style="padding:0;background:none;padding:0px; border:none;">&nbsp;</td><td width="200" colspan="2" style="font-size:12px;text-align:left;text-indent:0px;padding-left:20px;vertical-align:middle;color:#333333;background:none;padding:0px; border-bottom:none;border-top:none;"  id="invtexttd">'+FJsinv_text+'<br/></td><td style="background:none;padding:0px; border:none;">&nbsp;</td></tr><tr><td height="30" colspan="2" style="background:none;padding:0px; border:none;">&nbsp;</td><td onClick="ttkefuyaoqing.hide()"  style="cursor:pointer;width:100px;height:20px;background:none;padding:0px; border:none;">&nbsp;</td><td onClick="ttkefuyaoqing.startchats()" style="cursor:pointer;height:20px;width:115px;background:none;padding:0px; border:none;">&nbsp;</td><td style="width:5%;background:none;padding:0px; border:none;" >&nbsp;</td></tr><tr><td height="33" colspan="5" style="background:none;padding:0px; border:none;">&nbsp;</td></tr></table></div>');

/*右下角小图标邀请*/
document.write('<div id="yxjwrapper" style=" display:none;width:245px; height:75px;background:url(https://w1011.ttkefu.com/images/yxjyqk.gif) ; position: fixed; _position:absolute; bottom: 0px; right: 0px;z-index: 2147483639; overflow: hidden; text-align: left;" >');
document.write('<div style="margin: 10px 0px 0px 20px;_margin: 10px 0px 0px 10px; padding: 0px;text-align:left; float:left; width:182px; height:22px; line-height:22px; font-size: 14px;font-family:宋体; overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#333333;" id="ttkefureceivetxt">'+FJsinv_text+'</div>');
document.write('<div onClick="TTclosedivname(\'yxjwrapper\')" style="cursor: pointer; width: 20px; float: left; height: 20px; margin: 8px 0px 0px 3px;cursor:pointer;"></div>');
document.write('<input type="text" style="float:left;margin:10px 0px 0px 24px ;border:none; background:#e1ff9b;" name="ttkefusendtxt" id="ttkefusendtxt" size="15" >');
document.write('<div onClick="ttkefuyaoqing.startzixun()" style="float:right; margin:10px 33px 0px 0px ;padding:0px;width:65px;height: 16px; line-height:18px;text-align:center;  color:#fff;font-size:12px;font-family:宋体; cursor:pointer;">开始咨询</div>');
document.write('</div>');

/*底部图标邀请*/
document.write('<div id="btmtishi" style="height:90px; text-align:center;  line-height:90px;  overflow:hidden;background: none repeat scroll 0 0 #202020; bottom: 0px;  display: none;left: 0;');
if(document.compatMode=="CSS1Compat" || (isFirefox=navigator.userAgent.indexOf("Firefox")>0) || (isSafari=navigator.userAgent.indexOf("Safari")>0)){document.write('position: fixed; ');}
else{document.write('position: absolute; top: expression(document.body.clientHeight+document.body.scrollTop-this.offsetHeight);');}
document.write('width: 100%; z-index:9999;opacity: 0.8;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=80); filter:alpha(opacity=80);_position: absolute;"><div style=" margin:0 auto; margin-top:35px; width:740px; clear:none;"><div style="color: #FFFFFF; height: auto; line-height: 30px;  padding:0px;"><div style="width:112px; float:right; margin-top: -5px; width:112px; height:39px; background:url(https://w1011.ttkefu.com/images/btn_ask.png); background-repeat:no-repeat;"  onclick="ttkefuyaoqing.startdg(\'btmtishi\')"></div><p id="btmtishitxt" style="font-size:30px;color:#fff; font-weight:bold; text-align:center; width:auto; height:39px; margin: 0px 25px 0px 0px; overflow:hidden;white-space:nowrap; margin-top: 0px; margin-bottom: 0px;">'+FJsinv_text+'</p></div></div><div onClick="noneAds()" style=" position:absolute; right:4px; bottom:25px; background: url(https://w1011.ttkefu.com/images/btmclose.gif) no-repeat scroll 0 0 transparent; height:21px; width:22px;float:right; top: 5px; "></div></div>');


/*迷你窗口*/


document.write('<div id="ttkefusocketdiv" style="display:none; top:5px; right:5px;  position: absolute; background:#ccc; padding:5px;" ></div>');
document.write('<div id="ttkefubgimgdivwrapper" style="text-align: center;width:88%;height:88%; left:6%; top:6%; position:fixed; _position: absolute; z-index: 8888888888; display:none;  padding:0px; margin:0px; background:#000000; -ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=50); filter:alpha(opacity=50); opacity: 0.5;"></div><div id="ttkefubgimgdivwrapper1" style="text-align: center;width:88%;height:88%; left:6%; top:6%; position:fixed; _position: absolute; z-index: 9999999999; display:none;  padding:0px; margin:0px; background:none; "><div id="ttkefubgimgdiv" style="padding: 0px;background:url(https://w1011.ttkefu.com/images/loading.gif) center no-repeat;margin:0px;opacity:1;width:100%;height:100%; position: relative;">');

document.write('<div id="ttkefu_upimg" onClick="ttkefu_upimg()" onMouseOver="ttkefu_upimg_over()" onMouseOut="ttkefu_upimg_out()" style="height:100%; width:25%; position:absolute; margin:0px; padding:0px; cursor:pointer;top:0px; left:0px; "></div>');
document.write('<div style=" width:100%; height:100%; overflow:auto; padding:0px; margin:0px;">');
document.write('<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">');
document.write('<tr><td valign="middle" align="center" id="ttkefu_imgshow"><img id="ttkefubgimg" src="" order="0" ></td></tr>');
document.write('</table></div>');
document.write('<div id="ttkefu_nextimg" onClick="ttkefu_nextimg()" onMouseOver="ttkefu_nextimg_over()" onMouseOut="ttkefu_nextimg_out()" style="height:100%; width:25%; position:absolute; margin:0px; padding:0px; cursor:pointer;top:0px; right:0px;"></div>');

document.write('<div style="position:absolute; z-index:9999; background:url(https://w1011.ttkefu.com/images/fancybox_sprite.png) no-repeat; width:35px; height:35px; top:5px; right:15px; cursor:pointer;" onClick=document.getElementById("ttkefubgimgdivwrapper").style.display="none";document.getElementById("ttkefubgimgdivwrapper1").style.display="none";></div></div></div>');

var str="<style type='text/css'>#sendMsgTxt_chat::-webkit-input-placeholder{color:#9E9E9E;}.wt:hover{background-color:"+mini_dialog.titlebg+";border-radius: 20px;}.jianjiao:before{    content: '';width: 0;height: 0;border: 6px solid transparent;border-left-color: "+mini_dialog.titlebg+";position: absolute;left: 100%;top: 15px;margin-top: -3px;}.kfjaja:before{    content: '';width: 0;height: 0;border: 6px solid transparent;border-right-color:#ededed;position: absolute;right: 100%;top: 15px;margin-top: -3px;}#tt_fkdiv a{color:#fff;text-decoration: none;}</style>";
document.write(str);

document.write('<div id="minidialog" onClick="mini_dialog.clear(timerkkff)" style="display:none; width:300px; padding:0px; margin:0px; right:0px; bottom:0px; position:fixed;_position:absolute; padding:1px;overflow:hidden; z-index:2147483640;">');
document.write('<div id="ttkefuminidialogtitle" onClick="if(mini_dialog.windowstate==1){ mini_dialog.maxwindow()}" style="width:300px;padding:0px; margin:0px; height:44px; line-height:35px; cursor: pointer; margin: 0 auto; font-family:Microsoft YaHei; text-indent:5px;font-size:13px;background:#E6941A url(https://w1011.ttkefu.com/images/kf.png) no-repeat 10px center; overflow:hidden;border-top-left-radius:3px;border-top-right-radius:3px;">');

document.write('<div id="ttkefu_minit0" style="padding:0px; width:168px;overflow: hidden; float:left; text-align:left; margin:5px 0px 0px 0px; padding:0px;"><span id="ttkefutitle" style=" background:none; display:inline; width:auto; float:none;color:#FFFFFF; padding:0px 0px 0px 32px;   height:39px; line-height:34px; font-size:16px; ">在线客服咨询</span><span id="ttkefuonlineKefuName" a="0" style="margin-left:1px; background:none;color:#FFFFFF;font-size:16px; "></span><span style="color: rgb(0, 0, 0); margin-left: 0px; display: none;" id="kefuShow">正在输入中...</span></div><div id="ttkefu_minit1" style="padding:0px; display:none; width:190px;overflow: hidden; float:left; text-align:left; margin:5px 0px 0px 0px; padding:0px;"><span id="ttkefutitle" style="color:#FFFFFF; padding:0px 0px 0px 35px;  line-height:35px; font-size:13px; height:39px; line-height:35px;">对方正在输入中...</span></div><div id="ttkefu_minwindow_min" style="background:url(https://w1011.ttkefu.com/images/close_chat_ico.gif) no-repeat;cursor:pointer; width:27px; height:25px; float:right;margin:9px 0px 0px 0px;" onClick="mini_dialog.miniwindow()"  onMouseOver="ttkefu_minwindow_Over(this)" onMouseOut="ttkefu_minwindow_Out(this)">&nbsp;</div><div id="ttkefu_minwindow_max" onClick="mini_dialog.maxwindow()"  onMouseOver="ttkefu_minwindow_Over(this)" onMouseOut="ttkefu_minwindow_Out(this)" style=" background:url(https://w1011.ttkefu.com/images/yxjreply0.gif) no-repeat;margin-right:0px; margin-top:15px; cursor:pointer; width:14px; height:21px;  float:right;"></div><div id="ttkefu_minwindow_close" style="background:url(https://w1011.ttkefu.com/images/yxjminx0.gif) no-repeat;cursor:pointer; width:14px; height:21px; float:right; margin-right:10px; margin-top:15px;" onClick="mini_dialog.miniwindow()" onMouseOver="ttkefu_minwindow_Over(this)" onMouseOut="ttkefu_minwindow_Out(this)">&nbsp;</div>');
document.write('</div>');


document.write('<div id="chat_div_main_wrapper"  style="padding:0px 1px 1px 1px; margin:0px; overflow:hidden; background:#CCCCCC;"><div id="chat_div_main" style="width:100%;padding:0px; margin:0px;height:201px; background:#fff;margin: 0 auto;overflow: hidden;font-size: 9pt;line-height: 19px;">');
document.write('<div style="padding:0px; text-align:left; margin:0px;position: relative; width:100%; height: 100%; overflow: hidden; max-width: 100%;" id="mCSB_1" class="mCustomScrollBox mCS-dark-thick">');
document.write('<div  id="ttkefucontainer_wrapper"  style="position:absolute;  padding:0px; margin:-18px 0px 0px 0px; padding:0px; width:307px; height:233px;overflow-x:hidden;overflow-y:auto;scrollbar-face-color:#d8d8d8;scrollbar-highlight-color:#d8d8d8;scrollbar-shadow-color:#d8d8d8;scrollbar-track-color:#fff;scrollbar-darkshadow-color:#d8d8d8;scrollbar-arrow-color:#d8d8d8;"><div  id="ttkefucontainer"  style="padding:0px; margin:30px 11px 0px 11px; width:275px; overflow:hidden;">');

/*context-----*/
document.write('');


document.write('<div style="padding:0px; margin:0px;font-size: 9pt;height: auto;line-height: 19px;margin:0px 0px 10px 0px;overflow: hidden; ">');
document.write('<div id="tt_kefdiv" style="padding:0px; margin:0px;margin-left:5px;padding:1px 0px 0px 0px; max-width: 100%; min-height: 22px;min-width: 60px; float:left;">');
document.write('<div style="padding:0px; margin:0px;position: relative;">');
document.write('<div style="padding:0px; margin:0px; border: 1px solid #EDEDED;border-radius: 5px 5px 5px 5px;box-shadow: 0 1px 0 #DBDBDB;">');
document.write('<div style="padding:0px; margin:0px;border-radius: 5px 5px 5px 5px; background: #EDEDED; color: #030303;  min-height: 20px; min-width: 37px;overflow: hidden;padding: 10px 10px 10px 10px;text-align: left; word-break: break-all; word-wrap: break-word;" class="kfjaja">');

document.write(FJsinv_text+'</div>');
document.write('</div>');
//document.write('<div style="padding:0px; margin:0px;background:#ffffff url(https://w1011.ttkefu.com/images/green_arrow_1.png) no-repeat ;height:8px;left: -4px;position: absolute; top: 11px; width: 11px;"></div>');
document.write('</div>');
document.write('</div>');
document.write('</div>');

/*context-----*/

document.write('</div><div style="height:25px; margin:0px; padding:0px; overflow:hidden; clear:both;"></div></div></div></div>');

document.write('<div style="padding:0px; margin:0px;cursor: pointer;width:92%; _width:92%;bottom:110px;display:none;overflow:hidden;height:22px;  background-image: -moz-linear-gradient(center top , #baec4b 10%, #addc3e 50%, #a5d33f 100%); position:absolute; border-radius:4px 4px 0 0; line-height:22px; padding:0 4px; font-size:9pt;" id="new_prompt" display="none"></div>');
document.write('<div id="cinv_dialogtool"  style="padding:0px; margin:0px;overflow: hidden; text-align: left;background:#F5F7F8; ">');
document.write('<div id="ttkefu_mini_tishi_parent" style="position:absolute; width:100%; height:32px; line-height:32px; margin:4px 0px 0px 0px; text-align:center; display:none;"><div id="ttkefu_mini_tishi" style=" width:290px; line-height:32px; background:#ffffff;  font-size:12px; color:rgb(244, 156, 156); padding:0px; margin:0px 0px 0px 3px; height:32px; text-align:center;display:none; border:1px #ebf0f2 solid; "></div></div>');

document.write('<div class="chat_tool_bar" style="width:100%;padding:0px; margin:0px; height:41px; margin:0 auto;">');
document.write('<ul style="margin:0px; padding:0px;width:100%;">');
document.write('<li style=" list-style:none; float:left; width:25px; height:25px; line-height:25px; margin:8px 0px 0px 4px;background: url(https://w1011.ttkefu.com/images/server/css/tool.gif) no-repeat;background-position: 0px -25px;" onMouseOut="c_tools_style(0,this)" onMouseOver="c_tools_style(1,this)" onClick="document.getElementById(\'uploadFileBox1\').style.display=\'block\';"  title="表情" id="ttkefu_biaoqing">&nbsp;</li>');
document.write('<li style=" list-style:none; float:left; width:25px; height:25px; line-height:25px; margin:8px 0px 0px 4px; " onMouseOut="c_tools_style(0,this)" onMouseOver="c_tools_style(1,this)"   title="截图" id="ttkefu_jietu"><iframe id="ttkefu_jietuIframe" name="ttkefu_jietuIframe"  src="https://pic1011.ttkefu.com/MiniCut.ttkefu?zh=44630" style="width:120px; height:20px; border:0px; " scrolling="no" frameborder="0" ></iframe></li>');

document.write('<li style=" list-style:none; float:right; width:25px; height:25px; line-height:25px; margin:3px 4px 0px 0px;margin:8px 4px 0px 0px;background: url(https://w1011.ttkefu.com/images/server/css/tool.gif) no-repeat;background-position: 0px -252px;" onMouseOut="c_tools_style(0,this)" onMouseOver="c_tools_style(1,this)" onClick="mini_dialog.importhtml()" title="导出聊天记录  " id="switch">&nbsp;</li>');
document.write('</ul></div>');

document.write('<div style="width:100%;padding:0px; margin:0px;height:63px; margin:0 auto; overflow:hidden; background:#fff;">');<!--onfocus="mini_dialog.sendtxtfoucs()" onblur="mini_dialog.sendtxtblur()" -->
document.write('<textarea onKeyPress="return keypress(event);" onfocus="mini_dialog.sendtxtfoucs()" onblur="mini_dialog.sendtxtblur()"  id="sendMsgTxt_chat" name="sendMsgTxt_chat" placeholder="可输入文字或粘贴截图" style="width:100%; height:63px;outline:none;padding:1px 0px 0px 2px;color:#00f; float:left; font-size:12px; background:#fff; border:none; overflow-y:auto; line-height:19px; border-bottom:1px solid #e8e8e8;" class="chat_text" autocomplete="off" onfocus="document.getElementById(\'uploadFileBox1\').style.display=\'none\';" onKeyUp="mini_dialog.yuzhimsg()"></textarea>');

document.write('<div id="ttkefu_qzlmDIv" style="magin:0px; padding:5px;  display:none; text-align: center;font-size: 12px;" >');
document.write('&nbsp;&nbsp;系统设置了先留信息再对话');
document.write('<hr style="margin:5px auto 3px auto; padding:0px; width:97%;height:0px;border-top: 0px; border: 1px inset #FFFFFF;" />');
 
document.write('&nbsp;&nbsp;<input id="ttkefu_qzlm_name" name="ttkefu_qzlm_name" onFocus="mini_dialog.xmyc()" onBlur="mini_dialog.xmxs()" value="姓名" style="magin:0px; padding:0px; width:47px; height:22px;color: #BEC2C3;border:1px solid #D4CCCC; font-size:12px" />');
document.write('&nbsp;&nbsp;<input id="ttkefu_qzlm_qq" name="ttkefu_qzlm_qq" onFocus="mini_dialog.QQyc()" onBlur="mini_dialog.QQxs()" value="QQ" style="magin:0px; padding:0px; width:50px;  height:22px;color: #BEC2C3;border:1px solid #D4CCCC; font-size:12px" />');
document.write('&nbsp;&nbsp;<input id="ttkefu_qzlm_phone" name="ttkefu_qzlm_phone" onFocus="mini_dialog.peyc()" onBlur="mini_dialog.pexs()" value="手机号" style="magin:0px; padding:0px; width:86px; height:22px;color: #BEC2C3;border:1px solid #D4CCCC; font-size:12px" />');

document.write('</div>');

document.write('</div>');
document.write('<div  style="width:100%;padding:0px; margin:0px; height:53px;">');
document.write('<a href="https://www.ttkefu.com" target="_blank" style="text-decoration:none;"><span style="margin:23px 0px 0px 5px;padding:0px; font-size:12px;float:left;color:#999;font-family:Arial, Helvetica, sans-serif; background:none; line-height:18px; height:auto; width:auto;" id="ttkefu_linkstate">ttkefu</span></a>');
document.write('<div class="foot_btn_out" style="padding:0px; width:133px; height:21px; float:right; line-height:21px;margin:5px 0px 0px 0px;  ">');
document.write('<p onClick="mini_dialog.closetishi()" style=" margin:13px 4px 0px 0px; padding:0px;width: 66px;height: 21px; color:#828282;float: left;text-align: center;border: none; font-size:12px;color: #828282;cursor: pointer;">结束对话</p><p style="margin:10px 9px 0px 0px; cursor:pointer; padding:0px; width:54px; height:24px; text-align:center; line-height:24px; float:right; color:#ffffff;background:#E6941A; font-size:12px;" onClick="mini_dialog.yz=1;mini_dialog.sendmsg()" onMouseOver="ttkefu_minwindow_Over(this)" onMouseOut="ttkefu_minwindow_Out(this)" id="ttkefuMiniSendbtn">发送</p>');
document.write('</div></div></div></div></div>');
if(window.navigator.userAgent.toLowerCase().indexOf("msie")>0)
{
	document.write('<bgsound id="soundMsg"><bgsound id="soundfile">');
}
else
{
	document.write('<audio id="soundMsg" autoplay="autoplay" ></audio><audio id="soundfile" autoplay="autoplay" ></audio>');
}
document.write('<iframe name="ttkefuimport" style="display:none" width="0" height="0"></iframe>');
/*迷你窗口表情-----*/
document.write('<div id="uploadFileBox1" style="padding:0px; margin:0px;border: 1px solid #CCCCCC; bottom: 125px; padding:3px; right:10px;overflow: hidden; position: absolute; position:fixed; width: 280px;z-index:2147483641;display:none;">');
document.write('<table width="100%" border="0" cellpadding="0" cellspacing="1" bgcolor="#dfe6f6">');
document.write('<tr>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'1\')"   src="https://w1011.ttkefu.com/images/face/qq/1.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'2\')"   src="https://w1011.ttkefu.com/images/face/qq/2.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'3\')"   src="https://w1011.ttkefu.com/images/face/qq/3.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'4\')"   src="https://w1011.ttkefu.com/images/face/qq/4.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'5\')"   src="https://w1011.ttkefu.com/images/face/qq/5.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'6\')"   src="https://w1011.ttkefu.com/images/face/qq/6.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'7\')"   src="https://w1011.ttkefu.com/images/face/qq/7.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'8\')"   src="https://w1011.ttkefu.com/images/face/qq/8.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'9\')"   src="https://w1011.ttkefu.com/images/face/qq/9.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'10\')"   src="https://w1011.ttkefu.com/images/face/qq/10.gif" /></td></tr>');
document.write('<tr>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'11\')"   src="https://w1011.ttkefu.com/images/face/qq/11.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'12\')"   src="https://w1011.ttkefu.com/images/face/qq/12.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'13\')"   src="https://w1011.ttkefu.com/images/face/qq/13.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'14\')"   src="https://w1011.ttkefu.com/images/face/qq/14.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'15\')"   src="https://w1011.ttkefu.com/images/face/qq/15.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'16\')"   src="https://w1011.ttkefu.com/images/face/qq/16.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'17\')"   src="https://w1011.ttkefu.com/images/face/qq/17.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'18\')"   src="https://w1011.ttkefu.com/images/face/qq/18.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'19\')"   src="https://w1011.ttkefu.com/images/face/qq/19.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'20\')"   src="https://w1011.ttkefu.com/images/face/qq/20.gif" /></td>');
document.write('</tr>');
document.write('<tr>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'21\')"   src="https://w1011.ttkefu.com/images/face/qq/21.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'22\')"   src="https://w1011.ttkefu.com/images/face/qq/22.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'23\')"   src="https://w1011.ttkefu.com/images/face/qq/23.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'24\')"   src="https://w1011.ttkefu.com/images/face/qq/24.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'25\')"   src="https://w1011.ttkefu.com/images/face/qq/25.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'26\')"   src="https://w1011.ttkefu.com/images/face/qq/26.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'27\')"   src="https://w1011.ttkefu.com/images/face/qq/27.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'28\')"   src="https://w1011.ttkefu.com/images/face/qq/28.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'29\')"   src="https://w1011.ttkefu.com/images/face/qq/29.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'30\')"   src="https://w1011.ttkefu.com/images/face/qq/30.gif" /></td>');
document.write('</tr>');
document.write('<tr>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'31\')"   src="https://w1011.ttkefu.com/images/face/qq/31.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'32\')"   src="https://w1011.ttkefu.com/images/face/qq/32.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'33\')"   src="https://w1011.ttkefu.com/images/face/qq/33.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'34\')"   src="https://w1011.ttkefu.com/images/face/qq/34.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'35\')"   src="https://w1011.ttkefu.com/images/face/qq/35.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'36\')"   src="https://w1011.ttkefu.com/images/face/qq/36.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'37\')"   src="https://w1011.ttkefu.com/images/face/qq/37.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'38\')"   src="https://w1011.ttkefu.com/images/face/qq/38.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'39\')"   src="https://w1011.ttkefu.com/images/face/qq/39.gif" /></td>');
document.write('<td style="width:26px; height:25px; text-align:center; background:#ffffff; padding:0px;margin:0px;"><img  style="cursor:hand;width:20px; height:20px;"  onClick="setemo(\'40\')"   src="https://w1011.ttkefu.com/images/face/qq/40.gif" /></td>');
document.write('</tr>');
document.write('</table>');
document.write('</div>');

/*关闭提醒-----*/
document.write('<div id="ttkefuminitishi" style="display:none; margin:0px; padding:0px; position:fixed; _position:absolute;z-index:2147483643;bottom:25px;right:28px; width:220px; height:250px;text-align:center;">');
document.write('<div id="ttkefuminitishidiv" style="margin: 7px auto 0; padding:0px;background:#FFF;display:block;font-weight:normal;width:218px; overflow:hidden; ">');
document.write('<div id="ttkefuminitishi_title" style=" margin:0px; padding:0px;height:28px;line-height:28px;text-align:left;font-size:12px; color:#555; font-weight:bold; font-family:宋体;padding:0 0 0 8px;width:auto;cursor:default;">');
document.write('<div id="ttkefuminitishi_close" style="margin:4px 6px 4px 0; padding:0px;float:right;width:20px;height:20px;line-height:20px;font-size:16px;font-weight:bold;color:#555;text-align:center;cursor:pointer;" onMouseOver="mini_dialog.closetishisign()" onMouseOut="mini_dialog.closetishisign()" onClick="mini_dialog.closetishiwindow()" >×</div><span id="minittkefutitletxt"></span>');
document.write('</div>');
document.write('<div id="ttkefuminitishi_content" style="margin:0px;padding:0px;">');
document.write('<div id="ttkefuminitishi_txt" style=" margin:0px;padding:0px 10px 10px 20px;color: #555; font-family:宋体;font-size: 12px;text-align:center; line-height:22px;">是否关闭该对话？请您对我的服务给予评价！</div>');
document.write('<div id="ttkefuminitishi_submit" style=" margin:0px;padding:7px 10px 8px 15px; text-align:center; background:#fff;"><span id="ttkefuminitxtlimit" style="display:none;font-size:12px; color:#555;font-family:宋体;">150字内&nbsp;&nbsp;</span><span id="ttkefuminiqueding" style="margin:0px;padding:6px 18px 6px 18px;background:'+mini_dialog.titlebg+';  font-size:12px; font-family:宋体; color:#ffffff; text-align:center; cursor:pointer;">确定</span> <span id="ttkefuminiquxiao" style="margin:0px;padding:6px 18px 6px 18px;border: 1px '+mini_dialog.titlebg+' solid; font-size:12px;font-family:宋体; color:'+mini_dialog.titlebg+'; text-align:center; cursor:pointer;margin-left: 15px;" onClick="mini_dialog.closetishiwindow()">取消</span></div>');
document.write('</div>');
document.write('</div>');
document.write('</div>');

document.write('<div id="ttkefuminitishiwrapper" style="display:none; margin:0px; padding:0px;position:fixed; _position:absolute;z-index:2147483642;bottom:28px;right:18px; width:240px; height:250px;text-align:center;">');
document.write('<div id="ttkefuminitishiwrapperdiv" style=" margin:0px;border-radius: 12px; padding:0px;background:#fff; border:0px #000 solid; box-shadow: 0 3px 26px rgba(0, 0, 0, 0.4);  width:218px;height:151px; margin:auto;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=50); filter:alpha(opacity=50); "></div>');
document.write('</div>');
/*End关闭提醒-----*/


/*自定义alert-----*/
document.write('<div id="ttkefuminitishi_alert" style="display:none; margin:0px; padding:0px; position:fixed; _position:absolute;z-index:9999999999;bottom:95px;right:28px; width:240px; height:130px;text-align:center;">');
document.write('<div id="ttkefuminitishidiv_alert" style="margin: 8px auto 0; padding:0px;background:#FFF;border:0px solid #666;display:block;font-weight:normal;width:175px; overflow:hidden; border-radius: 12px; box-shadow: rgba(0, 0, 0, 0.4) 0px 3px 26px;">');
document.write('<div id="ttkefuminitishi_title_alert" style=" margin:0px; padding:0px;height:28px;line-height:28px;text-align:left;font-size:12px; color:#555; font-weight:bold; font-family:宋体; padding:0 0 0 8px;width:auto;cursor:default;">');
document.write('<div id="ttkefuminitishi_close_alert" style="margin:4px 6px 4px 0; padding:0px;float:right;width:20px;height:20px;line-height:20px;font-size:16px;font-weight:bold;color:#555;text-align:center;cursor:pointer;" onMouseOver="mini_dialog.closetishisign()" onMouseOut="mini_dialog.closetishisign()" onClick="mini_dialog.closetishiwindow()" >×</div><span id="minittkefutitletxt"></span>');
document.write('</div>');
document.write('<div id="ttkefuminitishi_content_alert" style="margin:0px;padding:0px;">');
document.write('<div id="ttkefuminitishi_txt_alert" style=" margin:0px;padding:0px 10px 10px 10px;color: #555; font-family:宋体;font-size: 12px;text-align:center; line-height:22px;">是否关闭该对话？请您对我的服务给予评价！</div>');
document.write('<div id="ttkefuminitishi_submit_alert" style=" margin:0px;padding:7px 10px 20px 10px; text-align:center;"><span id="ttkefuminiqueding_alert" onClick="mini_dialog.closetishiwindow()" style="margin:0px;padding:6px 18px 6px 18px;background:'+mini_dialog.titlebg+';  font-size:12px; font-family:宋体; color:#ffffff; text-align:center; cursor:pointer;">确定</span></div>');
document.write('</div>');
document.write('</div>');
document.write('</div>');

document.write('<div id="ttkefuminitishiwrapper_alert" style="display:none; margin:0px; padding:0px;position:fixed; _position:absolute;z-index:2147483642;bottom:28px;right:18px; width:240px; height:250px;text-align:center;">');
document.write('<div id="ttkefuminitishiwrapperdiv_alert" style=" margin:0px; padding:0px;background:#666; border:1px #000 solid; box-shadow: 0 3px 26px rgba(0, 0, 0, 0.9);  width:238px;height:151px; margin:auto;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=50); filter:alpha(opacity=50); opacity: 0.5; "></div>');
document.write('</div>');
/*End自定义alert-----*/



/*截图预览-----*/
document.write('<div id="ttkefuminitishi_jietu" style="display:none; margin:0px; padding:0px; position:fixed; _position:absolute;z-index:2147483643;bottom:25px;right:28px; width:220px; height:250px;text-align:center;">');
document.write('<div id="ttkefuminitishidiv_jietu" style="margin: 8px auto 0; padding:0px;background:#FFF;border:0px solid #666;display:block;font-weight:normal;width:218px; overflow:hidden; border-radius: 12px; box-shadow: rgba(0, 0, 0, 0.4) 0px 3px 26px;">');
document.write('<div id="ttkefuminitishi_title_jietu" style=" margin:0px; padding:0px;height:28px;line-height:28px;text-align:left;font-size:12px; color:#555; font-weight:bold; font-family:宋体;padding:0 0 0 8px;width:auto;cursor:default;">');
document.write('<div id="ttkefuminitishi_close_jietu" style="margin:4px 6px 4px 0; padding:0px;float:right;width:20px;height:20px;line-height:20px;font-size:16px;font-weight:bold;color:#555;text-align:center;cursor:pointer;" onMouseOver="mini_dialog.closetishisign()" onMouseOut="mini_dialog.closetishisign()" onClick="mini_dialog.closetishiwindow()" >×</div><span id="minittkefutitletxt"></span>');
document.write('</div>');
document.write('<div id="ttkefuminitishi_content_jietu" style="margin:0px;padding:0px;">');
document.write('<div id="ttkefuminitishi_txt_jietu" style="height:120px; margin:0px;padding:0px 10px 10px 10px;color: #555; font-family:宋体;font-size: 12px;text-align:center; line-height:22px;"><img id="ttkefu_jietu_yulan" src="" style="max-width:120px; max-height:90px;" ></div>');
document.write('<div id="ttkefuminitishi_submit_jietu" style=" margin:0px;padding:7px 10px 20px 10px; text-align:center; background:#fff;"><span id="ttkefuminitxtlimit" style="display:none;font-size:12px; color:#555;font-family:宋体;">150字内&nbsp;&nbsp;</span><span id="ttkefuminiqueding_jietu" style="margin:0px;padding:6px 18px 6px 18px;background:'+mini_dialog.titlebg+';  font-size:12px; font-family:宋体; color:#ffffff; text-align:center; cursor:pointer;">发送</span><input type="hidden" id="ttkefuminiqueding_jietu_val" value="" > <span id="ttkefuminiquxiao_jietu" style="margin:0px;padding:6px 18px 6px 18px; border: 1px solid '+mini_dialog.titlebg+'; font-size:12px;font-family:宋体; color:'+mini_dialog.titlebg+'; text-align:center; cursor:pointer;margin-left: 10px;" onClick="mini_dialog.closetishiwindow()">取消</span></div>');
document.write('</div>');
document.write('</div>');
document.write('</div>');

document.write('<div id="ttkefuminitishiwrapper_jietu" style="display:none; margin:0px; padding:0px;position:fixed; _position:absolute;z-index:2147483642;bottom:28px;right:18px; width:240px; height:250px;text-align:center;">');
document.write('<div id="ttkefuminitishiwrapperdiv_jietu" style=" margin:0px; padding:0px;background:#666; border:1px #000 solid; box-shadow: 0 3px 26px rgba(0, 0, 0, 0.9);  width:238px;height:151px; margin:auto;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=50); filter:alpha(opacity=50); opacity: 0.5; "></div>');
document.write('</div>');
/*End截图预览-----*/


/*截图预览-大图展示-----*/
document.write('<div id="ttkefuminitishiwrapper_jietu_BigImg" style="display:none; margin:0px; padding:0px;position:fixed; _position:absolute;z-index:2147483642;bottom:28px;right:18px; width:100%; height:100%;text-align:center;">');
document.write('<div id="ttkefuminitishiwrapperdiv_jietu_BigImg" style=" margin:0px; padding:0px;background:#666; border:1px #000 solid; box-shadow: 0 3px 26px rgba(0, 0, 0, 0.9);  width:100%;height:100%; margin:auto;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=50); filter:alpha(opacity=50); opacity: 0.5; ">');
document.write('<img id="ttkefu_jietu_yulan_BigImg" src="" style="max-width:90%; max-height:90%;" >');
document.write('<div id="ttkefuminitishi_close_jietu" style="margin:0px; padding:0px; position:fixed; z-index:99999999999;width:50px;height:50px;line-height:50px;font-size:48px;font-weight:bold;color:#ffffff;text-align:center;cursor:pointer;top:0px; right:20px;" onMouseOver="mini_dialog.closetishisign()" onMouseOut="mini_dialog.closetishisign()" onClick="mini_dialog.closeBigImg()" >×</div>');
document.write('</div>');
document.write('</div>');
/*End截图预览-大图展示-----*/


/*下载截图插件-----*/
document.write('<div id="ttkefu_jietu_Install_minitishi" style="display:none; margin:0px; padding:0px; position:fixed; _position:absolute;z-index:2147483643;bottom:25px;right:28px; width:220px; height:250px;text-align:center;">');
document.write('<div id="ttkefu_jietu_minitishidiv" style="margin: 8px auto 0; padding:0px;background:#FFF;border:0px solid #666;border-radius: 12px;box-shadow: rgba(0, 0, 0, 0.4) 0px 3px 26px;display:block;font-weight:normal;width:218px; overflow:hidden; ">');
document.write('<div id="ttkefu_jietu_minitishi_title" style=" margin:0px; padding:0px;height:28px;line-height:28px;text-align:left;font-size:12px; color:#555; font-weight:bold; font-family:宋体; padding:0 0 0 8px;width:auto;cursor:default;">');
document.write('<div id="ttkefu_jietu_minitishi_close" style="margin:4px 6px 4px 0; padding:0px;float:right;width:20px;height:20px;line-height:20px;font-size:16px;font-weight:bold;color:#555;text-align:center;cursor:pointer;" onMouseOver="mini_dialog.closetishisign()" onMouseOut="mini_dialog.closetishisign()" onClick="mini_dialog.closetishiwindow()" >×</div><span id="minittkefutitletxt"></span>');
document.write('</div>');
document.write('<div id="ttkefu_jietu_minitishi_content" style="margin:0px;padding:0px;">');
document.write('<div id="ttkefu_jietu_minitishi_txt" style=" margin:0px;padding:0px 10px 20px 10px;color: #555; font-family:宋体;font-size: 14px;text-align: center; line-height:27px;">尚未安装ttkefu截图插件<br/><a style="color:#00E;text-decoration: none;" href="https://w1011.ttkefu.com/conversationormessage/ourcustomerservice/customerlist/setupjietu.exe" target="_blank" class="layui-btn layui-btn-normal" >安装截图插件</a></div>');
document.write('</div>');
document.write('</div>');
document.write('</div>');

document.write('<div id="ttkefu_jietu_minitishiwrapper" style="display:none; margin:0px; padding:0px;position:fixed; _position:absolute;z-index:2147483642;bottom:28px;right:18px; width:240px; height:250px;text-align:center;">');
document.write('<div id="ttkefu_jietu_minitishiwrapperdiv" style=" margin:0px; padding:0px;background:#666; border:1px #000 solid; box-shadow: 0 3px 26px rgba(0, 0, 0, 0.9);  width:238px;height:151px; margin:auto;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=50); filter:alpha(opacity=50); opacity: 0.5; "></div>');
document.write('</div>');
/*End下载截图插件-----*/


//
document.getElementById("ttkefuminiqueding_jietu").onclick=function(){

    
    	
        document.getElementById("ttkefuminitishi_txt_alert").innerHTML="未开通";
        document.getElementById("ttkefuminitishi_alert").style.display="";
        
    	return false;
    

	mini_dialog.closetishiwindow();
    var base64Ary=document.getElementById("ttkefuminiqueding_jietu_val").value.split(',');
    var base64=base64Ary[1];				 
    frames["ttkefu_jietuIframe"].postMessage({type:1,base64:base64,abcname:"123.jpg"}, '*');

}

if(document.getElementById("ttkefuyaoqing"))
{
	document.getElementById("ttkefuyaoqing").style.left=document.body.scrollLeft+document.body.clientWidth/2-160;
}

/*截图大图显示*/
document.getElementById("ttkefu_jietu_yulan").onclick=function(){
    
    /**/
    document.getElementById("ttkefu_jietu_yulan_BigImg").src=this.src;    
	document.getElementById("ttkefuminitishiwrapper_jietu_BigImg").style.display="";
}



var ttkefuyaoqing={
	kfid:0,kgid:0,kfnicheng:'',
	show:function(str,kfid,kgid,nicheng){
		if(kfid){this.kfid=kfid}if(kgid){this.kgid=kgid}
		document.getElementById("ttkefuyaoqing").style.display="block";
        if(typeof(nicheng)!="undefined")
        {this.kfnicheng=nicheng;}
	},
	showtishi:function(strtext,ycolor,kfid,kgid,nicheng){
		if(kfid){this.kfid=kfid}if(kgid){this.kgid=kgid}
        if(typeof(ycolor)!="undefined"&& ycolor!="")
        {
        document.getElementById("yaoqingtable").style.backgroundImage="url(https://w1011.ttkefu.com/images/yc/"+ycolor+".jpg)";
        }
        if(typeof(strtext)!="undefined" && strtext.length>1)
        {
        document.getElementById("invtexttd").innerHTML=strtext;
        }
		document.getElementById("ttkefuyaoqing").style.display="block";
        if(typeof(nicheng)!="undefined")
        {this.kfnicheng=nicheng;}
	},
	showzdytishi:function(strtext,ycolor,kfid,kgid,nicheng){
		if(kfid){this.kfid=kfid}if(kgid){this.kgid=kgid}
        if(typeof(strtext)!="undefined" && strtext.length>1)
        {
        document.getElementById("ttkefuyaoqing_context").innerHTML=strtext;
        }
		document.getElementById("ttkefuyaoqing_zdy").style.display="block";
        if(typeof(nicheng)!="undefined")
        {this.kfnicheng=nicheng;}
	},
    
	showyxjtishi:function(strtext,kfid,kgid,nicheng){
		if(kfid){this.kfid=kfid}if(kgid){this.kgid=kgid}
        
        if(typeof(strtext)!="undefined" && strtext.length>1)
        {
 		document.getElementById("ttkefureceivetxt").innerHTML=strtext;
		}
        if(typeof(nicheng)!="undefined")
        {
        document.getElementById("sendpeople0").innerHTML=nicheng;
        document.getElementById("sendpeople1").innerHTML=nicheng;
        this.kfnicheng=nicheng;
        }
		document.getElementById("yxjwrapper").style.display="block";
	},
	showbtmtishi:function(strtext,kfid,kgid,nicheng){
		if(kfid){this.kfid=kfid}if(kgid){this.kgid=kgid}
        if(typeof(strtext)!="undefined" && strtext.length>1)
        {
 		document.getElementById("btmtishitxt").innerHTML=strtext;
        }
        if(typeof(nicheng)!="undefined")
        {this.kfnicheng=nicheng;}
		addCount();
	},
    showminitishi:function(){
        /*如窗口隐藏则显示:显示状态以后台设置为准miniwindowstate:0.最大化1.最小化,mini_zs:0.最大化1.最小化*/
              if (getCookie('miniwindowstate')=='1' && mini_dialog.mini_zs=='1') {
                  mini_dialog.miniwindow();
              }
    		  document.getElementById("minidialog").style.display="block";
    },    
	hide:function(){
		document.getElementById("ttkefuyaoqing_zdy").style.display="none";
        document.getElementById("ttkefuyaoqing").style.display="none";
	},
	startchats:function(){
		document.getElementById("ttkefuyaoqing_zdy").style.display="none";
        document.getElementById("ttkefuyaoqing").style.display="none";
		if(this.kfid==0){
			tana('0');
		}else{
			tanb(this.kfid,this.kgid,'0',this.kfnicheng);
		}
	},
	startzixun:function(){
		document.getElementById("yxjwrapper").style.display="none";
        var sendstr=document.getElementById("ttkefusendtxt").value;
		if(this.kfid==0){
			tanac(sendstr,'0');
		}else{
			tanbc(this.kfid,this.kgid,sendstr,'0',this.kfnicheng);
		}
	},
	startdg:function(wrapperdivname){
		noneAds();        
		if(this.kfid==0){
			tana('0');
		}else{
			tanb(this.kfid,this.kgid,'0',this.kfnicheng);
		}
	}
     
};
var btmtime = 300; 
var btmh = 0;
function addCount() 
{ 
   
    if(btmtime>0) {  btmtime--;  btmh = btmh+5;  }
    else {btmtime=300;  return; } 
    if(btmh>90)   { btmh=0; return; } //高度
    document.getElementById("btmtishi").style.display = ""; 
    document.getElementById("btmtishi").style.height = btmh+"px"; 
    setTimeout("addCount()",30); 
} 

var btmT = 300; 
var btmN = 90; //高度 
function noneAds() 
{ 
    if(btmT>0) { btmT--; btmN= btmN-5; } 
    else  { btmT=300; return;  } 
    if(btmN<0) 
    {  document.getElementById("btmtishi").style.display = "none"; 
       btmN=90;
       return; 
    } 
    document.getElementById("btmtishi").style.height = btmN+"px"; 
    setTimeout("noneAds()",30); 
} 
function replydivname(str)
{
	document.getElementById(str).style.display="block";
}
/*---------------------------------迷你窗口相关操作---------------------------------------------------------------*/
/*插入表情*/
document.getElementById("ttkefu_biaoqing").click=function(){
	document.getElementById("uploadFileBox1").style.display='block';
}

/*最大化，最小化，关闭按钮，发送按钮特效*/
function ttkefu_minwindow_Over(obj)
{
		var scan_ttkefu=ttkefu_getBrowserInfo();
        if(scan_ttkefu.browser=="msie"){
        	obj.style.filter="alpha(opacity=40)";
        }else{
			obj.style.opacity="0.4";        
        }
}
/*聊天图左右切换*/
function ttkefu_upimg() {
		
		var up_img=parseInt(document.getElementById("ttkefubgimg").getAttribute("order"))-1;
        if(up_img>=0){
        		if(up_img==0){
                	document.getElementById("ttkefu_upimg").style.background="none";
                }
        
        	    document.getElementById("ttkefubgimg").src=ly_pic_load.ImgData[up_img].Isrc;
                document.getElementById("ttkefubgimg").setAttribute("origewidth",ly_pic_load.ImgData[up_img].Iorigewidth);
                document.getElementById("ttkefubgimg").setAttribute("origeheight",ly_pic_load.ImgData[up_img].Iorigeheight);
                document.getElementById("ttkefubgimg").setAttribute("order",up_img);
                
                ttkefu_ImgAuto();
                document.getElementById("ttkefubgimgdivwrapper").style.display="";
                document.getElementById("ttkefubgimgdivwrapper1").style.display="";
        }
       
	}
function ttkefu_upimg_over(){
	
	var up_img=parseInt(document.getElementById("ttkefubgimg").getAttribute("order"))-1;
    if(up_img>0){
		document.getElementById("ttkefu_upimg").style.background="url(https://w1011.ttkefu.com/images/hover_left.gif) center no-repeat";
    }
    
}
function ttkefu_upimg_out(){
	
	document.getElementById("ttkefu_upimg").style.background="none";
    
}    

function ttkefu_nextimg(){
		
		var next_img=parseInt(document.getElementById("ttkefubgimg").getAttribute("order"))+1;
        if(next_img<=ly_pic_load.ImgI){
            
            if(next_img==ly_pic_load.ImgI){
            	document.getElementById("ttkefu_nextimg").style.background="none";
            }
    
            document.getElementById("ttkefubgimg").src=ly_pic_load.ImgData[next_img].Isrc;
            document.getElementById("ttkefubgimg").setAttribute("origewidth",ly_pic_load.ImgData[next_img].Iorigewidth);
            document.getElementById("ttkefubgimg").setAttribute("origeheight",ly_pic_load.ImgData[next_img].Iorigeheight);
            document.getElementById("ttkefubgimg").setAttribute("order",next_img);
            
            ttkefu_ImgAuto();
            document.getElementById("ttkefubgimgdivwrapper").style.display="";
            document.getElementById("ttkefubgimgdivwrapper1").style.display="";
        }
       

	}
function ttkefu_nextimg_over(){
	
	var next_img=parseInt(document.getElementById("ttkefubgimg").getAttribute("order"))+1;
	if(next_img<ly_pic_load.ImgI){
		document.getElementById("ttkefu_nextimg").style.background="url(https://w1011.ttkefu.com/images/hover_right.gif) center no-repeat";
    }
    
}
function ttkefu_nextimg_out(){
	
	document.getElementById("ttkefu_nextimg").style.background="none";
    
}  

/*聊天图最大化最小化*/
function ttkefu_ImgAuto(){

			//图像
			var imgorigewidth=parseInt(document.getElementById("ttkefubgimg").getAttribute("origewidth"));
			var imgorigeheight=parseInt(document.getElementById("ttkefubgimg").getAttribute("origeheight"));
			//当前窗口
			var window_h= window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            window_h=window_h*0.88;
			var window_w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            window_w=window_w*0.88;
           
            
           document.getElementById("ttkefu_imgshow").style.height=window_h+"px";
           document.getElementById("ttkefu_imgshow").style.width=window_w+"px";
			//从是当前窗口找出正方形
			
			if(window_w<window_h){
            	  
				  if(imgorigewidth>imgorigeheight){
                  //横向
					  if(window_w*0.9>imgorigewidth){
                          document.getElementById("ttkefubgimg").style.width="auto";
                          document.getElementById("ttkefubgimg").style.height="auto";
					  }else{
                          document.getElementById("ttkefubgimg").style.width="auto";
                          document.getElementById("ttkefubgimg").style.height="auto";                          
					  }
				  }else{
                  //竖向
                      document.getElementById("ttkefubgimg").style.width="auto";
                      //document.getElementById("ttkefubgimg").style.height=window_w+"px";   
                      document.getElementById("ttkefubgimg").style.height="auto"; 
				  }
			
			}else{
				 
				 if(imgorigewidth>imgorigeheight){
					 //横向
					  if(window_w>imgorigewidth){
                          document.getElementById("ttkefubgimg").style.width="auto";
                          document.getElementById("ttkefubgimg").style.height="auto";
					  }else{
                        //document.getElementById("ttkefubgimg").style.width=window_h+"px";
                        document.getElementById("ttkefubgimg").style.width="auto";
                        document.getElementById("ttkefubgimg").style.height="auto";
                       
					  }
                      
					  
				  }else{
					  //竖向
					  if(window_h*0.9>imgorigeheight){
                          document.getElementById("ttkefubgimg").style.width="auto";
                          document.getElementById("ttkefubgimg").style.height="auto"; 
					  }else{
                          document.getElementById("ttkefubgimg").style.width="auto";
                          document.getElementById("ttkefubgimg").style.height="auto";
                          
					  }
				  }
			}
}


window.onresize=function(){
            //ttkefu_ImgAuto()
}

function ttkefu_minwindow_Out(obj)
{
		var scan_ttkefu=ttkefu_getBrowserInfo();
        if(scan_ttkefu.browser=="msie"){
        	obj.style.filter="alpha(opacity=100)";
        }else{
			obj.style.opacity="1";        
        }
}


function keypress(evt)
{
	evt = evt ? evt : (window.event ? window.event : null); 
    if (evt.keyCode==13)
    {
    	mini_dialog.yz=1;
        mini_dialog.sendmsg();return false
    }
    return true
}
function c_tools_style(i,objssss){
	if(i==1){
		var old_style=objssss.style.backgroundPosition,new_style;
		new_style=old_style.replace("0px ","-39px ");
		objssss.style.backgroundPosition=new_style
	}else{
		var old_style=objssss.style.backgroundPosition,new_style;
		new_style=old_style.replace("-39px ","0px ");
		objssss.style.backgroundPosition=new_style
	}
}

/*插入表情*/
function setemo(txt){
	document.getElementById("sendMsgTxt_chat").value=document.getElementById("sendMsgTxt_chat").value+"[emo]"+txt+"[/emo]";
	document.getElementById("uploadFileBox1").style.display="none";
}

/**/
function ttkefu_HandleMsg_JieTu(MsgData){
    //
    switch(MsgData.types){
            case 0:
                    if(MsgData.filetype=="file"){
                            /*本地文件*/
                            mini_dialog.fileview({fname:MsgData.fname,fsize:MsgData.fsize});
                    }else{
                            /*本地图片*/
                            mini_dialog.proview({type:0,url:e.data.ImgSrc,abcname:''});
                    }
            break;
            
            case 1:
                    if(MsgData.filetype=="file"){
                            /*本地文件*/
                            mini_dialog.fileUpOk(MsgData);
                    }else{
                            /*本地图片*/
                            /*上传服务器后反馈*/
                            /*发送消息成功*/
                            console.log("MsgData");
                            console.log(MsgData);
                            document.getElementById("sendMsgTxt_chat").value="[img]https://pic1011.ttkefu.com/?"+MsgData.fileurl+"[/img]";
                            mini_dialog.sendmsg();		
                           
                    }
            break;
            
            
            case 6:
            		console.log("-4835");
            		if(ttkefu_Mchannel.isrun){
                    console.log("-4837");
                    			frames["ttkefu_jietuIframe"].postMessage({type:6,msg:","+ttkefu_Mchannel.servers+","+ttkefu_Mchannel.serverport.substr(1)+","+ttkefu_Mchannel.lguseid+",1011"}, '*');
                    }else{
                    	console.log("-4840");
                    	mini_dialog.alert("对话时方可使用");
                    }
            break;
            
            case 7:
                    mini_dialog.InStallJieTuCk();
            break;
            
    
    }
}
		




var ly_pic_load={
    ImgI:0,
    ImgData:{},
    autowidth:function(obj){

        
        obj.onclick=function(){
				/*排序*/
                if(ly_pic_load.ImgI==0){
                    for(var i=0;i<document.getElementsByName("ttkefu_ImgName").length;i++){
                        ly_pic_load.ImgData[i]={"Isrc":document.getElementsByName("ttkefu_ImgName").item(i).src,"Iorigewidth":document.getElementsByName("ttkefu_ImgName").item(i).getAttribute("origewidth"),"Iorigeheight":document.getElementsByName("ttkefu_ImgName").item(i).getAttribute("origeheight")};
                        ly_pic_load.ImgI=i+1;
                        document.getElementsByName("ttkefu_ImgName").item(i).setAttribute("order",i);
                        
                    }
                }
                
                
                var imgorigewidth=parseInt(this.getAttribute("origewidth"));
				var imgorigeheight=parseInt(this.getAttribute("origeheight"));
                var order=parseInt(this.getAttribute("order"));
                
                document.getElementById("ttkefubgimg").src=this.src;
                document.getElementById("ttkefubgimg").setAttribute("origewidth",imgorigewidth);
                document.getElementById("ttkefubgimg").setAttribute("origeheight",imgorigeheight);
                document.getElementById("ttkefubgimg").setAttribute("order",order);
                
                ttkefu_ImgAuto();
                document.getElementById("ttkefubgimgdivwrapper").style.display="";
                document.getElementById("ttkefubgimgdivwrapper1").style.display="";
                
			};

            
		
	},

	loading:function(obj){

    
    	obj.setAttribute("name","ttkefu_ImgName");
		var ly_src=obj.getAttribute("lysrc");
        var locations=ly_src.indexOf("?");
        var th_str=ly_src.substring(locations+1,locations+8);
        ly_src=ly_src.replace("?"+th_str,"pic/"+th_str+"/"+th_str);
        
        var i=ly_pic_load.ImgI;
        ly_pic_load.ImgData[i]=null;
        
		var img = new Image();
		img.src=ly_src;
		img.onerror=function(){
			img.onerror=null;
			img=null;
			if(obj.alt!="加载中。。。")return;
			obj.src="https://w1011.ttkefu.com/images/imgdeleted.jpg";
            obj.onload=null;
			obj.removeAttribute("lysrc");
			obj.removeAttribute("onload");
			obj.alt="该图片已被删除";
		};
		var loadfun=function(){
			var imgorigwidth=img.width;
			var imgorigheight=img.height;
            try{
                obj.setAttribute("alt","点击图片可放大");
                obj.setAttribute("title","点击图片可放大");
                obj.setAttribute("order",ly_pic_load.ImgI);
            
                obj.setAttribute("origewidth",imgorigwidth);
                obj.setAttribute("origeheight",imgorigheight);
                
                if(imgorigwidth>imgorigheight){
                    if(imgorigwidth>100){
                        obj.style.width="100px";
                    }
                }else{
                    if(imgorigheight>80){
                        obj.style.height="80px";
                    }
                }
obj.style.cursor="url(https://w1011.ttkefu.com/images/zoomOut.cur), pointer";    			   document.getElementById("ttkefucontainer_wrapper").scrollTop=document.getElementById("ttkefucontainer_wrapper").scrollHeight;
                
            }catch(ex){
                
				obj.style.height="80px";
            }

			img.onerror=null;
			img=null;

			obj.removeAttribute("lysrc");
			obj.removeAttribute("onload");
			obj.removeAttribute("alt");
            
            obj.src=ly_src;
            obj.onload=null;

			
			obj.onclick=function(){
				/*排序*/
                if(ly_pic_load.ImgI==0){
                    for(var i=0;i<document.getElementsByName("ttkefu_ImgName").length;i++){
                        ly_pic_load.ImgData[i]={"Isrc":document.getElementsByName("ttkefu_ImgName").item(i).src,"Iorigewidth":document.getElementsByName("ttkefu_ImgName").item(i).getAttribute("origewidth"),"Iorigeheight":document.getElementsByName("ttkefu_ImgName").item(i).getAttribute("origeheight")};
                        ly_pic_load.ImgI=i+1;
                        document.getElementsByName("ttkefu_ImgName").item(i).setAttribute("order",i);
                    }
                    
                }
              
            
            
				var imgorigewidth=parseInt(this.getAttribute("origewidth"));
				var imgorigeheight=parseInt(this.getAttribute("origeheight"));
                var order=parseInt(this.getAttribute("order"));
                
                document.getElementById("ttkefubgimg").src=this.src;
                document.getElementById("ttkefubgimg").setAttribute("origewidth",imgorigewidth);
                document.getElementById("ttkefubgimg").setAttribute("origeheight",imgorigeheight);
                document.getElementById("ttkefubgimg").setAttribute("order",order);
                
                ttkefu_ImgAuto();
                document.getElementById("ttkefubgimgdivwrapper").style.display="";
                document.getElementById("ttkefubgimgdivwrapper1").style.display="";
                
                
			};
            
		}
		if (navigator.appName!="Microsoft Internet Explorer"){
			img.onload=loadfun
		}else{
			if(img.complete){
				if(obj.getAttribute("src")!="https://w1011.ttkefu.com/images/imgloading.gif")return
                var imgorigwidth=img.width;
                var imgorigheight=img.height;
                try{
                    obj.setAttribute("alt","点击图片可放大");
                    obj.setAttribute("title","点击图片可放大");
                    obj.setAttribute("order",ly_pic_load.ImgI);
                
                    obj.setAttribute("origewidth",imgorigwidth);
                    obj.setAttribute("origeheight",imgorigheight);
                    
                    if(imgorigwidth>imgorigheight){
                        if(imgorigwidth>100){
                            obj.style.width="100px";
                        }
                    }else{
                        if(imgorigheight>80){
                            obj.style.height="80px";
                        }
                    }
    obj.style.cursor="url(https://w1011.ttkefu.com/images/zoomOut.cur), pointer";    			   document.getElementById("ttkefucontainer_wrapper").scrollTop=document.getElementById("ttkefucontainer_wrapper").scrollHeight;
                    
                }catch(ex){
                    
                    obj.style.height="80px";
                }
                
                img.onerror=null;
				img=null;
				obj.src=ly_src;
                obj.onload=null;
				obj.removeAttribute("lysrc");
				obj.removeAttribute("alt");
				obj.removeAttribute("onload");
			}else{
				img.onload=loadfun
			}
		}
	}
}

/*---------------------------------End迷你窗口相关操作---------------------------------------------------------------*/

var yqwz="0",yqcs="0",zlycook="",zlyurlcook="",ttkefu_inv_type="1";
/*访客非对话状态下可邀请ttkefu_fk_state==0*/
if(ttkefu_inv_type=="1"){
	 /*迷你窗口-执行规则：1.状态记忆2.*/
           /*邀请时间*/
                setTimeout(function(){
                  if(ttkefu_fk_state==0 && mini_dialog.state=='0'){
                  /*
                  	  访客在当前页面,不处于对话中且没有结束对话
                      [首次默认邀请还未执行，先迷你对话，然后结束对话，过后会执行邀请结果显示界面为结束对话]
                  */
                      ttkefuyaoqing.showminitishi()
                  }
                },5*1000);
}else{
	/*漂浮邀请框*/
          if(yqwz=="0"){
          /*全部页面*/
                /*邀请时间*/
                      setTimeout(function(){
                        if(ttkefu_fk_state==0){
                            ttkefuyaoqing.showminitishi()
                        }
                      },5*1000);
                /*邀请次数*/
                      if(yqcs=="1")
                      {
                          setInterval(function(){
                            if(ttkefu_fk_state==0){
                                ttkefuyaoqing.showminitishi()
                            }
                          },30*1000);
                      }
          }else{
          /*仅着陆页*/
                    var zhaoluyetime=new Date();
                    zhaoluyetime=zhaoluyetime.getTime();
              /*读取着陆页时间*/
                    zlycook=getCookie("zhaoluye");
              /*读取着陆页地址*/
                    zlyurlcook=getCookie("zhaoluyeurl").replace("%3A",":").replace("%3F","?").replace("%3D","=");
              /*判断是否执行邀请*/
                    if(zlycook!=""){
                        if(zhaoluyetime-parseInt(zlycook)>120000)
                        {zlycook="";}
                    }
                    if(zlyurlcook==window.location.pathname){
                        zlycook="";
                    }else{
                        if(zlyurlcook=="/" && (window.location.pathname=="/index.html" || window.location.pathname=="/index.asp" || window.location.pathname=="/index.php" || window.location.pathname=="/index.aspx" || window.location.pathname=="/index.jsp" || window.location.pathname=="/Default.html" || window.location.pathname=="/Default.asp" || window.location.pathname=="/Default.php" || window.location.pathname=="/Default.aspx" || window.location.pathname=="/Default.jsp" )){
                             zlycook="";
                        }
                    }
              
              if(zlycook==""){
                  /*邀请时间*/
                        setTimeout(function(){
                              if(ttkefu_fk_state==0){
                                  ttkefuyaoqing.showminitishi()
                              }
                        },5*1000);
                  /*邀请次数*/
                        if(yqcs=="1")
                        {
                            setInterval(function(){
                              if(ttkefu_fk_state==0){
                                  ttkefuyaoqing.showminitishi()
                              }
                            },30*1000);
                        }
                  /*记录着陆页时间以及网址*/
                        setCookie("zhaoluye",zhaoluyetime,"d3000"); 
                        setCookie("zhaoluyeurl",window.location.pathname,"d3000");
                  
                  /*每隔50s更新着陆页时间*/
                        setInterval(function(){
                            var mynowtime=new Date();
                            mynowtime=mynowtime.getTime();
                            setCookie("zhaoluye",mynowtime,"d3000");
                            setCookie("zhaoluyeurl",window.location.pathname,"d3000");
                        },50000);
              }
          }
}


lastScrollY = 0;
function ttkefuheartBeat(){
	var diffY;
	if (document.documentElement && document.documentElement.scrollTop){
		diffY = document.documentElement.scrollTop;
	}else if (document.body){
		diffY = document.body.scrollTop
	}else{
		/*Netscape stuff*/
	}
	percent=.1*(diffY-lastScrollY);
	if(percent>0)percent=Math.ceil(percent);
	else percent=Math.floor(percent);
    if(document.getElementById("ttkefulist"))
    {
	document.getElementById("ttkefulist").style.top = parseInt(document.getElementById("ttkefulist").style.top)+percent+"px";
    }
    if(document.getElementById("ttkefuico"))
    {
		document.getElementById("ttkefuico").style.top = parseInt(document.getElementById("ttkefuico").style.top)+percent+"px";
    }
    
    if(document.getElementById("ttkefutel"))
    {
		document.getElementById("ttkefutel").style.top = parseInt(document.getElementById("ttkefutel").style.top)+percent+"px";
    }
    if(document.getElementById("ttkefuyaoqing"))
    {
	document.getElementById("ttkefuyaoqing").style.top = parseInt(document.getElementById("ttkefuyaoqing").style.top)+percent+"px";
    }
    if(document.getElementById("ttkefuqqstyle"))
    {
    document.getElementById("ttkefuqqstyle").style.top=parseInt(document.getElementById("ttkefuqqstyle").style.top)+percent+"px";
    }
    if(document.getElementById("minidialog"))
    {
    	document.getElementById("minidialog").style.top=parseInt(document.documentElement.clientHeight-316)+document.documentElement.scrollTop+"px";
    }
    if(document.getElementById("yxjwrapper"))
    {
    	document.getElementById("yxjwrapper").style.top=parseInt(document.documentElement.clientHeight-75)+document.documentElement.scrollTop+"px";
    }
    if(document.getElementById("btmtishi"))
    {
    	document.getElementById("btmtishi").style.top=parseInt(document.documentElement.clientHeight-90)+document.documentElement.scrollTop+"px";
    }

   
    var tempobj1=document.getElementById("ttkefutishi")
	if(tempobj1)tempobj1.style.top=parseInt(diffY+window.screen.availHeight/4)+"px";
	lastScrollY=lastScrollY+percent;
}

var ua=window.navigator.userAgent.toLowerCase();
if(ua.indexOf("msie")>0)
{
	var start=ua.indexOf("msie");
	if(ua.substr(start,8)=="msie 6.0" || document.compatMode =="BackCompat")
	{
    		window.setInterval("ttkefuheartBeat()",1);
	}	
}


var ttkefuobj='',ttkefuleixing="left";
document.onmouseup=MUp;
document.onmousemove=MMove;

function ttkefuqqdown(i)
{
	ttkefuleixing=i;
    MDown('ttkefuqqstyle')
}
function ttkefuyqdown(i)
{
	ttkefuleixing=i;
    MDown('ttkefuyaoqing')
}

function ttkefudown(i,j)
{
	ttkefuleixing=i;
    MDown(j)
}
var pX,pY;
function MDown(str){
	ttkefuobj=document.getElementById(str);
	ttkefuobj.setCapture();
    if(ttkefuleixing=="left")
    {
    	pX=event.x-ttkefuobj.style.pixelLeft;
    }
    else
    {
    	pX=event.x+ttkefuobj.style.pixelRight;
    }
	
	pY=event.y-ttkefuobj.style.pixelTop;
    
}
function MMove(){
	if(ttkefuobj!='')
    {
        var maxL = document.documentElement.clientWidth - ttkefuobj.offsetWidth;
        var maxT = document.documentElement.clientHeight - ttkefuobj.offsetHeight;
 
      
    	if(ttkefuleixing=="left")
        {
            ttkefuobj.style.left=event.x-pX;
        }
        else
        {
            ttkefuobj.style.right=pX-event.x;
        }

             ttkefuobj.style.top=event.y-pY;
	}
}
function MUp(){
	if(ttkefuobj!=''){
    
		ttkefuobj.releaseCapture();
		ttkefuobj='';
	}
}

}
else { alert("请将ttkefu漂浮代码放置到已上线网站中使用"); 
}