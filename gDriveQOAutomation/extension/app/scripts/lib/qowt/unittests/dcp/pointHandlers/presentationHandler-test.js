/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
/**
 * Presentation handler Test
 */


define([
  'qowtRoot/dcp/pointHandlers/util/cssManagers/presentation',
  'qowtRoot/models/point',
  'qowtRoot/presentation/placeHolder/defaultTextStyleManager',
  'qowtRoot/dcp/pointHandlers/presentationHandler',
  'qowtRoot/models/charts',
  'qowtRoot/configs/point',
  'qowtRoot/messageBus/messageBus'
], function(
    PresentationCSS,
    PointModel,
    DefaultTextStyleManager,
    Presentation,
    ChartsModel,
    PointConfig,
    MessageBus
) {

  'use strict';

  describe('Presentation handler Test', function() {
    var presentationHandler, presentationCSSHandler;

    beforeEach(function() {
      presentationCSSHandler = PresentationCSS;
      presentationHandler = Presentation;
      spyOn(presentationCSSHandler, 'createSlideSize');
    });

    describe(' verifying Presentation-handler input', function() {
      it('should not create slide size when Presentation JSON is undefined',
         function() {
           var v;
           presentationHandler.visit(v);

           expect(presentationCSSHandler.createSlideSize).
               not.toHaveBeenCalled();
         });

      it('should not create slide size when element in Presentation JSON ' +
          'is undefined', function() {
            var v = {el: undefined};
            presentationHandler.visit(v);

            expect(presentationCSSHandler.createSlideSize).
                not.toHaveBeenCalled();
          });

      it('should not create slide size when element-type in Presentation ' +
          'JSON is undefined', function() {
            var v = {el: {etp: undefined}};
            presentationHandler.visit(v);

            expect(presentationCSSHandler.createSlideSize).
                not.toHaveBeenCalled();
          });

      it('should not create slide size when element-type in Presentation ' +
          'JSON is other than prs', function() {
            var v = {el: {etp: 'some etp'}};
            presentationHandler.visit(v);

            expect(presentationCSSHandler.createSlideSize).
                not.toHaveBeenCalled();
          });

      it('should create slide size when element-type in Presentation JSON ' +
          'is prs', function() {
            var v = {el: {etp: 'prs', sldSz: {cx: '100', cy: '100'}}};
            presentationHandler.visit(v);

            expect(presentationCSSHandler.createSlideSize).
                toHaveBeenCalledWith(v.el.sldSz.cx, v.el.sldSz.cy);
          });

      it('should not create slide size when sldSz is undefined', function() {
        var v = {el: {etp: 'prd', sldSz: undefined}};
        presentationHandler.visit(v);

        expect(presentationCSSHandler.createSlideSize).not.toHaveBeenCalled();
      });

      it('should cache filePath in model', function() {
        var v = {
          el: {etp: 'prs', sldSz: {cx: 100, cy: 100}, pa: 'dummyPath'}
        };
        presentationHandler.visit(v);

        expect(PointModel.filePath).toEqual('dummyPath');
      });

      it('should cache default text style if txStl is present', function() {
        var _defTxtStyManager = DefaultTextStyleManager;

        var v = {el: {etp: 'prs', txStl: {pPrArr: []}}};

        spyOn(_defTxtStyManager, 'cacheDefTxtStyle');

        presentationHandler.visit(v);
        expect(_defTxtStyManager.cacheDefTxtStyle).toHaveBeenCalled();
      });

      it('should set background color in charts model', function() {
        PointConfig.chartBackgroundColor = 'transparent';
        var v = {el: {etp: 'prs', txStl: {pPrArr: []}}};

        presentationHandler.visit(v);

        expect(ChartsModel.backgroundColor).toEqual('transparent');
      });

      it('should update the number of slides in the model', function() {
        var v = {el: {etp: 'prs', sc: 12}};
        spyOn(MessageBus, 'pushMessage');
        Presentation.visit(v);
        expect(PointModel.numberOfSlidesInPreso).toBe(12);
      });

      it('should log number of slides to uma', function() {
        var v = {el: {etp: 'prs', sc: 12}};
        spyOn(MessageBus, 'pushMessage');

        Presentation.visit(v);
        expect(MessageBus.pushMessage).wasCalled();
        var arg = MessageBus.pushMessage.mostRecentCall.args[0];
        expect(arg.id).toBe('recordCount');
        expect(arg.context.dataPoint).toBe('SlideCount');
        expect(arg.context.value).toBe(12);
      });

    });
  });
});
