<template>
  <div>
    <div class="process">
      <div class="title">{{ countryNameZh }}申报流程：</div>
      <div class="content">
        <div>
          <div class="statusItem" v-if="countryCode === 'GB'">
            <div class="item active">
              <div class="itemLeft">
                <div class="top">1</div>
                <div class="bottom">待申报</div>
                <div class="time">到了申报时间</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">下载电商平台销售数据-计算税金</div>
                <div class="operateTime">
                  <a
                    href="https://pre-fdfs.itaxs.com/group1/M00/00/E4/rBLKLV_sXF2ABgCcAA5yvr73tcg986.png"
                    target="_blank"
                  >
                    下载数据方法
                  </a>
                </div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">2</div>
                <div class="bottom">提交申报</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">下载申报回执</div>
                <div class="operateTime">
                  <a
                    href="https://pre-fdfs.itaxs.com/group1/M00/00/E4/rBLKLV_sXK2AcVRXABNGxSoIHWY373.pdf"
                    target="_blank"
                  >
                    缴税指引
                  </a>
                </div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">3</div>
                <div class="bottom">待缴纳税金</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">上传缴税凭证</div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">4</div>
                <div class="bottom">申报完成</div>
              </div>
            </div>
          </div>
          <div class="statusItem" v-if="countryCode === 'DE'">
            <div class="item active">
              <div class="itemLeft">
                <div class="top">1</div>
                <div class="bottom">待申报</div>
                <div class="time">到了申报时间</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">下载电商平台销售数据-计算税金</div>
                <div class="operateTime">
                  <a
                    href="https://pre-fdfs.itaxs.com/group1/M00/00/E4/rBLKLV_sXF2ABgCcAA5yvr73tcg986.png"
                    target="_blank"
                  >
                    下载数据方法
                  </a>
                </div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">2</div>
                <div class="bottom">提交申报</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">下载税金确认单---线下缴税</div>
                <div class="operateTime">
                  <a
                    href="https://pre-fdfs.itaxs.com/group1/M00/00/E4/rBLKLV_sXK2AcVRXABNGxSoIHWY373.pdf"
                    target="_blank"
                  >
                    缴税指引
                  </a>
                </div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">3</div>
                <div class="bottom">待缴纳税金</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">上传缴税凭证</div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">4</div>
                <div class="bottom">申报完成</div>
              </div>
            </div>
          </div>
          <div class="statusItem" v-if="countryCode === 'IT' && supplierId == 50">
            <div class="item active">
              <div class="itemLeft">
                <div class="top">1</div>
                <div class="bottom">待申报</div>
                <div class="time">到了申报时间</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">下载电商平台销售数据-计算税金</div>
                <div class="operateTime">
                  <a
                    href="https://pre-fdfs.itaxs.com/group1/M00/00/E4/rBLKLV_sXF2ABgCcAA5yvr73tcg986.png"
                    target="_blank"
                  >
                    下载数据方法
                  </a>
                </div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">2</div>
                <div class="bottom">提交申报</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">下载税金确认单---线下缴税</div>
                <div class="operateTime">
                  <a
                    href="https://pre-fdfs.itaxs.com/group1/M00/00/E4/rBLKLV_sXK2AcVRXABNGxSoIHWY373.pdf"
                    target="_blank"
                  >
                    缴税指引
                  </a>
                </div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">3</div>
                <div class="bottom">待缴纳税金</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">上传缴税凭证</div>
              </div>
            </div>

            <div class="item active" style="margin-right: -15%">
              <div class="itemLeft">
                <div class="top">4</div>
                <div class="bottom">申报完成</div>
              </div>
            </div>
          </div>
          <div
            class="statusItem"
            v-if="
              countryCode === 'FR' ||
              (countryCode === 'IT' && supplierId != 50) ||
              countryCode === 'ES' ||
              countryCode === 'PL' ||
              countryCode === 'IOSS'
            "
          >
            <div class="item active">
              <div class="itemLeft">
                <div class="top">1</div>
                <div class="bottom">待申报</div>
                <div class="time">到了申报时间</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">下载电商平台销售数据-计算税金</div>
                <div class="operateTime">
                  <a
                    href="https://pre-fdfs.itaxs.com/group1/M00/00/E4/rBLKLV_sXF2ABgCcAA5yvr73tcg986.png"
                    target="_blank"
                  >
                    下载数据方法
                  </a>
                </div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">2</div>
                <div class="bottom">提交申报</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">下载税金确认单---线下缴税</div>
                <div class="operateTime">
                  <a
                    href="https://pre-fdfs.itaxs.com/group1/M00/00/E4/rBLKLV_sXK2AcVRXABNGxSoIHWY373.pdf"
                    target="_blank"
                  >
                    缴税指引
                  </a>
                </div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">3</div>
                <div class="bottom">待缴纳税金</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">上传缴税凭证</div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">4</div>
                <div class="bottom">税金待审核</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime"></div>
              </div>
            </div>
            <div class="item active" style="margin-right: -15%">
              <div class="itemLeft">
                <div class="top">5</div>
                <div class="bottom">申报完成</div>
              </div>
            </div>
          </div>
          <div class="statusItem" v-if="countryCode === 'AE' || countryCode === 'SA'">
            <div class="item active">
              <div class="itemLeft">
                <div class="top">1</div>
                <div class="bottom">待申报</div>
                <div class="time">到了申报时间</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">下载电商平台销售数据-计算税金</div>
                <div class="operateTime">
                  <a href="https://file.itaxs.com/dev/20210510/6f16904ec8ab404585ce944e69dc6dbb.pdf" target="_blank">
                    下载数据方法
                  </a>
                </div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">2</div>
                <div class="bottom">提交申报</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">税务师处理申报</div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">3</div>
                <div class="bottom">申报中</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">下载税金确认单---线下缴税</div>
                <div class="operateTime">
                  <a
                    href="https://pre-fdfs.itaxs.com/group1/M00/00/E4/rBLKLV_sXK2AcVRXABNGxSoIHWY373.pdf"
                    target="_blank"
                  >
                    缴税指引
                  </a>
                </div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">4</div>
                <div class="bottom">待缴纳税金</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">上传缴税凭证</div>
              </div>
            </div>
            <div class="item active" style="margin-right: -15%">
              <div class="itemLeft">
                <div class="top">5</div>
                <div class="bottom">申报完成</div>
              </div>
            </div>
          </div>
          <div class="statusItem" v-if="countryCode === 'NL' || countryCode === 'AT' || countryCode === 'CZ'">
            <div class="item active">
              <div class="itemLeft">
                <div class="top">1</div>
                <div class="bottom">待申报</div>
                <div class="time">到了申报时间</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">下载电商平台销售数据-计算税金</div>
                <div class="operateTime">
                  <a
                    href="https://pre-fdfs.itaxs.com/group1/M00/00/E4/rBLKLV_sXF2ABgCcAA5yvr73tcg986.png"
                    target="_blank"
                  >
                    下载数据方法
                  </a>
                </div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">2</div>
                <div class="bottom">提交申报</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">税务师处理申报</div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">3</div>
                <div class="bottom">待审核申报</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">下载税金确认单---线下缴税</div>
                <div class="operateTime">
                  <a
                    href="https://pre-fdfs.itaxs.com/group1/M00/00/E4/rBLKLV_sXK2AcVRXABNGxSoIHWY373.pdf"
                    target="_blank"
                  >
                    缴税指引
                  </a>
                </div>
              </div>
            </div>
            <div class="item active">
              <div class="itemLeft">
                <div class="top">4</div>
                <div class="bottom">待缴纳税金</div>
              </div>
              <div class="itemRight">
                <div class="itemLine">
                  <i></i>
                </div>
                <div class="rejectedOperateTime">上传缴税凭证</div>
              </div>
            </div>
            <div class="item active" style="margin-right: -15%">
              <div class="itemLeft">
                <div class="top">5</div>
                <div class="bottom">申报完成</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["countryCode", "countryNameZh", "supplierId"],
};
</script>

