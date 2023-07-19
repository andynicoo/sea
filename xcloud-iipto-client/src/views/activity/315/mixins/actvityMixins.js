import { log, re } from "mathjs/lib/entry/pureFunctionsAny.generated";

export const publicAtivtyInfo = {
  data() {
    return {
      timestamp: new Date().getTime(),
      startTime: new Date("2022-3-9 15:00:00").getTime(),
      endTime: new Date("2022-3-9 15:00:00").getTime() + 7200000,
      actInfoList: []
    };
  },
  created() {
    // this.timestamp >
    // this.currentDate();
  },
  methods: {
    /**
     * 判断活动状态 1 进行中 2 结束  3未开始
     * @param {*} startTime
     * @returns Number
     */
    currentAvtivy(startTime = this.startTime, endTime = this.endTime, node) {
      startTime.toString().length == 10
        ? (startTime = startTime * 1000)
        : (startTime = startTime);
      endTime = startTime + 7200000;
      this.startTime = startTime;
      this.endTime = endTime;
      // this.actInfoList = [];
      if (this.timestamp > startTime && this.timestamp < endTime) {
        this.actInfoList.push(this.setAvtInfo(startTime, 1, node));
        console.log("活动进行中", node);
      } else if (this.timestamp > endTime) {
        //当前时间大于结束时间 已经结束
        this.actInfoList.push(this.setAvtInfo(startTime, 2, node));
        console.log("活动已结束", node);
      } else {
        this.actInfoList.push(this.setAvtInfo(startTime, 3, node));
        // onsole.log("活动已结束");
      }
      return this.actInfoList;
    },

    /**
     * 活动信息
     * @param {*} itme  开始时间时间戳，
     * @param {*} type 类型状态  1 进行中 2 结束  3未开始
     * @param {*} node 场次 0 1 2
     * @returns  {} 活动信息
     */
    setAvtInfo(startTime, type, node) {
      let actvityInfo = {
        startTime,
        type,
        node,
        endTime: startTime + 7200000
      };
      return actvityInfo;
    },
    /**
     * 停止当前活动
     */
    stopActivy() {
      this.actInfoList.forEach(element => {
        element.type = 2;
      });
      console.log("停止当前活动2", this.actInfoList);
      return this.actInfoList;
    }
  }
};
