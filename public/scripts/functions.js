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
	sessionStorage.setItem('board',name);
}

function getListOfKanbans(){
	var getListToAddUsers = "<select id='displayAddUserList'>";
	getListToAddUsers += "<option value=''>-- Please select a user --</option>";
	var getListToRemoveUsers = "<select id='displayRemoveUserList'>";
	getListToRemoveUsers += "<option value=''>-- Please select a user --</option>";

	var obj = {};
	var firstArray = [];
	var getListToAddOwners = "<select id='displayAddOwnerList'>";
	getListToAddOwners += "<option value=''>--Owner--</option>";

	var i = 0;
	var userRef = db.ref().child(USERS);
	userRef.on('value', function(snapshot){
		if(snapshot.exists()){
			if(snapshot.hasChildren()){
				//add every user thats ever logged in using the sign-in page
				snapshot.forEach(function(childSnapshot){
					obj['key'+i] = childSnapshot.key;
					firstArray[i] = childSnapshot.key;
					getListToAddUsers += "<option value='" + childSnapshot.key + "'>" + childSnapshot.key + "</option>";
					i++;
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
								//obj['key'+i] = userSnapshot.key;
								//firstArray[i] = userSnapshot.key;
								//i++;
								getListToAddUsers += "<option value='" + userSnapshot.key + "'>" + userSnapshot.key + "</option>";
							}
							obj['key'+i] = userSnapshot.key;
							firstArray[i] = userSnapshot.key;
							i++;

						});
					}
				});
				getListToAddUsers += "</select>";
				document.getElementById("listOfUsers").innerHTML = getListToAddUsers;
				var list = document.getElementById("displayAddUserList");

				for(var key in obj){
					if (obj.hasOwnProperty(key)) {
						getListToAddOwners += "<option value'" + obj[key] + "'>" + obj[key] + "</option>";
					}
				}
				/*for(var i = 0; i < firstArray.length; i++){
					getListToAddOwners += "<option value'" + firstArray[i] + "'>" + firstArray[i] + "</option>";
				}*/

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
						var count1 = 0;
						childSnapshot.child(USERS).forEach(function(userSnapshot){
							count = 0;
							count1 = 0;
							if(userSnapshot.key != sessionStorage.getItem('User')){ //'mellita') <<-- used for testing locally
								//if their values are true
								if(userSnapshot.val()){
									getUsers += userSnapshot.key + " ";
									getListToRemoveUsersAA += "<option value='" + userSnapshot.key + "'>" + userSnapshot.key + "</option>";
								}

								for (var i = 0; i < document.getElementById("displayAddUserList").length; ++i){
									if(list.options[i].value == userSnapshot.key){
										count++;
										if(count >= 2){
											list.remove(i);
										}
									}
								}
							}
							/*for (var i = 0; i < firstArray.length; i++){
									if(firstArray[i] == userSnapshot.key){
										count1++;
										if(count1 == 2){
											firstArray.splice(firstArray[i], 1);
										}
									}
								}*/
							for(var key in obj){
								if (obj.hasOwnProperty(key)) {
									if(obj[key] == userSnapshot.key){
										count1++;
										if(count1 == 2){
											delete obj[key];
										}
									}
								}
							}

						});
						//var trueOwnerList = ownerList;
						childSnapshot.child(USERS).forEach(function(userSnapshot){
							if(userSnapshot.val()){
								//if values match current user logged in
								if(userSnapshot.key == sessionStorage.getItem('User')){ //'mellita') <<-- used for testing locally
									getUsers += userSnapshot.key + " ";
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
									//before moving forward make sure the tasks we are looking at are under the current board session storage
									if(sessionStorage.getItem('boardName') == boardName){
										//check if any task columns exist
										if(childSnapshot.child(TASKS).exists()){
											//look through every task column
											childSnapshot.child(TASKS).forEach(function(columnSnapshot){
												if(columnSnapshot.key == 'Todo'){
													checkIsOwner = false;
													if(getListRUsers == "")
													{
														getListRUsers += getListToRemoveUsersAA;
													}
													for (var i = 0; i < document.getElementById("displayAddUserList").length; ++i){
														if(list.options[i].value == userSnapshot.key){
															list.remove(i);
														}
													}
													//display column name
													var columnName = columnSnapshot.key;
													var displayColumnName = "<p style='font-size:25px;text-align:center;'><u>" + columnName + "</u></p>";
													document.getElementById("nameOfColumn1").innerHTML = displayColumnName; 
													//if column has task
													if(columnSnapshot.hasChildren()){
														//look through every task in this column and display their names
														var taskDisplay = "<ul>";
														columnSnapshot.forEach(function(taskSnapshot){
															//var object = {};
															//var array = [];
															var previous = "";
															var count = 0;
															var i = 0;
															//getListToAddOwners = "<select id=displayAddOwnerList>";
															//getListToAddOwners += "<option value=''>--Owners--</option>";
															var getListToRemoveOwners = "<select id=displayRemoveOwnerList>";
															getListToRemoveOwners += "<option value=''>--Owners--</option>";
															var taskName = taskSnapshot.key;
															if(taskName.includes("Task") || taskName.includes("tasK")){
																sessionStorage.setItem('column', columnName);
																sessionStorage.setItem('task', taskSnapshot.child(NAME).val());
																taskDisplay += "<div class='box'><li>";
																taskDisplay += "<a href=\"javascript:setTask('" + boardName + "','" + columnName + "','" + taskName + "');\">TaskName: ";
																taskDisplay += taskSnapshot.child(NAME).val();
																//if owners has existing users
																if(taskSnapshot.child(OWNERS).hasChildren()){
																	var ownerStart = "<br>Owners:";
																	var ownerName = " ";	
																	//Look at every user who owns task
																	taskSnapshot.child(OWNERS).forEach(function(ownerSnapshot){
																		if(ownerSnapshot.val()){
																			if(ownerSnapshot.key == sessionStorage.getItem('User')){
																				checkIsOwner = true;
																			}
																			ownerName += ownerSnapshot.key + " ";
																			getListToRemoveOwners += "<option value='" + ownerSnapshot.key + "'>" + ownerSnapshot.key + "</option>";
																			//object[key] = ownerSnapshot.key;
																			//array[i] = ownerSnapshot.key;
																			i++;
																		}
																	});
																	/*for (var i=0; i < array.length; i++){ 
																		if (obj.hasOwnProperty(array[i])){
																			delete obj[key];
																		}

																	}*/
																	//for (var key in obj){
																	//getListToAddOwners += "<option value='" + obj[key] + "'>" + obj[key] + "</option>";
																	//}
																	/*for(var key1 in obj){
																		for(var key in object){
																			if(object.hasOwnProperty(key)){
																				if(object[key] == obj[key1]){
																					getListToAddOwners += "option value='" + obj[key] + "'>" + obj[key] + "</option>";
															//delete obj[key1];
															//break;
																				}
																				else{
																				}
																			}
																		}
																	}*/

															/*for(var key in obj){
																		if(object.hasOwnProperty(key)){


																		}
																	}*/
															//if every user on board is not an owner of said task
															if(!ownerName.replace(/\s/g, '').length){
																ownerStart = "";
															}
																	taskDisplay += ownerStart + ownerName + "<br>Users: " + getUsers + "</a>";
																	if(checkIsOwner){
																		taskDisplay += "<button class='taskAddUsers' onclick=\"javascript:addUserToTask('fleetisa');\">Add an owner</button>";
																		taskDisplay += "<button class='taskRemoveUsers' onclick=\"javascript:removeUserFromTask('mellita');\">Remove an owner</button>";
																		taskDisplay += getListToAddOwners + "</select>";
																		taskDisplay += getListToRemoveOwners + "</select><br>";
																	}
																	taskDisplay += "</li></div><br>";
																}
																else{
																	taskDisplay += "<br>Users: " + getUsers + "</a>";
																	taskDisplay += "</li></div><br>";
																}
															}
														});
														taskDisplay += "</ul>";
														document.getElementById("namesOfTodo").innerHTML = taskDisplay;
													}
												}
												//repeat steps above for columns Doing and Done
												if(columnSnapshot.key == 'Doing'){
													checkIsOwner = false;
													if(getListRUsers == ""){
														getListRUsers += getListToRemoveUsersAA;
													}
													for (var i = 0; i < document.getElementById("displayAddUserList").length; ++i){
														if(list.options[i].value == userSnapshot.key){
															list.remove(i);
														}
													}
													var columnName = columnSnapshot.key;
													var displayColumnName = "<p style='font-size:25px;text-align:center;'><u>" + columnName + "</u></p>";
													document.getElementById("nameOfColumn2").innerHTML = displayColumnName;
													if(columnSnapshot.hasChildren()){
														var taskDisplay = "<ul>";
														columnSnapshot.forEach(function(taskSnapshot){
															getListToAddOwners = "<select id=displayAddOwnerList>";
															getListToAddOwners += "<option value=''>--Owners--</option>";
															var getListToRemoveOwners = "<select id=displayRemoveOwnerList>";
															getListToRemoveOwners += "<option value''>--Owners--</option>";
															var taskName = taskSnapshot.key;
															if(taskName.includes("Task") || taskName.includes("task")){
																taskDisplay += "<div class='box'><li>";
																taskDisplay += "<a href=\"javascript:setTask('" + boardName + "','" + columnName + "','" + taskName + "');\">TaskName: ";
																taskDisplay += taskSnapshot.child(NAME).val();
																if(taskSnapshot.child(OWNERS).hasChildren()){
																	var ownerStart = "<br>Owners:";
																	var ownerName = " ";
																	taskSnapshot.child(OWNERS).forEach(function(ownerSnapshot){
																		if(ownerSnapshot.val()){
																			if(ownerSnapshot.key == sessionStorage.getItem('User')){
																				checkIsOwner = true;
																			}
																			ownerName += ownerSnapshot.key + " ";
																			getListToRemoveOwners += "<option value='" + ownerSnapshot.key + "'>" + ownerSnapshot.key + "</option>";
																			for(var key in obj){
																				if (obj.hasOwnProperty(key)) {
																					if(obj[key] != ownerSnapshot.key){
																						//ERROR-CHECK: if adding in values from the list of objects, the drop down list is listed upwards??
																						getListToAddOwners += "<option value'" + obj[key] + "'>" + obj[key] + "</option>";
																					}
																				}
																			}

																		}
																	});
																	if(!ownerName.replace(/\s/g, '').length){
																		ownerStart = "";
																	}
																	taskDisplay += ownerStart + ownerName + "<br>Users: " + getUsers + "</a>";
																	if(checkIsOwner){
																		taskDisplay += "<button class='taskAddUsers' onclick=\"javascript:addUserToTask('fleetisa');\">Add an owner</button>";
																		taskDisplay += "<button class='taskRemoveUsers' onclick=\"javascript:removeUserFromTask('mellita');\">Remove an owner</button>";
																		taskDisplay += getListToAddOwners + "</select>";
																		taskDisplay += getListToRemoveOwners + "</select><br>";
																	}
																	taskDisplay += "</li></div><br>";
																}
																else{
																	taskDisplay += "<br>Users: " + getUsers + "</a>";
																	taskDisplay += "</li></div><br>";
																}
															}
														});
														taskDisplay += "</ul>";
														document.getElementById("namesOfDoing").innerHTML = taskDisplay;
													}
												}
												if(columnSnapshot.key == 'Done'){
													checkIsOwner = false;
													if(getListRUsers == ""){
														getListRUsers += getListToRemoveUsersAA;
													}
													for (var i = 0; i < document.getElementById("displayAddUserList").length; ++i){
														if(list.options[i].value == userSnapshot.key){
															list.remove(i);
														}
													}
													var columnName = columnSnapshot.key;
													var displayColumnName = "<p style='font-size:25px;text-align:center;'><u>" + columnName + "</u></p>";
													document.getElementById("nameOfColumn3").innerHTML = displayColumnName;
													if(columnSnapshot.hasChildren()){
														var taskDisplay = "<ul>";
														columnSnapshot.forEach(function(taskSnapshot){
															getListToAddOwners = "<select id=displayAddOwnerList>";
															getListToAddOwners += "<option value=''>--Owners--</option>";
															var getListToRemoveOwners = "<select id=displayRemoveOwnerList>";
															getListToRemoveOwners += "<option value''>--Owners--</option>";
															var taskName = taskSnapshot.key;
															if(taskName.includes("Task") || taskName.includes("task")){
																taskDisplay += "<div class='box'><li>";
																taskDisplay += "<a href=\"javascript:setTask('" + boardName + "','" + columnName + "','" + taskName + "');\">TaskName: ";
																taskDisplay += taskSnapshot.child(NAME).val();
																if(taskSnapshot.child(OWNERS).hasChildren()){
																	var ownerStart = "<br>Owners:";
																	var ownerName = " ";
																	taskSnapshot.child(OWNERS).forEach(function(ownerSnapshot){
																		if(ownerSnapshot.val()){
																			if(ownerSnapshot.key == sessionStorage.getItem('User')){
																				checkIsOwner = true;
																			}
																			ownerName += ownerSnapshot.key + " ";
																			getListToRemoveOwners += "<option value='" + ownerSnapshot.key + "'>" + ownerSnapshot.key + "</option>";
																			for(var key in obj){
																				if (obj.hasOwnProperty(key)) {
																					if(obj[key] != ownerSnapshot.key){
																						//ERROR-CHECK: if adding in values from the list of objects, the drop down list is listed upwards??
																						getListToAddOwners += "<option value'" + obj[key] + "'>" + obj[key] + "</option>";
																					}
																				}
																			}
																		}
																	});
																	if(!ownerName.replace(/\s/g, '').length){
																		ownerStart = "";
																	}
																	taskDisplay += ownerStart + ownerName + "<br>Users: " + getUsers + "</a>";
																	if(checkIsOwner = true){
																		taskDisplay += "<button class='taskAddUsers' onclick=\"javascript:addUserToTask('fleetisa');\">Add an owner</button>";
																		taskDisplay += "<button class='taskRemoveUsers' onclick=\"javascript:removeUserFromTask('mellita');\">Remove an owner</button>";
																		taskDisplay += getListToAddOwners + "</select>";
																		taskDisplay += getListToRemoveOwners + "</select><br>";
																	}
																	taskDisplay += "</li></div><br>";
																}
																else{
																	taskDisplay += "<br>Users: " + getUsers + "</a>";
																	taskDisplay += "</li></div><br>";

																}
															}
														});
														taskDisplay += "</ul>";
														document.getElementById("namesOfDone").innerHTML = taskDisplay;
													}
												}

											});
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
												if(columnSnapshot.key == 'Todo'){
													for (var i = 0; i < document.getElementById("displayAddUserList").length; ++i){
														if(list.options[i].value == userSnapshot.key){
															list.remove(i);
														}
													}
												}
												if(columnSnapshot.key == 'Doing'){
													for (var i = 0; i < document.getElementById("displayAddUserList").length; ++i){
														if(list.options[i].value == userSnapshot.key){
															list.remove(i);
														}
													}
												}
												if(columnSnapshot.key == 'Done'){
													for (var i = 0; i < document.getElementById("displayAddUserList").length; ++i){
														if(list.options[i].value == userSnapshot.key){
															list.remove(i);
														}
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
