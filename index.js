"use strict";

// Used to display answers to the screen in the index.html
function log(arg) {
  document.writeln(arg)
}

// Functions you will need...
function identity(id) {
  return id;
}

function identityf(x) {
  return function () {
    return x;
  }
}

function sub(a, b) {
  return a - b;
}

function mul(a, b) {
  return a * b;
}

function add(a, b) {
  return a + b;
}

function addf(x) {
  return function (y) {
    return x + y;
  }
}

function liftf(bfn) {
  return function(x) {
    return function(y) {
      return bfn(x, y);
    } 
  }
}

var addf = liftf(add);
addf(3)(4) // 7
liftf(mul)(5)(6) // 30

function curry(fn, x) {
  return function (y) {
    return fn(x, y)
  }
}

var add3 = curry(add, 3);
add3(4); // 7
curry(mul, 5)(6); // 30

var inc = curry(add, 1);
inc(5);  // 6
inc(inc(5));  // 7

var inc = liftf(add)(1)
inc(5) // 6

var inc = addf(1)
inc(5) // 6

function twice(fn) {
  return function (x) {
    return fn(x, x);
  }
}

add(11, 11) // 22
var doubl = twice(add);
doubl(11); // 22
var square = twice(mul);
square(11); // 121

function reverse(fn) {
  return function(a, b) {
    return fn(b, a);
  }
}

var bus = reverse(sub);
bus(3, 2) // -1

function composeu(firstFn, secondFn) {
  return function(x) {
    return secondFn(firstFn(x));
  }
}

composeu(doubl, square)(5); // 100

function composeb(firstFn, secondFn) {
  return function(x, y, z) {
    return secondFn(firstFn(x, y), z);
  }
}

composeb(add, mul)(2, 3, 7); // 35

function limit(fn, limit) {
  var count = 0;

  return function(a, b) {
    if (count < limit) {
      count++;
      return fn(a, b);
    }
    return undefined; // To be explicit (self documenting code)
  }
};

var add_ltd = limit(add, 1);

add_ltd(3, 4); // 7
add_ltd(3, 5); // undefined

function _from(start) {
  return function() {
    var next = start;
    start += 1;

    return next;
  }
}

function from(initial) {
  return function() {
    return initial++;
  }
}

var index = from(0);
index(); // 0
index(); // 1
index(); // 2

function to(generator, limit) {
  return function() {
    var value = generator();
    if (value < limit) {
      return value;
    }
    return undefined; // Crockford <3 this!
  }
}

var index = to(from(1), 3);
index(); // 1
index(); // 2
index(); // undefined

function fromTo(start, end) {
  // First rule of functional programming, let the functions do the work. - DC
  return to(from(start), end);
}

var index = fromTo(0, 3);

index(); // 0
index(); // 1
index(); // 2
index(); // undefined

var ele = __element(['a', 'b', 'c', 'd'], fromTo(1, 3));

ele(); // 'b'
ele(); // 'c'
ele(); // undefined

function __element(list, gen) {
  return function() {
    // accidently works b/c UNLESS someone creates
    // an `undefined` property on the array
    // i.e., list.undefined = 5;
    return list[gen()];
  }
}

var ele = _element(['a', 'b', 'c', 'd'], fromTo(1, 3));

ele(); // 'b'
ele(); // 'c'
ele(); // undefined

function _element(list, gen) {
  var index;

  return function() {
    index = gen();
    if (index !== undefined) {
      return list[index];
    } else {
      return undefined;
    }
  }
}

var ele = element(['a', 'b', 'c', 'd']);

ele(); // 'b'
ele(); // 'c'
ele(); // 'b'
ele(); // 'c'
ele(); // undefined

// First rule of functional programming, let the functions do the work. - DC
function element(array, gen) {
  var index;
  // Be explicit about the world: var gen = gen || fromTo(0, array.length);
  if (gen === undefined) {
    gen = fromTo(0, array.length)
  }

  return function() {
    index = gen();
    if (index !== undefined) {
      return array[index];
    } else {
      return undefined;
    }
  }
}

var array = [], col = collect(fromTo(0, 2), array);

col(); // 0
col(); // 1
col(); // undefined
array; // [0, 1]

function collect(gen, array) {
  var value;

  return function() {
    value = gen();
    if (value !== undefined) {
      array.push(value);
    }
    return value;
  }
}

var fil = filter(fromTo(0, 5), function third(value) {
  return (value % 3) === 0;
});

fil() // 0
fil() // 3
fil() // undefined

function _filter(gen, predicate) {
  var value;

  return function() {
    do {
      value = gen();
    } while (
      value !== undefined &&
      !predicate(value)
    );
    return value;
  }
}

// Tail call optimization (TCO): In *ES6* it is possible
// to call a function from another function (i.e., recursion) without growing the call stack.
// https://hackernoon.com/es6-tail-call-optimization-43f545d2f68b
function filter(gen, predicate) {
  var value;

  return function recur() {
    value = gen();

    if (value === undefined || predicate(value)) {
      return value;
    }
    return recur();
  }
}

var con = concat(fromTo(0, 3), fromTo(0, 2));

con(); // 0
con(); // 1
con(); // 2
con(); // 0
con(); // 1
con(); // undefined

function _concat(fn1, fn2) {
  var value;

  return function() {
    value = fn1();
    if (value !== undefined) {
      return value;
    }
    value = fn2();
    if (value !== undefined) {
      return value;
    }
  }
}

