define([
  'qowtRoot/errors/observers/errorUi',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/htmlConstructor',
  'qowtRoot/widgets/ui/modalDialog',
  'qowtRoot/widgets/ui/modalSpinner'
], function(
    ErrorUI,
    PubSub,
    Html,
    ModalDialog,
    ModalSpinner) {

  'use strict';

  describe("ErrorUI", function() {


    beforeEach(function() {
      sinon.stub(ModalSpinner, 'hide');
      ErrorUI.init();
    });

    afterEach(function() {
      ModalSpinner.hide.restore();
      ErrorUI.disable();
    });

    it('should show error dialog when error is not fatal and is recoverable ' +
        'and content is not received', function() {
      var error = {fatal: false};
      sinon.stub(ModalDialog, 'info', function() {
        return {
          addLink: function(){},
          destroy: function(){}
        };
      });
      ErrorUI.show(error);
      assert(ModalDialog.info.calledOnce);
      ModalDialog.info.restore();
    });

    it('should show error dialog when error is not fatal and is recoverable ' +
        'and some content is received', function() {
      PubSub.publish('qowt:contentReceived');
      var error = {fatal: false};
      sinon.stub(ModalDialog, 'info', function() {
        return {
          addLink: function(){},
          destroy: function(){}
        };
      });
      ErrorUI.show(error);
      assert(ModalDialog.info.calledOnce);
      ModalDialog.info.restore();
    });

    it('should show error screen when error is fatal, and its recoverable, ' +
        'but no content is received', function() {
      var error = {fatal: true};
      sinon.stub(Html, 'constructHTML');
      sinon.stub(document, 'getElementById', function() {
        return {
          style: {}
        };
      });
      ErrorUI.show(error);
      sinon.assert.calledOnce(Html.constructHTML);
      Html.constructHTML.restore();
      document.getElementById.restore();
    });

    it('should show error dialog when error is fatal, and its recoverable, ' +
        'and some content is received', function() {
      PubSub.publish('qowt:contentReceived');
      var error = {fatal: true};
      sinon.stub(ModalDialog, 'show', function() {
        return {
          addLink: function(){},
          destroy: function(){}
        };
      });
      ErrorUI.show(error);
      assert(ModalDialog.show.calledOnce);
      ModalDialog.show.restore();
    });

    it('should show error screen when error is fatal, and its not ' +
        'recoverable, and no content received', function() {
      var error = {fatal: true, nonRecoverable: true};
      sinon.stub(Html, 'constructHTML');
      sinon.stub(document, 'getElementById', function() {
        return {
          style: {}
        };
      });
      ErrorUI.show(error);
      sinon.assert.calledOnce(Html.constructHTML);
      Html.constructHTML.restore();
      document.getElementById.restore();
    });

    it('should show error screen when error is fatal, and its not ' +
        'recoverable, and some content is received', function() {
      PubSub.publish('qowt:contentReceived');
      var error = {fatal: true, nonRecoverable: true};
      sinon.stub(Html, 'constructHTML');
      sinon.stub(document, 'getElementById', function() {
        return {
          style: {}
        };
      });
      ErrorUI.show(error);
      sinon.assert.calledOnce(Html.constructHTML);
      Html.constructHTML.restore();
      document.getElementById.restore();
    });
  });
});

