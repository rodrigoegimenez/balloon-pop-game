// #region GAME LOGIC and DATA
let clickCount = 0
let height = 140
let width = 100
let inflationRate = 20
let maxsize = 300
let currentPopCount = 0
let highestPopCount = 0
let gameLength = 5000
let clockId = 0
let timeRemaining = 0
let currentPlayer = {}
let redAngle = 0
let players = []

loadPlayers()
drawScoreboard()

/**
 * @param {string} id
 */
function hide(id) {
    document.getElementById(id).classList.add("hidden")
}

/**
 * @param {string} id
 */
function show(id) {
    document.getElementById(id).classList.remove("hidden")
}

function startGame() {
    hide("main-controls")
    hide("scoreboard")
    show("game-controls")
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
    console.log("Inflate!")
    checkBalloonPop()
    draw()
}

function checkBalloonPop() {
    if (height >= maxsize) {
        // @ts-ignore
        document.getElementById("pop-sound").play()
        currentPopCount++
        height = 0
        width = 0
        let balloonElem = document.getElementById("balloon")
        let randomNumber = randomIntFromInterval(0, 4)
        let angle = randomNumber * 90 + redAngle
        console.log(angle)
        balloonElem.style.filter = "hue-rotate(" + angle + "deg)"
    }
}

function draw() {
    let baloonElem = document.getElementById("balloon")
    let clickCountElem = document.getElementById("click-count")
    let popCountelem = document.getElementById("pop-count")
    let highestScore = document.getElementById("high-score")
    let playerNameElem = document.getElementById("player-name")

    clickCountElem.innerText = clickCount.toString()
    baloonElem.style.height = height + "px"
    baloonElem.style.width = width + "px"
    popCountelem.innerText = currentPopCount.toString()
    highestScore.innerText = currentPlayer.topScore.toString()
    playerNameElem.innerText = currentPlayer.name
}

function stopGame() {
    console.log("Time's up!")
    hide("game-controls")
    show("main-controls")
    show("scoreboard")
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
    drawScoreboard()
    draw()
}

// #endregion


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
    drawScoreboard()
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

function drawScoreboard() {
    let template = ""

    players.sort((p1, p2) => p2.topScore - p1.topScore)

    players.forEach(player => {
        template += `
        <div class="d-flex space-between">
            <span>
                <i class="fas fa-user-circle"></i>
                ${player.name}
            </span>
            <span>score: ${player.topScore}</span>
        </div>
        `
    })
    console.log("drawScoreboard")
    console.log(template)
    document.getElementById("players").innerHTML = template
}


function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}