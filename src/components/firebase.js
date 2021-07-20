const firebase = require("firebase/app");
// Required for side-effects
require("firebase/firestore");

export default firebase.initializeApp({
    apiKey: APIKEY,
    authDomain: "schuumapp.firebaseapp.com",
    databaseURL: "https://schuumapp.firebaseio.com",
    projectId: "schuumapp",
    storageBucket: "schuumapp.appspot.com",
    messagingSenderId: "860958081891",
    appId: "1:860958081891:web:057ef43e6dbc1bc2"
})
