export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './System/Login/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      // 首页
      { path: '/', component: './System',},

      // 系统管理
      {
        path: '/system',
        name: '系统管理',
        icon: 'setting',
        routes: [
          {
            path: '/system/role',
            name: '角色管理',
            icon: '',
            component: './System/Role',
          },
          {
            path: '/system/role/create',
            hideInMenu:true,
            name: '创建角色',
            icon: '',
            component: './System/Role/create',
          },
          {
            path: '/system/user',
            name: '用户管理',
            icon: '',
            component: './System/User',
          },
        ],
      },
      
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        hideInMenu: true,
        hideChildrenInMenu: true,
        hideInBreadcrumb: true,
        routes: [
          {
            path: '/account/settings',
            name: '个人设置',
            component: './System/Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './System/Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './System/Account/Settings/SecurityView',
              }, 
            ],
          },
        ],
      }, 

      {
        component: '404',
      },
    ],
  },
];
