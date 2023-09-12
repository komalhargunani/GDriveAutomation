define([
  'qowtRoot/dcp/dcpManager',
  'qowtRoot/promise/testing/promiseTester',
  'qowtRoot/interactiontests/waitHelper',
  'qowtRoot/promise/deferred'], function(
  DcpManager,
  PromiseTester,
  WaitHelper,
  Deferred) {

  'use strict';

  describe('QOWT/dcp/dcpManager.js', function() {

    beforeEach(function() {
      DcpManager.handlers = {};
    });

    describe('visit and postTraverse work', function() {
      var callSequence;
      beforeEach(function() {
        callSequence = [];
      });

      var cancelDeferred;
      beforeEach(function() {
        cancelDeferred = new Deferred();
      });

      var res = {
        etp: 'outer',
        elm: [
          {
            etp: 'foo',
            elm: [
              {
                etp: 'baz'
              },
              {
                etp: 'baz'
              }
            ]
          },
          {
            etp: 'bar'
          }
        ]
      };

      var rootDiv, fooDiv, barDiv;
      beforeEach(function() {
        rootDiv = document.createElement('div');
        fooDiv = document.createElement('div');
        barDiv = document.createElement('div');
      });

      var fooHandler = {
        etp: 'foo',

        visit: function(v) {
          callSequence.push('foo.visit');
          expect(v.node).toBe(rootDiv);
          expect(v.el).toBe(res.elm[0]);
          return fooDiv;
        },

        postTraverse: function(v) {
          callSequence.push('foo.postTraverse');
          expect(v.node).toBe(rootDiv);
          expect(v.el).toBe(res.elm[0]);
        }
      };

      var barHandler = {
        etp: 'bar',

        visit: function(v) {
          callSequence.push('bar.visit');
          expect(v.node).toBe(rootDiv);
          expect(v.el).toBe(res.elm[1]);
          return barDiv;
        },

        postTraverse: function(v) {
          callSequence.push('bar.postTraverse');
          expect(v.node).toBe(rootDiv);
          expect(v.el).toBe(res.elm[1]);
        }
      };

      var bazCount;
      beforeEach(function() {
        bazCount = 0;
      });
      var bazHandler = {
        etp: 'baz',

        visit: function(v) {
          callSequence.push('baz.visit');
          expect(v.node).toBe(fooDiv);
          expect(v.el).toBe(res.elm[0].elm[bazCount]);
        },

        postTraverse: function(v) {
          callSequence.push('baz.postTraverse');
          expect(v.node).toBe(fooDiv);
          expect(v.el).toBe(res.elm[0].elm[bazCount]);
          bazCount++;
        }
      };

      var expectedCallSequence =
          ['foo.visit', 'baz.visit', 'baz.postTraverse', 'baz.visit',
           'baz.postTraverse', 'foo.postTraverse', 'bar.visit',
           'bar.postTraverse'];

      var lastDate;
      beforeEach(function() {
        lastDate = 0;
      });
      var clock = {
        getDate: function() {
          lastDate += 100000;
          return lastDate;
        }
      };

      beforeEach(function() {
        DcpManager.handlers[fooHandler.etp] = fooHandler;
        DcpManager.handlers[barHandler.etp] = barHandler;
        DcpManager.handlers[bazHandler.etp] = bazHandler;
      });

      it('should traverse the data structure', function() {
        return new PromiseTester(DcpManager.processDcpResponse(
            res, rootDiv, clock, cancelDeferred.promise))
            .onlyThen(function() {
              expect(callSequence).toEqual(expectedCallSequence);
            });
      });

      it('should make no progress with cancel promise rejected', function() {
        var reason = {};
        cancelDeferred.reject(reason);

        return new PromiseTester(DcpManager.processDcpResponse(
            res, rootDiv, clock, cancelDeferred.promise))
            .expectCatch(reason).onlyThen(function() {
              expect(callSequence).toEqual([]);
            });
      });

      it('should let me cancel in the middle', function() {
        var reason = {};
        var mockDelay = WaitHelper.mockPromiseUtilsDelay();
        var desiredCallSequenceLength = 3;

        var promise = DcpManager.processDcpResponse(
              res, rootDiv, clock, cancelDeferred.promise);

        mockDelay.waitsFor(
            function() {
              return callSequence.length === desiredCallSequenceLength;
            },
            'waits for call sequence length === ' + desiredCallSequenceLength,
            10000);

        runs(function() {
          cancelDeferred.reject(reason);
        });

        runs(function() {
          return new PromiseTester(promise).expectCatch(reason).onlyThen(
            function() {
              expect(callSequence).toEqual(
                  expectedCallSequence.slice(0, desiredCallSequenceLength));
            });
        });
      });
    });
  });
});
