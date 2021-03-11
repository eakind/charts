<template>
  <div class="dc-color-tpl">
    <div class="tpl-header">{{$t('message.template')}}</div>
    <div class="tpl-body">
      <div class="tpl-body-tip" v-if="showTip">
        <div class="tpl-txt">
          <span>{{$t('message.color_tpl_que')}}</span>
          <span>（{{$t('message.color_tpl_tip')}}）</span>
        </div>
      </div>
      <div class="tpl-body-left">
        <div class="tpl-color-title">
          <span class="title" :title="name">{{name}}</span>
          <span class="reset-btn" @click.stop="resetHandler">{{$t('message.reset')}}</span>
        </div>
        <div style="cursor: pointer;"
          v-for="(item, index) in list"
          :key="index"
          :class="select === index ? 'tpl-item-active' : ''"
          @click.stop="selectColor(item, index)"
        >
          <span class="legend-color" :style="{backgroundColor: item.color}"></span>
          <span>{{item.val}}</span>
        </div>
      </div>
      <div class="tpl-body-right">
        <tpl-item
          v-for="(item, index) in tplList"
          :item="item"
          :key="index"
          @select="selectTplColor"
          @selectAll="selectTplAll"
        ></tpl-item>
      </div>
    </div>
    <div class="tpl-footer">
      <button @click="sureHandler">{{$t('message.confirmed')}}</button>
      <button @click="cancelHandler">{{$t('message.cancel')}}</button>
    </div>
  </div>
</template>

