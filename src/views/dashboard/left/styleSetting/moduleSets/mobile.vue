<template>
  <div class="mobile">
    <div class="flex">
      <div class="title size">大小</div>
      <dc-select
        class="no-border"
        :list="list"
        v-model="currentValue"
        @change="changeHandler"
      ></dc-select>
    </div>
    <div class="set-width">
      <span>宽</span>
      <input v-model.number="currentObj.width" type="number"/>
      <span>高度不限制</span>
    </div>
  </div>
</template>
<script>
import dcSelect from '@/components/newSelect/index.vue';
export default {
  data () {
    return {
      list: [{
        label: 'iPhone 375 x 812',
        value: 'iPhone'
      }, {
        label: 'iPad 768 X 1024',
        value: 'iPad'
      }, {
        label: 'iPad Pro 1024 x 1366',
        value: 'iPadPro'
      }, {
        label: 'Android 360 x 720',
        value: 'android1'
      }, {
        label: 'Android 411 x 731',
        value: 'android2'
      }],
      deviceObj: {
        iPhone: {
          width: 375,
          height: 812
        },
        iPad: {
          width: 768,
          height: 1024
        },
        iPadPro: {
          width: 1024,
          height: 1366
        },
        android1: {
          width: 360,
          height: 720
        },
        android2: {
          width: 411,
          height: 731
        }
      },
      currentValue: 'iPhone',
      currentObj: {
        width: 375,
        height: 812
      }
    };
  },
  props: {
    sizeObj: {
      type: Object
    }
  },
  watch: {
    currentObj: {
      handler (object) {
        this.$emit('changeSize', object);
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    dcSelect
  },
  mounted () {
    if (this.sizeObj) {
      this.currentObj = JSON.parse(JSON.stringify(this.sizeObj));
    }
  },
  methods: {
    changeHandler (value) {
      this.currentValue = value;
      console.log(value);
      this.currentObj = this.deviceObj[value];
    }
  }
};
</script>
<style lang='scss' scoped>
@import './style/index.scss';
.mobile {
  font-size: 12px;
  margin-bottom: 0.8em;
  .flex {
    display: flex;
    align-items: center;
  }
  .title.size {
    width: 2em;
  }
  .title {
    font-weight: bold;
    color: hsl(0, 0%, 40%);
    margin-right: 0.8em;
    width: 2em;
  }
  .set-width {
    display: flex;
    align-items: center;
    margin: 8px 0px 0px 2em;
    > input {
      height: 28px;
      padding: 0px;
      margin: 0px 8px;
      width: 56px;
      outline: none;
      background-color: white;
      border: 1px solid #e1e1e1;
      border-radius: 4px;
    }
  }
}
</style>
