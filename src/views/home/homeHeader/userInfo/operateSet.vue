<template>
  <div class="operate-set">
    <div class="set-item" @click="resetPassword">修改密码</div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
export default {
  data () {
    return {
    };
  },
  components: {
  },
  mounted () {
  },
  methods: {
    ...mapMutations(['setIsModifyPw']),
    resetPassword () {
      this.$emit('hide');
      this.setIsModifyPw(true);
    },
  }
};
</script>
<style lang='scss' scoped>
.operate-set{
  left: 260px;
  top: 40px;
  position: absolute;
  height: 40px;
  width: 200px;
  line-height: 40px;
  color: white;
  border-radius: 0 0 4px 4px;
  background-color: #666666;
  .set-item {
    font-size: 14px;
    padding: 0px 10px;
    cursor: pointer;
  }
}
</style>
