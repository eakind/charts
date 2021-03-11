<template>
  <div class="set-format">
    <div class="format-row">
      <span class="row-title">1. {{$t('message.file_code')}}</span>
      <dc-drop :list="codeList" :tip="format.encoding" @change="changeCode"></dc-drop>
    </div>
    <div class="format-row">
      <span class="row-title">2. {{$t('message.separ_option')}}</span>
      <div class="row-line">
        <div class="line-left">
          1)
        </div>
        <div class="line-right">
          <dc-radius v-for="(item, index) in signList" :label="item.name" :select="sign===item.code"
                     @click.native="sign=item.code" :key="index" ></dc-radius>
          <!--<input class="symbol-input" v-model="inputSign" :placeholder="$t('message.input_tip')" @click="sign=signList[signList.length - 1].code">-->
        </div>
      </div>
      <div class="row-line">
        <div class="line-left">
          2)
        </div>
        <div class="line-right">
          <span class="line-title">{{$t('message.select_str_separ')}}</span>
          <dc-radius v-for="(item, index) in quoMarkList" :label="item.name" :key="index"
                     @click.native='quoMarks=item.code' :select="quoMarks===item.code"></dc-radius>
          <!--<input class="symbol-input" v-model="inputQuoMarks" :placeholder="$t('message.input_tip')" @click="quoMarks=quoMarkList[quoMarkList.length - 1].code">-->
        </div>
      </div>
      <div class="row-line">
        <div class="line-left">
          3)
        </div>
        <div class="line-right">
          <span>{{$t('message.str_wrap')}}</span>
          <dc-radius :label="yes" @click.native="feed=yes" :select="feed===yes"></dc-radius>
          <dc-radius :label="no" @click.native="feed=no" :select="feed===no"></dc-radius>
        </div>
      </div>
      <div class="row-line">
        <div class="line-left">
          4)
        </div>
        <div class="line-right">
          <span>{{$t('message.int_symbol')}}</span>
          <dc-radius :label="yes" @click.native="thousands=yes" :select="thousands===yes"></dc-radius>
          <dc-radius :label="no" @click.native="thousands=no" :select="thousands===no"></dc-radius>
        </div>
      </div>
      <div class="row-line">
        <div class="line-left">
          5)
        </div>
        <div class="line-right">
          <span>{{$t('message.begin_row')}}</span>
          <span>{{$t('message.line_tip_head')}}<input class="line-num" v-model="lineNum"/>{{$t('message.line_tip')}}</span>
        </div>
      </div>
      <div class="row-line">
        <div class="line-left">
          6)
        </div>
        <div class="line-right">
          <span>{{$t('message.has_title')}}</span>
          <dc-radius :label="yes" @click.native="title=yes" :select="title===yes"></dc-radius>
          <dc-radius :label="no" @click.native="title=no" :select="title===no"></dc-radius>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DcDrop from '@/components/dcdrop/dcDrop.vue';
import DcRadius from './dcRadius.vue';
export default {
  components: {
    DcRadius,
    DcDrop
  },
  data () {
    return {
      format: {
        encoding: 'AUTO',
        seq: 'COMMA',
        quotechar: 'DOUBLE',
        wrap: false,
        thousands: false,
        startrows: 1,
        header: false
      },
      // 'GB2312', 'GBK',
      codeList: ['AUTO', 'UTF-8', 'UTF-16', 'ASCII', 'IOS8859-1', 'BIG5', 'GB18030'],
      signList: [{
        name: this.$t('message.comma'),
        code: 'COMMA' // 逗号
      }, {
        name: this.$t('message.y_axis'),
        code: 'PIPE' // 竖线
      }, {
        name: this.$t('message.tab_character'),
        code: 'TAB' // tab键
      }, {
        name: this.$t('message.space'),
        code: 'SPACE' // 空格
      }, {
        name: this.$t('message.semicolon_character'),
        code: 'SEMICOLON' // 分号
      }, {
        name: this.$t('message.colon'),
        code: 'COLON' // 冒号
      }, {
        name: this.$t('message.db_quota'),
        code: 'DOUBLE' // 双引号
      }, {
        name: this.$t('message.sign_quota'),
        code: 'SINGLE' // 单引号
      }],
      sign: 'COMMA',
      inputSign: '',
      quoMarkList: [{
        name: this.$t('message.db_quota'),
        code: 'DOUBLE' // 双引号
      }, {
        name: this.$t('message.sign_quota'),
        code: 'SINGLE' // 单引号
      }],
      quoMarks: 'DOUBLE',
      inputQuoMarks: '',
      yes: this.$t('message.yes'),
      no: this.$t('message.no'),
      feed: this.$t('message.no'),
      thousands: this.$t('message.no'),
      title: this.$t('message.yes'),
      lineNum: 1,
      timer: null,
      yesNo: {
        [this.$t('message.yes')]: true,
        [this.$t('message.no')]: false
      }
    };
  },
  props: {
    formatObj: {
      type: Object,
      default: () => {
        return {
          encoding: 'AUTO',
          seq: 'COMMA',
          quotechar: 'DOUBLE',
          wrap: false,
          thousands: false,
          startrows: 1,
          header: false
        };
      }
    }
  },
  watch: {
    format: {
      handler (obj) {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          this.$emit('change', obj);
        }, 500);
      },
      deep: true
    },
    formatObj: {
      handler (obj) {
        let format1 = JSON.stringify(obj);
        let format2 = JSON.stringify(this.format);
        if (format1 !== format2) {
          this.format = JSON.parse(JSON.stringify(obj));
          this.$set(this.format, 'encoding', obj.encoding);
          this.quoMarks = this.format.quotechar;
          this.sign = this.format.seq;
          this.lineNum = this.format.startrows;
          this.title = this.format.header ? this.yes : this.no;
          this.thousands = this.format.thousands ? this.yes : this.no;
          this.feed = this.format.wrap ? this.yes : this.no;
        }
      },
      deep: true
    },
    lineNum (val) {
      this.$set(this.format, 'startrows', Number(val));
    },
    feed (val) {
      this.$set(this.format, 'wrap', this.yesNo[val]);
    },
    title (val) {
      this.$set(this.format, 'header', this.yesNo[val]);
    },
    thousands (val) {
      this.$set(this.format, 'thousands', this.yesNo[val]);
    },
    quoMarks (val) {
      this.$set(this.format, 'quotechar', val);
    },
    sign (val) {
      this.$set(this.format, 'seq', val);
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {

  },
  destroyed () {
  },
  methods: {
    changeCode (item) {
      this.$set(this.format, 'encoding', item);
    }
  }
};
</script>

<style scoped lang="scss">
.set-format{
  .format-row{
    padding: 10px 10px 5px;
    text-align: left;
    .row-title{
      font-size: 14px;
      color: #424242;
    }
    .dc-drop{
      margin-left: 20px!important;
      border: 1px solid #dedede!important;
    }
    .row-line{
      font-size: 14px;
      color: #424242;
      padding: 5px 0px 3px;
      display: flex;
      .line-left{
        padding: 0px 5px 0px 0px;
      }
      .line-right{
        .line-title{
          color: #424242;
          margin: 0px 5px;
          display: block;
        }
        .line-num{
          width: 20px;
          line-height: 20px;
          height: 20px;
          text-align: center;
          border: 1px solid #dedede;
          border-radius: 4px;
          color: #cccccc;
          font-size: 14px;
          outline: none;
          margin: 0px 3px;
          display: inline-block;
        }
      }
      .symbol-input{
        outline: none;
        border: none;
        border-bottom: 1px solid #dedede;
        width: 60px;
      }
    }
  }
}
</style>
