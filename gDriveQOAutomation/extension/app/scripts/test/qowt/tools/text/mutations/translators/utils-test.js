define([
  'qowtRoot/tools/text/mutations/translators/utils'
], function(
  TranslatorUtils
  ) {

  'use strict';

  describe('mutation translator utils tests', function() {

    var sandbox;
    beforeEach(function(){
      sandbox = sinon.sandbox.create();
    });
    afterEach(function(){
      sandbox.restore();
    });

    describe('getSiblingEid', function() {
      it('should handle flowing elements distinctly', function() {
        var paragraph = new QowtWordPara();
        var run = new QowtWordRun();
        paragraph.appendChild(run);

        sandbox.spy(paragraph, 'absoluteOffsetWithinFlow');

        TranslatorUtils.getSiblingEid(run);
        sinon.assert.called(paragraph.absoluteOffsetWithinFlow);
      });

      it('should handle nonflowing elements distinctly', function() {
        var header = new QowtHeader();
        var paragraph = new QowtWordPara();
        header.appendChild(paragraph);

        header.absoluteOffsetWithinFlow = function(){};
        sandbox.spy(header, 'absoluteOffsetWithinFlow');

        TranslatorUtils.getSiblingEid(paragraph);
        sinon.assert.notCalled(header.absoluteOffsetWithinFlow);
      });
    });

  });
});
