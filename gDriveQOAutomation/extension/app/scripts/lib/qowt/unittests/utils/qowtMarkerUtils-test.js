// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for QOWT markers
 *
 * @author rasika.tandale@quickoffice.com (Rasika Tandale)
 */

define([
  'qowtRoot/utils/qowtMarkerUtils'
], function(
    QOWTMarkerUtils) {

  'use strict';

  describe('utils/QOWTMarkerUtils.js tests', function() {
    describe('should add proper attributes in qowt-marker', function() {
      it('should set qowt-marker to proper name and value', function() {
        var node = document.createElement('div');
        QOWTMarkerUtils.addQOWTMarker(node, 'hyperlink', 'somelink');
        expect(node.getAttribute('qowt-marker')).toEqual(
            'hyperlink' + '<somelink>;');
      });

      it('should append qowt-marker with proper attribute values', function() {
        var node = document.createElement('div');
        QOWTMarkerUtils.addQOWTMarker(node, 'propertyName1', 'propertyValue1');
        QOWTMarkerUtils.addQOWTMarker(node, 'propertyName2', 'propertyValue2');
        expect(node.getAttribute('qowt-marker')).toEqual('propertyName1' +
            '<propertyValue1>;' + 'propertyName2' + '<propertyValue2>;');
      });
    });

    describe('should fetch proper attributes from qowt-marker', function() {
      it('should return correct property value', function() {
        var node = document.createElement('div');
        QOWTMarkerUtils.addQOWTMarker(node, 'hyperlink', 'somelink');
        expect(QOWTMarkerUtils.fetchQOWTMarker(node, 'hyperlink')).toEqual(
            'somelink');
      });

      it('should return undefined as property value when node is undefined',
         function() {
           expect(QOWTMarkerUtils.fetchQOWTMarker(undefined, 'hyperlink')).
               toEqual(undefined);
         });
    });

  });
});
