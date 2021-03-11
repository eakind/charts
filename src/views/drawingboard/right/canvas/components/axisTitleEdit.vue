<template>
  <div class="axis-title-box">
    <dc-alert class="axis-title-edit">
      <div class="dc-alert-header">
        <span class="title">坐标轴标题</span>
        <span class="iconfont icon-db_plus" @click="cancelHandler"></span>
      </div>
      <div class="dc-alert-body">
        <div class="reset">
          <span class="reset-tip"
            >标题编辑仅用于显示，不对数据名称进行修改</span
          >
          <span class="reset-btn" @click="resetHandler">恢复默认</span>
        </div>
        <div class="edit-body">
          <template v-for="(i, index) in titleList">
            <div :class="i.axisType+'-axis'" :key="index">
              <span class="axis-title">{{titleKeyValue[i.axisType]}}</span>
              <title-edit :list="i" @change="changeTitleStyle"></title-edit>
            </div>
          </template>

          <!-- <div class="x-axis">
            <span class="axis-title">X轴</span>
            <title-edit :list="xList" @change="changeXAxis"></title-edit>
          </div>
          <div class="y-axis">
            <span class="axis-title">Y轴</span>
            <title-edit :list="yList" @change="changeYAxis"></title-edit>
          </div> -->
        </div>
      </div>
      <div class="dc-alert-footer">
        <span class="confirm-btn" @click="confirmHandler">确定</span>
        <span class="cancel-btn" @click="cancelHandler">取消</span>
      </div>
    </dc-alert>
  </div>
</template>
<script>
import DcAlert from '@/components/dcalert/dcAlert.vue';
import TitleEdit from './axisTitleEdit/titleEdit.vue';
export default {
  data () {
    return {
      // xList: [],
      // yList: [],
      // fonts: [],
      titleKeyValue: {
        x: 'X轴',
        y: 'Y轴',
      },
      titleList: [],
    };
  },
  props: {
    fontList: {
      type: Array,
    },

  },
  watch: {
    fontList: {
      handler (list) {
        if (!list || !list.length) return;
        // this.fonts = JSON.parse(JSON.stringify(list));
        this.titleList = JSON.parse(JSON.stringify(list));
        // this.initXYList(list);
      },
      immediate: true,
      deep: true,
    },
  },
  components: {
    DcAlert,
    TitleEdit,
  },
  mounted () {},
  methods: {
    changeTitleStyle (title, index) {
      this.$set(this.titleList, index, title);
    },
    resetHandler () {
      this.titleList = JSON.parse(JSON.stringify(this.fontList));
      // for (let i = 0; i < this.fonts.length; i++) {
      //   this.$set(this.fonts[i], 'show', true);
      //   this.$set(this.fonts[i], 'title', this.fonts[i].feature);
      // }
      // this.initXYList(this.fonts);
    },
    initXYList (list) {
      // this.xList = [];
      // this.yList = [];
      // for (let i = 0; i < list.length; i++) {
      //   if (list[i].axis === this.$t('message.x_axis')) {
      //     this.xList.push(list[i]);
      //   } else {
      //     this.yList.push(list[i]);
      //   }
      // }
    },
    cancelHandler () {
      this.$emit('close');
    },
    // changeXAxis (obj, index) {
    //   this.xList.splice(index, 1, obj);
    // },
    // changeYAxis (obj, index) {
    //   this.yList.splice(index, 1, obj);
    // },
    confirmHandler () {
      // for (let i = 0; i < this.xList.length; i++) {
      //   this.setFonts(this.xList[i]);
      // }
      // for (let i = 0; i < this.yList.length; i++) {
      //   this.setFonts(this.yList[i]);
      // }
      this.$emit('change', this.titleList);
    },
    // setFonts (item) {
    //   for (let i = 0; i < this.fonts.length; i++) {
    //     if (item.feature === this.fonts[i].feature) {
    //       this.fonts.splice(i, 1, item);
    //     }
    //   }
    // },
  },
};
</script>
<style lang="scss" scoped>
.axis-title-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 5;
}
.axis-title-edit {
  width: 560px;
  height: 608px;
  padding: 8px;
  box-sizing: border-box;
  background: #fff;
  .dc-alert-header {
    padding: 0px 8px;
    text-align: left;
    position: relative;
  }
  .title {
    color: #424242;
    font-size: 14px;
    font-weight: 600;
  }
  .icon-db_plus {
    transform: rotate(45deg);
    display: inline-block;
    right: 15px;
    cursor: pointer;
    color: #a4a4a4;
    position: absolute;
  }
  .reset {
    padding: 0px 0px 8px 0px;
    display: flex;
    position: relative;
  }
  .reset-tip {
    font-size: 14px;
    flex: 1;
    color: #a4a4a4;
  }
  .reset-btn {
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
    color: #4284f5;
  }
  .x-axis {
    padding: 5px;
    height: 235px;
    border-radius: 4px 4px 0px 0px;
    box-sizing: border-box;
    background-color: #e7ebf2;
  }
  .y-axis {
    padding: 5px;
    margin-top: 2px;
    height: 235px;
    border-radius: 0px 0px 4px 4px;
    box-sizing: border-box;
    background-color: #e7ebf2;
  }
  .confirm-btn {
    font-size: 16px;
    color: #4284f5;
    margin: 0px 40px;
    cursor: pointer;
  }
  .cancel-btn {
    font-size: 16px;
    color: #a4a4a4;
    margin: 0px 40px;
    cursor: pointer;
  }
  .axis-title {
    font-size: 14px;
    color: #a4a4a4;
  }
}
</style>
