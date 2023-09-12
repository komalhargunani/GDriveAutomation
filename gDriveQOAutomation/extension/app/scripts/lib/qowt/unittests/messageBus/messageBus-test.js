// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the Message Bus
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/messageBus/messageBusImpl',
  'qowtRoot/configs/common'],
  function(
    MessageBusImpl,
    CommonConfig) {

  'use strict';

  describe("The Message Bus", function() {

    var kGlobal_Value1 = 100;
    var kGlobal_Value2 = 90;
    var kGlobal_Value3 = 80;

    var kGlobal_Val1SetByCallback1 = 18;
    var kGlobal_Val2SetByCallback2 = 39;

    var kGlobal_Val1SetByListener1 = 50;
    var kGlobal_Val2SetByListener2 = 75;
    var kGlobal_Val3SetByListener3 = 20;

    var mb1, mb2, globalValue1, globalValue2, globalValue3;

    var callbackFunc1 = function() {globalValue1 = kGlobal_Val1SetByCallback1;};
    var callbackFunc2 = function() {globalValue2 = kGlobal_Val2SetByCallback2;};

    var listenerFunc1 = function() {globalValue1 = kGlobal_Val1SetByListener1;};

    var listenerFunc2 = function() {globalValue2 = kGlobal_Val2SetByListener2;};
    var filterFunc2 = function() {return true;};

    var listenerFunc3 = function() {globalValue3 = kGlobal_Val3SetByListener3;};
    var filterFunc3 = function() {return false;};

    var emptyObj = {};
    var dummyWindowObj1 = {
      name: 'dummyWindow1',
      addEventListener: function() {
      },
      postMessage: function() {
      }
    };
    var dummyWindowObj2 = {
      name: 'dummyWindow2',
      addEventListener: function() {
      },
      postMessage: function() {
      }
    };

    beforeEach(function() {
      mb1 = new MessageBusImpl(dummyWindowObj1);
      mb2 = new MessageBusImpl(dummyWindowObj2);

      dummyWindowObj1.postMessage = function(message) {
        var msgAsObj = {
          source: dummyWindowObj2,
          data: message,
          origin: 'chrome-extension://gbkeegbaiigmenfmjfclcdgdpimamgkj'
        };
        mb1.handleIncomingMessage_(msgAsObj);
      };

      dummyWindowObj2.postMessage = function(message) {
        var msgAsObj = {
          source: dummyWindowObj1,
          data: message,
          origin: 'chrome-extension://gbkeegbaiigmenfmjfclcdgdpimamgkj'
        };
        mb2.handleIncomingMessage_(msgAsObj);
      };

      globalValue1 = kGlobal_Value1;
      globalValue2 = kGlobal_Value2;
      globalValue3 = kGlobal_Value3;

      // reduce the 5 secs timeout to 2 secs, to shorten the test suite run time
      expect(CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT).toBeDefined();
      CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT = 2000;
    });

    afterEach(function() {
      mb1 = undefined;
      mb2 = undefined;
    });

    describe("connect() method", function() {

      it("should throw if no valid window object is supplied", function() {
        expect(function() {
          mb1.connect();
        }).toThrow('MessageBus: A valid HTML window object has ' +
            'not been provided to connect()');

        expect(function() {
          mb1.connect(null);
        }).toThrow('MessageBus: A valid HTML window object has ' +
            'not been provided to connect()');

        expect(function() {
          mb1.connect('blah');
        }).toThrow('MessageBus: A valid HTML window object has ' +
            'not been provided to connect()');

        expect(function() {
          mb1.connect(7);
        }).toThrow('MessageBus: A valid HTML window object has ' +
            'not been provided to connect()');

        expect(function() {
          mb1.connect(function() {});
        }).toThrow('MessageBus: A valid HTML window object has ' +
            'not been provided to connect()');

        expect(function() {
          mb1.connect(emptyObj);
        }).toThrow('MessageBus: A valid HTML window object has ' +
        'not been provided to connect()');
      });

      it("should throw if it tries to connect to its own window", function() {
        expect(function() {
          mb1.connect(dummyWindowObj1);
        }).toThrow('MessageBus: Trying to connect to its own window');
      });

      it("should throw if a callback function is supplied but it's not " +
        "of the expected type", function() {
        expect(function() {
          mb1.connect(dummyWindowObj2, 'blah');
        }).toThrow('MessageBus: The provided callback function ' +
            'is not of the correct type');

        expect(function() {
          mb1.connect(dummyWindowObj2, 8);
        }).toThrow('MessageBus: The provided callback function ' +
            'is not of the correct type');

        expect(function() {
          mb1.connect(dummyWindowObj2, {});
        }).toThrow('MessageBus: The provided callback function ' +
            'is not of the correct type');
      });

      it("should throw if called with a window that it is already trying " +
        "to connect to", function() {
        expect(function() {
          mb1.connect(dummyWindowObj2);
        }).not.toThrow();

        expect(function() {
          mb1.connect(dummyWindowObj2);
        }).toThrow('MessageBus: Trying to connect to a window ' +
            'that we are already trying to connect to');
      });

      it("should not connect to a window if that window is not connecting back",
        function() {
          runs(function() {
            mb1.connect(dummyWindowObj2);
          });

          waits(CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);

          runs(function() {
            expect(mb1.isConnectedTo(dummyWindowObj2)).toBe(false);
          });
      });

      it("should reject the connection promise if not successfully " +
        "connected within the timeout period", function() {
          // make the timeout a negative number so that
          // the attempt to connect fails immediately
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT = -1;

          var globalMsg;
          runs(function() {
            mb1.connect(dummyWindowObj2).then(
              // callback if promise is resolved
              function() {
              },
              // callback if promise is rejected
              function(error) {
                expect(error).toBeDefined();
                globalMsg = error.message;
              }
            );
          });

          waitsFor(function() {
            return globalMsg === CommonConfig.
              kMESSAGE_BUS_CONNECTION_TIMEOUT_MSG;
          }, "wait for the connection promise to be rejected", 7000);
      });

      it("should not invoke the callback function if a successful connection " +
        "is not established", function() {
          expect(globalValue1).toBe(kGlobal_Value1);

          runs(function() {
            mb1.connect(dummyWindowObj2, callbackFunc1);
          });

          waits(CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);

          runs(function() {
            expect(mb1.isConnectedTo(dummyWindowObj2)).toBe(false);
            expect(globalValue1).toBe(kGlobal_Value1);
          });
      });

      it("should successfully allow window A and window B to connect to " +
        "each other", function() {
          runs(function() {
            mb1.connect(dummyWindowObj2);
            mb2.connect(dummyWindowObj1);
          });

          waitsFor(function() {
            return mb1.isConnectedTo(dummyWindowObj2) &&
            mb2.isConnectedTo(dummyWindowObj1);
          }, "The windows should have connected to each other",
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);
      });

      it("should resolve the connection promise if a connection is successful",
        function() {
          var globalVal = 0;
          runs(function() {
            mb1.connect(dummyWindowObj2).then(
              // callback if promise is resolved
              function() {
                globalVal += 20;
              },
              // callback if promise is rejected
              function() {
              }
            );
            mb2.connect(dummyWindowObj1).then(
              // callback if promise is resolved
              function() {
                globalVal += 15;
              },
              // callback if promise is rejected
              function() {
              }
            );
          });

          waitsFor(function() {
            return globalVal === 35;
          }, "wait for the connection promises to be resolved", 7000);
      });

      it("should successfully allow window A and window B to connect to " +
        "each other, even allowing for a delay from one side", function() {
          runs(function() {
            mb1.connect(dummyWindowObj2);
          });

          waits(CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT/2);
          runs(function() {
            mb2.connect(dummyWindowObj1);
          });

          waitsFor(function() {
            return mb1.isConnectedTo(dummyWindowObj2) &&
            mb2.isConnectedTo(dummyWindowObj1);
          }, "The windows should have connected to each other",
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);
      });

      it("should invoke the callback function once a successful connection " +
        "has been established", function() {
          expect(globalValue1).toBe(kGlobal_Value1);
          expect(globalValue2).toBe(kGlobal_Value2);

          runs(function() {
            mb1.connect(dummyWindowObj2, callbackFunc1);
            mb2.connect(dummyWindowObj1, callbackFunc2);
          });

          waitsFor(function() {
            return mb1.isConnectedTo(dummyWindowObj2) &&
            mb2.isConnectedTo(dummyWindowObj1);
          }, "The windows should have connected to each other",
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);

          runs(function() {
            expect(globalValue1).toBe(kGlobal_Val1SetByCallback1);
            expect(globalValue2).toBe(kGlobal_Val2SetByCallback2);
          });
      });

      it("should throw if called with a window that it is already " +
        "connected to", function() {
          runs(function() {
            mb1.connect(dummyWindowObj2);
            mb2.connect(dummyWindowObj1);
          });

          waitsFor(function() {
            return mb1.isConnectedTo(dummyWindowObj2) &&
            mb2.isConnectedTo(dummyWindowObj1);
          }, "The windows should have connected to each other",
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);

          runs(function() {
            expect(function() {
              mb1.connect(dummyWindowObj2);
            }).toThrow('MessageBus: Trying to connect to a window ' +
                'that has already been connected');
          });
      });

    });

    describe("pushMessage() method", function() {

      it("should throw if no valid message object is supplied", function() {
          expect(function() {
            mb1.pushMessage();
          }).toThrow('MessageBus: A valid message object has ' +
          'not been provided to pushMessage()');

          expect(function() {
            mb1.pushMessage(null);
          }).toThrow('MessageBus: A valid message object has ' +
          'not been provided to pushMessage()');

          expect(function() {
            mb1.pushMessage('blah');
          }).toThrow('MessageBus: A valid message object has ' +
          'not been provided to pushMessage()');

          expect(function() {
            mb1.pushMessage(4);
          }).toThrow('MessageBus: A valid message object has ' +
          'not been provided to pushMessage()');

          expect(function() {
            mb1.pushMessage(function() {});
          }).toThrow('MessageBus: A valid message object has ' +
          'not been provided to pushMessage()');
      });

      it("should buffer messages if no connection and send them " +
        "when connection established.", function() {
          var obj = {text: 'early message'};
          spyOn(dummyWindowObj2, 'postMessage').andCallThrough();

          expect(function() {
             mb1.pushMessage(obj);
          }).not.toThrow();

          runs(function() {
            mb1.connect(dummyWindowObj2);
            mb2.connect(dummyWindowObj1);
          });

          waitsFor(function() {
            return mb1.isConnectedTo(dummyWindowObj2) &&
            mb2.isConnectedTo(dummyWindowObj1);
          }, "The windows should have connected to each other",
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);

          runs(function() {
            expect(dummyWindowObj2.postMessage).toHaveBeenCalledWith(obj, '*');
          });
      });

      it("should buffer and send more messages than max queue length, " +
        "when connection established.", function() {
          var maxQueueLength = 10;
          var connectionCount = 3;
          var msgCount = maxQueueLength + 5;
          var totalCount = msgCount + connectionCount;

          spyOn(dummyWindowObj2, 'postMessage').andCallThrough();

          for(var i=1; i <= msgCount; i++) {
            var obj = {text: 'early message ' + i};
            expect(function() {
              mb1.pushMessage(obj);
            }).not.toThrow();
          }

          runs(function() {
            mb1.connect(dummyWindowObj2);
            mb2.connect(dummyWindowObj1);
          });

          waitsFor(function() {
            return mb1.isConnectedTo(dummyWindowObj2) &&
            mb2.isConnectedTo(dummyWindowObj1);
          }, "The windows should have connected to each other",
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);

          runs(function() {
            expect(dummyWindowObj2.postMessage.callCount).toBe(totalCount);
          });
      });

      it("should mark the specified message as a QO message", function() {
          runs(function() {
            mb1.connect(dummyWindowObj2);
            mb2.connect(dummyWindowObj1);
          });

          waitsFor(function() {
            return mb1.isConnectedTo(dummyWindowObj2) &&
            mb2.isConnectedTo(dummyWindowObj1);
          }, "The windows should have connected to each other",
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);

          runs(function() {
            var obj = {text: 'hello'};
            expect(obj.qoMessageBus).toBe(undefined);
            mb1.pushMessage(obj);
            expect(obj.qoMessageBus).toBe(true);
          });
      });

      it("should post the specified message to all connected " +
        "message bus instances", function() {
          runs(function() {
            mb1.connect(dummyWindowObj2);
            mb2.connect(dummyWindowObj1);
          });

          waitsFor(function() {
            return mb1.isConnectedTo(dummyWindowObj2) &&
            mb2.isConnectedTo(dummyWindowObj1);
          }, "The windows should have connected to each other",
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);

          runs(function() {
            spyOn(dummyWindowObj2, 'postMessage');
            var obj = {text: 'hello'};
            mb1.pushMessage(obj);
            expect(dummyWindowObj2.postMessage).toHaveBeenCalledWith(obj, '*');
          });
      });
    });

    describe("listen() method", function() {

      it("should throw if no valid listener function is supplied", function() {
        expect(function() {
          mb1.listen();
        }).toThrow('MessageBus: A valid listener function has ' +
            'not been provided to listen()');

        expect(function() {
          mb1.listen(null);
        }).toThrow('MessageBus: A valid listener function has ' +
            'not been provided to listen()');

        expect(function() {
          mb1.listen('blah');
        }).toThrow('MessageBus: A valid listener function has ' +
            'not been provided to listen()');

        expect(function() {
          mb1.listen(7);
        }).toThrow('MessageBus: A valid listener function has ' +
            'not been provided to listen()');

        expect(function() {
          mb1.listen({});
        }).toThrow('MessageBus: A valid listener function has ' +
            'not been provided to listen()');
      });

      it("should throw if a filter function is supplied " +
        "but it's not of the expected type", function() {
        expect(function() {
          mb1.listen(listenerFunc2, 'blah');
        }).toThrow('MessageBus: The provided filter function ' +
            'is not of the correct type');

        expect(function() {
          mb1.listen(listenerFunc2, 7);
        }).toThrow('MessageBus: The provided filter function ' +
            'is not of the correct type');

        expect(function() {
          mb1.listen(listenerFunc2, {});
        }).toThrow('MessageBus: The provided filter function ' +
            'is not of the correct type');
      });

      it("should successfully register a valid listener function", function() {
        expect(function() {
          mb1.listen(listenerFunc1);
        }).not.toThrow();
      });

      it("should successfully register a valid listener function " +
        "and a valid filter function", function() {
        expect(function() {
          mb1.listen(listenerFunc2, filterFunc2);
        }).not.toThrow();
      });

      it("should allow a registered listener function to be invoked " +
        "when an incoming client message is received", function() {
          runs(function() {
            mb1.connect(dummyWindowObj2);
            mb2.connect(dummyWindowObj1);
          });

          waitsFor(function() {
            return mb1.isConnectedTo(dummyWindowObj2) &&
            mb2.isConnectedTo(dummyWindowObj1);
          }, "The windows should have connected to each other",
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);

          runs(function() {
            expect(globalValue2).toBe(kGlobal_Value2);
            mb2.listen(listenerFunc2);
            var obj = {text: 'hello'};
            mb1.pushMessage(obj);
            expect(globalValue2).toBe(kGlobal_Val2SetByListener2);
          });
      });

      it("should allow a registered listener function to be invoked " +
        "when an incoming client message is received that matches the " +
        "listener function's filter", function() {
          runs(function() {
            mb1.connect(dummyWindowObj2);
            mb2.connect(dummyWindowObj1);
          });

          waitsFor(function() {
            return mb1.isConnectedTo(dummyWindowObj2) &&
            mb2.isConnectedTo(dummyWindowObj1);
          }, "The windows should have connected to each other",
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);

          runs(function() {
            expect(globalValue2).toBe(kGlobal_Value2);
            mb2.listen(listenerFunc2, filterFunc2);
            var obj = {text: 'hello'};
            mb1.pushMessage(obj);
            expect(globalValue2).toBe(kGlobal_Val2SetByListener2);
          });
      });

      it("should allow a registered listener function to be ignored " +
        "when an incoming client message is received that does not " +
        "match the listener function's filter", function() {
          runs(function() {
            mb1.connect(dummyWindowObj2);
            mb2.connect(dummyWindowObj1);
          });

          waitsFor(function() {
            return mb1.isConnectedTo(dummyWindowObj2) &&
            mb2.isConnectedTo(dummyWindowObj1);
          }, "The windows should have connected to each other",
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);

          runs(function() {
            expect(globalValue2).toBe(kGlobal_Value2);
            mb2.listen(listenerFunc2, filterFunc3);
            var obj = {text: 'hello'};
            mb1.pushMessage(obj);
            expect(globalValue2).toBe(kGlobal_Value2);
          });
      });

      it("should allow multiple registered listener functions to all be " +
        "invoked when an incoming client message is received", function() {
          runs(function() {
            mb1.connect(dummyWindowObj2);
            mb2.connect(dummyWindowObj1);
          });

          waitsFor(function() {
            return mb1.isConnectedTo(dummyWindowObj2) &&
            mb2.isConnectedTo(dummyWindowObj1);
          }, "The windows should have connected to each other",
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);

          runs(function() {
            expect(globalValue2).toBe(kGlobal_Value2);
            expect(globalValue3).toBe(kGlobal_Value3);
            mb2.listen(listenerFunc2);
            mb2.listen(listenerFunc3);
            var obj = {text: 'hello'};
            mb1.pushMessage(obj);
            expect(globalValue2).toBe(kGlobal_Val2SetByListener2);
            expect(globalValue3).toBe(kGlobal_Val3SetByListener3);
          });
      });

      it("should allow a listener function to call stopListening() " +
        "without affecting other listeners from being called back", function() {
          runs(function() {
            mb1.connect(dummyWindowObj2);
            mb2.connect(dummyWindowObj1);
          });

          waitsFor(function() {
            return mb1.isConnectedTo(dummyWindowObj2) &&
            mb2.isConnectedTo(dummyWindowObj1);
          }, "The windows should have connected to each other",
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);

          var listFunc1 = function() {
            mb2.stopListening(listFunc1);
          };
          var listFunc2 = function() {
            mb2.stopListening(listFunc2);
          };

          // here we are testing that calling stopListening() from
          // within a listener function does not invalidate the 'for'
          // loop that is iterating over the array of listeners to
          // pass them the pushed message. If things are handled
          // properly then this test will pass; if not, it will throw
          runs(function() {
            mb2.listen(listFunc1);
            mb2.listen(listFunc2);
            var obj = {text: 'hello'};
            expect(function(){mb1.pushMessage(obj);}).not.toThrow();
          });
      });

      it("should allow an incoming message that has not come from " +
        "a message bus to be ignored and thus not invoke any listeners",
        function() {
          runs(function() {
            mb1.connect(dummyWindowObj2);
            mb2.connect(dummyWindowObj1);
          });

          waitsFor(function() {
            return mb1.isConnectedTo(dummyWindowObj2) &&
            mb2.isConnectedTo(dummyWindowObj1);
          }, "The windows should have connected to each other",
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);

          runs(function() {
            expect(globalValue2).toBe(kGlobal_Value2);
            mb2.listen(listenerFunc2);
            var obj = {text: 'hello'};
            mb1.pushMessage(obj);
            expect(globalValue2).toBe(kGlobal_Val2SetByListener2);

            globalValue2 = kGlobal_Value2;
            expect(globalValue2).toBe(kGlobal_Value2);
            obj = {text: 'there'};
            // directly post the message to the window - in this way
            // the message won't be marked as a QO message like it
            // would be if it was sent via pushMessage()
            dummyWindowObj2.postMessage(obj, '*');
            expect(globalValue2).toBe(kGlobal_Value2);
          });
      });
    });

    describe("stopListening() method", function() {

      it("should throw if no valid listener function is supplied", function() {
        expect(function() {
          mb1.stopListening();
        }).toThrow('MessageBus: A valid listener function has ' +
            'not been provided to stopListening()');

        expect(function() {
          mb1.stopListening(null);
        }).toThrow('MessageBus: A valid listener function has ' +
            'not been provided to stopListening()');

        expect(function() {
          mb1.stopListening('blah');
        }).toThrow('MessageBus: A valid listener function has ' +
            'not been provided to stopListening()');

        expect(function() {
          mb1.stopListening(7);
        }).toThrow('MessageBus: A valid listener function has ' +
            'not been provided to stopListening()');

        expect(function() {
          mb1.stopListening({});
        }).toThrow('MessageBus: A valid listener function has ' +
            'not been provided to stopListening()');
      });

      it("should allow registered listener functions to be unregistered " +
        "such that they are no longer invoked",
        function() {
          runs(function() {
            mb1.connect(dummyWindowObj2);
            mb2.connect(dummyWindowObj1);
          });

          waitsFor(function() {
            return mb1.isConnectedTo(dummyWindowObj2) &&
            mb2.isConnectedTo(dummyWindowObj1);
          }, "The windows should have connected to each other",
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT + 1000);

          runs(function() {
            expect(globalValue2).toBe(kGlobal_Value2);
            expect(globalValue3).toBe(kGlobal_Value3);
            mb2.listen(listenerFunc2);
            mb2.listen(listenerFunc3);
            var obj = {text: 'hello'};
            mb1.pushMessage(obj);
            expect(globalValue2).toBe(kGlobal_Val2SetByListener2);
            expect(globalValue3).toBe(kGlobal_Val3SetByListener3);

            globalValue2 = kGlobal_Value2;
            globalValue3 = kGlobal_Value3;
            expect(globalValue2).toBe(kGlobal_Value2);
            expect(globalValue3).toBe(kGlobal_Value3);
            mb2.stopListening(listenerFunc2);
            obj = {text: 'again'};
            mb1.pushMessage(obj);
            expect(globalValue2).toBe(kGlobal_Value2);
            expect(globalValue3).toBe(kGlobal_Val3SetByListener3);

            globalValue3 = kGlobal_Value3;
            expect(globalValue3).toBe(kGlobal_Value3);
            mb2.stopListening(listenerFunc3);
            obj = {text: 'there'};
            mb1.pushMessage(obj);
            expect(globalValue2).toBe(kGlobal_Value2);
            expect(globalValue3).toBe(kGlobal_Value3);
          });
      });
    });

  });
});
