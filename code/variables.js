let playerNames = new Set()
let players = []
let categories = []

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
let leaderboardsTab = 'leaderboards'
let fullgameCategory
let sm64ILsSection
let extraCategory = {}
let spotlightPlayerIndex
let spotlightFlag
let aMinusPlayers
let aPlusRuns
let numModalPages = 3

let countries = {}
let globalCountryName

let globalCache

// Big 5
let allILs = true
let groundPlane
let difficultyILs = false
let bossILindex = -1
let isleIndex = -1

let stopLeaderboards = false
let showMore = false
let options = false
let showFullgameCategories = false
let ILcategories = false
let basegameILs = false
let firstTime = true
let firstTimeFull = true
let showModal = false
let displayNumRuns = false
let milliseconds = false
let categorySet

let topPlayerHistories = []

let num_recent = 15