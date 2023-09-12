// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Decorator for Group Shape
 *
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */

define([
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/dcp/pointHandlers/transform2DHandler',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/dcp/decorators/shapeEffectsDecorator',
  'qowtRoot/dcp/pointHandlers/shapePropertiesHandler'
], function(QOWTMarkerUtils,
            Transform2D,
            DeprecatedUtils,
            ShapeEffectsDecorator,
            ShapePropertiesHandler) {

  'use strict';

  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

        var _shapeEffectsDecorator;

        /**
         * Adds the -grpPrp- element to all the group elements
         * @param {Object} groupShape Group-shape DCP JSON
         * @param {Object} groupPropertiesBean Group properties bean
         */
        var _handleGroupElements = function(groupShape, groupPropertiesBean) {
          if (groupPropertiesBean) {
            groupShape.elm.map(function(groupItem) {
              groupItem.grpPrp = groupPropertiesBean;
            });
          }
        };

        /**
         * Re-evaluates the shape-extent by the group scale factor
         * @param {Object} groupShapeExtents Shape extent
         * @param {Object} containerGroupPropertiesBean Group properties
         */
        var _reEvaluateGroupShapeExtent =
            function(groupShapeExtents, containerGroupPropertiesBean) {
          if (containerGroupPropertiesBean &&
              containerGroupPropertiesBean.scale) {
            groupShapeExtents.cx *= containerGroupPropertiesBean.scale.x;
            groupShapeExtents.cy *= containerGroupPropertiesBean.scale.y;
          }
        };

        /**
         * calculates scale-factor for all the shapes with-in the group.
         * This scale factor is applied to the containing shapes' extent and
         * -resultant- offset.
         * @param {Object} groupShapePropertyXfrm Group-shape transform property
         */
        var _calculateGroupScaleFactor = function(groupShapePropertyXfrm) {
          var scale = {};
          scale.x =
              groupShapePropertyXfrm.ext.cx / groupShapePropertyXfrm.chExt.cx;
          scale.y =
              groupShapePropertyXfrm.ext.cy / groupShapePropertyXfrm.chExt.cy;
          return scale;
        };

        /**
         * Handles reflection of group shapes
         * @param {JSON} groupShapeObj Group shape properties
         * @param {HTMLElement} groupShapeDiv  Group shape div
         */
        var _handleGroupShapeEffects = function(groupShapeObj, groupShapeDiv) {

          var effectList = groupShapeObj.grpSpPr.efstlst;
          if (effectList && effectList.refnEff) {

            if (!_shapeEffectsDecorator) {
              _shapeEffectsDecorator = ShapeEffectsDecorator.create();
            }

            var reflectionStyle =
                _shapeEffectsDecorator.withReflection(effectList.refnEff);
            DeprecatedUtils.
                appendJSONAttributes(groupShapeDiv.style, reflectionStyle);
          }
        };


        /**
         * Handles rotation and flip of group shape
         * @param {JSON} groupShapeTransformObj group shape transform properties
         * @param {HTMLElement} groupShapeDiv group shape div
         */
        var _handleGroupShapeTransforms = function(groupShapeTransformObj,
                                                   groupShapeDiv) {
          if (groupShapeTransformObj) {
            groupShapeDiv.style['-webkit-transform'] =
                ShapePropertiesHandler.handleFlipAndRotate(
                groupShapeTransformObj.flipH, groupShapeTransformObj.flipV,
                groupShapeTransformObj.rot);
          }
        };

        /**
         * Prepares group properties bean
         * @param {JSON} groupShapeObj group shape properties JSON
         * @param {HTMLElement} groupShapeDiv group shape div
         */
        var _prepareGroupPropertiesBean = function(groupShapeObj,
                                                   groupShapeDiv) {
          var groupPropertiesBean = {};
          var groupShapeProperties = groupShapeObj.grpSpPr;
          var containerGroupPropertiesBean = groupShapeObj.grpPrp;

          var groupTransform = groupShapeProperties.xfrm;
          if (groupTransform) {
            _reEvaluateGroupShapeExtent(groupTransform.ext,
                containerGroupPropertiesBean);
            groupPropertiesBean.transform = Transform2D.handle(groupTransform,
                containerGroupPropertiesBean, groupShapeDiv);
            groupPropertiesBean.scale =
                _calculateGroupScaleFactor(groupTransform);
          }
          groupPropertiesBean.efstlst = groupShapeProperties &&
              groupShapeProperties.efstlst;

          if (groupShapeProperties.fill) {
            // when a group shape fill property is 'grpFill', that means
            // it is a nested group shape, so, we apply the fill from the
            // container, which is having that nested group shape.
            groupPropertiesBean.fill =
                (groupShapeProperties.fill.type === 'grpFill') ?
                    containerGroupPropertiesBean.fill :
                    groupShapeProperties.fill;
          }

          return groupPropertiesBean;
        };

        var _api = {
          /**
           * Decorates the group shape
           * here, for decorate api, we have constraints on method call, viz if
           * we want to create new div then withNewDiv is the first method to
           * invoke and after all decorate methods getDecoratedDiv() is the last
           * method.
           * @param {Object} groupShapeDiv Group-shape div
           * @return {Object} api object containing decorator functions
           */
          decorate: function(groupShapeDiv) {

            var _localApi = {

              /**
               * Decorator / creator of the new group-shape div
               * @param {String} id Id for the new group-shape div to be created
               * @param {Object} nonVisualShapeProperties Non visual properties
               *                                          for shape
               */
              withNewDiv: function(id, nonVisualShapeProperties) {
                //TODO: This function is more of creational in nature, and hence
                // this ideally needs to be inside some factory/abstract factory
                //in some hierarchy, like an ElementAbstractFactory and
                // GroupShapeFactory
                groupShapeDiv = document.createElement('DIV');
                groupShapeDiv.id = id;
                groupShapeDiv.setAttribute('qowt-divType', 'groupShape');
                // This is the actual shape-Id coming from XML - added for
                // automation purpose
                QOWTMarkerUtils.addQOWTMarker(groupShapeDiv, 'shape-Id',
                    nonVisualShapeProperties.shapeId);
                groupShapeDiv.style.position = 'absolute';
                if (nonVisualShapeProperties &&
                    nonVisualShapeProperties.isHidden) {
                  groupShapeDiv.style.display = 'none';
                }

                return _localApi;
              },

              /**
               * Decorates the group-shape div with the properties in the
               * -groupShapeObj-
               * @param {Object} groupShapeObj Group shape JSON object
               */
              withGroupShapeProperties: function(groupShapeObj) {
                if (groupShapeObj.grpSpPr) {

                  var groupPropertiesBean =
                      _prepareGroupPropertiesBean(groupShapeObj, groupShapeDiv);

                  _handleGroupElements(groupShapeObj, groupPropertiesBean);

                  _handleGroupShapeEffects(groupShapeObj, groupShapeDiv);

                  _handleGroupShapeTransforms(groupShapeObj.grpSpPr.xfrm,
                      groupShapeDiv);
                }

                return _localApi;
              },

              /**
               * Getter for the decorated div
               * @return {Object} returns the decorated div
               */
              getDecoratedDiv: function() {
                return groupShapeDiv;
              }
            };

            return _localApi;
          }
        };

        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      return module();
    }
  };

  return _factory;
});
