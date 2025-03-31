function GameBoard() {
  const rows = 3
  const columns = 3
  const board = []

  for (let i = 0; i < rows; i++) {
    board[i] = []
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell())
    }
  }

  const getBoard = () => board

  const placeMarker = (row, column, player) => {
    if (board[row][column].getValue() === '') {
      board[row][column].addMarker(player)
    } else {
      return
    }
  }

  const resetBoard = () => {
    board.map((row) => row.map((cell) => cell.resetMarker()))
  }
  return { getBoard, placeMarker, resetBoard }
}

function Cell() {
  let value = ''
  const addMarker = (player) => {
    value = player
  }
  const getValue = () => value

  const resetMarker = () => {
    value = ''
  }
  return {
    resetMarker,
    addMarker,
    getValue,
  }
}

function GameController() {
  const board = GameBoard()

  let round = 0

  const players = [
    {
      player: 'p1',
      name: 'X Player',
      marker: 'X',
      wins: 0,
    },
    {
      player: 'p2',
      name: 'O Player',
      marker: 'O',
      wins: 0,
    },
  ]

  const getPlayers = () => players

  const setPlayerName = (player, newName) => {
    const settingName = players.find((obj) => {
      return obj.player === player
    })
    settingName.name = newName
  }

  let activePlayer = players[0]

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]
  }

  const getActivePlayer = () => activePlayer

  const playRound = (row, column) => {
    round++
    board.placeMarker(row, column, getActivePlayer().marker)

    const checkWin = (player, board) => {
      //transpose board for vertical check
      const transposeBoard = (board) => {
        return board.map((_, index) => board.map((row) => row[index]))
      }
      const isHorizontalWinner = () => {
        return board.some((moves) =>
          moves.every((move) => move.getValue() === player)
        )
      }
      const isVerticalWinner = () => {
        return transposeBoard(board).some((moves) =>
          moves.every((move) => move.getValue() === player)
        )
      }
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
      return isHorizontalWinner() || isDiagonalWinner() || isVerticalWinner()
    }
    const checkStalemate = (round, winStatus) => {
      return round === 9 && winStatus == false ? true : false
    }

    const winStatus = (function getWinStatus() {
      let message = null
      let status = false
      if (checkWin(getActivePlayer().marker, board.getBoard())) {
        message = `${getActivePlayer().name} wins!`
        getActivePlayer().wins++
        status = true
      } else if (
        checkStalemate(
          round,
          checkWin(getActivePlayer().marker, board.getBoard())
        )
      ) {
        message = 'Stalemate!'
        status = true
      }
      return { message, status }
    })()
    if (winStatus.status === false) {
      switchPlayerTurn()
    }
    return winStatus
  }

  const resetGame = () => {
    board.resetBoard()
    round = 0
    switchPlayerTurn()
  }

  return {
    getPlayers,
    setPlayerName,
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    resetGame,
  }
}

;(function ScreenController() {
  const game = GameController()
  const playerTurnDiv = document.querySelector('.turn')
  const boardDiv = document.querySelector('.board')
  const nameForm = document.querySelector('form')
  const control = document.querySelector('.control')
  const p1Name = document.querySelector('.p1-name')
  const p2Name = document.querySelector('.p2-name')
  const p1Wins = document.querySelector('.p1-wins')
  const p2Wins = document.querySelector('.p2-wins')

  let gameStartedToggle = false

  const updateScreen = (winStatus) => {
    boardDiv.textContent = ''
    playerTurnDiv.textContent = ''

    const board = game.getBoard()
    const activePlayer = game.getActivePlayer()
    const players = game.getPlayers()

    const updatePlayerScore = (p, player) => {
      const playerName = document.querySelector(`.${p}-name`)
      const playerWins = document.querySelector(`.${p}-wins`)
      playerName.textContent = ''
      playerWins.textContent = ''

      playerName.textContent = player.name
      playerWins.textContent =
        player.wins + (player.wins === 1 ? ' Win' : ' Wins')
    }

    updatePlayerScore(players[0].player, players[0])
    updatePlayerScore(players[1].player, players[1])

    if (gameStartedToggle === false) {
      playerTurnDiv.textContent = 'Press Start to play!'
    } else {
      control.textContent = 'Reset'
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
      control.setAttribute('disabled', true)
    }

    if (winStatus?.status !== undefined && winStatus?.status !== false) {
      playerTurnDiv.textContent = winStatus.message
      gameStartedToggle = !gameStartedToggle
      control.removeAttribute('disabled')
    }

    board.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        const cellButton = document.createElement('button')

        cellButton.classList.add('cell')
        //data attribute to identify columns/rows
        cellButton.dataset.row = rIndex
        cellButton.dataset.column = cIndex
        cellButton.textContent = cell.getValue()
        cellButton.textContent !== '' || gameStartedToggle === false
          ? cellButton.setAttribute('disabled', true)
          : cellButton.removeAttribute('disabled')
        boardDiv.appendChild(cellButton)
      })
    })
  }

  function clickHandlerStart(e) {
    if (control.textContent === 'Reset') {
      game.resetGame()
    }

    gameStartedToggle === false
      ? (gameStartedToggle = true)
      : (gameStartedToggle = false)

    updateScreen()
  }

  function changeHandler(e) {
    const selectedPlayer = e.target.id
    const nameChanged = e.target.value
    game.setPlayerName(selectedPlayer, nameChanged)
    updateScreen()
  }

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row
    const selectedColumn = e.target.dataset.column
    if (!selectedColumn || !selectedRow) return
    //make sure column/row is clicked and not space between

    const winStatus = game.playRound(selectedRow, selectedColumn)
    updateScreen(winStatus)
  }

  control.addEventListener('click', clickHandlerStart)
  boardDiv.addEventListener('click', clickHandlerBoard)
  nameForm.addEventListener('change', changeHandler)
  //inital render
  updateScreen()
})()
