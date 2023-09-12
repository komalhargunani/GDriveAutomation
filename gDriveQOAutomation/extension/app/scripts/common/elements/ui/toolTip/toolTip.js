define([
  'qowtRoot/utils/converters/caseConverter',
  'qowtRoot/utils/i18n'
], function(
    CaseConverter,
    I18n) {

  'use strict';

  var tooltipProto = {
    is: 'qowt-tool-tip',


    /**
     * Displays the toolTip for given configurations
     *
     * @param {Object} config - Tooltip configurations
     * @param {String=} config.toolTipAlignment - Tooltip alignment WRT host.
     *     Optional, defaults to 'center'
     *     left - tooltip will be left aligned WRT host
     *     center - tooltip will be center aligned WRT host
     * @param {ClientRect} config.dimensions - Client rect(DOM rect) of host
     */
    show: function(config) {
      var toolTipAlignment = config.toolTipAlignment ?
          config.toolTipAlignment : 'center';
      var hostDimensions = config.dimensions;
      this.setText_(config);
      var toolTipDimensions = this.getBoundingClientRect();
      if (toolTipAlignment === 'left') {
        this.style.left = hostDimensions.left + 'px';
      } else if (toolTipAlignment === 'center') {
        this.style.left = (hostDimensions.left -
            ((toolTipDimensions.width - hostDimensions.width) / 2)) + 'px';
      }

      this.customStyle['--left-pos']  = (hostDimensions.left + (
          hostDimensions.width / 2)) + 'px;';
      this.customStyle['--top-pos'] = hostDimensions.bottom + 'px;';

      this.style.top = hostDimensions.bottom + 'px';
      this.style.visibility = 'visible';
      this.updateStyles();
    },

    /**
     * Hides the current toolTip displayed before.
     */
    hide: function() {
      this.style.visibility = 'hidden';
    },

    /**
     * Set tooltip text
     * @param {Object} config - The configuration containing textual derivation
     *     keys
     * @param {String} config.name - A key used to fetch I18n string. The lookup
     *     in I18n string table is done by prefixing name with 'tooltip_'. So
     *     make sure you have correct entry in I18n string table.
     * @param {String=} config.shortCut - Shortcut associated with host, if any.
     *     Optional, defaults to empty string.
     * @private
     */
    setText_: function(config) {
      var shortCut = config.shortCut ? ' (' + config.shortCut + ')' : '';

      if(config.isFileSavedAtLocation) {
        /**
         * We donot need any camel case change in case of showing saved file
         * location in notification area.
         */
        this.textContent = config.name;
      } else {
         /**
          * config.name is button name and is camel cased letter whereas the
          * keys in _locale/en/messages.json are underscore separated hence the
          * following conversion
          */
          var keyName = CaseConverter.camelCase2_(config.name);
          this.textContent = I18n.getMessage('tooltip_' + keyName) + shortCut;
      }
    }
  };

  window.QowtToolTip = Polymer(tooltipProto);
  return {};
});
