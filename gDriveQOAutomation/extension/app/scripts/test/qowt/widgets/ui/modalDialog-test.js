define([
  'qowtRoot/widgets/ui/modalDialog',
  'qowtRoot/utils/userFeedback'
], function(ModalDialog, UserFeedback) {

  'use strict';

  describe('Modal Dialog Tests', function() {

    it('should called chrome feedback UI when "report an issue" hyperlink of' +
        ' modal dialog is clicked', function() {

          var root = document.createElement('div');
          document.body.appendChild(root);
          ModalDialog.setTarget(root);

          sinon.stub(UserFeedback, 'reportAnIssue');
          var modal = ModalDialog.show('title', 'msg', [], 'class');
          modal.addLink();
          var link = document.querySelector('.qowt-dialog-link');
          link.click();

          assert.isTrue(UserFeedback.reportAnIssue.calledOnce,
              'reportAnIssue called once');
          UserFeedback.reportAnIssue.restore();
          modal.close();
          modal.destroy();
          document.body.removeChild(root);
        });
  });
});
