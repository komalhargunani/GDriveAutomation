define([
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtException',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/third_party/when/when',
  'qowtRoot/utils/localStorageManager',
  'qowtRoot/utils/typeUtils',
  'ui/progressSpinner',
  'utils/htmlConstructor'
  ], function(
    ErrorCatcher,
    QOWTException,
    QOWTSilentError,
    PubSub,
    when,
    LocalStorageManager,
    TypeUtils,
    ProgressSpinner,
    Html) {

  'use strict';

  var kDataExecPrevention_ = 'Data Execution Prevention is required';
  var kCpuModelUnsupported_ = 'CPU model is not supported';

  /**
   * Constructor method to create a Plugin Loader module instance to load
   * the correct NEXE given a filename/extension.
   *
   * @constructor
   * @param {object} opt_TEST_myWin An optional HTML window object.
   *                                This is only used for testing, to create
   *                                different message bus instances which are
   *                                listening on different window objects
   */
  var PluginLoaderImpl = function(opt_TEST_myWin) {
    this.status = 'idle';
    this.myWin_ = opt_TEST_myWin || window;
    this.kHistoricId_ = 'pluginLoadTimes';
    this.kHistoricCount_ = 10;
    this.relatedApp_ = null;
    /**
     * We retry attempts to load the NaCl plugin before quitting.
     * These properties drive this process.
     * For now this is an attempt to get more info on http://crbug/395129
     */
    this.kPluginLoadRetryMax_ = 3;
    this.pluginLoadAttempt_ = 0;
    this.timeouts_ = 0;
    this.deferred_ = null;
    this.spinnerUpdateFunc_ = null;
    this.progressIntervalId_ = null;
    this.startTime_ = null;
    this.historicLoadTimes_ = null;
    this.averageLoadTime_ = null;
    this.expectedLoadTime_ = null;
    this.timeout_ = null;
    this.pluginTimeoutLength_ = 30000;
  };


  PluginLoaderImpl.prototype = Object.create(Object.prototype);
  PluginLoaderImpl.prototype.constructor = PluginLoaderImpl;

  /**
   * Load the correct plugin
   *
   * @param {string} relatedApp string to identify which NEXE to load
   */
  PluginLoaderImpl.prototype.loadPlugin = function(relatedApp) {
      if (relatedApp !== 'word' &&
          relatedApp !== 'sheet' &&
          relatedApp !== 'point') {
        throw new Error('Error: unknown app: ' + relatedApp);
      }

      this.deferred_ = when.defer();
      this.status = 'loading';

      // construct and initialise the plugin html.
      this.relatedApp_ = relatedApp;
      this.constructPluginHTML_();

      return this.deferred_.promise;
  };

  // ------- THESE METHODS SHOULD NOT BE INVOKED EXTERNALLY -------

  // Construct the html necessary to load and initialise the plugin.
  // Establish the events to track plugin initialisation.
  PluginLoaderImpl.prototype.constructPluginHTML_ = function() {
    this.pluginLoadAttempt_++;

    // construct HTML but don't add to DOM yet
    var pluginHTML = Html.constructHTML([{
      id: 'pluginContainer',
      children: [{
        elType: 'embed',
        name: 'nacl_module',
        id: 'qonacl',
        width: 0,
        height: 0,
        src: '../plugin/' + this.relatedApp_ + '.nmf',
        type: 'application/x-nacl'
      }]
    }]);

    // Set up listeners first to avoid race condition
    this.setupLoadListeners_(pluginHTML);
    this.startLoadTimeout_();

    // Finally Trigger Loading of Plugin
    this.beginLoading_(pluginHTML);
  };

  PluginLoaderImpl.prototype.setupLoadListeners_ = function(documentFrag) {
    var pc = documentFrag.getElementById('pluginContainer');
    pc.addEventListener('load', this.pluginLoaded_.bind(this), true);
    pc.addEventListener('error', this.handleNaclError_.bind(this), true);
    pc.addEventListener('crash', this.handleNaClCrash_.bind(this), true);
    pc.addEventListener('abort', this.handleNaClAbort_.bind(this), true);
    pc.addEventListener('loadstart', this.initProgressUpdate_.bind(this),
      true);

    PubSub.subscribe('app:naclCrash', this.handleNaClCrash_.bind(this));
  };

  PluginLoaderImpl.prototype.beginLoading_ = function(pluginHTML) {
    document.body.appendChild(pluginHTML);
  };

  PluginLoaderImpl.prototype.handleNaclTimeout_ = function() {
    this.timeouts_++;
    this.logMessage_('Nacl loading timeout #' + this.timeouts_);
    // Reschedule another timeout check
    this.startLoadTimeout_();
  };

  PluginLoaderImpl.prototype.handleNaClAbort_ = function() {
    this.clearLoadTimeout_();
    this.deferred_.reject(new Error('Nacl Loading Aborted'));
  };

  /**
   * Event handler for failed NaCl loac (eg 64 bit nexe not found).
   * We retry NaCl loading on error.
   * If we haven't succeeded after max retries then just fail.
   */
  PluginLoaderImpl.prototype.handleNaclError_ = function() {
    // Silently record the try attempt and retry.
    this.logMessage_('NaCl-FAIL#' + this.pluginLoadAttempt_ + ':' +
      this.getLastError_());
    this.clearLoadTimeout_();

    if (this.pluginLoadAttempt_ < this.kPluginLoadRetryMax_) {
      // Clean up the plugin html and retry.
      var pc = document.getElementById('pluginContainer');
      if (pc && pc.parentNode) {
        // We have no other references to pluginContainer so the event
        // listeners will be removed when the container is removed.
        pc.parentNode.removeChild(pc);
      } else {
        throw new Error('Cannot retry NaCl load. Unexpected state.');
      }
      this.constructPluginHTML_();
    } else {
      // All our retries fail so just throw the error.
      var errorMsg = this.getLastError_();
      throw new QOWTException({
        title: 'app_nacl_error_title',
        details: isUnsupportedDeviceError_(errorMsg) ?
            'app_nacl_error_unsupported_device' : 'app_nacl_error_load_failed',
        message: errorMsg
      });
    }
  };

  // The NaCl plugin has crashed during normal operation.
  // This is a fatal error, so inform the user.
  PluginLoaderImpl.prototype.handleNaClCrash_ = function() {
    this.clearLoadTimeout_();
    throw new QOWTException({
      title: 'app_nacl_crash_title',
      details: 'app_nacl_crash_msg',
      message: this.getLastError_()
    });
  };

  // Query the last nacl error from the plugin.
  // eg "NaCl module load failed: ServiceRuntime: could not start nacl module"
  PluginLoaderImpl.prototype.getLastError_ = function() {
    var plugin = document.getElementById('qonacl');
    var err = (plugin) ?
        plugin.lastError :
        'NaCl error or crash: No lastError logged.';
    return err;
  };

  PluginLoaderImpl.prototype.logMessage_ = function(message) {
    var silentError = new QOWTSilentError(message);
    ErrorCatcher.handleError(silentError);
    console.error(message);
  };

  PluginLoaderImpl.prototype.updateProgress_ = function() {
    var currentLoadTime = new Date() - this.startTime_;
    var currentPercentage = currentLoadTime / this.expectedLoadTime_;
    this.spinnerUpdateFunc_(this.progressAlgo_(currentPercentage));
  };

  PluginLoaderImpl.prototype.initProgressUpdate_ = function() {
    // the plugin load time will take whatever contribution to the
    // spinner is available. When we download files, the downloader
    // takes 90%, leaving us 10% to fill up.
    // But for local files we get all 100%.
    ProgressSpinner.show();
    this.spinnerUpdateFunc_ = ProgressSpinner.addContributor('*');
    this.calcExpectedLoadTime_();
    this.progressIntervalId_ = this.myWin_.setInterval(
      this.updateProgress_.bind(this), 10);
  };

  PluginLoaderImpl.prototype.calcExpectedLoadTime_ = function() {
    // use _kHistoricCount number of historic readings to calculate the
    // expected plugin load time
    this.startTime_ = new Date();
    this.historicLoadTimes_ = JSON.parse(LocalStorageManager.getItem(
      this.kHistoricId_));
    if (!(this.historicLoadTimes_ instanceof Array)) {
      this.historicLoadTimes_ = [];
    }

    if (this.historicLoadTimes_.length === 0) {
      // use a somewhat arbitrary average load time
      // of 100ms if we have no historic data
      this.averageLoadTime_ = 100;
    } else {
      var total = 0;
      this.historicLoadTimes_.forEach(function(t) {
        total += t;
      });
      this.averageLoadTime_ = (total / this.historicLoadTimes_.length);
    }
    // add a 10% buffer
    this.expectedLoadTime_ = 1.1*this.averageLoadTime_;
  };


  PluginLoaderImpl.prototype.progressAlgo_ = function(x) {
    // http://www.chrisharrison.net/projects/progressbars/ProgBarHarrison.pdf
    // We use 'fast power' progress indicator over the average load time
    // of the plugin based on historical data (last _kHistoricCount load times)
    // fast power -->  (x+(1-x)/2)^16
    return Math.pow((x+(1-x)/2), 16);
  };

  PluginLoaderImpl.prototype.pluginLoaded_ = function() {
    this.clearLoadTimeout_();
    this.myWin_.clearInterval(this.progressIntervalId_);
    if (TypeUtils.isFunction(this.spinnerUpdateFunc_)) {
      this.spinnerUpdateFunc_(1);
    }

    this.recordLoadTime_();
    if (this.pluginLoadAttempt_ > 1) {
      // Assume the first NaCl load attempts succeeds. Don't want to pollute
      // the console or GA data with the expected success case.
      this.logMessage_('NaCl Loaded OK: try#' + this.pluginLoadAttempt_);
    }
    this.status = 'loaded';
    this.deferred_.resolve();
  };

  PluginLoaderImpl.prototype.recordLoadTime_ = function() {
    var loadTime = new Date() - this.startTime_;

    this.historicLoadTimes_.push(loadTime);
    while (this.historicLoadTimes_.length > this.kHistoricCount_) {
      // only keep latest _kHistoricCount number of load times
      this.historicLoadTimes_.shift();
    }
    LocalStorageManager.setItem(
        this.kHistoricId_, JSON.stringify(this.historicLoadTimes_));
  };

  PluginLoaderImpl.prototype.startLoadTimeout_ = function() {
    this.timeout_ = this.myWin_.setTimeout(this.handleNaclTimeout_.bind(this),
      this.pluginTimeoutLength_);
  };

  PluginLoaderImpl.prototype.clearLoadTimeout_ = function() {
    this.myWin_.clearTimeout(this.timeout_);
  };


  // private functions
  function isUnsupportedDeviceError_(errorMsg) {
    return !!((errorMsg.indexOf(kDataExecPrevention_) !== -1) ||
        (errorMsg.indexOf(kCpuModelUnsupported_) !== -1));
  }
  return PluginLoaderImpl;
});
