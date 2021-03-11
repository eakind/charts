<template>
  <div class="save-chart">
    <dc-dialog
      dislogTitle="存为图片"
      contentAlign="left"
      width="410px"
      v-if="isExportChart"
      :dialogVisible="isExportChart"
      @dialogCancel="cancelHandler"
      @dialogSure="sureHandler">
        <div class="content">
          <template v-if="routeName !== 'drawingboard'">
            <div class="tips-title">请选择保持保存的格式</div>
            <div class="tips">如果展板中加入了地图类型画布，请先将缩放比例调整为100%。</div>
          </template>
          <template v-if="routeName === 'drawingboard'">
            <div class="type-name">1.画布保存方式</div>
            <div class="select-box">
              <div class="select-options" :class="all ?'active':''" @click="all=true; errorMsg=''">
                <span class="dot-radio" :class="all ? 'dot-radio-active' : ''">
                  <span span class="dot"></span>
                </span>
                <span>整个画布</span>
              </div>
              <div class="select-options" :class="!all ?'active':''" @click="all=false; errorMsg=''">
                <span class="dot-radio" :class="!all ? 'dot-radio-active' : ''">
                  <span span class="dot"></span>
                </span>
                <span>拆分图表（图表将单独保存）</span>
              </div>
            </div>
          </template>
          <template>
            <div class="type-name"  v-if="routeName === 'drawingboard'">2.保存的格式</div>
            <div class="select-box">
              <div class="select-options" :class="selectFormat === 'jpg' ?'active':''" @click="selectFormat='jpg'">
                <span class="dot-radio" :class="selectFormat === 'jpg' ? 'dot-radio-active' : ''">
                  <span span class="dot"></span>
                </span>
                <span>JPG</span>
              </div>
              <div class="select-options" :class="selectFormat === 'png' ?'active':''" @click="selectFormat='png'">
                <span class="dot-radio" :class="selectFormat === 'png' ? 'dot-radio-active' : ''">
                  <span span class="dot"></span>
                </span>
                <span>PNG（透明背景）</span>
              </div>
            </div>
          </template>
          <div class="error">
            <span>{{errorMsg}}</span>
          </div>
        </div>
      </dc-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DcDialog from '@/components/dcDialog/dcDialog.vue';
export default {
  name: 'SaveChart',
  data () {
    return {
      selectFormat: 'jpg',
      all: true,
      routeName: this.$route.name,
      errorMsg: '',
      downloading: false
    };
  },
  computed: {
    ...mapState({
      locale: state => state.project.locale
    })
  },
  props: {
    isExportChart: {
      type: Boolean,
      default: false
    }
  },
  components: { DcDialog },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
    document.body.style.pointerEvents = 'none';
    this.$el.style.pointerEvents = 'auto';
    this.bus.$on('downloadPNG', (res) => {
      this.downloading = false;
      if (res !== 'done') {
        this.errorMsg = res;
      } else {
        this.cancelHandler();
      }
    });
  },
  destroyed () {
    document.body.style.pointerEvents = 'auto';
  },
  methods: {
    sureHandler () {
      this.errorMsg = this.$t('message.create_pic_ing');
      if (this.downloading) {
        this.errorMsg = this.$t('message.create_pic_ing');
        return;
      }
      this.$emit('cancel', { format: this.selectFormat, all: this.all });
      this.downloading = true;
    },
    cancelHandler () {
      this.$emit('cancel');
      this.errorMsg = '';
    }
  }
};
</script>

<style scoped lang="scss">
.save-chart {
  .content {
    color: #424242;
    font-size: 14px;
    text-align: left;
    .tips-title {
      margin-bottom: 5px;
    }
    .tips {
      color: #A4A4A4;
      font-size: 12px;
    }
    .type-name {
    }
    .select-box {
      padding: 8px 0;
      div {
        margin: 5px 0;
      }
      .tip {
        margin: 0px 10px;
        color: #a4a4a4;
      }
      .select-options {
        height: 40px;
        line-height: 40px;
        background: #ffffff;
        border-radius: 4px;
        margin: 8px 0;
        text-align: left;
        padding: 0 8px;
      }
      .select-options.active {
        background-color: #fff;
        border: 1px solid #4284f5;
      }
      .dot-radio {
        height: 16px;
        width: 16px;
        margin-right: 5px;
        border: 1px solid #a4a4a4;
        border-radius: 50%;
        box-sizing: border-box;
        background-color: white;
        display: inline-block;
        top: 3px;
        position: relative;
      }
      .dot-radio-active {
        border: 1px solid #4284f5;
        background-color: #4284f5;
        .dot {
          height: 6px;
          width: 6px;
          background-color: #fff;
          border-radius: 50%;
          display: inline-block;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    .error {
      span {
        font-size: 12px;
        color: orangered;
      }
    }
  }
}
</style>
