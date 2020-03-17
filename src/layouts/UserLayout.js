import { Icon, Button } from 'antd';
import { getPageTitle,GlobalFooter,SelectLang,notification,ajax } from 'antdlib';

import { connect } from 'dva';
import React, { Component, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import GlobalFooterStyles from '@/pages/Style/GlobalFooter/index.less';
import styles from '@/pages/Style/BasicLayout/UserLayout.less';
import logo from '../../public/logo.png';
import { menu, title } from '../defaultSettings';
import SelectLangStyles from '@/pages/Style/SelectLang/index.less';
import HeaderDropdownStyles from '@/pages/Style/HeaderDropdown/index.less';
import {multiLanguage} from '@/defaultSettings';
import { domain } from '@/domain';

const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: '',
  },
  {
    key: 'privacy',
    title: formatMessage({ id: 'layout.user.link.privacy' }),
    href: '',
  },
  {
    key: 'terms',
    title: formatMessage({ id: 'layout.user.link.terms' }),
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2020 江苏国光信息产业股份有限公司
  </Fragment>
);

class UserLayout extends Component {

  componentDidMount() {

    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });

    this.getVersion();
  }

  getVersion = () => {
    ajax({
      fullUrl: `${domain}/version.newest`,
    },
    ()=>{
      const { newest } = this.props.content;
      if(localStorage.getItem('version') !== newest){
        this.upgrade(newest);
      }
    }
    );
  }

  upgrade = (newest) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.close(key);
          window.location.reload(true);
          localStorage.setItem('version',newest);
        }}
      >
        {formatMessage({ id: 'app.pwa.serviceworker.updated.ok' })}
      </Button>
    );
    notification.open({
      message: formatMessage({ id: 'app.pwa.serviceworker.updated' }),
      description: formatMessage({ id: 'app.pwa.serviceworker.updated.hint' }),
      btn,
      key,
      onClose: async () => {},
    });
  }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap,menu,title)}>
        <div className={styles.container}>
          
          <div className={styles.lang}>
            {multiLanguage && <SelectLang SelectLangStyles={SelectLangStyles} HeaderDropdownStyles={HeaderDropdownStyles} />} 
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>{title}</span>
                </Link>
              </div>
              <div className={styles.desc} />
            </div>
            {children}
          </div>
          <GlobalFooter links={undefined} GlobalFooterStyles={GlobalFooterStyles} />
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel, content }) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  content,
}))(UserLayout);
