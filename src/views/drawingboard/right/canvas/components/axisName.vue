<template>
  <div class="axis-name">
    <span class="axis-title">{{axis}}</span>
    <div class="name-input">
      <span v-show="!isEdit">{{name}}</span>
      <input v-show="isEdit" v-model="editValue" @blur="blurHandler" />
    </div>
    <span class="iconfont icon-db_edit" @click="isEdit=!isEdit"></span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isEdit: false,
      editValue: this.name
    };
  },
  props: {
    axis: {
      type: String,
      default () {
        return 'X';
      }
    },
    index: {
      type: Number
    },
    name: {
      type: String,
      default () {
        return 'feature name';
      }
    }
  },
  watch: {
    editValue (value) {
      this.$emit('change', value, this.index);
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    blurHandler () {
      this.isEdit = false;
    }
  }
};
</script>
<style lang='scss' scoped>
.axis-name {
  height: 30px;
  line-height: 30px;
  display: flex;
  .axis-title {
    width: 15px;
  }
  .name-input {
    flex: 1;
    width: 0;
    > input {
      border: 1px solid #e1e1e1;
      border-radius: 3px;
      height: 22px;
      width: 90%;
      outline: none;
    }
  }
  .icon-db_edit{
    width: 30px;
    color: #4284f5;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
