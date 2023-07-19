export default {
  computed: {
    dataReview() {
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item) => {
          if (!item.hasOwnProperty('disabled')) {
            this.$set(item, 'disabled', !this.isEdit);
          } else {
            item.disabled = !this.isEdit;
          }
        });
      });
      return this.moduleList;
    },
    firstReviewData() {
      this.firstReview.forEach((pro) => {
        pro.columns.forEach((item) => {
          if (!item.hasOwnProperty('disabled')) {
            this.$set(item, 'disabled', !this.isEdit);
          } else {
            item.disabled = !this.isEdit;
          }
        });
      });
      return this.firstReview;
    },
  },
  methods: {
    translateReviewIntoSourceFileUrl(dataReview) {
      let temp = JSON.parse(JSON.stringify(dataReview));
      temp.forEach((item) => {
        item.columns.forEach((column) => {
          if (column.reView && JSON.stringify(column.reView) !== '{}') {
            column.sourceFileUrl = column.reView;
          }
          column.reView = '';
        });
      });
      return temp;
    },
  },
};
