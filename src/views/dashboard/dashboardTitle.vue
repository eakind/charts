<template>
  <!-- @keyup="keyUpHandler($event)" -->
  <div
    class="dashboard-title"
    :style="titleStyle"
  >
    <div
      class="title-content"
      contenteditable="true"
      :style="titleFontStyle"
      v-html="title"
      @blur="saveTitle"
    >
    </div>
    <text-edit
      class="text-edit"
      :styleObj="curStyleObj"
      v-if="showFlag && isTarget"
      @close="closeHandler"
      @sure="sure"
    ></text-edit>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { hexToRgba, setLineHeight } from '@/utils/utils.js';
import { post } from '@/api/server';
import textEdit from './editText.vue';
export default {
  data () {
    return {
      timer: null,
      curStyleObj: {}
    };
  },
  props: ['showFlag', 'selectedTarget', 'itemData'],
  computed: {
    ...mapState('dashboard', ['currentDashboardDetail', 'dashboardList']),
    ...mapState('project', ['projectId']),
    isTarget () {
      if (!this.selectedTarget) return false;
      return this.selectedTarget.idx === this.itemData.idx;
    },
    title () {
      return this.currentDashboardDetail.dashboard_title;
    },
    titleFontStyle () {
      let titleCss = this.currentDashboardDetail.css.title;
      let fontStyle = titleCss.fontStyle;
      let styleCss = {
        bold: 'fontWeight',
        underline: 'textDecoration',
        italic: 'fontStyle',
      };
      let paddingStyle = {
        paddingTop: `${titleCss.padding.top}px`,
        paddingLeft: `${titleCss.padding.left}px`,
        paddingRight: `${titleCss.padding.right}px`,
        paddingBottom: `${titleCss.padding.bottom}px`,
      };
      let obj = {
        ...paddingStyle
      };
      if (fontStyle) {
        for (const fs of fontStyle) {
          obj[styleCss[fs]] = fs;
        }
        // obj[styleCss[fontStyle]] = fontStyle;
      }
      return obj;
    },
    titleStyle () {
      if (
        !this.currentDashboardDetail.css ||
        !this.currentDashboardDetail.css.title
      ) {
        return;
      }
      let titleCss = this.currentDashboardDetail.css.title;
      let opacity = titleCss.bgColor.bgSelected ? titleCss.bgColor.opacity : 0;
      let background = titleCss.bgColor.background.background;
      let backgroundColor = hexToRgba(
        background,
        opacity
      );
      let borderColor = hexToRgba(
        titleCss.border.background,
        titleCss.border.opacity
      );
      const borderStyle = {
        none: 'none',
        bold: `2px solid ${borderColor}`,
        solid: `1px solid ${borderColor}`,
        dotted: `1px dotted ${borderColor}`,
      };
      // let paddingStyle = {
      //   paddingTop: `${titleCss.padding.top}px`,
      //   paddingLeft: `${titleCss.padding.left}px`,
      //   paddingRight: `${titleCss.padding.right}px`,
      //   paddingBottom: `${titleCss.padding.bottom}px`,
      // };
      let border = borderStyle[titleCss.border.bgSelected];
      let fontColor = hexToRgba(
        titleCss.colorStyle.background,
        titleCss.colorStyle.opacity
      );
      let fontSize = `${titleCss.fontSize}px`;
      let fontStyle = titleCss.fontStyle;
      let textAlign = titleCss.textAlign;
      let styleCss = {
        bold: 'fontWeight',
        underline: 'textDecoration',
        italic: 'fontStyle',
      };
      let obj = {
        backgroundColor,
        border,
        color: fontColor,
        fontSize,
        textAlign,
        // ...paddingStyle,
        lineHeight: setLineHeight(titleCss.fontSize),
      };
      if (fontStyle) {
        for (const fs of fontStyle) {
          obj[styleCss[fs]] = fs;
        }
        // obj[styleCss[fontStyle]] = fontStyle;
      }
      return obj;
    },
  },
  watch: {
    'currentDashboardDetail.css': {
      handler (val) {
        this.curStyleObj = {
          value: this.title,
          title: this.currentDashboardDetail.css.title || {},
        };
        if (
          !this.curStyleObj.title.colorStyle ||
          !this.curStyleObj.title.colorStyle.bgSelected
        ) {
          this.curStyleObj.title.colorStyle = {
            background: '#000',
            bgSelected: true,
            opacity: 100,
          };
        }
      },
      immediate: true,
      deep: true,
    },
    title (val) {
      this.curStyleObj.value = val;
    },
  },
  components: {
    textEdit,
  },
  beforeDestroy () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
  mounted () {},
  methods: {
    ...mapMutations('dashboard', ['setCurrentDashboardDetail']),
    ...mapActions('dashboard', ['setCss']),
    closeHandler () {
      this.$emit('update:showFlag', false);
      // this.showFlag = false;
      this.$emit('close');
    },
    // inputProcess (event) {
    //   if (this.timer) {
    //     clearTimeout(this.timer);
    //     this.timer = null;
    //   }
    //   this.timer = setTimeout(() => {
    //     this.setDashboardTitle(event.target.innerText);
    //   }, 2000);
    // },
    saveTitle (event) {
      if (this.showFlag) return;
      this.setDashboardTitle(event.target.innerText);
    },
    async setDashboardTitle (text) {
      let param = {
        dashboard_id: this.currentDashboardDetail.dashboard_id,
        dashboard_title: text,
        project_id: this.projectId,
      };
      let titleLength = this.getByteLen(text);
      if (text && titleLength > 64) {
        this.$message({
          message: '最多输入64个字符',
          type: 'warning'
        });
        return;
      }
      this.currentDashboardDetail.dashboard_title = text;
      const res = await post('dashboardTitle', param);
      if (res.code === 0) {
        for (let i = 0; i < this.dashboardList.length; i++) {
          if (
            this.currentDashboardDetail.dashboard_id ===
            this.dashboardList[i].dashboard_id
          ) {
            this.$set(this.dashboardList[i], 'dashboard_title', text);
          }
        }
        this.showFlag = false;
        this.$set(this.currentDashboardDetail, 'dashboard_title', text);
        this.setCurrentDashboardDetail(this.currentDashboardDetail);
        this.title = text;
        this.$emit('update:showFlag', false);
      }
    },
    getByteLen: function (val) {
      if (val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
          var a = val.charAt(i);
          // eslint-disable-next-line no-control-regex
          if (a.match(/[^\x00-\xff]/gi) != null) {
            len += 2;
          } else {
            len += 1;
          }
        }
        return len;
      }
    },
    sure (obj) {
      let titleLength = this.getByteLen(obj.value);
      if (obj.value && titleLength > 64) {
        this.$message({
          message: '最多输入64个字符',
          type: 'warning'
        });
        return;
      }
      this.setCss({ attr: 'title', css: obj.title, projectId: this.projectId });
      this.setDashboardTitle(obj.value);
    },
  },
};
</script>
<style lang="scss" scoped>
.dashboard-title {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  display: flex;
  padding: 8px;
  align-items: center;
  .title-content {
    width: 100%;
    box-sizing: border-box;
    @include scroll;
    outline: none;
    word-break: break-word;
    word-wrap: break-word;
  }
}
</style>
