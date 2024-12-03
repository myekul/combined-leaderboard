const rootStyles = getComputedStyle(document.documentElement)
let playerNames = new Set()
let players = []
let categories
let levelCategories
let fullgameILsCategory
let modalIndex = 0
let globalPlayerIndex = -1
let mode = 'fullgame'
let cupheadVersion = 'currentPatch'
let levelDifficulty = 'regular'
let DLCnoDLC = 'nodlc'
let anyHighest = 'any'
let options = false
let ILcategories = false
let processedCategories = 0
let showMore = false
let sortCategoryIndex = -1
let bossILindex = -1
let isleIndex = -1
let displayBoolean = []
let stopLeaderboards = false
let allILs = true
let groundPlane
let difficultyILs = false
let firstTime = true
let WRmode = false
let showModal = false
let extraCategory = {}
let countries = {}
let globalCountryName
let isolated = false
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
let modeParam = params.get('mode')
if (!modeParam) {
    setMode('fullgame')
} else if (['fullgame', 'levels', 'fullgameILs'].includes(modeParam)) {
    setMode(modeParam)
}
const gameID = gameParam;
const SHEET_ID = gameID == 'cuphead' ? '14l1hkW337uiyCRkNz61MNq99AEoidZdqaQUIpH5FlGU' : '1ZBxkZEsfwDsUpyire4Xb16er36Covk7nhR8BN_LPodI'
if (gameID == 'tetris') {
    url.searchParams.delete('mode');
    window.history.pushState({}, '', url);
    mode = 'fullgame'
    categories = tetris
    gapi.load("client", loadClient);
}
// Stylization
const gameLogo = document.getElementById('game-logo')
gameLogo.src = `images/${gameID}.png`
const title = document.querySelector('title')
if (gameID == 'sm64') {
    gameLogo.style.width = '350px'
    title.innerText = 'SM64 Leaderboard'
    document.getElementById('modeSelection').style.display = ''
    // document.documentElement.style.setProperty('--background', 'navy');
    // document.documentElement.style.setProperty('--otherColor', 'darkblue');
    // document.documentElement.style.setProperty('--gray', 'slateblue');
} else if (gameID == 'tetris') {
    gameLogo.style.width = '250px'
    const subtitle = document.getElementById('subtitle')
    subtitle.innerText = 'PACE ACADEMY'
    subtitle.style.paddingTop = '10px'
    title.innerText = 'Pace Academy'
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
} else {
    // const cupheadWeapons = document.querySelectorAll('.cupheadWeapons')
    // cupheadWeapons.forEach(elem => {
    //     elem.style.display = ''
    // })
    document.getElementById('fullgameILsButton').style.display = ''
    document.getElementById('modeSelection').style.display = ''
}
document.getElementById('favicon').href = `images/favicon_${gameID}.png`
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