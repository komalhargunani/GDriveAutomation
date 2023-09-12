define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/mixins/decorators/point/shape/outline',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager',
  'qowtRoot/utils/objectUtils'
], function(
    MixinUtils,
    QowtElement,
    Outline,
    PlaceHolderManager,
    PlaceHolderPropertiesManager,
    ObjectUtils) {

  'use strict';

  var shapeProto = {
    is: 'qowt-point-shape',

    // The DCP definiton for this element; used by QowtElement on
    // construction and set in our model so any new element will have it.
    etp: 'sp',

    attached: function() {
      this.renderOutline_();
      this.addEventListener('shape-resized', function(/* event */) {
        this.renderOutline_();
      });
    },

    cloneMe: function(opt_import) {
      var clone = QowtElement.cloneMe.call(this, opt_import);
      // TODO [Rahul Tarafdar] In reality we do not need shapeJson at all. This
      // will be replace by model in due course later. As of now, many
      // operations rely on this shapeJson and we do not want to make
      // "replacing shapeJson with model" as a part of current changes; hence
      // keeping it as it is.
      // Purposely not using lodash's 'cloneDeep' API here due to it's
      // performance overhead. A shape JSON having custom geometry with
      // extremely huge pathLst or gdLst takes a lot of time to deep clone it
      // using lodash.
      var objectUtils = new ObjectUtils();
      clone.shapeJson = objectUtils.clone(this.shapeJson) || {};

      return clone;
    },


    /**
     * @return {boolean} true if this instance of shape polymer element
     * represents ghost shape used in dragging / resizing operations
     * @private
     */
    isGhostShape_: function() {
      return (this.parentNode &&
          this.parentNode.id === 'qowt-drawing-ghostShape') || !this.parentNode;
    },

    //TODO [Rahul Tarafdar] below methods viz. isPlaceholderShape_,
    // getPlaceholderType_, and getPlaceholderIndex_ should be part of
    // placeHolder mixin, however said mixin do not exists as of now, keeping
    // these here in shape polymer. Do migrate these methods, when we create
    // placeHolder mixin

    /**
     * Checks if this shape represents a placeholder shape or not
     * @return {boolean}  true if the shape is a placeholder OR false
     * otherwise
     * @private
     */
    isPlaceholderShape_: function() {
      return this.getAttribute('placeholder-type') !== null;
    },

    /**
     * Returns the shape's placeholder type.
     * Placeholder types returned could be one of these -
     *
     * [title, ctrTitle(Center Title), subTitle, dt(Date), ftr(Footer),
     * sldNum(Slide Number), body, chart, clipArt, dgm, media, obj,
     * pic(Picture), tbl(Table), other]
     *
     * @return {string|undefined}  If the shape is a placeholder, returns
     * it's type OR otherwise undefined
     * @private
     */
    getPlaceholderType_: function() {
      return this.getAttribute('placeholder-type');
    },

    /**
     * Returns the shape's placeholder index.
     *
     * @return {string|undefined}  If the shape is a placeholder, returns
     * it's index OR otherwise undefined
     * @private
     */
    getPlaceholderIndex_: function() {
      return this.getAttribute('placeholder-index');
    },

    /**
     * @return {String} Slide master id of the slide to which this shape
     * belongs to
     * @private
     */
    getMasterId_: function() {
      return travelFor_(this, 'sldmt');
    },

    /**
     * @return {String} Slide layout id of the slide to which this shape
     * belongs to
     * @private
     */
    getLayoutId_: function() {
      return travelFor_(this, 'sldlt');
    },


    /**
     * Updates placeholder properties for this shape.
     * @private
     */
    updatePlaceholderProperties_: function() {

      // If current shape is a placeholder shape then set its placeholder
      // type and placeholder index, else reset them
      if (this.isPlaceholderShape_() && !this.isGhostShape_()) {
        var type = this.getPlaceholderType_();
        var index = this.getPlaceholderIndex_();

        PlaceHolderManager.updateCurrentPlaceHolderForShape(type, index,
            this.getMasterId_(), this.getLayoutId_());
      } else {
        // TODO [Rahul Tarafdar] do we really need to reset current place holder
        // for shape with new version of updating current place holder for shape
        PlaceHolderManager.resetCurrentPlaceHolderForShape();
      }
    },

    /**
     * Cascades shape properties, effects, and fill at object level
     *
     * @return {Object} The resolved properties of shape
     *
     * @private
     */
    cascadeProperties_: function() {
      this.updatePlaceholderProperties_();

      var resolvedSpPr =
          PlaceHolderPropertiesManager.getResolvedShapeProperties();

      // Purposely not using lodash's 'cloneDeep' API here due to it's
      // performance overhead. Shape properties having custom geometry with
      // extremely huge pathLst or gdLst takes a lot of time to deep clone it
      // using lodash.
      var objectUtils_ = new ObjectUtils();
      var clonedSpPr = objectUtils_.clone(this.model.spPr) || {};

      return _.mergeWith({geom: {prst: '88'}}, resolvedSpPr, clonedSpPr,
          function(a, b) {
            // We want to deal with geom property only. To do so,check custom
            // merge function parameters. If it has either prst or pathLst then
            // we are currently merging geom.
            if (a && (a.prst || a.pathLst)) {
              return b;
            }
          }
      );
    }
  };

  // PRIVATE STATIC to all shape polymer instances.

  /**
   * Travel up in the node chain from shape element to the slide node; and
   * returns attribute value for the passed-in attribute
   * @param {HTMLElement} targetNode HTML node from which to travel up till
   *     slide node
   * @param {String} forAttribute The attribute of which we need value
   * @return {String} Value of the passed-in attribute
   * @private
   */
  function travelFor_(targetNode, forAttribute) {
    var node = targetNode;
    while (node && node.getAttribute &&
        node.getAttribute('qowt-divtype') !== 'slide') {
      node = node.parentNode;
    }
    return node ? node.getAttribute(forAttribute) : undefined;
  }

  window.QowtPointShape = Polymer(MixinUtils.mergeMixin(
      QowtElement,
      Outline,
      shapeProto));

  return {};
});
