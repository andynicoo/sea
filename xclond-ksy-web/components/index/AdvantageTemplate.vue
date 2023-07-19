<template>
  <!-- :class="type === 'index' ? 'index' : 'about'" -->
  <div
    class="advantage-wrap"
    :class="{
      index: type === 'index',
      about: type !== 'index',
      kbybg: NODE_PLA === 'kby',
      ksybg: NODE_PLA === 'ksy',
      wgbg: NODE_PLA === 'wg',
    }"
  >
    <div class="ksy-w1320 center advantage-wrap-out">
      <div class="advantage-wrap-head">
        <h4>服务优势</h4>
        <p v-if="NODE_PLA === 'kby'">“互联网+大数据+专业律师团队”为卖家提供一站式知识产权服务</p>
        <p v-if="NODE_PLA === 'ksy'">专注于为卖家提供专业VAT服务，推动跨境电商税务合规化、标准化、智能化</p>
        <p v-if="NODE_PLA === 'wg'">免费查询+大数据分析+AI智能+专家一对一顾问式服务+本土资深律师团队</p>
      </div>
      <div class="advantage-wrap-content">
        <div
          class="advantage-wrap-content-item"
          :class="{ active: index === 0, bgwt: NODE_PLA === 'wg' }"
          v-for="(item, index) in showList"
          :key="index"
        >
          <div
            class="advantage-wrap-content-item-default"
            :class="NODE_PLA === 'kby' ? `bg-kby-${index + 1}` : `bg-${index + 1}`"
          >
            <h4>{{ item.title }}</h4>
            <p v-html="item.content"></p>
            <div class="point">……</div>
          </div>
          <div
            class="advantage-wrap-content-item-hide"
            :class="{ kby: NODE_PLA === 'kby', ksy: NODE_PLA === 'ksy', wg: NODE_PLA === 'wg' }"
          >
            <div class="advantage-wrap-content-item-hide-title">{{ item.title }}</div>
            <div class="advantage-wrap-content-item-hide-text">
              <template v-for="(t, idx) in item.hideInfo">
                <dl v-if="item.hideInfo.length > 1" :key="idx">
                  <dt>{{ idx + 1 }}、</dt>
                  <dd>{{ t }}</dd>
                </dl>
                <p v-else :key="`p_${idx}`">{{ t }}</p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "AdvantageTemplate",
  data() {
    return {
      listKsy: [
        {
          title: "专业",
          content: `
            500+海外税务专家<br />
            专业税务服务团队<br />
            客服团队成员均在VAT行业扎根5年<br />
            服务专业、及时、高效<br />
          `,
          hideInfo: [
            "500+海外税务专家及国内税务顾问组成专业税务服务团队，以专业水准为出海企业解决各类税务难题。",
            "跨税云客服团队成员均在VAT行业扎根5年，深谙各国税务申报问题，服务专业、及时、高效。",
          ],
        },
        {
          title: "高效",
          content: `
            实时核对税金<br />
            英德秒下回执<br />
            多税号管理<br />
            申报流程实时提醒<br />
          `,
          hideInfo: [
            "支持客户自主上传数据，实时核对税金； 客户可一键在线申报，最快5分钟内完成申报。",
            "跨税云拥有英国德国税局官方认可的报税系统，英德秒下回执，保障时效。",
            "支持多个税号管理，一目了然各税号状况。",
          ],
        },
        {
          title: "安全",
          content: `
            SaaS系统采用SSL<br />
            256位数据加密技术<br />
            双云服务器分布式计算<br />
            国家信息安全等级三级认证<br />
          `,
          hideInfo: [
            "SaaS系统采用SSL、256位数据加密术，保护客户数据安全；该系统已获国家信息安全等级三级认证。",
            "双云服务器分布式计算系统24小时不间断备份数据，确保卖家数据零丢失。",
            "DDoS、WAF、硬件三重防火墙隔离病毒， 全方位抵御网络非法入侵。",
          ],
        },
        {
          title: "本土",
          content: `
            上百位海外本土税务师<br />
            申报更安全<br />
            英德法意西本土自营资质<br />
            服务更有保障<br />
          `,
          hideInfo: ["拥有上百位海外本土税务师，申报更安全；拥有英德法意西本土自营资质，价格更优惠，服务更有保障。"],
        },
      ],
      listKby: [
        {
          title: "专业",
          content: `
            海内外从事国际知识产权<br />
            10年以上的律师团队<br />
            为卖家提供一站式知识产权服务<br />
            专业水准<br />
          `,
          hideInfo: ["海内外从事国际知识产权10年以上的律师团队，以专业水准为卖家提供一站式知识产权服务"],
        },
        {
          title: "高效",
          content: `
            72条AI核名算法<br />
            3秒出核名结果<br />
            直连国际商标局<br />
            线上提交简单化<br />
          `,
          hideInfo: [
            "72条AI核名算法，降低90%驳回风险",
            "3秒出核名结果，快至1天备案",
            "直连国际商标局，注册进度实时掌握",
            "线上提交简单化，时间节约90%",
          ],
        },
        {
          title: "规模",
          content: `
            3000万+国际商标数据库<br />
            提供多样性商标注册选择<br />
            帮助客户排除风险<br />
            提高商标注册率<br />
          `,
          hideInfo: ["3000万+国际商标数据库，为客户提供多样性商标注册选择", "帮助客户排除风险，提高商标注册率"],
        },
        {
          title: "本土",
          content: `
            拥有100+美国本土律师<br />
            递交注册更安全<br />
            拥有美英德法本土自营机构<br />
            价格更优惠、服务更有保障<br />
          `,
          hideInfo: ["拥有100+美国本土律师，递交注册更安全", "拥有美英德法本土自营机构，价格更优惠、服务更有保障"],
        },
      ],
      listWg: [
        {
          title: "专业化团队",
          content: `
          10年以上<br />
          专业国际知识产权律师组<br />
          专业国际知识产权律师组<br />
          一站式知识产权服务<br />
          `,
          hideInfo: [
            "团队由10年以上专业国际知识产权律师组成，处理海外专利申请等各类案件累计超10000件，为卖家提供一站式知识产权服务。",
          ],
        },
        {
          title: "定制化服务",
          content: `
          一站式解决方案<br />
          定制化<br />
          解决各种侵权案件<br />
          提供专业定制优化建议<br />
          `,
          hideInfo: [
            "团队由10年以上专业国际知识产权律师组成，处理海外专利申请等各类案件累计超10000件，为卖家提供一站式知识产权服务。",
          ],
        },
        {
          title: "业务覆盖广",
          content: `
          覆盖美、英、德、法等欧盟国家<br />
          及日本、韩国等<br />
          全球200多个国家<br />
          外观专利事务<br />
          `,
          hideInfo: ["业务覆盖美国、英、德、法、意等欧盟国家及日本、韩国等全球200多个国家和地区的外观专利事务。"],
        },
        {
          title: "本土化服务",
          content: `
          数百名海外专利代理人<br />
          律师团队<br />
          提供本地化服务<br />
          注册无忧<br />
          `,
          hideInfo: ["数百名海外各国专利代理人及律师团队，提供本地化服务，注册无忧更便捷安心。"],
        },
      ],
      NODE_PLA: process.env.NODE_PLA,
    };
  },
  props: {
    type: {
      type: String,
      default: "index",
    },
  },
  computed: {
    showList() {
      var list = [];
      if (this.NODE_PLA === "kby") {
        list = this.listKby;
      } else if (this.NODE_PLA === "ksy") {
        list = this.listKsy;
      } else if (this.NODE_PLA === "wg") {
        list = this.listWg;
      }
      return list;
    },
  },
};
</script>
<style lang="less" scoped>
// 覆盖样式
.index {
  .bg-image-png("advantage-bg");
  background-size: cover;
}

