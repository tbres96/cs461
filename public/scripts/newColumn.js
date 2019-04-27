var db = firebase.database();
var BOARDS = 'Boards';
var TASKS = "Tasks";

function redirect(extension){
	window.location.replace("https://seniorsemgit.firebaseapp.com/" + extension);
}

function addNewCol(){
	var colName = document.forms[0].col.value;
			console.log(colName);
	var ref = db.ref(BOARDS).child(sessionStorage.getItem('board')).child(TASKS);
	ref.on('value', function(snap){
		if(!snap.child(colName).exists()){
			ref.child(colName).update({Dummy: "DumDum"});
			console.log(colName);
		}
	});
	setTimeout(function(){redirect("kanban.html");}, 1000);
}
