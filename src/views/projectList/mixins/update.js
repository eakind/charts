/**
 * 项目更新逻辑
 */
import mask from '../directives/update';
import { post } from '@/api/server';
export const updateProject = {
  directives: {
    mask
  },
  data () {
    return {
      updateObj: {
        eleArr: [],
        upgradeTip: '',
        updateType: '',
        updateTitle: '',
        cancel: '',
        upgradeAlert: '',
      }
    };
  },
  created () {
    this.updateObj.eleArr = [
      {
        id: 'manual',
        content: this.$t('projectList.manu_update'),
        tips: this.$t('projectList.replace_tip'),
        className: 'update-up',
        iconName: 'iconfont icon-db10_spanner',
        selectFlag: true
      }
    ];
    this.updateObj.upgradeTip = this.$t('projectList.upgrade_tip');
    this.updateObj.updateType = this.$t('projectList.update_type');
    this.updateObj.updateTitle = this.$t('projectList.update_title');
    this.updateObj.cancel = this.$t('projectList.back');
    this.updateObj.upgradeAlert = this.$t('projectList.upgrade_alert');
  },
  methods: {
    cancelFun (id) {
      this.list.some(i => {
        return (i.project_id === id) && (i.showUpdate = false);
      });
    },
    manual (id) {
      this.$router.push({ path: '/manualUpdate' });
    },
    replace (id, type) {
      if (!type) {
        type = 'REPLACE';
      }
      let item = {};
      this.list.some(i => {
        return (i.project_id === id) && (item = i);
      });
      this.updateHandler(item, type);
    },
    append (id) {
      this.replace(id, 'APPEND');
    },
    /**
     * 更新项目
     */
    async updateHandler (item, mode) {
      let param = {
        project_id: item.project_id,
        mode: mode
      };
      let res = await post('enterProject', param);
      if (res.code === 0) {
        this.setProjectId(item.project_id);
        this.setProjectName(item.project_name);
        this.$router.push({ path: '/createProject/createProjectFile' });
      }
    },
  },
};
