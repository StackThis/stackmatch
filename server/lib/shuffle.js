shuffle = function(array) {
  //based on Fisher-Yates shuffle algorithm
  var currIndex = array.length;
  var tempValue;
  var randomIndex;

  while (0 !== currIndex) {
    randomIndex = Math.floor(Math.random() * currIndex);
    currIndex -= 1;

    tempValue = array[currIndex];
    array[currIndex] = array[randomIndex];
    array[randomIndex] = tempValue;
  }

 return array;
}
