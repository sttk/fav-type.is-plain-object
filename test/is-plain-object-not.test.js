'use strict';

var chai = require('chai');
var expect = chai.expect;
var semver = require('semver');
var fav = {}; fav.type = {}; fav.type.isPlainObject = require('..');

var isNotPlainObject = fav.type.isPlainObject.not;

describe('fav.type.isPlainObject.not', function() {

  it('Should return false when value is a plain object', function() {
    expect(isNotPlainObject({})).to.equal(false);
    expect(isNotPlainObject({ a: 1 })).to.equal(false);
    expect(isNotPlainObject(new Object())).to.equal(false);
    expect(isNotPlainObject(Object.create(Object.prototype))).to.equal(false);
    expect(isNotPlainObject(Object.create(null))).to.equal(false);
  });

  it('Should return true when value is not a plain object', function() {
    expect(isNotPlainObject(undefined)).to.equal(true);
    expect(isNotPlainObject(null)).to.equal(true);
    expect(isNotPlainObject(true)).to.equal(true);
    expect(isNotPlainObject(false)).to.equal(true);
    expect(isNotPlainObject(0)).to.equal(true);
    expect(isNotPlainObject(123)).to.equal(true);
    expect(isNotPlainObject(NaN)).to.equal(true);
    expect(isNotPlainObject(Infinity)).to.equal(true);
    expect(isNotPlainObject(new Number(123))).to.equal(true);
    expect(isNotPlainObject([])).to.equal(true);
    expect(isNotPlainObject([1, 2])).to.equal(true);
    expect(isNotPlainObject(new Array(1, 2))).to.equal(true);
    expect(isNotPlainObject(/a/g)).to.equal(true);
    expect(isNotPlainObject(new RegExp('a', 'g'))).to.equal(true);
    expect(isNotPlainObject(function() {})).to.equal(true);
    expect(isNotPlainObject(new Date())).to.equal(true);
    expect(isNotPlainObject(new Error())).to.equal(true);
    expect(isNotPlainObject(new Foo())).to.equal(true);
    expect(isNotPlainObject(new FooEx())).to.equal(true);
    expect(isNotPlainObject(new SubclassOfPlainObject())).to.equal(true);
    expect(isNotPlainObject(Object.create({}))).to.equal(true);
  });

  it('Should return true when value is a class instance', function() {
    if (!isSupportClass()) {
      this.skip();
      return;
    }

    var code = codeForClass();
    eval(code);
  });

  it('Should return true when value is a symbol', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    expect(isNotPlainObject(Symbol('foo'))).to.equal(true);
  });

});


function Foo() {
  this.baz = 'Baz';
  return this;
}

function FooEx() {
  this.baz = 'Baaaaz';
}
FooEx.prototype = Foo.prototype;

Foo.prototype.bar = function() {
  return this.baz;
};

/*
var foo = new Foo();
console.log(foo);
console.log(foo.baz);
console.log(foo.bar());
console.log(typeof foo);
console.log(Object.prototype.toString.call(foo));
console.log(foo.constructor);
console.log(foo.constructor.name);
console.log(foo.prototype);
console.log(Object.getPrototypeOf(foo));
console.log(foo.constructor === Object);

var fooex = new FooEx();
console.log(fooex);
console.log(fooex.baz);
console.log(fooex.bar());
console.log(fooex.constructor === Object);
*/

function SubclassOfPlainObject() {}
SubclassOfPlainObject.prototype = {};

function codeForClass() {
  return "\
class Qux {\
  constructor(n) {\
    this.count = n || 1;\
  }\
\
  get text() {\
    return 'Q' + 'u'.repeat(this.count) + 'x';\
  }\
}\
\
class Quux extends Qux {\
  constructor(n) {\
    super(n);\
  }\
\
  get text() {\
    return 'Q' + 'u'.repeat(this.count * 2) + 'x';\
  }\
}\
\
/*\
const qux = new Qux(3);\
console.log(qux);\
console.log(qux.count);\
console.log(qux.text);\
console.log(qux.constructor === Object);\
*/\
\
/*\
const quux = new Quux(3);\
console.log(quux);\
console.log(quux.count);\
console.log(quux.text);\
console.log(quux.constructor === Object);\
*/\
\
expect(isNotPlainObject(new Qux())).to.equal(true);\
expect(isNotPlainObject(new Quux())).to.equal(true);\
";
}

function isSupportClass() {
  if (isNode()) {
    return semver.gte(process.version, '2.0.0');
  }

  if (typeof xslet !== 'undefined' && typeof xslet.platform !== 'undefined') {
    var ua = xslet.platform.ua;

    // Check by latest version
    if (ua.CHROME) {
      return true;
    }
    if (ua.FIREFOX) {
      return true;
    }
    if (ua.MSIE) {
      return false;
    }
    if (ua.EDGE) {
      return true;
    }
    if (ua.SAFARI) {
      return true;
    }
    if (ua.VIVALDI) {
      return true;
    }
    if (ua.PHANTOMJS) {
      return false;
    }
    return false;
  }
}

function isNode() {
  if (typeof process === 'object') {
    if (typeof process.kill === 'function') { // exist from v0.0.6
      return true;
    }
  }
  return false;
}