.kbybg {
  .bg-image-png("advantage-bgkby");
  background-size: cover;
}

.wgbg {
  .bg-image-png("advantage-bgkby");
  background-size: cover;
}

.about {
  .advantage-bg(@n, @i: 1) when (@i =< @n) {
    .bg-@{i} {
      background: url("@/assets/images/index/kby/advantage-@{i}.png") no-repeat center 98px / auto 80px;
    }
    .bg-kby-@{i} {
      background: url("@/assets/images/index/kby/advantage-@{i}.png") no-repeat center 98px / auto 80px;
    }
    .advantage-bg(@n, (@i + 1));
  }
  .advantage-bg(4);
}

.index {
  .advantage-bg(@n, @i: 1) when (@i =< @n) {
    .bg-@{i} {
      background: url("@/assets/images/index/advantage-0@{i}.png") no-repeat center 98px / auto 80px;
    }
    .bg-kby-@{i} {
      background: url("@/assets/images/index/kby/advantageindex@{i}.png") no-repeat center 98px / auto 80px;
    }
    .advantage-bg(@n, (@i + 1));
  }
  .advantage-bg(4);
}

.wgbg {
  .advantage-bg(@n, @i: 1) when (@i =< @n) {
    .bg-@{i} {
      background: url("@/assets/images/index/advantagewg-0@{i}.png") no-repeat center 98px / auto 80px;
    }
    .bg-kby-@{i} {
      background: url("@/assets/images/index/kby/advantageindex@{i}.png") no-repeat center 98px / auto 80px;
    }
    .advantage-bg(@n, (@i + 1));
  }
  .advantage-bg(4);
}

