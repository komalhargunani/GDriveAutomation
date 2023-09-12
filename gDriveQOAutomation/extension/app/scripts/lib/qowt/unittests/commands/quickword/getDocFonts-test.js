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
  'qowtRoot/commands/quickword/getDocFonts'
], function(
    PubSub,
    GetDocFontsCmd) {

  'use strict';


  describe('QOWT/commands/quickword/GetDocFontsCmd command', function() {
    var subscriptions, cmd;
    beforeEach(function() {
      subscriptions = [];
      cmd = GetDocFontsCmd.create();
    });
    afterEach(function() {
      if (subscriptions && subscriptions.length > 0) {
        for (var ix = 0; ix < subscriptions.length; ix++) {
          PubSub.unsubscribe(subscriptions[ix]);
        }
      }
    });

    describe('initialisation', function() {
      it('should create a correctly configured command', function() {
        expect(cmd.isOptimistic()).toBeFalsy();
        expect(cmd.callsService()).toBeTruthy();
        expect(cmd.name).toBe('getDocFonts');
      });
    });
    describe('dcpData', function() {
      it('must be implemented', function() {
        expect(cmd.dcpData).toBeDefined();
        expect(typeof cmd.dcpData).toBe('function');
      });
      it('must return a JSON object', function() {
        var data = cmd.dcpData();
        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
      });
      it('must set the name property', function() {
        var pl = cmd.dcpData();
        expect(pl.name).toBe('getDocFonts');
      });
    });

    describe('onSuccess', function() {
      it('should be implemented', function() {
        expect(cmd.onSuccess).toBeDefined();
        expect(typeof cmd.onSuccess).toBe('function');
      });
    });

    describe('onFailure', function() {

      var subscriptions;

      beforeEach(function() {
        subscriptions = [];
      });

      afterEach(function() {
        if (subscriptions && subscriptions.length > 0) {
          for (var ix = 0; ix < subscriptions.length; ix++) {
            PubSub.unsubscribe(subscriptions[ix]);
          }
        }
      });

      it('should be implemented', function() {
        expect(cmd.onFailure).toBeDefined();
        expect(typeof(cmd.onFailure)).toBe('function');
      });

    });
  });
});
