//-------------------------------------------------------------------------------------
function saveUser() {
	firebase.database().ref("Users/").update({
	//Get Elements
		username: document.getElementById('txtUsername').value,
		email:	document.getElementById('txtEmail').value,
		name:	document.getElementById('txtName').value
})
};
