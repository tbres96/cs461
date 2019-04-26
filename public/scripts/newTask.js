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

function addNewTask(f){
	console.log(f.id);
	var name = f.taskName.value;
	var desc = f.description.value;
	var dueDate = f.dueDate.value;
	var col = f.col.value;
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
			ref.child(name).update({[DUEDATE]: dueDate});
		}
	}
	redirect("kanban.html");
}
