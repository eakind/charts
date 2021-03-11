<template>
  <div class="many-users" ref="many-users" :style="wrapperStyle">
    <div class="title" v-if="cssStyle.showTitle">
      <span class="circle" :style="{ background: userInfo.color }"></span>
      <span class="user-type">{{ userInfo.type }}</span>
      <span class="user-info">{{ userInfo.info }}</span>
    </div>
    <div class="user-list">
      <template v-if="userList.length > 0">
        <div class="user-list" v-for="(list, key) in userList" :key="key">
          <one-user
            :width="userInfo.width"
            :height="userInfo.height"
            :list="list"
            :key="list.itemId"
          :clickEnable="clickEnable"
          @selected="selected"
        ></one-user>
        <div class="remove" v-if="cssStyle.showRemove" @click="remove(list)">
          <div class="remove-block">
            <span class="iconfont icon-db_plus"></span>
          </div>
        </div>
        </div>
      </template>
      <div
        class="no-user"
        v-if="userList.length === 0"
        :style="userInfo.warningStyle"
      >
        {{ userInfo.warning }}
      </div>
    </div>
  </div>
</template>

<script>
import oneUser from './oneUser.vue';
export default {
  components: {
    oneUser,
  },
  props: {
    userList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    userInfo: {
      type: Object,
      default: function () {
        return {
          color: '#ffffff',
          info: '',
          type: '',
          width: 232,
          height: 32,
          warning: '',
          warningStyle: {},
        };
      },
    },
    cssStyle: {
      type: Object,
      default: function () {
        return {
          width: 200,
          height: 30,
          background: '#ffffff',
          showTitle: false,
          showRemove: false,
        };
      },
    },
    clickEnable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    wrapperStyle () {
      return {
        width: isNaN(this.cssStyle.width)
          ? this.cssStyle.width
          : this.cssStyle.width + 'px',
        height: isNaN(this.cssStyle.height)
          ? this.cssStyle.height
          : this.cssStyle.height + 'px',
        background: this.cssStyle.background,
      };
    },
    textStyle () {
      return {
        lineHeight: isNaN(this.userInfo.height)
          ? this.userInfo.height
          : this.userInfo.height + 'px',
      };
    },
  },
  methods: {
    remove (list) {
      this.$emit('remove', list, this.userInfo.type);
    },
    selected (list, status) {
      this.$emit('selected', list, status);
    },
  },
};
</script>

<style scoped lang='scss'>
.many-users {
  border-radius: 4px;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;
  padding: 6px 8px 0 8px;

  &::-webkit-scrollbar {
    width: 6px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #ddd;
  }

  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background-color: transparent;
  }

  .title {
    margin-bottom: 5px;
    .circle {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 10px;
    }

    .user-type {
      font-size: 14px;
      font-weight: bold;
      margin-right: 10px;
      color: #424242;
    }

    .user-info {
      font-size: 12px;
      color: #666666;
    }
  }

  .user-list {
    .user-list {
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      .remove {
        margin-left: 16px;
        cursor: pointer;

        .iconfont {
          margin-right: 2px;
          color: red;
          transform: rotateZ(45deg);
        }

        .text {
          font-size: 14px;
          color: #424242;
        }
        .remove-block {
          width: 24px;
          height: 24px;
          background: #FFF;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .no-user {
      width: 304px;
      border: 1px dotted #a4a4a4;
      border-radius: 4px;
      font-size: 12px;
      color: #A4A4A4;
      line-height: 32px;
      box-sizing: border-box;
      padding-left: 10px;
    }
  }
}
</style>
