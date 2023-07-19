<template>
  <a-form-model
    ref="productSpecForm"
    :model="product"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item prop="hasVariation" :label="$t('edit.productSpecs')">
      <a-radio-group
        :disabled="disableVariants"
        v-model="product.hasVariation"
        @change="specsChange"
      >
        <a-radio :value="false"> {{ $t('edit.singleSpec') }} </a-radio>
        <a-radio :value="true"> {{ $t('edit.multipleSpec') }} </a-radio>
      </a-radio-group>
    </a-form-model-item>

    <!-- 单品 start -->
    <template v-if="!product.hasVariation">
      <a-form-model-item
        class="me-mb-0"
        prop="id"
        required
        :label="$t('edit.price')"
      >
        <a-form-model-item
          prop="price"
          class="me-ib me-mr-2"
          style="width: 200px"
        >
          <a-input
            :disabled="!!product.discountId"
            :value="product.price"
            :suffix="product.currency"
            :placeholder="$t('edit.price')"
            @change="priceChange"
            @input="onPriceInput"
          />
        </a-form-model-item>
        <a-form-model-item class="me-ib me-mr-2" style="width: 200px">
          <a-input
            readOnly
            prefix="￥"
            suffix="RMB"
            v-model="product.rmbPrice"
            :placeholder="$t('edit.RMB')"
          />
        </a-form-model-item>
        <a-button
          v-if="editType == '1' || editType == '2'"
          @click="setPrice"
          :disabled="!!product.discountId"
        >
          设置售价
        </a-button>
      </a-form-model-item>
      <a-form-model-item :label="$t('edit.stock')" prop="stock">
        <a-input
          :suffix="$t('edit.pieces')"
          style="width: 200px"
          v-positiveNumber="{ maxNum: 99999, minNum: 0 }"
          v-model="product.stock"
          :placeholder="$t('edit.stock')"
        />
      </a-form-model-item>
      <template v-if="product.discountId">
        <a-form-model-item class="me-mb-0" :label="$t('edit.zhj')">
          <a-form-model-item class="me-ib me-mr-2" style="width: 200px">
            <a-input
              readOnly
              v-model="product.promotionPrice"
              :suffix="product.currency"
            />
          </a-form-model-item>
          <a-form-model-item class="me-ib me-mr-2" style="width: 200px">
            <a-input
              prefix="￥"
              suffix="RMB"
              readOnly
              v-model="product.rmbPromotionPrice"
            />
          </a-form-model-item>
        </a-form-model-item>
      </template>
    </template>
    <!-- 单品 end -->

    <!-- 多规格 start -->
    <template v-if="product.hasVariation">
      <a-form-model-item
        prop="specs"
        :rules="[{ required: true, message: '规格不能空' }]"
        :label="$t('edit.specName')"
        :wrapper-col="{ span: 20 }"
      >
        <template v-if="editType != 0">
          <a-dropdown>
            <a-button :loading="imageSpecTransition">
              {{ $t('edit.transitionSpecImage') }}
            </a-button>
            <a-menu slot="overlay">
              <a-menu-item
                @click="onTranslateImage(target)"
                :key="target.lang"
                v-for="target in targetLangList"
              >
                {{ target.name }}
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>

        <div class="me-edit-space-context me-pa-3 me-mt-3">
          <!-- <template v-if="product.specs.length < 2">
            <a-button
              :disabled="!!(editType == 1)"
              @click="pushSpecs"
              type="primary"
              shape="circle"
            >
              <a-icon type="plus" />
            </a-button>
          </template> -->
          <!-- {{ this.product.specs.length }}--{{ specOptionName }} -->
          <div class="me-edit-space-card">
            <div
              class="me-edit-space-item"
              v-for="(spec, index) in product.specs"
              :key="index"
            >
              <!-- 规格名 start -->
              <div style="position: relative">
                <a-form-model-item
                  class="me-edit-space-input-item name-input"
                  :help="spec._name_valid_"
                  :validateStatus="spec._name_valid_ ? 'error' : ''"
                  :label="`规格${index + 1}`"
                >
                  <template>
                    <p class="me-warn-text">
                      {{ getWarnKeywordWarn(illegalWord, spec.name) }}
                    </p>
                  </template>
                  <a-input
                    :disabled="disableVariants"
                    v-input-text-count="{
                      max: specName,
                      required: true,
                      extraTop: '29px',
                      calcByteLen: isCnscStore
                    }"
                    placeholder="输入规格名称,例如:颜色等等"
                    :maxLength="specName"
                    @input="onSpaceNameInput(index)"
                    v-model="spec.name"
                  />
                </a-form-model-item>
                <span style="position: absolute; right: 70px; top: 0">
                  <a-space>
                    <a-button
                      v-if="product.specs.length > 1"
                      v-tooltip="'置换规格'"
                      @click="transformSpecsItem(index)"
                      type="primary"
                      shape="circle"
                      :disabled="disableVariants"
                    >
                      <a-icon type="swap" />
                    </a-button>
                    <template v-if="product.specs.length > 1">
                      <a-button
                        @click="removeSpecsItem(index)"
                        shape="circle"
                        :disabled="disableVariants"
                      >
                        <a-icon type="delete" />
                      </a-button>
                    </template>
                  </a-space>
                </span>
              </div>
              <!-- 规格名 end -->

              <!-- 规格值 start -->
              <div v-for="i in showMoreRange(spec)" :key="i">
                <div>
                  <a-popover placement="top">
                    <template slot="content">
                      <img
                        style="width: 300px; height: 300px; border-radius: 2px"
                        v-lazy="spec.imagesUrl[i]"
                      />
                      <div v-if="editType != '1'">
                        <p
                          @click="uploadSpeceItemImage(index, i)"
                          class="space-image-action-liat-item"
                        >
                          {{ $t('edit.uploadImage') }}
                        </p>
                        <p
                          @click="gatherSpeceItemImage(index, i)"
                          class="space-image-action-liat-item"
                        >
                          {{ $t('edit.gatherImage') }}
                        </p>
                        <p
                          @click="openEditImg(spec.imagesUrl[i], index, i)"
                          class="space-image-action-liat-item"
                        >
                          编辑图片
                        </p>
                        <p
                          v-if="spec.imagesUrl[i]"
                          @click="deleteSpecImg(spec.imagesUrl, index, i)"
                          class="space-image-action-liat-item"
                        >
                          {{ $t('edit.deleteImg') }}
                        </p>
                      </div>
                    </template>
                    <span
                      class="specs-image-bg"
                      :class="{
                        error: spaceImageValidCatch[`${index},${i}`]
                      }"
                    >
                      <a-tooltip placement="right">
                        <template
                          slot="title"
                          v-if="spaceImageValidCatch[`${index},${i}`]"
                        >
                          <span style="color: red">
                            {{ $t('edit.updateError') }}
                          </span>
                        </template>
                        <img
                          style="width: 40px; height: 40px; border-radius: 2px"
                          v-lazy="spec.imagesUrl[i]"
                        />
                      </a-tooltip>
                    </span>
                  </a-popover>
                  <a-form-model-item
                    class="
                      me-edit-space-input-item
                      option-input
                      me-ib me-ml-2 me-mb-4
                    "
                    prop="specOption"
                    :label-col="{ span: 2 }"
                    :help="spaceOptionValidCatch[`${index}-${i}`]"
                    :validateStatus="
                      spaceOptionValidCatch[`${index}-${i}`] ? 'error' : ''
                    "
                  >
                    <template>
                      <p
                        class="me-warn-text"
                        style="position: absolute; bottom: 28px"
                      >
                        {{ getWarnKeywordWarn(illegalWord, spec.options[i]) }}
                      </p>
                    </template>
                    <a-input
                      :disabled="disableVariants"
                      placeholder="输入规格选项,例如:红色等等"
                      @input="onSpaceOptionInput(spec, [index, i])"
                      class="me-ib"
                      v-model="spec.options[i]"
                      v-input-text-count="{
                        max: specOptionName,
                        required: true,
                        calcByteLen: isCnscStore
                      }"
                      :maxLength="specOptionName"
                    />
                  </a-form-model-item>
                  <div
                    class="
                      me-edit-space-input-item me-ib
                      option-handler
                      text-center
                    "
                  >
                    <a-space>
                      <template v-if="spec.imagesUrl.length > 1">
                        <a-button
                          shape="circle"
                          size="small"
                          class="me-ml-1"
                          :disabled="editType == 1"
                          @click="onSpecsDelete(index, i)"
                        >
                          <a-icon type="delete" class="hand" />
                        </a-button>
                      </template>
                      <!-- <template v-if="i === spec.imagesUrl.length - 1">
                        <a-button
                          shape="circle"
                          size="small"
                          :disabled="!!(editType == 1)"
                          @click="onSpecsPush(index)"
                        >
                          <a-icon type="plus" class="hand" />
                        </a-button>
                      </template> -->
                    </a-space>
                  </div>
                </div>
              </div>
              <div class="action-box">
                <a-button
                  type="dashed"
                  :disabled="attrAllLength(index) || disableVariants"
                  block
                  @click="onSpecsPush(index)"
                >
                  <a-icon type="plus"></a-icon>
                  <span>{{ $t('edit.addItem') }}</span>
                  (
                  <span>{{ attrLength(spec) }}/50</span>
                  )
                </a-button>
                <div v-show="attrAllLength(index)" class="item-tips">
                  {{ $t('edit.variantMax', { max: 50 }) }}
                </div>
              </div>
              <!-- 规格值 end -->
            </div>
            <div
              v-if="product.specs && product.specs.length < 2"
              class="add-button"
              :disabled="disableVariants"
            >
              <div @click="pushSpecs" :disabled="disableVariants">
                <a-icon type="plus"></a-icon>
                增加商品规格
              </div>
            </div>
          </div>

          <!-- 展开隐藏 start -->
          <template v-if="showMoreSpecs">
            <p class="me-text-center me-show-more">
              <span @click="showMoreSpec = !showMoreSpec">
                <template v-if="showMoreSpec">
                  {{ $t('common.putAll') }}
                </template>
                <template v-else>
                  {{ $t('common.viewAll') }}
                </template>
                <a-icon
                  class="me-rotate-90"
                  :class="{ active: !showMoreSpec }"
                  type="double-right"
                />
              </span>
            </p>
          </template>
          <!-- 展开隐藏 end -->
        </div>
      </a-form-model-item>
    </template>
    <!-- 多规格 end -->

    <!-- 折扣设置 start -->
    <!-- editType == 1 && product.status === 'NORMAL' -->
    <template v-if="false">
      <a-form-model-item class="me-mb-0" :label="$t('edit.discountSettings')">
        <a-form-model-item class="me-ib me-mr-2">
          <a-space>
            <a-select
              @change="onDiscountIdChange"
              allowClear
              v-model="product.discountId"
              :placeholder="$t('edit.placeChoose')"
              style="width: 200px"
            >
              <a-select-option
                v-for="discount in discountOptions"
                :key="discount.discountId"
                :value="discount.discountId"
              >
                {{ discount.discountName }}
              </a-select-option>
            </a-select>
            <a-tooltip title="刷新数据">
              <a-button type="link" @click="getDiscountOptions" class="me-pa-0">
                <a-icon type="redo" v-if="loadingDiscount" class="hand" />
                <a-icon v-else type="loading" />
              </a-button>
            </a-tooltip>
            <a-button
              class="me-fr"
              @click="openPage('/discount/list?open=yes')"
            >
              <i class="iconfont icon-add-image"></i>
              {{ $t('discount.addAct') }}
            </a-button>
          </a-space>
        </a-form-model-item>

        <template v-if="product.discountId">
          <a-form-model-item prop="discount" class="me-ib me-mr-2">
            <a-input-number
              :max="9.9"
              :min="0.1"
              v-model="product.discount"
              @change="onDiscountChange"
              style="width: 200px"
            />
            <span class="me-mr-1">
              {{ $t('edit.discount1') }}
            </span>
          </a-form-model-item>
          <a-form-model-item prop="purchaseLimit" class="me-ib me-mr-2">
            <a-input-number
              style="width: 200px"
              v-model="product.purchaseLimit"
            />
            <span class="me-mr-1 me-ml-1">
              {{ $t('edit.pieces') }}
            </span>
          </a-form-model-item>
        </template>
      </a-form-model-item>
    </template>
    <!-- 折扣设置 end -->

    <!-- 多规格商品 start -->
    <template v-if="product.hasVariation">
      <a-form-model-item
        required
        prop="id"
        :wrapper-col="{ span: 20 }"
        :label="$t('edit.productSpecList')"
      >
        <!-- 规格变体 start -->
        <a-table
          :rowKey="(record, index) => index"
          class="custom-variants-table"
          size="small"
          bordered
          :pagination="false"
          :columns="variantsTableColumns"
          :data-source="getProductVariants"
        >
          <template slot="title">
            <a-space>
              <!-- <span class="me-mr-2">{{ $t('edit.onKeySettings') }}</span> -->
              <a-button
                size="small"
                @click="setPrice"
                :disabled="!!product.discountId"
              >
                {{ $t('edit.batchModificationPrice') }}
              </a-button>
              <a-button size="small" @click="setStockVisible = true">
                {{ $t('edit.batchModificationStock') }}
              </a-button>
              <a-button size="small" @click="onKeySettingSKU">
                {{ $t('edit.oneKeyEditSpecCode') }}
              </a-button>

              <!-- <a-tooltip>
                <template slot="title">
                  {{ $t('edit.generatStockSkuHelp') }}
                </template>
                <a-button
                  size="small"
                  v-auth="'goods:edit:sku'"
                  :disabled="disableVariants"
                  @click="onGenerate"
                >
                  {{ $t('edit.generatStockSku') }}
                  <a-icon type="info-circle" />
                </a-button>
              </a-tooltip> -->
            </a-space>
          </template>
          <template slot="footer" v-if="product.variants.length > 5">
            <a
              @click="spcesTableOpen = !spcesTableOpen"
              class="me-text-center me-link"
              style="display: block"
            >
              <template v-if="spcesTableOpen">
                <!-- 展开状态 -->
                {{
                  $t('commodityList.close', {
                    c: product.variants.length - 5,
                    t: product.variants.length
                  })
                }}
              </template>
              <template v-else>
                <!-- 收起状态 -->
                {{
                  $t('commodityList.open', {
                    c: product.variants.length - 5,
                    t: product.variants.length
                  })
                }}
              </template>
              <a-icon :type="spcesTableOpen ? 'up' : 'down'" />
            </a>
          </template>
          <template slot="customDiscountSwitch">
            <a-switch
              :checked="discountSwitchChecked"
              @change="onDiscountSwitchChange"
              :disabled="disableVariants"
            />
            <span class="me-ml-2">{{ $t('edit.discount2') }}</span>
          </template>
          <span slot="discountSwitch" slot-scope="text, record">
            <a-switch
              :checked="record.promotionStatus === 1"
              @change="record.promotionStatus = $event ? 1 : 0"
              :disabled="disableVariants"
            />
            <template v-if="record.discount">
              <span class="me-ml-1 me-mr-1">
                {{ record.discount }}
              </span>
              {{ $t('edit.discount1') }}
            </template>
          </span>
          <span slot="promotionPrice" slot-scope="text, record">
            <a-form-model-item
              class="me-mb-0"
              :validateStatus="record._promotionPrice_valid_ ? 'error' : null"
            >
              <a-tooltip placement="right">
                <template slot="title" v-if="record._promotionPrice_valid_">
                  <span>{{ $t('edit.promotionPriceMessage') }}</span>
                </template>

                <a-input-number
                  :max="record.price"
                  :min="0"
                  :step="0.01"
                  size="small"
                  v-model="record.promotionPrice"
                  :disabled="disableVariants ? true : !!product.discountId"
                  @change="onPromotionPriceChange"
                />
              </a-tooltip>
            </a-form-model-item>
          </span>
          <span slot="_index_" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <div slot="priceTitle">
            {{ $t('edit.price') }}
            <a-tooltip
              :title="$t('edit.useOriginalPrice')"
              v-if="isHasOriginalPrice"
            >
              <a-button
                type="link"
                :disabled="disableVariants"
                @click="allOriginalPriceClick"
              >
                <a-icon
                  style="cursor: pointer; margin-right: 8px; color: #40a9ff"
                  type="undo"
                />
              </a-button>
            </a-tooltip>
          </div>
          <span slot="price" slot-scope="text, record, index">
            <a-form-model-item
              class="me-mb-0"
              :validateStatus="record._price_valid_ ? 'error' : null"
            >
              <a-tooltip placement="right">
                <template slot="title" v-if="record._price_valid_">
                  <span>
                    {{
                      $t('edit.priceMessage', {
                        min: storeLimit.minPriceLimit,
                        max: storeLimit.maxPriceLimit
                      })
                    }}
                  </span>
                </template>
                <span>{{ product.currency }}</span>
                <a-input-number
                  :min="0"
                  :step="0.01"
                  class="me-ml-2"
                  v-model="record.price"
                  :formatter="
                    (value) =>
                      String(value).replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
                  "
                  :parser="
                    (value) =>
                      String(value).replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
                  "
                  :disabled="!!product.discountId"
                  size="small"
                  @change="onVariantChange(index, ['price', 'promotionPrice'])"
                />
              </a-tooltip>
              <a-tooltip
                :title="$t('edit.useOriginalPrice')"
                v-if="record.resetPrice && record.resetPrice != record.price"
              >
                <a-icon
                  style="cursor: pointer; margin-left: 3px; color: #f7622f"
                  @click="resetPriceClick(index, ['price', 'promotionPrice'])"
                  type="undo"
                />
              </a-tooltip>
            </a-form-model-item>
          </span>
          <span slot="_rmbPrice_" slot-scope="text, record">
            {{ record.rmbPrice }}
          </span>

          <span slot="_stockSku_" slot-scope="text, record">
            <a-input
              size="small"
              v-model="record.stockSku"
              :disabled="disableVariants ? true : !!product.discountId"
            />
          </span>

          <span slot="stock" slot-scope="text, record, index">
            <a-form-model-item
              class="me-mb-0"
              :validateStatus="record._stock_valid_ ? 'error' : null"
            >
              <a-tooltip placement="right">
                <template slot="title" v-if="record._stock_valid_">
                  <span>{{ $t('edit.stockMessage') }}</span>
                </template>

                <a-input-number
                  :step="1"
                  :min="0"
                  :max="storeType == 'cnsc' ? 99999 : Infinity"
                  v-model="record.stock"
                  size="small"
                  @change="onVariantChange(index, ['stock'])"
                />
              </a-tooltip>
              <a-button
                @click="clearSpecsStock(index)"
                style="padding-left: 4px"
                size="small"
                type="link"
              >
                {{ $t('edit.clearSotck') }}
              </a-button>
            </a-form-model-item>
          </span>
          <span slot="specCode" slot-scope="text, record, index">
            <a-form-model-item class="me-mb-0">
              <!-- :validateStatus="record._variationSku_valid_ ? 'error' : null" -->
              <a-tooltip placement="right">
                <!-- <template slot="title" v-if="record._variationSku_valid_">
                  <span>{{ $t('edit.specCodeMessage') }}</span>
                </template> -->
                <!-- :maxLength="20" -->
                <a-input
                  v-model="record.variationSku"
                  size="small"
                  @input="onVariantChange(index, ['variationSku'])"
                />
              </a-tooltip>
            </a-form-model-item>
          </span>
          <!-- <span slot="operate" slot-scope="text, record, index">
            <a-button
              @click="clearSpecsStock(index)"
              size="small"
              type="link"
              :disabled="disableVariants"
            >
              {{ $t('edit.clearSotck') }}
            </a-button>
          </span> -->
        </a-table>
        <!-- 规格变体 end -->

        <!-- 批发价设置 start -->
        <template v-if="editType != 0 && product.merchantId === 0">
          <p class="me-mt-4">{{ $t('edit.tradePriceHelp') }}</p>
          <template v-if="showTradePrice">
            <template v-if="product.wholesales && product.wholesales.length">
              <a-table
                class="custom-variants-table me-mt-2"
                size="small"
                bordered
                :pagination="false"
                :columns="wholesalesTableColumns"
                :data-source="product.wholesales"
              >
                <template slot="index" slot-scope="text, record, index">
                  {{ $t('edit.tradePrice2') }}{{ index + 1 }}
                </template>
                <template slot="min" slot-scope="text, record, index">
                  <a-form-model-item
                    class="me-mb-0"
                    required
                    :prop="`wholesales.${index}.minCount`"
                    :rules="wholesalesRules(index, 'minCount', product)"
                    :validateStatus="
                      isValidate &&
                      record._min_valid_ &&
                      record._min_valid_.length
                        ? 'error'
                        : ''
                    "
                  >
                    <a-input-number
                      style="width: 100%"
                      :min="0"
                      size="small"
                      :disabled="!!index"
                      v-model="record.minCount"
                    />
                  </a-form-model-item>
                </template>
                <template slot="max" slot-scope="text, record, index">
                  <a-form-model-item
                    class="me-mb-0"
                    :prop="`wholesales.${index}.maxCount`"
                    :rules="wholesalesRules(index, 'maxCount', product)"
                    :validateStatus="
                      isValidate &&
                      record._max_valid_ &&
                      record._max_valid_.length
                        ? 'error'
                        : ''
                    "
                  >
                    <a-input-number
                      style="width: 100%"
                      :min="0"
                      size="small"
                      v-model="record.maxCount"
                      @change="(e) => wholesaleMaxChange(e, record, index)"
                    />
                  </a-form-model-item>
                </template>
                <template slot="unitPrice" slot-scope="text, record, index">
                  <a-form-model-item
                    class="me-mb-0"
                    :prop="`wholesales.${index}.unitPrice`"
                    :rules="wholesalesRules(index, 'unitPrice', product)"
                    :validateStatus="
                      isValidate &&
                      record._unitPrice_valid_ &&
                      record._unitPrice_valid_.length
                        ? 'error'
                        : ''
                    "
                  >
                    <a-input-number
                      :min="0"
                      class="me-ib"
                      style="width: calc(100% - 50px)"
                      size="small"
                      v-model="record.unitPrice"
                    />
                    <span class="me-ib me-text-center" style="width: 50px">
                      {{ product.currency }}
                    </span>
                  </a-form-model-item>
                </template>
                <template slot="handler" slot-scope="text, record, index">
                  <a-button
                    :disabled="disableVariants"
                    @click="deleteWholesale(index, record)"
                    type="link"
                  >
                    <a>{{ $t('common.delete') }}</a>
                  </a-button>
                </template>
              </a-table>
            </template>

            <a-button
              class="me-mt-4"
              shape="round"
              block
              style="color: #ff8859"
              @click="onPushTradePrice"
              :disabled="disableVariants"
            >
              {{ $t('edit.appendTradePrice') }}
            </a-button>
            <div
              class="wholesales-error-message-content me-mt-3"
              v-if="getWholesalesErrorMessage().length"
            >
              <p
                v-for="(msg, index) in getWholesalesErrorMessage().slice(0, 1)"
                :key="index"
              >
                {{ msg }}
              </p>
            </div>
          </template>
        </template>
        <!-- 批发价设置 end -->
      </a-form-model-item>
    </template>
    <!-- 多规格商品 end -->

    <!-- 设置库存 start -->
    <a-modal
      :maskClosable="false"
      destroyOnClose
      :title="$t('edit.setStock')"
      :visible="setStockVisible"
      :confirm-loading="setStockConfirmLoading"
      @ok="onKeySettingStock"
      @cancel="setStockVisible = false"
    >
      <a-form :form="setStockForm">
        <a-form-item>
          <a-input-number
            style="width: 100%"
            :min="0"
            :max="storeType == 'cnsc' ? 99999 : Infinity"
            v-decorator="['stock', { rules: rules.stock }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 设置库存 end -->

    <!-- 设置定价 start  -->
    <a-modal
      :visible="setPriceVisible"
      :title="$t('edit.setPrice')"
      @ok="onOkSetPrice"
      @cancel="setPriceVisible = false"
      :maskClosable="false"
      destroyOnClose
      :width="800"
    >
      <SetCnscPriceTemplate ref="setCnscPriceTemplate" :list="product" />
    </a-modal>

    <!-- 设置定价 start  -->
    <a-modal
      :visible="setPriceTemplateVisible"
      :title="$t('searchForm.setPrice')"
      :confirm-loading="setPriceTemplateConfirmLoading"
      @ok="onOkSetPriceTemplate"
      @cancel="setPriceTemplateVisible = false"
      :maskClosable="false"
      destroyOnClose
      width="70%"
    >
      <SetPriceTemplate ref="setPriceTemplate" :list="product" />
    </a-modal>
    <!-- 设置定价 end  -->
  </a-form-model>
