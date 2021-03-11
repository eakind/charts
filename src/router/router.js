import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/index';

Vue.use(Router);

let routes = [
  {
    path: '/home',
    name: 'home',
    component: () =>
      import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    children: [{
      path: '/projectlist',
      name: 'projectlist',
      component: () =>
        import(/* webpackChunkName: "home" */ '@/views/projectList.vue')
    }, {
      path: '/drawingboard',
      name: 'drawingboard',
      component: () =>
        import(/* webpackChunkName: "drawingboard" */ '@/views/drawingboard.vue')
    }, {
      path: '/dashboard',
      name: 'dashboard',
      component: () =>
        import(/* webpackChunkName: "dashboard" */ '@/views/dashboard.vue')
    }, {
      path: '/createproject',
      name: 'createproject',
      redirect: { name: 'createprojectname' },
      component: () =>
        import(/* webpackChunkName: "createproject" */ '@/views/createProject.vue'),
      children: [
        {
          path: 'createprojectname',
          name: 'createprojectname',
          component: () =>
            import(/* webpackChunkName: "createprojectname" */ '@/views/createProject/createProjectName.vue')
        }, {
          path: 'createprojectfile',
          name: 'createprojectfile',
          component: () =>
            import(/* webpackChunkName: "createprojectfile" */ '@/views/createProject/createProjectFile.vue')
        }, {
          path: 'createprojectpreview',
          name: 'createprojectpreview',
          component: () =>
            import(/* webpackChunkName: "createprojectpreview" */ '@/views/createProject/createProjectPreview.vue')
        }, {
          path: 'createprojecttype',
          name: 'createprojecttype',
          component: () =>
            import(/* webpackChunkName: "createprojecttype" */ '@/views/createProject/createProjectType.vue')
        }
      ]
    }, {
      path: '/useTemplate',
      name: 'useTemplate',
      component: () =>
        import(/* webpackChunkName: "useTemplate" */ '@/views/useTemplate.vue')
    }, {
      path: '/manualUpdate',
      name: 'manualUpdate',
      component: () =>
        import(/* webpackChunkName: "manualUpdate" */ '@/views/updateData/manualUpdate.vue')
    }]
  }, {
    path: '*',
    redirect: '/projectlist'
  }
];

let router = new Router({
  mode: 'hash',
  routes: routes
});

const pagesNeedProjectId = ['dashboard', 'drawingboard'];

router.beforeEach((to, from, next) => {
  if (pagesNeedProjectId.indexOf(to.name) !== -1) {
    let projectId = store.state.project.projectId;
    if (!projectId) {
      projectId = to.query.aiManager || '';
      store._mutations['project/setProjectId'][0](projectId);
    };
    if (projectId) {
      next();
    } else {
      next({
        path: '/'
      });
    }
  }
  next();
});

router.afterEach(route => {
  if (pagesNeedProjectId.indexOf(route.name) !== -1) {
    let projectId = store.state.project.projectId;
    if (!projectId) {
      projectId = route.query.aiManager || '';
      store._mutations['project/setProjectId'][0](projectId);
    };
    if (!projectId) {
      window.location.href = '/';
    }
  }
});

export default router;