<script>
import TplItem from './tplItem';
import { mapState } from 'vuex';
export default {
  name: 'DcColorTpl',
  components: {
    TplItem
  },
  data () {
    return {
      list: [],
      select: 0,
      showTip: false,
      tempList: [],
      name: '',
      tplList: [
        {
          title: this.$t('message.standard'), // 标准
          show: true,
          color: [
            '#4284F5',
            '#03B98C',
            '#FACC14',
            '#F5282D',
            '#8543E0',
            '#3FAECC',
            '#3110D0',
            '#E88F00',
            '#DE2393',
            '#91BA38',
            '#99B4BF',
            '#216A58',
            '#AB9438',
            '#F4999B',
            '#C9BFE1',
            '#055166',
            '#1F135A',
            '#43140A',
            '#96005A',
            '#8D8D8D'
          ]
        },
        {
          title: this.$t('message.business'), // 商务
          show: true,
          color: [
            '#D3E1ED',
            '#52BAD9',
            '#026BDB',
            '#013F81',
            '#E8550C',
            '#6F492A',
            '#328689',
            '#3A3C32',
            '#527F13',
            '#137F7B',
            '#9D8257',
            '#4F6F59',
            '#0E0A18',
            '#8E2728',
            '#135A2F',
            '#E9BC33'
          ]
        },
        {
          title: this.$t('message.vitality'), // 活力
          show: true,
          color: [
            '#A9AFBA',
            '#097BE5',
            '#F0C808',
            '#F23400',
            '#53BBE7',
            '#FFAE0C',
            '#68B723',
            '#C9009D',
            '#5C53E7',
            '#F27522',
            '#27C974',
            '#01A2BB',
            '#f0c808',
            '#CA2736',
            '#9EB62C',
            '#F867B1',
            '#E14B19',
            '#161616',
            '#F17467',
            '#756C2C'
          ]
        },
        {
          title: this.$t('message.simple'), // 简朴
          show: true,
          color: [
            '#5E5E5E',
            '#B7A084',
            '#32658B',
            '#87BCDA',
            '#BF9547',
            '#5A4010',
            '#9A9B73',
            '#6C756E',
            '#A26212',
            '#A87A70',
            '#B4A9A0',
            '#A2463E',
            '#A4BAC5',
            '#FACC14',
            '#8543E0',
            '#4284F5',
            '#DABF61',
            '#4E3C44',
            '#F5282D',
            '#345150'
          ]
        },
        {
          title: this.$t('message.strong'), // 浓烈
          show: true,
          color: [
            '#C1272D',
            '#2B59C3',
            '#66666E',
            '#090446',
            '#FAA916',
            '#0FA3B1',
            '#42113C',
            '#36645D',
            '#eac435',
            '#394648',
            '#8E2728',
            '#104862',
            '#BD5E24',
            '#3C4204',
            '#02453D',
            '#D4487D',
            '#743E2C',
            '#2B91C3',
            '#E37813',
            '#0E0A18'
          ]
        },
        {
          title: this.$t('message.fresh'), // 清新
          show: true,
          color: [
            '#1B3764',
            '#4AB8B8',
            '#EFA35C',
            '#E7B3B3',
            '#575151',
            '#7DC383',
            '#2D4059',
            '#F8BC91',
            '#B8D1BD',
            '#9B8E9B',
            '#6D9CBA',
            '#ED9D82',
            '#626088',
            '#E5CF62',
            '#C4BD9A',
            '#B0D4D5',
            '#C49A9A',
            '#EB981C',
            '#9EB62C',
            '#F08D7F'
          ]
        },
        {
          title: this.$t('message.custom'), // 国风
          show: true,
          color: [
            '#e29c45',
            '#c83c23',
            '#eedeb0',
            '#003472',
            '#a78e44',
            '#3d3b4f',
            '#f0c239',
            '#9d2933',
            '#8c4356',
            '#a98175',
            '#486B55',
            '#EF7A82',
            '#725e82',
            '#fcefe8',
            '#739E98',
            '#5C97B5',
            '#75664d'
          ]
        }
      ],
      currentList: []
    };
  },
  props: {
    colorList: {
      type: [Array, Object]
    },
    schemesIndex: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    ...mapState('drawingboard', ['canvasType'])
  },
  watch: {
    colorList: {
      handler (list) {
        this.list = JSON.parse(JSON.stringify(list[this.schemesIndex].list));
        if (list[this.schemesIndex].colored_type === 'ordinal') {
          this.list.forEach(i => {
            this.$set(i, 'color', list[this.schemesIndex].colors[i.val]);
          });
        }
        this.name = this.isBar()
          ? list[this.schemesIndex].key
          : list[this.schemesIndex].name;
      },
      deep: true,
      immediate: true
    }
  },
  beforeCreate () {},
  created () {},
  beforeMount () {},
  mounted () {

  },
  destroyed () {},
  methods: {
    isBar () {
      return (
        this.canvasType === 'bar' ||
        this.canvasType === 'line' ||
        this.canvasType === 'bar-rotated' ||
        this.canvasType === 'bar-line'
      );
    },
    selectColor (item, index) {
      this.select = index;
    },
    selectTplColor (item, color_list) {
      this.$set(this.list[this.select], 'color', item);
      let colors = this.list.map(l => l.color);
      this.currentList = color_list;
      colors.forEach((c, i) => (this.currentList[i] = c));
    },
    selectTplAll (list) {
      this.currentList = list;
      if (list.length < this.list.length) {
        this.tempList = list;
        this.showTip = true;
      }
      for (let i = 0; i < this.list.length; i++) {
        if (list[i]) {
          this.$set(this.list[i], 'color', list[i]);
        } else {
          this.$set(this.list[i], 'color', list[i % list.length]);
        }
      }
    },
    sureHandler () {
      if (this.showTip) {
        let num = 0;
        for (let i = 0; i < this.list.length; i++) {
          if (num < this.tempList.length - 1) {
            this.$set(this.list[i], 'color', this.tempList[num]);
            num++;
          } else {
            num = i - num;
          }
        }
        this.showTip = false;
        return;
      }

      this.$emit('sure', this.list, this.schemesIndex, this.currentList);
    },
    cancelHandler () {
      if (this.showTip) {
        this.showTip = false;
        return;
      }
      this.$emit('cancel');
    },
    resetHandler () {
      if (this.colorList[this.schemesIndex].list.length === 2) {
        this.$set(this.list[0], 'color', 'rgb(122, 201, 245)');
        this.$set(this.list[1], 'color', 'rgb(42, 87, 131)');
      } else {
        this.reset(this.tplList[0].color);
      }
    },
    reset (list) {
      for (let i = 0; i < this.list.length; i++) {
        if (list[i]) {
          this.$set(this.list[i], 'color', list[i]);
        } else {
          this.$set(this.list[i], 'color', list[i % list.length]);
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.dc-color-tpl {
  // width: 510px;
  // height: 610px;
  padding: 10px 20px;
  .tpl-header {
    padding: 0px 10px;
    text-align: center;
  }
  .tpl-body {
    background-color: white;
    margin: 10px;
    display: flex;
    border: 1px solid #979797;
    height: 530px;
    position: relative;
    .tpl-body-tip {
      background-color: rgba(0, 0, 0, 0.8);
      height: 100%;
      width: 100%;
      z-index: 999;
      color: white;
      text-align: center;
      position: absolute;
      .tpl-txt {
        top: 50%;
        left: 50%;
        width: 100%;
        text-align: center;
        transform: translate(-50%, -50%);
        position: absolute;
        span {
          display: block;
          &:nth-child(1) {
            font-size: 18px;
          }
          &:nth-child(2) {
            font-size: 16px;
          }
        }
      }
    }
    .tpl-item-active {
      background: #ffffff;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
    }
    .tpl-body-left {
      width: 50%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      .tpl-color-title {
        padding: 5px;
        font-size: 14px;
        display: flex;
        background-color: #f2f2f2;
        .title {
          max-width: 60%;
          display: inline-block;
          @include ellipsis;
        }
        .reset-btn {
          margin-left: 10px;
          padding: 1px 10px;
          border-radius: 4px;
          color: #4284f5;
          font-size: 12px;
          cursor: pointer;
          background-color: white;
          border: 1px solid #4284f5;
          display: inline-block;
        }
      }
      div {
        font-size: 12px;
        padding: 5px 10px;
        .legend-color {
          width: 8px;
          height: 20px;
          border-radius: 4px;
          display: inline-block;
          top: 6px;
          margin-right: 5px;
          position: relative;
          /*border: 2px solid #dedede;*/
        }
      }
    }
    .tpl-body-right {
      width: 50%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #f2f2f2;
      border-left: 1px solid #979797;
    }
  }
  .tpl-footer {
    text-align: center;
    button {
      width: 120px;
      height: 30px;
      font-size: 16px;
      line-height: 25px;
      border-radius: 25px;
      outline: none;
      margin: 0px 30px;
      cursor: pointer;
      &:nth-child(1) {
        color: white;
        background-color: #4284f5;
        border: 1px solid #4284f5;
      }
      &:nth-child(2) {
        color: #666666;
        background-color: white;
        border: 1px solid #666666;
      }
    }
  }
}
</style>
