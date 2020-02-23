import { Avatar, Icon, Menu, Spin, Tag } from 'antd';
import { HeaderDropdown, NoticeIcon,SelectLang } from 'antdlib';
import { connect } from 'dva';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import React, { PureComponent } from 'react';
import router from 'umi/router';
import event from '../../public/event.svg';
import message from '../../public/message.svg';
import notification from '../../public/notification.svg';
import avatar from '../../public/user.png';
import SelectLangStyles from '@/pages/Style/SelectLang/index.less';
import {multiLanguage} from '@/defaultSettings';

class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
    dispatch({
      type: 'content/fetch',
      payload: {
        url:'notice.read',
        id,
      }
    });
  };

  fetchMoreNotices = tabProps => {
    const { list, name } = tabProps;
    const { dispatch, notices = [] } = this.props;
    const lastItemId = notices[notices.length - 1].id;
    dispatch({
      type: 'global/fetchMoreNotices',
      payload: {
        lastItemId,
        type: name,
        offset: list.length,
      },
    });
  };

  handleNoticeVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  handleNoticeClear = type => {
    const { dispatch } = this.props;
    dispatch({
      type: 'content/fetch',
      payload: {
        url:'notice.clear',
        type,
      },
      callback: ()=>{
        message.success('清空完毕');
      }
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'userCenter') {
      router.push('/account/center');
      return;
    }
    if (key === 'triggerError') {
      router.push('/exception/trigger');
      return;
    }
    if (key === 'userinfo') {
      router.push('/account/settings/base');
      return;
    }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  render() {
    const {
      currentUser,
      fetchingMoreNotices,
      fetchingNotices,
      loadedAllNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      skeletonCount,
      theme,
      GlobalHeaderStyles,
      NoticeIconStyles,
      NoticeListStyles,
      HeaderDropdownStyles,

      setting: {navTheme,layout},
    } = this.props;

    const menu = (
      <Menu className={GlobalHeaderStyles.menu} selectedKeys={[]} onClick={this.handleMenuClick}>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          个人设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    const loadMoreProps = {
      skeletonCount,
      loadedAll: loadedAllNotices,
      loading: fetchingMoreNotices,
    };
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    let className = GlobalHeaderStyles.right;
    if (theme === 'dark') {
      className = `${GlobalHeaderStyles.right}  ${GlobalHeaderStyles.dark}`;
    }

    return (
      <div className={className} style={(layout === 'topmenu' && (theme === 'dark' || navTheme ==='dark'))&& {color:'white'} || {}}>
        <NoticeIcon
          className={GlobalHeaderStyles.action}
          count={currentUser.unreadCount}
          onItemClick={(item, tabProps) => {
            console.log(item, tabProps); // eslint-disable-line
            this.changeReadState(item, tabProps);
          }}
          locale={{
            emptyText: '暂无数据',
            clear: '清空',
            loadedAll: '加载完毕',
            loadMore: '加载更多',
          }}
          onClear={this.handleNoticeClear}
          onLoadMore={this.fetchMoreNotices}
          onPopupVisibleChange={this.handleNoticeVisibleChange}
          loading={fetchingNotices}
          clearClose
          NoticeIconStyles={NoticeIconStyles}
          NoticeListStyles={NoticeListStyles}
          HeaderDropdownStyles={HeaderDropdownStyles}
        >
          <NoticeIcon.Tab
            count={unreadMsg.notification}
            list={noticeData.notification}
            title='通知'
            name="notification"
            emptyText='你已查看所有通知'
            emptyImage={notification}
            {...loadMoreProps}
          />
          <NoticeIcon.Tab
            count={unreadMsg.message}
            list={noticeData.message}
            title='消息'
            name="message"
            emptyText='你已读完所有消息'
            emptyImage={message}
            {...loadMoreProps}
          />
          <NoticeIcon.Tab
            count={unreadMsg.event}
            list={noticeData.event}
            title='待办'
            name="event"
            emptyText='你已完成所有待办'
            emptyImage={event}
            {...loadMoreProps}
          />
        </NoticeIcon>
        {currentUser.name ? (
          <HeaderDropdown overlay={menu} HeaderDropdownStyles={HeaderDropdownStyles}>
            <span className={`${GlobalHeaderStyles.action} ${GlobalHeaderStyles.account}`}>
              <Avatar
                size="small"
                className={GlobalHeaderStyles.avatar}
                src={(currentUser.avatar !== 'null' && currentUser.avatar) || avatar}
                alt="avatar"
              />
              <span className={GlobalHeaderStyles.name}>{currentUser.name}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        {multiLanguage && <SelectLang className={GlobalHeaderStyles.action} SelectLangStyles={SelectLangStyles} HeaderDropdownStyles={HeaderDropdownStyles} />}
      </div>
    );
  }
}
export default connect(({ user, global, setting, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  loadedAllNotices: global.loadedAllNotices,
  notices: global.notices,
  setting,
}))(GlobalHeaderRight);