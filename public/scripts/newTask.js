var db = firebase.database();
var BOARDS = 'Boards';
var TASKS = "Tasks";
var NAME = "Name";
var OWNERS = "Owners";
var DESCRIPTION = "Description";
var LASTACTION = "LatestAction";
var DUEDATE = "DueDate";

function redirect(extension){
	window.location.replace("https://seniorsemgit.firebaseapp.com/" + extension);
}

function getCols(){
	var ref = db.ref(BOARDS).child(sessionStorage.getItem('board')).child(TASKS);
	ref.once('value',function(snap){
		snap.forEach(function(subSnap){
			document.getElementById("col").innerHTML += "<option value='" + subSnap.key + "'>" + subSnap.key + "</option>";
		});
	});
}

function addNewTask(){
	console.log(document.forms[0].id);
	var name = document.forms[0].taskName.value;
	var desc = document.forms[0].description.value;
	var dueDate = document.forms[0].dueDate.value;
	var col = document.forms[0].col.value;
	var todaysDate = new Date(Date.now());
	var now = (todaysDate.getMonth() + 1) + "-" + todaysDate.getDate() + "-" + todaysDate.getFullYear() + ", ";
	now += todaysDate.getHours() + ":" + todaysDate.getMinutes() + ":" + todaysDate.getSeconds();
	var msg = now + ", Task created";
	
	if(col){
		var ref = db.ref(BOARDS).child(sessionStorage.getItem('board')).child(TASKS).child(col);
		now = "(0) " + now;
		var task = {
			[NAME]: name,
			[DESCRIPTION]: desc,
			[OWNERS]:{[sessionStorage.getItem('User')]:true},
			[LASTACTION]: msg,
			ActionHistory: {[now]:"Task created"}
		};
	ref = ref.push();
	ref.set(task);
		if(dueDate != null && dueDate != ""){
			ref.update({[DUEDATE]: dueDate});
		}
	}
	redirect("kanban.html");
}
