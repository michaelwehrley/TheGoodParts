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
    value = generator();
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

var con = conact(fromTo(0, 3), fromTo(0, 2));

con(); // 0
con(); // 1
con(); // 2
con(); // 0
con(); // 1
con(); // undefined

function _conact(fn1, fn2) {
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
    value = gen1();
    if (value === undefined) {
      return gen2();
    } else {
      return value;
    }
  }
}

