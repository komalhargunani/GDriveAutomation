define(['qowtRoot/widgets/point/slidesContainer'], function(SlidesContainer) {

  'use strict';

  describe('Point slide container widget', function() {
    var sandbox;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('should show and hide PaperToast on showToast', function(done) {
      // While initializing the slidesContainer, a PaperToast element is created
      // The PaperToast adds an iron-announcer in document's body. Stubbing this
      // here as it is not required in this test and to avoid leaking of nodes.
      sandbox.stub(Polymer.IronA11yAnnouncer, 'requestAvailability');

      SlidesContainer.init();
      var node = SlidesContainer.node();
      var toast = node.querySelector('paper-toast');
      assert.isNotNull(toast);
      toast.duration = { type: Number, value: 100 };
      var toastShowStub = sandbox.stub(toast, 'show');
      sandbox.stub(toast, 'hide', function() {
        done();
      });
      SlidesContainer.showToast('20px', '30px', 'some text');
      assert.strictEqual(toast.style.left, '20px');
      assert.strictEqual(toast.style.top, '30px');
      assert.strictEqual(toast.text, 'some text');
      assert.isTrue(toastShowStub.called, 'toast shown');
    });
  });
});
