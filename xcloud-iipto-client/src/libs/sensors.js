import Vue from "vue";
import sensors from "sa-sdk-javascript";

Vue.directive("sensors", {
  inserted: function(el, binding) {
    const { type, getParams, event = "view" } = binding.value;
    if (event === "click") {
      el.addEventListener("click", () => {
        const _params = getParams ? getParams() : {};
        if(['BrandServeAdd','ClickBrandServeNowBuy'].includes(type)){
          if(_params.brand_serve_project){
            sensors.track(type, _params);
          }
        }else{
          sensors.track(type, _params);
        }
      });
    } else {
      const _params = getParams ? getParams() : {};
      sensors.track(type, _params);
    }
  }
});
