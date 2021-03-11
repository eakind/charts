<template>
  <dc-collapse-item title="坐标轴">
    <div class="axis-setting">
      <div class="axis-title-edit">
        <span class="axis-title">坐标轴标题</span>
        <button class="edit-btn" @click="isEditTitle = true">编辑</button>
      </div>
      <div class="axis-body">
        <template v-for="(i, index) in titleList">
          <div :key="index">
            <span class="axis-type">{{ titleKeyValue[i.axisType] }}</span>
            <font-style
              :titleCss="i.style"
              @change="changeAxisTitle(i.axisType, $event)"
            ></font-style>
          </div>
        </template>
        <!-- <span class="axis-type">X轴</span>
        <font-style
          :titleCss="fontXAxis"
          @change="changeXAxisStyle"
        ></font-style>
        <span class="axis-type">Y轴</span>
        <font-style
          :titleCss="fontYAxis"
          @change="changeYAxisStyle"
        ></font-style> -->
      </div>
      <div class="axis-body">
        <canvas-checked
          :active="isShowAxis"
          title="坐标轴线"
          @click.native="toggleAxis"
        ></canvas-checked>
        <line-style
          :line-style="curLineStyle.style"
          @change="changeStyle"
        ></line-style>
      </div>
      <div class="combined-axis" v-if="isHasCombined" @click="combinedHandler">
        <dc-checked :active="isCombined"></dc-checked>
        <span class="combined-txt">合并坐标轴</span>
      </div>
    </div>
    <axis-title-edit
      v-if="isEditTitle"
      @close="closeEdit"
      @change="changeTitleList"
      :fontList="titleList"
    ></axis-title-edit>
  </dc-collapse-item>
</template>
<script>
import DcChecked from '@/components/dcchecked/dcChecked';
import CanvasChecked from './components/canvasChecked';
import AxisTitleEdit from './components/axisTitleEdit';
import FontStyle from './components/fontStyle';
import LineStyle from './components/lineStyle';
import { mapState } from 'vuex';

