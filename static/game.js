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


newGame = document.querySelector(".newGame");
newGame.addEventListener("mouseover", (event) => {
  event.target.style.color ='#ff5a1e';});

newGame.addEventListener("mouseout", (event) => {
  event.target.style.color ='';});





function SortResultsUp() {
  let table, rows, switching, i ,x ,y, shouldSwitch;
  table = document.querySelector(".main_table");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i< (rows.length - 1); i++) {
      shouldSwitch = false;
      x = parseInt(rows[i].querySelector(".results").textContent);
      y = parseInt(rows[i+1].querySelector(".results").textContent);
      if (x < y) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      table.rows[i].parentNode.insertBefore(table.rows[i + 1], table.rows[i]);
      switching = true;
    }
  }
}


function SortResultsDown() {
  let table, rows, switching, i ,x ,y, shouldSwitch;
  table = document.querySelector(".main_table");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i< (rows.length - 1); i++) {
      shouldSwitch = false;
      x = parseInt(rows[i].querySelector(".results").textContent);
      y = parseInt(rows[i+1].querySelector(".results").textContent);
      if (x > y) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      table.rows[i].parentNode.insertBefore(table.rows[i + 1], table.rows[i]);
      switching = true;
    }
  }
}

