var db = firebase.database();
var BOARDS = 'Boards';
var TASKS = "Tasks";

function redirect(extension){
	window.location.replace("https://seniorsemgit.firebaseapp.com/" + extension);
}

function addNewCol(f){
	var colName = f.col.value;
	var ref = db.ref(BOARDS).child(sessionStorage.getItem('board')).child(TASKS);
	if(!ref.child(colName).exists()){
		ref.child(colName).update({Dummy: "DumDum"});
	}
	redirect("kanban.html");
}