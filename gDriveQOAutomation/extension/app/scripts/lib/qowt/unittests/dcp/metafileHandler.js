define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/dcp/dcpManager',
  'qowtRoot/dcp/metaFileHandler',
  'qowtRoot/drawing/geometry/metaFilePainter',
  'qowtRoot/utils/functionUtils',
  'qowtRoot/fixtures/_all'], function(
    UnittestUtils,
    DcpManager,
    MetaFile,
    MetaFilePainter,
    FunctionUtils,
    FIXTURES) {

  'use strict';

  describe('QOWT/dcp/metafileHandler.js', function() {

    var _testAppendArea, _rootNode, _dcp, _setupDoc;

    beforeEach(function() {
      _testAppendArea = UnittestUtils.createTestAppendArea();
      _rootNode = document.createElement('DIV');
      _rootNode.setAttribute('qowt-divType', 'page');
      _rootNode.setAttribute('style',
                             '-webkit-user-modify:read-write-plaintext-only;');
      _rootNode.id = 'unitTestRootNode';
      _dcp = {
        el: [],
        node: _rootNode,
        accept: function() {}
      };
      _setupDoc = function(dcp, then) {
        var clock = {
          getDate: FunctionUtils.makeConstantFunction(0)
        };
        var promises = [];
        for (var i in dcp.el) {
          promises.push(DcpManager.processDcpResponse(
              dcp.el[i], dcp.node, clock, new Promise(function() {})));
        }
        runs(function() {
          return Promise.all(promises);
        });
        runs(function() {
          _testAppendArea.appendChild(_rootNode);
          then();
        });
      };
    });

    afterEach(function() {
      _testAppendArea.clear();
      _testAppendArea = undefined;
      _rootNode = undefined;
      _dcp = undefined;
      _setupDoc = undefined;
    });

    describe('MetaFiles', function() {

      it('Handle non MetaFile DCP', function() {
        var notMetafileDCP = {
          el: [{
            'etp': 'par'
          }],
          node: _rootNode,
          accept: function() {}
        };
        MetaFile.visit(notMetafileDCP);
        expect(_rootNode.childNodes.length).toEqual(0);
      });

      it('Create an Unknown Object where frmt attribute is an unsupported ' +
          'value', function() {
            var unsupportedMF = {
              'etp': 'mf',
              'frmt': 'svg'
            };
            _dcp.el.push(FIXTURES.response('update').addChild(unsupportedMF));
            _setupDoc(_dcp, function() {
              expect(_rootNode.childNodes.length).toEqual(1);
              var uo = _rootNode.childNodes[0];
              expect(uo).not.toBeNull();
              expect(uo).toBeDefined();
              expect(uo).toBeElement();
              expect(uo.nodeType).toBeDefined();
              expect(uo.nodeType).toBe(1);
              expect(uo.nodeName).toBeDefined();
              expect(uo.nodeName).toBe('DIV');
            });
          });

      it('Create an Unknown Object where frmt attribute is an unknown value',
          function() {
            var unknownMF = {
              'etp': 'mf',
              'frmt': 'some_vector_format'
            };
            _dcp.el.push(FIXTURES.response('update').addChild(unknownMF));
            _setupDoc(_dcp, function() {
              expect(_rootNode.childNodes.length).toEqual(1);
              var uo = _rootNode.childNodes[0];
              expect(uo).not.toBeNull();
              expect(uo).toBeDefined();
              expect(uo).toBeElement();
              expect(uo.nodeType).toBeDefined();
              expect(uo.nodeType).toBe(1);
              expect(uo.nodeName).toBeDefined();
              expect(uo.nodeName).toBe('DIV');
            });
          });

    });

    describe('WMF MetaFiles', function() {

      describe('WMF MetaFile Performance', function() {

        it('Handle deep DCP from getDCP response when the original element ' +
            'has been deleted', function() {
              _dcp = {
                el: [],
                node: _rootNode,
                accept: function() {}
              };
              _dcp.el.push(FIXTURES.response('update').addChild(
                  FIXTURES.wmfElement_getDCPresponse('testid', undefined,
                                                     undefined)));
              var mfp = MetaFilePainter;
              spyOn(mfp, 'paintCanvas').andCallThrough();
              _setupDoc(_dcp, function() {
                var wmfCanvas = window.document.getElementById('testid');
                expect(_rootNode.childNodes.length).toEqual(0);
                expect(wmfCanvas).toBeNull();
                expect(mfp.paintCanvas).not.toHaveBeenCalled();
              });
            });

      });

    });

    describe('EMF MetaFiles', function() {

      describe('EMF MetaFile Performance', function() {

        it('Handle deep DCP from getDCP response when the original element ' +
            'has been deleted', function() {
              _dcp = {
                el: [],
                node: _rootNode,
                accept: function() {}
              };
              _dcp.el.push(FIXTURES.response('update').addChild(
                  FIXTURES.emfElement_getDCPresponse('testid', undefined,
                                                     undefined)));
              var mfp = MetaFilePainter;
              spyOn(mfp, 'paintCanvas').andCallThrough();
              _setupDoc(_dcp, function() {
                var emfCanvas = window.document.getElementById('testid');
                expect(_rootNode.childNodes.length).toEqual(0);
                expect(emfCanvas).toBeNull();
                expect(mfp.paintCanvas).not.toHaveBeenCalled();
              });
            });

      });

    });

  });

});