</template>

<script>
/**
1：在线商品不能动折扣
2：在线商品有折扣是不能动价格的
2: 在线商品有折扣不能动变体和规格
 */
import {
  range,
  cloneDeep,
  compact,
  uniqWith,
  isEqual,
  maxBy,
  mean,
  round,
  max,
  min,
  isEmpty,
  countBy
} from 'lodash'
import Goods from '@/api/goods'
import Basic from '@/api/basic'
import { mapState } from 'vuex'
import { division, getByteLen, openZhihuiEditor, add } from '@/util'
import { PRICE, POSITIVE_NUMBER } from '@/util/regex'
import { getWarnKeywordWarn, urlParamsToObject } from '@/util/handle'
import { loadImage } from '@/util/document'
import SetPriceTemplate from '../setPriceTemplate/SetPriceTemplate'
import SetCnscPriceTemplate from '../setPriceTemplate/SetCnscPriceTemplate'
import { wholesalesRules } from './common'
import { positiveNumber } from '@/directive/number'

const getRmbPrice = (price, rate) => {
  if (!rate) return Number(price).toFixed(2)
  return Number(division(price, rate).toFixed(2))
}

const getPriceNum = (price) => {
  if (!price) return 0
  return Number(Number(price).toFixed(2))
}

const getIntegerNum = (price) => {
  if (!price) return 0
  return Number.parseInt(Number(price).toFixed(2))
}

