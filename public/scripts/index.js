//-------------------------------------------------------------------------------------
function redirect(extension){
	window.location.replace("https://seniorsemgit.firebaseapp.com/" + extension);
}

function saveUser() {
	//firebase.database().ref("Users/").push({
	//Get Elements
	//Username: document.getElementById('txtUsername').value,
	sessionStorage.setItem('User', document.getElementById('txtUsername').value); //Bring user name into Kanban page
		var dbRef = firebase.database().ref("Users/");
		var usersRef = dbRef.child(document.getElementById('txtUsername').value).set({
			Board: ("Board00")
		})
	setTimeout(function(){redirect("kanban.html");}, 1000)
	}

function setTask(board, column, task){
	sessionStorage.setItem('board',board);
	sessionStorage.setItem('column',column);
	sessionStorage.setItem('task',task);
	redirect("task.html");
}
