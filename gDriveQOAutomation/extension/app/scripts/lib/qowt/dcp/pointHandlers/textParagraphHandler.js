define([
  'qowtRoot/dcp/decorators/pointParagraphDecorator',
  'qowtRoot/dcp/decorators/pointBulletDecorator',
  'qowtRoot/models/point',
  'qowtRoot/configs/point',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/presentation/explicitTextStyleManager',
  'qowtRoot/presentation/placeHolder/defaultTextStyleManager',
  'qowtRoot/utils/cssManager',
  'third_party/lo-dash/lo-dash.min'
], function(
  PointParagraphDecorator,
  BulletDecorator,
  PointModel,
  PointConfig,
  PlaceHolderTextStyleManager,
  ExplicitTextStyleManager,
  DefaultTextStyleManager,
  CssManager
  ) {

  'use strict';

  var element_, // Holds text paragraph's corresponding LI element
    paragraphDecorator_;

  var api_ = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'para',

    /**
     * Render a Text Paragraph element from DCP
     * @param dcp {DCP} Text Paragraph DCP JSON
     * @return {DOM Element} Text Paragraph div
     */
    visit: function(dcp) {
      element_ = undefined;

      // Error check to see if this is the correct Handler for this DCP
      if (dcp && dcp.el && dcp.el.etp && (dcp.el.etp === api_.etp) &&
         dcp.el.eid && PointModel.isExplicitTextBody) {

        // TODO(elqursh): Remove the point paragraph decorator usage when all
        // the functionality is moved to decorator mixins.
        if(!paragraphDecorator_) {
          paragraphDecorator_ = PointParagraphDecorator.create();
        }

        var decorate = paragraphDecorator_.decorate().withNewDiv(dcp.el.eid);
        element_ = decorate.withParagraphProperties(dcp.el).getDecoratedDiv();

        // TODO(elqursh): Remove the point bullet decorator usage when all
        // the functionality is moved to decorator mixins.
        var bulletDecorator = BulletDecorator.create();
        var level = (dcp.el.ppr && dcp.el.ppr.level) || 0;

        var firstRunProperty = dcp.el.elm && dcp.el.elm[0] && dcp.el.elm[0].rpr;

        var resolvedParaProperty;
        var properties = _.cloneDeep(dcp.el.ppr) || {};
        ExplicitTextStyleManager.resolveParaPropertyFor(properties);
        if (PointModel.CurrentPlaceHolderAtSlide.phTyp) {
          resolvedParaProperty =
            PlaceHolderTextStyleManager.resolveParaPropertyFor(level);
        } else {
          resolvedParaProperty =
            DefaultTextStyleManager.resolveParaPropertyFor(level);
        }

        for (var paraProperty in resolvedParaProperty) {
          properties[paraProperty] = properties[paraProperty] ||
            resolvedParaProperty[paraProperty];
        }

        var style = bulletDecorator.decorate(
            element_, properties, firstRunProperty);
        element_.classList.add(element_.id);
        var selector = '#' + element_.model.eid + ':before, ' +
            '#' + PointConfig.kTHUMB_ID_PREFIX + element_.model.eid + ':before';
        CssManager.addRule(selector, style, 100);

        element_.setModel(dcp.el);
      }

      return element_;
    },

    /**
     * Resets the paragraph decorator. Used in unit tests.
     */
    reset: function() {
      paragraphDecorator_ = undefined;
    },

    /**
     * postTraverse gets called *after* all child elements have been handled
     * this can be used to only add our new element to the DOM *after* the
     * children have been handled to reduce the number of DOM calls that are
     * made.
     */
    postTraverse: function(dcp) {

      if (element_ && PointModel.isExplicitTextBody) {
        /*
         * The spacing before and spacing after handling is done after text runs
         * are handled.
         * These need to be handled when we process paragraph properties, but we
         * didn't find a way to handle it there. Hence this is kind of hack
         * which produces a lot of hacks further down the line. e.g. methods
         * setIfMaxFontSize() and getMaxFontSize() are result of it.
         * Find out a way to implement spacing before and spacing after while we
         * handle paragraph properties and remove corresponding hacks
         */
        paragraphDecorator_.handleParagraphSpacing(element_.style);
        Polymer.dom(dcp.node).appendChild(element_);
        Polymer.dom(dcp.node).flush();
      }
    }
  };

  return api_;
});
