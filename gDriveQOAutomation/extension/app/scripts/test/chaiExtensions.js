
chai.use(function(chai/*, utils*/) {

  chai.Assertion.addMethod('isValidQowtElement', function(expected) {

    this.assert(
        this._obj.isQowtElement,
        'is QowtElement',
        'is not QowtElement');

    var regEx = /^E-?\d+$/;
    var valid = this._obj.getEid && regEx.exec(this._obj.getEid());
    this.assert(
      valid,
      "expected #{this} to have a getEid function returning a valid EID",
      "expected #{this} NOT to have a getEid function returning a valid EID");

    if (expected) {
      this.assert(
          this._obj instanceof expected,
          'expected #{this} to be an instanceof #{exp}',
          'expected #{this} NOT to be an instanceof #{exp}',
          expected);
    }
  });

  chai.Assertion.addMethod('isValidUUID', function() {
    var regEx = /^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[a-f\d]{4}-[a-f\d]{12}$/i;
    var valid = regEx.exec(this._obj);
    this.assert(
        valid,
        "expected #{this} to have a valid UUID format",
        "expected #{this} NOT to have a valid UUID format");

  });


  //export tdd style
  var assert = chai.assert;
  assert.isValidUUID = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.be.isValidUUID(exp);
  };


  assert.isNotValidUUID = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.not.be.isValidUUID(exp);
  };


  assert.isValidQowtElement = function (val, exp, msg) {
    // client can call isValidQowtElement without an expected c'tor
    if (_.isString(exp) && msg === undefined) {
      msg = exp;
      exp = undefined;
    }
    new chai.Assertion(val, msg).to.be.isValidQowtElement(exp);
  };


  assert.isNotValidQowtElement = function (val, exp, msg) {
    // client can call isNotValidQowtElement without an expected c'tor
    if (_.isString(exp) && msg === undefined) {
      msg = exp;
      exp = undefined;
    }
    new chai.Assertion(val, msg).to.not.be.isValidQowtElement(exp);
  };
});
