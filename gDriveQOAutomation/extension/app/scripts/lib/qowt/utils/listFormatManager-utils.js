/**
 * @fileoverview Factored out utility functions for the listFormatManager.
 * These utils process and validate list format data, and compile CSS
 * classnames, selectors and rules using that data, which are written out
 * to the DOM by the listFormatManager and used to style paragraph
 * elements with list formatting.
 * Having these functions in a separate file makes the listFormatManager
 * cleaner and more readable, also it allows them to be unit tested.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/utils/fontManager'], function(
  FontManager) {

  'use strict';

  var _api = {

    /**
     * Validate list format information from DCP.
     * @param {object} data
     * @param {integer} entry
     * @param {integer} template
     * @param {integer} level
     * @return {boolean}
     */
    validateTemplateData: function(data, entry, template, level) {
      var valid = true;
      if (template === undefined || template === null || template === '') {
        _api.listFormatDataError('List Format Corruption Detected: Attempted ' +
          'to add undefined template ID');
        valid = false;
      }
      if (entry === undefined || entry === null || entry === '') {
        _api.listFormatDataError('List Format Corruption Detected: No entry ' +
          'ID for template ID ' + template);
        valid = false;
      }
      if (!data.templateToEntry.hasOwnProperty(template)) {
        _api.listFormatDataError('List Format Corruption Detected: Unknown ' +
          'template ID ' + template);
        valid = false;
      }
      if (isNaN(level) ||
          (level < 0) ||
          (level > 8)) {
        _api.listFormatDataError('List Format Corruption Detected: Invalid ' +
          'level ' + level + ' for template ' + template);
        valid = false;
      }
      if (data.templateData[template] &&
          data.templateData[template].hasOwnProperty(level)) {
        _api.listFormatDataError('List Format Corruption Detected: Already ' +
          'processed template ' + template + ' at level ' + level);
        valid = false;
      }
      return valid;
    },

    /**
     * Do something if there is something wrong with the template data.
     * For now just raising a console warning, this might need to be an
     * exception or something else at a later date.
     * @param {string} msg
     */
    listFormatDataError: function(msg) {
      console.warn(msg);
    },

    /**
     * Construct the CSS classname for a list format.
     * @param {integer} template
     * @param {integer} level
     * @return {string}
     */
    makeClassName: function(template, level) {
      return 'qowt-li-' + template + '_' + level;
    },

    /**
     * Construct the CSS style rule name for a list format.
     * @param {integer} template
     * @param {integer} level
     * @param {boolean} excludeWidows
     * @return {string}
     */
    makeStyleName: function(template, level, excludeWidows) {
      // widow elements do not have an ID, only the FlowStart element has that
      return '#qowt-msdoc p.qowt-li-' + template + '_' + level +
             (excludeWidows ? '[id]' : '');
    },

    /**
     * Return a paragraph formatting property object after removing
     * any indentation properties.
     * @param {object} ppr
     * @return {object}
     */
    stripParagraphIndents: function(ppr) {
      var pprKeys = Object.keys(ppr),
          newPpr = {};
      pprKeys.forEach(function(key) {
        switch (key) {
          case 'fli':
          case 'hin':
          case 'lin':
          case 'rin':
            // Do not copy indent values.
            break;
          default:
            newPpr[key] = ppr[key];
            break;
        }
      });
      return newPpr;
    },

    /**
     * Replace format specifiers in the list item lvltxt attribute with the
     * correct CSS counter labels. CSS counters are zero indexed, format
     * specifiers are not, hence %1 should be replaced with lc-entryId-0
     * @param {object} data
     * @param {integer} entry
     * @param {integer} template
     * @param {string} lvltxt
     * @return {string}
     */
    formatLvlTxt: function(data, entry, template, lvltxt) {
      var li, newtxt = '"' + lvltxt + '"';
      for (li = 0; li <= 8; li++) {
        newtxt = newtxt.replace("%" + (li + 1),
          '" counter(lc-' + entry + '-' + li + ', ' +
          _api.getNumFormatForLevel(data, template, li) + ') "');
      }
      return newtxt;
    },

    /**
     * Return the number format from a specific template for one level.
     * @param {object} data
     * @param {integer} template
     * @param {integer} level
     * @return {string}
     */
    getNumFormatForLevel: function(data, template, level) {
      var templateDcp;
      if (data.templateData.hasOwnProperty(template) &&
          data.templateData[template].hasOwnProperty(level)) {
        templateDcp = data.templateData[template][level];
        return (templateDcp.numformat ? templateDcp.numformat : 'decimal');
      } else {
        return 'decimal';
      }
    },

    /**
     * Return the list start at value from a specific template for one level.
     * StartAt value is not required in DCP, the default is 1.
     * @param {object} data
     * @param {integer} template
     * @param {integer} level
     * @return {integer}
     */
    getStartAtForLevel: function(data, template, level) {
      var templateDcp, startVal = 1;
      if (data.templateData.hasOwnProperty(template) &&
          data.templateData[template].hasOwnProperty(level)) {
        templateDcp = data.templateData[template][level];
        startVal = (templateDcp.hasOwnProperty('startat') ?
                    templateDcp.startat : 1);
      }
      // Subtract 1 from the startAt value so that the first list item
      // increments the counter to the correct start value.
      return startVal - 1;
    },

    /**
     * Make a dummy node that contains lvltxt string,
     * can be used to get measurements if added to the DOM.
     * @param {object} dcp
     * @param {integer} entry
     * @param {integer} level
     * @return {HTML Element}
     */
    makeLvltxtNode: function(dcp, entry, level) {
      var testNode = new QowtWordRun();
      var testText = dcp.correctedLvlTxt;
      var li;
      for (li = 0; li <= 8; li++) {
        // Replace counter place-holders with 3 'w' chars,
        // so that we can be sure we support lists that count
        // up to 999 without the list marker overlapping content.
        testText = testText.replace('%' + (li + 1), 'www');
      }
      // Have to make sure it is rendered in the correct format
      testNode.decorate(dcp.rpr, true);
      testNode.id = 'qowt-lvltxt-' + entry + '-' + level;
      testNode.style.margin = 0;
      testNode.style.padding = 0;
      testNode.textContent = testText;
      return testNode;
    },

    /**
     * Make a dummy node that is the width of the bullet indent,
     * can be used to get measurements if added to the DOM.
     * @param {object} dcp
     * @param {integer} entry
     * @param {integer} level
     * @return {HTML Element}
     */
    makeBinNode: function(dcp, entry, level) {
      var testNode = document.createElement('div'),
          bulletIndent = dcp.ppr.hin || -dcp.ppr.fli || 18;
      testNode.id = 'qowt-bin-' + entry + '-' + level;
      testNode.style.margin = 0;
      testNode.style.padding = 0;
      testNode.style.width = bulletIndent + 'pt';
      return testNode;
    },

    /**
     * Get the width of any lvltxt and bin nodes and store in the DCP object.
     * @param {object} dcp
     * @param {integer} entry
     * @param {integer} level
     */
    gatherMetrics: function(dcp, entry, level) {
      var ltxNode, binNode;
      ltxNode = document.getElementById('qowt-lvltxt-' + entry + '-' + level);
      binNode = document.getElementById('qowt-bin-' + entry + '-' + level);
      if (ltxNode) {
        dcp.lvltxtNodeMetrics = ltxNode.getBoundingClientRect();
      }
      if (binNode) {
        dcp.binNodeMetrics = binNode.getBoundingClientRect();
      }
    },

    /**
     * Compile the generic list CSS rule.
     * @return {string}
     */
    compileIndentsCss: function() {
      return 'text-indent:0;' + // Reset first line & hanging indent.
             'margin-left:0;padding-left:0;'; // Reset left indent.
    },

    /**
     * Compile the CSS rule that controls the main list element.
     * @param {object} data
     * @param {object} dcp
     */
    compileMainListCss: function(data, dcp) {
      var leftIndent = dcp.ppr.lin;
      if (leftIndent === undefined) {
        leftIndent = '0;';
      } else {
        leftIndent += 'pt;';
      }
      data.compiledCss.push([
          dcp.nameWithWidows,
          "position:relative;" +
          "margin-left:" + leftIndent]);
    },

    /**
     * Compile the CSS rule that controls the list numbering.
     * @param {object} data
     * @param {object} dcp
     * @param {integer} entry
     * @param {integer} level
     */
    compileCounterCss: function(data, dcp, entry, level) {
      var li, startAt,
          counterRule = "counter-increment: lc-" + entry + "-" + level + " 1;";
      // Add counter resets for following levels in outline lists
      if (level < 8) { // level 8 has no following levels
        counterRule += " counter-reset:";
        for (li = level + 1; li <= 8; li++) {
          startAt = dcp.hasOwnProperty('startat') ? dcp.startat : 0;
          counterRule += " lc-" + entry + "-" + li + " " + startAt;
        }
        counterRule += ";";
      }
      data.compiledCss.push([dcp.nameWoutWidows, counterRule]);
    },

    /**
     * Compile the CSS rule that controls the before pseudo content.
     * @param {object} data
     * @param {object} dcp
     */
    compileBeforeCss: function(data, dcp) {
      var paraFormatting = _api.stripParagraphIndents(dcp.ppr),
          dummyPara = new QowtWordPara(),
          dummyRun = new QowtWordRun(),
          bulletIndent = _api.calculateBulletPosition(dcp);

      dummyPara.decorate(paraFormatting, true);
      dummyRun.decorate(dcp.rpr, true);

      if (dcp && dcp.rpr && dcp.rpr.font) {
        dummyRun.style.fontFamily = FontManager.family(dcp.rpr.font);
      }
      // Set text-indent to '0' as the text-indent must be applied to the spans
      // which contain the text. Currently text-indent is applied to the parent
      // paragraph when there is firstLine indent (ppr.fli) . Hence to keep
      // bullets fixed w.r.t the span apply '0' text-indent
      data.compiledCss.push([
          dcp.nameWoutWidows + ":before",
          "content:" + dcp.content + ";" +
          "position:absolute;" +
          "text-indent:0;" +
          "margin-left:" + bulletIndent +
          dummyPara.style.cssText + dummyRun.style.cssText]);
    },

    /**
     * By this point we have the pixel width of the level text and the
     * intended bullet indent. If the width of the level text minus the
     * bullet indent is greater than the bullet indent then the level text
     * would overlap that list item content, so we set the bullet indent
     * to the width of the level text instead.
     * TODO DJT: A further enhancement we could implement here would involve
     * adding a text-indent to the paragraph when the level text width is
     * over a certain threshold, in MSWord this is the width of the first
     * tab stop. We only need to indent the first line, subsequent lines
     * would start at the original left indent value.
     * @param {object} dcp
     * @return {string}
     */
    calculateBulletPosition: function(dcp) {
      var bulletIndent = dcp.ppr.hin || 18,
          pixelLvltxt = dcp.lvltxtNodeMetrics.width,
          pixelBin = dcp.binNodeMetrics.width;
      if ((pixelLvltxt - pixelBin) > pixelBin) {
        bulletIndent = pixelLvltxt + 'px;';
      } else {
        bulletIndent += 'pt;';
      }
      return '-' + bulletIndent;
    },

    /**
     * Compile the CSS rule that initializes the CSS
     * counters for all the list formats.
     * @param {object} data
     * @return {string}
     */
    compileCountersInitCss: function(data) {
      // Each list format needs its own CSS counter,
      // create a single rule to initialize all the counters.
      // The counter is named using the Entry ID since that is the
      // data that is part of the list item dcp.
      var entries, template, ei, li, counters = 'counter-reset:', startAt;
      entries = Object.keys(data.entryToTemplate);
      for (ei = 0; ei < entries.length; ei++) {
        for (li = 0; li < 9; li++) {
          template = data.entryToTemplate[entries[ei]];
          startAt = _api.getStartAtForLevel(data, template, li);
          counters += ' lc-' + entries[ei] + '-' + li + ' ' + startAt;
        }
      }
      return counters + ';';
    },

    /**
     * Compile any data need to create the CSS rules for a template,
     * and store the data in the template DCP object.
     * @param {object} data
     * @param {object} dcp
     * @param {integer} entry
     * @param {integer} template
     * @param {integer} level
     */
    compileTemplateData: function(data, dcp, entry, template, level) {
      data.classnames[template][level] = _api.makeClassName(template, level);
      dcp.nameWithWidows = _api.makeStyleName(template, level, false);
      dcp.nameWoutWidows = _api.makeStyleName(template, level, true);
      if (!dcp.ppr) {
        dcp.ppr = {};
      }
      if (!dcp.ppr.hasOwnProperty('lin')) {
        dcp.ppr.lin = 0;
      }
      dcp.correctedLvlTxt = FontManager.replaceProblemGlyphs(dcp.lvltxt);
      dcp.content = dcp.bulleted ?
          '"' + dcp.correctedLvlTxt + '"' :
          _api.formatLvlTxt(data, entry, template, dcp.correctedLvlTxt);
    }

  };

  return _api;

});
