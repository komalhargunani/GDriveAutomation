define([], function() {

  'use strict';

  var api_ = {
    // TODO(elqursh): Consider changing the two methods bellow to a getter and
    // a setter.
    /**
     * Sets the paragraph shadow :before selector.
     * @param {Object.<string>} style CSS rule represented as an property map.
     */
    setBulletStyle: function(style) {
      if (style) {
        this.bulletStyleRule = style;
        var styleString = this.getRuleAsString_(style);
        this.customStyle['--bullet-style'] = styleString;
        this.updateStyles();
      }
    },

    /**
     * Gets the paragraph shadow :before selector.
     * @return {Object.<string>} CSS rule properties.
     */
    getBulletStyle: function() {
      if (!this.bulletStyleRule) {
        this.bulletStyleRule = {};
      }
      return this.bulletStyleRule;
    },

    getRuleAsString_: function(properties) {
      var ruleString = '';
      for (var i in properties) {
        ruleString += i + ':' + properties[i] + ';';
      }
      return ruleString;
    },

    /**
     * Sets the paragraph shadow :before selector for auto numbered bullet.
     * @param {Object.<string>} style CSS rule represented as an property map.
     */
    setAutoBulletStyle: function(style) {
      if (style) {
        this.bulletAutoStyleRule = style;
        var styleString = this.getRuleAsString_(style);
        this.customStyle['--auto-bullet-style'] = styleString;
        this.updateStyles();
      }
    },

    /**
     * Gets the paragraph shadow :before selector for auto numbered bullets.
     * @return {Object.<string>} CSS rule properties.
     */
    getAutoBulletStyle: function() {
      if (!this.bulletAutoStyleRule) {
        this.bulletAutoStyleRule = {};
      }
      return this.bulletAutoStyleRule;
    },

    /**
     * Sets the paragraph shadow :before selector for properties which follows
     * text.
     * @param {Object.<string>} style CSS rule represented as an property map.
     */
    setFollowStyle: function(style) {
      if (style) {
        this.bulletColorStyleRule = style;
        var styleString = this.getRuleAsString_(style);
        this.customStyle['--follow-bullet-style'] = styleString;
        this.updateStyles();
      }
    },

    /**
     * Gets the paragraph shadow :before selector for properties which follows
     * text
     * @return {Object.<string>} CSS rule properties.
     */
    getFollowStyle: function() {
      if (!this.bulletColorStyleRule) {
        this.bulletColorStyleRule = {};
      }
      return this.bulletColorStyleRule;
    }
  };

  return api_;
});
