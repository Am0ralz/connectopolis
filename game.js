import { data } from "./info.js";
var db = firebase.firestore();
// console.log(db);
//create a new game reference in firebase
function createGame(){
    // Add a new document with a generated id.
db.collection("games").add({
    users: ["Jasmin", "Cam", "Bobby", "Angel"],
    board: JSON.stringify(data)
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});

} 


