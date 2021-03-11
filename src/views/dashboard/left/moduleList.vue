<template>
  <div class="module-wrap">
    <dc-collapse :activeName="activeName" :itemsList="itemsList">
      <template #canvas>
        <div class="modlue-list-wrap">
          <template v-for="(i, index) in workSheetList">
            <dc-drag
              class="module-item"
              :key="index"
              :id="i.worksheet_id"
              :data-type="i.worksheet_type"
              :title="i.worksheet_title"
              :class="i.active ? 'active' : ''"
              @dragging="draggingHandler(arguments, 'canvas')"
              @stopDrag="stopDragHandler(arguments, 'canvas')"
            >
              <span
                class="iconfont"
                :class="newWorksheetTypesIconMap[i.worksheet_type]"
              ></span>
              {{ index + 1 }}. {{ i.worksheet_title }}
            </dc-drag>
          </template>
        </div>
      </template>
      <template #others>
        <div class="modlue-list-wrap">
          <dc-drag class="module-item flex"
                   @dragging="draggingHandler(arguments, 'text')"
                   @stopDrag="stopDragHandler(arguments, 'text')">
            <span class="iconfont icon-dbc_textcolor"></span> 文本组件
          </dc-drag>
          <!-- <dc-drag class="module-item"
                   @dragging="draggingHandler(arguments, 'image')"
                   @stopDrag="stopDragHandler(arguments, 'image')">
            <span class="iconfont icon-db_picbase"></span> 图片组件
          </dc-drag> -->
        </div>
      </template>
    </dc-collapse>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import dcCollapse from '@/components/newcollapse/index.vue';
import DcDrag from '@/components/dcdrag/dcDrag.vue';
export default {
  name: 'moduleList',
  components: {
    dcCollapse,
    DcDrag
  },
  props: {
    moduleList: {
      type: Array,
      default: (_) => [],
    },
  },
  computed: {
    ...mapState('project', ['newWorksheetTypesIconMap']),
    ...mapState('dashboard', ['workSheetList']),
  },
  data () {
    return {
      activeName: ['1', '2'],
      itemsList: [
        {
          name: '1',
          slot: 'canvas',
          title: '画布列表',
        },
        {
          name: '2',
          slot: 'others',
          title: '其他组件',
        },
      ],
    };
  },
  methods: {
    draggingHandler (paramList, type) {
      let clientX = paramList[2];
      let clientY = paramList[3];
      let worksheetId = paramList[0].id;
      let canvasType = paramList[0].dataset.type;
      this.bus.$emit('dragging-module', clientX, clientY, type, worksheetId, null, null, canvasType);
    },
    stopDragHandler (paramList, type) {
      let clientX = paramList[2];
      let clientY = paramList[3];
      let worksheetId = paramList[0].id;
      let canvasType = paramList[0].dataset.type;
      this.bus.$emit('stop-drag-module', clientX, clientY, type, worksheetId, null, null, canvasType);
    }
  }
};
</script>
<style lang="scss">
.module-item {
  font-size: 12px;
  border-radius: 4px;
  background: hsl(0, 0%, 100%);
  border: 1px solid hsl(0, 0%, 87.1%);
  border: 1px solid #4284f5;
  // padding: 3px 24px 3px 4px!important;
  color: hsl(0, 0%, 40%);
  cursor: pointer;
  .iconfont {
    color: hsl(0, 0%, 87.1%);
    font-size: 12px;
    margin-right: 0.4em;
  }
}
</style>
<style lang="scss" scoped>
.module-wrap {
  font-size: 12px;
  .module-list-wrap {
    max-height: 30em;
    overflow: auto;
  }
  .module-item {
    font-size: 12px;
    border-radius: 4px;
    background: hsl(0, 0%, 100%);
    border: 1px solid hsl(0, 0%, 87.1%);
    padding: 0.45em 0.66em;
    color: hsl(0, 0%, 40%);
    @include ellipsis;
    cursor: pointer;
    .iconfont {
      color: hsl(0, 0%, 87.1%);
      font-size: 12px;
      margin-right: 0.4em;
    }
  }
  .module-item.active,
  .module-item:hover {
    border-radius: 4px;
    background: hsl(213.3, 81.8%, 97.8%);
    border: 1px solid hsl(217.9, 89.9%, 61%);
    color: hsl(0, 0%, 25.9%);
    .iconfont {
      color: hsl(0, 0%, 25.9%);
    }
  }
  .module-item + .module-item {
    margin-top: 0.66em;
  }
}
// @import '../style/moduleList.scss';
</style>
