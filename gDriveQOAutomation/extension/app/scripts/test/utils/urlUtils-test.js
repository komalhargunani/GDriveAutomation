define([
  'utils/urlUtils'
  ], function(
    UrlUtils) {

  'use strict';

  describe('Url Utils', function() {

    it('should throw an error if no uri given', function() {
      expect(function() {
        UrlUtils.parseURL();
      }).to.throw('Invalid URI');
    });

    it('should throw an error if bad uri given', function() {
      var object = {};
      expect(function() {
        UrlUtils.parseURL(object);
      }).to.throw('Invalid URI');
    });

    it('should throw an error if no query string is given', function() {
      var object = {};
      expect(function() {
        UrlUtils.parseQueryString(object);
      }).to.throw('Invalid QueryString');
    });

    it('should return empty query string and object if query marker missing',
        function() {
      var url = 'chrome-extension://xxxxxxxx/views/app.html';
      var urlObject = UrlUtils.parseURL(url);
      expect(urlObject.queryString).to.equal('');
    });

    it('should return a null object if query is empty', function() {
      var url = 'chrome-extension://xxxxxxxx/views/app.html?';
      var urlObject = UrlUtils.parseURL(url);
      expect(urlObject.queryObject).to.deep.equal(undefined);
    });

    it('should return an object matching the query string pairs', function() {
      var url = 'chrome-extension://xxxxxxxx/views/app.html?x=1&y=2&z=3';
      var urlObject = UrlUtils.parseURL(url);
      var expectedObject = { 'x':'1', 'y':'2', 'z':'3' };
      expect(urlObject.queryObject).to.deep.equal(expectedObject);
    });

    it('should convert fields to lower case', function() {
      var url = 'chrome-extension://xxxxxxxx/views/app.html?X=1&y=2&Z=3';
      var urlObject = UrlUtils.parseURL(url);
      var expectedObject = { 'x':'1', 'y':'2', 'z':'3' };
      expect(urlObject.queryObject).to.deep.equal(expectedObject);
    });

    it('should handle encoded urls', function() {
      var url = 'chrome-extension://xxxx/views/app.html?state=' +
          '%7B%22ids%22:%5B%220B3uU8Dj5mPZuVEl4WVo0YjYxZkk%22%5D,' +
          '%22action%22:%22open%22,%22userId%22:%22103708828297203848763'
          +'%22%7D';
      var urlObject = UrlUtils.parseURL(url);
      var expectedObject = {
        state : '{"ids":["0B3uU8Dj5mPZuVEl4WVo0YjYxZkk"],' +
        '"action":"open","userId":"103708828297203848763"}'
      };
      expect(urlObject.queryObject).to.deep.equal(expectedObject);
    });

    it('should handle encoded urls with special characters', function() {
      var url = 'chrome-extension://xxxx/views/app.html?' +
          'x=PB%20%26%20J&y=this%3Dthat';
      var urlObject = UrlUtils.parseURL(url);
      var expectedObject = {
        x : 'PB & J',
        y : 'this=that',
      };
      expect(urlObject.queryObject).to.deep.equal(expectedObject);
    });
  });


});
