const API_KEY = 'AIzaSyDg6FBho-vfAm67-UdGP-8IbVFdLV23unY'
const rootStyles = getComputedStyle(document.documentElement)
let playerNames = new Set()
let players = []
let categories = []

let commBestILsCategory = commBestILs['1.1+']
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
let extraCategory = {}

let countries = {}
let globalCountryName

let runRecapFile
let runRecapPlayerName
let runRecapTime = 'XX:XX'
let runRecapTab = 'times'

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
let showModal = false
let isolated = false
let displayNumRuns = false
let milliseconds = false
let showGameSelect = false

const categorySet = {
    'cuphead': cuphead['main'],
    'smb1': smb1,
    'smbtll': smbtll,
    'smb2': smb2,
    'smb3': smb3,
    'nsmbds': nsmbds,
    'nsmbw': nsmbw,
    'nsmbu': nsmbu,
    'nslu': nslu,
    'sm64': sm64,
    'sms': sms,
    'smo': smo
}
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
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const seasons = [
    { name: 'Spring', color: 'mediumorchid' },
    { name: 'Summer', color: 'limegreen' },
    { name: 'Fall', color: 'orange' },
    { name: 'Winter', color: 'cornflowerblue' }
]