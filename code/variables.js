const API_KEY = 'AIzaSyDg6FBho-vfAm67-UdGP-8IbVFdLV23unY'
const MYEKUL_SHEET_ID = '14l1hkW337uiyCRkNz61MNq99AEoidZdqaQUIpH5FlGU'
const rootStyles = getComputedStyle(document.documentElement)

const mausoleumID = 1481199742
const runNguns = {
    forestfollies: 1464969490,
    treetoptrouble: 1464969491,
    funhousefrazzle: 1496818712,
    funfairfever: 1499704951,
    perilouspiers: 1464969492,
    ruggedridge: 1464969493
}

let playerNames = new Set()
let players = []
let categories = []

let commBestILsCategory
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

let modalSliders = false
let modalPercentages = []
let tooltipStyle
let WRsTab = 'players'
let fullgameCategory
let sm64ILsSection
let meleeSRC = false
let extraCategory = {}
let gapiClientLoaded = false
let spotlightPlayerIndex
let spotlightFlag

let countries = {}
let globalCountryName

const myekulSheets = {}
const markinSheets = {}
let globalCache
let runRecap_savFile
let runRecap_lssFile = {}
let runRecap_markin
let runRecapView = 'home'
let runRecapElem = 'sav'
let runRecapPlayerName
let runRecapTime
let runRecapTab = 'times'
let runRecapExample = false
let splitInfo = {}

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
let showFullgameCategories = false
let ILcategories = false
let basegameILs = false
let firstTime = true
let firstTimeFull = true
let showModal = false
let isolated = false
let displayNumRuns = false
let milliseconds = false
let showGameSelect = false
let categorySet
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
]
grades.forEach(grade => {
    grade.className += ' grade'
})
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const seasons = [
    { name: 'Spring', color: 'mediumorchid' },
    { name: 'Summer', color: 'limegreen' },
    { name: 'Fall', color: 'orange' },
    { name: 'Winter', color: 'cornflowerblue' }
]