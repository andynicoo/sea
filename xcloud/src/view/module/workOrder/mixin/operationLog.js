import { getBusinessLogListByNo } from '@/api/newApi/common';
export default {
  data() {
    return {
      activities: [],
    };
  },
  methods: {
    getOperationLog(businessNo, businessType) {
      getBusinessLogListByNo({
        businessNo,
        // businessType
      }).then((res) => {
        if (res.code === 0) {
          this.activities = res.data;
        }
      });
    },
  },
};
