function createMutationObserverObs() {
  return Rx.Observable.create(function(obs) {
    var observer = new MutationObserver(function(mutations) {
      obs.next(true);
    });
   
    observer.observe(document.documentElement, { 
      childList: true,
      subtree: true
    });

    return function() {
      console.log('Disposing MO');  
      observer.disconnect();
    }
  });
}

function addElement(id) {
  var elem = document.createElement('DIV');
  elem.id = id;
  document.body.appendChild(elem);
}

function addEelementWithDelay(id, delay) {
  setTimeout(function() {
    addElement(id);
  }, delay);
}

addEelementWithDelay('test1', 1000);
addEelementWithDelay('test2', 3000);
addEelementWithDelay('test3', 5000);

function elementExists(action) {
  return $(action.selector).length > 0;
}

function elementNotExists(action) {
  return $(action.selector).length === 0;
}

function processExistingElems(actions) {
  actions.forEach(function(action) {
    $(action.selector).html(action.content);
  });
}

function findBy(selector, actions) {
  return actions.filter(selector);
}

var actions = [
    {selector: '#test1', action: 'setContent', content: '<h3>test1</h3>'},
    {selector: '#test2', action: 'setContent', content: '<h3>test2</h3>'},
    {selector: '#test3', action: 'setContent', content: '<h3>test3</h3>'}
  ];

function notEmpty(value) {
  return value.length > 0;
}

function extract(arr) {
  return arr[0];
}

var findExisting = function(actions) {
  return findBy(elementExists, actions); 
};

var findNonExisting = function(actions) {
  return findBy(elementNotExists, actions); 
};

var subject = new Rx.Subject();
var hotSubject = subject
                  .zip(createMutationObserverObs()) //Rx.Observable.interval(1000)
                  .map(extract)
                  .share();

var existing = hotSubject.takeWhile(notEmpty).map(findExisting);

existing.subscribe(
function(elems) {
  console.log('existing', elems);
  processExistingElems(elems);
},
function(elems) {
  console.log('error existing', elems);
},
function(elems) {
  console.log('complete existing', elems);
});

var nonExisting = hotSubject.takeWhile(notEmpty).map(findNonExisting);

nonExisting.subscribe(function(elems) {
  console.log('non-existing', elems);
  subject.next(elems);
},
function(elems) {
  console.log('error non-existing', elems);
},
function(elems) {
  console.log('complete non-existing', elems);
});

subject.next(actions);