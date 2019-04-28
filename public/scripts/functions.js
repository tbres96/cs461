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
var ACTIONHISTORY = "ActionHistory";



function switchKanbanView(id, name){	
	sessionStorage.setItem('boardName',name);
	sessionStorage.setItem('boardID',id);
	sessionStorage.setItem('board',id);
}



function getListOfKanbans(){
	var getListToAddUsers = "<select id='displayAddUserList'>";
	getListToAddUsers += "<option value=''>-- Please select a user --</option>";
	var getListToRemoveUsers = "<select id='displayRemoveUserList'>";
	getListToRemoveUsers += "<option value=''>-- Please select a user --</option>";

	var obj = {};
	var str = "";
	var i = 0;
	var userRef = db.ref().child(USERS);
	userRef.on('value', function(snapshot){
		if(snapshot.exists()){
			if(snapshot.hasChildren()){
				//add every user thats ever logged in using the sign-in page
				snapshot.forEach(function(childSnapshot){
					if(!childSnapshot.child(sessionStorage.getItem('boardID')).exists() || !childSnapshot.child(sessionStorage.getItem('boardID')).val()){
						getListToAddUsers += "<option style='none' value='" + childSnapshot.key + "'>" + childSnapshot.key + "</option>";
					}
				});
			}
		}
	});


	var boardRef = db.ref().child(BOARDS);
	boardRef.on('value', function(snapshot){
		//if BOARDS exist
		if(snapshot.exists()){
			//if BOARDS has any boards
			if(snapshot.hasChildren()){
				//for every board that exist
				var kanbanList = "<hr class='hr1'>";
				snapshot.forEach(function(childSnapshot){
					//check if any users exist
					if(childSnapshot.child(USERS).exists()){
						//look through every non currently logged in user
						//store every username in each board to the list
						childSnapshot.child(USERS).forEach(function(userSnapshot){
							if(userSnapshot.key != sessionStorage.getItem('User')){
								//getListToAddUsers += "<option style='none' value='" + userSnapshot.key + "'>" + userSnapshot.key + "</option>";
							}
							if(!str.includes(userSnapshot.key)){
								str += userSnapshot.key + " ";
							}

						});
					}
				});
				getListToAddUsers += "</select>";
				document.getElementById("listOfUsers").innerHTML = getListToAddUsers;
				var list = document.getElementById("displayAddUserList");

				snapshot.forEach(function(childSnapshot){
					//set the name and ID of the board to a variable
					var boardName = childSnapshot.child(NAME).val();
					var boardID = childSnapshot.key;
					//check if any users exist
					if(childSnapshot.child(USERS).exists()){
						//look through every non currently logged in user
						var getUsers = "";
						var getListToRemoveUsersAA = "";
						var getListRUsers = "";
						var count = 0;
						childSnapshot.child(USERS).forEach(function(userSnapshot){
							count = 0;
							if(userSnapshot.key != sessionStorage.getItem('User')){ //'mellita') <<-- used for testing locally
								//if their values are true
								if(userSnapshot.val()){
									if(getUsers == ""){
										getUsers += userSnapshot.key;
									}
									else{
										getUsers += ", " + userSnapshot.key; 
									}
									getListToRemoveUsersAA += "<option value='" + userSnapshot.key + "'>" + userSnapshot.key + "</option>";
								}

								for (var i = 0; i < document.getElementById("displayAddUserList").length; ++i){
									if(list.options[i].value == userSnapshot.key){
										count++;
										if(count >= 2){
											//list[i].style.display = 'none';
											list.remove(i);
											i--;
											//list.options.remove(i);
											//list.removeChild(list.options[i])
											//list.options[i] = null;
											//break;
										}
									}
								}

							}
						});


						childSnapshot.child(USERS).forEach(function(userSnapshot){
							if(userSnapshot.val()){
								//if values match current user logged in
								if(userSnapshot.key == sessionStorage.getItem('User')){ //'mellita') <<-- used for testing locally
									if(getUsers == ""){
										getUsers += userSnapshot.key;
									}
									else{
										getUsers += ", "+ userSnapshot.key;
									}
									getListToRemoveUsersAA += "<option value='" + userSnapshot.key + "'>" + userSnapshot.key + "</option>";
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

									var checkIsOwner = false;
									var userDisplay = "";
									//before moving forward make sure the tasks we are looking at are under the current board session storage
									if(sessionStorage.getItem('boardName') == boardName){
										sessionStorage.setItem('board', boardID);
										userDisplay = "<h3>Users: " + getUsers + "</h3>";
										document.getElementById("usersOfBoard").innerHTML = userDisplay;
										//check if any task columns exist
										if(childSnapshot.child(TASKS).exists()){
											//look through every task column
											var divCol ="<div class='vl'></div>";
											var divNameOfCol = "";
											var getNewCols = "";
											var Doing = " ";
											var Done = " ";
											var Todo = " ";

											childSnapshot.child(TASKS).forEach(function(columnSnapshot){
												if(columnSnapshot.key == "Todo"){
													if(getListRUsers == ""){
														getListRUsers += getListToRemoveUsersAA;
													}
													for (var i = 0; i < document.getElementById("displayAddUserList").length; ++i){
														if(list.options[i].value == userSnapshot.key){
															list.remove(i);
															i--;
														}
													}
													//display column name
													var columnName = columnSnapshot.key;
													divCol = "<div id='" + columnName + "' style='margin: right; padding: 0.60%; flex: 0 0 32%; height: 1em'>";
													var displayColumnName = "<div id=nameOf" + columnName + "><p style='font-size:25px;text-align:center;'><u>" + columnName + "</u></p></div>";
													divNameOfCol = displayColumnName;
													//if column has task
													if(columnSnapshot.hasChildren()){
														//look through every task in this column and display their names
														var taskDisplay = "<ul>";
														taskDisplay += `<div id=tasksOf'` + columnName + `' style='min-height: 600px' ondrop="drop(event, this, this.parentElement.parentElement.id);" ondragover="allowDrop(event)">`;
														columnSnapshot.forEach(function(taskSnapshot){
															if(taskSnapshot.key != "Dummy" && taskSnapshot.child("Dummy") != "DumDum"){
																var taskName = taskSnapshot.key;
																taskDisplay += `<div id='` + taskName + `' draggable="true" ondragstart="drag(event, this.parentElement.parentElement.parentElement.id, this.id)" class='box'><li>`;

																taskDisplay += "<a href=\"javascript:setTask('" + boardName + "','" + columnName + "','" + taskName + "');\">TaskName: ";
																taskDisplay += taskSnapshot.child(NAME).val();
																//if owners has existing users
																if(taskSnapshot.child(OWNERS).hasChildren()){
																	var ownerStart = "<br>Owners:";
																	var ownerName = "";	
																	//Look at every user who owns task
																	taskSnapshot.child(OWNERS).forEach(function(ownerSnapshot){
																		if(ownerSnapshot.val()){
																			if (ownerName == ""){
																				ownerName += " " + ownerSnapshot.key;
																			}
																			else{
																				ownerName += ", " + ownerSnapshot.key;
																			}
																		}
																	});

																	//if every user on board is not an owner of said task
																	if(!ownerName.replace(/\s/g, '').length){
																		ownerStart = "";
																	}
																	taskDisplay += ownerStart + ownerName + "</a>";
																}
																taskDisplay += "</li></div><br>";
															}
														});
														taskDisplay += "</ul>";
														taskDisplay += "</div><div class='vl'></div>";
														Todo = divCol + divNameOfCol + taskDisplay;
													}
												}

												if(columnSnapshot.key == "Doing"){
													if(getListRUsers == ""){
														getListRUsers += getListToRemoveUsersAA;
													}
													for (var i = 0; i < document.getElementById("displayAddUserList").length; ++i){
														if(list.options[i].value == userSnapshot.key){
															list.remove(i);
															i--;
														}
													}
													//display column name
													var columnName = columnSnapshot.key;
													divCol = "<div id='" + columnName + "' style='margin: right; padding: 0.60%; flex: 0 0 32%; height: 1em'>";
													var displayColumnName = "<div id=nameOf" + columnName + "><p style='font-size:25px;text-align:center;'><u>" + columnName + "</u></p></div>";
													divNameOfCol = displayColumnName;
													//if column has task
													if(columnSnapshot.hasChildren()){
														//look through every task in this column and display their names
														var taskDisplay = "<ul>";
														taskDisplay += `<div id=tasksOf'` + columnName + `' style='min-height: 600px' ondrop="drop(event, this, this.parentElement.parentElement.id);" ondragover="allowDrop(event)">`;
														columnSnapshot.forEach(function(taskSnapshot){
															if(taskSnapshot.key != "Dummy" && taskSnapshot.child("Dummy") != "DumDum"){
																var taskName = taskSnapshot.key;
																taskDisplay += `<div id='` + taskName + `' draggable="true" ondragstart="drag(event, this.parentElement.parentElement.parentElement.id, this.id)" class='box'><li>`;

																taskDisplay += "<a href=\"javascript:setTask('" + boardName + "','" + columnName + "','" + taskName + "');\">TaskName: ";
																taskDisplay += taskSnapshot.child(NAME).val();
																//if owners has existing users
																if(taskSnapshot.child(OWNERS).hasChildren()){
																	var ownerStart = "<br>Owners:";
																	var ownerName = "";	
																	//Look at every user who owns task
																	taskSnapshot.child(OWNERS).forEach(function(ownerSnapshot){
																		if(ownerSnapshot.val()){
																			if (ownerName == ""){
																				ownerName += " " + ownerSnapshot.key;
																			}
																			else{
																				ownerName += ", " + ownerSnapshot.key;
																			}
																		}
																	});

																	//if every user on board is not an owner of said task
																	if(!ownerName.replace(/\s/g, '').length){
																		ownerStart = "";
																	}
																	taskDisplay += ownerStart + ownerName + "</a>";
																}
																taskDisplay += "</li></div><br>";
															}
														});
														taskDisplay += "</ul>";
														taskDisplay += "</div><div class='vl'></div>";
														Doing = divCol + divNameOfCol + taskDisplay;
													}
												}

												if(columnSnapshot.key == "Done"){
													if(getListRUsers == ""){
														getListRUsers += getListToRemoveUsersAA;
													}
													for (var i = 0; i < document.getElementById("displayAddUserList").length; ++i){
														if(list.options[i].value == userSnapshot.key){
															list.remove(i);
															i--;
														}
													}
													//display column name
													var columnName = columnSnapshot.key;
													divCol = "<div id='" + columnName + "' style='margin: right; padding: 0.60%; flex: 0 0 32%; height: 1em'>";
													var displayColumnName = "<div id=nameOf" + columnName + "><p style='font-size:25px;text-align:center;'><u>" + columnName + "</u></p></div>";
													divNameOfCol = displayColumnName;
													//if column has task
													if(columnSnapshot.hasChildren()){
														//look through every task in this column and display their names
														var taskDisplay = "<ul>";
														taskDisplay += `<div id=tasksOf'` + columnName + `' style='min-height: 600px' ondrop="drop(event, this, this.parentElement.parentElement.id);" ondragover="allowDrop(event)">`;
														columnSnapshot.forEach(function(taskSnapshot){
															if(taskSnapshot.key != "Dummy" && taskSnapshot.child("Dummy") != "DumDum"){
																var taskName = taskSnapshot.key;
																taskDisplay += `<div id='` + taskName + `' draggable="true" ondragstart="drag(event, this.parentElement.parentElement.parentElement.id, this.id)" class='box'><li>`;

																taskDisplay += "<a href=\"javascript:setTask('" + boardName + "','" + columnName + "','" + taskName + "');\">TaskName: ";
																taskDisplay += taskSnapshot.child(NAME).val();
																//if owners has existing users
																if(taskSnapshot.child(OWNERS).hasChildren()){
																	var ownerStart = "<br>Owners:";
																	var ownerName = "";	
																	//Look at every user who owns task
																	taskSnapshot.child(OWNERS).forEach(function(ownerSnapshot){
																		if(ownerSnapshot.val()){
																			if (ownerName == ""){
																				ownerName += " " + ownerSnapshot.key;
																			}
																			else{
																				ownerName += ", " + ownerSnapshot.key;
																			}
																		}
																	});

																	//if every user on board is not an owner of said task
																	if(!ownerName.replace(/\s/g, '').length){
																		ownerStart = "";
																	}
																	taskDisplay += ownerStart + ownerName + "</a>";
																}
																taskDisplay += "</li></div><br>";
															}
														});
														taskDisplay += "</ul>";
														taskDisplay += "</div><div class='vl'></div>";
														Done = divCol + divNameOfCol + taskDisplay;
													}
												}


												else if((columnSnapshot.key != "Todo") && (columnSnapshot.key != "Doing") && (columnSnapshot.key != "Done")){
													if(getListRUsers == ""){
														getListRUsers += getListToRemoveUsersAA;
													}
													for (var i = 0; i < document.getElementById("displayAddUserList").length; ++i){
														if(list.options[i].value == userSnapshot.key){
															list.remove(i);
															i--;
														}
													}
													//display column name
													var columnName = columnSnapshot.key;
													divCol = "<div id='" + columnName + "' style='margin: right; padding: 0.60%; flex: 0 0 32%; height: 1em'>";
													var displayColumnName = "<div id=nameOf" + columnName + "><p style='font-size:25px;text-align:center;'><u>" + columnName + "</u></p></div>";
													divNameOfCol = displayColumnName;
													//if column has task
													if(columnSnapshot.hasChildren()){
														//look through every task in this column and display their names
														var taskDisplay = "<ul>";
														taskDisplay += `<div id=tasksOf'` + columnName + `' style='min-height: 600px' ondrop="drop(event, this, this.parentElement.parentElement.id);" ondragover="allowDrop(event)">`;
														columnSnapshot.forEach(function(taskSnapshot){
															if(taskSnapshot.key != "Dummy" && taskSnapshot.child("Dummy") != "DumDum"){
																var taskName = taskSnapshot.key;
																taskDisplay += `<div id='` + taskName + `' draggable="true" ondragstart="drag(event, this.parentElement.parentElement.parentElement.id, this.id)" class='box'><li>`;

																taskDisplay += "<a href=\"javascript:setTask('" + boardName + "','" + columnName + "','" + taskName + "');\">TaskName: ";
																taskDisplay += taskSnapshot.child(NAME).val();
																//if owners has existing users
																if(taskSnapshot.child(OWNERS).hasChildren()){
																	var ownerStart = "<br>Owners:";
																	var ownerName = "";	
																	//Look at every user who owns task
																	taskSnapshot.child(OWNERS).forEach(function(ownerSnapshot){
																		if(ownerSnapshot.val()){
																			if (ownerName == ""){
																				ownerName += " " + ownerSnapshot.key;
																			}
																			else{
																				ownerName += ", " + ownerSnapshot.key;
																			}
																		}
																	});

																	//if every user on board is not an owner of said task
																	if(!ownerName.replace(/\s/g, '').length){
																		ownerStart = "";
																	}
																	taskDisplay += ownerStart + ownerName + "</a>";
																}
																taskDisplay += "</li></div><br>";
															}
														});
														taskDisplay += "</ul>";
														taskDisplay += "</div><div class='vl'></div>";
														getNewCols += divCol + divNameOfCol + taskDisplay;
													}
												}
											});
											document.getElementById("wrapper").innerHTML = Todo + Doing + Done + getNewCols;
											getListToRemoveUsers += getListRUsers;

										}
									}
								}
								else{
									//before moving forward make sure the tasks we are looking at are under the current board session storage
									if(sessionStorage.getItem('boardName') == boardName){
										//check if any task columns exist
										if(childSnapshot.child(TASKS).exists()){
											//look through every task column
											childSnapshot.child(TASKS).forEach(function(columnSnapshot){
												//remove users from list that are already in users on tasks
												for (var i = 0; i < document.getElementById("displayAddUserList").length; ++i){
													if(list.options[i].value == userSnapshot.key){
														list.remove(i);
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
			getListToRemoveUsers += "</select>";
			document.getElementById("listOfUsers").innerHTML += getListToRemoveUsers;
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
			
			
			//date of last action
			if(snapshot.child(LASTACTION).exists()){
				document.getElementById("lastAction").innerHTML = "<h3>Last Update: " + snapshot.child(LASTACTION).val() + "</h3>";
				document.getElementById("lastAction").style.display = "inline";
			}
			
			//action history
			if(snapshot.child(ACTIONHISTORY).exists()){
				var comMsg = "<p><strong>Action History: </strong>";
				if(snapshot.child(ACTIONHISTORY).hasChildren()){
					comMsg += "<ul>";
					snapshot.child(ACTIONHISTORY).forEach(function(childSnapshot){
						comMsg += "<li>" + childSnapshot.key;
							comMsg += "<ul>";
								comMsg += "<li>" + childSnapshot.val() + "</li>";
							comMsg += "</ul>";
						comMsg += "</li>";
					});
					comMsg += "</ul>";
				}else{
					comMsg += "None";
				}
				comMsg += "</p>";
				document.getElementById("actionhistory").innerHTML = comMsg;
				document.getElementById("actionhistory").style.display = "inline";
			}
			
			//due date
			if(snapshot.child(DUEDATE).exists()){
				document.getElementById("dueDate").innerHTML = "<h2>Date Due: " + snapshot.child(DUEDATE).val() + "</h2>";
				document.getElementById("dueDate").style.display = "inline";
			}
			
			//commits
			if(snapshot.child(COMMITS).exists()){
				var comMsg = "<p><strong>Commits: </strong>";
				if(snapshot.child(COMMITS).hasChildren()){
					comMsg += "<ul>";
					snapshot.child(COMMITS).forEach(function(childSnapshot){
						comMsg += "<li>" + childSnapshot.key;
						if(childSnapshot.child("Date").exists() || childSnapshot.child("User").exists() || childSnapshot.child("Action").exists()){
							comMsg += "<ul>";
							if(childSnapshot.child("Date").exists()){
								comMsg += "<li>" + childSnapshot.child("Date").val() + "</li>";
							}
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
	sessionStorage.setItem('task',"Task2");
	sessionStorage.setItem('column',"Todo");
	//END LOCAL DEV SECTION
	*/
	var board = sessionStorage.getItem('board');
	var column = sessionStorage.getItem('column');
	var task = sessionStorage.getItem('task');
	var owners = new Set;
	
	var ref = db.ref(BOARDS).child(board);
	ref.on('value',function(snap){
		snap.child(TASKS).child(column).child(task).child(OWNERS).forEach(function(subSnap){
			if(subSnap.val()){
				owners.add(subSnap.key);
				document.getElementById("remOwners").innerHTML += "<option value='" + subSnap.key + "'>" + subSnap.key + "</option>";
			}
		});
		snap.child(USERS).forEach(function(subSnap){
			if(subSnap.val() && !owners.has(subSnap.key))
				document.getElementById("addOwners").innerHTML += "<option value='" + subSnap.key + "'>" + subSnap.key + "</option>";
		});
	});

    getTaskInfo(board,column,task);
}

function addUserToBoard(user){
	var userRef = db.ref(USERS);
	userRef.once('value',function(snap){
		if(snap.child(user).exists()){
			if(snap.child(user).child('Board').exists() && snap.child(user).child("Board").val() == "Board00"){
				userRef.child(user).child("Board").remove();
			}
			var dbRef = db.ref(BOARDS).child(sessionStorage.getItem('board')).child(USERS);
			dbRef.update({
				[user]: true
			});
			userRef.child(user).update({
				[sessionStorage.getItem('board')]: true
			});
		}else{
			alert(user + " doesn't exist in the database!");
		}
	});
}

function removeUserFromBoard(user){
	var userRef = db.ref(USERS);
	userRef.once('value',function(snap){
		if(snap.child(user).exists()){
			var dbRef = db.ref(BOARDS).child(sessionStorage.getItem('board')).child(USERS);
			dbRef.update({
				[user]: false
			});
			userRef.child(user).update({
				[sessionStorage.getItem('board')]: false
			});
		}else{
			alert(user + " doesn't exist in the database!");
		}
	});
}

function addUserToTask(user){
	var userRef = db.ref(USERS);
	userRef.once('value',function(snap){
		if(snap.child(user).exists()){
			var dbRef = db.ref(BOARDS).child(sessionStorage.getItem('board')).child(TASKS).child(sessionStorage.getItem('column')).child(sessionStorage.getItem('task'));
			dbRef.once('value',function(subSnap){
				if(subSnap.exists()){
					dbRef.child(OWNERS).update({
						[user]: true
					});
					userRef.child(user).update({
						[sessionStorage.getItem('board')]: true
					});
				}else{
					alert("The task called '" + sessionStorage.getItem('task') + "' from the column '" + sessionStorage.getItem('column') + "' of the board '" + sessionStorage.getItem('board') + "' does not exist. Unable to proceed.");
				}
			});
		}else{
			alert(user + " doesn't exist in the database!");
		}
	});
}

function removeUserFromTask(user){
	var userRef = db.ref(USERS);
	userRef.once('value',function(snap){
		if(snap.child(user).exists()){
			var dbRef = db.ref(BOARDS).child(sessionStorage.getItem('board')).child(TASKS).child(sessionStorage.getItem('column')).child(sessionStorage.getItem('task'));
			dbRef.once('value',function(subSnap){
				if(subSnap.exists()){
					dbRef.child(OWNERS).update({
						[user]: false
					});
					userRef.child(user).update({
						[sessionStorage.getItem('board')]: false
					});
				}else{
					alert("The task called '" + sessionStorage.getItem('task') + "' from the column '" + sessionStorage.getItem('column') + "' of the board '" + sessionStorage.getItem('board') + "' does not exist. Unable to proceed.");
				}
			});
		}else{
			alert(user + " doesn't exist in the database!");
		}
	});
}
