define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/savestate/saveNotificationHandler',
  'qowtRoot/widgets/ui/modalDialog',
  'qowtRoot/widgets/ui/modalSpinner',
  'qowtRoot/utils/userFeedback',
  'qowtRoot/utils/htmlConstructor',
  'qowtRoot/utils/i18n',
  'qowtRoot/messageBus/messageBus'
], function(
  PubSub,
  SaveNotificationHandler,
  ModalDialog,
  ModalSpinner,
  UserFeedback,
  Html,
  I18n,
  MessageBus) {

  'use strict';

  var api_ = {};

  api_.show = function(error) {

    // ignore silent errors or any error after a fatal error has
    // already been handled
    if (!(error.silent) && !fatalErrorHandled_) {
      console.log('ErrorUi handling error', error);

      // remove any modal spinner we might have up
      ModalSpinner.hide();

      // show an error dialog for non fatal errors, or if error is recoverable
      // and we were already showing some user content (in which case the less
      // obtrusive dialog with a "reload" button is nicer than a full screen
      // grey error screen)
      if (!error.fatal || (!error.nonRecoverable && contentReceived_)) {
        showErrorDialog_(error);
      } else {
        showErrorScreen_(error);

        // hide any error dialogs that might have been previously brought up
        destroyAllDialogs_();

        // hide the actual qowt content if there was any up
        var qo_app = document.getElementById('qo_app');
        qo_app.style.display = 'none';
      }

      if (error.fatal) {
        fatalErrorHandled_ = true;
      }
    }
  };

  api_.init = function() {
    // simple one-time subscription to know when we received some
    // content (this subscription is executed on load)
    contentReceivedToken_ = PubSub.subscribe('qowt:contentReceived',
        contentReceivedCallback_, {after: false, once: true});
  };

  api_.disable = function() {
    PubSub.unsubscribe(contentReceivedToken_);
    fatalErrorHandled_ = false;
    contentReceived_ = false;
  };

  // ------------------------------------------------------------
  var contentReceivedToken_;
  var fatalErrorHandled_ = false;
  var dialogs_ = [];
  var contentReceived_ = false;

  function contentReceivedCallback_() {
    contentReceived_ = true;
  }


  // pluck the strings we are interested from the error or use defaults
  function getStrings_(error) {
    var ui = {};
    // TODO(jliebrand): change the default strings based on
    // error.fatal (eg have different strings for dialog than for screen)
    ui.title = msgOr_(error.title, 'generic_error_short_msg');
    ui.details = msgOr_(error.details, 'generic_error_msg');

    ui.linkData = error.linkData = error.linkData || {};
    ui.linkData.download = error.linkData.download;
    ui.linkData.url = error.linkData.url;
    ui.linkData.msg = msgOr_(error.linkData.msg, 'action_create_user_feedback');
    return ui;
  }

  function msgOr_(msg, i18nId) {
    return msg || I18n.getMessage(i18nId);
  }

  function destroyAllDialogs_() {
    dialogs_.forEach(function(dlg) {
      dlg.destroy();
    });
  }

  function linkConf_(linkData) {
    var conf = {
      id: 'error-link'
    };

    var child = {
        elType: 'a',
        href: linkData.url,
        textContent: linkData.msg
    };

    if(linkData.download) {
      child.download = linkData.download;
      conf.children = [child];
    }
    else if(linkData.hyperlink) {
      conf.children = [child];
    }
    else {
      conf.textContent = linkData.msg;
    }
    return conf;
  }


  function showErrorDialog_(error) {
    var ui = getStrings_(error);

    // simple OK button for non fatal errors, and a
    // Reload button for fatal...
    var dlg = (!error.fatal) ?
        ModalDialog.info(ui.title, ui.details) :
        ModalDialog.show(ui.title, ui.details, [{
          text: I18n.getMessage('qowt_modal_query_dialog_reload_button'),
          affirmative: true,
          useSameCallbackForCancel: true,
          callback: function() {
            SaveNotificationHandler.suppressUnloadDialogOnce();
            MessageBus.pushMessage({
              id: 'reloadTab',
            });
          }
        }]);

    dlg.addLink(ui.linkData.url, ui.linkData.msg, ui.linkData.download);
    dialogs_.push(dlg);
  }


  function showErrorScreen_(error) {
    var ui = getStrings_(error);

    var link = linkConf_(ui.linkData);

    Html.constructHTML([{
      id: 'error-shim',
      className: 'center-outer-container error-container',
      children: [{
        className: 'center-inner-container',
        children: [{
          id: 'error-icon'
        }, {
          id: 'error-text',
          children: [{
              id: 'error-message',
              textContent: ui.title || ui.message
            }, {
              id: 'error-details',
              textContent: ui.details
            },
            link
          ]
        }]
      }]
    }], document.body);

    var errorLink = document.getElementById('error-link');
    if(errorLink && ui.linkData.download){
      errorLink.onclick = function(event) {
        event.preventDefault();
        MessageBus.pushMessage({
          id:"dcpRequest",
          content:{"name":"download"},
          "qoMessageBus":true
        });
       };
    }
    if(errorLink && ui.linkData.hyperlink) {
      errorLink.onclick = function() {
        MessageBus.pushMessage({
          id: 'createNewTab',
          link: ui.linkData.url
        });
      };
    }
    else if(errorLink && !ui.linkData.download) {
      errorLink.onclick = function() {
        UserFeedback.reportAnIssue();
      };
    }
  }

  return api_;
});
