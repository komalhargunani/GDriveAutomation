/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview modal dialog which can be used for
 * a variety of purposes; eg showing confirmation
 * dialogs (OK/Cancel), or info dialogs (OK only)
 *
 * It has a number of chained functions to extend
 * the default behaviour. Example use:
 *
 * // simple use
 *
 * ModalDialog.info('Tip', 'Simple dialog with OK button');
 * ModalDialog.confirm('Uhm...', 'Dialog with OK/Cancel buttons',
 *     okCallback, cancelCallback);
 * ModalDialog.query('Question', 'Dialog with Yes/No buttons',
 *     yesCallback, noCallback);
 *
 * // extending normal dialogs by chaining functions:
 *
 * ModalDialog.confirm('Really', 'Do you want to do this??', okCb, cancelCb)
 *    .addLink('https://www.google.com', 'Google', 'internet.zip')
 *    .addLink('https://www.wikipedia.org', 'Wikipedia', 'knowledge.rar');
 *
 * // callbacks are optional
 *
 * ModalDialog.info('Tip', 'You can do x by swiping')
 *     .addLink('www.learn.com', 'Learn more');
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/eventUtils',
  'qowtRoot/utils/userFeedback',
  'qowtRoot/utils/i18n',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/platform'], function(
  PubSub,
  EventUtils,
  UserFeedback,
  I18n,
  TypeUtils,
  DomListener,
  Platform) {

  'use strict';

  var _factory = {

    /**
     * optional function to tell this factory where to
     * attach the dialogs to. Will default to document.body
     * if not used. This can be useful for unit tests
     *
     * @param target {HTML Element} the element to append dialogs to
     */
    setTarget: function(target) {
      _target = target || document.body;
    },

    /**
     * show a simple dialog with only one OK button
     *
     * @param opt_title {string} title for the dialog
     * @param opt_msg {string} text message for the body of the dialog
     * @param opt_callback {function} callback when the OK button is pressed
     */
    info: function(opt_title, opt_msg, opt_callback) {
      var instance = _factory.show(opt_title, opt_msg, [{
        text: I18n.getMessage('qowt_modal_info_dialog_affirmative_button'),
        affirmative: true,
        callback: opt_callback
      }]);
      return instance;
    },

    /**
     * show a confirmation dialog with OK and Cancel buttons
     *
     * @param opt_title {string} title for the dialog
     * @param opt_msg {string} text message for the body of the dialog
     * @param opt_OkCallback {function} callback for OK button
     * @param opt_CancelCallback {function} called for Cancel button
     *                                      and if user hits Escape or presses
     *                                      the X close button
     */
    confirm: function(opt_title, opt_msg, opt_OkCallback, opt_CancelCallback) {
      var instance = _factory.show(opt_title, opt_msg, [{
        text: I18n.getMessage('qowt_modal_confirm_dialog_affirmative_button'),
        affirmative: true,
        callback: opt_OkCallback
      }, {
        text: I18n.getMessage('qowt_modal_confirm_dialog_negative_button'),
        negative: true,
        callback: opt_CancelCallback
      }]);
      return instance;
    },

    /**
     * show a query dialog with Yes and No buttons
     *
     * @param opt_title {string} title for the dialog
     * @param opt_msg {string} text message for the body of the dialog
     * @param opt_YesCallback {function} callback for Yes button
     * @param opt_NoCallback {function} called for No button
     *                                      and if user hits Escape or presses
     *                                      the X close button
     */
    query: function(opt_title, opt_msg, opt_YesCallback, opt_NoCallback) {
      var instance = _factory.show(opt_title, opt_msg, [{
        text: I18n.getMessage('qowt_modal_query_dialog_affirmative_button'),
        affirmative: true,
        callback: opt_YesCallback
      }, {
        text: I18n.getMessage('qowt_modal_query_dialog_negative_button'),
        negative: true,
        callback: opt_NoCallback
      }]);
      return instance;
    },

    /**
     * show a dialog by providing your own dialog buttons
     *
     * @param {String} opt_title Title for the dialog
     * @param {String} opt_msg Text message for the body of the dialog
     * @param {Array} buttonArray Array of button config object consisting of:
     *        {String} buttonConfig.text The text for the button
     *        {Function} buttonConfig.callback Optional callback for this button
     *        {Boolean} buttonConfig.affirmative Optional boolean to indicate
     *                                           that this button is affirmative
     *                                           which will make it auto-focus
     *        {Boolean} buttonConfig.negative Optional boolean to indicate
     *                                        that this button is negative
     *                                        which means its callback will
     *                                        be triggered if the user hits
     *                                        escape or closes the dialog with
     *                                        the C close button
     *        {Boolean} buttonConfig.useSameCallbackForCancel Optional boolean
     *                                        to indicate that same callback
     *                                        will be triggered if the user hits
     *                                        escape or closes the dialog with
     *                                        the close button. In case of
     *                                        negative button this property is
     *                                        not required, negative button
     *                                        callback will be called.
     *
     * @param {String} opt_imageClass Class identifier. If present adds a full
     *        width image div below the title and above the message and applies
     *        the given class name. Assumes you set the image in css.
     *
     */
    show: function(opt_title, opt_msg, buttonArray, opt_imageClass) {
      var instance = _dialog({
        title: opt_title,
        msg: opt_msg,
        buttons: buttonArray,
        imageClass: opt_imageClass
      });

      return instance;
    },

    /**
     * remove any record of previous user choices for the given key
     *
     * @param key {string} the key to clear
     */
    forgetChoice: function(choice) {
      window.localStorage.removeItem(choice);
    }


  };
  // vvvvvvvvvvvvvvvvvvvvvv module implementation vvvvvvvvvvvvvvvvvvvvvvvv

  var _uniqId = 0,
      _target = document.body;

  var _dialog = function(config) {

    var _api = {


      /**
       * @return {boolean} determines if the dialog is currently up
       */
      isShowing: function() {
        return _dlg !== undefined;
      },

      /**
       * programatically destroy the dialog.
       * NOTE: no closing animation will occur, and no
       * callbacks will be fired either!
       * Mostly used for unit testing
       */
      destroy: function() {
        _destroy();
      },

      /**
       * Programatically close this dialog. Typically required only for specific
       * clean up, such as in optimistic command onFailure.
       *
       * Calling this function with the optional parameter, will close the
       * dialog with invoking the desired button action. For eg.
       *
       * var dlg;
       *  ... dlg.close("affirmative");
       *
       *  This will close the dialog and invokes callback function attached to
       *  the affirmative "OK" or "Yes" button (with respect to the dialog).
       *
       * @param {string} opt_choice - Optional parameter to close the dialog
       *    with the desired button option. There are 2 options for button-
       *    1. affirmative - invoking "OK" or "Yes" button action.
       *    2. negative - invoking "Cancel" or "No" button action.
       * @public
       */
      close: function(opt_choice) {
        if (opt_choice) {
          if (opt_choice === "affirmative" && _affirmativeButton) {
            opt_choice = _affirmativeButton.textContent; //"OK"
          } else if (opt_choice === "negative" && _negativeButton) {
            opt_choice = _negativeButton.textContent; //"Cancel"
          }
          _handleChoice(opt_choice);
        } else {
          _close();
        }
      },

      /**
       * "chained function" to add a hyperlink to the dialog
       *
       * var dlg = ModalDialog.info('Tip', 'You can do x y z')
       *             .addLink('http://www.google.com', 'Search');
       *
       * @param opt_url {string} optional url for the link. If not defined
       *                         then it will default to the chrome feeback URL
       * @param opt_text {string} optional string used for the link
       *                          defaults to "Learn more"
       * @param opt_download {string} if present will invoke a native download
       *                          of the opt_url to a file named opt_download
       */
      addLink: function(opt_url, opt_text, opt_download) {
        var link = document.createElement('a');
        link.classList.add('qowt-dialog-link');
        link.setAttribute('tabindex', '0');
        if (opt_url) {
          link.href = opt_url;
          link.target = '_blank';
        } else {
          link.href = '#';
          link.onclick = function() {
            UserFeedback.reportAnIssue();
          };
        }

        link.textContent = opt_text ||
            I18n.getMessage('qowt_modal_dialog_link_text');
        if (opt_download) {
          link.setAttribute('download', opt_download);
        }

        // If we have 'report the/an issue' at the end of string and the link
        // text is the same then remove redundant text.
        // TODO : Ideally our error messages should be such that
        // they don't have redundant text. Currently we have old messages and
        // new messages, having different text. Also, we are improving our error
        // messages, once that is done we need to revisit this and have uniform
        // messages to fix this once and for all.
        var endsWithStr = _msg.textContent.match(/report (the|an) issue.?$/);
        if (endsWithStr &&
            link.textContent.match(/^report (the|an) issue.?$/i)) {
          _msg.textContent = _msg.textContent.substr(
              0, _msg.textContent.lastIndexOf(endsWithStr[0]));
          link.textContent = link.textContent.toLowerCase();
        }
        // add a space after the message so that it's separated from the link
        if (!_msg.textContent.endsWith(' ')) {
          _msg.textContent += ' ';
        }
        _msg.appendChild(link);

        _center();

        // return this api object for further chaining
        return _api;
      },

      /**
       * "chained function" to add a paragraph to the dialog
       *
       * var dlg = ModalDialog.info('Tip', 'You can do x y z')
       *             .addParagraph('Paragraph text here.');
       *
       * @param text {string} text that makes up the paragraph.
       *
       *
       */
      addParagraph: function(text) {
        var paragraph = document.createElement('p');
        var textNode = document.createTextNode(text);
        paragraph.classList.add('qowt-dialog-msg');
        paragraph.setAttribute('id', 'dialogDesc1');
        paragraph.appendChild(textNode);
        _content.appendChild(paragraph);

        _center();

        // return this api object for further chaining
        return _api;
      },

      /**
       * "chained function" to add a hyperlink to the dialog
       * This alternate version is necessary to support multi
       * paragraph modal dialogs. The previous addLink method
       * uses textContent which collapses all paragraphs into
       * the content of the message div. This method preserves
       * any paragraph elements and adds the link to the last
       * one.
       *
       * var dlg = ModalDialog.info('Tip', 'You can do x y z')
       *             .addLink('http://www.google.com', 'Search');
       *
       * @param opt_url {string} optional url for the link. If not defined
       *                         then it will default to the chrome feeback URL
       * @param opt_text {string} optional string used for the link
       *                          defaults to "Learn more"
       * @param opt_download {string} if present will invoke a native download
       *                          of the opt_url to a file named opt_download
       */
       addLinkToParagraph: function(opt_url, opt_text, opt_download) {
        var link = document.createElement('a');
        link.classList.add('qowt-dialog-link');
        link.setAttribute('tabindex', '0');
        link.target = '_blank';
        link.href = opt_url ||
            "chrome://feedback/#0?" +
            "description=&" +
            "categoryTag=FromQuickoffice&customPageUrl=" + window.location.href;
        var linkText = opt_text ||
            I18n.getMessage('qowt_modal_dialog_link_text');
        var textNode = document.createTextNode(linkText);
        link.appendChild(textNode);
        if (opt_download) {
          link.setAttribute('download', opt_download);
        }

        // add a space after the message so that it's separated from the link
        //_msg.textContent += ' ';
        _content.lastChild.appendChild(link);

        _center();

        // return this api object for further chaining
        return _api;
      },

      /**
       * "Chained function" to add a class to the dialog element. This function
       * is used to apply different styles to different dialogs.
       *
       * @param dialogClass {string} the name of the class to add to _dlg.
       * @return {Object} the module encapsulating the entire dialog.
       */
      addDialogClass: function(dialogClass) {
        if(!_dlg) {
          throw new Error('Dialog has not been constructed, so class ' +
            'cannot be added.');
        }

        _dlg.classList.add(dialogClass);
        _center();
        return _api;
      }
    };
    // vvvvvvvvvvvvvvvvvvvvvv PRIVATE to Dialog Instance vvvvvvvvvvvvvvvvvv
    var _id,
        _container,
        _dlg,
        _content,
        _title,
        _msg,
        _image,
        // left, right, and animation are for conversion progress dialog
        _leftImage,
        _rightImage,
        _animation,
        _footer,
        _menu,
        _callbacks = {},
        _affirmativeButton,
        _negativeButton;

    // construct basic html containers
    var _construct = function() {
      _id = 'qowt-dialog-' + _uniqId;

      // we append the container and the dialog to the document in the _init()
      // function below
      _container = document.createElement('div');
      _container.classList.add('qowt-modal-dialog-container');
      _container.id = _id;

      _dlg = document.createElement('div');
      _dlg.classList.add('qowt-modal-dialog');
      _dlg.setAttribute('aria-labelledby', 'dialogLabel dialogDesc1' +
        ' dialogDesc2');
      _dlg.setAttribute('aria-describedby', 'dialogDesc3 close');
      _dlg.setAttribute('role', 'dialog');
      if (Platform.isCros === true &&
        (config.title === I18n.getMessage('app_nacl_crash_title') ||
          config.title === I18n.getMessage('textual_edit_error_short_msg'))) {
          this.removeAttribute('aria-labelledby');
          this.removeAttribute('aria-describedby');
      }
      // Create the content container for everything below the title to above
      // the footer in the dialog.
      _content = document.createElement('div');
      _content.classList.add('qowt-dialog-content');

      // Setup an accessible close button widget for the dialog.
      var closeButton = document.createElement('button');
      closeButton.id = 'qowt-dialog-close-button';
      closeButton.classList.add('qowt-dialog-close-button');
      closeButton.setAttribute('tabindex', '0');
      closeButton.setAttribute('aria-label',
          I18n.getMessage('close_dialog_aria_spoken_word'));
      DomListener.add(_id, closeButton, 'click', _handleButton);

      // Arranging the DOM to be accessible, ensuring DOM order and layout
      // order are intuitive and match.
      _title = _title && _dlg.appendChild(_title);
      _image = _image && _content.appendChild(_image);
      _msg = _msg && _content.appendChild(_msg);
      _dlg.appendChild(_content);
      _dlg.appendChild(_footer);
      _dlg.appendChild(closeButton);

      // make sure to catch the keys on the top most level (eg the window)
      // and during capture phase, so that we can stop the propogation
      DomListener.add(_id, window, 'keydown', _handleKeyDown, true);
    };

    // set a title if we have one
    var _setTitle = function() {
      if (config.title) {
        _title = document.createElement('div');
        _title.setAttribute('id', 'dialogLabel');
        _title.classList.add('qowt-dialog-title');
        _title.textContent = config.title;
      }
    };

    // set a msg if we have one
    var _setMessage = function() {
      if (config.msg) {
        _msg = document.createElement('p');
        var textNode = document.createTextNode(config.msg);
        _msg.setAttribute('id', 'dialogDesc1');
        _msg.classList.add('qowt-dialog-msg');
        _msg.appendChild(textNode);
      }
    };

    /**
     * @private
     * Set an image if we have one.
     */
    var _setImage = function() {
      if (config.imageClass) {
        _image = document.createElement('div');
        if(TypeUtils.isObject(config.imageClass)) {
          // for a conversion dialog, _image will be a div that holds the
          // two images and the animation
          _image.classList.add('qowt-dialog-conversion');

          // optional class, used when, e.g., graying out icons during failure
          if(config.imageClass.all) {
            _image.classList.add(config.imageClass.all);
          }

          _leftImage = document.createElement('div');
          _animation = _buildAnimation(config.imageClass.animate);
          _rightImage = document.createElement('div');

          _leftImage.classList.add('qowt-dialog-conversion-image');
          _leftImage.classList.add(config.imageClass.left);
          _animation.classList.add('qowt-dialog-conversion-animation');
          _rightImage.classList.add('qowt-dialog-conversion-image');
          _rightImage.classList.add(config.imageClass.right);

          _image.appendChild(_leftImage);
          _image.appendChild(_animation);
          _image.appendChild(_rightImage);
        }
        else if (TypeUtils.isString(config.imageClass)) {
          _image.classList.add('qowt-dialog-image');
          _image.classList.add(config.imageClass);
        }
        else {
          throw new Error('imageClass must either be a string or object, ' +
            'but you gave me: ' + config.imageClass);
        }
      }
    };

    /**
     * @private
     * Assemble the HTML to display the conversion progress animation.
     * TODO(davidshimel) implement the animation as a custom element.
     */
    var _buildAnimation = function(animate) {
      var animation = document.createElement('div');

      var container = document.createElement('div');
      container.classList.add('dot-container');
      animation.appendChild(container);

      for(var i = 1; i <= 3; i++) {
        var dot = document.createElement('div');
        dot.classList.add('dot');
        dot.classList.add('dot-' + i + '-pos');
        if(animate) {
          dot.classList.add('dot-' + i + '-anim');
        }
        container.appendChild(dot);
      }

      return animation;
    };

    // consruct the footer (buttons container)
    var _setFooter = function() {
      _footer = document.createElement('div');
      _footer.classList.add('qowt-modal-dialog-footer');
    };

    // construct buttons and set up callbacks
    var _setButtons = function() {
      if (config.buttons) {
        _menu = document.createElement('menu');
        _menu.classList.add('qowt-dialog-menu');
        DomListener.add(_id, _menu, 'click', _handleButton);

        config.buttons.forEach(function(buttonConfig) {
          _constructButton(buttonConfig);
        });

        _footer.appendChild(_menu);
      }
    };

    var _constructButton = function(buttonConfig) {
      var buttonId = 'qowt-dialog-button-' + _uniqId++;

      // keep track of this button's callback
      _callbacks[buttonConfig.text] = buttonConfig.callback;
      if (buttonConfig.useSameCallbackForCancel) {
        _callbacks.cancel = buttonConfig.callback;
      }


      // construct the button element
      var el = document.createElement('button');
      el.id = buttonId;
      el.classList.add('qowt-dialog-button');
      el.textContent = buttonConfig.text;
      el.setAttribute('tabindex', '0');

      // keep track of affirmative and negative buttons
      if (buttonConfig.affirmative) {
        el.classList.add('affirmative');
        _affirmativeButton = el;
      }
      if (buttonConfig.negative) {
        el.classList.add('negative');
        _negativeButton = el;
      }

      _menu.appendChild(el);
    };


    var _handleKeyDown = function(evt) {
      if (EventUtils.isSaveKeyCombo(evt) || EventUtils.isUndoRedoCombo(evt)) {
        evt.preventDefault();
        evt.stopPropagation();
        return;
      }
      // JELTE TODO: sort out our key handling... too many places hardcode
      // key codes like this...
      var _kEscKeyCode = 27;
      var _kBackspaceKeyCode = 8;

      if (evt && evt.keyCode) {
        switch (evt.keyCode) {

        case _kBackspaceKeyCode:
          // don't let the browser go back in history on backspace when
          // the modal dlg is up. (Note: this is an easy use case if I
          // was editing the document and an error occured. I might still
          // be typing and hitting backspace. Result would be a flash of
          // a dialog before navigation happens and the user is left clueless
          // as to why...)
          evt.preventDefault();
          break;

        case _kEscKeyCode:
          var choice = _negativeButton ? _negativeButton.textContent : 'cancel';
          _handleChoice(choice);
          break;

        default:
          break;
        }
      }

      // stop propogation of this event so our app will not
      // respond to it "underneath" this dialog. But do not
      // call preventDefault because we do not want to hijack
      // generic browser keys such as cmd-p to print for example
      evt.stopPropagation();
    };

    var _handleButton = function(evt) {
      if (evt && evt.target && evt.target.id) {
        var buttonId = evt.target.id;
        if (buttonId === 'qowt-dialog-close-button') {
          var choice = _negativeButton ? _negativeButton.textContent : 'cancel';
          _handleChoice(choice);
        } else {
          _handleChoice(evt.target.textContent);
        }
      }
    };

    var _handleChoice = function(choice) {
      if (choice) {
        var callback = _callbacks[choice];
        if (callback) {
          callback();
        }
      }
      _close();
    };

    /*
     * TODO(cuiffo): We should not have to do this, but we have to because we
     * add classes and text after the dialog is originally created and drawn.
     * We want to fix this later so that we first add all classes and text,
     * then finally draw it.
     */
    var _center = function() {
      _dlg.setAttribute('aria-labelledby', 'dialogLabel dialogDesc1' +
        ' dialogDesc2');
      _dlg.setAttribute('aria-describedby', 'dialogDesc3 close');
      _dlg.setAttribute('role', 'dialog');
      _dlg.style.marginTop = -(_dlg.offsetHeight/2) + 'px';
      _dlg.style.marginLeft = -(_dlg.offsetWidth/2) + 'px';
    };

    var _show = function() {
      // Tell QOWT this widget wants control.
      if (Platform.isCros === true &&
        (config.title === I18n.getMessage('app_nacl_crash_title') ||
          config.title === I18n.getMessage('textual_edit_error_short_msg'))) {
          this.removeAttribute('aria-labelledby');
          this.removeAttribute('aria-describedby');
      }
      PubSub.publish('qowt:requestFocus', {contentType: 'modalDialog'});
      _dlg.focus();
    };

    var _close = function() {
      if(_dlg) {
        _destroy();
      }
    };

    var _destroy = function() {
      // Tell QOWT this widget no longer is in control.
      PubSub.publish('qowt:requestFocusLost', {contentType: 'modalDialog'});

      // remove any and all listeners for our _id
      if (_id) {
        DomListener.removeGroup(_id);
      }

      // now remove ourselves from the DOM
      // have to remove the dialog separately because it's not a child of
      // the container
      _removeElement(_dlg);
      _removeElement(_container);

      // and dereference
      _id = undefined;
      _container = undefined;
      _dlg = undefined;
      _content = undefined;
      _title = undefined;
      _msg = undefined;
      _image = undefined;
      _leftImage = undefined;
      _rightImage = undefined;
      _animation = undefined;
      _callbacks = {};
      _affirmativeButton = undefined;
      _negativeButton = undefined;
    };

    var _removeElement = function(element) {
      if(element) {
        var parent = element.parentNode;
        if(parent) {
          parent.removeChild(element);
        }
      }
    };

    var _init = function() {
      // increase the factory uniq id counter
      _uniqId++;

      _setTitle();
      _setImage();
      _setMessage();
      _setFooter();
      _setButtons();
      _construct();

      // now add ourselves to the target
      _target.appendChild(_container);
      _target.appendChild(_dlg);

      // now that we are in the DOM, focus our affirmative button
      if (_affirmativeButton) {
        _affirmativeButton.focus();
      }

      // Expand the dialog width if it is too narrow for the image.
      if (_image && _image.offsetWidth > _dlg.offsetWidth) {
        _dlg.style.width = _image.offsetWidth + 'px';
      }

      _center();

      // and show the dialog
      _show();
    };

    _init();
    return _api;
  };

  return _factory;
});
