// BUTTONS

let startButton = document.getElementById('start-button')
let inflateButton = document.getElementById('inflate-button')

// #region GAME LOGIC and DATA


inflateButton.setAttribute("disabled", "true")
let clickCount = 0
let height = 120
let width = 100
let inflationRate = 20
let maxsize = 300
let currentPopCount = 0
let highestPopCount = 0
let gameLength = 5000
let clockId = 0
let timeRemaining = 0
let currentPlayer = {}


function startGame() {
    startButton.setAttribute("disabled", "true")
    inflateButton.removeAttribute("disabled")
    draw()
    startClock()
    setTimeout(stopGame, gameLength)
}

function startClock() {
    timeRemaining = gameLength / 1000
    clockId = setInterval(drawClock, 1000)
    drawClock()
}

function drawClock() {
    let countDown = document.getElementById('countdown')
    countDown.innerText = timeRemaining.toString()
    timeRemaining--
}

function stopClock() {
    clearInterval(clockId)
}
function inflate() {
    clickCount++

    height += inflationRate
    width += inflationRate

    if (height >= maxsize) {
        currentPopCount++
        height = 0
        width = 0
    }

    console.log("Inflate!")
    draw()
}

function draw() {
    let baloonElem = document.getElementById("balloon")
    let clickCountElem = document.getElementById("click-count")
    let popCountelem = document.getElementById("pop-count")
    let highestScore = document.getElementById("high-score")

    clickCountElem.innerText = clickCount.toString()
    baloonElem.style.height = height + "px"
    baloonElem.style.width = width + "px"
    popCountelem.innerText = currentPopCount.toString()
    highestScore.innerText = currentPlayer.topScore.toString()
}

function stopGame() {
    console.log("Time's up!")
    inflateButton.setAttribute("disabled", "true")
    startButton.removeAttribute("disabled")
    height = 120
    width = 100
    clickCount = 0
    if (currentPopCount > currentPlayer.topScore) {
        currentPlayer.topScore = currentPopCount
        savePlayers()
    }
    currentPopCount = 0
    stopClock()
    drawClock()
    draw()
}

// #endregion

let players = []
loadPlayers()

function setPlayer(event) {
    event.preventDefault()
    let form = event.target
    let playerName = form.playerName.value
    form.reset()
    currentPlayer = players.find(player => player.name == playerName)
    if (!currentPlayer) {
        currentPlayer = { name: playerName, topScore: 0 }
        players.push(currentPlayer)
        savePlayers()
    }
    form.reset()
    document.getElementById("game").classList.remove("hidden")
    form.classList.add("hidden")
    draw()
}

function changePlayer() {
    document.getElementById("game").classList.add("hidden")
    document.getElementById("player-form").classList.remove("hidden")
}

function savePlayers() {
    window.localStorage.setItem("players", JSON.stringify(players))
}

function loadPlayers() {
    let playersData = JSON.parse(window.localStorage.getItem("players"))
    if (playersData) {
        players = playersData
    }
}