.about {
  .bg-image-png("fwysbg");
  background-color: #232a36;
  padding-top: 100px;
  .advantage-wrap {
    &-head {
      color: @whiteTextColor !important;
      h4 {
        color: @whiteTextColor !important;
      }
    }
    &-content {
      &-item {
        &-default {
          border-right: 1px solid #474747;
        }
        p {
          color: @whiteTextColor;
          line-height: 30px;
        }
        h4 {
          color: @whiteTextColor;
          font-weight: 600;
          line-height: 24px;
        }
        .point {
          color: @whiteTextColor;
        }
      }
    }
  }
}

// 原默认样式
.advantage-wrap {
  padding: 80px 0 78px;
  // background: url("@/assets/images/index/advantage-bg.png") no-repeat center/100% 100%;
  &-out {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  &-head {
    text-align: center;
    color: rgba(@textColor, 0.9);
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 42px;
    h4 {
      font-size: 28px;
      font-weight: 600;
      line-height: 40px;
      margin-bottom: 12px;
    }
  }
  &-content {
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    width: 100%;
    &-item {
      flex: 1;
      height: 530px;
      cursor: pointer;
      &:last-child {
        .advantage-wrap-content-item-default {
          border: 0;
        }
      }
      &-default {
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        padding-bottom: 104px;
        border-right: 1px solid #e3e3e3;
        text-align: center;
        font-size: 16px;
        &:last-child {
          border-right: 0;
        }
      }
      &-hide {
        width: 200px;
        visibility: hidden;
        overflow: hidden;
        // display: none;
        transition: width 0.6s ease 0s;
      }
      &:hover {
        .advantage-wrap-content-item-default {
          display: none;
        }
        .kby {
          background: url("@/assets/images/index/advance-bg2.png") no-repeat !important;
        }
        .wg {
          background: url("@/assets/images/index/advance-bg3.png") no-repeat !important;
        }
        .advantage-wrap-content-item-hide {
          // display: block;
          visibility: visible;
          width: 480px;
          height: 100%;
          padding: 52px 40px;
          font-size: 16px;
          color: #ffffff;
          line-height: 24px;
          background: url("@/assets/images/index/advance-bg.png") no-repeat;
          &-title {
            font-size: 40px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            line-height: 56px;
            position: relative;
            margin-bottom: 60px;
            &:after {
              position: absolute;
              content: "";
              width: 40px;
              height: 4px;
              background: #ffffff;
              left: 0;
              bottom: -16px;
            }
          }
          &-text {
            width: 300px;
            p {
              color: #fff;
            }
            dl {
              display: flex;
              justify-content: space-between;
              dd {
                flex: 1;
              }
            }
          }
        }
      }
      &:last-child {
        border-right: 0;
      }
      p {
        color: rgba(@textColor, 0.6);
        line-height: 30px;
      }
      h4 {
        color: rgba(@textColor, 0.9);
        font-weight: 600;
        line-height: 24px;
      }
    }
  }
}
.bgwt {
  background: #ffffff80;
}
</style>