/**最高价和最低价相差比较 */
const diffSource = {
  // 马来西亚
  MY: {
    local: 7,
    overseas: 7
  },
  // 台湾
  TW: {
    local: 5,
    overseas: 5
  },
  // 菲律宾
  PH: {
    local: 5,
    overseas: 5
  },
  // 越南
  VN: {
    local: 5,
    overseas: 5
  },
  // 巴西
  BR: {
    local: 5,
    overseas: 5
  },
  // 印尼
  ID: {
    local: 7,
    overseas: 7
  },
  // 新加坡
  SG: {
    local: 7,
    overseas: 7
  },
  // 泰国
  TH: {
    local: 5,
    overseas: 5
  },
  MX: {
    local: 5,
    overseas: 5
  },
  DF: {
    local: 5,
    overseas: 5
  },
  // 哥伦比亚
  CO: {
    local: 9,
    overseas: 9
  },
  // 智利
  CL: {
    local: 9,
    overseas: 9
  }
}

/**店铺类别 */
const storeTypeInfo = {
  1: 'local',
  2: 'overseas'
}

export default {
  data() {
    /**价格校验 */
    const priceValidator = (rule, value, callback) => {
      const maxLimit = this.shopItemLimit?.priceLimit?.max_limit
      const minLimit = this.shopItemLimit?.priceLimit?.min_limit
      if (!Number(value)) {
        callback(new Error(this.$t('edit.priceValid2')))
        return
      }
      const { minPriceLimit, maxPriceLimit } = this.storeLimit
      if (value > maxPriceLimit || min < minPriceLimit) {
        callback(
          this.$t('edit.priceMessage', {
            min: minPriceLimit,
            max: maxPriceLimit
          })
        )
      }
      if (PRICE.test(value)) {
        callback()
        return
      }

      callback(new Error(this.$t('edit.priceValid2')))
    }
    /**库存校验 */
    const stockValidator = (rule, value, callback) => {
      if (value == 0) {
        callback()
        return
      }
      if (POSITIVE_NUMBER.test(value)) {
        callback()
        return
      }
      callback(new Error(this.$t('edit.inputNumberError')))
    }
    /**折扣校验 */
    const discountValid = (rule, value, callback) => {
      if (0 >= value || value > 10) {
        callback(new Error(this.$t('edit.discountValid2')))
        return
      }
      if (!PRICE.test(value)) {
        callback(new Error(this.$t('edit.discountValid3')))
        return
      }
      callback()
    }
    /**折扣件数校验 */
    const purchaseLimitValid = (rule, value, callback) => {
      value = Number(value)
      if (!value) {
        callback(new Error(this.$t('edit.purchaseLimitValid2')))
        return
      }
      if (!POSITIVE_NUMBER.test(value)) {
        callback(new Error(this.$t('edit.purchaseLimitValid2')))
        return
      }
      callback()
    }

    // let disableVariants

    // if (this.$route.query.edit == 1) disableVariants = true
    // else disableVariants = false

    return {
      disableVariants: this.$route.query.edit == 1,
      range,
      rules: {
        hasVariation: [
          { required: true, message: this.$t('edit.hasVariationValid') }
        ],
        price: [
          { required: true, message: this.$t('edit.priceValid') },
          { validator: priceValidator }
        ],
        stock: [
          { required: true, message: this.$t('edit.stockValid') },
          { validator: stockValidator }
        ],
        discount: [
          { required: true, message: this.$t('edit.discountValid1') },
          { validator: discountValid }
        ],
        purchaseLimit: [
          { required: true, message: this.$t('edit.purchaseLimitValid1') },
          { validator: purchaseLimitValid }
        ]
      },
      spaceOptionValidCatch: {} /**规格值校验 */,
      spaceImageValidCatch: {} /**规格图片校验 */,
      discountOptions: [],
      getWarnKeywordWarn,
      wholesalesTableColumns: [
        {
          title: '#',
          dataIndex: 'index',
          key: 'index',
          scopedSlots: { customRender: 'index' }
        },
        {
          title: this.$t('edit.minAmount'),
          dataIndex: 'minCount',
          // key: 'min',
          scopedSlots: { customRender: 'min' }
        },
        {
          title: this.$t('edit.maxAmount'),
          dataIndex: 'maxCount',
          // key: 'max',
          scopedSlots: { customRender: 'max' }
        },
        {
          title: this.$t('edit.unitPrice'),
          dataIndex: 'unitPrice',
          key: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' }
        },
        {
          title: this.$t('edit.operate'),
          dataIndex: 'handler',
          key: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ],
      imageSpecTransition: false,
      spcesTableOpen: false,
      showMoreSpec: false /**显示隐藏更多规格 */,
      setStockVisible: false /**设置库存 */,
      setStockConfirmLoading: false /**设置库存 */,
      setStockForm: this.$form.createForm(this),
      setPriceVisible: false /**设置价格 */,
      setPriceTemplateVisible: false /**设置价格 */,
      setPriceTemplateConfirmLoading: false /**设置价格 */,
      isHasOriginalPrice: false /**是否是原价 */,
      batchPriceVisible: null /**批量设置价格 */,
      storeType: null, //店铺类型
      loadingDiscount: true,
      isValidate: false,
      wholesales: [], //映射product.wholesales数据
      isCnscStore: !!this.$route.query.merchantId,
      editorData: {
        index: null,
        parentIndex: null
      }
    }
  },
  components: {
    SetPriceTemplate,
    SetCnscPriceTemplate
  },
  directives: {
    positiveNumber
  },
  watch: {
    product(val) {
      this.wholesales = val.wholesales
    }
  },
  mounted() {
    const { storeId, merchantId } = this.$route.query
    this.storeType = storeId ? 'normal' : this.storeType
    this.storeType = merchantId ? 'cnsc' : this.storeType
    let params = { current: 1, status: 0, storeId }
    Goods.getDiscountList(params).then(({ data }) => {
      this.$data.discountOptions = data
    })
    this.renderSpecsFramework()
  },
  computed: {
    // 规格属性总长是否超50
    attrAllLength({ product }) {
      console.log(product)
      return (idx) => {
        const first = product.specs?.reduce((acc, cur, index) => {
          let val = cur.options.length
          if (index === 0) {
            val += 1
          }
          return (acc *= val)
        }, 1)
        const second = product.specs?.reduce((acc, cur, index) => {
          let val = cur.options.length
          if (index) {
            val += 1
          }
          return (acc *= val)
        }, 1)
        const arr = [idx === 0 ? first : second]
        return arr.some((item) => item > 50)
      }
    },
    erweima() {
      return require('@/assets/images/wechat-code-3.png')
    },
    ...mapState({
      targetLangList: (state) => state.product.targetLangList,
      storeLimit: (state) => {
        const params = urlParamsToObject(location.href.split('?')[1])
        if (params.edit == 0) {
          return {}
        }
        return state.product.storeLimit
      },
      illegalWord: (state) => state.product.illegalWord,
      shopItemLimit: (state) => state.vars?.shopItemLimit,
      specName: (state) =>
        state.vars?.shopItemLimit?.tier_variation_name_length_limit
          ?.max_limit ?? 14,
      specOptionName: (state) =>
        state.vars?.shopItemLimit?.tier_variation_option_length_limit
          ?.max_limit ?? 20
    }),
    minPriceLimit() {
      return this.shopItemLimit?.priceLimit?.min_limit
    },
    maxPriceLimit() {
      return this.shopItemLimit?.priceLimit?.max_limit
    },
    /**变体表格折扣开关状态 */
    discountSwitchChecked() {
      const product = this.$props.product
      return product.variants
        .map(({ promotionStatus }) => promotionStatus)
        .every(Boolean)
    },
    /**获取动态规格属性索引 */
    generateSpecsIndex() {
      return (index) => `_specs_${index}_`
    },
    /**动态规格表格配置项参数 */
    getSpecsGroupColumn() {
      const { specs } = this.$props.product
      if (specs) {
        return specs.map(({ name }, index) => {
          const dataIndex = this.generateSpecsIndex(index)
          return {
            title: name,
            dataIndex: dataIndex,
            key: dataIndex
          }
        })
      }
      return []
    },
    /**变体表格配置 */
    variantsTableColumns() {
      const { discountId } = this.$props.product

      const getDiscountSwitch = () => {
        if (discountId) {
          return {
            dataIndex: 'discountSwitch',
            key: 'discountSwitch',
            slots: { title: 'customDiscountSwitch' },
            scopedSlots: { customRender: 'discountSwitch' },
            width: 130
          }
        }
        return null
      }
      const getDiscountPrice = () => {
        if (discountId) {
          return {
            dataIndex: 'promotionPrice',
            key: 'promotionPrice',
            title: this.$t('edit.discountPrice'),
            scopedSlots: { customRender: 'promotionPrice' }
          }
        }
        return null
      }
      const getDiscountRmbPrice = () => {
        if (discountId) {
          return {
            title: this.$t('edit.rmbprice'),
            dataIndex: 'rmbPromotionPrice',
            key: 'rmbPromotionPrice'
          }
        }
        return null
      }

      const getStockSku = () => {
        const rules = this.$store.getters.buttonRules
        const { path } = this.$route
        if (!rules[path] || !rules[path].includes('goods:edit:sku')) {
          return null
        }
        return {
          title: this.$t('edit.stockSku'),
          dataIndex: 'stockSku',
          key: 'stockSku',
          scopedSlots: { customRender: '_stockSku_' }
        }
      }

      return compact([
        {
          title: '#',
          dataIndex: '_index_',
          key: '_index_',
          scopedSlots: { customRender: '_index_' },
          width: 43,
          align: 'center'
        },
        ...this.getSpecsGroupColumn,
        {
          dataIndex: 'price',
          key: 'price',
          slots: { title: 'priceTitle' },
          scopedSlots: { customRender: 'price' },
          width: '170px'
        },
        {
          title: this.$t('edit.RMB'),
          dataIndex: '_rmbPrice_',
          key: '_rmbPrice_',
          scopedSlots: { customRender: '_rmbPrice_' }
        },
        getDiscountSwitch(),
        getDiscountPrice(),
        getDiscountRmbPrice(),
        {
          title: this.$t('edit.stock'),
          key: 'stock',
          dataIndex: 'stock',
          scopedSlots: { customRender: 'stock' },
          width: 150
        },
        {
          title: this.$t('edit.specCode'),
          key: 'specCode',
          scopedSlots: { customRender: 'specCode' },
          width: 100
        },
        getStockSku()
        // {
        //   title: this.$t('edit.operate'),
        //   key: 'operate',
        //   scopedSlots: { customRender: 'operate' },
        //   width: '100px'
        // }
      ]) /**变体表格配置 */
    },
    /**获取变体索引 */
    getSpecsIndexs() {
      return (product) => {
        if (!product.hasVariation) return
        const ranges = product.specs.map(({ options }) => range(options.length))
        let _arr = []
        const befor = range(ranges.length).map((index) => {
          return `ranges[${index}].forEach((index${index}) => {`
        })
        const after = range(ranges.length).map(() => `})`)
        let center = range(ranges.length).map((index) => `index${index}`)
        center = `_arr.push([${center.join(',')}])`
        const evalStr = [...befor, center, ...after].join('')
        eval(evalStr)
        return _arr
      }
    },
    /**获取变体SKU规格键值 */
    getSpecsValus() {
      return (product) => {
        if (!product.hasVariation) return
        const specs = cloneDeep(product.specs)
        const ranges = specs.map(({ options }) => range(options.length))
        let _obj = {}
        const befor = range(ranges.length).map((index) => {
          return `\nranges[${index}].forEach((index${index}) => {\n`
        })
        const center = `
            let _key = [${range(ranges.length)
              .map((index) => `index${index}`)
              .join(',')}]
            _key = _key.join(",")
            const _specs = specs.map((specsItem, specsIndex) => {
              ${range(specs.length)
                .map((index) => {
                  return `
                if(specsIndex === ${index}) {
                  var specsValue = { specsName: specsItem.name, value: specs[${index}].options[index${index}] }
                }
              `
                })
                .join('')}
                return specsValue
          })
          _obj[_key] = _specs
        `
        const after = range(ranges.length).map(() => `\n})\n`)
        const evalStr = [...befor, center, ...after].join('')
        eval(evalStr)
        return _obj
      }
    },
    /**展开收起数据 */
    getProductVariants() {
      const product = this.$props.product
      const spcesTableOpen = this.$data.spcesTableOpen
      if (spcesTableOpen) {
        return product.variants
      }
      return product.variants.slice(0, 5)
    },
    /**批发价显示隐藏 */
    showTradePrice() {
      const product = this.$props.product
      const prices = product.variants.map(({ price }) => price)
      return uniqWith(prices, isEqual).length === 1
    },
    /**编辑类型*/
    editType() {
      return this.$route.query.edit
    },
    statusType() {
      return this.$route.query.status
    },
    /**展开更多规格 */
    showMoreSpecs() {
      const { specs = [] } = this.$props.product
      return max(specs?.map(({ options }) => options.length)) > 4
    },
    /**规格值长度 */
    showMoreRange() {
      return ({ options }) => {
        const { showMoreSpec } = this.$data
        if (options.length > 4) {
          if (!showMoreSpec) {
            return range(4)
          }
          return range(options.length)
        } else {
          return range(options.length)
        }
      }
    },
    getDiffmodel() {
      const product = this.$props.product
      const diffmodel = diffSource[product.countryCode]
      return product.storeType
        ? diffmodel[storeTypeInfo[product.storeType]]
        : 100 // cnsc没有限制
    }
  },
  model: {
    prop: 'product',
    event: 'input'
  },
  props: {
    product: Object,
    labelCol: {
      type: Object,
      default: () => ({ span: 3 })
    },
    wrapperCol: {
      type: Object,
      default: () => ({ span: 12 })
    }
  },
  methods: {
    getWholesalesErrorMessage() {
      const product = this.$props.product
      const errors = product.wholesales.map((wholesale) => {
        const { _min_valid_, _max_valid_, _unitPrice_valid_ } = wholesale
        const arrs = []
        if (_min_valid_ && _min_valid_.length) {
          arrs.push(_min_valid_.join())
        }
        if (_max_valid_ && _max_valid_.length) {
          arrs.push(_max_valid_.join())
        }
        if (_unitPrice_valid_ && _unitPrice_valid_.length) {
          arrs.push(_unitPrice_valid_.join())
        }
        return arrs.join()
      })
      return compact(errors)
    },
    // 规则属性长度
    attrLength(item) {
      return item?.options?.length ?? 0
    },
    // 重新获取
    async getDiscountOptions() {
      const { storeId, merchantId } = this.$route.query
      this.storeType = storeId ? 'normal' : this.storeType
      this.storeType = merchantId ? 'cnsc' : this.storeType
      let params = { current: 1, status: 0, storeId }
      this.$data.loadingDiscount = false
      await Goods.getDiscountList(params).then(({ data }) => {
        this.$data.discountOptions = data
      })
      this.$data.loadingDiscount = true
    },
    /**变体折扣开关改变事件 */
    onDiscountSwitchChange(checked) {
      const product = cloneDeep(this.$props.product)
      product.variants = product.variants.map((variant) => {
        variant.promotionStatus = checked ? 1 : 0
        return variant
      })
      this.$emit('input', product)
    },
    /**活动折扣改变事件 */
    onDiscountIdChange(value) {
      const product = cloneDeep(this.$props.product)
      if (!value) {
        product.discount = null
        product.purchaseLimit = null
      }

      if (product.hasVariation) {
        product.variants = product.variants.map((variant) => {
          variant.discountId = value

          if (!value) {
            variant.discountId = null
            variant.discount = null
            variant.purchaseLimit = null
          }
          return variant
        })
      }
      this.$emit('input', product)
    },
    /**价格输入事件 */
    onPriceInput() {
      this.renderVariants()
    },
    // 只能输入数字
    priceChange(e) {
      let val = e.target.value
      this.product.price = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
    },
    /**规格名称键盘输入事件 */
    onSpaceNameInput(index) {
      const product = cloneDeep(this.$props.product)
      let specs = product.specs[index]
      product.specs[index] = this.onSpecsNameValid(specs)
      this.$emit('input', product)
    },
    /**
     * 生成本地SKU
     */
    async onGenerate() {
      const product = cloneDeep(this.$props.product)
      let { productItemSku, variants } = product
      const _variants = variants.map((element) => {
        if (!element._isHistorySku) {
          element.stockSku = `${productItemSku}-${element.variationSku}`
        }
        return element
      })
      product.variants = _variants
      this.$emit('input', product)
    },
    /**规格值键盘输入事件 */
    onSpaceOptionInput(spec, [index, subIndex]) {
      const spaceOptionValidCatch = this.$data.spaceOptionValidCatch
      const field = [index, subIndex].join('-')
      let vs = null
      if (!spec.options[subIndex]) {
        vs = this.$t('edit.spaceOptionValid')
      }
      if (this.storeLimit) {
        // const storeLimit = this.storeLimit
        let space_options_len = spec.options[subIndex].length
        if (this.storeType == 'cnsc') {
          space_options_len = getByteLen(spec.options[subIndex])
        }
        if (space_options_len > Number(this.specOptionName)) {
          vs = this.$t('edit.spaceOptionValid2', {
            start: 1,
            end: this.specOptionName
          })
        }
      }

      const counts = countBy(spec.options)
      const count = counts[spec.options[subIndex]]
      if (count > 1) vs = '规格值不允许重复'

      this.$set(spaceOptionValidCatch, field, vs)
      this.renderSpecsFramework()
      return vs
    },
    /**渲染变体结构 */
    renderSpecsFramework(product) {
      if (!product) {
        product = cloneDeep(this.$props.product)
      }
      if (!product.hasVariation) return
      const arrs = this.getSpecsIndexs(product).map((vindex) => {
        let current = product.variants.find((variant) => {
          return variant.index.join() === vindex.join()
        })
        if (!current) current = { index: vindex }
        const variantSpecs = this.getSpecsValus(product)[vindex.join()]
        variantSpecs.forEach((spec, index) => {
          const key = this.generateSpecsIndex(index)
          current[key] = spec.value
        })
        return current
      })
      product.variants = arrs
      // 是否SKU有原价
      this.isHasOriginalPrice = product.variants.some(
        (val) => val.resetPrice && val.resetPrice != val.price
      )
      this.$emit('input', product)
    },
    /**渲染价格（基础为原价） */
    renderVariants(product, field) {
      if (!product) {
        product = cloneDeep(this.$props.product)
      }
      let { discountId, price, rate, hasVariation, variants } = product
      let rmbPrice = 0
      if (price) {
        rmbPrice = getRmbPrice(price, rate)
        product.rmbPrice = rmbPrice
      }

      /**单品设置价格 */
      if (discountId) {
        let discount = Number(product.discount) / 10
        if (!discount) discount = 0

        let promotionPrice = Number(price * discount).toFixed(2)
        let rmbPromotionPrice = Number(rmbPrice * discount).toFixed(2)
        product.promotionPrice = promotionPrice
        product.rmbPromotionPrice = rmbPromotionPrice
      }

      /**多规格设置价格 */
      if (hasVariation) {
        product.variants = variants.map((variant) => {
          return this.renderVariant(variant, field)
        })
      }
      this.$emit('input', product)
    },
    /**渲染单行价格（基础为原价） */
    renderVariant(variant, field) {
      let { product } = this.$props
      let price = Number(variant.price)
      if (!price) price = 0
      let rmbPrice = getRmbPrice(price, product.rate)
      variant.rmbPrice = rmbPrice
      variant.rmbPrice = rmbPrice

      if (product.discountId) {
        let discount = Number(variant.discount) / 10
        if (!discount) discount = 0

        let promotionPrice = Number(price * discount).toFixed(2)
        promotionPrice = getPriceNum(promotionPrice)

        let rmbPromotionPrice = Number(rmbPrice * discount).toFixed(2)
        rmbPromotionPrice = getPriceNum(rmbPromotionPrice)

        variant.promotionPrice = promotionPrice
        variant.rmbPromotionPrice = rmbPromotionPrice
      }
      variant = this.onVariantValid(variant, field)
      return variant
    },
    /**渲染批发价及校验 */
    renderWholesales(product) {
      if (!product) {
        product = cloneDeep(this.$props.product)
      }

      if (!product.wholesales) return product

      product.wholesales = product.wholesales.map((wholesale, index) => {
        const prev = product.wholesales[index - 1]
        let meanPrice = product.variants.map(({ price }) => price)
        meanPrice = mean(meanPrice)
        wholesale.key = `${Date.now()}${index}`
        wholesale.minCount = getIntegerNum(wholesale.minCount)
        wholesale.maxCount = getIntegerNum(wholesale.maxCount)
        wholesale.unitPrice = getPriceNum(wholesale.unitPrice)
        wholesale._min_valid_ = []
        wholesale._max_valid_ = []
        wholesale._unitPrice_valid_ = []
        // if (noCheck) return wholesale
        if (!wholesale.minCount || wholesale.minCount < 2)
          wholesale._min_valid_.push(this.$t('edit.priceError2'))
        if (!wholesale.maxCount)
          wholesale._max_valid_.push(this.$t('edit.priceError1'))
        if (!wholesale.unitPrice)
          wholesale._unitPrice_valid_.push(this.$t('edit.priceError5'))
        if (prev) {
          if (wholesale.minCount <= getIntegerNum(prev.maxCount)) {
            wholesale._min_valid_.push(this.$t('edit.priceError3'))
          }
          if (wholesale.unitPrice >= getPriceNum(prev.unitPrice)) {
            wholesale._unitPrice_valid_.push(this.$t('edit.priceError9'))
          }
        }
        if (wholesale.maxCount <= wholesale.minCount) {
          wholesale._max_valid_.push(this.$t('edit.priceError11'))
        }
        if (round(wholesale.unitPrice) >= round(meanPrice)) {
          wholesale._unitPrice_valid_.push(this.$t('edit.priceError6'))
        }
        return wholesale
      })
      // this.$emit('input', product)
      return product
    },
    /**折扣输入事件 */
    onDiscountChange() {
      const product = cloneDeep(this.$props.product)
      const value = product.discount
      product.variants = product.variants.map((variant) => {
        variant.discount = value
        return variant
      })
      this.renderVariants(product, ['price', 'promotionPrice'])
    },
    /**规格属性删除 */
    onSpecsDelete(index, subIndex) {
      const product = cloneDeep(this.$props.product)
      this.$delete(product.specs[index].options, subIndex)
      this.$delete(product.specs[index].imagesUrl, subIndex)
      let variants = product.variants
        .filter((ele) => {
          return !(ele.index[index] === subIndex)
        })
        .map((item) => {
          if (item.index[index] > subIndex) item.index[index]--
          return item
        })
      product.variants = variants
      this.renderSpecsFramework(product)
    },
    /**规格属性新增 */
    onSpecsPush(index) {
      const product = cloneDeep(this.$props.product)
      const currentSpecs = product.specs
      currentSpecs[index].imagesUrl.push('')
      currentSpecs[index].options.push('')
      const multiply = currentSpecs
        .map(({ options }) => options.length)
        .reduce((prev, next) => prev * next, 1)

      if (multiply > 50) {
        this.$confirm({
          title: this.$t('common.warn'),
          content: this.$t('edit.specsPushWarning'),
          onOk: () => {
            product.specs = currentSpecs
            this.renderSpecsFramework(product)
          }
        })
        return
      }
      product.specs = currentSpecs
      this.renderSpecsFramework(product)
    },
    /**转换规格（预留2个以上规格组兼容，默认和下一个规格转换，若没有下一个规格则和上一个规格转换） */
    transformSpecsItem(index) {
      const product = cloneDeep(this.$props.product)
      const specs = product.specs
      if (!specs[index + 1]) index--
      const next = specs[index + 1]
      const prev = specs[index]
      specs[index] = next
      specs[index + 1] = prev
      product.specs = specs
      this.clearVariantsAttribute(product)
    },
    /**翻译规格图片 */
    async onTranslateImage({ lang }) {
      const product = this.$props.product
      // 原逻辑lang===EN时,storeId不需要，现在需要
      const storeId = product.storeId
      const id = product.id
      const images = product.specs
        .map(({ imagesUrl }) => imagesUrl)
        .reduce((prev, curr) => prev.concat(curr))
        .filter(Boolean)
      this.$data.imageSpecTransition = true
      var { data, code, message } = await Basic.handleTranslateImages({
        url: images,
        storeId,
        id,
        to: lang
      })

      // 翻译成功给提示，否则有其他提示
      if (code == 0) {
        this.$message.success(message)
      }

      // code==1,当天翻译超过1000，不再翻译； code==-1,翻译量700~1000使用第二个缓慢翻译接口
      if (code == -1) {
        var record = await Basic.handleCacheImages({
          url: images,
          storeId,
          id,
          to: lang
        })
        this.$message.info(record.message)
      }

      if (code == 1) {
        this.$info({
          title:
            '你本日翻译次数已达上限，请明日再试，如有疑问请微信扫码添加客服运营人员',
          content: (h) => (
            <div>
              <img src={this.erweima} style="padding-left:55px" />
            </div>
          ),
          onOk() {},
          okText: '关闭'
        })
      }

      if (record) {
        data = record.data
      }

      if (data) {
        data = data.reverse()
        product.specs = product.specs.map((spec) => {
          spec.imagesUrl = spec.imagesUrl.map((image) => {
            if (image) image = data.pop()
            return image
          })
          return spec
        })
      }
      this.$emit('input', product)
      this.$data.imageSpecTransition = false
    },
    /**删除规格 */
    removeSpecsItem(index) {
      const product = cloneDeep(this.$props.product)
      product.specs.splice(index, 1)
      this.clearVariantsAttribute(product)
    },
    /**新增规格 */
    pushSpecs() {
      const product = cloneDeep(this.$props.product)
      const specs = product.specs
      specs.push({ imagesUrl: [''], name: '', options: [''] })
      product.specs = specs
      this.clearVariantsAttribute(product)
    },
    /**清除库存 */
    clearSpecsStock(index) {
      const product = cloneDeep(this.$props.product)
      product.variants[index].stock = 0
      this.renderSpecsFramework(product)
    },
    /**一键设置SKU */
    onKeySettingSKU() {
      const product = cloneDeep(this.$props.product)
      product.variants = product.variants.map((variant, index) => {
        variant.variationSku = `${product.itemSku}-${index + 1}`
        return variant
      })
      this.renderVariants(product)
    },
    /**一键设置库存 */
    onKeySettingStock() {
      const { setStockForm } = this.$data
      setStockForm.validateFields().then(({ stock }) => {
        const product = cloneDeep(this.$props.product)
        product.variants = product.variants.map((variant) => {
          variant.stock = stock
          return variant
        })
        this.renderVariants(product)
        this.setStockVisible = false
        setTimeout(() => {
          const top = this.$el.offsetTop
          window.scrollTo({
            top: top - 120,
            behavior: 'smooth'
          })
        }, 500)
      })
    },
    /**
     * 一键设置价格
     */
    setPrice() {
      const { edit } = this.$route.query
      if (edit === '0') {
        this.batchPriceVisible = null
        this.setPriceVisible = true
      } else {
        this.setPriceTemplateVisible = true
      }
    },
    onOkSetPrice() {
      const value = this.$refs.setCnscPriceTemplate.submit()
      this.$emit('input', value)
      const product = cloneDeep(this.$props.product)
      this.isHasOriginalPrice = product.variants.some(
        (val) => val.resetPrice && val.resetPrice != val.price
      )
      this.setPriceVisible = false
    },
    /**
     * 设置金额
     */
    setSkuTablePrice(price) {
      let product = cloneDeep(this.$props.product)
      if (product.hasVariation) {
        product.variants = product.variants.map((e) => {
          e.price = price
          return e
        })
      } else {
        product.price = price
      }
      // 是否SKU有原价
      this.isHasOriginalPrice = product.variants.some(
        (val) => val.resetPrice && val.resetPrice != val.price
      )
      this.renderVariants(product)
    },
    /**一键设置价格 */
    async onOkSetPriceTemplate() {
      const product = cloneDeep(this.$props.product)
      const setPriceTemplate = this.$refs.setPriceTemplate
      let error = await setPriceTemplate.verifyData()
      if (!isEmpty(error)) {
        this.$message.error(error)
        this.$data.setPriceTemplateConfirmLoading = false
        return
      }
      this.$data.setPriceTemplateConfirmLoading = true
      setPriceTemplate
        .updateList()
        .then(async (res) => {
          // 校验价格是否小于0.01
          let error = await setPriceTemplate.verifyList(res)
          if (!isEmpty(error)) {
            this.errorAlert(error)
            this.setPriceTemplateConfirmLoading = false
            return
          }
          setTimeout(() => {
            const top = this.$el.offsetTop
            window.scrollTo({
              top: top - 120,
              behavior: 'smooth'
            })
          }, 1000)
          this.$message.success(this.$t('common.handlerSuccess'))
          this.setPriceTemplateVisible = false
          let data = res[0]
          if (product.hasVariation) {
            product.variants = data.variants
          } else {
            product.price = data.price
          }
          // 是否SKU有原价
          this.isHasOriginalPrice = product.variants.some(
            (val) => val.resetPrice && val.resetPrice != val.price
          )
          this.renderVariants(product)
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.setPriceTemplateConfirmLoading = false
        })
    },
    /**清除变体属性 */
    clearVariantsAttribute(product) {
      if (!product) {
        product = cloneDeep(this.$props.product)
      }
      product.variants = product.variants.map((variant) => {
        variant.price = null
        variant.rmbPrice = null
        variant.stock = null
        variant.variationSku = null
        variant.name = null
        variant.promotionPrice = null
        variant.rmbPromotionPrice = null
        variant.promotionStatus = null
        return variant
      })
      this.renderSpecsFramework(product)
    },
    /**价格输入改变事件 */
    onVariantChange(index, field) {
      const product = cloneDeep(this.$props.product)
      const variant = this.renderVariant(product.variants[index], field)
      product.variants[index] = variant
      if (Array.isArray(field) && field[0] == 'price') {
        // 是否SKU有原价
        this.isHasOriginalPrice = product.variants.some(
          (val) => val.resetPrice && val.resetPrice != val.price
        )
      }

      this.$emit('input', product)
    },
    /**使用原价（多规格） */
    resetPriceClick(index, field) {
      const product = cloneDeep(this.$props.product)
      product.variants[index].price = product.variants[index].resetPrice
      const variant = this.renderVariant(product.variants[index], field)
      product.variants[index] = variant
      if (Array.isArray(field) && field[0] == 'price') {
        // 是否SKU有原价
        this.isHasOriginalPrice = product.variants.some(
          (val) => val.resetPrice && val.resetPrice != val.price
        )
      }
      this.$emit('input', product)
    },
    /**全局使用原价（多规格） */
    allOriginalPriceClick() {
      const product = cloneDeep(this.$props.product)
      product.variants = product.variants.map((variant) => {
        variant.price = variant.resetPrice ? variant.resetPrice : variant.price
        return variant
      })
      this.renderVariants(product)
    },
    /**规格属性图片上传 */
    uploadSpeceItemImage(index, i) {
      const { spaceImageValidCatch } = this.$data
      loadImage({}, (files) => {
        const formData = new FormData()
        formData.append('file', files[0])
        Basic.handleUploadImages(formData)
          .then(({ data }) => {
            const product = cloneDeep(this.$props.product)
            product.specs[index].imagesUrl[i] = data[0]
            this.$emit('input', product)
            this.$set(spaceImageValidCatch, `${index},${i}`, false)
          })
          .catch((err) => {
            console.error(err)
          })
      })
    },
    /**规格属性图片采集替换 */
    gatherSpeceItemImage(index, i) {
      const { spaceImageValidCatch } = this.$data
      const product = cloneDeep(this.$props.product)
      if (!product.detailImgUrl || !product.detailImgUrl.length) {
        this.$message.error(this.$t('edit.notDetailImgUrlErrorMsg'))
        return
      }
      this.$ImageChoose(product.detailImgUrl, 1).then(([src]) => {
        if (src !== undefined) {
          product.specs[index].imagesUrl[i] = src
        }
        this.$emit('input', product)
        this.$set(spaceImageValidCatch, `${index},${i}`, false)
      })
    },
    /**编辑图片 */
    openEditImg(image, parentIndex, index) {
      // 获取图片宽高
      let img = new Image()
      img.src = image
      if (!image || !img.width) {
        this.$message.error('请上传图片, 再编辑!')
        return
      }
      // openZhihuiEditor方法里new ZhihuiEditor会返回index第一次值
      this.editorData = {
        index: index,
        parentIndex: parentIndex
      }
      openZhihuiEditor(image, img, (res) => {
        const product = cloneDeep(this.$props.product)
        const { spaceImageValidCatch } = this.$data
        product.specs[this.editorData.parentIndex].imagesUrl[
          this.editorData.index
        ] = 'https:' + res.url
        this.$emit('input', product)
        this.$set(
          spaceImageValidCatch,
          `${this.editorData.parentIndex},${this.editorData.index}`,
          false
        )
      })
    },
    // 删除规格图片
    deleteSpecImg(imagesUrl, index, i) {
      imagesUrl.splice(i, 1, '')
    },
    /**变体校验 */
    onVariantValid(variant, field) {
      if (!field) field = ['price', 'stock', 'variationSku', 'promotionPrice']
      const product = this.$props.product
      const { minPriceLimit, maxPriceLimit } = this.storeLimit
      const validatePrice = (price) => {
        return price < minPriceLimit || price > maxPriceLimit
      }
      if (field.includes('price')) {
        if (
          !PRICE.test(variant.price) ||
          !getPriceNum(variant.price) ||
          validatePrice(variant.price)
        ) {
          variant._price_valid_ = true
        } else {
          variant._price_valid_ = false
        }
      }
      if (field.includes('stock')) {
        if (
          variant.stock === null ||
          variant.stock === '' ||
          variant.stock === undefined
        ) {
          variant._stock_valid_ = true
        } else {
          variant._stock_valid_ = false
        }
      }
      if (field.includes('variationSku')) {
        // if (!variant.variationSku || variant.variationSku.length > 20) {
        //   variant._variationSku_valid_ = true
        // } else {
        const skus = product.variants.map(({ variationSku }) => variationSku)
        const counts = countBy(skus)
        if (counts[variant.variationSku] > 1) {
          console.log('-----')
          // variant._variationSku_valid_ = true
        } else {
          // variant._variationSku_valid_ = false
        }
        // }
      }
      if (field.includes('promotionPrice')) {
        if (product.discountId) {
          if (!Number(variant.promotionPrice)) {
            variant._promotionPrice_valid_ = true
          } else {
            variant._promotionPrice_valid_ = false
          }
          if (
            !PRICE.test(variant.promotionPrice) ||
            !getPriceNum(variant.promotionPrice)
          ) {
            variant._promotionPrice_valid_ = true
          } else {
            variant._promotionPrice_valid_ = false
          }
        }
      }
      return variant
    },
    /**规格名校验 */
    onSpecsNameValid(spec) {
      spec._name_valid_ = null
      if (!spec.name) {
        spec._name_valid_ = this.$t('edit.spaceNameValid')
      }

      if (this.storeLimit) {
        let _spec = this.specName
        if (spec.name.length > _spec) {
          const vs = this.$t('edit.spaceNameValid2', { start: 1, end: _spec })
          spec._name_valid_ = vs
        }
      }

      return spec
    },
    /**折扣价改变事件 */
    onPromotionPriceChange() {
      const product = cloneDeep(this.$props.product)
      product.variants = product.variants.map((variant) => {
        let promotionPrice = getPriceNum(variant.promotionPrice)
        let price = getPriceNum(variant.price)
        if (promotionPrice >= price) promotionPrice = price
        let discount = getPriceNum((promotionPrice / price) * 10)
        variant.discount = discount
        return variant
      })
      this.renderVariants(product)
    },
    /**新增批发价 */
    onPushTradePrice() {
      const product = cloneDeep(this.$props.product)
      let nextMin = 1
      if (!product.wholesales) product.wholesales = []
      if (product.wholesales.length) {
        const next = maxBy(this.wholesales, (wholesale) => wholesale.maxCount)
        if (next) nextMin = next.maxCount
      }
      this.wholesales.push({
        minCount: nextMin + 1,
        maxCount: null,
        unitPrice: null,
        key: Date.now()
      })
      this.isValidate = false
      // this.renderWholesales(product)
    },
    /**删除批发价 */
    deleteWholesale(index) {
      // const product = cloneDeep(this.$props.product)
      this.wholesales.splice(index, 1)
      this.isValidate = false
      // this.renderWholesales(product)
    },
    /**规格校验,至少有一个规格,且必须有一个规格属性 */
    validSpecs() {
      const product = this.$props.product
      if (product.hasVariation) {
        if (product.specs.length) {
          if (product.specs[0].options.length) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      } else {
        return true
      }
    },
    /**规格校验名字符长度,混有中文时，规格名会超出input maxlength限制 */
    validSpecsLength() {
      const product = this.$props.product
      if (product.hasVariation) {
        if (product.specs.length) {
          // console.log(this.specOptionName)
          // return false
          if (product.specs[0].options.length) {
            const overLimit = product.specs[0].options.filter(
              (item) => item.length > this.specOptionName
            )
            console.log(overLimit)
            return overLimit.length ? false : true
          } else {
            return true
          }
        } else {
          return true
        }
      } else {
        return true
      }
    },
    /**校验名规格 */
    validSpecsNameAll() {
      const product = this.$props.product
      const specs = product.specs.map((spec) => this.onSpecsNameValid(spec))
      product.specs = specs
      this.$emit('input', product)
      return compact(specs.map(({ _name_valid_ }) => _name_valid_)).length === 0
    },
    /**校验值规格 */
    validSpecsValueAll() {
      const product = cloneDeep(this.$props.product)
      const specsErrs = product.specs.map((spec, index) => {
        let oerrs = range(spec.options.length).map((subIndex) => {
          return this.onSpaceOptionInput(spec, [index, subIndex])
        })
        return compact(oerrs)
      })
      return compact(specsErrs.map((err) => err.length)).length === 0
    },
    /**规格图片校验 */
    validSpecsImageAll() {
      const { spaceImageValidCatch } = this.$data
      const product = cloneDeep(this.$props.product)
      const imagesUrl = product.specs[0].imagesUrl
      const iarrs = []
      if (imagesUrl.every((it) => !it)) {
        return true
      }
      const validRes = imagesUrl.map((image, cindex) => {
        // this.$set(spaceImageValidCatch, `0,${cindex}`, false)
        // if (!image) {
        //   this.$set(spaceImageValidCatch, `0,${cindex}`, true)
        //   return false
        // }
        // if (iarrs.includes(image)) {
        //   this.$set(spaceImageValidCatch, `0,${cindex}`, true)
        //   return false
        // }
        // iarrs.push(image)
        return true
      })
      const [spec] = this.$props.product.specs

      if (compact(spec.imagesUrl).length === 0) {
        Object.keys(spaceImageValidCatch).forEach((index) => {
          this.$set(spaceImageValidCatch, index, false)
        })
        return true
      }

      if (compact(spec.imagesUrl).length !== spec.imagesUrl.length) {
        const index = spec.imagesUrl.indexOf('')
        this.$set(spaceImageValidCatch, `0,${index}`, true)
        return false
      } else {
        Object.keys(spaceImageValidCatch).forEach((index) => {
          this.$set(spaceImageValidCatch, index, false)
        })
      }

      return validRes.every(Boolean)
    },
    /**校验变体 */
    validVariantAll() {
      const product = cloneDeep(this.$props.product)
      product.variants = product.variants.map((variant) => {
        return this.onVariantValid(variant, null)
      })
      console.log('-----')
      const variantsErr = product.variants.map((variant) => {
        const {
          _price_valid_,
          _promotionPrice_valid_,
          _stock_valid_,
          _variationSku_valid_
        } = variant
        console.log(
          _price_valid_,
          _promotionPrice_valid_,
          _stock_valid_,
          _variationSku_valid_
        )
        return !(
          (_price_valid_ || _promotionPrice_valid_ || _stock_valid_)
          // || _variationSku_valid_
        )
      })
      console.log(variantsErr)
      setTimeout(() => {
        this.$emit('input', product)
      }, 1000)
      return variantsErr.every(Boolean)
    },
    /**校验变体价格最大差距 */
    valiVariantMaxDiff() {
      /**采集箱编辑不校验 */
      if (this.$route.query.edit == 0) return true
      const product = this.$props.product
      const prices = product.variants.map(({ price }) => price)
      const maxPrice = max(prices)
      const minPrice = min(prices)
      let diffmodel = diffSource[product.countryCode]
      if (!diffmodel) diffmodel = diffSource['DF']
      const num = this.getDiffmodel
      return maxPrice / minPrice <= num
    },
    /**批发价校验 */
    validWholesaleAll() {
      if (this.editType == 0) return true
      this.isValidate = true
      const wholesale = this.renderWholesales()
      const wseValid = wholesale.wholesales.map((wse) => {
        const { _min_valid_, _max_valid_, _unitPrice_valid_ } = wse
        return (
          _min_valid_.length || _max_valid_.length || _unitPrice_valid_.length
        )
      })
      return compact(wseValid).length === 0
    },
    // 校验变体价格
    validatorVarianPrice() {
      const maxLimit = this.shopItemLimit?.priceLimit?.max_limit
      const minLimit = this.shopItemLimit?.priceLimit?.min_limit
      if (!maxLimit) return true
      if (this.product.hasVariation) {
        let maxPice = Math.max(
          ...this.product.variants.map((item) => item.price)
        )
        let minPice = Math.min(
          ...this.product.variants.map((item) => item.price)
        )
        return maxPice < maxLimit && minPice > minLimit
      }
      const { price } = this.product
      return price > minLimit && price < maxLimit
    },
    // 校验变体库存
    validatorVarianStock() {
      if (this.product.hasVariation) {
        let num = 0
        this.product.variants.map((item) => {
          num = add(num, item.stock)
        })
        return num < 100000
      }
      return this.product.stock < 100000
    },
    // 检测规格图片大小,超出自动替换
    async validateImgSize() {
      const product = cloneDeep(this.product)
      let { specs, storeId, id } = product
      const promise = specs.map(async (item, index) => {
        const result = await this.getImgSize(item.imagesUrl?.filter(Boolean))
        const list = result.filter((it) => {
          if (it.width > 1024 || it.height > 1024) {
            return true
          }
        })
        if (list.length) {
          const { data } = await Goods.handleBatchPull({
            storeId,
            id,
            list: list.map((it) => it.url)
          })
          const imgUrlList = this.backfill(
            [...item.imagesUrl],
            list,
            data?.list,
            index
          )
          item.imagesUrl = imgUrlList
        }
        return item
      })
      const res = await Promise.all(promise)
      product.specs = res
      this.$emit('input', product)
    },
    backfill(source, list, data = []) {
      let indexArr = []
      list.forEach((item) => {
        source.forEach((it, ind) => {
          if (item.url === it) {
            indexArr.push(ind)
          }
        })
      })
      indexArr.forEach((item, index) => {
        if (data[index]) {
          source[item] = data[index]
        }
      })
      return source
    },
    async getImgSize(imgList = []) {
      const imgPromise = imgList.map((item) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.setAttribute('crossOrigin', 'Anonymous')
          img.src = item
          img.onload = (e) => {
            const width = img.width
            const height = img.height
            const url = item
            resolve({
              width,
              height,
              url,
              id: url
            })
          }
          img.onerror = () => {
            resolve({})
          }
        })
      })
      return Promise.all(imgPromise)
    },
    /**整体校验 */
    validate() {
      return new Promise((resolve, reject) => {
        this.isValidate = true
        this.$refs.productSpecForm
          .validate()
          .then(async () => {
            let errors = []

            let vSpecs = true
            let vSpecsLength = true
            let vName = true
            let vSpec = true
            let vVariant = true
            let vImages = true
            let vDiff = true
            let variantPrice = true
            let variantStock = true

            if (this.$props.product.hasVariation) {
              vSpecs = this.validSpecs()
              vSpecsLength = this.validSpecsLength()
              vName = this.validSpecsNameAll()
              vSpec = this.validSpecsValueAll()
              vVariant = this.validVariantAll()
              vImages = this.validSpecsImageAll()
              vDiff = this.valiVariantMaxDiff()
              // await this.validateImgSize() //校验规格图片大小,超出的自动拉伸替换
            }
            variantPrice = this.validatorVarianPrice()
            // cnsc才需要做校验库存数最大值为99999
            if (this.storeType == 'cnsc') {
              variantStock = this.validatorVarianStock()
            }
            let vWholesale = true
            if (this.$props.product.hasVariation && this.showTradePrice) {
              vWholesale = this.validWholesaleAll()
            }

            let vVariantLen = true
            if (this.$props.product.hasVariation) {
              vVariantLen = this.$props.product.variants.length <= 50
            }

            console.log(
              vSpecs,
              vName,
              vSpec,
              vVariant, //*
              vWholesale,
              vImages,
              vDiff,
              vVariantLen
            )

            if (!vSpecs) {
              this.$data.showMoreSpec = true
              errors.push(this.$t('edit.productSpecValidError2'))
            }

            if (!vSpecsLength) {
              this.$data.showMoreSpec = true
              errors.push('规格名长度超过限制')
            }

            if (!vName) {
              this.$data.showMoreSpec = true
              errors.push(this.$t('edit.productSpecValidError3'))
            }

            if (!vImages) {
              this.$data.showMoreSpec = true
              errors.push(this.$t('edit.validFormError'))
            }

            if (!vSpec) {
              this.$data.showMoreSpec = true
              errors.push(this.$t('edit.productSpecValidError4'))
            }

            if (!vVariant) {
              this.$data.spcesTableOpen = true
              errors.push(this.$t('edit.productSpecValidError5'))
              this.$nextTick(this.renderVariants)
            }

            if (!vDiff) {
              this.$data.spcesTableOpen = true
              const errorMsg = this.$t('edit.diffValidErrorMessage', {
                num: this.getDiffmodel
              })
              errors.push(errorMsg)
            }

            if (!vWholesale) {
              const errorMsg = this.$t('edit.productSpecValidError6')
              errors.push(errorMsg)

              this.$nextTick(this.renderWholesales)
            }

            if (!vVariantLen) {
              this.$data.spcesTableOpen = true
              const errorMsg = this.$t('edit.productSpecValidError7')
              errors.push(errorMsg)
            }
            if (!variantPrice) {
              const maxLimit = this.shopItemLimit?.priceLimit?.max_limit
              const minLimit = this.shopItemLimit?.priceLimit?.min_limit
              let str = this.product.hasVariation ? '变体价格' : '商品价格'
              errors.push(`${str}应该在${minLimit}与${maxLimit}之间`)
            }

            if (!variantStock) {
              let str = this.product.hasVariation ? '变体库存总数' : '商品库存'
              errors.push(`${str}应该在0与100000之间`)
            }

            if (errors.length) {
              reject(errors)
              return
            }

            resolve(true)
          })
          .catch((error) => {
            console.error(error)
            reject(this.$t('edit.productSpecValidError'))
          })
      })
    },
    addDiscoun() {
      this.openPage('/discount/list?open=yes', '_blank')
    },
    wholesalesRules,
    specsChange(e) {
      const product = cloneDeep(this.product)
      if (e.target.value) {
        this.product.specs = product.specs || []
      }
      this.$nextTick(this.$refs.productSpecForm.clearValidate)
    },
    // 批发价最大数量变化，给下一条批发价min赋值
    wholesaleMaxChange(val, record, index) {
      const { wholesales } = this.product
      if (val && wholesales[index + 1]) {
        wholesales[index + 1].minCount = val + 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.specs-image-bg {
  display: inline-block;
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;

  &.error {
    border: 1px solid #f5222d;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0) !important;
  }
}
.me-edit-space-context {
  border: 1px solid #e8eaec;
  background-color: #fafafa;
  .me-edit-space-card {
    // display: grid;
    // grid-template-columns: repeat(2, 50%);
    // grid-row-gap: 20px;
    // grid-column-gap: 20px;
    display: flex;
    & > div {
      flex: 1;
      padding: 10px;
    }

    .me-edit-space-item {
      &:last-child {
        margin-right: 0;
      }

      .me-edit-space-input-item {
        position: relative;

        &.name-input {
          width: calc(100% - 70px);
        }

        &.option-input {
          width: calc(100% - 130px);
          position: relative;
        }

        &.option-handler {
          width: 70px;
        }
      }
    }
    .add-button {
      & > div {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 286px;
        border: 1px dashed $linkColor;
        color: $linkColor;
        cursor: pointer;
        margin-top: 10px;
        &:hover {
          color: $primaryColor;
          border-color: $primaryColor;
        }
        &[disabled] {
          color: #d9d9d9;
          border-color: #d9d9d9;
          background-color: #f5f5f5;
          cursor: not-allowed;
          pointer-events: none;
        }
      }
      &[disabled] {
        cursor: not-allowed;
      }
    }
  }
  .action-box {
    padding-right: 70px;
    .item-tips {
      text-align: center;
      color: #ff4a4a;
    }
  }
  .add-button-option {
    border: 1px dashed $primaryColor;
    text-align: center;
    color: $primaryColor;
    cursor: pointer;
    height: 32px;
    line-height: 32px;
  }
}

.space-image-action-liat-item {
  text-align: left;
  height: 48px;
  line-height: 48px;
  padding: 0 15px;
  display: block;
  border-bottom: 1px solid #eeeeee;
  color: rgba(0, 0, 0, 0.87);
  cursor: pointer;

  &:last-child {
    border: none;
  }

  &:hover {
    background-color: #f9f9f9;
  }
}

.trade-price-help {
  &::before {
    content: '*';
    color: red;
    margin-right: 5px;
  }
}
.wholesales-error-message-content {
  border: 1px solid #ff5252;
  border-radius: 5px;
  padding: 0px 10px;
  color: #ff5252;
}

.me-show-more {
  color: #f7622f;

  & > span {
    cursor: pointer;

    .me-rotate-90 {
      cursor: pointer;
      transform: rotate(-90deg);

      &.active {
        transform: rotate(90deg);
      }
    }
  }
}
::v-deep .ant-btn-dashed:not([disabled]) {
  border-color: $linkColor;
  color: $linkColor;
  &:hover {
    border-color: $primaryColor;
    color: $primaryColor;
  }
}
</style>

<style lang="scss">
.custom-variants-table {
  .ant-table {
    .ant-table-body {
      .ant-table-row {
        & > td {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
      }
    }
  }
}
</style>
