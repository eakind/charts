<template>
  <div class="tooltip-align">
    <span class="iconfont icon-db_textLeft" :class="isActiveLeft" @click="selectActive('left')"></span>
    <span class="iconfont icon-db_textCenter" :class="isActiveCenter" @click="selectActive('center')"></span>
    <span class="iconfont icon-db_textRight" :class="isActiveRight" @click="selectActive('right')"></span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isActive: 'left'
    };
  },
  props: {
    active: {
      type: String
    }
  },
  watch: {
    active: {
      handler (str) {
        this.isActive = str;
      },
      immediate: true
    }
  },
  computed: {
    isActiveLeft () {
      const obj = {
        left: 'is-active'
      };
      return obj[this.isActive];
    },
    isActiveCenter () {
      const obj = {
        center: 'is-active'
      };
      return obj[this.isActive];
    },
    isActiveRight () {
      const obj = {
        right: 'is-active'
      };
      return obj[this.isActive];
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    selectActive (name) {
      this.isActive = name;
      this.$emit('change', this.isActive);
    }
  }
};
</script>
<style lang='scss' scoped>
.tooltip-align{
  text-align: center;
  display: flex;
  border-radius: 4px;
  width: 100px;
  height: 28px;
  border: 1px solid #dedede;
  background-color: white;
  align-items: center;
  .iconfont {
    flex: 1;
    cursor: pointer;
  }
  .is-active{
    color: #4284f5;
  }
}
</style>
