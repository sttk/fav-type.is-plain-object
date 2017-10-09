(function(){
'use strict';


var expect = chai.expect;



var isPlainObject = fav.type.isPlainObject;

describe('fav.type.isPlainObject', function() {

  it('Should return true when value is a plain object', function() {
    expect(isPlainObject({})).to.equal(true);
    expect(isPlainObject({ a: 1 })).to.equal(true);
    expect(isPlainObject(new Object())).to.equal(true);
    expect(isPlainObject(Object.create(Object.prototype))).to.equal(true);
    expect(isPlainObject(Object.create(null))).to.equal(true);
  });

  it('Should return false when value is not a plain object', function() {
    expect(isPlainObject(undefined)).to.equal(false);
    expect(isPlainObject(null)).to.equal(false);
    expect(isPlainObject(true)).to.equal(false);
    expect(isPlainObject(false)).to.equal(false);
    expect(isPlainObject(0)).to.equal(false);
    expect(isPlainObject(123)).to.equal(false);
    expect(isPlainObject(NaN)).to.equal(false);
    expect(isPlainObject(Infinity)).to.equal(false);
    expect(isPlainObject(new Number(123))).to.equal(false);
    expect(isPlainObject([])).to.equal(false);
    expect(isPlainObject([1, 2])).to.equal(false);
    expect(isPlainObject(new Array(1, 2))).to.equal(false);
    expect(isPlainObject(/a/g)).to.equal(false);
    expect(isPlainObject(new RegExp('a', 'g'))).to.equal(false);
    expect(isPlainObject(function() {})).to.equal(false);
    expect(isPlainObject(new Date())).to.equal(false);
    expect(isPlainObject(new Error())).to.equal(false);
    expect(isPlainObject(new Foo())).to.equal(false);
    expect(isPlainObject(new FooEx())).to.equal(false);
    expect(isPlainObject(new SubclassOfPlainObject())).to.equal(false);
    expect(isPlainObject(Object.create({}))).to.equal(false);
  });

  it('Should return false when value is a class instance', function() {
    if (!isSupportClass()) {
      this.skip();
      return;
    }

    var code = codeForClass();
    eval(code);
  });

  it('Should return false when value is a symbol', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    expect(isPlainObject(Symbol('foo'))).to.equal(false);
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
expect(isPlainObject(new Qux())).to.equal(false);\
expect(isPlainObject(new Quux())).to.equal(false);\
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

})();
