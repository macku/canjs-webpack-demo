import Component from 'can-component';

import ViewModel from './toggle.viewModel';
import template from './toggle.stache';
import './toggle.less';

const Toggle = Component.extend({
  tag: 'btn-toggle',
  viewModel: ViewModel,
  template
});

export default Toggle;