function concat(gen1, gen2) {
  return function() {
    var value = gen1();
    if (value === undefined) {
      return gen2();
    } else {
      return value;
    }
  }
}

var geng = gensymf("G");
var genh = gensymf("H");

geng(); // "G1"
genh(); // "H1"
geng(); // "G2"
genh(); // "H2"

function _gensymf(value) {
  var index = 0;

  return function() {
    index++;
    return value + index
  }
}

function gensymf(value) {
  var index = from(1);

  return function() {
    return value + index();
  }
}

var fib = fibonaccif(0, 1);

fib(); // 0
fib(); // 1
fib(); // 1
fib(); // 2
fib(); // 3
fib(); // 5

function fibonaccif(initial, next) {
  var previous;

  return function() {
    previous = initial;
    initial = next;
    next = add(previous, next);

    return previous;
  }
}

function counter(initial) {
  return {
    down: function() {
      return initial -= 1;
    },
    up: function() {
      return initial += 1;
    }
  };
}

var object = counter(10),
    up = object.up,
    down = object.down;

up(); // 11
down(); // 10
down(); // 9
up(); // 10

function revocable(fn) {
  return {
    invoke: function(a, b) {
      if (fn !== undefined) {
        return fn(a, b);
      }
    },
    revoke: function() {
      fn = undefined;
    }
  }
}

var rev = revocable(add),
    add_rev = rev.invoke;

add_rev(3, 4); // 7
rev.revoke();
add_rev(5, 7); // undefined

function m(value, source) {
  return {
    value: value,
    source: (typeof source === 'string' ) ? source : String(value)
  };
}

JSON.stringify(m(1));
JSON.stringify(m(Math.PI, 'pi'));

addm(m(3), m(4)); // { "value": 7, "source": "(3+4)" }
addm(m(1), m(Math.PI, 'pi')); // { "value": 4.14159, "source": "(1+pi)" }

function addm(option1, option2) {
  return JSON.stringify(m(option1.value + option2.value, '(' + option1.source + '+' + option2.source + ')'));
}

var addm = liftm1(add, "+");
JSON.stringify(addm(m(3), m(4))); // { "value": 7, "source": "(3+4)" }

var addm = liftm1(mul, "*");
JSON.stringify(addm(m(3), m(4))); // { "value": 7, "source": "(3+4)" }

function liftm1(binary, operation) {
  return function(option1, option2) {
    return JSON.stringify(m(binary(option1.value, option2.value), '(' + option1.source + operation + option2.source + ')'));
  }
}

function liftm(binary, operation) {
  return function(option1, option2) {
    if (typeof option1 === 'number') {
      option1 = m(option1);
    }

    if (typeof option2 === 'number') {
      option2 = m(option2);
    }

    return JSON.stringify(m(binary(option1.value, option2.value), '(' + option1.source + operation + option2.source + ')'));
  }
}

var addm = liftm(add, "+");
JSON.stringify(addm(3, 4)); // { "value": 7, "source": "(3+4)" }

// Simple Array Expressions

// var sae = [mul, 5, 11];
// exp(sae); // 55
// exp(42); // 42

function exp2(value) {
  if (Array.isArray(value)) {
    return value[0](value[1], value[2]);
  } else {
    return value;
  }
}

function exp(value) {
  if (Array.isArray(value)) {
    return value[0](exp(value[1]), exp(value[2]));
  } else {
    return value;
  }
}

// var sae = [mul, 5, 11];
// exp(sae); // 55
// exp(42); // 42
var nae = [Math.sqrt, [add, [square, 5], [square, 11]]];
exp(nae); // 5

function _addg(value) {
  var sum;

  function foo(value) {
    if (value === undefined) return sum;

    sum = sum || 0;
    sum += value
    return foo;
  }

  return foo(value);
}

function addg(first) {
  function more(next) {
    if (next === undefined) {
      return first;
    }

    first += next
    return more;
  }

  if (first !== undefined) {
    return more;
  }
}

addg() // undefined
addg(2)() // 2
addg(2)(7)() // 9
addg(3)(0)(4)() // 7
addg(1)(2)(4)(8)() // 15

function _liftg(binary) {
  var product;

  function foo(value) {
    if (value === undefined) {
      // don't return a function if it isn't going to be invonked again.
      return product;
    }
    if (product === undefined) {
      product = value;
      return foo;
    }

    product = binary(product, value)
    return foo;
  }

  return foo;
}

function liftg(binary) {
  return function (first) {
    if (first === undefined) {
      // don't return a function if it isn't going to be invonked again.
      return first;
    }

    return function more(next) {
      if (next === undefined) {
        return first;
      }
      first = binary(first, next);
      return more;
    }
  }
}

liftg(mul)() // undefined
liftg(mul)(3)() // 3
liftg(mul)(3)(0)(4)() // 0
liftg(mul)(1)(2)(4)(8)() // 64

function arrayg(first) {
  var array = [];

  function more(next) {
    if (next === undefined) {
      return array;
    }
    array.push(next)
    return more;
  }

  return more(first); // includes first/base case!  WOW!
}

arrayg(); // []
arrayg(3)(); // [3]
arrayg(3)(4)(5)(); // [3, 4, 5]

// use liftg! 

function continuize(unary) {
  return function(callbar, arg) {
    return callbar(unary(arg));
  }
}

var sqrtc = continuize(Math.sqrt);
sqrtc(alert, 81) // alert(81)
