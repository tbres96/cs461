//-------------------------------------------------------------------------------------
function redirect(extension){
	window.location.replace("https://seniorsemgit.firebaseapp.com/" + extension);
}

function saveUser() {
	var val = document.getElementById('txtUsername').value.toLowerCase();
	if(val == "null" || val == null){
		alert("User cannot be 'null'");
	}else{
		sessionStorage.setItem('User', document.getElementById('txtUsername').value); //Bring user name into Kanban page
		var dbRef = firebase.database().ref("Users/").child(document.getElementById('txtUsername').value);
		dbRef.once('value',function(snap){
			if(!snap.hasChildren()){
				dbRef.set({
					Board: ("Board00")
				});
			}
		});
		setTimeout(function(){redirect("kanban.html");}, 1000)
	}
}

function setTask(board, column, task){
	board = board.replace('javascript:','');
	column = column.replace('javascript:','');
	task = task.replace('javascript:','');
	sessionStorage.setItem('board',board);
	sessionStorage.setItem('column',column);
	sessionStorage.setItem('task',task);
	redirect("task.html");
}
