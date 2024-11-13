let playerNames = new Set()
let players = []
let categories
let fullgameCategoryIndex = 0
let levelCategoryIndex = 0
let modalIndex = 0
let globalPlayerIndex = 0
let fullgame = true
let ILchange = false
let levels = []
let countries = {}
let cupheadVersion = 'currentPatch'
let levelDifficulty = 'regular'
let DLCnoDLC = 0
let highestGrade = 0
let displayOptions = false
let processedCategories = 0
let allRuns = false
let player = true
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
    fullgame = true
    url.searchParams.set('mode', 'fullgame');
    window.history.pushState({}, '', url);
} else if (modeParam == 'levels') {
    fullgame = false
}
const gameID = gameParam;
if (gameID == 'cuphead') {
    levels = JSON.parse(cupheadLevels)
} else if (gameID == 'sm64') {
    levels = JSON.parse(sm64Levels)
} else if (gameID == 'tetris') {
    url.searchParams.delete('mode');
    window.history.pushState({}, '', url);
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
    gameLogo.style.width = '350px'
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
    subtitle.style.paddingTop = '10px'
    title.innerText = 'Pace Academy'
    const header = document.querySelector('header')
    header.style.height = '140px'
    const displayOptionsButton = document.getElementById('displayOptionsButton')
    displayOptionsButton.style.display = 'none'
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
    fullorIL = document.getElementById('fullorIL').style.display = ''
}
gameLogo.src = `images/${gameID}.png`
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
grades.forEach(grade => {
    const div = document.createElement('div')
    div.className = grade.className
    document.body.appendChild(div)
})