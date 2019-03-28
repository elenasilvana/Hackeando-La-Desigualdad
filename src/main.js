const showSignUp = () => {
    const signUpForm = document.querySelector(".sign-up");
    const signInForm = document.querySelector(".sign-in");

    signUpForm.style.display = 'block';
    signInForm.style.display = 'none';
}
const signUpButton = document.querySelector(".sign-up-button");
signUpButton.addEventListener("click", showSignUp);

//Funcion para registrar usuarios nuevos
const register = () => {
    let email = document.querySelector(".mailSignUp").value;
    let password = document.querySelector(".passwordSignUp").value;

    console.log(email);
    console.log(password);

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function() {
            verification()
        })
        .catch(function(error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // ...
            console.log(errorCode);
            console.log(errorMessage);
        });
}
const registerButton = document.querySelector(".register-button");
registerButton.addEventListener("click", register);


//Funcion para entrar a los usuarios ya registrados
const enter = () => {
    let emailSignIn = document.querySelector(".mail").value;
    let passwordSignIn = document.querySelector(".password").value;

    console.log(emailSignIn);
    console.log(passwordSignIn);

    firebase.auth().signInWithEmailAndPassword(emailSignIn, passwordSignIn)
        .catch(function(error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // ...
            console.log(errorCode);
            console.log(errorMessage);
        });
}

const signInButton = document.querySelector(".sign-in-button");
signInButton.addEventListener("click", enter);

//Funcion para verificar el correo electronico del usuario
const verification = () => {
    let user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function() {
        // Email sent.
        console.log("Enviando correo")
    }).catch(function(error) {
        // An error happened.
        console.log(error)
    });
}

//Funcion para observar todo lo que esta haciendo el codigo, registro, entrada, salida, usuario, etc.
const observador = () => {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("Existe Usuario activo")
            showContent(user);
            // User is signed in.
            let displayName = user.displayName;
            let email = user.email;
            console.log(user)
            console.log(user.emailVerified)
            let emailVerified = user.emailVerified;
            let photoURL = user.photoURL;
            let isAnonymous = user.isAnonymous;
            let uid = user.uid;
            let providerData = user.providerData;
            // ...
        } else {
            // User is signed out.
            console.log("No existe usuario activo")
                // ...
        }
    });
}
observador();


//Funcion que muestra contenido a los usuarios registrados
const showContent = (user) => {
    let user1 = user;
    let content = document.querySelector(".content");
    if (user1.emailVerified) {
        content.innerHTML = `
		<p>Welcome to WoTravel!</p>
		<button class="sign-out-button">Sign Out</button>
		`;
        const signOutButton = document.querySelector(".sign-out-button");
        signOutButton.addEventListener("click", close);
    }

}

//Funcion de boton para cerrar sesion
const close = () => {
    firebase.auth().signOut()
        .then(function() {
            console.log("Saliendo... :)")
        })
        .catch(function(error) {
            console.log(error)
        })
}


/*	  let verificationMessage = document.querySelector(".sign-up");
	  content.innerHTML = `
	  <p>We sent a verification mail, please check to confirm</p>
	`;
    */

// Initialize Cloud Firestore through Firebase
let db = firebase.firestore();
//agregar informacion
function post() {
    let posts = document.querySelector(".post").value;
    db.collection("userPost").add({
            text: posts
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            document.querySelector(".post").value = "";
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
}
document.querySelector(".buttonPost").addEventListener("click", post);

//leer documentos
const boxPost = document.querySelector(".boxPost");
db.collection("userPost").onSnapshot((querySnapshot) => {
    boxPost.innerHTML = "";
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().text}`);
        boxPost.innerHTML += `
        ${doc.data().text}
        `
    });
});