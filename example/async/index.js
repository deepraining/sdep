import $ from 'jquery';

import './index.css';

export default () => {
  $('body').prepend('<h1 class="async">async</h1>');
};
