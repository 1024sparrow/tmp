'use strict';

// Добавим пару дополнительных методов в стандартный список.
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
Array.shuffle = function(array) {
  var currentIndex = this.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = this[currentIndex];
    this[currentIndex] = this[randomIndex];
    this[randomIndex] = temporaryValue;
  }
  return this;
}

Array.swap = function(p_1, p_2) {
    let tmp = this[p_2];
    this[p_2] = this[p_1];
    this[p_1] = tmp;
}
