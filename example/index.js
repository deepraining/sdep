import './css/css.css';
import './css/scss.scss';
import './css/less.less';

import './jsx.jsx';

console.log('index');

import('./async').then(({ default: asyncm }) => {
  asyncm();
});
