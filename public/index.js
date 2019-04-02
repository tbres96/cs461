//-------------------------------------------------------------------------------------
function saveUser() {
	firebase.database().ref("Users/").push({
	//Get Elements
		Username: document.getElementById('txtUsername').value,
		//Email:	document.getElementById('txtEmail').value,
		//Name:	document.getElementById('txtName').value
})
}


function redirect() {
     window.location.assign("https://seniorsemgit.firebaseapp.com/kanban.html")
};
