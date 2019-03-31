// Initialize Firebase
var config = {
apiKey: "AIzaSyA11FpqG-RKNpZ0loNU8HhunHUgk7EFCqY",
        authDomain: "seniorsemgit.firebaseapp.com",
        databaseURL: "https://seniorsemgit.firebaseio.com",
        projectId: "seniorsemgit",
        storageBucket: "seniorsemgit.appspot.com",
        messagingSenderId: "348042953918"
};
firebase.initializeApp(config);
//firebase.database.goOnline();
var db = firebase.database();

function getTaskInfo(board, section, task){
	var boardRef = db.ref('Boards/' + board + '/Tasks/' + section + '/' + task).once('value').then(function(snapshot){
		if(snapshot.val() && snapshot.val().Name){
			document.getElementById("name").innerHTML = "Task: " + snapshot.val().Name;
			document.getElementById("name").style.display = "inline";
		}
	});

}

function fillTaskPage(){
	getTaskInfo("Board1", "Todo", "Task1");
	document.getElementById("test").innerHTML = "Hello World!";
}