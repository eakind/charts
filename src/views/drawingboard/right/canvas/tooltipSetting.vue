<template>
  <dc-collapse-item title="Tooltips">
    <div class="tooltip-setting">
      <div class="tooltip-header">
        <span>{{$t('dashboard.display_string')}}</span>
        <span class="edit-btn"
              @click="isEdit=!isEdit">{{$t('dashboard.edit')}}</span>
      </div>
      <div class="feature-list">
        <div class="list-item"
             v-for="(item, index) in tooltipList"
             :key="index"
             @click="toggleCheck(item, index)">
          <dc-checked class="check"
                      :active="item.display === 'auto'"></dc-checked>
          <div class="item-txt"
               :title="item.title">{{item.title}}</div>
        </div>
      </div>
    </div>
    <edit-tooltip v-if="isEdit"
                  @close="closeHandler"
                  :tooltip-data="tooltipList"
                  @change="changeTooltip"></edit-tooltip>
  </dc-collapse-item>
</template>
<script>
import DcChecked from '@/components/dcchecked/dcChecked.vue';
import EditTooltip from './tooltipSetting/editTooltip.vue';
export default {
  data () {
    return {
      isEdit: false,
      tooltipList: []
    };
  },
  props: {
    tooltipData: {
      type: Object
    }
  },
  watch: {
    tooltipData: {
      handler (obj) {
        if (obj) {
          this.tooltipList = JSON.parse(JSON.stringify(obj));
        }
      },
      immediate: true
    }
  },
  components: {
    DcChecked,
    EditTooltip
  },
  mounted () {
  },
  methods: {
    closeHandler () {
      this.isEdit = false;
    },
    toggleCheck (item, index) {
      if (item.display === 'auto') {
        item.display = 'none';
      } else {
        item.display = 'auto';
      }
      this.$emit('change', this.tooltipList);
    },
    changeTooltip (list) {
      this.isEdit = false;
      this.tooltipList = list;
      this.$emit('change', this.tooltipList);
    }
  }
};
</script>
<style lang='scss' scoped>
.tooltip-setting {
  display: block;
  padding-bottom: 10px;
  .tooltip-header {
    font-size: 14px;
    padding: 5px 0px;
    color: #4284f5;
    position: relative;
  }
  .edit-btn {
    cursor: pointer;
    right: 0px;
    /* text-decoration: underline; */
    position: absolute;
    color: white;
    background-color: #4284f5;
    border: none;
    border-radius: 4px;
    padding: 0px 15px;
    font-size: 12px;
  }
  .feature-list {
    max-height: 300px;
  }
  .list-item {
    display: flex;
    align-items: center;
    // justify-content: space-between;
    height: 35px;
    line-height: 35px;
    cursor: pointer;
    border-bottom: 1px solid #e1e1e1;
  }
  .check {
    width: 24px;
    height: 24px;
    // top: 4px;
    // position: relative;
  }
  .item-txt {
    flex: 1;
    font-size: 14px;
    margin-left: 8px;
    // position: relative;
    @include ellipsis;
  }
}
</style>
