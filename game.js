import { data } from "./info.js";

var db = firebase.firestore();
// console.log(db);
//create a new game reference in firebase


function createGame(){
    // Add a new document with a generated id.
db.collection("games").add({
    players: ["Jasmin"],
    board: JSON.stringify(data)
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
    //create new board and redirect user 
    localStorage.setItem("gameId", docRef.id);

    window.location.replace("/board.html")
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});

} 



const createGameBtn = document.getElementById("cg-btn");
createGameBtn.addEventListener('click', createGame);

//add user to an open game
function connectGame(){

}