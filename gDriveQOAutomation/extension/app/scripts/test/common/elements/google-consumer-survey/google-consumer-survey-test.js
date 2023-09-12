define([
  'qowtRoot/utils/uuid',
  'third_party/seedrandom/seedrandom.min'
  ], function(UUIDUtils, seedrandom) {

  'use strict';

  // sample size used for the various tests; eg number of elements to create
  // before verifying sampling rates or bucketing logic
  var SAMPLE_SIZE = 1000;
  var PREFIX = '__GCS_';
  var FAKE_SITE_ID = 'foo';
  var DAY_IN_MS = 1000 * 60 * 60 * 24;
  var ONE_WEEK = 7 * DAY_IN_MS;
  var MAX_UNSIGNED_SHORT = 65535;

  var dummyUUID;
  var dummyTimestamp;

  describe('qowt-consumer-survey element', function() {

    var sandbox;
    var pseudo;
    var rnd = seedrandom(1234);

    beforeEach(sinon.test(function() {

      sandbox = sinon.sandbox.create();

      // sampling is done based off UUIDs, which we stub with a predictable
      // random generator. This way we guarantee each time this is run, it will
      // produce the same random numbers and thus the sampling will be
      // deterministic
      sandbox.stub(UUIDUtils, 'generateUUID', function() {
        pseudo = Math.round(rnd() * MAX_UNSIGNED_SHORT);
        var idPart = String('0000' + pseudo.toString(16)).slice(-4);
        return '00000000-' + idPart + '-4000-0000-000000000000';
      });
      sandbox.stub(GoogleConsumerSurvey.prototype, 'appendChild');
      sandbox.stub(window.localStorage, 'getItem', function(key) {
        switch (key) {
          case PREFIX + 'uuid':
            return dummyUUID;

          case PREFIX + 'site_' + FAKE_SITE_ID:
            return dummyTimestamp;

          default:
            break;
        }
      });
      sandbox.stub(window.localStorage, 'setItem', function(key, val) {
        switch (key) {
          case PREFIX + 'uuid':
            dummyUUID = val;
            break;

          case PREFIX + 'site_' + FAKE_SITE_ID:
            dummyTimestamp = val;
            break;

          default:
            break;
        }
      });
    }));


    afterEach(function() {
      resetLocalStorage_();
      sandbox.restore();
    });


    it("should reuse the users UUID if known", function() {
      var x = document.createElement('google-consumer-survey');
      var y = document.createElement('google-consumer-survey');
      assert.equal(x.UUID, y.UUID, 'reuse UUID from localStorage');
      assert.isValidUUID(x.UUID, 'x has a valid UUID');
      assert.isValidUUID(y.UUID, 'y has a valid UUID');
    });


    it("should create a new UUID if it's not already known", function() {
      var x = document.createElement('google-consumer-survey');
      resetLocalStorage_();
      var y = document.createElement('google-consumer-survey');
      assert.notEqual(x.UUID, y.UUID, 'each UUID is unique');
      assert.isValidUUID(x.UUID, 'x has a valid UUID');
      assert.isValidUUID(y.UUID, 'y has a valid UUID');
    });


    describe("Launching the survey", function() {

      it("should do nothing if siteId is not set", function() {
        var x = document.createElement('google-consumer-survey');
        this.getTestDiv().appendChild(x);
        assertUserNotSurveyed_(x);
      });


      xit("should launch a survey when attached to the DOM", function() {
        var x = addElement_(this.getTestDiv());
        assertUserSurveyed_(x);
      });


      xit("should not launch survey twice within x days if not using bucketing",
          function() {

        var clock = sandbox.useFakeTimers(Date.now());

        // add survey element and verify we launched a survey
        var x = addElement_(this.getTestDiv());
        assertUserSurveyed_(x, 'first time');
        x.parentNode.removeChild(x);

        // reset our spy
        GoogleConsumerSurvey.prototype.appendChild.reset();

        // add it two days later and verify it didn't survey the user
        clock.tick(2 * DAY_IN_MS);
        x = addElement_(this.getTestDiv());
        assertUserNotSurveyed_(x, 'second time');
        x.parentNode.removeChild(x);

        // reset our spy
        GoogleConsumerSurvey.prototype.appendChild.reset();

        // add it 95 days later (>90) and verify it DID survey the user
        clock.tick(95 * DAY_IN_MS);
        x = addElement_(this.getTestDiv());
        assertUserSurveyed_(x, 'third time');
        x.parentNode.removeChild(x);
      });

    });


    xdescribe("sampling", function() {

      afterEach(function() {
        resetLocalStorage_();
      });


      it("should select unique set of users", function() {

        this.timeout(120000);

        // add a hundred elements and log which ones got surveyed. Then do it
        // again and verify the results are different
        var clock = sandbox.useFakeTimers(Date.now());
        var testDiv = this.getTestDiv();
        var total = 1000;
        var sampleRate = 5;

        function sampleElements_() {
          var samples = [];
          for (var i = 0; i < total; i++) {
            resetLocalStorage_();

            // make sure every i'th element has a unique repeatable ID part
            var idPart = String('0000' + i.toString(16)).slice(-4);
            dummyUUID = '00000000-' + idPart + '-4000-0000-000000000000';

            var x = addElement_(testDiv, sampleRate);
            if (x.userSurveyed) {
              samples.push(i);
            }
          }
          return samples;
        }

        var idsSampled1 = sampleElements_();
        clock.tick(ONE_WEEK);
        var idsSampled2 = sampleElements_();

        expect(idsSampled1).not.to.have.same.members(idsSampled2);
      });


      // We are basing our "accepted range" off of a 99% confidence level.
      //
      // With a sample size of creating 1,000 elements we get the following
      // confidence intervals (http://www.surveysystem.com/sscalc.htm) which we
      // then round up for our tests:
      //    sampling rate% -> confidence interval
      //            3      -> 1.39
      //            9      -> 2.33
      //            37     -> 3.94
      var expectedResults = [
        {targetPercentage: 3, bucketing: 3, confidenceInterval: 1.6},
        {targetPercentage: 9, bucketing: 4, confidenceInterval: 2.8},
        {targetPercentage: 37, bucketing: undefined, confidenceInterval: 5}
      ];

      expectedResults.forEach(function(res) {
        it("should survey the correct number of users for a sampling rate of " +
           res.targetPercentage + "% with bucketing of " + res.bucketing +
           " weeks", function() {

          this.timeout(120000);
          var usersSurveyed = 0;
          var testDiv = this.getTestDiv();
          var elementsToCreate = SAMPLE_SIZE * (res.bucketing || 1);

          for (var i = 0; i < elementsToCreate; i++) {
            resetLocalStorage_();
            var x = addElement_(testDiv, res.targetPercentage, res.bucketing);
            if (x.userSurveyed) {
              usersSurveyed++;
            }
          }

          var actualPercentage = (usersSurveyed / SAMPLE_SIZE * 100);
          assert.closeTo(actualPercentage, res.targetPercentage,
              res.confidenceInterval, 'rate outside accepted range');

        });
      });
    });


    xdescribe("bucketing", function() {

      it("should only survey the user one week out of x buckets", function() {
        // create a survey element with a bucket of 7 weeks and set the
        // targetPercentage to 100% to make the test easier
        var sampleRate = 100;
        var buckets = 7;
        var td = this.getTestDiv();

        // mock the time to be 1st dec; this way we verify that our bucketing
        // works across calendar boundaries (week numbers dont go wrong at 52)
        // (note month in this notation is zero indexed; hence 11)
        var dec1 = new Date(2014, 11, 1);
        var clock = sandbox.useFakeTimers(dec1.getTime());
        var usersSurveyed = 0;

        // now add elements 14 times each with a one week gap, and verify that
        // we only launched the survey twice.
        for (var i = 0; i < 14; i++) {
          // we add the element twice for "this week" to verify that we do not
          // survey a user twice in one week.
          var x = addElement_(td, sampleRate, buckets);
          if (x.userSurveyed) {
            usersSurveyed++;
          }
          x = addElement_(td, sampleRate, buckets);
          if (x.userSurveyed) {
            usersSurveyed++;
          }

          // now increase the clock by a week and add more elements
          clock.tick(ONE_WEEK);
        }
        assert.equal(usersSurveyed, 2, 'only surveyed twice');
      });


    });

  });


  // ----------------------- helper functions --------------------------

  function assertUserSurveyed_(surveyElement, opt_msg) {
    opt_msg = opt_msg || '';
    assert.isTrue(surveyElement.userSurveyed, 'user surveyed ' + opt_msg);

    sinon.assert.calledWith(GoogleConsumerSurvey.prototype.appendChild,
        sinon.match.instanceOf(HTMLScriptElement));

    sinon.assert.calledWith(GoogleConsumerSurvey.prototype.appendChild,
        sinon.match.has('src', sinon.match('site=' + FAKE_SITE_ID)));
  }


  function assertUserNotSurveyed_(surveyElement, opt_msg) {
    opt_msg = opt_msg || '';
    assert.notOk(surveyElement.userSurveyed, 'not surveyed ' + opt_msg);
    sinon.assert.notCalled(GoogleConsumerSurvey.prototype.appendChild,
        'not added to head ' + opt_msg);
  }


  function addElement_(parent, targetPercentage, bucketing) {
    var x = createElement_(targetPercentage, bucketing);
    parent.appendChild(x);
    return x;
  }

  function createElement_(targetPercentage, bucketing) {
    var x = document.createElement('google-consumer-survey');
    x.siteId = FAKE_SITE_ID;
    x.targetPercentage = targetPercentage;
    x.bucketing = bucketing;
    return x;
  }

  function resetLocalStorage_() {
    dummyUUID = undefined;
    dummyTimestamp = undefined;
  }

  return {};
});


