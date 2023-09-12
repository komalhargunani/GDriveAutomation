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
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/dcp/pointHandlers/slideNotesHandler'
], function(PlaceHolderManager, SlideNotes) {

  'use strict';

  describe('Slide Notes handler tests', function() {
    var _SLIDE_ID = '111';
    var _slideNoteHandler;

    beforeEach(function() {
      _slideNoteHandler = SlideNotes;
    });

    describe('slide notes handler input', function() {

      it('should return undefined when slideNote-handler visit is called ' +
          'with empty v element', function() {
            expect(_slideNoteHandler.visit(undefined)).toEqual(undefined);
          });

      it('should return undefined when slideNote-handler visit is called ' +
          'with etp other than sldNt', function() {
            var v = {
              el: {
                etp: 'xxx',
                eid: '111'
              }
            };
            expect(_slideNoteHandler.visit(v)).toEqual(undefined);
          });

      it('should return undefined when slideNote-handler visit is called ' +
          'with etp undefined', function() {
            var v = {
              el: {
                eid: _SLIDE_ID
              }
            };

            expect(_slideNoteHandler.visit(v)).toEqual(undefined);
          });

      it('should return undefined when slideNote-handler visit is called ' +
          'with empty el element', function() {
            var v = {
              el: ''
            };

            expect(_slideNoteHandler.visit(v)).toEqual(undefined);
          });

      it('should return undefined when slideNote-handler visit is called ' +
          'without sld element', function() {
            var v = {
              el: {
                etp: 'hell',
                eid: _SLIDE_ID
              }
            };

            expect(_slideNoteHandler.visit(v)).toEqual(undefined);
          });

    });

    it('should reset place-holder', function() {
      spyOn(PlaceHolderManager, 'resetCurrentPlaceHolderForShape');

      var v = {
        el: {
          etp: 'sldNt',
          eid: '111'
        },
        node: {
          appendChild: function() {}
        }
      };
      _slideNoteHandler.visit(v);

      expect(PlaceHolderManager.resetCurrentPlaceHolderForShape).
          toHaveBeenCalled();
    });

    it('should create slide-notes div', function() {
      var docFragment = {
        appendChild: function() {}
      };
      spyOn(PlaceHolderManager, 'resetCurrentPlaceHolderForShape');
      spyOn(document, 'createDocumentFragment').andReturn(docFragment);
      spyOn(docFragment, 'appendChild');


      var v = {
        el: {
          etp: 'sldNt',
          eid: '111'
        },
        node: {}
      };

      var notesDiv = _slideNoteHandler.visit(v);

      expect(v.node.slidenotes).toBeDefined();
      expect(v.node.slidenotes).toEqual(docFragment);
      expect(docFragment.appendChild).toHaveBeenCalledWith(notesDiv);
      expect(notesDiv.id).toEqual('slide-notes-div');
    });

  });
});
