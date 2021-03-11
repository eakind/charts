<template>
  <div class="text-chart-wrap" :style="curStyle">
    <div
      class="text-chart"
      contenteditable="true"
      v-html="curStr"
      placeholder="点此输入文本或双击点开编辑"
      :class="flag ? '' : 'no-content'"
      @input="inputProcess"
    ></div>
    <text-edit
      class="text-edit"
      v-if="showFlag && isTarget"
      :styleObj="styleObj"
      @close="closeHandler"
      @sure="sure"
    ></text-edit>
  </div>
</template>
<script>
import textMixins from './mixins/text';
import textDrawMixins from './mixins/textDraw';
import textEdit from './editText.vue';
import { refreshCanvasMixin } from '../dashboard/boardLayout/mixins/refreshCanvas';
import { mapState } from 'vuex';
export default {
  name: 'textChart',
  data () {
    return {
      curStr: '',
      timer: null,
      flag: false
    };
  },
  components: {
    textEdit,
  },
  props: ['id', 'styleObj', 'showFlag', 'selectedTarget', 'itemData'],
  computed: {
    ...mapState('dashboard', ['layoutList']),
    isTarget () {
      if (!this.selectedTarget) return false;
      return this.selectedTarget.idx === this.itemData.idx;
    },
  },
  mixins: [textMixins, textDrawMixins, refreshCanvasMixin],
  beforeDestroy () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
  mounted () {
    this.curStr = this.styleObj.value;
    this.flag = !!this.curStr;
  },
  methods: {
    closeHandler () {
      this.$emit('update:showFlag', false);
      // this.showFlag = false;
      this.$emit('close');
    },
    inputProcess (event) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.flag = !!event.target.innerText;
        this.setTargetCss({
          id: this.currentTarget.id,
          attr: 'value',
          css: event.target.innerText,
          projectId: this.projectId,
        });
      }, 300);
    },
    sure (obj) {
      this.flag = !!obj.title;
      this.setTargetCss({
        id: this.currentTarget.id,
        attr: 'value',
        css: obj.value,
        projectId: this.projectId,
      });
      this.setTargetCss({
        id: this.currentTarget.id,
        attr: 'title',
        css: obj.title,
        projectId: this.projectId,
      });
      this.curStr = obj.value;
      this.$emit('update:showFlag', false);
    },
  },
};
</script>
<style lang="scss" scoped>
.text-chart-wrap {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  &:hover {
    overflow-y: auto;
  }
}

.text-chart {
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  overflow-x: hidden;
  @include scroll;
  outline: none;
  padding: 8px;
  box-sizing: border-box;
  word-break: break-word;
  word-wrap: break-word;
  white-space: pre-wrap;
  &:hover {
    overflow-y: auto;
  }
}
.no-content::before {
  position: absolute;
  top: 4px;
  left: 8px;
  color: #cccccc;
  content: attr(placeholder);
}
.text-edit {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>
