/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Field Decorator is responsible for decorating HTML nodes
 * with appropriate field information (class and attributes).
 * Intended to be used for all fields like hyperlink, pageNumbers, dateTime..
 *
 * Example of usage:
 * To decorate the HTML element as field of type hyperlink:
 * FieldDecorator.decorate(node, {type: 'hyperlink'});
 *
 * To verify if the HTML element is decorated as field of type hyperlink:
 * var verify = FieldDecorator.verifyField(node, {type: 'hyperlink'});
 *
 * To undecorate the HTML node as field of type hyperlink:
 * FieldDecorator.undecorate(node, {type: 'hyperlink'});
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define(['qowtRoot/utils/typeUtils'], function(TypeUtils) {

  'use strict';

  var _api = {

    /**
     * Adorn the element with the appropriate field data.
     *
     * @param {HTML Element} elm The HTML element to decorate.
     * @param {Object} config configuration object.
     *                 config.type type of the field.
     */
    decorate: function(elm, config) {
      _validateInput(elm, config);
      _fieldTypeOps[config.type].decorate(elm);
    },

    /**
     * Verify if the element is decorated with the appropriate field data.
     *
     * @param {HTML Element} elm The html element to decorate.
     * @param {Object} config configuration object.
     *                 config.type type of the field.
     * @return {Boolean} true if it is decorated, false otherwise.
     */
    verify: function(elm, config) {
      _validateInput(elm, config);
      return _fieldTypeOps[config.type].verify(elm);
    },

    /**
     * Undecorates the element for the field data.
     *
     * @param {HTML Element} elm The HTML element to decorate.
     * @param {Object} config configuration object.
     *                 config.type type of the field.
     */
    undecorate: function(elm, config) {
      _validateInput(elm, config);
      _fieldTypeOps[config.type].undecorate(elm);
    }
  };

  function _validateInput(elm, config) {
    if (TypeUtils.isUndefined(elm) || !TypeUtils.isNode(elm)) {
      throw new Error('fieldDecorator invalid element passed');
    }
    if (!config || !config.type || !_fieldTypeOps[config.type]) {
      throw new Error('fieldDecorator invalid config passed');
    }
  }

  var _fieldTypeOps = {
    hyperlink: {
      decorate: _decorateHyperlink,
      verify: _verifyHyperlink,
      undecorate: _undecorateHyperlink
    }
  };

  var _kQowtDivtype = 'qowt-divtype';
  var _kHyperlinkDivtype = 'qowt-field-hyperlink';
  var _kQowtField = 'qowt-field';

  function _decorateHyperlink(elm) {
    elm.setAttribute('contenteditable', false);
    elm.setAttribute(_kQowtDivtype, _kHyperlinkDivtype);
    elm.classList.add(_kQowtField);
    elm.classList.add(_kHyperlinkDivtype);
  }

  function _verifyHyperlink(elm) {
    return elm.getAttribute && elm.classList.contains(_kQowtField) &&
        elm.classList.contains(_kHyperlinkDivtype) &&
        (elm.getAttribute(_kQowtDivtype) === _kHyperlinkDivtype);
  }

  function _undecorateHyperlink(elm) {
    elm.removeAttribute('contenteditable');
    elm.removeAttribute(_kQowtDivtype);
    elm.classList.remove(_kQowtField);
    elm.classList.remove(_kHyperlinkDivtype);
  }

  return _api;
});
