initGame();

function initGame() {



}

arrayButton = document.querySelectorAll(".levelButton")
for(const element of arrayButton) {
  element.addEventListener("mouseover", (event) => {
  event.target.style.backgroundColor ='#ff5a1e'; });

  element.addEventListener("mouseout",(event) => {
  event.target.style.backgroundColor ="";})
}


newGame = document.querySelector(".newGame")
newGame.addEventListener("mouseover", (event) => {
  event.target.style.color ='#ff5a1e';});

newGame.addEventListener("mouseout", (event) => {
  event.target.style.color ='';})