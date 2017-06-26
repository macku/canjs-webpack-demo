import CanMap from 'can-map';
import 'can-map-define';

export default CanMap.extend({
  define: {
    labelOn: {
      type: 'string',
      value: 'On'
    },

    labelOff: {
      type: 'string',
      value: 'Off'
    },

    isDisabled: {
      type: 'boolean',
      value: false
    },

    enabled: {
      type: 'boolean',
      value: true
    }
  },

  toggle() {
    if (this.attr('isDisabled')) {
      return;
    }

    const enabled = !this.attr('enabled');

    this.attr('enabled', enabled);

    this.dispatch('onToggle', [enabled]);
  }
});
