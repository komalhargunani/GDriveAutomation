define([
  'qowtRoot/models/env',
  'qowtRoot/tools/text/preEdit/widowOrphanHelper'], function(
    EnvModel,
    WidowOrphanHelper) {

  'use strict';

  describe("WidowOrphanHelper", function() {

    var originalModel;

    beforeEach(function() {
      sinon.spy(window, 'getComputedStyle');
      originalModel = EnvModel.app;
      EnvModel.app = 'word';
    });
    afterEach(function() {
      window.getComputedStyle.restore();
      EnvModel.app = originalModel;
    });

    it("should never pass a TEXT_NODE to getComputedStyle", function() {
      var dummy = document.createElement('div');
      var textNode = document.createTextNode('foo');
      dummy.appendChild(textNode);

      WidowOrphanHelper.unbalanceNode(textNode);

      sinon.assert.neverCalledWith(window.getComputedStyle, textNode);
      sinon.assert.calledWith(window.getComputedStyle, dummy);
    });


  });

  return {};
});