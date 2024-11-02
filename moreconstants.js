let playerNames = new Set()
let players = []
let game = cuphead
let gameID = 'cuphead'
let fullgame = true
let ILchange = false
// let levels = []
let levels = JSON.parse(generated)
levels.forEach((level, levelIndex) => {
    level.boss = bosses[levelIndex]
})
let cupheadVersion = 'currentPatch'
let levelDifficulty = 'regular'
let DLCnoDLC = 0
let highestGrade = 0
const hash = window.location.hash;
if (hash == '#sm64') {
    game = sm64
    gameID = 'sm64'
    const gameLogo = document.getElementById('game-logo')
    gameLogo.style.width = '450px'
    const body = document.querySelector('body')
    body.style.backgroundColor = 'navy'
    const title = document.querySelector('title')
    title.innerText = 'SM64 Leaderboard'
    document.documentElement.style.setProperty('--background', 'navy');
    document.documentElement.style.setProperty('--otherColor', 'darkblue');
    document.documentElement.style.setProperty('--gray', 'slateblue');
} else if (hash == '#tetris') {
    game = tetris
    gameID = 'tetris'
    const gameLogo = document.getElementById('game-logo')
    gameLogo.style.width = '250px'
    const subtitle = document.getElementById('subtitle')
    subtitle.innerText = 'PACE MASTERS'
    subtitle.style.paddingTop = '5px'
    const title = document.querySelector('title')
    title.innerText = 'Tetris Pace Masters'
    const header = document.querySelector('header')
    header.style.height = '145px'
    const displayOptions = document.getElementById('displayOptions')
    displayOptions.style.display = 'none'
    const github = document.getElementById('github')
    github.style.filter = 'brightness(0) invert(1)'
    document.documentElement.style.setProperty('--font', 'pressStart2P');
    document.documentElement.style.setProperty('--font2', 'pressStart2P');
    document.documentElement.style.setProperty('--banner', 'black');
    document.documentElement.style.setProperty('--bannerText', 'white');
} else {
    game = cuphead
    gameID = 'cuphead'
    const cupheadWeapons = document.querySelectorAll('.cupheadWeapons')
    cupheadWeapons.forEach(elem => {
        elem.style.display = ''
    })
    const fullorIL = document.getElementById('fullorIL')
    fullorIL.style.display = ''
}
const gameLogo = document.getElementById('game-logo')
gameLogo.src = `images/${gameID}.png`
const favicon = document.getElementById('favicon')
favicon.href = `images/favicon_${gameID}.png`
let processedCategories = 0