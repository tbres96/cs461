//-------------------------------------------------------------------------------------
function redirect() {
	window.location.replace("https://seniorsemgit.firebaseapp.com/kanban.html")
}

function saveUser() {
	//firebase.database().ref("Users/").push({
	//Get Elements
	//Username: document.getElementById('txtUsername').value,
	sessionStorage.setItem('User', document.getElementById('txtUsername').value; //Bring user name into Kanban page
		var dbRef = firebase.database().ref("Users/");
		var usersRef = dbRef.child(document.getElementById('txtUsername').value).set({
			Username: document.getElementById('txtUsername').value
		})
		setTimeout(redirect, 1000)
	}
