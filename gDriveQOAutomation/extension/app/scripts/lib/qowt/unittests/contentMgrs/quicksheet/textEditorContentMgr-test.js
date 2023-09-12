// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for text editor content manager.
 *
 * @author upasana.kumari@synerzip.com (Upasana Kumari)
 */

define([
  'qowtRoot/contentMgrs/quicksheet/textEditorContentMgr',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/grid/sysClipboard'],
function(
    TextEditorContentMgr,
    PubSub,
    SysClipboard) {

  'use strict';

  describe('Test initialization of Text Editor Content Manager', function() {

    it('should initialize properly', function() {
      var pubsubSpy = spyOn(PubSub, 'subscribe').andCallThrough();
      TextEditorContentMgr.init();
      expect(PubSub.subscribe).wasCalled();
      expect(pubsubSpy.callCount).toEqual(2);

    });

    it('should throw textEditorContentManager.init() when called multiple' +
        ' times', function() {
          expect(function() {
            TextEditorContentMgr.init();
            TextEditorContentMgr.init();
          }).toThrow('Text Editor Content manager initialized multiple ' +
              'times.');
        });

    it('should do a system clipboard cut when it receives a ' +
        '"qowt:doAction" signal for "cut" ', function() {
          TextEditorContentMgr.init();
          spyOn(SysClipboard, 'cutText');
          PubSub.publish('qowt:doAction', {
            'action': 'cut',
            'context': {
              contentType: 'sheetText'
            }
          });
          expect(SysClipboard.cutText).toHaveBeenCalled();

        });

    it('should do a system clipboard copy when it receives a ' +
        '"qowt:doAction" signal for "copy" ', function() {
          TextEditorContentMgr.init();
          spyOn(SysClipboard, 'copyText');
          PubSub.publish('qowt:doAction', {
            'action': 'copy',
            'context': {
              contentType: 'sheetText'
            }
          });
          expect(SysClipboard.copyText).toHaveBeenCalled();

        });

    it('should do a system clipboard paste when it receives a ' +
        '"qowt:doAction" signal for "paste" ', function() {
          TextEditorContentMgr.init();
          spyOn(SysClipboard, 'paste');
          PubSub.publish('qowt:doAction', {
            'action': 'paste',
            'context': {
              contentType: 'sheetText'
            }
          });
          expect(SysClipboard.paste).toHaveBeenCalled();

        });
  });

});
