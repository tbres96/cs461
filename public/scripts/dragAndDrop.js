var BOARDS = 'Boards';
var TASKS = "Tasks";

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTask(oldRef,newRef){
	oldRef.once('value', function(snapshot){
	  newRef.update(snapshot.val(), function(error){
		  if( !error ) { oldRef.remove(); }
		  else if( typeof(console) !== 'undefined' && console.error ) {console.error(error); }
	  });
  });
}

function drag(ev, column, taskID) {
  ev.dataTransfer.setData("text", ev.target.id);
  /*
  //THIS LINE IS FOR LOCAL DEVELOPMENT
  var boardID = "Board1"
  */
  //USE THIS LINE
  var boardID = sessionStorage.getItem('boardID');
  
  ev.dataTransfer.setData("col", column);
  ev.dataTransfer.setData("task", taskID);
}

function drop(ev, el, column) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var boardID = "Board1"
  //var boardID = sessionStorage.getItem('boardID');
  
  //firebase stuff
  var taskID = ev.dataTransfer.getData("task");
  var col = ev.dataTransfer.getData("col");
  var oldRef = firebase.database().ref().child(BOARDS).child(boardID).child(TASKS).child(col).child(taskID);
  var newRef = firebase.database().ref().child(BOARDS).child(boardID).child(TASKS).child(column).child(taskID);
  moveTask(oldRef,newRef);
  //end firebase stuff
  
  el.appendChild(document.getElementById(data));
}
