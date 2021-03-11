<template>
  <div class="data-setting">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div :class="item.selected ? 'check check-selected' : 'check'" @click="changeSelect(index)"></div>
      <div class="main">
        <div class="title">{{item.title}}</div>
        <div class="content" v-if="isArray(item.content)">
          <div class="elt" v-for="(elt, idx) in item.content" :key="idx">
            <dc-input :val="elt.val" :disabled="elt.disabled" @change="changeVal" :inputType="idx"></dc-input><span class="unit">{{elt.unit}}</span>
          </div>
        </div>
        <div class="content" v-else>{{item.content}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import DcInput from '@/components/dcinput/dcInput';
export default {
  name: 'data-setting',
  components: {
    DcInput
  },
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data () {
    return {

    };
  },
  methods: {
    isArray (arr) {
      return Object.prototype.toString.call(arr) === '[object Array]';
    },
    changeSelect (val) {
      this.$emit('select', val);
    },
    changeVal (val, idx) {
      this.$emit('change', Number(val), idx);
    }
  }
};
</script>

<style lang="scss" scoped>
  .data-setting {
    font-size: 14px;
    text-align: left;
    .item {
      display: flex;
      margin-bottom: 10px;
      .check {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 1px solid #A4A4A4;
        margin-right: 10px;
        box-sizing: border-box;
        cursor: pointer;
        margin-top: 3px;
      }
      .check-selected {
        border: 3px solid #4284F5;
      }
      .main {
        width: calc(100% - 24px);
        .title {

        }
        .content {
          font-size: 12px;
          color: #666666;
          .elt {
            margin-top: 5px;
            .unit {
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
</style>
