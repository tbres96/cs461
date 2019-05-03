var db = firebase.database();
var BOARDS = 'Boards';
var TASKS = "Tasks";

function redirect(extension){
	window.location.replace("https://seniorsemgit.firebaseapp.com/" + extension);
}

function addNewCol(){
	var colName = document.forms[0].col.value;
	if(!colName.includes("javascript:") && colName != null && colName != ""){
		var ref = db.ref(BOARDS).child(sessionStorage.getItem('board')).child(TASKS);
		ref.on('value', function(snap){
			if(!snap.child(colName).exists()){
				ref.child(colName).update({Dummy: "DumDum"});
			}
		});
		setTimeout(function(){redirect("kanban.html");}, 1000);
	}else{
		if(colName.includes("javascript:")){
			alert("Column name cannot be javascript!");
		}else{
			alert("Column name cannot be empty!");
		}
	}
}
