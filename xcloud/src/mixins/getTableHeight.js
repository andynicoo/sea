export default {
  data() {
    return {
      otherHeight: 205,
      tableHeight: '167px',
      initHeight: 0,
      moreSerch: false,
    };
  },
  mounted() {
    setTimeout(() => {
      if (this.$refs.table || this.$refs.searchBox) {
        this.otherHeight += this.initHeight;
        // 有标题栏
        let titleDom = document.getElementsByClassName('table-container-title');
        if (titleDom.length) {
          this.otherHeight += window.getComputedStyle(titleDom[0]).height.split('px')[0] - 0;
        }
        // 有筛选tabs
        let elTabs = this.$parent && this.$parent.$refs.elTabs ? this.$parent : this.$parent.$children.find((children) => children.$refs.elTabs);
        if (elTabs) {
          try {
            this.otherHeight += window.getComputedStyle(elTabs.$refs.elTabs.$el).height.split('px')[0] - 0;
          } catch (error) {}
        }
        this.mixinGetTableHeight();
        window.addEventListener('resize', this.mixinGetTableHeight);
      }
    });
  },
  methods: {
    mixinGetTableHeight() {
      this.$nextTick(() => {
        let searchBoxHeight = '0px';
        if (this.$refs.searchBox) {
          searchBoxHeight = window.getComputedStyle(this.$refs.searchBox).height;
        }
        let searchBox = this.$children.find((children) => children.$refs.searchBox) || this.$parent.$children.find((children) => children.$refs.searchBox);
        if (searchBox) {
          searchBoxHeight = window.getComputedStyle(searchBox.$refs.searchBox).height;
        }
        let offsetHeight = document.body.offsetHeight;
        if (this.otherHeight + (searchBoxHeight.split('px')[0] - 0) > offsetHeight - 167) {
          this.tableHeight = '167px';
        } else {
          this.tableHeight = `calc(100vh - ${this.otherHeight}px - ${searchBoxHeight})`;
        }
        let table = this.$parent && this.$parent.$refs.table ? this.$parent : this.$parent.$children.find((children) => children.$refs.table);
        if (table) {
          table.tableHeight = this.tableHeight;
          table.$refs.table.doLayout && table.$refs.table.doLayout();
        }
      });
    },
    handleMoreSearch() {
      this.moreSerch = !this.moreSerch;
      this.mixinGetTableHeight();
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.mixinGetTableHeight);
  },
  updated() {
    this.$refs.table && this.$refs.table.doLayout && this.$refs.table.doLayout();
  },
};
