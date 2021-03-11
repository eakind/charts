<template>
  <div class="dc-collapse-item"  :class="{ 'is-active': isActive }">
    <div
      class="item-header"
      @click="handleClick('header')"
      v-show="!transform || (transform && !isActive)"
    >
      <slot name="header">
        <i class="item-header__arrow iconfont icon-db_arrow"></i>
        <slot name="title">{{ title }}</slot>
      </slot>
      <span
        class="checked"
        v-if="hasChecked"
        @click.stop="$emit('checked-change', !checked)"
      >
        <dc-checked :active="checked"></dc-checked>
        <span class="check-label" v-if="checkedLabel">{{ checkedLabel }}</span>
      </span>
    </div>
    <div class="item-wrap" ref="wrapRef" v-show="isActive">
      <div class="item-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
import DcChecked from '@/components/dcchecked/dcChecked.vue';
export default {
  name: 'DcCollapseItem',
  componentName: 'DcCollapseItem',
  components: {
    DcChecked,
  },
  props: {
    title: String,
    name: {
      type: [String, Number],
      default () {
        return this._uid;
      },
    },
    hasChecked: {
      type: Boolean,
      default () {
        return false;
      },
    },
    checked: {
      type: Boolean,
      default () {
        return false;
      },
    },
    checkedLabel: {
      type: String,
      default () {
        return '';
      },
    },
    hasOpen: {
      type: Boolean,
      default () {
        return true;
      },
    },
  },
  computed: {
    collapseParent () {
      let parent = this.$parent;
      while (
        parent.$options._componentTag !== 'dc-collapse' &&
        parent.$parent
      ) {
        parent = parent.$parent;
      }
      return parent;
    },
    isActive () {
      return this.collapseParent.activeNames.indexOf(this.name) > -1;
    },
    transform () {
      let parent = this.findParentComponentByName('DcCollapse');
      return parent && parent.transform;
    },
    remain () {
      let parent = this.findParentComponentByName('DcCollapse');
      return parent && parent.remain;
    },
    closable () {
      let parent = this.findParentComponentByName('DcCollapse');
      return parent && parent.closable;
    },
  },
  methods: {
    handleClick (block) {
      if (!this.hasOpen) return;
      let expandQuantity = this.collapseParent.activeNames.length; // 展开数量
      if (
        this.remain &&
        expandQuantity >= this.remain &&
        this.isActive &&
        !this.closable
      ) { return; }
      this.dispatch('DcCollapse', 'item-click', this);
    },
    dispatch (componentName, eventName, params) {
      let parent = this.findParentComponentByName(componentName);
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    findParentComponentByName (componentName) {
      let parent = this.collapseParent || this.$root;
      let name = parent.$options.componentName;
      while (parent && (!name || name !== componentName)) {
        parent = parent.collapseParent;
        if (parent) {
          name = parent.$options.componentName;
        }
      }
      return parent;
    },
  },
};
</script>

<style lang="scss" scoped>
.dc-collapse-item {
  border-bottom: 1px solid #e1e1e1;
  .item-header {
    padding-left: 9px;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: #424242;
    cursor: pointer;
    position: relative;
  }
  .checked {
    top: 10px;
    right: 10px;
    position: absolute;
    display: flex;
  }
  .check-label {
    top: -8px;
    margin-left: 5px;
    position: relative;
  }
  .item-header__arrow {
    margin-right: 8px;
    display: inline-block;
    color: #a4a4a4;
    transform: rotate(0deg);
    transition: transform 0.3s, top 0.3s;
  }
  .item-wrap {
    overflow-y: auto;
    max-height: calc(100% - 36px);
    box-sizing: border-box;
  }
  .item-content {
    padding: 0 8px;
    font-size: 12px;
    color: #424242;
    line-height: 1.769230769230769;
  }

  @media screen and (max-width: 3000px) and (min-width: 1980px) {
    .item-content {
      max-height: 750px;
    }
  }

   @media screen and (max-width: 1920px) and (min-width: 1440px)  {
    .item-content {
      max-height: 780px;
    }
  }
    @media screen and (max-width: 1440px) and (min-width: 1380px)  {
    .item-content {
      max-height: 480px;
    }
  }
    @media screen and (max-width: 1380px) {
    .item-wrap {
      max-height: 300px;
    }
  }

  &.is-active {
    .item-header__arrow {
      top: 6px;
      transform: rotate(90deg);
    }
  }
  &:last-child {
    border-bottom: none;
  }
}
</style>
