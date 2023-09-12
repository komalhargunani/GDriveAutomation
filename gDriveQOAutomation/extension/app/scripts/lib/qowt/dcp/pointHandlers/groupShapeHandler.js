/**
 * Handler for Group Shape and Drawing Group Shape
 * @constructor
 */
define([
  'qowtRoot/dcp/decorators/groupShapeDecorator'
], function(GroupShapeDecorator) {

  'use strict';

  var _groupShapeDecorator;

  var _api = {
    /* DCP Type Code
     This is used by the DCP Manager to register this Handler */
    etp: ['grpsp', 'dgrpsp'],

    /**
     * Render a Group-Shape element from DCP
     * @param v {DCP} group-shape DCP JSON
     * @return {DOM Element} group-shape div
     */
    visit: function(v) {
      if (v && v.el && v.el.etp && _api.etp.indexOf(v.el.etp) >= 0 &&
          v.el.eid) {

        if (!_groupShapeDecorator) {
          _groupShapeDecorator = GroupShapeDecorator.create();
        }
        var groupShapeElement = v.el;
        var nonVisualShapeProperties = groupShapeElement.nvSpPr;

        var groupShapeDiv = _groupShapeDecorator.decorate().
          withNewDiv(groupShapeElement.eid, nonVisualShapeProperties).
          withGroupShapeProperties(groupShapeElement).getDecoratedDiv();

        v.node.appendChild(groupShapeDiv);

        return groupShapeDiv;
      }
    }
  };

  return _api;
});
