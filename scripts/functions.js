var db = firebase.database();
var BOARDS = 'Boards';
var USERS = 'Users';
var TASKS = "Tasks";
var NAME = "Name";
var DESCRIPTION = "Description";
var COMMITS = "Commits";
var OWNERS = "Owners";
var LASTACTION = "LatestAction";
var DUEDATE = "DueDate";

function isLater(firstDate, secondDate){
	if(firstDate > secondDate){
		return 1;
	}else if(firstDate < secondDate){
		return -1;
	}else{
		return 0;
	}
}
	
function getTaskInfo(board, section, task){
    var boardRef = db.ref().child(BOARDS).child(board).child(TASKS).child(section).child(task);
	boardRef.on('value', function(snapshot){
        if(snapshot.exists()){
			//task name
			if(snapshot.child(NAME).exists()){
				document.getElementById("name").innerHTML = "<h1>Task name: " + snapshot.child(NAME).val() + "</h1>";
				document.getElementById("name").style.display = "inline";
			}
			
			//description
			if(snapshot.child(DESCRIPTION).exists()){
				document.getElementById("description").innerHTML = "<p><strong>Description: </strong>" + snapshot.child(DESCRIPTION).val() + "</p>";
				document.getElementById("description").style.display = "inline";
			}
			
			//owners
			if(snapshot.child(OWNERS).exists()){
				var ownersMsg = "<p><strong>Owners: </strong>";
				if(snapshot.child(OWNERS).hasChildren()){
					ownersMsg += "<ul>";
					snapshot.child(OWNERS).forEach(function(childSnapshot){
						if(childSnapshot.val()){
							var userID = childSnapshot.key;
							ownersMsg += "<li>" + userID + "</li>";
						}
					});
					ownersMsg += "</ul>";
				}else{
					ownersMsg += "None";
				}
				ownersMsg += "</p>";
				document.getElementById("owners").innerHTML = ownersMsg;
				document.getElementById("owners").style.display = "inline";
			}
			
			//commits
			if(snapshot.child(COMMITS).exists()){
				var comMsg = "<p><strong>Commits: </strong>";
				if(snapshot.child(COMMITS).hasChildren()){
					comMsg += "<ul>";
					snapshot.child(COMMITS).forEach(function(childSnapshot){
						comMsg += "<li>" + childSnapshot.key;
						if(childSnapshot.child("User").exists() || childSnapshot.child("Action").exists()){
							comMsg += "<ul>";
							if(childSnapshot.child("User").exists()){
								comMsg += "<li>" + childSnapshot.child("User").val() + "</li>";
							}
							if(childSnapshot.child("Action").exists()){
								comMsg += "<li>" + childSnapshot.child("Action").val() + "</li>";
							}
							comMsg += "</ul>";
						}
						comMsg += "</li>";
					});
					comMsg += "</ul>";
				}else{
					comMsg += "None";
				}
				comMsg += "</p>";
				document.getElementById("commits").innerHTML = comMsg;
				document.getElementById("commits").style.display = "inline";
			}
			
			//date of last action
			if(snapshot.child(LASTACTION).exists()){
				document.getElementById("lastAction").innerHTML = "<h3>Last Update: " + snapshot.child(LASTACTION).val() + "</h3>";
				document.getElementById("lastAction").style.display = "inline";
			}
			
			//due date
			if(snapshot.child(DUEDATE).exists()){
				document.getElementById("dueDate").innerHTML = "<h2>Date Due: " + snapshot.child(DUEDATE).val() + "</h2>";
				document.getElementById("dueDate").style.display = "inline";
			}
			
			//highlight last update based on date
			if(snapshot.child(LASTACTION).exists() && snapshot.child(DUEDATE).exists()){
				var lastAction = snapshot.child(LASTACTION).val();
				var dueDate = snapshot.child(DUEDATE).val();
				var result = isLater(lastAction,dueDate);
				//XXX colors aren't showing???
				if(result == 1){
					//highlight in red
					document.getElementById("dueDate").style.backgroundColor = "red";
					console.log("red");
				}else if(result == 0){
					//highlight in yellow
					document.getElementById("dueDate").style.backgroundColor = 'yellow';
					console.log("yellow");
				}else{	//result == -1
					//highlight in green
					document.getElementById("dueDate").style.backgroundColor = 'green';
					console.log("green");
				}
			}
			
		}else{
			document.getElementById("name").innerHTML = "snapshot doesn't exist";
		}
	});
}

function fillTaskPage(){
	/*
	//UNCOMMENT THIS SECTION WHEN TESTING LOCALLY AND NOT COMING FROM THE KANBAN PAGE
	sessionStorage.setItem('board',"Board1");
	sessionStorage.setItem('task',"Task1");
	sessionStorage.setItem('column',"Todo");
	//END LOCAL DEV SECTION
	*/
	var board = sessionStorage.getItem('board');
	var column = sessionStorage.getItem('column');
	var task = sessionStorage.getItem('task');

    getTaskInfo(board,column,task);
}

function addUserToBoard(user){
	var dbRef = db.ref(BOARDS).child(sessionStorage.getItem('board')).child(USERS);
	dbRef.update({
		[user]: true
	});
}

function removeUserFromBoard(user){
	var dbRef = db.ref(BOARDS).child(sessionStorage.getItem('board')).child(USERS);
	dbRef.update({
		[user]: false
	});
}

function addUserToTask(user){
	var dbRef = db.ref(BOARDS).child(sessionStorage.getItem('board')).child(TASKS).child(sessionStorage.getItem('column')).child(sessionStorage.getItem('task')).child(OWNERS);
	dbRef.update({
		[user]: true
	});
}

function removeUserFromTask(user){
	var dbRef = db.ref(BOARDS).child(sessionStorage.getItem('board')).child(TASKS).child(sessionStorage.getItem('column')).child(sessionStorage.getItem('task')).child(OWNERS);
	dbRef.update({
		[user]: false
	});
}
