<template>
  <div class="scroll-item" :class="isActive">
    <span class="num">{{index + 1}}</span>
    <span class="title" :title="item.worksheet_title">{{item.worksheet_title}}</span>
    <span class="type">{{worksheetTypesNameMap(item.worksheet_type)}}</span>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
export default {
  data () {
    return {
    };
  },
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    ...mapGetters('project', ['worksheetTypesNameMap']),
    ...mapState('drawingboard', ['currentCanvas']),
    isActive () {
      if (this.item.worksheet_id === this.currentCanvas.worksheet_id) {
        return 'scroll-active';
      }
      return '';
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
@import '../scss/scrollItem.scss';
</style>
