/**
 * @fileoverview Simple module to decorate existing html elements
 * with list item formatting.
 */

define([
  'qowtRoot/utils/listFormatManager',
  'qowtRoot/utils/typeUtils'
  ], function(
  ListFormatManager,
  TypeUtils) {

  'use strict';

  var _api = {

      /**
       * Add a list format entry id attribute to a node.
       * @param elm {HTML Element}
       * @param lfeid {integer} List format entry id.
       */
      setListFormatEntryId: function(elm, lfeid) {
        if (lfeid !== undefined) {
          elm.setAttribute('qowt-entry', lfeid);
        }
      },

      /**
       * Get the list format entry id from a node.
       * @param elm {HTML Element}
       * @return {string}
       */
      getListFormatEntryId: function(elm) {
        return elm.getAttribute('qowt-entry') || undefined;
      },

      /**
       * Remove a list format entry id attribute from a node.
       * @param elm {HTML Element}
       */
      unsetListFormatEntryId: function(elm) {
        elm.removeAttribute('qowt-entry');
      },

      /**
       * Add a list format template id attribute to a node.
       * @param elm {HTML Element}
       * @param lftid {integer} List format template id.
       */
      setListFormatTemplateId: function(elm, lftid) {
        if (lftid !== undefined) {
          elm.setAttribute('qowt-template', lftid);
        }
      },

      /**
       * Get the list format template id from a node.
       * @param elm {HTML Element}
       * @return {string}
       */
      getListFormatTemplateId: function(elm) {
        return elm.getAttribute('qowt-template') || undefined;
      },

      /**
       * Remove a list format template id attribute from a node.
       * @param elm {HTML Element}
       */
      unsetListFormatTemplateId: function(elm) {
        elm.removeAttribute('qowt-template');
      },

      /**
       * Add a list level attribute to a node.
       * @param elm {HTML Element}
       * @param level {integer} The list level.
       */
      setListLevel: function(elm, level) {
        level = level || 0;
        elm.setAttribute('qowt-lvl', level);
      },

      /**
       * Get the list level attribute from a node.
       * @param elm {HTML Element}
       * @return {string}
       */
      getListLevel: function(elm) {
        return elm.getAttribute('qowt-lvl') || undefined;
      },

      /**
       * Remove a list level attribute from a node.
       * @param elm {HTML Element}
       */
      unsetListLevel: function(elm) {
        elm.removeAttribute('qowt-lvl');
      },

      /**
       * Regular Expression to match list format class names
       */
      listRegEx: /qowt-li-(\d+)_(\d)/g,

      /**
       * Construct a CSS style rule name and add to a node.
       * @param elm {HTML Element}
       * @param classname {string} The list format template classname
       */
      setListFormatClass: function(elm, classname) {
        // Remove any previous list format before adding a new one. If not we'd
        // end up with multiple list item class names.
        _api.unsetListFormatClass(elm);
        if (classname) {
          elm.classList.add(classname);
        }
        elm.classList.add('qowt-list'); // Generic list CSS.
      },

      /**
       * Remove a CSS style rule name from a node.
       * @param elm {HTML Element}
       */
      unsetListFormatClass: function(elm) {
        elm.className = elm.className.replace(_api.listRegEx, '');
        // Reset the global regex
        _api.listRegEx.lastIndex = 0;
        elm.classList.remove('qowt-list');
      },

      /**
       * Utility function to get the list format class name
       * from a class name string.
       * @param fromHere {string || HTML Element} If string check for a list
       *        class, if node check the nodes class name.
       * @return {string} The list format class or undefined.
       */
      getListClass: function(fromHere) {
        var classMatches, listClass;
        if (!TypeUtils.isString(fromHere)) {
          fromHere = (fromHere && fromHere.className) ? fromHere.className : '';
        }
        classMatches = fromHere.match(_api.listRegEx);
        // Reset the global regex
        _api.listRegEx.lastIndex = 0;
        if (classMatches && classMatches.length) {
          listClass = classMatches[0];
        }
        return listClass;
      },

      /**
       * Utility function to get the list type
       * from a class name string.
       * @param fromHere {string || HTML Element} If string use directly,
       *        if node use the nodes class name.
       * @return {string} The list type or undefined.
       *                  ENUM('b'|'n')
       *                        b = bulleted list
       *                        n = numbered list
       */
      getListTypeFromClass: function(fromHere) {
        var formatMatches, formatType;
        if (!TypeUtils.isString(fromHere)) {
          fromHere = (fromHere && fromHere.className) ? fromHere.className : '';
        }
        formatMatches = _api.listRegEx.exec(fromHere);
        // Reset the global regex
        _api.listRegEx.lastIndex = 0;
        if (formatMatches && formatMatches.length) {
          formatType = ListFormatManager.getListType(
              formatMatches[1],  // Template ID matched in RegEx
              formatMatches[2]); // List Level matched in RegEx
        }
        return formatType;
      },

      /**
       * Utility function to get the list format information
       * from a class name string.
       * @param fromHere {string || HTML Element} If string use directly,
       *        if node use the nodes class name.
       * @return {object}.entry {string}
       *                 .template {string}
       *                 .level {integer}
       *                 .type ENUM('b'|'n')
       */
      getListFormatInfo: function(fromHere) {
        var formatMatches, listFormatInfo = {};
        if (!TypeUtils.isString(fromHere)) {
          fromHere = (fromHere && fromHere.className) ? fromHere.className : '';
        }
        formatMatches = _api.listRegEx.exec(fromHere);
        // Reset the global regex
        _api.listRegEx.lastIndex = 0;
        if (formatMatches && formatMatches.length) {
          listFormatInfo.entry = ListFormatManager.getEntryId(formatMatches[1]);
          listFormatInfo.template = formatMatches[1];
          listFormatInfo.level = formatMatches[2];
          listFormatInfo.type = ListFormatManager.getListType(
              formatMatches[1],  // Template ID matched in RegEx
              formatMatches[2]); // List Level matched in RegEx
        }
        return listFormatInfo;
      },

      /**
       * Add a list type attribute to a node.
       * @param elm {HTML Element}
       * @param ltype {string} ENUM('b'|'n')
       *                       b = bulleted list
       *                       n = numbered list
       */
      setListType: function(elm, ltype) {
        ltype = ltype || 'b';
        elm.setAttribute('qowt-list-type', ltype);
      },

      /**
       * Remove a list type attribute from a node.
       * @param elm {HTML Element}
       */
      unsetListType: function(elm) {
        elm.removeAttribute('qowt-list-type');
      },

      /**
       * @param elm {HTML Element}
       * @return {string} If the passed node is a list item it will have a list
       * type attribute, the value can be:
       * ENUM('b'|'n'|undefined)
       *       b = bulleted list
       *       n = numbered list
       */
      getListType: function(elm) {
        return elm.getAttribute('qowt-list-type') || undefined;
      },

      /**
       * True if this node is a numbered list item.
       * @param elm {HTML Element}
       * @return {Boolean}
       */
      isNumberedList: function (elm) {
          return (_api.getListType(elm) === 'n' &&
              _api.getListTypeFromClass(elm) === 'n');

      },

      /**
       * True if this node is a bullet list item.
       * @param elm {HTML Element}
       * @return {Boolean}
       */
      isBulletedList: function (elm) {
          return (_api.getListType(elm) === 'b' &&
              _api.getListTypeFromClass(elm) === 'b');
      },

    /**
     * Set the element styling from the provided data.
     * Formatting is set with a mixture of inline styling
     * and css class use.
     *
     * @param elm {HTML Element} The HTML element to decorate.
     * @param props {Object} The data to apply.
     * @see Pronto/src/dcp/schemas/responses/elements/list-item.json
     */
    decorate: function(elm, props) {
      props = props || {};
      var entryId = props.lfeID;
      if (entryId !== undefined) {
        var templateId = ListFormatManager.getTemplateId(entryId),
            listLevel = props.lvl ? props.lvl : 0,
            listType = ListFormatManager.getListType(templateId, listLevel),
            listClassname;
        if (templateId === undefined) {
          templateId = entryId;
        }
        listClassname = ListFormatManager.get(templateId, listLevel);
        _api.setListFormatEntryId(elm, entryId);
        _api.setListFormatTemplateId(elm, templateId);
        _api.setListLevel(elm, listLevel);
        _api.setListFormatClass(elm, listClassname);
        _api.setListType(elm, listType);
      }
    },

    /**
     * Remove list specific styling and attributes.
     * @param elm {HTML Element} The element to un-decorate
     */
    undecorate: function(elm, properties) {
      var removeFormat = !properties ? true :
          (properties.indexOf('lfeID') !== -1)  &&
          (properties.indexOf('lvl') !== -1);
      if (removeFormat) {
        _api.unsetListFormatEntryId(elm);
        _api.unsetListFormatTemplateId(elm);
        _api.unsetListLevel(elm);
        _api.unsetListFormatClass(elm);
        _api.unsetListType(elm);
      }
    }

  };

  return _api;

});
