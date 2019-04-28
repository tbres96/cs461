var db = firebase.database();

function redirect(extension){
	window.location.replace("https://seniorsemgit.firebaseapp.com/" + extension);
}

function validate(){
	if(document.getElementById("txtBoardName") != null && document.getElementById("txtBoardName") != ""){
		addNewBoard();
	}
}

function addNewBoard(){
	var boardName = document.getElementById("txtBoardName").value;
	var board = {
		Tasks:{
			Name: boardName,
			Todo:{Dummy: "DumDum"},
			Doing:{Dummy: "DumDum"},
			Done:{Dummy: "DumDum"}
		}
		Users:{
			[sessionStorage.getItem('User')]:true
		}
	};
	var ref = db.ref(BOARDS);
	ref = ref.push();
	ref.set(board);
	redirect("kanban.html");
}
