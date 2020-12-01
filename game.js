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



function copyCode(){
    /* Get the text field */
  var copyText = document.getElementById("create-game-id");
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");

  document.getElementById("copy-code-div")


}

const copyGameBtn = document.getElementById("cg-btn");
copyGameBtn.addEventListener('click', copyCode);


const connectGameBtn = document.getElementById("jg-btn");
connectGameBtn.addEventListener('click', connectGame);