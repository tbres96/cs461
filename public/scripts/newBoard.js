var db = firebase.database();
var BOARDS = "Boards";

function redirect(extension){
	window.location.replace("https://seniorsemgit.firebaseapp.com/" + extension);
}

function validate(){
	if(document.getElementById("txtBoardName").value != null && document.getElementById("txtBoardName").value != ""){
		var ref = db.ref(BOARDS);
		var bool = false;
		ref.once('value', function(snapshot){
			snapshot.forEach(function(snap){
				if(snap.child("Name").val() == document.getElementById("txtBoardName").value){
					bool = true;
				}
			});
		});
		if(!bool){
			addNewBoard();
		}else{
			alert("Board with name '" + document.getElementById("txtBoardName").value + "' already exists. Unable to proceed.");
		}
	}else{
		alert("Cannot continue with an empty board name.");
	}
}

function addNewBoard(){
	var boardName = document.getElementById("txtBoardName").value;
	var board = {
		Name: boardName,
		Tasks:{
			Todo:{Dummy: "DumDum"},
			Doing:{Dummy: "DumDum"},
			Done:{Dummy: "DumDum"}
		},
		Users:{
			[sessionStorage.getItem('User')]:true
		}
	};
	var ref = db.ref(BOARDS);
	ref = ref.push();
	ref.set(board);
	redirect("kanban.html");
}
