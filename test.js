// Does not work with `new funcA.bind(thisArg, args)`
// if (Function.prototype.bind) (function () {
//   var slice = Array.prototype.slice;
//   Function.prototype.bind = function () {
//     var thatFunc = this, thatArg = arguments[0];
    
//     // We have access to the `arguments`
//     // removes all arguments after 1 by removing `this` (or `null` in this case)
//     var args = slice.call(arguments, 1);
//     if (typeof thatFunc !== 'function') {
//       // closest thing possible to the ECMAScript 5
//       // internal IsCallable function
//       throw new TypeError('Function.prototype.bind - ' +
//         'what is trying to be bound is not callable');
//     }
//     return function () {
//       // We have access to the `arguments` of the function called
//       // add to the args array the NEW arguments - see no `(arguments, 1)`
//       var funcArgs = args.concat(slice.call(arguments))
//       debugger;
//       return thatFunc.apply(thatArg, funcArgs);
//     };
//   };
// })();

// log(addf(3)(4, 5, 6)) // 7

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
log(addf(3)(4)) // 7
log(liftf(mul)(5)(6)) // 30
