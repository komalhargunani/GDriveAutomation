// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the Save Notification Handler.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
    'qowtRoot/utils/i18n',
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/utils/domListener',
    'qowtRoot/models/fileInfo',
    'qowtRoot/savestate/saveNotificationHandler'
  ],
  function(
    I18n,
    PubSub,
    DomListener,
    FileInfo) {

  'use strict';

  describe('The Save Notification Handler', function() {

    it("should display the appropriate notifications as the doc changes state",
      function() {
      spyOn(PubSub, 'publish').andCallThrough();

      PubSub.publish('qowt:ss:dirty');
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:notification',
        {
          msg: I18n.getMessage('unsaved_changes'),
          timeOut: -1
        });

      PubSub.publish('qowt:ss:saving', {twoPhaseSave: true});
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:notification',
        {
          msg: I18n.getMessage('info_file_saving'),
          timeOut: -1
        });

      PubSub.publish('qowt:ss:savingFailed', {twoPhaseSave: false});
      expect(PubSub.publish.mostRecentCall.args[0]).toEqual(
        'qowt:ss:savingFailed');

      PubSub.publish('qowt:ss:savingFailed', {twoPhaseSave: true});
      expect(PubSub.publish.mostRecentCall.args[0]).toEqual(
        'qowt:notification');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(
        {
        msg: I18n.getMessage('info_file_save_failed'),
        timeOut: -1
        });

      PubSub.publish('qowt:ss:writingFailed');
      expect(PubSub.publish.mostRecentCall.args[0]).toEqual(
        'qowt:notification');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(
        {
        msg: I18n.getMessage('info_file_save_failed'),
        timeOut: -1
        });

      FileInfo.userFileType = 'local';
      PubSub.publish('qowt:ss:saved');
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:notification',
        {
          msg: I18n.getMessage('info_file_saved_locally'),
          fileSavedAtLoc: false
        });

      FileInfo.userFileType = 'local';
      FileInfo.localFilePath = 'someFolder/savedFiles';
      PubSub.publish('qowt:ss:saved');
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:notification',
        {
          msg: I18n.getMessage(
              'info_file_saved_at_location', [FileInfo.localFilePath]),
          fileSavedAtLoc: true,
          location: FileInfo.localFilePath
        });
        FileInfo.localFilePath = undefined;

      FileInfo.userFileType = 'drive';
      PubSub.publish('qowt:ss:saved');
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:notification',
        {
          msg: I18n.getMessage('info_file_saved_in_drive'),
          fileSavedAtLoc: false
        });

      PubSub.publish('qowt:ss:savingCancelled');
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:notification',
        {
          msg: I18n.getMessage('info_file_save_cancelled')
        });

      spyOn(PubSub, 'unsubscribe');
      spyOn(DomListener, 'removeGroup');
      PubSub.publish('qowt:disable');
      expect(PubSub.unsubscribe).toHaveBeenCalled();
      expect(DomListener.removeGroup).toHaveBeenCalledWith(
        'save notification handler');
    });

  });
});

