import { connect } from 'dva';
import React from 'react';
import Media from 'react-media';
import router from 'umi/router';
import {BasicLayoutComponent} from 'antdlib';
import defaultSettings from '@/defaultSettings';
import BasicLayoutStyles from '@/pages/Style/BasicLayout/BasicLayout.less';
import ChildrenTabsStyles from '@/pages/Style/ChildrenTabs/index.less';
import GlobalFooterStyles from '@/pages/Style/GlobalFooter/index.less';
import GlobalHeaderStyles from '@/pages/Style/GlobalHeader/index.less';
import HeaderDropdownStyles from '@/pages/Style/HeaderDropdown/index.less';
import HeaderSearchStyles from '@/pages/Style/HeaderSearch/index.less';
import NoticeIconStyles from '@/pages/Style/NoticeIcon/index.less';
import NoticeListStyles from '@/pages/Style/NoticeIcon/NoticeList.less';
import SettingDrawerStyles from '@/pages/Style/SettingDrawer/index.less';
import SettingDrawerThemeColorStyles from '@/pages/Style/SettingDrawer/ThemeColor.less';
import SiderMenuStyles from '@/pages/Style/SiderMenu/index.less';
import TopNavHeaderStyles from '@/pages/Style/TopNavHeader/index.less';
import logo from '../../public/logo.png';
import user from '../../public/user.png';
import notification from '../../public/notification.svg';
import message from '../../public/message.svg';
import event from '../../public/event.svg';
import RightContent from './RightContent';
import dark from '../../public/dark.svg';
import light from '../../public/light.svg';
import sidemenu from '../../public/sidemenu.svg';
import topmenu from '../../public/topmenu.svg';

class BasicLayout extends React.Component {
  componentDidMount() {
    const {
      dispatch,
      route,
      route: {
        authority,
      },
    } = this.props;

    if((!defaultSettings.navMode || defaultSettings.navMode !== 'index') && process.env.NODE_ENV === 'production'){
      if (!localStorage.getItem('menu')) {
        router.push('/user/login');
        return;
      }
    }

    const { routes } =
    ((!defaultSettings.navMode || defaultSettings.navMode !== 'index') && process.env.NODE_ENV === 'production')
        ? JSON.parse(localStorage.getItem('menu'))[0]
        : 
        route;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
  }

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  render() {
    const {
      navTheme,
      layout,
      children,
      location,
      isMobile,
      menuData,
      breadcrumbNameMap,
      route,
      fixedHeader,
      pageTabs = 'route',
      proRootPath,
      originalMenuData,
    } = this.props;

    return (
      <BasicLayoutComponent
        logo={logo}
        user={user}
        notification={notification}
        message={message}
        event={event}
        location={location}
        route={route}
        breadcrumbNameMap={breadcrumbNameMap}
        defaultSettings={defaultSettings}
        navTheme={navTheme}
        layout={layout}
        isMobile={isMobile}
        menuData={menuData}
        fixedHeader={fixedHeader}
        pageTabs={pageTabs}
        proRootPath={proRootPath}
        originalMenuData={originalMenuData}
        childrenTabPane={children}

        handleMenuCollapse={(collapsed)=>this.handleMenuCollapse(collapsed)}
        collapsed={this.props.collapsed}


        GlobalFooterStyles={GlobalFooterStyles}
        ChildrenTabsStyles={ChildrenTabsStyles}
        GlobalHeaderStyles={GlobalHeaderStyles}
        HeaderDropdownStyles={HeaderDropdownStyles}
        HeaderSearchStyles={HeaderSearchStyles}
        NoticeIconStyles={NoticeIconStyles}
        NoticeListStyles={NoticeListStyles}
        SettingDrawerStyles={SettingDrawerStyles}
        SettingDrawerThemeColorStyles={SettingDrawerThemeColorStyles}
        SiderMenuStyles={SiderMenuStyles}
        TopNavHeaderStyles={TopNavHeaderStyles}
        BasicLayoutStyles={BasicLayoutStyles}

        dark={dark}
        light={light}
        sidemenu={sidemenu}
        topmenu={topmenu}
      >
        <RightContent 
          GlobalFooterStyles={GlobalFooterStyles}
          ChildrenTabsStyles={ChildrenTabsStyles}
          GlobalHeaderStyles={GlobalHeaderStyles}
          HeaderDropdownStyles={HeaderDropdownStyles}
          HeaderSearchStyles={HeaderSearchStyles}
          NoticeIconStyles={NoticeIconStyles}
          NoticeListStyles={NoticeListStyles}
          SettingDrawerStyles={SettingDrawerStyles}
          SettingDrawerThemeColorStyles={SettingDrawerThemeColorStyles}
          SiderMenuStyles={SiderMenuStyles}
          TopNavHeaderStyles={TopNavHeaderStyles}
          BasicLayoutStyles={BasicLayoutStyles}
        />
      </BasicLayoutComponent>
    );
  }
}

export default connect(({ global, setting, menu: menuModel }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  ...setting,
  originalMenuData: menuModel.originalMenuData,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
