(function(){
  let wl = document.createElement("script");
      wl.type = "text/javascript";
      wl.src = "https://material.weiling.cn/h5/willing-third-party-js/v1/qrcode-custom-comp-v1.min.js"
      wl.id = "wlQRCS";
      wl.onload = function(){
      wlQrcodeCustomComp.init({
      wl_id: "wpW2WmDAAAT-I6HDSZdAMw8qxGlCaRUw",  // [修改1：将wl_id粘贴至此]
      });
  };
  if (!document.getElementById("wlQRCS")) {
      let s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(wl, s);
  }
  })();
