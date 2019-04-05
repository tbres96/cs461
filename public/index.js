//-------------------------------------------------------------------------------------
function redirect() {
     window.location.assign("https://seniorsemgit.firebaseapp.com/kanban.html")
}

function saveUser() {
	//firebase.database().ref("Users/").push({
	//Get Elements
	//Username: document.getElementById('txtUsername').value,
	var dbRef = firebase.database();
	var usersRef = dbRef.child("Users/");
	usersRef.child(document.getElementById('txtUsername').value).set({
		Username: document.getElementById('txtUsername').value
}, onComplete)
};


;
