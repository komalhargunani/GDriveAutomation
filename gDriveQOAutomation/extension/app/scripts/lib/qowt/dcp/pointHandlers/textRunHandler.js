define([
  'qowtRoot/dcp/decorators/pointTextDecorator',
  'qowtRoot/models/point',
  'qowtRoot/widgets/document/linebreak',
], function(PointTextDecorator, PointModel, LineBreak) {

  'use strict';

  var _api = {

    /**
     * DCP Type Code
     * This is used by the DCP Manager to register this handler
     */
    etp: 'txrun',

    /**
     * Render a Text Run element from DCP
     * @param dcp {DCP} Text Run DCP JSON
     * @return {Element} Text run element
     */
    visit: function(dcp) {
      var element;

      // Error check to see if this is the correct Handler for this DCP
      if (dcp && dcp.el && dcp.el.etp && (dcp.el.etp === _api.etp) &&
         dcp.el.eid && PointModel.isExplicitTextBody) {
        // line breaks are distinguished from text runs / fields by having no
        // text content.
        // TODO(elqursh): Move line breaks to their own handler with
        // corresponding DCP changes. There is no reason why they should be
        // distinguished using an ambiguous criteria as done here.
        if (dcp.el.data === undefined) {
          // TODO(elqursh): Evaluate different options to polymerize use of <br>
          // tags in paragraphs. Point currently relies on <br> tags directly
          // under paragraph.
          var lineBreakWidget = LineBreak.create({ newId: dcp.el.eid });
          element = lineBreakWidget.getWidgetElement();
        } else {
          // use the decorator to create the element and style it.
          // TODO(elqursh): Remove the decorator usage and rely on decorator
          // mixins once all decorators have been created.
          var pointTextDecorator = PointTextDecorator.create();
          var decorate = pointTextDecorator.decorate().withNewDiv(dcp.el.eid);
          var paraLevel = parseInt(dcp.node.getAttribute('qowt-level'));
          element = decorate.withTextRunProperties(dcp.el, paraLevel).
              getDecoratedDiv();

          // dont store the actual text in the model; that
          // would take up too much memory; the qowt-point-run is
          // smart enough to include it's textContent when
          // calculating the crc32 checksum.
          element.setModel(_.omit(dcp.el, 'data'));
        }
        Polymer.dom(dcp.node).appendChild(element);
        Polymer.dom(dcp.node).flush();

      }
      return element;
    }
  };

  return _api;
});
