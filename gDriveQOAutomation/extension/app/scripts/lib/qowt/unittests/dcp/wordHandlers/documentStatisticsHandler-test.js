
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for documentStatisticsHandler DCP module.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */



define([
  'qowtRoot/dcp/wordHandlers/documentStatisticsHandler',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/utils/typeUtils'
], function(
    StatisticsHandler,
    MessageBus,
    TypeUtils) {

  'use strict';

  describe('dcp/wordHandlers/documentStatisticsHandler-test', function() {
    var mockDcp;
    beforeEach(function() {
      // initialise our singleton, since global after each will destroy it.
      StatisticsHandler.init();

      mockDcp = {el: {
        etp: 'documentStatistics',
        paragraphCount: 5,
        sectionCount: 2
      }};
    });
    afterEach(function() {
    });

    it('should implement a visit function', function() {
      expect(StatisticsHandler.visit).toBeDefined();
      expect(TypeUtils.isFunction(StatisticsHandler.visit)).toBe(true);
    });
    it('should throw if init is called consecutively.', function() {
      expect(function() {
        StatisticsHandler.init();}).toThrow();
    });

    it('should record a valid counts', function() {
      spyOn(MessageBus, 'pushMessage');
      StatisticsHandler.visit(mockDcp);
      expect(MessageBus.pushMessage).wasCalled();
      var spy = MessageBus.pushMessage.argsForCall;
      expect(spy.length === 2);
      expect(spy[0][0].context.dataPoint).toBe('ParagraphCount');
      expect(spy[0][0].context.value).toBe(5);
      expect(spy[1][0].context.dataPoint).toBe('SectionCount');
      expect(spy[1][0].context.value).toBe(2);
    });

    it('should record a zero section count for no/broken dcp', function() {
      delete mockDcp.el.paragraphCount;
      delete mockDcp.el.sectionCount;
      spyOn(MessageBus, 'pushMessage');
      StatisticsHandler.visit(mockDcp);
      expect(MessageBus.pushMessage).wasCalled();
      var spy = MessageBus.pushMessage.argsForCall;
      expect(spy.length === 2);
      expect(spy[0][0].context.dataPoint).toBe('ParagraphCount');
      expect(spy[0][0].context.value).toBe(0);
      expect(spy[1][0].context.dataPoint).toBe('SectionCount');
      expect(spy[1][0].context.value).toBe(0);
    });


  });
  return {};
});




