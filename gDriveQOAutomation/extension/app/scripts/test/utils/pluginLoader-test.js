 define([
  'utils/pluginLoader',
  ], function(
    PluginLoader) {


  var sandbox;
  var clock;
  var app = 'word';

  describe('Plugin Loader', function() {
    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      clock = sandbox.useFakeTimers();
      sandbox.stub(PluginLoader.prototype, 'initProgressUpdate_', function(){});
      sandbox.stub(PluginLoader.prototype, 'setupLoadListeners_', function(){});
      sandbox.stub(PluginLoader.prototype, 'recordLoadTime_', function(){});
      sandbox.stub(PluginLoader.prototype, 'beginLoading_', function(){});
      sandbox.stub(PluginLoader.prototype, 'getLastError_', function(){});
      sandbox.stub(PluginLoader.prototype, 'logMessage_', function(){});
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('should log time out if plugin does not load', function() {
      var pluginLoader = new PluginLoader();
      pluginLoader.loadPlugin(app);
      for (var i=1; i<6; i++) {
        clock.tick(pluginLoader.pluginTimeoutLength_);
        sinon.assert.calledWith(
            pluginLoader.logMessage_, 'Nacl loading timeout #' + i);
      }

    });

    it('should not time out if plugin loads successfully', function() {
      var pluginLoader = new PluginLoader();
      var promise = pluginLoader.loadPlugin(app);
      clock.tick(pluginLoader.pluginTimeoutLength_ / 2);
      pluginLoader.pluginLoaded_();
      clock.tick(pluginLoader.pluginTimeoutLength_);
      return promise.should.be.fulfilled;
    });

    it('should reject with NaCl Error and not time out', function() {
      var pluginLoader = new PluginLoader();
      sandbox.spy(pluginLoader, 'handleNaclError_');
      sandbox.spy(pluginLoader, 'clearLoadTimeout_');

      assert.throws(function() {
        pluginLoader.handleNaclError_();
      }, 'Cannot retry NaCl load. Unexpected state.');
      sinon.assert.called(pluginLoader.clearLoadTimeout_);
    });

    it('should reject with NaCl Abort and not time out', function() {
      var pluginLoader = new PluginLoader();
      var promise = pluginLoader.loadPlugin(app);
      sandbox.spy(pluginLoader, 'clearLoadTimeout_');
      pluginLoader.handleNaClAbort_();

      return promise.should.be.rejectedWith('Nacl Loading Aborted').then(
        function(){
          sinon.assert.called(pluginLoader.clearLoadTimeout_);
        });
    });

    it('should reject with NaCl Crash and not time out', function() {
      var pluginLoader = new PluginLoader();
      sandbox.spy(pluginLoader, 'handleNaClCrash_');
      sandbox.spy(pluginLoader, 'clearLoadTimeout_');

      assert.throws(function() {
        pluginLoader.handleNaClCrash_();
      });
      sinon.assert.called(pluginLoader.clearLoadTimeout_);
    });
  });

  return {};
});
