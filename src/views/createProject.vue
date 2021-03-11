<template>
  <div class="dc-create-project">
    <create-left></create-left>
    <router-view></router-view>
  </div>
</template>

<script>
import CreateLeft from './createProject/createLeft';
export default {
  components: {
    CreateLeft
  }
};
</script>

<style scoped lang="scss">
.dc-create-project{
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #e7eaf0;
}
</style>