export default {
  data () {
    return {
      fontXAxis: {
        color: '#424242',
        fontSize: 14,
      }, // X轴字体大小跟颜色
      fontYAxis: {
        color: '#424242',
        fontSize: 14,
      }, // Y轴字体大小跟颜色
      lineStyleObj: {
        color: '#424242',
        thickness: 1,
        style: 'line',
      }, // 坐标轴样式
      fontStyleList: [], // 坐标轴标题样式列表
      axisStyleList: [], // 坐标轴样式列表
      isShowTitle: true, // 是否显示坐标轴标题
      isShowAxis: true, // 是否显示坐标轴
      isCombined: true, // 是否合并坐标轴
      isEditTitle: false, // 是否编辑标题
      hasCombined: 0, // 大于1时出现合并坐标轴

      curAxisStyle: [],
      titleList: [], // 坐标轴标题
      titleKeyValue: { x: 'X轴', y: 'Y轴' },
      curLineStyle: {}, // x,y任意一个
    };
  },
  props: {
    axisStyle: {
      type: Object,
    },
  },
  computed: {
    ...mapState('drawingboard', ['canvasType']),
    isHasCombined () {
      let list = this.axisStyleList.filter(
        (item) => item.axis !== this.$t('message.x_axis')
      );
      if (list.length > 1 && this.canvasType !== 'scatter') {
        return true;
      }
      return false;
    },
  },
  watch: {
    axisStyle: {
      handler (val) {
        if (!val || val.length === 0) return;
        this.curAxisStyle = JSON.parse(JSON.stringify(val)) || [];
        let titleList = [];
        this.curAxisStyle.forEach((i) => {
          let { title, axisType, key } = i;
          title.feature = key;
          title.axisType = axisType;
          titleList.push(title);
        });

        this.curLineStyle = JSON.parse(
          JSON.stringify(this.curAxisStyle[0].line)
        );

        this.titleList = titleList;

        // if (!obj.axisList.length) return;
        // if (!obj.fontList.length) return;
        // this.fontStyleList = JSON.parse(JSON.stringify(obj.fontList));
        // this.axisStyleList = JSON.parse(JSON.stringify(obj.axisList));
        // this.isCombined = obj.combined ? obj.combined : false;
        // this.hasCombined = 0;
        // for (let i = 0; i < this.fontStyleList.length; i++) {
        //   if (this.fontStyleList[i].axis === this.$t('message.x_axis')) {
        //     this.$set(this.fontXAxis, 'color', obj.fontList[i].color);
        //     this.$set(this.fontXAxis, 'fontSize', obj.fontList[i].fontSize);
        //   } else {
        //     this.$set(this.fontYAxis, 'color', obj.fontList[i].color);
        //     this.$set(this.fontYAxis, 'fontSize', obj.fontList[i].fontSize);
        //     this.hasCombined++;
        //   }
        // }
        // this.isShowAxis = obj.axisList[0].show;
        // this.$set(this.lineStyleObj, 'color', obj.axisList[0].color);
        // this.$set(this.lineStyleObj, 'thickness', obj.axisList[0].thickness);
        // this.$set(this.lineStyleObj, 'style', obj.axisList[0].style);
      },
      immediate: true,
    },
  },
  components: {
    DcChecked,
    CanvasChecked,
    FontStyle,
    LineStyle,
    AxisTitleEdit,
  },
  mounted () {},
  methods: {
    changeAxisTitle (type, style) {
      let axisStyleList = this.curAxisStyle.map((cur) => {
        if (cur.axisType === type) {
          cur.title.style = style;
        }
        return cur;
      });
      this.curAxisStyle = axisStyleList;
      this.$emit('change', this.curAxisStyle);
    },

    changeTitleList (list) {
      let axisStyleList = this.curAxisStyle.map((cur) => {
        let match = list.find((i) => i.feature === cur.key);
        if (match) {
          cur.title.show = match.show;
          cur.title.value = match.value;
        }
        return cur;
      });
      this.isEditTitle = false;
      this.curAxisStyle = axisStyleList;
      this.$emit('change', this.curAxisStyle);
    },

    // setAxis (item) {
    //   if (item.axis === this.$t('dashboard.x_axis')) {
    //     return 'X';
    //   }
    //   return 'Y';
    // },
    // 是否显示坐标轴标题
    // toggleTitle () {
    //   this.isShowTitle = !this.isShowTitle;
    //   this.setList('show', this.isShowTitle, this.fontStyleList);
    //   this.$emit('change', this.fontStyleList, this.axisStyleList);
    // },

    // 是否显示坐标轴线
    toggleAxis () {
      this.isShowAxis = !this.isShowAxis;
      let axisStyleList = this.curAxisStyle.map((cur) => {
        cur.line.show = this.isShowAxis;
        return cur;
      });
      this.curAxisStyle = axisStyleList;
      this.$emit('change', this.curAxisStyle);

      // this.setList('show', this.isShowAxis, this.axisStyleList);
      // this.$emit('change', this.fontStyleList, this.axisStyleList);
    },
    // 是否合并坐标轴
    combinedHandler () {
      this.isCombined = !this.isCombined;
      this.$emit('combined', this.isCombined);
    },
    // changeName (value, index) {
    //   this.$set(this.fontStyleList[index], 'title', value);
    //   this.$emit('change', this.fontStyleList, this.axisStyleList);
    // },
    // changeXAxisStyle (fontColor, fontSize) {
    //   this.$set(this.fontXAxis, 'color', fontColor);
    //   this.$set(this.fontXAxis, 'fontSize', fontSize);
    //   this.setXYList(
    //     'color',
    //     fontColor,
    //     this.fontStyleList,
    //     this.$t('message.x_axis')
    //   );
    //   this.setXYList(
    //     'fontSize',
    //     fontSize,
    //     this.fontStyleList,
    //     this.$t('message.x_axis')
    //   );
    //   this.$emit('change', this.fontStyleList, this.axisStyleList);
    // },
    // changeYAxisStyle (fontColor, fontSize) {
    //   this.$set(this.fontYAxis, 'color', fontColor);
    //   this.$set(this.fontYAxis, 'fontSize', fontSize);
    //   this.setXYList(
    //     'color',
    //     fontColor,
    //     this.fontStyleList,
    //     this.$t('message.y_axle')
    //   );
    //   this.setXYList(
    //     'fontSize',
    //     fontSize,
    //     this.fontStyleList,
    //     this.$t('message.y_axle')
    //   );
    //   this.$emit('change', this.fontStyleList, this.axisStyleList);
    // },
    // changeFontList (list) {
    //   this.isEditTitle = false;
    //   this.fontStyleList = JSON.parse(JSON.stringify(list));
    //   this.$emit('change', this.fontStyleList, this.axisStyleList);
    // },
    changeStyle (lineStyle) {
      let axisStyleList = this.curAxisStyle.map((cur) => {
        cur.line.style = lineStyle;
        return cur;
      });
      this.curAxisStyle = axisStyleList;
      this.$emit('change', this.curAxisStyle);
      // this.setList('color', lineStyle.color, this.axisStyleList);
      // this.setList('thickness', lineStyle.thickness, this.axisStyleList);
      // this.setList('style', lineStyle.style, this.axisStyleList);
      // this.$emit('change', this.fontStyleList, this.axisStyleList);
    },
    // setXYList (type, value, list, axis) {
    //   for (let i = 0; i < list.length; i++) {
    //     if (list[i].axis === axis) {
    //       list[i][type] = value;
    //     }
    //   }
    // },
    // setList (type, value, list) {
    //   for (let i = 0; i < list.length; i++) {
    //     list[i][type] = value;
    //   }
    // },
    closeEdit () {
      this.isEditTitle = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.axis-setting {
  padding: 0px 0px 10px 0px;
  display: block;
  .axis-title-edit {
    display: flex;
    padding: 5px 0px;
    align-items: center;
  }
  .axis-title {
    flex: 1;
    color: #4284f5;
  }
  .edit-btn {
    color: white;
    background-color: #4284f5;
    border: none;
    border-radius: 4px;
    padding: 3px 15px;
  }
  .axis-body {
    padding: 5px 0px 15px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e1e1e1;
  }
  .axis-type {
    font-size: 16px;
  }
  .combined-axis {
    cursor: pointer;
    padding: 10px 0px 5px 10px;
  }
  .combined-txt {
    top: -3px;
    left: 5px;
    font-size: 16px;
    position: relative;
  }
}
</style>
