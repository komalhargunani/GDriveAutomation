/**
 * @fileoverview Manage list formats and their application to content
 * in the HTML DOM.
 *
 * Deals with the data in the getListFormats command response.
 * A list format has "Entries".
 * An entry points at a "Template"
 * An entry can potentially hold override data for that template.
 * A template holds list level information.
 * There can be up to nine levels of list information.
 * This list information contains paragraph and text formatting along with
 * list item specific information.
 *
 * There should exist a "default" for each type of list (Bullet, Number)
 * at each level, 0 to 8.
 * Currently the default is specified in the template schema for simplicity.
 *
 * In MSWord the bullet character or string is actually part of the paragraph
 * it pushes the first line to the right, therefore the remainder of the
 * paragraph has a hanging indent added to realign the left edge of the text.
 * Therefore, the bullet position is calculated as the paragraph left indent
 * minus the paragraph hanging indent value.
 * Note: because hanging indent is used to locate the bullet character,
 * it is not possible for a list item to have a hanging indent in MSWord.
 * In QOWT we absolutely position the bullet character relative to the
 * left of the paragraph element using the hanging hanging indent value.
 *
 * TODO: We may need to move the default flag to the list level information
 * schema if we see bugs with defaults not matching MSWord rendering, this will
 * be apparent if we see a single template that contain information for both
 * Bulleted and Numbered lists at different levels.
 *
 * TODO: This manager has some inherent knowledge of DCP because of the way
 * the data is nested in different elements but there is only a single
 * DCP handler for list formats. We should try to either reconfigure the DCP
 * or the QOWT code so that this manager does not need to know anything
 * about the DCP or its structure.
 *
 * See Schemas:
 * html-office/pronto/src/dcp/schemas/responses/elements/
 * list-format-entry.json
 * html-office/pronto/src/dcp/schemas/responses/elements/
 * list-format-template.json
 * html-office/pronto/src/dcp/schemas/responses/elements/
 * list-format-information.json
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/utils/listFormatManager-utils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/cssManager'], function(
  Utils,
  PubSub,
  CssManager) {

  'use strict';

  var _disableToken, _initFormatsResetToken;

  var _api = {

    /**
     * Initialise the list format manager.
     * Must be run before this manager can be used.
     *
     */
    init: function() {
      if (_initFormatsResetToken) {
        throw new Error('listFormatManager.init() called multiple times.');
      }
      _initFormatsResetToken =
        PubSub.subscribe('qowt:getListFormats', _initFormats.bind(this));

      _disableToken = PubSub.subscribe('qowt:disable', _api.destroy);
    },

    /**
     * Destroy all references.
     *
     */
    destroy: function() {
      PubSub.unsubscribe(_disableToken);
      _disableToken = undefined;
      PubSub.unsubscribe(_initFormatsResetToken);
      _initFormatsResetToken = undefined;
    },

    /**
     * Reset the list of managed styles; used mainly by unit tests.
     */
    reset: function () {
      _FI = {
        entryToTemplate: {},
        templateToEntry: {},
        templateData: {},
        classnames: {},
        defaultTemplates: {
          'b': undefined,
          'n': undefined
        },
        compiledCss: []
      };
    },

    /**
     * Add an entry-template ID mapping.
     * @param entry {string} The entry ID.
     * @param template {string} The template ID.
     */
    addIds: function(entry, template) {
      _FI.entryToTemplate[entry] = template;
      _FI.templateToEntry[template] = entry;
      _FI.templateData[template] = {};
      _FI.classnames[template] = {};
    },

    /**
     * Mark a template ID as the default format for a specific list type.
     * @param template {string} The template ID.
     * @param defaultType {string} The list type this template is default for.
     */
    setDefault: function(template, defaultType) {
      if (defaultType) {
        if (defaultType === 'bulleted') {
          if (_FI.defaultTemplates.b !== undefined) {
            Utils.listFormatDataError('List Format Corruption Detected: ' +
              'Multiple defaults for bulleted list template: ' +
              _FI.defaultTemplates.b + ' ' + template);
          }
          _FI.defaultTemplates.b = template;
        }
        if (defaultType === 'numbered') {
          if (_FI.defaultTemplates.n !== undefined) {
            Utils.listFormatDataError('List Format Corruption Detected: ' +
              'Multiple defaults for numbered list template: ' +
              _FI.defaultTemplates.n + ' ' + template);
          }
          _FI.defaultTemplates.n = template;
        }
      }
    },

    /**
     * Store the template data locally and then compile the list template
     * information and store that.
     * @param templateId {string} The template ID.
     * @param level {integer} The level this data is for.
     * @param templateDcp {object} See comment in file overview and schemas.
     */
    addTemplateData: function(templateId, templateDcp) {
      templateDcp = templateDcp || {};
      var entryId = _FI.templateToEntry[templateId],
          thisLevel = parseInt(templateDcp.level, 10);
      if (Utils.validateTemplateData(_FI, entryId, templateId, thisLevel)) {
        _FI.templateData[templateId][thisLevel] = templateDcp;
      }
    },

    /**
     * Get the template ID for a particular entry ID.
     * @param entryId {string}
     * @return {string} The template ID or undefined.
     */
    getTemplateId: function(entryId) {
      return _FI.entryToTemplate.hasOwnProperty(entryId) ?
          _FI.entryToTemplate[entryId] : undefined;
    },

    /**
     * Get the entry ID for a particular template ID.
     * @param templateId {string}
     * @return {string} The entry ID or undefined.
     */
    getEntryId: function(templateId) {
      return _FI.templateToEntry.hasOwnProperty(templateId) ?
          _FI.templateToEntry[templateId] : undefined;
    },

    /**
     * Get a CSS rule name to apply to an element from an ID.
     * In some documents the EntryID is the same as the TemplateID, so in this
     * lookup we match against the Template and then the Entry, this may allow
     * us to render corrupt list formats correctly in some instances.
     * @param listId {string} The list format ID, could be Entry or Template.
     * @param level {integer} The list level, 0 to 8, defaults to 0.
     * @return {string} The CSS rule name or empty string if there is no match.
     */
    get: function(listId, level) {
      level = level || 0;
      var classname = '';
      if (_FI.classnames.hasOwnProperty(listId)) {
        if (_FI.classnames[listId].hasOwnProperty(level)) {
          classname = _FI.classnames[listId][level];
        }
      } else if (_FI.entryToTemplate.hasOwnProperty(listId)) {
        var templateId = _FI.entryToTemplate[listId];
        if (_FI.classnames.hasOwnProperty(templateId)) {
          if (_FI.classnames[templateId].hasOwnProperty(level)) {
            classname = _FI.classnames[templateId][level];
          }
        }
      }
      return classname;
    },

    /**
     * Get a list type from an ID.
     * @param template {string} The template ID.
     * @param level {integer} The list level, 0 to 8, defaults to 0.
     * @return {string} The list type from this template at this level.
     *                  ENUM(b|n|undefined)
     */
    getListType: function(template, level) {
      level = level || 0;
      var listType;
      if (_FI.templateData &&
          _FI.templateData.hasOwnProperty(template) &&
          _FI.templateData[template].hasOwnProperty(level)) {
        listType = _FI.templateData[template][level].bulleted ? 'b' : 'n';
      }
      return listType;
    },

    /**
     * Get the classname, template and entry ID for the default format for a
     * particular list.
     * @param listType {string} The type of list from ENUM(b|n) defaults to b.
     * @param level {integer} The list level, 0 to 8, defaults to 0.
     * @return {object}.classname {string} The list format CSS rule name.
     *                 .entryId {string} The list format Entry ID.
     *                 .templateId {string} The list format Template ID.
     *                 .level {integer} The list format level.
     */
    getDefaultInfo: function(listType, level) {
      level = level || 0;
      var defaultInfo = {
        'classname': _api.get(_FI.defaultTemplates[listType], level),
        'entryId': _api.getEntryId(_FI.defaultTemplates[listType]),
        'templateId': _FI.defaultTemplates[listType],
        'level': level
      };
      return defaultInfo;
    }

  };

  // PRIVATE ===================================================================

  /**
   * The Format Information Object,
   * this provides a single object in which all the list format information
   * is stored so that it is easy to pass between functions as a single
   * parameter, all compiled data is added into this object.
   */
  var _FI = {
    entryToTemplate: {},    // Maps the EntryID to the TemplateID
    templateToEntry: {},    // Maps the TemplateID to the EntryID
    /**
     * Note: We have to use an object in the following two storage objects
     * rather than an array because we cannot guarantee that the list format
     * info objects in the DCP will be in level order.
     */
    templateData: {},       // Stores the level information by TemplateID
    classnames: {}, // Stores the level CSS rule name by TemplateID
    defaultTemplates: {
      'b': undefined,       // Default template for bulleted items
      'n': undefined        // Default template for numbered items
    },
    compiledCss: []         // Stores the CSS data to write
  };

  /**
   * Loop through all 0 to 8 levels of all the templates and compile
   * the CSS rules for list rendering.
   */
  function _compileListFormats() {
    var templates = Object.keys(_FI.templateToEntry),
        fi, ft = templates.length, li,
        entryId, templateId, templateDcp, thisLevel,
        metricsNode = document.createElement('div');
    // This node will contain all created nodes for measurements
    metricsNode.id = 'qowt-listFormatManager-metrics';
    for (fi = 0; fi < ft; fi++) {
      templateId = templates[fi];
      entryId = _FI.templateToEntry[templateId];
      for (li = 0; li < 9; li++) {
        thisLevel = li;
        templateDcp = _FI.templateData[templateId][thisLevel];
        if (templateDcp) {
          // First generate all the data
          Utils.compileTemplateData(_FI, templateDcp,
              entryId, templateId, thisLevel);
          // Add measurement nodes to the metric container
          var lvltxtNode =
            Utils.makeLvltxtNode(templateDcp, entryId, thisLevel),
              binNode = Utils.makeBinNode(templateDcp, entryId, thisLevel);
          metricsNode.appendChild(lvltxtNode);
          metricsNode.appendChild(binNode);
        } else {
          Utils.listFormatDataError('List Format Corruption Detected: No ' +
            'template data at level ' + thisLevel + ' for entry ' + entryId);
        }
      }
    }
    // Add the metric node to the DOM so that measurements can be taken
    document.body.appendChild(metricsNode);
    for (fi = 0; fi < ft; fi++) {
      templateId = templates[fi];
      entryId = _FI.templateToEntry[templateId];
      for (li = 0; li < 9; li++) {
        thisLevel = li;
        templateDcp = _FI.templateData[templateId][thisLevel];
        if (templateDcp) {
          // Get the measurements from the metrics Node
          Utils.gatherMetrics(templateDcp, entryId, thisLevel);
          // Now compile the CSS rules
          Utils.compileMainListCss(_FI, templateDcp);
          Utils.compileCounterCss(_FI, templateDcp, entryId, thisLevel);
          Utils.compileBeforeCss(_FI, templateDcp);
        }
      }
    }
    // Remove the metrics node
    document.body.removeChild(metricsNode);
  }

  /**
   * Once all the list formats have been processed, write out any CSS rules
   * that we need to render the list items.
   */
  function _writeListFormatStyles() {
    // If a paragraph has list formatting it should take its indent values
    // from the list format and not apply any indentation form any style.
    // Since the style CSS rule has already been compiled we add an extra
    // style rule that resets the indents values of lists, the order of the
    // rules is important here, this rule has to come after the style rule
    // but before the list format rule.
    CssManager.addRule('#qowt-msdoc p.qowt-list', Utils.compileIndentsCss());
    CssManager.addRule('#qowt-msdoc', Utils.compileCountersInitCss(_FI));
    var i, j = _FI.compiledCss.length;
    for (i = 0; i < j; i++) {
      CssManager.addRule(_FI.compiledCss[i][0], _FI.compiledCss[i][1]);
    }
    // Flush the CSS manager cache to write all remaining rules. This prevents
    // any CSS rules being written out after any possible content has
    // been rendered, and a possible cause of FOUT.
    CssManager.flushCache();
  }

  /**
   * Handler function that runs once we know that all the list formats
   * have been received from the Core and added to this manager.
   * This signal is published by the onSuccess of the getListFormats command.
   * @param signal {string} The received signal name.
   * @param signalData {object} Contextual data.
   */
  var _initFormats = function(signal, signalData) {
    if (signal === 'qowt:getListFormats' && signalData.success) {
      if (_FI.defaultTemplates.b === undefined) {
        Utils.listFormatDataError('List Format Corruption Detected: No ' +
          'default bulleted list template set');
      }
      if (_FI.defaultTemplates.n === undefined) {
        Utils.listFormatDataError('List Format Corruption Detected: No ' +
          'default numbered list template set');
      }
      _compileListFormats();
      _writeListFormatStyles();
    }
  };

  return _api;

});
