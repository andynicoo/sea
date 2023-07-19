export default {
  methods: {
    setPageCache() {
      let cache = JSON.parse(sessionStorage.getItem('cacheQuery') || '{}');
      cache[this.$route.path] = this[this.cacheKey];
      this.$route && this.$route.path && sessionStorage.setItem('cacheQuery', JSON.stringify(cache));
    },
    getPageCache() {
      try {
        let cache = JSON.parse(sessionStorage.getItem('cacheQuery') || '{}');
        cache && cache[this.$route.path] && (this[this.cacheKey] = cache[this.$route.path]);
        if (this[this.cacheKey].page) {
          this[this.cacheKey].page = 1;
        }
      } catch (error) {}
    },
    removePageCache() {
      let cache = JSON.parse(sessionStorage.getItem('cacheQuery') || '{}');
      let cacheMap = new Map(Object.entries(cache));
      cacheMap.delete(this.$route.path);
      sessionStorage.setItem('cacheQuery', JSON.stringify(Object.fromEntries(cacheMap)));
    },
  },
};
