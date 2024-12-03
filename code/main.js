google.charts.load('current', { packages: ['corechart'] });
refreshLeaderboard()
function getFullGame() {
    setMode('fullgame')
    disableLevelModes()
    hideTabs()
    sortCategoryIndex = -1
    categories = gameID == 'cuphead' ? cuphead : sm64
    resetLoad()
    categories.forEach(category => {
        let variables = `?var-${category.var}=${category.subcat}`
        if (category.var2) {
            variables += `&var-${category.var2}=${category.subcat2}`
        }
        getLeaderboard(category, `category/${category.id}`, variables)
    })
}
function getLevels() {
    if (gameID == 'cuphead' && mode != 'levels') {
        allILs = true
    }
    setMode('levels')
    hideTabs()
    if (gameID == 'cuphead') {
        cupheadLevelSetting()
    } else {
        getSM64levels()
    }
}
function getFullgameILs(categoryName) {
    setMode('fullgameILs')
    disableLevelModes()
    hideTabs()
    sortCategoryIndex = -1
    categoryName = categoryName != null ? categoryName : '1.1+'
    fullgameILsCategory = fullgameILs[categoryName]
    categories = [fullgameILsCategory]
    buttonClick('fullgameILs_' + fullgameILsCategory.className, 'fullgameILsVersionTabs', 'active')
    resetLoad()
    players = []
    playerNames = new Set()
    let category = cuphead[fullgameILsCategory.index]
    let variables = `?var-${category.var}=${category.subcat}`
    if (category.var2) {
        variables += `&var-${category.var2}=${category.subcat2}`
    }
    getLeaderboard(category, `category/${category.id}`, variables, true)
}
function enableWRMode() {
    categories.forEach(category => {
        newRuns = []
        category.runs.forEach((run, runIndex) => {
            if (run.place < 4) {
                newRuns.push(run)
            } else {
                category.runs = category.runs.slice(0, runIndex)
            }
        })
    })
    WRmode = true
    const newPlayers = []
    players.forEach(player => {
        const newRuns = []
        player.numWRs = 0
        player.runs.forEach(run => {
            if (run) {
                if (run.place < 4) {
                    player.numWRs++
                    newRuns.push(run)
                } else {
                    newRuns.push(null)
                }
            } else {
                newRuns.push(null)
            }
        })
        if (player.numWRs > 0) {
            player.runs = newRuns
            newPlayers.push(player)
        }
    })
    players = newPlayers
    prepareData()
}
function getSM64levels() {
    fetch('resources/sm64Levels.json')
        .then(response => response.json())
        .then(data => {
            categories = data
            resetLoad()
            const variable = `?var-${platform.var}=${platform.subcat}`
            categories.forEach((category, categoryIndex) => {
                category.info = sm64LevelIDs[categoryIndex]
                getLeaderboard(category, `level/${category.id}/${stageRTA.id}`, variable)
            })
        })
}
function getPlayers(category) {
    category.players.forEach(player => {
        addPlayer(player)
    })
}
function addPlayer(player) {
    const initialSize = playerNames.size
    playerNames.add(player.name)
    if (playerNames.size > initialSize) {
        player.runs = new Array(categories.length).fill(null)
        players.push(player)
    }
}
function load() {
    processedCategories++
    document.getElementById('loadingProgress').value = processedCategories
    const loadingText = document.getElementById('loadingText')
    if (processedCategories <= categories.length) {
        loadingText.innerText = processedCategories + '/' + categories.length
    }
    // if (processedCategories > categories.length) {
    //     loadingText.innerHTML = 'An error has occurred. Please reload the page.'
    // }
}
function prepareData() {
    categories.forEach((category, categoryIndex) => {
        assignRuns(category, categoryIndex)
    })
    if (mode == 'fullgameILs') {
        assignRuns(extraCategory)
        players.forEach((player, playerIndex) => {
            player.averagePercentage = -playerIndex
            player.rank = playerIndex + 1
        })
    } else {
        generateRanks()
        sortCategoryIndex = -1
        sortPlayers(players)
        players.forEach((player, playerIndex) => {
            player.rank = playerIndex + 1
        })
    }
    const tabs = document.querySelectorAll('.tabs')
    tabs.forEach(elem => {
        elem.style.display = ''
    })
    document.getElementById('loading').style.display = 'none'
    // if (bossILindex > -1) {
    //     ILcategoriesOn()
    // }
    showTab(page)
}
function assignRuns(category, categoryIndex) {
    category.runs.forEach(run => {
        const runPlayer = run.player
        let thePlayer = ''
        for (const player of players) {
            if (player.id && runPlayer.id) {
                if (player.id == runPlayer.id) {
                    thePlayer = player;
                    break;
                }
            } else if (player.name == runPlayer.name && player.rel == runPlayer.rel) {
                thePlayer = player;
                break;
            } else if (player.name == runPlayer.name) {
                thePlayer = player;
                break;
            }
        }
        if (categoryIndex != null) {
            thePlayer.runs ? thePlayer.runs[categoryIndex] = run : ''
        } else {
            thePlayer.extra = run
        }
        const worldRecord = getWorldRecord(category)
        const runTime = run.score
        const percentage = getScore(category, worldRecord, runTime)
        run.percentage = percentage
        run.playerName = thePlayer.name
    })
}
function generateRanks() {
    players.forEach(player => {
        // let placeSum = 0
        player.percentageSum = 0
        player.truePercentageSum = 0
        player.runs.forEach((run, runIndex) => {
            if (run) {
                // placeSum += parseInt(run.place)
                let category = categories[runIndex]
                player.percentageSum += (run.percentage) * (1 / categories.length)
                player.truePercentageSum += run.percentage
                // NMG run in place of a 1.1 run
                if (gameID == 'cuphead') {
                    if (category.name == 'NMG' || category.name == 'Full Clear NMG') {
                        let runCopy = { ...run }
                        runCopy.place = '-'
                        const onePointOne = categories[0]
                        const onePointOneRun = player.runs[0]
                        const onePointOneWR = getWorldRecord(onePointOne)
                        runCopy.percentage = onePointOneWR / run.score
                        if (!onePointOneRun) {
                            player.runs[0] = runCopy
                            player.percentageSum += runCopy.percentage * (1 / categories.length)
                        } else if (player.runs[0].score > run.score) {
                            player.runs[0] = runCopy
                            player.percentageSum -= (onePointOneWR / onePointOneRun.score) * (1 / categories.length)
                            player.percentageSum += runCopy.percentage * (1 / categories.length)
                        }
                    } else if (mode == 'levels' && (bossILindex > -1 || allILs || difficultyILs || groundPlane || isleIndex > -1) && runIndex % 2 == 1 && !WRmode) {
                        let runCopy = { ...run }
                        runCopy.place = '-'
                        const anyIndex = runIndex - 1
                        const any = categories[anyIndex]
                        const anyRun = player.runs[anyIndex]
                        const anyWR = getWorldRecord(any)
                        runCopy.percentage = anyWR / run.score
                        if (!anyRun) {
                            player.runs[anyIndex] = runCopy
                            player.percentageSum += runCopy.percentage * (1 / categories.length)
                        } else if (player.runs[anyIndex].score > run.score) {
                            player.runs[anyIndex] = runCopy
                            player.percentageSum -= (anyWR / anyRun.score) * (1 / categories.length)
                            player.percentageSum += runCopy.percentage * (1 / categories.length)
                        }
                    }
                }
            }
        })
        let totalWeight = 0
        player.runs.forEach(run => {
            run ? totalWeight += (1 / categories.length) : ''
        })
        // player.averageRank = placeSum / player.runs.length
        player.averagePercentage = player.percentageSum / totalWeight
        player.explanation = ''
        applyPenalties(player)
    })
}
function organizePlayers(categoryIndex) {
    sortCategoryIndex = categoryIndex
    sortPlayers(players)
    action()
}
function sortPlayers(playersArray) {
    if (sortCategoryIndex == -1) {
        let criteria = 'averagePercentage'
        if (mode == 'fullgameILs') {
            criteria == 'rank'
        }
        playersArray.sort((a, b) => {
            return b[criteria] - a[criteria];
        });
    } else {
        const isReverse = reverseScore.includes(categories[sortCategoryIndex].name);
        playersArray.sort((a, b) => {
            const aRun = a.runs[sortCategoryIndex];
            const bRun = b.runs[sortCategoryIndex];
            if (aRun && bRun) {
                const timeDiff = aRun.score - bRun.score;
                if (timeDiff != 0) {
                    return isReverse ? -timeDiff : timeDiff;
                }
                const aDate = new Date(aRun.date);
                const bDate = new Date(bRun.date);
                return isReverse ? bDate - aDate : aDate - bDate;
            }
            if (aRun) return -1;
            if (bRun) return 1;
            return 0;
        });
    }
}
function refreshLeaderboard() {
    sortCategoryIndex = -1
    if (gameID != 'tetris') {
        if (mode == 'fullgame') {
            getFullGame()
        } else if (mode == 'levels') {
            getLevels()
        } else if (mode == 'fullgameILs') {
            getFullgameILs()
        }
    }
}
function resetLoad() {
    processedCategories = 0
    playerNames = new Set()
    players = []
    stopLeaderboards = false
    document.querySelectorAll('.hide').forEach(elem => {
        elem.style.display = 'none'
    })
    if (gameID == 'cuphead') {
        if (mode == 'levels') {
            document.getElementById('ILsSection').style.display = ''
        }
        if (mode == 'fullgameILs') {
            document.getElementById('fullgameILsSection').style.display = ''
        }
    }
    document.getElementById('loading').style.display = ''
    const progress = document.getElementById('loadingProgress')
    progress.value = 0
    progress.max = categories.length
    const loadingText = document.getElementById('loadingText')
    if (mode == 'fullgameILs' || allILs || difficultyILs || groundPlane || isleIndex > -1) {
        loadingText.innerText = ''
    } else {
        loadingText.innerText = '0/' + categories.length
    }
}
function hideTabs() {
    const tabs = document.querySelectorAll('.tabs')
    tabs.forEach(elem => {
        elem.style.display = 'none'
    })
}
function resetAndGo() {
    players = []
    playerNames = new Set()
    categories.forEach(category => {
        getPlayers(category)
    })
    prepareData()
}