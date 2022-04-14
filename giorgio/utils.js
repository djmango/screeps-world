
const getRandomIntInclusive = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

const randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
};

const randomElement = function (array) {return array[Math.floor(Math.random() * array.length)]};

const sumObjectValues = obj => Object.values(obj).reduce((a, b) => a + b);

const equals = (a, b) => {
    if (a === b) return true;
  
    if (a instanceof Date && b instanceof Date)
      return a.getTime() === b.getTime();
  
    if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
      return a === b;
  
    if (a.prototype !== b.prototype) return false;
  
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
  
    return keys.every(k => equals(a[k], b[k]));
};

module.exports = {
    getRandomIntInclusive,
    randomProperty,
    randomElement,
    sumObjectValues,
    equals
}
