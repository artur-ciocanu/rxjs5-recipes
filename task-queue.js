function handleCatch(err) {
  return Rx.Observable.of(err);
}

function handleError(obs) {
  return obs.catch(handleCatch);
}

function createTaskQueue() {
  var subject= new Rx.Subject();

  subject
  .concatMap(handleError)
  .subscribe(function(data) {
    console.log('onNext', data);
  }, 
  function(error) {
    console.log('onError', error);
  });

  return {
    addTask: function(task) {
      subject.next(task);
    }
  }
}