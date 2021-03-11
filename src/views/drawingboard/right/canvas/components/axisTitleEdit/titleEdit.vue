<template>
  <div class="title-edit">
    <div class="edit-row">
     <div class="row-left"></div>
     <div class="row-other mid">原名</div>
     <div class="row-other">显示别名</div>
    </div>
    <div class="edit-body">
      <edit-row :item="item" v-for="(item, index) in titleList" :key="index" :index="index"
                @change="changeHandler"></edit-row>
    </div>
  </div>
</template>
<script>
import EditRow from './editRow.vue';
export default {
  data () {
    return {
      titleList: {}
    };
  },
  props: {
    list: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  watch: {
    list: {
      handler (obj) {
        if (!obj) return;
        let newData = JSON.parse(JSON.stringify(obj));
        if (Object.prototype.toString.call(obj) === '[object Object]') {
          this.titleList = [newData];
          return;
        }
        this.titleList = newData;
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    EditRow
  },
  mounted () {
  },
  methods: {
    changeHandler (obj, index) {
      this.$emit('change', obj, index);
    }
  }
};
</script>
<style lang='scss' scoped>
.title-edit{
  height: 200px;
  overflow-y: auto;
  .edit-row{
    height: 30px;
    font-size: 14px;
    align-items: center;
    display: flex;
  }
  .row-left {
    width: 70px;
  }
  .row-other{
    box-sizing: border-box;
    flex: 1;
  }
  .mid{
    padding: 0px 10px;
  }
}
</style>
