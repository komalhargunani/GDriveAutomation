define([
  'qowtRoot/onboarding/common/onboardingDialogHandler',
  'qowtRoot/features/utils'], function(
    OnboardingDialogHandler,
    Features) {

  'use strict';

  describe('onboarding dialog', function() {

    var stub, shownCount;
    beforeEach(function() {
      Features.disable('suppressFirstTimeDialog');
      shownCount = 0;
      var stubData = function() {
        return {
          show: function() {
            shownCount++;
          },
          addEventListener: function() {}
        };
      };
      stub = sinon.stub(window, 'QowtOnboardingDialog', stubData);
    });

    afterEach(function() {
      Features.enable('suppressFirstTimeDialog');
      shownCount = undefined;
      stub = undefined;
      QowtOnboardingDialog.restore();
    });


    it('should show a dialog on showDialog()', function() {
      OnboardingDialogHandler.showDialog();
      assert.isTrue(stub.calledOnce);
      assert.strictEqual(shownCount, 1);
    });
  });
});
