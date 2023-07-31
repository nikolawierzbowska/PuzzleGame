let steps = 0

newGameEvent()
choseLevelEvent()

const pictures = document.querySelector(".pictures")


locateImages()
initGame()


function choseLevelEvent() {
    const arrayButton = document.querySelectorAll(".levelButton")
    for (const element of arrayButton) {
        element.addEventListener("mouseover", (event) => {
            event.target.style.backgroundColor = '#ff5a1e';
        });

        element.addEventListener("mouseout", (event) => {
            event.target.style.backgroundColor = "";
        })
    }
}


function newGameEvent() {
    const newGame = document.querySelector(".newGame")
    newGame.addEventListener("mouseover", (event) => {
        event.target.style.color = '#ff5a1e';
    });
    newGame.addEventListener("mouseout", (event) => {
        event.target.style.color = '';
    })
}


function SortResultsUp() {
    let table, rows, switching, i, x, y;
    table = document.querySelector(".main_table");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            x = parseInt(rows[i].querySelector(".results").textContent);
            y = parseInt(rows[i + 1].querySelector(".results").textContent);
            if (x < y) {
                table.rows[i].parentNode.insertBefore(table.rows[i + 1], table.rows[i]);
                switching = true;
            }
        }
    }
}


function SortResultsDown() {
    let table, rows, switching, i, x, y;
    table = document.querySelector(".main_table");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            x = parseInt(rows[i].querySelector(".results").textContent);
            y = parseInt(rows[i + 1].querySelector(".results").textContent);
            if (x > y) {
                table.rows[i].parentNode.insertBefore(table.rows[i + 1], table.rows[i]);
                switching = true;
            }
        }
    }
}

async function getImages() {
    const images = await fetch('/image')
        .then(response => response.json())
    return images
}


function creteImagesContainer(imageFileName) {
    const imageContainer = document.createElement("div")
    imageContainer.classList.add("imageContainer")

    const imagePuzzle = document.createElement("img")
    imagePuzzle.setAttribute("src", 'static/image/' + imageFileName);

    imagePuzzle.addEventListener("click", clicks)

    imageContainer.appendChild(imagePuzzle);
    imageContainer.style.order = Math.floor(Math.random() * 100)
    return imageContainer;
}


function locateImages() {
    getImages()
        .then(images => {
            images.forEach(img => {
                const imageContainer = creteImagesContainer(img);
                pictures.appendChild(imageContainer)
            })
        })
}



function clicks(event) {
    const pic = event.target.closest(".imageContainer")
    if (pic) {
        if (event.target.tagName === 'IMG') {
            const {src} = event.target;
            window.location.href = `http://127.0.0.1:5000/puzzle?img=${encodeURIComponent(src)}`;
        }
    }
}

function updatePuzzleBackground() {

    const urlParams = new URLSearchParams(window.location.search);
    const imgSrc = urlParams.get('img');

    if (imgSrc) {
        const puzzleDivs = document.querySelectorAll('.puzzle');

        puzzleDivs.forEach((puzzleDiv) => {
            puzzleDiv.style.backgroundImage = `url(${imgSrc})`;

            const lastPuzzle = document.getElementById("9")
            lastPuzzle.style.backgroundImage = "none"
        });
    }
}



function initGame() {
    const board = document.querySelector(".board");


    const puzzleElements =Array.from(document.querySelectorAll(".puzzle"));


    let puzzleState = []
    for (let i = 0; i < puzzleElements.length; i += 3) {
        let row = puzzleElements.slice(i, i + 3);
        puzzleState.push(row);
    }


    function createBoard(board, puzzleState) {
        puzzleState.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {

                column.style.top = `${rowIndex * 200}px`;
                column.style.left = `${columnIndex * 200}px`;


                let reversedRowIndex = puzzleState.length -1 - rowIndex;
                let reversedColumnIndex = puzzleState.length -1 - columnIndex;

                column.style['background-position-y'] = `-${reversedRowIndex * 200}px`;
                column.style['background-position-x'] = `-${reversedColumnIndex * 200}px`;

                board.appendChild(column);
            });
        });
    }


    function swapPuzzle(puzzle, puzzleEmpty) {
        const tempTop = puzzle.style.top;
        const tempLeft = puzzle.style.left;

        puzzle.style.top = puzzleEmpty.style.top;
        puzzle.style.left = puzzleEmpty.style.left;

        puzzleEmpty.style.top = tempTop;
        puzzleEmpty.style.left = tempLeft;
    }


    function movePuzzle(event) {
        const puzzle = event.target;
        let puzzleX, puzzleY

        for (let i = 0; i < puzzleState.length; i++) {
            if (puzzleState[i].includes(puzzle)) {
                puzzleX = i;
                puzzleY = puzzleState[i].indexOf(puzzle);
                break;
            }
        }

        const emptyPuzzle = document.getElementById(('9'));
        let puzzleEmptyX, puzzleEmptyY;
        for (let i = 0; i < puzzleState.length; i++) {
            if (puzzleState[i].includes(emptyPuzzle)) {
                puzzleEmptyX = i;
                puzzleEmptyY = puzzleState[i].indexOf(emptyPuzzle);
                break;
            }
        }

        if ((puzzleY === puzzleEmptyY && (puzzleX + 1 === puzzleEmptyX || puzzleX - 1 === puzzleEmptyX)) ||
            (puzzleX === puzzleEmptyX && (puzzleY + 1 === puzzleEmptyY || puzzleY - 1 === puzzleEmptyY))
        ) {
            swapPuzzle(puzzleState[puzzleX][puzzleY], puzzleState[puzzleEmptyX][puzzleEmptyY])

            const temp = puzzleState[puzzleX][puzzleY];
            puzzleState[puzzleX][puzzleY] = puzzleState[puzzleEmptyX][puzzleEmptyY];
            puzzleState[puzzleEmptyX][puzzleEmptyY] = temp;
            steps++
            statistics()
        }
    }

    createBoard(board, puzzleState);


    document.addEventListener("DOMContentLoaded", updatePuzzleBackground)

    puzzleState.forEach(row => {
        row.forEach(puzzle => {
            puzzle.addEventListener('click', movePuzzle);

        });
    });


    function statistics() {
        document.querySelector("#steps").textContent = steps
    }


}