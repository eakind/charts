<template>
  <div class="dc-alert" :style="{ zIndex: zIndex }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {};
  },
  props: {
    enabled: {
      type: Boolean,
    },
    appendToBody: Boolean,
    zIndex: {
      type: [Number, String],
      default: 10000,
    },
  },
  watch: {
    enabled (val) {
      if (!this.enabled) {
        document.body.style.pointerEvents = 'none';
        this.$el.style.pointerEvents = 'auto';
      } else {
        document.body.style.pointerEvents = 'auto';
        this.$el.style.pointerEvents = 'none';
      }
    },
  },
  mounted () {
    if (!this.enabled) {
      document.body.style.pointerEvents = 'none';
      this.$el.style.pointerEvents = 'auto';
    }
    if (this.appendToBody) {
      this.moveToBody();
    }
  },
  destroyed () {
    document.body.style.pointerEvents = 'auto';
    if (
      this.appendToBody &&
      [...document.body.children].indexOf(this.$el) !== -1
    ) {
      document.body.removeChild(this.$el);
    }
  },
  methods: {
    moveToBody () {
      const content = this.$el;
      const body = document.body;
      // eslint-disable-next-line no-unused-expressions
      content.parentNode?.removeChild(content);
      body.appendChild(content);
    },
  },
};
</script>

<style scoped lang="scss">
.dc-alert {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 220px;
  min-height: 100px;
  color: black;
  // z-index: 10000;
  box-shadow: 0 24px 56px 0 rgba(0, 0, 0, 0.1), 0 4px 14px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  user-select: none;
  background-color:#fff;// #f6f6f6;
  .dc-alert-header {
    text-align: center;
    padding: 8px;
  }
  .dc-alert-body {
    padding: 8px;
    input {
      border-radius: 4px;
      height: 30px;
      line-height: 30px;
      outline: none;
      width: 240px;
      margin-left: 10px;
      border: 1px solid #666666;
    }
  }
  .dc-alert-footer {
    padding: 8px;
    text-align: center;
    button {
      width: 120px;
      height: 30px;
      line-height: 3px;
      border-radius: 25px;
      border: 1px solid #666666;
      background-color: white;
      margin: 0px 40px;
      outline: none;
      cursor: pointer;
    }
    .dc-alert-confirm {
      color: white;
      border: 1px solid #4284f5;
      background-color: #4284f5;
    }
    .dc-alert-cancel {
      color: #666666;
    }
  }
}
</style>
