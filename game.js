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
    document.getElementById("create-game-id").value = docRef.id
    document.getElementById("overlay").style.display = "block";

})
.catch(function(error) {
    console.error("Error adding document: ", error);
});

} 



const createGameBtn = document.getElementById("create-game-btn");
createGameBtn.addEventListener('click', createGame);


//add user to an open game
function connectGame(){
    window.location.replace("/board.html")

}


const connectGameBtn = document.getElementById("cg-btn");
connectGameBtn.addEventListener('click', connectGame);