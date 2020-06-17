import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from '/Users/Jeremy/project/ant-design-lib/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/user',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__UserLayout" */ '../../layouts/UserLayout'),
          LoadingComponent: require('/Users/Jeremy/project/ant-design-lib/src/layouts/PageLoading')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
        exact: true,
      },
      {
        path: '/user/login',
        name: 'login',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__System__Login__Login" */ '../System/Login/Login'),
              LoadingComponent: require('/Users/Jeremy/project/ant-design-lib/src/layouts/PageLoading')
                .default,
            })
          : require('../System/Login/Login').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/Jeremy/project/ant-design-lib/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__BasicLayout" */ '../../layouts/BasicLayout'),
          LoadingComponent: require('/Users/Jeremy/project/ant-design-lib/src/layouts/PageLoading')
            .default,
        })
      : require('../../layouts/BasicLayout').default,
    routes: [
      {
        path: '/',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__System" */ '../System'),
              LoadingComponent: require('/Users/Jeremy/project/ant-design-lib/src/layouts/PageLoading')
                .default,
            })
          : require('../System').default,
        exact: true,
      },
      {
        path: '/system',
        name: '系统管理',
        icon: 'setting',
        routes: [
          {
            path: '/system/role',
            name: '角色管理',
            icon: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__System__Role" */ '../System/Role'),
                  LoadingComponent: require('/Users/Jeremy/project/ant-design-lib/src/layouts/PageLoading')
                    .default,
                })
              : require('../System/Role').default,
            exact: true,
          },
          {
            path: '/system/role/create',
            hideInMenu: true,
            name: '创建角色',
            icon: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__System__Role__create" */ '../System/Role/create'),
                  LoadingComponent: require('/Users/Jeremy/project/ant-design-lib/src/layouts/PageLoading')
                    .default,
                })
              : require('../System/Role/create').default,
            exact: true,
          },
          {
            path: '/system/user',
            name: '用户管理',
            icon: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__System__User" */ '../System/User'),
                  LoadingComponent: require('/Users/Jeremy/project/ant-design-lib/src/layouts/PageLoading')
                    .default,
                })
              : require('../System/User').default,
            exact: true,
          },
          {
            path: '/system/websocket',
            name: 'websocket',
            icon: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__System__Websocket__index" */ '../System/Websocket/index'),
                  LoadingComponent: require('/Users/Jeremy/project/ant-design-lib/src/layouts/PageLoading')
                    .default,
                })
              : require('../System/Websocket/index').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/Jeremy/project/ant-design-lib/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
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
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__System__Account__Settings__Info" */ '../System/Account/Settings/Info'),
                  LoadingComponent: require('/Users/Jeremy/project/ant-design-lib/src/layouts/PageLoading')
                    .default,
                })
              : require('../System/Account/Settings/Info').default,
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
                exact: true,
              },
              {
                path: '/account/settings/base',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "p__System__Account__Settings__Info" */ '../System/Account/Settings/BaseView'),
                      LoadingComponent: require('/Users/Jeremy/project/ant-design-lib/src/layouts/PageLoading')
                        .default,
                    })
                  : require('../System/Account/Settings/BaseView').default,
                exact: true,
              },
              {
                path: '/account/settings/security',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "p__System__Account__Settings__Info" */ '../System/Account/Settings/SecurityView'),
                      LoadingComponent: require('/Users/Jeremy/project/ant-design-lib/src/layouts/PageLoading')
                        .default,
                    })
                  : require('../System/Account/Settings/SecurityView').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/Jeremy/project/ant-design-lib/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            component: () =>
              React.createElement(
                require('/Users/Jeremy/project/ant-design-lib/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__404" */ '../404'),
              LoadingComponent: require('/Users/Jeremy/project/ant-design-lib/src/layouts/PageLoading')
                .default,
            })
          : require('../404').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/Jeremy/project/ant-design-lib/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: () =>
      React.createElement(
        require('/Users/Jeremy/project/ant-design-lib/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
