/*
	shorthash
	(c) 2013 Bibig
	
	https://github.com/bibig/node-shorthash
	shorthash may be freely distributed under the MIT license.
*/

// refer to: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
export function bitwise(str) {
  var hash = 0;
  if (str.length == 0) return hash;
  for (var i = 0; i < str.length; i++) {
    var ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

function table(num) {
  var t = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return t[num];
}

/**
 * 10进制转化成62进制以内的进制
 * convert 10 binary to customized binary, max is 62
 * @param {number} integer
 * @param {number} binary
 * @returns {string}
 */
export function binaryTransfer(integer, binary = 62) {
  var stack = [];
  var num;
  var sign = integer < 0 ? "-" : "";

  integer = Math.abs(integer);

  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    stack.push(table(num));
  }

  if (integer > 0) {
    stack.push(table(integer));
  }

  return sign + stack.reverse().join("");
}

/**
 * why choose 61 binary, because we need the last element char to replace the minus sign
 * eg: -aGtzd will be ZaGtzd
 */
export default function unique(text) {
  var id = binaryTransfer(bitwise(text), 61);
  return id.replace("-", "Z");
}
