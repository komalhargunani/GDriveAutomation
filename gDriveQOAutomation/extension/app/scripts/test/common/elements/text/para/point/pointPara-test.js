define(['common/elements/text/para/point/pointPara'], function() {
  'use strict';

  describe('<qowt-point-para>', function() {

    var testEl;

    beforeEach(function() {
      testEl = new QowtPointPara();
      sinon.stub(testEl, 'bulletSizeChanged_');
      var run = new QowtPointRun();
      run.siz = '10';
      testEl.appendChild(run);
    });

    afterEach(function() {
      testEl.bulletSizeChanged_.restore();
      if (testEl.updateMaxParaFontSize_.restore) {
        testEl.updateMaxParaFontSize_.restore();
      }
      testEl = undefined;
    });

    it('should call bulletSizeChanged_ when observeFirstRun invoked with para' +
        ' with first child', function() {
         testEl.observeFirstRun_();
         assert.isTrue(testEl.bulletSizeChanged_.called,
             'bulletSizeChanged_ method has been called');
       });

    xit('should call updateMaxParaFontSize_ when font size of a run changes',
        function(done) {
          testEl.firstChild.set('model.rpr.siz', 18);
          sinon.stub(testEl, 'updateMaxParaFontSize_', function() {
            done();
          });
          testEl.observeRunFontSize_();
          testEl.firstChild.set('model.rpr.siz', 22);
        });

    xit('should call updateMaxParaFontSize_ when a new run is attached',
        function(done) {
          var run = new QowtPointRun();
          run.set('model.rpr.siz', 22);
          sinon.stub(testEl, 'updateMaxParaFontSize_', function() {
            done();
          });
          testEl.observeRunFontSize_();
          testEl.appendChild(run);
        });
  });

  return {};
});
