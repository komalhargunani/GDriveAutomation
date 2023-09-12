/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview utility module to send an xhr request
 * returns a promise, which supports progress, eg:
 *   .then(success, failure, onprogress)
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/errors/qowtException',
  'qowtRoot/errors/unique/httpErrorFileNotFound',
  'qowtRoot/errors/unique/httpErrorZero',
  'qowtRoot/errors/unique/timeoutError',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/third_party/when/when',
  'utils/retryHandler'], function(
    QOWTException,
    HTTPErrorFileNotFound,
    HTTPErrorZero,
    TimeoutError,
    TypeUtils,
    when,
    RetryHandler) {

  'use strict';

  /**
   * Create an XHR
   *
   * @param {object} config configuration object caintaining:
   * @param {string} method either 'GET' or 'PUT'; defaults to 'GET'
   * @param {string} baseUrl the baseURL of the request (without params)
   * @param {object} params json object with key/val props as url paramenters
   * @param {string} contentType the contentType HTTP Request header
   * @param {string} responseType the expected response type; defaults to blob
   * @param {string} authToken optional authentication token to use
   * @param {Promise} abortPromise the caller can pass an abortPromise to
   *                               the send. If that promise gets rejected
   *                               we will abort the XMLHttpRequest
   */
  var XHR = function(config) {
    this.method_ = config.method || 'GET';
    this.responseType_ = config.responseType || 'blob';
    this.url_ = this.buildUrl_(config.baseUrl, config.params);
    this.authToken_ = config.authToken;
    this.contentType_ = config.contentType;
    this.deferred_ = when.defer();
    this.kEstimatedDownloadChunks_ = 20;
    this.timeoutLength_ = 600000;
    this.remainingChunks_ = this.kEstimatedDownloadChunks_;
    this.progress_ = 0;
    this.retryHandler_ = new RetryHandler();

    if (config.abortPromise) {
      config.abortPromise = config.abortPromise.catch(function() {
        if (this.xhr_ && this.xhr_.abort) {
          this.xhr_.abort();
        }
        this.deferred_.reject(new Error('XHR canceled'));
      });
    }
  };


  XHR.prototype = {
    __proto__: Object.prototype,

    /**
     * Send the request and return a promise to monitor
     * progress as well as to chain success/failure cases.
     *
     * @param {String} body optional body to actually send
     */
    send: function(body) {
      this.xhr_ = this.createXMLHttpRequest_();
      this.xhr_.send(body);
      this.startConnectionTimeout_();
      return this.deferred_.promise;
    },

    // --------------------------------------------------------------

    createXMLHttpRequest_: function() {
      var xhr = new XMLHttpRequest();

      if (this.method_ === 'GET') {
        xhr.onprogress = this.onProgress_.bind(this);
      } else {
        xhr.upload.onprogress = this.onProgress_.bind(this);
      }

      xhr.onload = this.onSuccess_.bind(this);
      xhr.onerror = this.onError_.bind(this);

      xhr.open(this.method_, this.url_, true /* async */ );
      xhr.responseType = this.responseType_;

      if (this.authToken_) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + this.authToken_);
      }
      if (this.contentType_) {
        xhr.setRequestHeader('Content-Type', this.contentType_);
      }

      return xhr;
    },

    onSuccess_: function(evt) {
      this.clearConnectionTimeout_();

      if (evt.target.readyState === 4) {

        // hack in case the server didn't adhere to our request
        // to send the response in xhr_.response but instead
        // used xhr_.responseText (sinon fakeServer does this for
        // example, but there could be others out there)
        var response = evt.target.response || evt.target.responseText;

        if ((evt.target.status === 200 || evt.target.status === 0) &&
            response) {

          // Success. Return XHR response as JSON.
          if (evt.target.responseType === 'json' &&
             (typeof response === 'string')) {
            try {
              response = JSON.parse(response);
            } catch(e) {
              var error = new Error('XHR response not valid JSON');
              return this.deferred_.reject(error);
            }
          }
          // notify progress 100% and resolve
          this.deferred_.notify(1);
          this.deferred_.resolve(response);

        } else if ((evt.target.status === 0 || evt.target.status === 200) &&
                   !response){
          // Aborted, or null response with 'success' (200) code.
          // Obvserved to mean 'abort'.
          this.deferred_.reject('HTTP ERROR: ABORTED');
        } else {
          // Error
          this.onError_(evt);
        }
      }
    },


    onProgress_: function(evt) {
      this.resetConnectionTimeout_();

      if (evt && evt.lengthComputable) {
        var current = evt.position || evt.loaded;
        var total = evt.totalSize || evt.total;
        this.progress_ = (current / total);
      } else {
        // We do not know how large the download is going to be
        // so we are going to make some assumptions on the number
        // of chunks (eg the number of progress callbacks).
        // And then use an inverse exponential algorithm
        // to 'near' our estimate yet never get there... not great but
        // at least it gives 'some' feedback...
        var step = (this.remainingChunks_ / this.kEstimatedDownloadChunks_);
        this.remainingChunks_ -= step;
        this.progress_ += (step / this.kEstimatedDownloadChunks_);
      }
      this.deferred_.notify(this.progress_);
    },


    onError_: function(evt) {
      // TODO(jliebrand): work out what codes we should retry on!
      if (evt.target.status &&
          (evt.target.status >= 500 || evt.target.status === 429)) {

        this.retry_(evt);
      } else {
        this.deferred_.reject(this.getErrorFromXhrStatus_(evt.target.status));
      }
    },


    retry_: function(evt) {
      if (!this.retryHandler_.maxedOut()) {
        this.retryHandler_.retry(this.send.bind(this));
      } else {
        this.deferred_.reject(this.getErrorFromXhrStatus_(evt.target.status));
      }
    },


    getErrorFromXhrStatus_: function(xhrStatus) {
      var error;
      if (xhrStatus === 0) {
        error = new HTTPErrorZero();
      } else if (xhrStatus === 404) {
        error = new HTTPErrorFileNotFound();
      } else {
        error = new QOWTException('HTTP ERROR: ' + xhrStatus);
      }
      return error;
    },


    buildUrl_: function(baseUrl, params) {
      var url = this.parseUrl_(baseUrl);
      var query = this.buildQuery_(params);
      if (query) {
        url += '?' + query;
      }
      return url;
    },


    buildQuery_: function(params) {
      params = params || {};
      return Object.keys(params).map(function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }).join('&');
    },


    parseUrl_: function(url) {
      if (!TypeUtils.isString(url)) {
        throw new Error('URL for XHR should be a string');
      } else {
        // make sure url has a scheme (eg http://) at the start
        if (hasNeitherHttpNorBlobScheme_(url)) {
          // if not, default to http://
          url = 'http://' + url;
        }
      }
      return url;
    },

    startConnectionTimeout_: function() {
      this.timeout_ = window.setTimeout(function() {
        var error = new TimeoutError('XHR timed out');
        this.deferred_.reject(error);
      }.bind(this), this.timeoutLength_);
    },

    clearConnectionTimeout_: function() {
      window.clearTimeout(this.timeout_);
      delete this.timeout_;
    },

    resetConnectionTimeout_: function() {
      this.clearConnectionTimeout_();
      this.startConnectionTimeout_();
    }
  };

  // Private functions
  function hasNeitherHttpNorBlobScheme_(url) {
    return !(
        url.match(/^http[s]?:\/\//) || url.match(/^blob:/) ||
        url.match(new RegExp('^' + (window.location.origin))));
  }

  return XHR;
});
