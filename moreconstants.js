let playerNames = new Set()
let players = []
let game = cuphead
let gameID = 'cuphead'
// let levels = []
let levels = JSON.parse(generated)
levels.forEach((level, levelIndex) => {
    level.boss = bosses[levelIndex]
})
let levelDifficulty = 'regular'
let DLCnoDLC = 0
let highestGrade = 0
let otherColor = 'midnightBlue'
const hash = window.location.hash;
if (hash == '#sm64') {
    game = sm64
    gameID = 'sm64'
    const gameLogo = document.getElementById('game-logo')
    gameLogo.src = "images/sm64.png"
    gameLogo.style.width = '450px'
    const banners = document.querySelectorAll('header, footer')
    banners.forEach(elem => {
        elem.style.color = 'white'
        elem.style.backgroundColor = 'slateblue'
    })
    const body = document.querySelector('body')
    body.style.backgroundColor = 'navy'
    const cupheadWeapons = document.querySelectorAll('.cupheadWeapons')
    cupheadWeapons.forEach(elem => {
        elem.style.display = 'none'
    })
    const favicon = document.getElementById('favicon')
    favicon.href = 'images/favicon_sm64.png'
    const title = document.querySelector('title')
    title.innerText = 'SM64 Leaderboard'
    // const fullorIL = document.getElementById('fullorIL')
    // fullorIL.style.display = 'none'
    document.documentElement.style.setProperty('--background', 'navy');
    document.documentElement.style.setProperty('--otherColor', 'darkblue');
    document.documentElement.style.setProperty('--th', 'slateblue');
} else {

}
let processedCategories = 0