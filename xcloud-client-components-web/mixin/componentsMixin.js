export default {
  data() {
    return {};
  },
  methods: {
    /** 不四舍五入 保留两位小数
     * @param {*}   列如132.45646456,2 返回132.45
     */
    formatDecimal(num, decimal) {
      num = num.toString();
      let index = num.indexOf('.');
      if (index !== -1) {
        num = num.substring(0, decimal + index + 1);
      } else {
        num = num.substring(0);
      }
      return parseFloat(num).toFixed(decimal);
    },
    //金额求积
    floatMultiply(a, b) {
      var c = 0,
        d = a.toString(),
        e = b.toString();
      try {
        c += d.split('.')[1].length;
      } catch (f) {}
      try {
        c += e.split('.')[1].length;
      } catch (f) {}
      return (Number(d.replace('.', '')) * Number(e.replace('.', ''))) / Math.pow(10, c);
    },
    // 金额求和
    countSum(arr) {
      if (!arr.length) return 0;
      arr = arr.map((v) => {
        if (v && !Number.isNaN(Number(v))) return Math.round(v * 100);
        return 0;
      });
      const result = arr.reduce((prev, curr) => {
        return prev + curr;
      }, 0);
      return result / 100;
    },
    /** 除法
     * @param { number } num1
     * @param { number } num2
     */
    division(a, b) {
      var c,
        d,
        e = 0,
        f = 0;
      try {
        e = a.toString().split('.')[1].length;
      } catch (g) {}
      try {
        f = b.toString().split('.')[1].length;
      } catch (g) {}
      return (c = Number(a.toString().replace('.', ''))), (d = Number(b.toString().replace('.', ''))), this.floatMultiply(c / d, Math.pow(10, f - e));
    },
  },
};
