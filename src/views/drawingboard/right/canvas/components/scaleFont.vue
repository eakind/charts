<template>
  <div class="scale-font-box">
    <dc-alert class="scale-font" zIndex="2999">
      <div class="dc-alert-header">
        <span class="title">刻度文字</span>
        <span class="iconfont icon-db_plus" @click="closeHandler"></span>
      </div>
      <div class="dc-alert-body">
        <div class="body-header">
          <span class="tip">分别设置坐标轴上刻度的颜色、大小和方向。</span>
          <span class="reset" @click="resetHandler">恢复默认</span>
        </div>
        <div class="font-row">
          <div class="property">所属特征</div>
          <div class="color">颜色</div>
          <div class="size">大小</div>
          <div class="direct">方向</div>
        </div>
        <template v-for="(i, index) in curScaleList">
          <div class="font-body" :key="index">
            <span class="axis-type">{{ titleKeyVal[i.axisType] }}</span>
            <font-item
              :item="i"
              @change="changeAxis(i.axisType, $event)"
            ></font-item>
          </div>
        </template>
        <!-- <div class="font-body">
          <span class="axis-type">X轴</span>
          <font-item
            v-for="(item, index) in xList"
            :key="index"
            :item="item"
            :index="index"
            @change="changeXAxis"
          ></font-item>
        </div>
        <div class="font-body">
          <span class="axis-type">Y轴</span>
          <font-item
            v-for="(item, index) in yList"
            :key="index"
            :item="item"
            :index="index"
            @change="changeYAxis"
          ></font-item>
        </div> -->
      </div>
      <div class="dc-alert-footer">
        <span class="confirm-btn" @click="confirmHandler">确定</span>
        <span class="cancel-btn" @click="closeHandler">取消</span>
      </div>
    </dc-alert>
  </div>
</template>
<script>
import DcAlert from '@/components/dcalert/dcAlert.vue';
import FontItem from './scaleFont/fontItem.vue';
export default {
  data () {
    return {
      scales: [],
      xList: [],
      yList: [],
      curScaleList: [],
      titleKeyVal: {
        x: 'X轴',
        y: 'Y轴',
      },
    };
  },
  props: {
    scaleList: {
      type: Array,
    },
  },
  watch: {
    scaleList: {
      handler (list) {
        if (!list.length) return;
        this.curScaleList = JSON.parse(JSON.stringify(list));
        // this.initXYList(list);
      },
      immediate: true,
    },
  },
  components: {
    DcAlert,
    FontItem,
  },
  mounted () {},
  methods: {
    changeAxis (type, val) {
      let scaleListTemp = this.curScaleList.map((i) => {
        if (i.axisType === type) {
          i.style = val;
        }
        return i;
      });
      this.curScaleList = scaleListTemp;
    },
    // initXYList(list) {
    //   this.xList = [];
    //   this.yList = [];
    //   for (let i = 0; i < list.length; i++) {
    //     if (list[i].axis === this.$t('message.x_axis')) {
    //       this.xList.push(list[i]);
    //     } else {
    //       this.yList.push(list[i]);
    //     }
    //   }
    // },
    resetHandler () {
      this.curScaleList = JSON.parse(JSON.stringify(this.scaleList));
      // for (let i = 0; i < this.scales.length; i++) {
      //   this.scales[i].fontSize = 12;
      //   this.scales[i].color = '#424242';
      //   this.scales[i].rotate = 'rotate0';
      // }
      // this.initXYList(this.scales);
    },
    // changeXAxis(item, index) {
    //   this.xList.splice(index, 1, item);
    // },
    // changeYAxis(item, index) {
    //   this.yList.splice(index, 1, item);
    // },
    closeHandler () {
      this.$emit('close');
    },
    confirmHandler () {
      // for (let i = 0; i < this.xList.length; i++) {
      //   this.setList(this.xList[i]);
      // }
      // for (let i = 0; i < this.yList.length; i++) {
      //   this.setList(this.yList[i]);
      // }
      this.$emit('change', this.curScaleList);
    },
    setList (item) {
      // for (let i = 0; i < this.scales.length; i++) {
      //   if (item.feature === this.scales[i].feature) {
      //     this.scales.splice(i, 1, item);
      //   }
      // }
    },
  },
};
</script>
<style lang="scss" scoped>
.scale-font-box {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 5;
}
.scale-font {
  width: 560px;
  height: 608px;
  padding: 8px;
  box-sizing: border-box;
  background: #fff;
  .dc-alert-header {
    text-align: left;
    padding: 0px 8px;
    position: relative;
  }
  .title {
    color: #424242;
    font-size: 14px;
    font-weight: 600;
  }
  .icon-db_plus {
    right: 10px;
    color: #a4a4a4;
    cursor: pointer;
    transform: rotate(45deg);
    display: inline-block;
    position: absolute;
  }
  .body-header {
    padding: 0px;
    font-size: 14px;
  }
  .font-row {
    display: flex;
    height: 30px;
    font-size: 14px;
    align-items: center;
    color: #424242;
    .property {
      flex: 1;
    }
    .color {
      padding-left: 6px;
      box-sizing: border-box;
      width: 80px;
    }
    .size {
      width: 120px;
    }
    .direct {
      width: 120px;
    }
  }
  .axis-type {
    font-size: 16px;
    color: #a4a4a4;
  }
  .font-body {
    padding: 0px 8px;
    height: 220px;
    overflow-y: auto;
    border-radius: 4px;
    margin-bottom: 8px;
    background-color: #e7ebf2;
  }
  .body-header {
    position: relative;
  }
  .tip {
    color: #a4a4a4;
  }
  .reset {
    color: #4284f5;
    cursor: pointer;
    text-decoration: underline;
    position: absolute;
    right: 0px;
  }
  .confirm-btn {
    color: #4284f5;
    padding: 5px 50px;
    font-size: 16px;
    cursor: pointer;
    display: inline-block;
  }
  .cancel-btn {
    color: #a4a4a4;
    padding: 5px 50px;
    font-size: 16px;
    cursor: pointer;
    display: inline-block;
  }
  .dc-alert-footer {
    padding-top: 0px;
  }
}
</style>
