/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview mock out the apiary loader
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/third_party/when/when'], function(when) {

  'use strict';

  return {
    load: function() {

      window.gapi = {
        config: {
          update: function() {}
        },
        client: {
          setApiKey: function() {},
          request: function(req) {
            var deferred = when.defer();
            var response;
            if (req.path === '/drive/v2/files/validDoc') {
              response = {
                result: {
                  id: 'validDoc',
                  mimeType: 'application/msword'
                }
              };
              window.setTimeout(deferred.resolve.bind(null, response), 0);
            } else if (req.path === '/drive/v2/files/missingDoc') {
              response = {
                result: {
                  error: {
                    code: 404,
                    message: 'not found'
                  },
                }
              };
              window.setTimeout(deferred.reject.bind(null, response), 0);
            } else if (req.path === '/drive/v2/files/500Doc') {
              response = {
                result: {
                  error: {
                    code: 500,
                    message: 'internal server error'
                  },
                }
              };
              window.setTimeout(deferred.reject.bind(null, response), 0);
            } else if (req.path === '/drive/v2/files/503Doc') {
              response = {
                result: {
                  error: {
                    code: 503,
                    message: 'server timeout'
                  },
                }
              };
              window.setTimeout(deferred.reject.bind(null, response), 0);
            } else if (req.path === '/drive/v2/files/403RLDoc') {
              response = {
                result: {
                  error: {
                    errors: [{
                      reason: 'rateLimitExceeded'
                    }],
                    code: 403,
                    message: 'blah'
                  },
                }
              };
              window.setTimeout(deferred.reject.bind(null, response), 0);
            } else if (req.path === '/drive/v2/files/403URLDoc') {
              response = {
                result: {
                  error: {
                    errors: [{
                      reason: 'userRateLimitExceeded'
                    }],
                    code: 403,
                    message: 'foo'
                  },
                }
              };
              window.setTimeout(deferred.reject.bind(null, response), 0);
            } else if (req.path === '/drive/v2/files/validDoc?alt=media') {
              response = {
                body: ""
              };
              window.setTimeout(deferred.resolve.bind(null, response), 0);
            } else {
              var error = new Error('invalid mock path');
              window.setTimeout(deferred.reject.bind(null, error), 0);
            }

            return deferred.promise;
          }
        }
      };
      return when.resolve();
    }
  };

});