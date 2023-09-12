/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview tests to ensure the modal dialogs
 * are displayed correctly and behave correctly
 *
 * @author jelte@google.com (Jelte Liebrand)
 *         dtilley@google.com (Dan Tilley)
 */

// JELTE TODO : we *really* need to get away from using PhantomJS
// it does not appear to support fake events so all of these FakeKeyboard
// and FakeEvent tricks fail... For now just only run these tests in the
// browser

if (navigator.userAgent.indexOf('PhantomJS') === -1) {

  define([
    'qowtRoot/interactiontests/waitHelper',
    'qowtRoot/widgets/ui/modalDialog',
    'qowtRoot/unittests/utils/fakeEvents',
    'qowtRoot/utils/domListener',
    'qowtRoot/utils/mockKeyboard/keyboard',
    'qowtRoot/utils/mockKeyboard/keys',
    'qowtRoot/pubsub/pubsub'
  ], function(
      WaitFor,
      ModalDialog,
      FakeEvents,
      DomListener,
      Keyboard,
      keys,
      PubSub) {

  'use strict';

    describe('ModalDialog', function() {
      // make sure we load the modalDialog.css so that all
      // animations run correctly. Without the CSS the code
      // responsible for closing the dialog for example would
      // never run (since it fires on webkitAnimationEnd event)
      var cssLink = document.createElement('link');
      cssLink.setAttribute('rel', 'stylesheet');
      cssLink.setAttribute('type', 'text/css');
      cssLink.setAttribute('href', '../assets/ui/modalDialog.css');
      document.getElementsByTagName('head')[0].appendChild(cssLink);

      // helper function
      var _getByClass = function(className) {
        return document.getElementsByClassName(className);
      };

      var dlg;
      var root;

      beforeEach(function() {
        root = document.createElement('div');
        document.body.appendChild(root);
        ModalDialog.setTarget(root);
      });

      afterEach(function() {
        if (dlg) {
          dlg.destroy();
        }
        // and make sure there are no dialogs left
        var dialogs = _getByClass('qowt-modal-dialog-container');
        expect(dialogs.length).toBe(0);

        // truly clean up for the next test
        document.body.removeChild(root);
      });

      describe('edge case', function() {

        it('should not throw when i create an info dialog without title' +
            ' or text', function() {
              expect(function() {
                dlg = ModalDialog.info();
              }).not.toThrow();
            });

        it('should not throw when i create a confirmation dialog without ' +
            'title or text', function() {
              expect(function() {
                dlg = ModalDialog.confirm();
              }).not.toThrow();
            });

        it('should not throw when i create a query dialog without title or ' +
            'text', function() {
              expect(function() {
                dlg = ModalDialog.query();
              }).not.toThrow();
            });

        it('should not throw when i create a default dialog without title' +
            ' or text', function() {
              expect(function() {
                dlg = ModalDialog.show();
              }).not.toThrow();
            });
      });

      describe('dialog signalling', function() {
        it('should signal qowt:requestFocus when shown.', function() {
          spyOn(PubSub, 'publish').andCallThrough();
          dlg = ModalDialog.info('Hello', 'World');
          expect(PubSub.publish).wasCalled();
          expect(PubSub.publish.mostRecentCall.args[0]).toBe(
              'qowt:requestFocus');
          dlg.destroy();
        });

        it('should signal qowt:requestFocusLost when destroyed.', function() {
          spyOn(PubSub, 'publish').andCallThrough();
          dlg = ModalDialog.info('Hello', 'World');
          dlg.destroy();
          expect(PubSub.publish).wasCalled();
          expect(PubSub.publish.mostRecentCall.args[0]).toBe(
              'qowt:requestFocusLost');
        });
      });

      describe('informational dialog', function() {

        beforeEach(function() {
          dlg = ModalDialog.info('Hello', 'World');
        });
        afterEach(function() {
          dlg.destroy();
        });

        it('should only show one (OK) button', function() {
          var buttons = _getByClass('qowt-dialog-button');
          expect(buttons.length).toBe(1);
        });
      });

      describe('confirmation dialog', function() {

        beforeEach(function() {
          dlg = ModalDialog.confirm('Hello', 'World');
        });
        afterEach(function() {
          dlg.destroy();
        });

        it('should show two (OK and Cancel) buttons', function() {
          var buttons = _getByClass('qowt-dialog-button');
          expect(buttons.length).toBe(2);
        });

      });

      describe('query dialog', function() {

        beforeEach(function() {
          dlg = ModalDialog.query('Hello', 'World');
        });
        afterEach(function() {
          dlg.destroy();
        });

        it('should show Yes and No buttons', function() {
          var buttons = _getByClass('qowt-dialog-button');
          expect(buttons.length).toBe(2);
        });

      });

      describe('key handling', function() {

        it('should close the dialog when user pressed escape', function() {
          // note: we *can* programattically force the dialog
          // to close. This test however is a bit more real
          // in that it fakes an escape key being pressed
          // It thus actually tests the *real* user flow which
          // also means it has to take the closing animation
          // in to account

          spyOn(DomListener, 'addListener').andCallThrough();
          spyOn(DomListener, 'removeListener').andCallThrough();

          runs(function() {
            dlg = ModalDialog.info('Dummy', 'Dialog');
            Keyboard.type(keys('escape'));
          });
          WaitFor.mockKeyboard();

          // wait for the dialog to close (animation takes 180ms)
          waitsFor(function() {
            return !dlg.isShowing();
          }, 'dialog to close', 5000);

          runs(function() {
            // test dialog is indeed gone
            var dialogs = _getByClass('qowt-modal-dialog-container');
            expect(dialogs.length).toBe(0);

            // test listeners are removed
            expect(DomListener.addListener.callCount).toBe(
                DomListener.removeListener.callCount);
          });
        });

        it('should use negative callback on escape', function() {
          var callbacks = {
            onOk: function() {},
            onCancel: function() {}
          };

          spyOn(callbacks, 'onOk');
          spyOn(callbacks, 'onCancel');

          runs(function() {
            dlg = ModalDialog.confirm('Dummy', 'Dialog',
                callbacks.onOk, callbacks.onCancel);
            Keyboard.type(keys('escape'));
          });
          WaitFor.mockKeyboard();

          // wait for the dialog to close (animation takes 180ms)
          waitsFor(function() {
            return !dlg.isShowing();
          }, 'dialog to close', 5000);

          runs(function() {
            expect(callbacks.onOk).not.toHaveBeenCalled();
            expect(callbacks.onCancel).toHaveBeenCalled();
          });
        });

        // JELTE TODO: this works in the real dialog, but under
        // unit tests, this faking of the enter key is not working
        // correctly... commenting out for now rather than removing
        // We should look at this once we fix the FakeKeyboard

        // it("should use affirmative callback on enter", function() {
        //   var dlg;
        //   var callbacks = {
        //     onOk: function() {},
        //     onCancel: function() {}
        //   };

        //   spyOn(callbacks, 'onOk');
        //   spyOn(callbacks, 'onCancel');

        //   runs(function() {
        //     dlg = ModalDialog.confirm('Dummy', 'Dialog',
        //           callbacks.onOk, callbacks.onCancel);
        //     Keyboard.type(keys('enter'));
        //   });
        //   WaitFor.mockKeyboard();

        //   // wait for the dialog to close (animation takes 180ms)
        //   waitsFor(function() {
        //     return !dlg.isShowing();
        //   }, "dialog to close", 5000);

        //   runs(function () {
        //     expect(callbacks.onOk).toHaveBeenCalled();
        //     expect(callbacks.onCancel).not.toHaveBeenCalled();
        //   });
        // });

        it('should stop keys from propagating', function() {
          var x = document.createElement('div');
          var callbacks = {
            onKeyX: function() {
              console.log('keydown on x');
            }
          };
          var spy = spyOn(callbacks, 'onKeyX').andCallThrough();

          Keyboard.setTarget(x);
          DomListener.addListener(x, 'keydown', callbacks.onKeyX);

          runs(function() {
            Keyboard.type(keys('x'));
          });
          WaitFor.mockKeyboard();

          runs(function() {
            expect(callbacks.onKeyX).toHaveBeenCalled();
            spy.reset();
            Keyboard.reset();
          });

          runs(function() {
            dlg = ModalDialog.confirm('x', 'x');
            Keyboard.type(keys('x'));
          });
          WaitFor.mockKeyboard();

          runs(function() {
            expect(callbacks.onKeyX).not.toHaveBeenCalled();
          });

        });

      });

      describe('callback handling', function() {
        var callbacks = {};

        var affirmativeButton;
        var negativeButton;
        var closeButton;

        beforeEach(function() {
          callbacks = {
            onOk: function() {},
            onCancel: function() {}
          };

          spyOn(callbacks, 'onOk');
          spyOn(callbacks, 'onCancel');

          dlg = ModalDialog.confirm('callback', 'test',
              callbacks.onOk, callbacks.onCancel);

          affirmativeButton = _getByClass(
              'qowt-dialog-button affirmative')[0];
          negativeButton = _getByClass(
              'qowt-dialog-button negative')[0];
          closeButton = _getByClass(
              'qowt-dialog-close-button')[0];
        });

        afterEach(function() {
          dlg.destroy();
        });

        it('should call affirmative callback on the correct button',
           function() {
             FakeEvents.simulate(affirmativeButton, 'click');

             expect(callbacks.onOk).toHaveBeenCalled();
             expect(callbacks.onCancel).not.toHaveBeenCalled();
           });

        it('should call negative callback on the correct button', function() {
          FakeEvents.simulate(negativeButton, 'click');

          expect(callbacks.onOk).not.toHaveBeenCalled();
          expect(callbacks.onCancel).toHaveBeenCalled();
        });

        it('should call negative callback when X icon is used to close' +
            ' the dialog', function() {
              FakeEvents.simulate(closeButton, 'click');

              expect(callbacks.onOk).not.toHaveBeenCalled();
              expect(callbacks.onCancel).toHaveBeenCalled();
            });

      });

      describe('add link', function() {

        it('should not show a link on default', function() {
          dlg = ModalDialog.confirm('x', 'x');
          var links = _getByClass('qowt-dialog-link');
          expect(links.length).toBe(0);
        });

        it('should show a link when told to do so', function() {
          dlg = ModalDialog.confirm('x', 'x').addLink();
          var links = _getByClass('qowt-dialog-link');
          expect(links.length).toBe(1);
        });

        it('should have default values for a link and text', function() {
          dlg = ModalDialog.confirm('x', 'x').addLink();
          var link = _getByClass('qowt-dialog-link')[0].firstChild;
          expect(link.textContent.length).toBeGreaterThan(0);
          expect(link.href.length).toBeGreaterThan(0);
        });

        it('should target _blank to open link in a new window', function() {
          dlg = ModalDialog.confirm('x', 'x').addLink();
          var link = _getByClass('qowt-dialog-link')[0].firstChild;
          expect(link.target).toMatch('_blank');
        });

        it('should be possible to set a custom link url', function() {
          var customLinkUrl = 'http://www.foobar.com';
          dlg = ModalDialog.confirm('x', 'x').addLink(customLinkUrl);

          var link = _getByClass('qowt-dialog-link')[0].firstChild;
          expect(link.href).toMatch(customLinkUrl);
        });

        it('should be possible to set custom link and text for the link',
           function() {
             var customLinkText = 'test';
             var customLinkUrl = 'http://www.foobar.com';
             dlg = ModalDialog.confirm('x', 'x').addLink(customLinkUrl,
                 customLinkText);

             var link = _getByClass('qowt-dialog-link')[0].firstChild;
             expect(link.textContent).toMatch(customLinkText);
             expect(link.href).toMatch(customLinkUrl);
           });

        it('should be possible to set a download attribute for the link',
           function() {
             var customLinkText = 'test';
             var customLinkUrl = 'http://www.foobar.xls';
             var customDownloadName = 'foobar.xls';
             dlg = ModalDialog.confirm('x', 'x').addLink(customLinkUrl,
                 customLinkText, customDownloadName);

             var link = _getByClass('qowt-dialog-link')[0].firstChild;
             expect(link.textContent).toMatch(customLinkText);
             expect(link.href).toMatch(customLinkUrl);
             expect(link.download).toMatch(customDownloadName);
           });
      });
    });

    return {};
  });
}
