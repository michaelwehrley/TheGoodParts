function log(arg) {
  document.writeln(arg)
}

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

log(composeu(doubl, square)(5)) // 100
