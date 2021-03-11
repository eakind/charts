<template>
  <dc-collapse-item :title="$t('dashboard.table_header')"
                    :hasChecked="true"
                    :checked-label="$t('dashboard.show')"
                    :checked="headAllShowFlag"
                    @checked-change="handleTitleVisible">
    <div class="table-setting-wrap">
      <div class="flex filed-wrap">
        <div class="edit-name">{{$t('dashboard.fieldName')}}</div>
        <div class="edit-btn"
             @click="showEditBox=true">{{$t('dashboard.edit')}}</div>
      </div>
      <font-style :hasAlign="true"
                  :align.sync="align"
                  @change="change"
                  :titleCss="titleCss"></font-style>
    </div>
    <dc-alert append-to-body
              v-if="showEditBox">
      <table-title-edit :tableTitleData="curTableTitleData"
                        @on-close-edit="showEditBox=false"
                        v-on="$listeners"></table-title-edit>
    </dc-alert>
  </dc-collapse-item>
</template>
<script>
import fontStyle from './components/fontStyle';
import tableTitleEdit from './components/tableTitleEdit';
import dcAlert from '@/components/dcalert/dcAlert';
export default {
  name: 'tableSetting',
  components: { fontStyle, tableTitleEdit, dcAlert },
  props: {
    tableTitleData: {
      type: Array,
      default: _ => []
    }
  },
  data () {
    return {
      canvasCss: {},
      curTableTitleData: [],
      showEditBox: false,
      align: 'left',
      titleCss: {}
    };
  },
  watch: {
    tableTitleData: {
      handler (val) {
        this.curTableTitleData = val;
        val.length > 0 && (this.titleCss = { color: val[0].text.fontColor, fontSize: val[0].text.fontSize });
        val.length > 0 && (this.align = val[0].text.align);
      },
      immediate: true,
      deep: true
    },
    align: {
      handler (val) {
        this.curTableTitleData.map(i => {
          if (i.text) {
            i.text.align = val;
          } else {
            i.align = val;
          }
        });
        this.$emit('on-canvasCss-change', 'tableTitleData', this.curTableTitleData);
      }
    }
  },
  computed: {
    headAllShowFlag () {
      return this.tableTitleData.filter(i => i.display !== 'none').length > 0;
    }
  },
  methods: {
    handleTitleVisible (flag) {
      this.curTableTitleData.map(i => {
        i.display = flag ? 'auto' : 'none';
      });
      this.$emit('on-canvasCss-change', 'tableTitleData', this.curTableTitleData);
    },
    change (fontColor, fontSize) {
      this.curTableTitleData.map(i => {
        if (i.text) {
          i.text.fontSize = fontSize;
          i.text.fontColor = fontColor;
        }
      });
      this.$emit('on-canvasCss-change', 'tableTitleData', this.curTableTitleData);
    }
  }
};
</script>
<style lang="scss" scoped>
.table-setting-wrap {
  padding-top: 8px;
  padding-bottom: 8px;
  .filed-wrap {
    height: 36px;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    .edit-name {
      color: #4284f5;
    }
    .edit-btn {
      width: 64px;
      height: 24px;
      line-height: 24px;
      background-color: #4284f5;
      border-radius: 4px;
      text-align: center;
      color: #fff;
      cursor: pointer;
    }
  }
}
.dc-alert {
  background-color: #fff;
}
</style>
