import { ajax, getPageTitle, GlobalFooter, SelectLang } from 'antdlib';
import { connect } from 'dva';
import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import { multiLanguage } from '@/defaultSettings';
import { domain } from '@/domain';
import styles from '@/pages/Style/BasicLayout/UserLayout.less';
import GlobalFooterStyles from '@/pages/Style/GlobalFooter/index.less';
import HeaderDropdownStyles from '@/pages/Style/HeaderDropdown/index.less';
import SelectLangStyles from '@/pages/Style/SelectLang/index.less';
import logo from '../../public/logo.png';
import { menu, title } from '../defaultSettings';


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
    });
  }

  upgrade = (newest) => {
    window.location.reload(true);
    localStorage.setItem('version',newest);
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
