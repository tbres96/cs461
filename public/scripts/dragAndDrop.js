var BOARDS = 'Boards';
var TASKS = "Tasks";

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTask(oldRef,newRef, msg){
	oldRef.once('value', function(snapshot){
	  newRef.update(snapshot.val(), function(error){
		if( !error ) { 
			var numActions = snapshot.child('ActionHistory').numChildren();
			oldRef.remove(); 
			var todaysDate = new Date(Date.now());
			var today = "(" + numActions.toString() + ") " + (todaysDate.getMonth() + 1) + "-" + todaysDate.getDate() + "-" + todaysDate.getFullYear() + ", ";
			today += todaysDate.getHours() + ":" + todaysDate.getMinutes() + ":" + todaysDate.getSeconds();
			newRef.child("ActionHistory").update({
				[today]: msg
			});
			today += ", " + msg;
			newRef.update({
				LatestAction: today
			});
		}else if( typeof(console) !== 'undefined' && console.error ) {console.error(error); }
	  });
  });
}

function drag(ev, column, taskID) {
  ev.dataTransfer.setData("text", ev.target.id);
  ev.dataTransfer.setData("col", column);
  ev.dataTransfer.setData("task", taskID);
}

function drop(ev, el, column) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var boardID = sessionStorage.getItem('boardID');
  
  //firebase stuff
  var taskID = ev.dataTransfer.getData("task");
  var col = ev.dataTransfer.getData("col");
  var oldRef = firebase.database().ref().child(BOARDS).child(boardID).child(TASKS).child(col).child(taskID);
  var newRef = firebase.database().ref().child(BOARDS).child(boardID).child(TASKS).child(column).child(taskID);
  var message = sessionStorage.getItem('User') + " moved task from " + col + " to " + column;
  if(!newRef.isEqual(oldRef)){
	moveTask(oldRef,newRef, message);
  }
  //end firebase stuff
  
  el.appendChild(document.getElementById(data));
}
