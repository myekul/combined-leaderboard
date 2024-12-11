const rootStyles = getComputedStyle(document.documentElement)
let playerNames = new Set()
let players = []
let categories = []

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

// Big 5
let allILs = true
let groundPlane
let difficultyILs = false
let bossILindex = -1
let isleIndex = -1

// Modes

let stopLeaderboards = false
let showMore = false
let options = false
let ILcategories = false
let basegameILs = false
let firstTime = true
let WRmode = false
let showModal = false
let isolated = false
let displayNumRuns = false
let milliseconds = false
let showGameSelect = false

const categorySet = {
    'cuphead': cuphead,
    'sm64': sm64,
    'smb1': smb1,
    'smb2': smb2,
    'smb3': smb3
}

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
if (['fullgame', 'levels', 'fullgameILs'].includes(modeParam)) {
    setMode(modeParam)
} else {
    setMode('fullgame')
}
const SHEET_ID = gameID == 'cuphead' ? '14l1hkW337uiyCRkNz61MNq99AEoidZdqaQUIpH5FlGU' : '1ZBxkZEsfwDsUpyire4Xb16er36Covk7nhR8BN_LPodI'
if (['tetris', 'smb1'].includes(gameID)) {
    setMode('fullgame')
    url.searchParams.delete('mode');
    window.history.pushState({}, '', url);
}
if (gameID == 'titanfall_2') {
    setMode('levels')
    url.searchParams.delete('mode');
    window.history.pushState({}, '', url);
}
// Stylization
document.addEventListener('DOMContentLoaded', function () {
    gameTabs()
    document.getElementById('bodyContent').style.display = ''
})
function gameTabs() {
    let HTMLContent = ''
    const games = ['cuphead', 'sm64', 'tetris', 'titanfall_2', 'smb1', 'smb2', 'smb3']
    games.forEach(game => {
        HTMLContent += `<a href='?game=${game}' class="container clickable ${game}"><img src="images/logo/${game}.png"></a>`
    })
    document.getElementById('gameSelect').innerHTML = HTMLContent
}
const gameLogo = document.getElementById('gameLogo')
gameLogo.src = `images/logo/${gameID}.png`
document.getElementById('gameLogoButton').src = `images/logo/${gameID}.png`
const subtitle = document.getElementById('subtitle')
const header = document.querySelector('header')
document.getElementById('gameIcon1').src = `images/favicon/${gameID}.png`
document.getElementById('gameIcon2').src = `images/favicon/${gameID}.png`
const title = document.querySelector('title')
if (gameID == 'cuphead') {
    document.documentElement.style.setProperty('--banner', 'var(--cuphead-yellow)');
    document.getElementById('fullgameILsButton').style.display = ''
    document.getElementById('modeSelection').style.display = ''
} else if (gameID == 'sm64') {
    title.innerText = 'SM64 Leaderboard'
    document.getElementById('modeSelection').style.display = ''
    document.documentElement.style.setProperty('--banner', 'royalblue');
    document.documentElement.style.setProperty('--bannerText', 'white');
} else if (gameID == 'tetris') {
    subtitle.innerText = 'PACE ACADEMY'
    title.innerText = 'Tetris Pace Academy'
    document.getElementById('optionsButton').style.display = 'none'
    document.getElementById('mapButton').style.display = 'none'
    const github = document.getElementById('github')
    github.style.filter = 'brightness(0) invert(1)'
    document.documentElement.style.setProperty('--banner', 'black');
    document.documentElement.style.setProperty('--bannerText', 'white');
} else if (gameID == 'titanfall_2') {
    title.innerText = 'Titanfall 2 Leaderboard'
    document.documentElement.style.setProperty('--banner', 'cadetblue');
    document.documentElement.style.setProperty('--bannerText', 'azure');
} else if (gameID == 'smb1') {
    title.innerText = 'SMB Leaderboard'
    // gameLogo.src = 'Super Mario Bros.'
    document.documentElement.style.setProperty('--banner', 'mediumslateblue');
    document.documentElement.style.setProperty('--bannerText', 'white');
    document.getElementById('checkbox_milliseconds').checked = true
} else if (gameID == 'smb2') {
    title.innerText = 'SMB2 Leaderboard'
    document.documentElement.style.setProperty('--banner', 'cornflowerblue');
    document.documentElement.style.setProperty('--bannerText', 'white');
} else if (gameID == 'smb3') {
    title.innerText = 'SMB3 Leaderboard'
    document.documentElement.style.setProperty('--banner', 'yellow');
    document.documentElement.style.setProperty('--bannerText', 'black');
}
if (['tetris', 'smb1', 'smb2', 'smb3'].includes(gameID)) {
    document.documentElement.style.setProperty('--font', 'pressStart2P');
    document.documentElement.style.setProperty('--font2', 'pressStart2P');
    if (['smb2', 'smb3'].includes(gameID)) {
        gameLogo.src = ''
        const gameTitle = document.getElementById('gameTitle')
        gameTitle.innerText = 'SUPER MARIO BROS. ' + gameID.slice(-1)
        if (gameID == 'smb2') {
            gameTitle.style.color = 'gold'
            gameTitle.style.textShadow = '-3px 3px 0px red'
        }else{
            gameTitle.style.color = 'royalblue'
            gameTitle.style.textShadow = '-2px 2px 0px red'
        }
        subtitle.style.padding = '3px 0'
    } else {
        gameLogo.style.height = '80px'
        header.style.height = '140px'
        subtitle.style.padding = '8px 0'
    }
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