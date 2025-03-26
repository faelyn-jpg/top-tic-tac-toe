//gameboard object, represents the state of the board
//each square holds a Cell,
//needs to method to add Cells to squares on board
function GameBoard() {
  //gameboard - has rows, columns and board array
  const rows = 3
  const columns = 3
  const board = []

  //create 2d array for game board
  for (let i = 0; i < rows; i++) {
    board[i] = []
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell())
    }
  }
  //getBoard method gets board for UI to render
  const getBoard = () => board

  //placeMarker method,
  const placeMarker = (row, column, player) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addMarker(player)
    } else {
      return
    }
    //check if cell is available
    //if not available, stop execution,
    //otherwise add marker to cell for player
  }
  //printBoard to see in console?
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    )
    console.log(boardWithCellValues)
  }

  return { getBoard, placeMarker, printBoard }
}

//return methods to be used
// A cell is one square on the board and can have one of these values:
// 0: no marker is in the square,
// 1: player 1's marker
// 2: player 2's marker

//Cell function
function Cell() {
  //set base value for reach cell
  let value = 0
  //needs to accept players marker
  const addMarker = (player) => {
    value = player
  }
  //needs to get value of cell to return
  const getValue = () => value

  //return token and value
  return {
    addMarker,
    getValue,
  }
}

//game controller object
//define player names
function GameController(
  playerOneName = 'Player One',
  playerTwoName = 'Player Two'
) {
  //define board
  const board = GameBoard()

  //set round
  let round = 0

  //player objects in array
  const players = [
    {
      name: playerOneName,
      marker: 1,
    },
    {
      name: playerTwoName,
      marker: 2,
    },
  ]
  //set currently active player

  let activePlayer = players[0]

  //need to be able to switch players

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]
  }
  //get the active player
  const getActivePlayer = () => activePlayer

  //print new round for who's turn it is
  const printNewRound = () => {
    board.printBoard()
    console.log(`${getActivePlayer().name}'s turn`)
  }

  //play round,

  const playRound = (row, column) => {
    round++
    console.log(
      `Placing ${
        getActivePlayer().name
      }'s marker into row ${row} and column ${column}`
    )
    //let player add marker
    board.placeMarker(row, column, getActivePlayer().marker)

    //define check for winner
    const checkWin = (player, board) => {
      //transpose board for vertical check
      const transposeBoard = (board) => {
        return board.map((_, index) => board.map((row) => row[index]))
      }
      //if row[i] column0,1,2 is the same value, player win (horizontal)
      const isHorizontalWinner = () => {
        return board.some((moves) =>
          moves.every((move) => move.getValue() === player)
        )
      }
      //if column[i] row[0] and [1] and [2] are same value, win (vertical)
      const isVerticalWinner = () => {
        return transposeBoard(board).some((moves) =>
          moves.every((move) => move.getValue() === player)
        )
      }
      //if  row=0 column=0 and row=1 column=1 and row=2 column=2 are same, player win (diagonal)
      //if row=0 column =2 and row=1 column=1 and row=2 column=0 are same, player win (diagonal)
      const isDiagonalWinner = () => {
        const diagonalCheck =
          board[0][0].getValue() === player &&
          board[1][1].getValue() === player &&
          board[2][2].getValue() === player
        const diagonalCheck2 =
          board[0][2].getValue() === player &&
          board[1][1].getValue() === player &&
          board[2][0].getValue() === player
        if (diagonalCheck || diagonalCheck2) return true
        else {
          return false
        }
      }

      //return if win is true or false
      return isHorizontalWinner() || isDiagonalWinner() || isVerticalWinner()
    }
    //check for win
    //print for console rn
    console.log(checkWin(getActivePlayer().marker, board.getBoard()))
    console.log(round)
    //if all cells are full and no winner, stalemate
    const checkStalemate = (round, winStatus) => {
      return round === 9 && winStatus == false ? true : false
    }
    if (
      checkStalemate(
        round,
        checkWin(getActivePlayer().marker, board.getBoard())
      )
    ) {
      console.log('Stalemate!')
    }

    //switch who's turn it is if no winner & no stalemate
    switchPlayerTurn()
    //display whose turn it is
    printNewRound()
  }

  //initalize game message
  printNewRound()

  //gamecontroller returns ability to play round and see who the active player is
  return {
    playRound,
    getActivePlayer,
  }
}

const game = GameController()

//set game to game controller
