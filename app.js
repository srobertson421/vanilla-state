(function main() {
  var RENDEREVENT = new CustomEvent('render');

  var initialState = {
    count: 0,
    message: ''
  };

  var STATES = [initialState];

  function emitEvent(event) {
    document.dispatchEvent(event);
  }

  function updateState(newState) {
    var currentState = STATES[STATES.length - 1];
    STATES.push({ ...currentState, ...newState });
    if(STATES.length >= 50) {
      STATES.splice(0, STATES.length / 2);
    }
    emitEvent(RENDEREVENT);
  }

  // Currently render recursively moves through the whole DOM tree
  // looking for data-state attributes and applying the values
  // Might be a more efficient way to do it using keys
  function render(startingNode) {
    var previousState = STATES[STATES.length - 2] || initialState;
    var currentState = STATES[STATES.length - 1];
    startingNode.childNodes.forEach(function(child) {
      if(child.nodeType === 1) {
        if(child.dataset.state) {
          if(currentState[child.dataset.state] !== undefined || currentState[child.dataset.state] !== null) {
            if(currentState[child.dataset.state] !== previousState[child.dataset.state]) {
              child.innerHTML = currentState[child.dataset.state];
            }
          }
        }

        if(child.childNodes.length) {
          render(child);
        }
      }
    });
  }

  document.getElementById('message-box').addEventListener('input', function(e) {
    updateState({ message: e.target.value });
  });

  document.getElementById('inc-button').addEventListener('click', function(e) {
    var currentState = STATES[STATES.length - 1];
    updateState({ count: currentState.count + 1 });
  });

  document.addEventListener('render', function(e) {
    render(document.body);
  });

  render(document.body);
})();
