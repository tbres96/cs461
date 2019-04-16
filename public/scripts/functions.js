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



function switchKanbanView(id, name){	
	sessionStorage.setItem('boardName',name);
	sessionStorage.setItem('boardID',id);
}

/*
Variable Used for testing purposes
var n = 0;
*/

function getListOfKanbans(){
	var boardRef = db.ref().child(BOARDS);
	boardRef.on('value', function(snapshot){
		//if BOARDS exist
		if(snapshot.exists()){
			//if BOARDS has any boards
			if(snapshot.hasChildren()){
				//for every board that exist
				var kanbanList = "<hr class='hr1'>";
				snapshot.forEach(function(childSnapshot){
					//set the name and ID of the board to a variable
					var boardName = childSnapshot.child(NAME).val();
					var boardID = childSnapshot.key;
					//check if any users exist
					if(childSnapshot.child(USERS).exists()){
						//look through every non currently logged in user
						var getUsers = "";
						var getOtherUsers = "";
						childSnapshot.child(USERS).forEach(function(userSnapshot){
							//if their values are true
							if(userSnapshot.val()){
								//n++; used for testing purposes
								if(userSnapshot.key != 'mellita'){ //sessionStorage.getItem('User') //'mellita') <<-- used for testing locally
									//n++; used for testing purposes
									getOtherUsers += userSnapshot.key + " ";
								}
							}
						});
						childSnapshot.child(USERS).forEach(function(userSnapshot){
							if(userSnapshot.val()){
								//if values match current user logged in
								if(userSnapshot.key == 'mellita'){ //sessionStorage.getItem('User') //'mellita') <<-- used for testing locally
									getUsers += userSnapshot.key + " ";
									//create list of kanbans that are links
									kanbanList += "<a href='' onclick='switchKanbanView(this.id, this.title)' id='" + boardID + "' title='" + boardName + "'>" + boardName + "</a>";
									kanbanList += "<hr class='hr1'>";
									//check the values of the current storage session for kanban board and id and based on thier value insert the following into variable
									if((sessionStorage.getItem('boardName') == null) && (sessionStorage.getItem('boardID') == null)){
										sessionStorage.setItem('boardName', boardName);
										var displayBoardName = "<h1>Now Viewing - " + sessionStorage.getItem('boardName') + "</h1>";
										sessionStorage.setItem('boardID', boardID);
										var displayBoardID = "<h2>Board ID - " + sessionStorage.getItem('boardID') + "</h2>"; 
									}
									else{
										var displayBoardName = "<h1>Now Viewing - " + sessionStorage.getItem('boardName') + "</h1>"; 
										var displayBoardID = "<h2>Board ID - " + sessionStorage.getItem('boardID') + "</h2>";
									}
									//display boardname
									document.getElementById("nameOfBoard").innerHTML = displayBoardName; 
									//display boardID
									document.getElementById("idOfBoard").innerHTML = displayBoardID;
									//display kanbanList
									document.getElementById("kanbans").innerHTML = kanbanList;

									//before moving forward make sure the tasks we are looking at are under the current board session storage
									if(sessionStorage.getItem('boardName') == boardName){
										//check if any task columns exist
										if(childSnapshot.child(TASKS).exists()){
											//look through every task column
											childSnapshot.child(TASKS).forEach(function(columnSnapshot){
												if(columnSnapshot.key == 'Todo'){
													//display column name
													var columnName = columnSnapshot.key;
													var displayColumnName = "<p style='font-size:25px;text-align:center;'><u>" + columnName + "</u></p>";
													document.getElementById("nameOfColumn1").innerHTML = displayColumnName; 
													//if column has task
													if(columnSnapshot.hasChildren()){
														//look through every task in this column and display their names
														var taskDisplay = "<ul>";
														columnSnapshot.forEach(function(taskSnapshot){
															sessionStorage.setItem('column', columnName);
															sessionStorage.setItem('task', taskSnapshot.child(NAME).val());
															//taskDisplay += "<div class='box'><li><a href=''>TaskName: " + taskSnapshot.child(NAME).val();
								taskDisplay += "<div class='box'><li><a href='javascript:setTask('Board1','Todo','Task1');'>TaskName: " + taskSnapshot.child(NAME).val();
															//taskDisplay += "<div class='box'><li><a href='javascript:setTask(sessionStorage.getItem('boardName'), columnName, taskSnapshot.child(NAME).val());'>TaskName: " + taskSnapshot.child(NAME).val();
															//taskDisplay += "<div class='box'><li><a href='setTask(sessionStorage.getItem('boardName'), columnName, taskSnapshot.child(NAME).val());'>TaskName: " + taskSnapshot.child(NAME).val();
															//if owners has existing users
															if(taskSnapshot.child(OWNERS).hasChildren()){
																var ownerStart = "<br>Owners:";
																var ownerName = " ";	
																//Look at every user who owns task
																taskSnapshot.child(OWNERS).forEach(function(ownerSnapshot){
																	if(ownerSnapshot.val()){
																		ownerName += ownerSnapshot.key + " ";
																	}
																});
																//if every user is not an owner
																if(!ownerName.replace(/\s/g, '').length){
																	ownerStart = "";
																}
																taskDisplay += ownerStart + ownerName + "<br>Users: " + getUsers + " " + getOtherUsers + "</a>";
																taskDisplay += "<button class='taskAddUsers' onclick='location.href=''; addUserToTask('mellita');'>Add an owner</button>";
																taskDisplay += "<button class='taskRemoveUsers' onclick='location.href=''; removeUserFromTask('mellita');'>Remove an owner</button>";
																taskDisplay += "</li></div><br>";
															}
															else{
																taskDisplay += "<br>Users: " + getUsers + " " + getOtherUsers + "</a>";
																taskDisplay += "<button class='taskAddUsers' onclick='location.href=''; addUserToTask('mellita');'>Add an owner</button>";
																taskDisplay += "<button class='taskRemoveUsers' onclick='location.href=''; removeUserFromTask('mellita');'>Remove an owner</button>"; 
																taskDisplay += "</li></div><br>";
															}
														});
														taskDisplay += "</ul>";
														document.getElementById("namesOfTodo").innerHTML = taskDisplay;
													}
												}
												//repeat steps above for columns Doing and Done
												if(columnSnapshot.key == 'Doing'){
													var columnName = columnSnapshot.key;
													var displayColumnName = "<p style='font-size:25px;text-align:center;'><u>" + columnName + "</u></p>";
													document.getElementById("nameOfColumn2").innerHTML = displayColumnName;
													if(columnSnapshot.hasChildren()){
														var taskDisplay = "<ul>";
														columnSnapshot.forEach(function(taskSnapshot){

															sessionStorage.setItem('column', columnName);
															sessionStorage.setItem('task', taskSnapshot.child(NAME).val());
															taskDisplay += "<div class='box'><li><a href='' onclick='setTask(sessionStorage.getItem('boardName');, columnName, TaskSnapshot.child(NAME).val());'>TaskName: " + taskSnapshot.child(NAME).val();
															if(taskSnapshot.child(OWNERS).hasChildren()){
																var ownerStart = "<br>Owners:";
																var ownerName = " ";
																taskSnapshot.child(OWNERS).forEach(function(ownerSnapshot){
																	if(ownerSnapshot.val()){
																		ownerName += ownerSnapshot.key + " ";
																	}
																});
																if(!ownerName.replace(/\s/g, '').length){
																	ownerStart = "";
																}
																taskDisplay += ownerStart + ownerName + "<br>Users: " + getUsers + " " + getOtherUsers + "</a>";
										taskDisplay += "<button class='taskAddUsers' onclick='location.href=''; addUserToTask('mellita');'>Add an owner</button>";
									taskDisplay += "<button class='taskRemoveUsers' onclick='location.href=''; removeUserFromTask('mellita');'>Remove an owner</button>";
																taskDisplay += "</li></div><br>";
															}
															else{
																taskDisplay += "<br>Users: " + getUsers + " " + getOtherUsers + "</a>";
																taskDisplay += "<button class='taskAddUsers' onclick='location.href=''; addUserToTask('mellita');'>Add an owner</button>";
																taskDisplay += "<button class='taskRemoveUsers' onclick='location.href=''; removeUserFromTask('mellita');'>Remove an owner</button>";
																taskDisplay += "</li></div><br>";
															}
														});
														taskDisplay += "</ul>";
														document.getElementById("namesOfDoing").innerHTML = taskDisplay;
													}
												}
												if(columnSnapshot.key == 'Done'){
													var columnName = columnSnapshot.key;
													var displayColumnName = "<p style='font-size:25px;text-align:center;'><u>" + columnName + "</u></p>";
													document.getElementById("nameOfColumn3").innerHTML = displayColumnName;
													if(columnSnapshot.hasChildren()){
														var taskDisplay = "<ul>";
														columnSnapshot.forEach(function(taskSnapshot){
															taskDisplay += "<div class='box'><li><a href='' onclick='setTask(sessionStorage.getItem('boardName');, columnName, TaskSnapshot.child(NAME).val());'>TaskName: " + taskSnapshot.child(NAME).val();
															if(taskSnapshot.child(OWNERS).hasChildren()){
																var ownerStart = "<br>Owners:";
																var ownerName = " ";
																taskSnapshot.child(OWNERS).forEach(function(ownerSnapshot){
																	if(ownerSnapshot.val()){
																		ownerName += ownerSnapshot.key + " ";
																	}
																});
																if(!ownerName.replace(/\s/g, '').length){
																	ownerStart = "";
																}
																taskDisplay += ownerStart + ownerName + "<br>Users: " + getUsers + " " + getOtherUsers + "</a>"; 																
																taskDisplay += "<button class='taskAddUsers' onclick='location.href=''; addUserToTask('mellita');'>Add an owner</button>";
																taskDisplay += "<button class='taskRemoveUsers' onclick='location.href=''; removeUserFromTask('mellita');'>Remove an owner</button>";
																taskDisplay += "</li></div><br>";
															}
															else{
																taskDisplay += "<br>Users: " + getUsers + " " + getOtherUsers + "</a>";
																taskDisplay += "<button class='taskAddUsers' onclick='location.href=''; addUserToTask('mellita');'>Add an owner</button>";
																taskDisplay += "<button class='taskRemoveUsers' onclick='location.href=''; removeUserFromTask('mellita');'>Remove an owner</button>";
																taskDisplay += "</li></div><br>";

															}
														});
														taskDisplay += "</ul>";
														document.getElementById("namesOfDone").innerHTML = taskDisplay;
													}
												}

											});

										}


									}
								}
							} 
						}); 

					}
				}); 
			}
		}
	});
}



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
