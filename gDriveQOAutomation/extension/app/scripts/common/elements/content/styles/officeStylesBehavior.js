define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/cssCache',
  'qowtRoot/utils/fontManager',
  'qowtRoot/utils/style/styleResolver',
  'qowtRoot/utils/typeUtils',
  'common/elements/text/para/word/wordPara',
  'common/elements/text/run/word/wordRun'
], function(
    PubSub,
    CssCache,
    FontManager,
    StyleResolver,
    TypeUtils
    /* QowtWordPara, */
    /* QowtWordRun */) {

  'use strict';

  var officeStylesBehavior = {
    /**
     * Callback called when an instance of the element is created.
     * @public
     */
    created: function() {
      /**
       * Internal container for all office styles.
       * Map of office styles.
       * style id (as key)  -> style object (as value)
       * @private {Object<string, Object>}
       */
      this.styles_ = {};
    },

    /**
     * Add a new style to the container.
     * Uses the style id as the key, if a style with the same id exists
     * the style is overwritten by the new style.
     * @param {object} style style object being added.
     * @param {string} style.id The style unique identifier.
     * @param {string} style.type The type of this style
     *                            (like: char, par, table..).
     * @param {string} style.name The style name used for display.
     *                            May be empty string.
     * @param {string} style.basedOn The id of the style (if any) that this
     *                               style inherits from. (could be empty)
     * @param {boolean} style.isDefault True if it is the default style.
     * @param {object|undefined} style.rpr character run properties.
     * @param {object|undefined} style.ppr paragraph properties.
     * @public
     */
    add: function(style) {
      if (!style) {
        throw new Error('officeStyles.add() could not add invalid style');
      }
      if (!style.id || !style.type) {
        var message =
            'officeStyles.add() invalid style missing id or type. ' +
            JSON.stringify(style);
        throw new Error(message);
      }
      this.styles_[style.id] = style;
    },

    /**
     * Returns true the if the specified style id exists.
     * @param {string} id The style identifier to lookup.
     * @return true is the style id exists, false otherwise.
     * @public
     */
    hasStyle: function(id) {
      var style = this.getStyle(id);
      return style ? true : false;
    },

    /**
     * Returns the style for the specified style id.
     *
     * @param {string} id The style identifier to lookup.
     * @param {object|undefined} The style for the given style id.
     * @public
     */
    getStyle: function(id) {
      var style = this.styles_[id];
      return style;
    },

    /**
     * Returns the style display name for the specified style id.
     * @param {string} id The style identifier to lookup.
     * @return {string|undefined} The style name for the given style id.
     * @public
     */
    getName: function(id) {
      var name, style = this.getStyle(id);
      if (style) {
        name =  style.name;
      }
      return name;
    },

    /**
     * Returns the css classname that represents this style
     * @param {string} id The style identifier to lookup.
     * @return {string|undefined} The css class name for the given style id.
     * @public
     */
    getCssClassName: function(id) {
      return this.formatClassName_(id);
    },

    /**
     * Returns the style id for the specified style name.
     * @param {string} name The style name to lookup.
     * @return {string|undefined} The style name for the given style id.
     * @public
     */
    getId: function(name) {
      var id, style;
      for (id in this.styles_) {
        style = this.styles_[id];
        if (style && style.name && style.name === name) {
          break;
        }
      }
      return id;
    },

    /**
     * Returns the type of the style for the specified style id.
     * @param {string} id The style identifier to lookup.
     * @return {string|undefined} The style type for the given style id.
     * @public
     */
    getType: function(id) {
      var type, style = this.getStyle(id);
      if (style) {
        type =  style.type;
      }
      return type;
    },

    /**
     * Returns the formatting properties for the specified style id.
     * @param {string} id The style identifier to lookup.
     * @returns {object} formatting object for the specified style.
     *                   formatting.rpr text run properties.
     *                   formatting.ppr paragraph properties.
     * @public
     */
    getFormatting: function(id) {
      var formatting = {}, style = this.getStyle(id);
      if (style) {
        formatting.rpr = style.rpr;
        formatting.ppr = style.ppr;
      }
      return formatting;
    },

    /**
     * Returns the resolved formatting properties for the specified style id.
     * The style properties are resolved by tracing the style inheritance
     * using the StyleResolver.
     * @see StyleResolver
     * @param {string} id The style identifier to lookup.
     * @returns {object} formatting object for the specified style.
     *                   formatting.rpr text run properties.
     *                   formatting.ppr paragraph properties.
     * @public
     */
    getResolvedFormatting: function(id) {
      var formatting = {}, style = this.getStyle(id);
      if (style && style.resolved) {
        formatting.rpr = style.resolved.rpr;
        formatting.ppr = style.resolved.ppr;
      }
      return formatting;
    },

    /**
     * Returns the identifier of the default style for the specified type.
     * If no default style is present, returns undefined.
     * @param {string} opt_type The style type that you want the default for.
     *                          Defaults to 'par'(paragraph) style type.
     * @return {string|undefined} The required default style id for the
     *                              specified style type.
     * @public
     */
    getDefaultStyleId: function(opt_type) {
      var defaultStyleId;
      opt_type = opt_type || 'par';
      for (var id in this.styles_) {
        var style = this.styles_[id];
        if (style && style.isDefault && (style.type === opt_type)) {
          defaultStyleId = style.id;
          break;
        }
      }
      return defaultStyleId;
    },

    /**
     * Returns the name of the default style for the specified type.
     * If no default style is present, returns undefined.
     * @param {string} opt_type The style type that you want the default for.
     *                          Defaults to 'paragraph' styles.
     * @see /pronto/src/dcp/schemas/model/elements/word/style.json
     * @return {string|undefined} The required default style name.
     * @public
     */
    getDefaultStyleName: function(opt_type) {
      var defaultStyleName,
          defaultStyleId = this.getDefaultStyleId(opt_type);
      if (defaultStyleId) {
        defaultStyleName = this.getName(defaultStyleId);
      }
      return defaultStyleName;
    },

    /**
     * Returns a list of all style names stored.
     * All styles are returned without any filtering, or ordering.
     * There can be styles with no display names and/or duplicated display names
     * It's up to the client to filter the list for their own purposes.
     * @param {Function} opt_filter An optional filter to accept or skip
     *                              each style by returning true or false.
     *                              If no filter is given then all style names
     *                              are retrieved.
     * @returns {array} Unordered list of managed style names.
     * @public
     */
    getStyleNames: function(opt_filter) {
      var list = [];
      for (var id in this.styles_) {
        var style = this.styles_[id];
        if (!opt_filter ||
            (TypeUtils.isFunction(opt_filter) && opt_filter(style))) {
          list.push(style.name);
        }
      }
      return list;
    },

    /**
     * Returns true if a style contains a flag
     * to enable contextual paragraph spacing.
     * @param {string} id The style identifier to lookup.
     * @return {boolean} true if the contextual paragraph spacing flag
     *                        is present, false otherwise.
     * @public
     */
    styleUsesContextualSpacing: function(id) {
      var style = this.getStyle(id);
      if (style && style.ppr && style.ppr.contextualSpacing) {
        return true;
      }
      return false;
    },

    /**
     * Iterate over every style object and call the callback passed in.
     * @param {Object} callback function called on every style object.
     * @public
     */
    forEach: function(callback, opt_thisArg) {
      opt_thisArg = opt_thisArg || this;
      for (var id in this.styles_) {
        var style = this.styles_[id];
        if (callback && TypeUtils.isFunction(callback)) {
          callback.call(opt_thisArg, style);
        }
      }
    },

    /**
     * Returns all CSS rules.
     * @public
     * @return {String} CSS rules string.
     */
    getCssRules: function() {
      return this.textContent;
    },

    /**
     * Resolves the style hierarchy and then writes all style definitions
     * to CSS rules.
     * PubSubs styleListUpdate once the CSS rules have been written.
     * @public
     */
    writeStyles: function() {
      this.resolveAllStyles_();
      this.writeAllStyles_();
      PubSub.publish('qowt:styleListUpdate');
    },

    /**
     * Resets the internal state of the element.
     * @public
     */
    reset: function() {
      this.styles_ = {};
      this.textContent = '';
    },

    // ---------------------PRIVATE----------------------

    kStylePrefix_: 'qowt-stl-',
    kSpacePlaceholder_: '#space#',

    /**
     * Get the cssText for a corresponding style object.
     * Uses a dummy div element to be decorated with the style
     * formatting properties and the cssText is returned.
     * @param {object} style object.
     * @returns {string} The CSS text for the specified style object.
     * @private
     */
    getCssForStyle_: function(style) {
      // Decorate dummy elements and decorate them with this style
      // then collect their combined cssText
      // NOTE: we make sure to *synchronously* decorate the element via
      // the true argument. This is to ensure we can retrieve the cssText
      // within this JS task. Otherwise, the decorate would only update
      // the model, and the css would update in a next micro task!
      var dummyPara = new QowtWordPara();
      dummyPara.decorate(style.resolved.ppr, true);

      // Note: synchronous decorate == true
      var dummyRun = new QowtWordRun();
      dummyRun.decorate(style.resolved.rpr, true);

      // The text decorator will have set the font for this style
      // as a cssClassName on the element. We need the actual font-family
      // in order to ensure the css text of our dummy div can be set,
      // so we set the font family manually inline on our dummy div.
      if (style.resolved.rpr && style.resolved.rpr.font) {
        dummyRun.style.fontFamily = FontManager.family(style.resolved.rpr.font);
      }
      return dummyPara.style.cssText + dummyRun.style.cssText;
    },

    /**
     * Iterate over each style and resolve/flatten the style tracing
     * the inheritance hierarchy.
     * @see StyleResolver.
     * @private
     */
     resolveAllStyles_: function() {
       this.forEach(function(style) {
         StyleResolver.resolve(style);
       });
     },

     /**
      * Prefix the style with 'qowt-stl' to generate a usable css class.
      *
      * @param {string} styleId The style identifier to lookup.
      * @return CSS class name string specific to the style id.
      */
     formatClassName_: function(styleId) {
       var className = this.kStylePrefix_ + styleId;
       return className.split(' ').join(this.kSpacePlaceholder_);
     },

    /**
     * Write all style definitions to CSS rules.
     * This is invoked only once, when all the style primitives have been added
     * to the element.
     * @see add()
     * @private
     */
    writeAllStyles_: function() {
      var cssText, that = this, cssCache = new CssCache();
      this.forEach(function(style) {
        cssText = that.getCssForStyle_(style);

        // Only write the rule if it has valid formatting.
        if (cssText) {
          if (style.type === 'defaults') {
            // Make sure document defaults are written out first
            // and applied to all paragraphs.
            cssCache.addRule('.qowt-root p', cssText);
          }
          if ((style.type === 'par') && style.isDefault) {
            // Apply the default paragraph style to all paragraph elements
            // that do not have an explicit style.
            cssCache.addRule(
                '.qowt-root p:not([class*=' + this.kStylePrefix_ + '])',
                cssText);
          }
          // Write out the style rule.
          cssCache.addRule(
              '.qowt-root .' + this.formatClassName_(style.id),
              cssText);
        }
      }, this);
      var allCssRules = cssCache.getAllRules();
      this.innerText = allCssRules;
    }
  };

  // Behaviors have to be defined on the global object
  window.OfficeStylesBehavior = officeStylesBehavior;

  return {};
});
