import { getWorkCategory, getListByWork } from '@/api/newApi/processFields/processConfig';
export default {
  name: 'classifyMenu',
  model: {
    prop: 'value',
    event: 'change',
  },
  data() {
    return {
      initData: [],
      workCategoryObj: [],
    };
  },
  props: {},
  methods: {
    handleClick(vm) {
      let { categoryId } = vm;
      let fatherNode = this.workCategoryObj.find((item) => item.id == categoryId);
      vm.fatherNode = fatherNode ? fatherNode : { name: '' };
      vm.code = Number(vm.code);
      console.log('??', vm);
      this.$emit('change', vm);
    },

    handleClose(res) {
      console.log(res);
    },

    isCollapse(res) {
      console.log(res);
    },

    async init() {
      try {
        let initArr = [],
          self = this;
        let { data: workCategoryData } = await getWorkCategory();
        this.workCategoryObj = workCategoryData;
        let { data: listByWorkData } = await getListByWork();
        if (Array.isArray(workCategoryData) && workCategoryData.length > 0) {
          initArr = workCategoryData.map((item) => ({ label: item.name, id: item.id, children: getChlidren(item.id) }));
          this.initData = initArr;
        }
        function getChlidren(fid) {
          let listBayKeyArr = Object.keys(listByWorkData);
          if (Array.isArray(listBayKeyArr) && listBayKeyArr.length > 0) {
            self.handleClick(listByWorkData[listBayKeyArr[0]][0]);
            let id = listBayKeyArr.find((item) => item == fid);
            return id ? listByWorkData[id].map((item) => ({ label: item.name, childId: item.id, ...item })) : [];
          } else {
            return [];
          }
        }

        return this.initData;
      } catch (error) {
        this.initData = [];
      }
    },
  },
  created() {
    this.init();
  },
  render(h) {
    let renderChildren = this.initData.map((item, index) => {
      if (item.children.length == 0) {
        return <el-menu-item index={String(index + 1)}>{item.label}</el-menu-item>;
      } else {
        return (
          <el-submenu index={String(index + 1)}>
            <template slot="title">{item.label}</template>
            {item.children.map((cilItem, cilIndex) => {
              return (
                <el-menu-item onClick={() => this.handleClick(cilItem)} index={String(Number(index + 1) + '-' + Number(cilIndex + 1))}>
                  {cilItem.label} ({cilItem.nums})
                </el-menu-item>
              );
            })}
          </el-submenu>
        );
      }
    });

    return (
      <el-menu default-active="1-1" default-openeds={['1']}>
        {renderChildren}
      </el-menu>
    );
  },
};
