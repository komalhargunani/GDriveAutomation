define(['common/elements/ui/modalDialog/modalDialog'], function() {

  'use strict';

  window.QowtVersionInfoDialog = Polymer({
    is: 'qowt-version-info-dialog',
    extends: 'dialog',

    behaviors: [
        QowtModalDialogBehavior
    ]
  });

  return {};
});