<style lang="less" scoped>
.tabBoxContainer {
  margin: 20px;
  .process {
    background: #ffffff;
    border-radius: 4px;
    padding: 20px;
    margin-top: 24px;
    .title {
      font-size: 18px;
      font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 25px;
    }
    .content {
      .statusItem {
        display: flex;
        width: 100%;
        margin: 20px auto;
        overflow: hidden;
        .item {
          width: 100%;
          display: flex;
          align-items: center;
          .itemLeft {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 100px;
            @media screen and (max-width: 1440px) {
              min-width: 80px;
            }
            .top {
              width: 30px;
              height: 30px;
              background: #ffffff;
              border-radius: 50%;
              text-align: center;
              line-height: 29px;
              color: rgba(0, 0, 0, 0.45);
              border: 1px solid rgba(0, 0, 0, 0.45);
              font-size: 14px;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .bottom {
              font-size: 14px;
              font-weight: 500;
              color: #333333;
            }
            .time {
              color: red;
              margin-top: 5px;
            }
          }
          .itemRight {
            position: relative;
            width: 100%;
            .itemLine {
              width: 100%;
              padding: 0 10px;
              position: absolute;
              left: 0px;
              top: -15px;
              & > i {
                display: inline-block;
                width: 100%;
                height: 1px;
                vertical-align: top;
                background: #e8eaec;
                border-radius: 1px;
                position: relative;
              }
            }
            .operateTime {
              font-size: 12px;
              color: #666666;
              line-height: 17px;
              text-align: center;
              position: absolute;
              width: 100%;
              top: -5px;
            }
            .rejectedOperateTime {
              font-size: 12px;
              color: rgba(0, 0, 0, 0.65);
              line-height: 17px;
              text-align: center;
              position: absolute;
              width: 100%;
              top: -37px;
            }
          }
        }

        .item:last-child {
          margin-right: -20%;
        }
      }
      .statusItem .active,
      .rejected {
        .itemLeft {
          .top {
            background: #1890ffff;
            color: #ffffff;
            border: none;
            line-height: 30px;
          }
        }
        .itemRight {
          .itemLine {
            i {
              background: #1890ffff;
            }
          }
        }
      }
      .statusItem .rejected {
        .itemRight {
          .itemLine {
            i {
              background: #ff8900ff;
            }
          }
        }
      }
      .rejectedLine {
        .itemLeft {
          .top {
            background: #1890ffff;
            color: #ffffff;
            border: none;
            line-height: 30px;
          }
        }
        .itemRight {
          .itemLine {
            i {
              background: #e8eaec;
            }
          }
        }
      }
      .info {
        margin: 20px 0px;
        display: flex;
        justify-content: center;
        text-align: center;
        font-size: 14px;
        .left {
          display: flex;
          font-weight: 500;
          color: #16ade9;
          line-height: 20px;
          margin-right: 10px;
          img {
            margin-right: 5px;
          }
        }
        .timeout {
          color: #ed3e3eff;
        }
        .right {
          span {
            color: #16ade9ff;
          }
        }
      }
      .start {
        text-align: center;
        font-size: 12px;
        color: #666666;
        line-height: 17px;
      }
    }
  }
}
</style>
