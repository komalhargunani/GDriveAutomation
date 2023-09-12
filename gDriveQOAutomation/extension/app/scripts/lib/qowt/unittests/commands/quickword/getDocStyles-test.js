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
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/errors/unique/corruptFileError',
  'qowtRoot/commands/quickword/getDocStyles'
], function(PubSub, CorruptFileError, GetDocStylesCmd) {

  'use strict';


  describe('QOWT/commands/quickword/GetDocStylesCmd command', function() {
    var subscriptions, cmd, observedEvent, observedEventDetail,
        eventHandler;
    beforeEach(function() {
      subscriptions = [];
      cmd = GetDocStylesCmd.create();
      eventHandler = function(event, detail) {
        observedEvent = event;
        observedEventDetail = detail;
      };
    });
    afterEach(function() {
      if (subscriptions && subscriptions.length > 0) {
        for (var ix = 0; ix < subscriptions.length; ix++) {
          PubSub.unsubscribe(subscriptions[ix]);
        }
      }
      observedEvent = undefined;
    });

    describe('initialisation', function() {
      it('should create a correctly configured command', function() {
        expect(cmd.isOptimistic()).toBeFalsy();
        expect(cmd.callsService()).toBeTruthy();
        expect(cmd.name).toBe('getDocStyles');
      });
    });

    describe('dcpData', function() {
      it('must be implemented', function() {
        expect(cmd.dcpData).toBeDefined();
        expect(typeof(cmd.dcpData)).toBe('function');
      });
      it('must return a JSON object', function() {
        var data = cmd.dcpData();
        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
      });
      it('must set the name property', function() {
        var pl = cmd.dcpData();
        expect(pl.name).toBe('getDocStyles');
      });
    });

    describe('onSuccess', function() {
      it('should be implemented', function() {
        expect(cmd.onSuccess).toBeDefined();
        expect(typeof(cmd.onSuccess)).toBe('function');
      });
      it('should broadcast a command completion event', function() {
        subscriptions.push(PubSub.subscribe('qowt:getDocStyles', eventHandler));

        cmd.onSuccess({});

        expect(observedEvent).toBe('qowt:getDocStyles');
        expect(observedEventDetail).toBeDefined();
        if (observedEventDetail) {
          expect(observedEventDetail.success).toBeTruthy();
        }
      });
    });

    describe('onFailure', function() {
      it('should be implemented', function() {
        expect(cmd.onFailure).toBeDefined();
        expect(typeof(cmd.onFailure)).toBe('function');
      });

      it('should handle all errors as file open errors', function() {
        expect(function() {
          cmd.onFailure({
            e: 'someOtherGeneralError'
          }, {});
        }).toThrowError(new CorruptFileError());
      });

    });
  });
});
