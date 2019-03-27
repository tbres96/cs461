(function() {
	// Initialize Firebase --------------------------------------------------------
	const config = {
		apiKey: "AIzaSyA11FpqG-RKNpZ0loNU8HhunHUgk7EFCqY",
		authDomain: "seniorsemgit.firebaseapp.com",
		databaseURL: "https://seniorsemgit.firebaseio.com",
		projectId: "seniorsemgit",
		storageBucket: "seniorsemgit.appspot.com",
		messagingSenderId: "348042953918"

	};
firebase.initializeApp(config);
//-------------------------------------------------------------------------------------

	//Get Elements
	const txtEmail = document.getElementById('txtEmail');
	const txtPassword = document.getElementById('txtPassword');
	const btnLogin = document.getElementById('btnLogin');
	const btnSignUp = document.getElementById('btnSignUp');
	const btnLogout = document.getElementById('btnLogout');

	//Add login event
	btnLogin.addEventListener('click', e => {
		//Get email and pass
		const email = txtEmail.value;
		const pass = txtPassword.value;
		const auth = firebase.auth();
		//Sign in
		const promise = auth.signInWithEmailAndPassword(email, pass);
		promise.catch(e => console.log(e.message));
	});


	//Add signup event
	btnSignUp.addEventListener('click', e => {
		//Get email and Pass
		// TODO: REAL EMAIL CONSTRAINTS
		const email = txtEmail.value;
		const pass = txtPassword.value;
		const auth = firebase.auth();
		//Sign up
		const promise = auth.createUserWithEmailAndPassword(email, pass);
		promise
			.catch(e => console.log(e.message));
	});

	//Add logout event
	btnLogout.addEventListener('click', e => {
		firebase.auth().signOut();
	});

	//Add realtime listener
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser) {
			console.log(firebaseUser);
			//If user is logged in, show button
			btnLogout.classList.remove('hide');
		} else {
			console.log('not logged in');
			//If user is not logged in, hide button
			btnLogout.classList.add('hide');
		}
	});


}());
//Source: https://www.youtube.com/watch?v=-OKrloDzGpU

