/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/contentMgrs/documentContentMgr',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandManager'
], function(
    DocContentMgr,
    PubSub,
    CommandManager) {

  'use strict';

  var openDocDetail = {
    'action': 'openDocument',
    'context': {
      'contentType': 'document',
      'path': 'exampleFilePath'
    }
  };

  describe('contentMgrs/documentContentMgr.js', function() {


    it('should initialise properly', function() {
      var pubsubSpy = spyOn(PubSub, 'subscribe');
      DocContentMgr.init();
      expect(PubSub.subscribe).wasCalled();
      expect(pubsubSpy.callCount).toEqual(13);
    });

    it('should open a doc using the correct compound command.', function() {
      spyOn(CommandManager, 'addCommand');
      DocContentMgr.init();
      PubSub.publish('qowt:doAction', openDocDetail);

      expect(CommandManager.addCommand).wasCalled();
      var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

      // The 'open document' command is a compound command, with a
      // specific set of participating commands each of which gets
      // necessary info. This is a simple regression test to check we
      // don't break file opening in a dumb way.
      expect(containingCmd.childCount()).toBe(5);
    });

    it('should ignore zoom actions before msdoc is ready', function() {
      DocContentMgr.init();

      // Make sure we have not created the msdoc.
      expect(document.body.querySelector('qowt-msdoc')).toBeNull();

      PubSub.publish('qowt:doAction', {
        'action': 'fitToPage',
        'context': {
          'contentType': 'document'
        }
      });
      PubSub.publish('qowt:doAction', {
        'action': 'fitToWidth',
        'context': {
          'contentType': 'document'
        }
      });
      PubSub.publish('qowt:doAction', {
        'action': 'zoomIn',
        'context': {
          'contentType': 'document'
        }
      });
      PubSub.publish('qowt:doAction', {
        'action': 'zoomOut',
        'context': {
          'contentType': 'document'
        }
      });
      PubSub.publish('qowt:doAction', {
        'action': 'actualSize',
        'context': {
          'contentType': 'document'
        }
      });
      PubSub.publish('qowt:doAction', {
        'action': 'toggleZoom',
        'context': {
          'contentType': 'document'
        }
      });

      // All we need to know is that these signals have not thrown an error so
      // if we reached this point, we have ignored them.
      expect(true).toBe(true);
    });
  });
});
