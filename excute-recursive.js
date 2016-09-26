function notEmpty(value) {
  return value.length > 0;
}

function createObs(iteration) {
  var result = iteration
  .map(function(item){ return item + 1; })
  .filter(function(item) { return item % 2 === 0; });  

  return Rx.Observable.of(result);
}

function extract(arr) {
  return arr[1];
}

var loopingObs = Rx.Observable.of([1, 2, 3])
                .expand(createObs)
                .takeWhile(notEmpty);


Rx.Observable.interval(1000)
.zip(loopingObs)
.map(extract)
.subscribe(function(item) {
  console.log('Result:', item);
});
