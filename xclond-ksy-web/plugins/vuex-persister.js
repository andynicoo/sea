import createPersistedState from "vuex-persistedstate";
import Cookies from "js-cookie";

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: "store",
      storage: {
        getItem: function (key) {
          return Cookies.get(key);
        },
        setItem: function (key, value) {
          return Cookies.set(key, value, { expires: 3, secure: false });
        },
        removeItem: function (key) {
          return Cookies.remove(key);
        },
      },
    })(store);
  });
};
