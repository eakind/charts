<template>
  <div class="shape-box">
    <div class="title-box flex">
      <div class="title">{{title}}</div>
      <div class="edit-box" @click="isShowEdit=!isShowEdit">{{$t('dashboard.edit')}}</div>
    </div>
    <div class="select-box flex">
      <template v-for="item in iconList">
        <div :key="item.value" class="icon-box">
          <span class="iconfont"
                :class="item.icon"
                @click.stop="iconSelectProcess(item)"></span>
        </div>
      </template>
    </div>
    <shape-alert v-if="isShowEdit" :iconList="iconList" :shapeList="shapeList"
                @confirm="confirmHandler"
                @cancel="cancelHandler"></shape-alert>
  </div>
</template>
<script>
import ShapeAlert from '../chartStyle/shapeAlert.vue';
export default {
  props: {
    title: {
      type: String,
      default: '柱状图案'
    },
    shapeList: {
      type: Array
    }
  },
  components: {
    ShapeAlert
  },
  data () {
    return {
      isShowEdit: false,
      iconList: [
        {
          name: 'fill',
          icon: 'fill',
          value: 'fill'
        },
        {
          name: 'icon-ver-fill',
          icon: 'icon-db_ovalsingle',
          value: 'shu'
        },
        {
          name: 'icon-hor-fill',
          icon: 'icon-db_ovalsingle iconfont_90deg',
          value: 'heng'
        },
        {
          name: 'icon-left-fill',
          icon: 'icon-db_ovalsingle iconfont_45deg',
          value: 'zuo'
        },
        {
          name: 'icon-right-fill',
          icon: 'icon-db_ovalsingle iconfont_135deg',
          value: 'you'
        },
        {
          name: 'empty',
          icon: 'empty',
          value: 'empty'
        },
        {
          name: 'icon-center-fill',
          icon: 'icon-db_ovalcross',
          value: 'ge'
        },
        {
          name: 'icon-cross-fill',
          icon: 'icon-db_ovalcross iconfont_135deg',
          value: 'zha'
        },

      ]
    };
  },
  methods: {
    iconSelectProcess (item) {
      let list = JSON.parse(JSON.stringify(this.shapeList));
      for (let i = 0; i < list.length; i++) {
        for (let key in list[i].patternList) {
          list[i].patternList[key] = item.value;
        }
      }
      this.$emit('changeShape', list);
    },
    confirmHandler (list) {
      this.$emit('changeShape', list);
      this.isShowEdit = false;
    },
    cancelHandler () {
      this.isShowEdit = false;
    }
  }
};
</script>
<style lang="scss" >
@import "./style/shape";
</style>
<style lang="scss" scoped>
*{
    box-sizing: border-box;;
}
.title {
  font-size: 12px;
  color: #4284f5;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.edit-box {
  background: #4284f5;
  border-radius: 4px;
  width: 64px;
//   height: 28px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
  padding: 4px 0;
  font-size: 12px;
}
.icon-box{
    width: 30px;
    height: 30px;;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    margin-right: 8px;
}
.select-box{
    justify-content: space-around;
    flex-wrap: wrap;
    margin: 8px 0;
}
.iconfont{
  display: inline-block;
}
</style>
