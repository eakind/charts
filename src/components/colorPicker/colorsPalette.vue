<template>
  <div class="colors-palette">
    <div class="palette">
      <span class="title">参考色板</span>
      <template-select class="select-list"
                       :list="tempColorList"
                       :select="selected"
                       @change="changeTemplate"></template-select>
    </div>
    <div class="template">
      <template-color :list="templateList"
                      @change="onColorPick"
                      :value="color"></template-color>
      <div class="color-panel">
        <button @click="showColorTpl(index)">{{$t('dashboard.color_schemes')}}</button>
      </div>
      <colors-recent :value="color"
                     @pick-recent="onColorPick"></colors-recent>
    </div>
    <dc-alert append-to-body v-if="isColorTplVisible">
      <dc-color-tpl @sure="onTplConfirm"
                    @cancel="isColorTplVisible = false"
                    :colorList="colorList"
                    :schemesIndex="schemesIndex"></dc-color-tpl>
    </dc-alert>
  </div>
</template>

<script>
import { colorModel } from './colorMixin';
import TemplateSelect from './colorsTemplate/templateSelect.vue';
import TemplateColor from './colorsTemplate/templateColor.vue';
import ColorsRecent from './colorsRecent.vue';
import DcColorTpl from '@/components/dccolortpl/dcColorTpl.vue';
import DcAlert from '@/components/dcalert/dcAlert';
import { mapState } from 'vuex';
export default {
  mixins: [colorModel],
  props: {
    colorList: {
      type: Array,
      default: _ => []
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      selected: '标准',
      templateList: [],
      isColorTplVisible: false,
      schemesIndex: 0
    };
  },
  computed: {
    ...mapState('colors', ['tplList']),
    tempColorList () {
      let list = this.tplList;
      return list.map(item => ({ id: item.title, name: item.title }));
    }
  },
  watch: {
    tplList: {
      handler (list) {
        if (!list.length) return;
        this.templateList = list[0].color;
      },
      immediate: true
    },
  },
  components: {
    TemplateSelect,
    TemplateColor,
    ColorsRecent,
    DcColorTpl,
    DcAlert
  },
  mounted () {
    // console.log(this.colorList);
  },
  methods: {
    changeTemplate (item) {
      let list = this.tplList;
      let len = this.tplList.length;
      for (let i = 0; i < len; i++) {
        if (list[i].title === item.name) {
          this.templateList = list[i].color;
        }
      }
    },
    showColorTpl (idx) {
      // console.log(idx);
      // console.log(this.index);
      this.schemesIndex = idx;
      this.isColorTplVisible = true;
    },
    onTplConfirm (array, idx, templateList) {
      this.isColorTplVisible = false;
      this.$emit('on-tpl-confirm', array, idx, templateList);
    }
  }
};
</script>

<style lang="scss" scoped>
.colors-palette {
  min-height: 160px;
  .palette {
    display: flex;
    align-items: center;
  }
  .title {
    font-size: 12px;
    color: #666666;
    margin-right: 5px;
  }
  .select-list {
    top: -1px;
    left: 5px;
    width: 125px;
    position: relative;
  }
  .template {
    padding: 5px 0px;
  }
}
.color-panel {
    text-align: center;
    > button {
      background-color: #4284f5;
      color: white;
      border: none;
      font-size: 14px;
      border-radius: 4px;
      padding: 6px 25px;
      outline: none;
      text-align: center;
      margin-bottom: 8px;
    }
  }
</style>
