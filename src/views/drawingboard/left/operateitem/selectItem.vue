<template>
  <div class="select-item" :class="selectIndex===index ? 'select-active':''">
    <div class="item-left">{{item}}</div>
    <div class="item-right" v-if="item === this.$t('dashboard.transform')">
      <item-drop :list="list" :select="selectType" @change="changeOperate"></item-drop>
    </div>
  </div>
</template>
<script>
import ItemDrop from './itemDrop';
export default {
  name: 'SelectItem',
  components: {
    ItemDrop
  },
  data () {
    return {
      list: []
    };
  },
  props: {
    item: {
      type: Object
    },
    selectIndex: {
      type: Number
    },
    index: {
      type: Number
    },
    dataType: {
      type: String
    },
    selectType: {
      type: String
    }
  },
  mounted () {
    this.initList();
  },
  methods: {
    changeOperate (item) {
      this.$emit('changeOperate', item.code);
    },
    initList () {
      switch (this.dataType) {
        case 'STRING':
          this.list = [
            {
              name: this.$t('dashboard.float'),
              code: 'FLOAT'
            },
            {
              name: this.$t('dashboard.time_variable'),
              code: 'TIME'
            },
            {
              name: this.$t('dashboard.spatial_variable'),
              code: 'GEO'
            }
          ];
          break;
        case 'BIN':
          this.list = [];
          break;
        case 'INT':
          this.list = [
            {
              name: this.$t('dashboard.string'),
              code: 'STRING'
            },
            {
              name: this.$t('dashboard.section'),
              code: 'SECTION'
            },
            {
              name: this.$t('dashboard.spatial_variable'),
              code: 'GEO'
            }
          ];
          break;
        case 'FLOAT':
          this.list = [
            {
              name: this.$t('dashboard.int'),
              code: 'INT'
            },
            {
              name: this.$t('dashboard.string'),
              code: 'STRING'
            },
            {
              name: this.$t('dashboard.section'),
              code: 'SECTION'
            }
          ];
          break;
        case 'PROVINCE':
        case 'CITY':
        case 'DISTRICT':
        case 'ZIPCODE':
        case 'AREACODE':
        case 'MAP':
          this.list = [
            {
              name: this.$t('dashboard.string'),
              code: 'STRING'
            }
          ];
          break;
      }
      if (this.list.length) {
        this.$emit('changeOperate', this.list[0].code);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.select-item {
  color: #a4a4a4;
  padding: 20px 35px;
  margin: 5px 0px;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  background-color: #e8e8e8;
  display: flex;
  &::before {
    content: "";
    position: absolute;
    left: 10px;
    top: 50%;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #a4a4a4;
    transform: translateY(-50%);
    background: white;
  }
  .item-left {
    width: 80px;
  }
  .item-right {
    flex: 1;
    .item-drop {
      top: 16px;
      position: absolute;
    }
  }
}
.select-active {
  background: #4284f5;
  color: white;
  box-shadow: 0 0 4px 0 rgba(66, 132, 245, 0.5);
  position: relative;
  &::after {
    content: "";
    position: absolute;
    left: 14px;
    top: 50%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid #424242;
    transform: translateY(-50%);
    background: #424242;
  }
  .item-drop {
    background-color: white;
  }
}
</style>
