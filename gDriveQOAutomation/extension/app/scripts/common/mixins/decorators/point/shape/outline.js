define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase',
  'qowtRoot/drawing/geometry/geometryManager',
  'qowtRoot/dcp/decorators/geometryDecorator',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/drawing/theme/themeStyleRefManager'

], function(MixinUtils,
            DecoratorBase,
            GeometryManager,
            GeometryDecorator,
            UnitConversionUtils,
            ThemeStyleRefManager) {

  'use strict';

  //private

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['ln'],

    observers: [
      'outlineChanged_(model.spPr.ln)'
    ],

    /** @return {object} Get the entire outline. */
    get ln() {
      return (this.model && this.model.spPr && this.model.spPr.ln);
    },

    /**
     * Set the outline in the model.
     * @param {object} value The value of the outline.
     */
    set ln(value) {
      this.setInModel_('spPr.ln', value);
    },

    outlineChanged_: function(/* current */) {
      this.renderOutline_();
    },


    /**
     * @return {{ln: function(CSSStyleDeclaration): Object}} The outline of this
     *     shape. It contains below properties,
     *     {Object} ln.fill: The outline fill
     *     {String} ln.prstDash: The outline preset dash type
     *     {Number} ln.w: The outline width
     */
    computedDecorations_: {

      ln: function(/* computedStyles */) {
        ThemeStyleRefManager.cacheShapeStyle(this.model.style);
        var renderBean = this.computeOutlineRenderBeans_();
        var toReturn = {};

        // TODO [Rahul Tarafdar] the fill object we are forming here is out of
        // resolved properties. These resolved properties are formed for
        // rendering perspective, so essentially, these don't have complex data
        // in it, rather, it it in its simplest form; solid fill with a colour
        // and colour effects, if any.
        // Keeping the constraint on this change set, we should handle this in
        // more correct way to get more complex data structure, e.g. gradient
        // fill. For now, this computed decoration for outline fill will always
        // return a solid fill or a no fill object.
        toReturn.fill =
            _.cloneDeep(renderBean.fillColorBean.outlineFill.data) || {};
        toReturn.fill.type = renderBean.fillColorBean.outlineFill.type;

        toReturn.prstDash = (this.ln && this.ln.prstDash) || (renderBean &&
            renderBean.fillColorBean && renderBean.fillColorBean.prstDash);

        toReturn.w = UnitConversionUtils.convertPixelToEmu(
            renderBean.fillColorBean.outlineFill.lineWidth);

        ThemeStyleRefManager.resetShapeStyle();
        return toReturn;
      }
    },

    /**
     * Render outline of this shape on dedicated outline canvas.
     * Renders outline considering three properties
     * 1. outline color
     * 2. outline style
     * 3. outline width
     */
    renderOutline_: function() {

      ThemeStyleRefManager.cacheShapeStyle(this.model.style);

      var renderBean = this.computeOutlineRenderBeans_();
      var shapeCanvas = this.querySelector('#t-outline_canvas') ||
        this.querySelector('#outline_canvas');
      var geometryDecorator = GeometryDecorator.create();
      if (renderBean && shapeCanvas) {
        geometryDecorator.decorate().
            withCanvasTransforms(renderBean.shapeProps,
                renderBean.effectsBean, shapeCanvas).
            withCanvasDrawing(renderBean.shapeProps, undefined,
                renderBean.fillColorBean, undefined, shapeCanvas);
      }

      //Make sure that we reset the cached styles once outline rendering is done
      ThemeStyleRefManager.resetShapeStyle();
    },


    /**
     * Computes and returns object containing render bean for shape outline.
     *
     * @return {{shapeProps: Object, fillColorBean: Object,
     *         effectsBean: Object}}
     * @return {{shapeProps: Object}} cascaded shape properties
     * @return {{fillColorBean: Object}} cascaded fill properties, but in a
     *         different form, suitable for geometry renderer. This structure is
     *         legacy.
     * @return {{effectsBean: Object}} cascaded effect properties, but in a
     *         different form, suitable for geometry renderer. This structure is
     *         legacy.
     * @private
     */
    computeOutlineRenderBeans_: function() {
      var renderBean;
      var propertiesWithNoFill = this.cascadeProperties_();
      // make sure we do not render shape fill, even through cascading. so set
      // the fill to noFill
      propertiesWithNoFill.fill = {'type': 'noFill'};
      if (propertiesWithNoFill.xfrm) {
        this.reEvaluateShapeExtent_(propertiesWithNoFill.xfrm.ext,
            this.model.grpPrp);

        var geomMgrApi = GeometryManager.
            initialize(propertiesWithNoFill, undefined);

        renderBean = {
          shapeProps: propertiesWithNoFill,
          fillColorBean: geomMgrApi.generateFillColorBean(),
          effectsBean: geomMgrApi.generateEffectsBean()
        };
      }
      return renderBean;
    },

    /**
     * Re-evaluates the shape-extents by the group scale factor
     * @param {Object} shapeExtents Shape extents
     * @param {Object} groupShapeProperties Group shape properties
     * @private
     */
    reEvaluateShapeExtent_: function(shapeExtents, groupShapeProperties) {
      if (groupShapeProperties !== undefined) {
        shapeExtents.cx *= groupShapeProperties.scale.x;
        shapeExtents.cy *= groupShapeProperties.scale.y;
      }
    }

  });

  return api_;
});
