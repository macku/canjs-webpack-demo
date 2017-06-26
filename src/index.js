import $ from 'jquery';
import CanMap from 'can-map';
import 'normalize.css';

import template from './template.stache';
import './components/toggle/toggle';

import './less/styles.less';

const map = new CanMap({
  widget: true,
  changeValue: (vm) => {
    vm.attr('widget', !vm.attr('widget'));
  }
});

$('#root').html(template(map));
