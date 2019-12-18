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

function mult(a, b) {
  return a * b;
}

function add(a, b) {
  return a + b;
}

function addf(x) {
  return add.bind(null, x)
  // versus return add.bind(null, x, 4)
  // log(addf(3)())
}

log(addf(3)(4)) // 7
