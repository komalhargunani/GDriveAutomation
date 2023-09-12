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
  'qowtRoot/presentation/placeHolder/phStyleClassFactory'
], function(PHStyleClassFactory) {

  'use strict';

  describe('Place-holder Style Class Factory', function() {
    var _phStyleClassFactory = PHStyleClassFactory;

    describe('-getClassName', function() {

      it('should return proper class-name when element-type is -shape-',
         function() {
           var className = _phStyleClassFactory.shape.getClassName(
               'weirdClassPrefix');
           expect(className).toEqual('weirdClassPrefix_shapeStyle');
         });

      it('should return proper class-name when element-type is -shapeFill-',
         function() {
           var className = _phStyleClassFactory.shapeFill.getClassName(
               'weirdClassPrefix');
           expect(className).toEqual('weirdClassPrefix_shapeFillStyle');
         });
    });
  });
});
