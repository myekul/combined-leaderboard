function getPlayers(category) {
    category.players.forEach(player => {
        addPlayer(player)
    })
}
function addPlayer(player) {
    const initialSize = playerNames.size
    playerNames.add(player.name)
    if (playerNames.size > initialSize && !(!['tetris', 'ssbm'].includes(gameID) && !player.id)) {
        const playerCopy = { ...player }
        playerCopy.runs = new Array(categories.length).fill(0)
        players.push(playerCopy)
        return true
    }
}
function load() {
    processedCategories++
    document.getElementById('progress-bar').style.width = processedCategories / categories.length * 100 + '%'
    // const loadingText = document.getElementById('loadingText')
    // if (processedCategories <= categories.length) {
    //     loadingText.innerText = processedCategories + '/' + categories.length
    // }
    // if (processedCategories > categories.length) {
    //     loadingText.innerHTML = 'An error has occurred. Please reload the page.'
    // }
}
function prepareData() {
    completeLoad()
    categories.forEach((category, categoryIndex) => {
        assignRuns(category, categoryIndex)
    })
    if (gameID == 'mtpo') {
        const dummyRuns = []
        players.forEach(player => {
            const dummyRun = { score: 42, percentage: 100, place: 1, playerName: player.name }
            player.runs = [dummyRun, ...player.runs]
            dummyRuns.push(dummyRun)
        })
        categories = [{ name: 'Glass Joe', info: { id: 'glassjoe' }, players: players, runs: dummyRuns }, ...categories]
    }
    generateRanks()
    sortCategoryIndex = -1
    if (!(gameID == 'ssbm' && !ssbVar)) sortPlayers(players)
    players.forEach((player, playerIndex) => {
        player.rank = playerIndex + 1
    })
    // hide('loading')
    showTab(globalTab)
    if (mode == 'fullgame' && spotlightFlag) {
        generateSpotlightPlayer()
        generateROTDrun()
        show('spotlight')
    } else {
        hide('spotlight')
    }
    if (mode == 'fullgame' && firstTimeFull) {
        show('refreshDiv')
    } else {
        hide('refreshDiv')
    }
    const username = localStorage.getItem('username')
    if (username) {
        document.getElementById('input_username').value = username
        document.getElementById('username').innerHTML = runRecapPlayer()
    }
    show('username')
}
function assignRuns(category, categoryIndex) {
    category.runs.forEach((run, runIndex) => {
        if (runIndex == 0) {
            run.first = true
            if (category.runs[runIndex + 1]?.place > 1 || category.runs.length == 1) {
                run.untied = true
            }
        }
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
        const runTime = run.score
        run.percentage = getScore(category, runTime)
        if (thePlayer.bestScore) {
            if (run.percentage > thePlayer.bestScore) {
                thePlayer.bestScore = run.percentage
            }
        } else {
            thePlayer.bestScore = run.percentage
        }
        run.playerName = thePlayer ? thePlayer.name : null
    })
}
function generateRanks() {
    const threshold = 80
    players.forEach(player => {
        player.truePercentages = new Array(categories.length).fill(0)
        const ideal = player.bestScore > threshold ? (threshold + player.bestScore) / 2 : player.bestScore
        player.percentageSum = 0
        const missingRuns = []
        player.runs.forEach((run, runIndex) => {
            const category = categories[runIndex]
            if (run) {
                const newScore = goodRunCheck(run, ideal)
                player.percentageSum += newScore
                player.truePercentages[runIndex] = newScore
            } else {
                // NMG run in place of a 1.1 run
                if ((category.name == '1.1+') && player.runs[2]) {
                    placeholderRun(player, ideal, 2, 0)
                    // } else if (player.runs[0].score > run.score) {
                    //     player.runs[0] = runCopy
                    //     const oldScore = getScore(onePointOne, onePointOneRun.score)
                    //     const newOldScore = oldScore >= threshold || !good ? oldScore : ideal
                    //     player.percentageSum -= newOldScore
                    //     player.percentageSum += newScore
                } else if (mode == 'levels' && big5() && runIndex % 2 == 0 && (player.runs[runIndex + 1])) {
                    placeholderRun(player, ideal, runIndex + 1, runIndex)
                } else {
                    missingRuns.push(runIndex)
                }
            }
        })
        missingRuns.forEach(runIndex => {
            player.percentageSum += ideal
            player.truePercentages[runIndex] = ideal
        })
        player.score = player.percentageSum / categories.length
    })
}
function goodRunCheck(run, ideal) {
    return run.percentage >= ideal ? run.percentage : ideal
}
function placeholderRun(player, ideal, copyIndex, pasteIndex) {
    const runCopy = { ...player.runs[copyIndex] }
    runCopy.percentage = getScore(categories[pasteIndex], runCopy.score)
    runCopy.place = runCopy.percentage >= 100 ? 1 : '-'
    runCopy.first = false
    runCopy.untied = false
    const newScore = goodRunCheck(runCopy, ideal)
    player.runs[pasteIndex] = runCopy
    player.percentageSum += newScore
    player.truePercentages[pasteIndex] = newScore
}
function organizePlayers(categoryIndex, shh) {
    if (categoryIndex > categories.length - 1 || categoryIndex < 0) {
        playSound('locked')
    } else {
        if (!shh) playSound('equip_move')
        sortCategoryIndex = categoryIndex
        sortPlayers(players)
        action()
    }
}
function sortPlayers(playersArray, customCategoryIndex) {
    const categoryIndex = customCategoryIndex != null ? customCategoryIndex : sortCategoryIndex
    if (categoryIndex == -1) {
        if (gameID == 'ssbm' && !ssbVar) {
            players.sort((a, b) => {
                if (!a.sum && !b.sum) return 0;
                if (!a.sum) return 1;
                if (!b.sum) return -1;
                return convertToSeconds(a.sum) - convertToSeconds(b.sum);
            });
        } else {
            let criteria = 'score'
            playersArray.sort((a, b) => {
                return b[criteria] - a[criteria];
            });
        }
    } else {
        const isReverse = categories[categoryIndex].reverse
        playersArray.sort((a, b) => {
            const aRun = a.runs[categoryIndex];
            const bRun = b.runs[categoryIndex];
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
    if (gameID == 'tetris') {
        categories = tetris['main']
        fetchAllData()
    } else if (mode == 'fullgame' && !categorySet) {
        generateCategories(gameID)
    } else {
        if (mode == 'fullgame') {
            getFullgame()
        } else if (mode == 'levels') {
            getLevels()
        }
    }
}
function resetLoad() {
    processedCategories = 0
    playerNames = new Set()
    players = []
    stopLeaderboards = false
    document.getElementById('boardTitleSrc').innerHTML = `<div class='loader'></div>`
    document.getElementById('progress-bar').style.width = 0;
    // show('loading')
}
function completeLoad() {
    document.getElementById('progress-bar').style.width = '100%';
}
function resetAndGo() {
    players = []
    playerNames = new Set()
    categories.forEach(category => {
        getPlayers(category)
    })
    prepareData()
}
function cachedCategories() {
    categories = globalCache
    resetAndGo()
    firebaseReadSuccess()
}
function firebaseReadSuccess() {
    completeLoad()
    const boardTitleSrc = document.getElementById('boardTitleSrc')
    boardTitleSrc.innerHTML = sharedAssetsImg('firebase')
}