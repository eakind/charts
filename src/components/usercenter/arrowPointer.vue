<template>
  <div class="arrow-pointer" :style="outter">
    <span class="iconfont icon-db_arrowTo" :style="inner"></span>
  </div>
</template>

<script>
export default {
  props: {
    styles: {
      type: Number,
    },
  },
  data () {
    return {
      inner: {
        color: '#a4a4a4',
      },
      outter: {
        background: 'rgb(242, 242, 242)',
        cursor: 'auto',
      },
    };
  },
  watch: {
    styles (val) {
      if (val === 0) {
        this.outter = {
          background: 'rgb(242, 242, 242)',
          cursor: 'auto',
        };
        this.inner = {
          color: '#a4a4a4',
        };
      } else if (val === 1) {
        this.outter = {
          background: '#fff',
          cursor: 'pointer',
        };
        this.inner = {
          color: '#4284F5',
        };
      }
    },
  },
};
</script>

<style scoped lang='scss'>
.arrow-pointer {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;

  .iconfont {
    width: 16px;
    height: 16px;
  }
}
</style>
