/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/dcp/decorators/groupShapeDecorator',
  'qowtRoot/dcp/pointHandlers/groupShapeHandler'
], function(GroupShapeDecorator, GroupShape) {

  'use strict';

  describe('Group Shape Handler Test', function() {
    var v;

    var groupShapeHandler = GroupShape;

    var kGROUP_SHAPE_ID = '111';

    beforeEach(function() {
      v = {
        el: {
          nvSpPr: {},
          etp: 'grpsp',
          eid: kGROUP_SHAPE_ID,
          elm: []
        }
      };
    });

    it('should return undefined when groupShape JSON is undefined', function() {
      v = undefined;
      var groupShapeDiv = groupShapeHandler.visit(v);

      expect(groupShapeDiv).toEqual(undefined);
    });

    it('should return undefined when element in groupShape JSON is undefined',
        function() {
          v.el = undefined;
          var groupShapeDiv = groupShapeHandler.visit(v);

          expect(groupShapeDiv).toEqual(undefined);
        });

    it('should return undefined when element-type in groupShape JSON is ' +
        'undefined', function() {
          v.el.etp = undefined;
          var groupShapeDiv = groupShapeHandler.visit(v);

          expect(groupShapeDiv).toEqual(undefined);
        });

    it('should return undefined when element-id in groupShape JSON is ' +
        'undefined', function() {
          v.el.eid = undefined;
          var groupShapeDiv = groupShapeHandler.visit(v);

          expect(groupShapeDiv).toEqual(undefined);
        });

    it('should return undefined when element-type in groupShape JSON is ' +
        'not -grpsp-', function() {
          v.el.etp = 'xxx';
          var groupShapeDiv = groupShapeHandler.visit(v);

          expect(groupShapeDiv).toEqual(undefined);
        });

    it('should call the group-shape decorator appropriately', function() {
      var groupShapeParentDiv = {
        appendChild: function() {
        }
      };
      v.node = groupShapeParentDiv;

      var decoratorLocalApi = {
        withNewDiv: function() {
        },
        withGroupShapeProperties: function() {
        },
        getDecoratedDiv: function() {
        }
      };

      var groupShapeDecorator = {
        decorate: function() {
        }
      };
      spyOn(GroupShapeDecorator, 'create').andReturn(groupShapeDecorator);

      spyOn(groupShapeDecorator, 'decorate').andReturn(decoratorLocalApi);

      spyOn(decoratorLocalApi, 'withNewDiv').andReturn(decoratorLocalApi);
      spyOn(decoratorLocalApi, 'withGroupShapeProperties').andReturn(
          decoratorLocalApi);
      var someGroupShapeDiv = {};
      spyOn(decoratorLocalApi, 'getDecoratedDiv').andReturn(someGroupShapeDiv);

      var groupShapeDiv = groupShapeHandler.visit(v);

      expect(groupShapeDecorator.decorate).toHaveBeenCalledWith();

      expect(decoratorLocalApi.withNewDiv).toHaveBeenCalledWith(
          kGROUP_SHAPE_ID, v.el.nvSpPr);
      expect(decoratorLocalApi.withGroupShapeProperties).toHaveBeenCalledWith(
          v.el);
      expect(decoratorLocalApi.getDecoratedDiv).toHaveBeenCalled();

      expect(groupShapeDiv).toEqual(someGroupShapeDiv);
    });

  });
});
