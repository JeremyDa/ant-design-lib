import React from 'react';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import {Exception} from 'antdlib';
import styles from '@/pages/Style/Exception/index.less';

export default () => (
  <Exception
    type="404"
    linkElement={Link}
    desc={formatMessage({ id: 'app.exception.description.404' })}
    backText={formatMessage({ id: 'app.exception.back' })}
    styles={styles}
  />
);
