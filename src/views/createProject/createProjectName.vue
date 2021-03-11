<template>
  <div class="dc-create-project-name">
    <div class="content-section">
      <div class="back-box">
        <span class="back-btn" @click="backHandler">{{
          $t("message.return_back")
        }}</span>
      </div>
    </div>
    <div class="dc-name">
      <div class="project-name">
        <span class="body-title">{{ $t("message.project_name") }}</span>
        <div class="body-next" @click="nextStep">
          {{ $t("message.next_step") }}
        </div>
      </div>
      <div class="project-message">
        <p class="body-message">{{ $t("message.standard_name_tip") }}</p>
      </div>
      <div class="project-input">
        <input
          class="body-input"
          ref="inputRef"
          v-model="newProjectName"
          :placeholder="$t('message.set_name')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  data () {
    return {
      newProjectName: null,
      projectNameTip: '请检查项目名称。',
      showTip: false,
    };
  },
  mounted () {
    this.setIsPreview(false);
  },
  methods: {
    ...mapMutations('project', [
      'setIsPreview',
      'setProjectName',
    ]),
    nextStep () {
      let nameLength = this.getByteLen(this.newProjectName);
      if (this.newProjectName && nameLength < 61) {
        this.setProjectName(this.newProjectName);
        this.$router.push({
          path: '/createProject/createProjectFile',
        });
      } else {
        this.$createMassage(this.$t('message.check_projectname'));
      }
    },
    getByteLen: function (val) {
      if (val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
          var a = val.charAt(i);
          // eslint-disable-next-line no-control-regex
          if (a.match(/[^\x00-\xff]/gi) != null) {
            len += 2;
          } else {
            len += 1;
          }
        }
        return len;
      }
    },
    backHandler () {
      this.$router.push({ path: '/' });
    },
  },
};
</script>

<style scoped lang="scss">
.dc-create-project-name {
  width: 100%;
  display: flex;
  flex: 1;
  .content-section {
    width: 260px;
    height: 100%;
    background: #FBFCFF;
    padding: 25px;
    box-sizing: border-box;
    .back-btn {
      font-size: 16px;
      color: #424242;
      display: block;
      width: 280px;
      cursor: pointer;
      box-sizing: border-box;
      &::before {
        content: "";
        height: 10px;
        width: 10px;
        border-top: 2px solid #4284F5;
        border-left: 2px solid #4284F5;
        transform: rotate(-45deg);
        display: inline-block;
      }
    }
  }
  .dc-name {
    background: #FFFFFF;
    border-radius: 4px;
    margin: 0 8px 8px;
    padding: 16px;
    width: 100%;
    .project-name {
      width: calc(100% - 40px);
      height: 40px;
      position: relative;
      box-sizing: content-box;
      background: #E7EBF2;
      border-radius: 4px;
      font-size: 16px;
      color: #424242;
      line-height: 40px;
      padding-left: 8px;
      .body-next {
        position: absolute;
        top: 0;
        right: 0;
        width: 120px;
        height: 40px;
        background: #4284F5;
        border-radius: 4px;
        font-size: 16px;
        color: #FFFFFF;
        text-align: center;
        cursor: pointer;
      }
    }
    .project-message {
      .body-message {
        font-size: 12px;
        color: #A4A4A4;
        line-height: 24px;
        margin: 8px 0;
      }
    }
    .project-input {
      .body-input {
        width: 560px;
        height: 40px;
        border: 1px solid #DEDEDE;
        border-radius: 4px;
        padding: 9px 10px;
        box-sizing: border-box;
        &::-webkit-input-placeholder {
          font-size: 16px;
          color: #CCCCCC;
          letter-spacing: 0;
        }
      }
    }
    .project-tip {
      width: 240px;
      height: 36px;
      background: #FFE8E8;
      border-radius: 4px;
      font-size: 12px;
      color: #424242;
      letter-spacing: 0;
      position: fixed;
      top: 70px;
      left: 50%;
      transform: translateX(-50%);
      line-height: 36px;
      .icon {
        width: 16px;
        fill: #e6585c;
        vertical-align: middle;
        margin: 0 10px 2px;
      }
      .icon-db_plus {
        color: #A4A4A4;
        cursor: pointer;
        position: absolute;
        right: 12px;
        transform: rotate(45deg);
        display: inline-block;
      }
    }
  }
}
</style>
