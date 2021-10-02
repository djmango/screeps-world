
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

module.exports = {
    getRandomIntInclusive,
    randomProperty,
    randomElement,
    sumObjectValues
}