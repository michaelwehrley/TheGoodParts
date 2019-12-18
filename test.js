function log(arg) {
  document.writeln(arg)
}

function add(a, b) {
  debugger
  return a + b;
}

function sub(a, b) {
  return a - b;
}

function mult(a, b) {
  return a * b;
}

function identity(id) {
  return id;
}

function identityf(x) {
  return function() {
    return x;
  }
}

function addf(x) {
  return function(y) {
    return add(x, y)
  }
}

log(addf(3)(4))