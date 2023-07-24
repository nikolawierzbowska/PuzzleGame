newGameEvent()
choseLevelEvent()
const pictures = document.querySelector(".pictures")
locateImages()
initGame()

let steps  = 0
statistics()


function choseLevelEvent(){
  const arrayButton = document.querySelectorAll(".levelButton")
  for(const element of arrayButton) {
    element.addEventListener("mouseover", (event) => {
      event.target.style.backgroundColor ='#ff5a1e'; });

    element.addEventListener("mouseout",(event) => {
      event.target.style.backgroundColor ="";})
  }
}


function newGameEvent() {
  const newGame = document.querySelector(".newGame")
  newGame.addEventListener("mouseover", (event) => {
    event.target.style.color ='#ff5a1e';});

  newGame.addEventListener("mouseout", (event) => {
    event.target.style.color ='';})
}


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




locateImages()

async function getImages(){
  const images = await fetch('/image')
      .then(response => response.json())
  return images
}


function creteImagesContainer(imageFileName) {
  const imageContainer = document.createElement("div")
  imageContainer.classList.add("imageContainer")

  const imagePuzzle= document.createElement("img")
  imagePuzzle.setAttribute("src", 'static/image/'+ imageFileName);
  imageContainer.appendChild(imagePuzzle);


  return imageContainer;
}


function  locateImages() {
  getImages()
      .then(images => {
        images.forEach(img => {
            const imageContainer = creteImagesContainer(img);
            pictures.appendChild(imageContainer)
        })
      })
}


// function openWebsiteToPuzzle(event) {
//     const clickedImage = event.target;
//     const imageUrl = clickedImage.src;
//     const targetUrl = 'http://127.0.0.1:5000/puzzle';
//
//     window.open(targetUrl, '_self');
// }
//  imagePuzzle= document.createElement("img")
//
// const imagePuzzles = pictures.getElementsByTagName("img")
//
//
// for( const img of imagePuzzles) {
//     img.addEventListener("click", openWebsiteToPuzzle)
// }




function initGame() {
  const puzzles =document.querySelectorAll(".puzzle");
  const board = document.querySelector(".board");

   // board.style.order =Math.ceil(Math.random()*10)

  const puzzlesState = [
      [puzzles[0], puzzles[1], puzzles[2]],
      [puzzles[3], puzzles[4], puzzles[5]],
      [puzzles[6], puzzles[7], puzzles[8]]
  ];



  function newBoard(board, puzzleState) {
    puzzleState.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
          column.style.top = `${rowIndex*200}px`;
          column.style.left = `${columnIndex*200}px`;

      column.style['background-position-y'] =`-${rowIndex*200}px`;
      column.style['background-position-x'] =`-${columnIndex*200}px`;
      board.appendChild(column);

      });
    });
  }

  function movePuzzle(puzzle1, puzzle2) {

      const tempTop = puzzle1.style.top;
      const tempLeft = puzzle1.style.left;

      puzzle1.style.top = puzzle2.style.top;
      puzzle1.style.left = puzzle2.style.left;

      puzzle2.style.top = tempTop;
      puzzle2.style.left = tempLeft;

  }

  newBoard(board, puzzlesState);


  function clikAndCheck() {
      board.addEventListener("click", (event) => {
          const target = event.target;

          let x, y;

          puzzlesState.forEach((row, rowIndex) => {
              row.forEach((column, columnIndex) => {
                  if (column === target) {
                      x = rowIndex;
                      y = columnIndex;

                  }
              });
          });

          let emptyPuzzleX, emptyPuzzleY;

          puzzlesState.forEach((row, rowIndex) => {
              row.forEach((column, columnIndex) => {
                  if (column.innerText === "") {
                      emptyPuzzleX = rowIndex;
                      emptyPuzzleY = columnIndex;
                  }
              });
          });

          if ((y === emptyPuzzleY && (x + 1 === emptyPuzzleX || x - 1 === emptyPuzzleX)) ||
              (x === emptyPuzzleX && (y + 1 === emptyPuzzleY || y - 1 === emptyPuzzleY))
          ) {
              movePuzzle(puzzlesState[x][y], puzzlesState[emptyPuzzleX][emptyPuzzleY] )

              const temp = puzzlesState[x][y];
              puzzlesState[x][y] = puzzlesState[emptyPuzzleX][emptyPuzzleY];
              puzzlesState[emptyPuzzleX][emptyPuzzleY] = temp;
              steps++
              statistics()
          }
      });

  function statistics() {
    document.querySelector("#steps").textContent =steps
    // document.querySelector("#time")


}

  }
  clikAndCheck()




}








// function gameFinish {
//   alert("Congratulations!")
//
// }