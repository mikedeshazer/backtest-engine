(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

 macd = require('macd')
 /*
 
 data=[1,2,3,4,5,6,2,3,4,5,6,7,10,1,3];
r= macd(data)
console.log(r)

*/

function doMacd(data){
  return macd(data);
}


},{"macd":2}],2:[function(require,module,exports){
'use strict';

const isNumber = subject => typeof subject === 'number';

const isArray = Array.isArray;

// Dynamic Weighted Moving Average

// @param {Number|Array.<Number>} alpha
var dma = (data, alpha, noHead) => {

  const length = data.length;

  if (alpha > 1) {
    return Array(length)
  }

  if (alpha === 1) {
    return data.slice()
  }

  const noArrayWeight = !isArray(alpha);
  const ret = [];

  let datum;

  // period `i`
  let i = 0;

  // `s` is the value of the DWMA at any time period `i`
  let s = 0;

  // Handles head
  for (; i < length; i ++) {
    datum = data[i];

    if (
      isNumber(datum)
      && (
        noArrayWeight
        || isNumber(datum)
      )
    ) {

      ret[i] = noHead
        ? 0
        : datum;

      s = datum;
      i ++;

      break
    }
  }

  // Dynamic weights: an array of weights
  // Ref:
  // https://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average
  // with a dynamic alpha
  if (!noArrayWeight) {
    for (; i < length; i ++) {
      datum = data[i];

      isNumber(datum) && isNumber(alpha[i])
        ? s =
          ret[i] = alpha[i] * datum + (1 - alpha[i]) * s
        : ret[i] = ret[i - 1];
    }

    return ret
  }

  const o = 1 - alpha;

  // Fixed alpha
  for (; i < length; i++) {
    datum = data[i];

    isNumber(datum)
      ? s =
        ret[i] = alpha * datum + o * s
      : ret[i] = ret[i - 1];
  }

  return ret
};

// Smoothed moving average

// Exponential moving average with 86% total weight

var ema = (data, size) => dma(data, 2 / (size + 1));

// simple moving average

// Weighted moving average

const error = (
  message
  // code
) => {
  const e = new Error(message);

  // if (code) {
  //   e.code = code
  // }

  throw e
};


const manipulate2Array = (a, b, mutator) => {
  if (a.length !== b.length) {
    error('the length of arrays not match');
  }

  return a.map((x, i) => mutator(x, b[i]))
};


const manipulateArray = (a, b, mutator) => {
  return a.map(x => mutator(x, b))
};


const isArray$1 = (a, b) => [a, b].map(Array.isArray);

const cleanArray = (array) => {
  array.forEach((item, i) => {
    if (item !== item) {
      delete array[i];
    }
  });
};

const orderUnaware = (
  a, b, mutator, mutatorReverse,
  ensureNumber
) => {
  const [A, B] = isArray$1(a, b);

  const ret = A
    ? B
      ? manipulate2Array(a, b, mutator)
      : manipulateArray(a, b, mutator)
    : B
      ? manipulateArray(b, a, mutatorReverse)
      : error('at least one array is required');

  if (ensureNumber) {
    cleanArray(ret);
  }

  return ret
};


const orderAware = (
  a, b, mutator,
  ensureNumber
) => {
  const [A, B] = isArray$1(a, b);

  const ret = A
    ? B
      ? manipulate2Array(a, b, mutator)
      : manipulateArray(a, b, mutator)
    : error('the first argument must be an array');

  if (ensureNumber) {
    cleanArray(ret);
  }

  return ret
};

const sub = (a, b) => a - b;

var sub$1 = (a, b, n) => orderAware(a, b, sub, n);

const mul = (a, b) => a * b;

var mul$1 = (a, b, n) => orderUnaware(a, b, mul, mul, n);

var index = ((data, slowPeriods = 26, fastPeriods = 12, signalPeriods = 9) => {
  const MACD = sub$1(ema(data, fastPeriods), ema(data, slowPeriods), 1);

  const signal = ema(MACD, signalPeriods);
  const histogram = mul$1(2, sub$1(MACD, signal), 1);

  return {
    MACD,
    signal,
    histogram
  };
});

module.exports = index;

},{}]},{},[1]);
