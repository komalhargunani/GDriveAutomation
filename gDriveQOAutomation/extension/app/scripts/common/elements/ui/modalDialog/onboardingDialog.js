define(['common/elements/ui/modalDialog/modalDialog'], function() {

  'use strict';

  window.QowtOnboardingDialog = Polymer({
    is: 'qowt-onboarding-dialog',
    extends: 'dialog',
    behaviors: [
        QowtModalDialogBehavior
    ]
  });

  return {};
});