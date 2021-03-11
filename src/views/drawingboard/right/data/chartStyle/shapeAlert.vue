<template>
  <div class="shape-alert-box">
    <dc-alert class="shape-alert">
      <div class="title">
        形状图案
        <span class="iconfont icon-db_plus" @click="cancelHandler"></span>
      </div>
      <div class="dc-alert-body">
        <div class="body-half">
          <shape-feature
            v-for="(item, index) in patternList"
            :key="index"
            :select="selectIndex"
            :item="item"
            :index="index"
            @click.native="selectFeatureIndex(item, index)"
          ></shape-feature>
        </div>
        <div class="body-half">
          <shape-item
            v-for="(item, index) in iconList"
            :key="index"
            :item="item"
            :select="selectIcon"
            :index="index"
            @click.native="selectIconIndex(item, index)"
          ></shape-item>
        </div>
      </div>
      <div class="dc-alert-footer">
        <span class="btn" @click="confirmHandler">确定</span>
        <span class="btn" @click="cancelHandler">取消</span>
      </div>
    </dc-alert>
  </div>
</template>
<script>
import DcAlert from '@/components/dcalert/dcAlert.vue';
import ShapeItem from './shapeItem.vue';
import ShapeFeature from './shapeFeature.vue';
export default {
  data () {
    return {
      selectIndex: 0,
      selectIcon: 0,
      patternList: [],
    };
  },
  props: {
    iconList: {
      type: Array,
    },
    shapeList: {
      type: Array,
    },
  },
  components: {
    DcAlert,
    ShapeItem,
    ShapeFeature,
  },
  mounted () {
    this.patternList = [];
    for (let i = 0; i < this.shapeList.length; i++) {
      let obj = this.shapeList[i].patternList;
      for (let key in obj) {
        if (!obj[key]) break;
        this.patternList.push({
          index: i,
          aggr: this.shapeList[i].aggr,
          key_id: this.shapeList[i].key_id,
          parentName: this.shapeList[i].name,
          name: key,
          value: obj[key],
        });
      }
    }
    this.selectFeatureIndex(this.patternList[0], 0);
  },
  methods: {
    selectIconIndex (item, index) {
      this.selectIcon = index;
      this.$set(this.patternList[this.selectIndex], 'value', item.value);
    },
    selectFeatureIndex (item, index) {
      this.selectIndex = index;
      for (let i = 0; i < this.iconList.length; i++) {
        if (this.iconList[i].value === item.value) {
          this.selectIcon = i;
        }
      }
    },
    confirmHandler () {
      let list = JSON.parse(JSON.stringify(this.shapeList));
      for (let i = 0; i < this.patternList.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (
            j === this.patternList[i].index &&
            list[j].key_id === this.patternList[i].key_id &&
            list[j].aggr === this.patternList[i].aggr &&
            list[j].name === this.patternList[i].parentName
          ) {
            list[j].patternList[this.patternList[i].name] = this.patternList[
              i
            ].value;
          }
        }
      }
      this.$emit('confirm', list);
    },
    cancelHandler () {
      this.$emit('cancel');
    },
  },
};
</script>
<style lang='scss' scoped>
.shape-alert-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .6);
  z-index: 5;
}
.shape-alert {
  width: 560px;
  height: 630px;
  box-sizing: border-box;
  .title {
    font-size: 14px;
    font-weight: bold;
    padding: 16px 16px 8px;
    box-sizing: border-box;
    color: #424242;
    position: relative;
  }
  .icon-db_plus {
    right: 15px;
    transform: rotate(45deg);
    display: inline-block;
    position: absolute;
    color: #a4a4a4;
  }
  .dc-alert-body {
    height: 520px;
    display: flex;
    padding: 8px 16px;
    box-sizing: border-box;
  }
  .body-half {
    height: 510px;
    overflow-y: auto;
    flex: 1;
    border-radius: 4px;
    padding: 0px 8px;
    box-sizing: border-box;
    background-color: #e7ebf2;
    &:nth-child(1) {
      margin-right: 8px;
    }
    &:nth-child(2) {
      margin-left: 8px;
    }
  }
  .btn {
    margin: 8px 60px;
    font-size: 16px;
    cursor: pointer;
    display: inline-block;
    &:nth-child(1) {
      color: #4284f5;
    }
    &:nth-child(2) {
      color: #a4a4a4;
    }
  }
}
</style>
