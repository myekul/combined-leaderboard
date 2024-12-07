const rootStyles = getComputedStyle(document.documentElement)
let playerNames = new Set()
let players = []
let categories

let fullgameILsCategory
let modalIndex = 0
let globalPlayerIndex = -1

let mode = 'fullgame'

let cupheadVersion = 'currentPatch'
let levelDifficulty = 'regular'
let DLCnoDLC = 'nodlc'
let anyHighest = 'any'

let processedCategories = 0
let sortCategoryIndex = -1
let displayBoolean = []

let extraCategory = {}
let countries = {}
let globalCountryName

// Modes

// Big 5
let allILs = true
let groundPlane
let difficultyILs = false
let bossILindex = -1
let isleIndex = -1

let stopLeaderboards = false
let showMore = false
let options = false
let ILcategories = false
let firstTime = true
let WRmode = false
let showModal = false
let isolated = false
let displayNumRuns = false
let showGameSelect = false

const hash = window.location.hash
let page = hash ? hash.slice(1) : 'leaderboard'
const url = new URL(window.location.href);
const params = new URLSearchParams(window.location.search);
let gameParam = params.get('game');
if (!gameParam) {
    gameParam = 'cuphead'
    url.searchParams.set('game', gameParam);
    window.history.pushState({}, '', url);
}
const gameID = gameParam;
let modeParam = params.get('mode')
if (!modeParam) {
    if (gameID == 'titanfall_2') {
        setMode('levels')
    } else {
        setMode('fullgame')
    }
} else if (['fullgame', 'levels', 'fullgameILs'].includes(modeParam)) {
    setMode(modeParam)
}
const SHEET_ID = gameID == 'cuphead' ? '14l1hkW337uiyCRkNz61MNq99AEoidZdqaQUIpH5FlGU' : '1ZBxkZEsfwDsUpyire4Xb16er36Covk7nhR8BN_LPodI'
if (gameID == 'tetris') {
    url.searchParams.delete('mode');
    window.history.pushState({}, '', url);
    mode = 'fullgame'
    categories = tetris
    gapi.load("client", loadClient);
}
if (gameID == 'titanfall_2') {
    url.searchParams.delete('mode');
    window.history.pushState({}, '', url);
    mode = 'levels'
}
// Stylization
document.addEventListener('DOMContentLoaded', function () {
    gameTabs()
    document.getElementById('bodyContent').style.display = ''
})
function gameTabs() {
    let HTMLContent = ''
    const games = ['cuphead', 'sm64', 'tetris', 'titanfall_2']
    games.forEach(game => {
        HTMLContent += `<a href='?game=${game}' class="container clickable ${game}"><img src="images/logo/${game}.png"></a>`
    })
    document.getElementById('gameSelect').innerHTML = HTMLContent
}
document.getElementById('gameLogo').src = `images/logo/${gameID}.png`
document.getElementById('gameLogoButton').src = `images/logo/${gameID}.png`
document.getElementById('gameIcon1').src = `images/favicon/${gameID}.png`
document.getElementById('gameIcon2').src = `images/favicon/${gameID}.png`
const title = document.querySelector('title')
if (gameID == 'cuphead') {
    // const cupheadWeapons = document.querySelectorAll('.cupheadWeapons')
    // cupheadWeapons.forEach(elem => {
    //     elem.style.display = ''
    // })
    document.documentElement.style.setProperty('--banner', 'var(--cuphead-yellow)');
    document.getElementById('fullgameILsButton').style.display = ''
    document.getElementById('modeSelection').style.display = ''
} else if (gameID == 'sm64') {
    gameLogo.style.width = '350px'
    title.innerText = 'SM64 Leaderboard'
    document.getElementById('modeSelection').style.display = ''
    document.documentElement.style.setProperty('--banner', 'royalblue');
    document.documentElement.style.setProperty('--bannerText', 'white');
} else if (gameID == 'tetris') {
    gameLogo.style.height = '80px'
    const subtitle = document.getElementById('subtitle')
    subtitle.innerText = 'PACE ACADEMY'
    subtitle.style.padding = '8px 0'
    title.innerText = 'Tetris Pace Academy'
    const header = document.querySelector('header')
    header.style.height = '140px'
    document.getElementById('optionsButton').style.display = 'none'
    document.getElementById('mapButton').style.display = 'none'
    const github = document.getElementById('github')
    github.style.filter = 'brightness(0) invert(1)'
    document.documentElement.style.setProperty('--font', 'pressStart2P');
    document.documentElement.style.setProperty('--font2', 'pressStart2P');
    document.documentElement.style.setProperty('--banner', 'black');
    document.documentElement.style.setProperty('--bannerText', 'white');
} else if (gameID == 'titanfall_2') {
    title.innerText = 'Titanfall 2 Leaderboard'
    document.documentElement.style.setProperty('--banner', 'cadetblue');
    document.documentElement.style.setProperty('--bannerText', 'azure');
}
document.getElementById('favicon').href = `images/favicon/${gameID}.png`
const grades = [
    { grade: 'A+', className: 'grade-a-plus', threshold: 97 },
    { grade: 'A', className: 'grade-a', threshold: 93 },
    { grade: 'A-', className: 'grade-a-minus', threshold: 90 },
    { grade: 'B+', className: 'grade-b-plus', threshold: 87 },
    { grade: 'B', className: 'grade-b', threshold: 83 },
    { grade: 'B-', className: 'grade-b-minus', threshold: 80 },
    { grade: 'C+', className: 'grade-c-plus', threshold: 77 },
    { grade: 'C', className: 'grade-c', threshold: 73 },
    { grade: 'C-', className: 'grade-c-minus', threshold: 70 },
    { grade: 'D+', className: 'grade-d-plus', threshold: 67 },
    { grade: 'D', className: 'grade-d', threshold: 63 },
    { grade: 'D-', className: 'grade-d-minus', threshold: 60 },
    { grade: 'F', className: 'grade-f', threshold: 0 }
];
const dummy = document.getElementById('dummy')
grades.forEach(grade => {
    dummy.innerHTML += `<div class=${grade.className}></div>`
})