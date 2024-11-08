let playerNames = new Set()
let players = []
let categories
let fullgameCategoryIndex = 0
let levelCategoryIndex = 0
let fullgame = true
let charts = false
let ILchange = false
let levels = []
let countries = {}
let cupheadVersion = 'currentPatch'
let levelDifficulty = 'regular'
let DLCnoDLC = 0
let highestGrade = 0
let processedCategories = 0
const hash = window.location.hash
const gameID = hash ? hash.slice(1) : 'cuphead';
if (gameID == 'cuphead') {
    categories = cuphead
    levels = JSON.parse(cupheadLevels)
} else if (gameID == 'sm64') {
    categories = sm64
    levels = JSON.parse(sm64Levels)
} else if (gameID == 'tetris') {
    categories = tetris
    gapi.load("client", loadClient);
}
levels.forEach((level, levelIndex) => {
    if (gameID == 'cuphead') {
        level.info = bosses[levelIndex]
    } else if (gameID == 'sm64') {
        level.info = sm64LevelIDs[levelIndex]
    }
})
// Stylization
const gameLogo = document.getElementById('game-logo')
const title = document.querySelector('title')
if (gameID == 'sm64') {
    gameLogo.style.width = '450px'
    const body = document.querySelector('body')
    body.style.backgroundColor = 'navy'
    title.innerText = 'SM64 Leaderboard'
    const fullorIL = document.getElementById('fullorIL')
    fullorIL.style.display = ''
    document.documentElement.style.setProperty('--background', 'navy');
    document.documentElement.style.setProperty('--otherColor', 'darkblue');
    document.documentElement.style.setProperty('--gray', 'slateblue');
} else if (gameID == 'tetris') {
    gameLogo.style.width = '250px'
    const subtitle = document.getElementById('subtitle')
    subtitle.innerText = 'PACE ACADEMY'
    subtitle.style.paddingTop = '5px'
    title.innerText = 'Pace Academy'
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
    const cupheadWeapons = document.querySelectorAll('.cupheadWeapons')
    cupheadWeapons.forEach(elem => {
        elem.style.display = ''
    })
    const fullorIL = document.getElementById('fullorIL')
    fullorIL.style.display = ''
}
gameLogo.src = `images/${gameID}.png`
document.getElementById('favicon').href = `images/favicon_${gameID}.png`