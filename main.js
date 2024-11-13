google.charts.load('current', { packages: ['corechart'] });
refreshLeaderboard()
function getFullGame() {
    fullgame = true
    url.searchParams.set('mode', 'fullgame');
    window.history.pushState({}, '', url);
    buttonClick('fullgameButton', 'ILbutton', 'active2')
    categories = gameID == 'cuphead' ? cuphead : sm64
    const ILsSection = document.getElementById('ILsSection')
    ILsSection.style.display = 'none'
    playerNames = new Set()
    players = []
    processedCategories = 0
    resetLoad()
    categories.forEach(category => {
        let variables = `?var-${category.var}=${category.subcat}`
        if (category.var2) {
            variables += `&var-${category.var2}=${category.subcat2}`
        }
        getLeaderboard(category, `category/${category.id}`, variables)
    })
}
function prepareLevelBoards(difficulty, version, categoryIndex, DLCorNot) {
    fullgame = false
    url.searchParams.set('mode', 'levels');
    window.history.pushState({}, '', url);
    buttonClick('ILbutton', 'fullgameButton', 'active2')
    processedCategories = 0
    if (gameID == 'cuphead') {
        if (typeof difficulty == 'string') {
            levelDifficulty = difficulty
            cupheadVersion = version
            highestGrade = categoryIndex
            DLCnoDLC = DLCorNot
        }
        const ILsSection = document.getElementById('ILsSection')
        ILsSection.style.display = ''
        const category = ILcats[DLCnoDLC + highestGrade]
        // let label = levelDifficulty.charAt(0).toUpperCase() + levelDifficulty.slice(1, levelDifficulty.length) + ' Any%'
        document.querySelectorAll('#versionTabs button,#categoryTabs button,#difficultyTabs button').forEach(button => {
            button.classList.remove('active')
        })
        const versionButton = cupheadVersion == 'currentPatch' ? document.getElementById('currentPatch') : document.getElementById('legacy')
        versionButton.classList.add('active')
        const categoryButton = DLCnoDLC == 0 ? document.getElementById('mainBoards') : document.getElementById('dlcBoards')
        categoryButton.classList.add('active')
        // if (!event.shiftKey) {
        // }
        let button = highestGrade == 0 ? document.getElementById(levelDifficulty + 'any') : document.getElementById(levelDifficulty + 'highest')
        // if (button.classList.contains('active')) {
        //     button.classList.remove('active')
        // } else {
        button.classList.add('active')
        // }
        // if (highestGrade == 1) {
        //     let highestGradeLabel = ''
        //     if (difficulty == 'simple') {
        //         highestGradeLabel = 'Simple B+'
        //     } else if (difficulty == 'regular') {
        //         highestGradeLabel = 'Regular A+'
        //     } else if (difficulty == 'expert') {
        //         highestGradeLabel = 'S-Rank'
        //     }
        //     label = highestGradeLabel
        // }
        // label += category.label
        // const boardTitle = document.getElementById('boardTitle')
        // boardTitle.innerHTML = label
        // if (DLCorNot == 0) {
        //     boardTitle.classList.add('cuphead')
        //     boardTitle.classList.remove('dlc')
        // } else {
        //     boardTitle.classList.add('dlc')
        //     boardTitle.classList.remove('cuphead')
        // }
        // if (event.shiftKey) {
        //     getAllLevels()
        // } else {
        getCupheadLevels(levelDifficulty, cupheadVersion, category.id)
    } else {
        getSM64levels()
    }
    // }
}
// function getAllLevels() {
//     game = []
//     const allButtons = document.querySelectorAll('.difficultyTabs button')
//     allButtons.forEach((button, index) => {
//         if (button.classList.contains('active')) {
//             switch (index) {
//                 case 0:
//                     getLevels(gameID, 'simple', 'currentPatch', ILcats[0 + DLCnoDLC].id, true);
//                     break;
//                 case 1:
//                     getLevels(gameID, 'simple', 'currentPatch', ILcats[1 + DLCnoDLC].id, true);
//                     break;
//                 case 2:
//                     getLevels(gameID, 'regular', 'currentPatch', ILcats[0 + DLCnoDLC].id, true);
//                     break;
//                 case 3:
//                     getLevels(gameID, 'regular', 'currentPatch', ILcats[1 + DLCnoDLC].id, true);
//                     break;
//                 case 4:
//                     getLevels(gameID, 'expert', 'currentPatch', ILcats[0 + DLCnoDLC].id, true);
//                     break;
//                 case 5:
//                     getLevels(gameID, 'expert', 'currentPatch', ILcats[1 + DLCnoDLC].id, true);
//                     break;
//             }
//         }
//     });
// }
function getCupheadLevels(difficulty, version, category, all) {
    let levelsCopy = levels.map(level => ({ ...level }));
    if (version != 'currentPatch') {
        levelsCopy = levels.slice(0, 19)
    }
    if (difficulty == 'simple') {
        levelsCopy = levelsCopy.slice(0, 24)
        levelsCopy.splice(17, 2)
    }
    levelsCopy.forEach(level => {
        level.difficulty = difficulty
        level.version = version
        level.category = category
    });
    isles.forEach((isle, isleIndex) => {
        if (!document.getElementById('checkbox_' + isle).checked) {
            let anotherCopy = []
            levelsCopy.forEach(level => {
                if (level.info.isle != isleIndex + 1) {
                    anotherCopy.push(level)
                }
            })
            levelsCopy = anotherCopy
        }
    })
    if (!document.getElementById('checkbox_ground').checked) {
        let anotherCopy = []
        levelsCopy.forEach(level => {
            if (level.info.plane == true) {
                anotherCopy.push(level)
            }
        })
        levelsCopy = anotherCopy
    }
    if (!document.getElementById('checkbox_plane').checked) {
        let anotherCopy = []
        levelsCopy.forEach(level => {
            if (level.info.plane == false) {
                anotherCopy.push(level)
            }
        })
        levelsCopy = anotherCopy
    }
    if (all) {
        categories.push(...levelsCopy)
    } else {
        categories = levelsCopy
    }
    if (!all || categories.length > 25) { // Fix this
        playerNames = new Set()
        players = []
        resetLoad()
        categories.forEach(level => {
            let variables = `?var-${level.numPlayersID}=${level.soloID}&var-${level.difficultyID}=${level[level.difficulty]}`
            if (level.versionID) {
                variables += `&var-${level.versionID}=${level[level.version]}`
            }
            getLeaderboard(level, `level/${level.id}/${level.category}`, variables)
        })
    }
}
function getSM64levels() {
    categories = levels
    playerNames = new Set()
    players = []
    resetLoad()
    levels.forEach(level => {
        const variable = `?var-${platform.var}=${platform.subcat}`
        getLeaderboard(level, `level/${level.id}/${stageRTA.id}`, variable)
    })
}
function getLeaderboard(category, query, variables) {
    const tabs = document.querySelectorAll('.tabs div')
    tabs.forEach(elem => {
        elem.style.display = 'none'
    })
    document.getElementById("refresh").style.display = "none"
    let url = `https://www.speedrun.com/api/v1/leaderboards/${gameID}/${query}${variables}&top=300&embed=players,category`;
    // const url = `https://www.speedrun.com/api/v1/games/cuphead/categories`
    if (allRuns) {
        url = `https://www.speedrun.com/api/v1/leaderboards/${gameID}/${query}${variables}&embed=players,category`;
    }
    fetch(url, {
        method: "GET",
        headers: {
            "User-Agent": "combinedLeaderboard",
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            data.data.players.data.forEach(player => {
                if (!player.name) {
                    player.name = player.names.international
                }
                addPlayer(player)
            })
            category.runs = data.data
            load()
            if (processedCategories == categories.length) {
                prepareData()
            }
        })
        .catch(error => {
            console.error('Error fetching leaderboard:', error)
            const loadingText = document.getElementById('loadingText')
            loadingText.innerHTML = 'Too many API requests! Please reload the page.'
        });
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
    document.getElementById('loading').style.display = ''
    processedCategories++
    document.getElementById('loadingProgress').value = processedCategories
    const loadingText = document.getElementById('loadingText')
    loadingText.innerText = processedCategories + '/' + categories.length
    if (processedCategories > categories.length) {
        loadingText.innerHTML = 'An error has occurred. Please reload the page.'
    }
}
function prepareData() {
    generatePlaces()
    generateRanks()
    sortByCriteria('averagePercentage')
    refreshCharts()
    const tabs = document.querySelectorAll('.tabs div')
    tabs.forEach(elem => {
        elem.style.display = ''
    })
    document.getElementById('loading').style.display = 'none'
    updateChartCategories()
    // updateStats()
    showTab(page)
}
function generatePlaces() {
    categories.forEach((category, index) => {
        category.runs.runs.forEach(run => {
            const runPlayer = gameID == 'tetris' ? run.run.player : run.run.players[0]
            let thePlayer = ''
            for (const player of players) {
                if (player.id) {
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
            if (thePlayer.runs) {
                thePlayer.runs[index] = run
            }
            run.run.player = thePlayer
        })
    })
}
function generateRanks() {
    players.forEach(player => {
        // let placeSum = 0
        player.percentageSum = 0
        player.truePercentageSum = 0
        let hasOnePointOne = true
        player.runs.forEach((run, runIndex) => {
            if (run) {
                // placeSum += parseInt(run.place)
                let category = categories[runIndex]
                const worldRecord = getWorldRecord(category)
                const runTime = gameID == 'tetris' ? run.run.score : run.run.times.primary_t
                const percentage = getScore(category, worldRecord, runTime)
                player.percentageSum += (percentage) * (1 / categories.length)
                player.truePercentageSum += percentage
                run.percentage = percentage
                // NMG run in place of a 1.1 run
                if (category.name == 'NMG') {
                    let runCopy = { ...run }
                    runCopy.place = '-'
                    const onePointOne = categories[0]
                    const onePointOneRun = player.runs[0]
                    const onePointOneWR = getWorldRecord(onePointOne)
                    runCopy.percentage = onePointOneWR / run.run.times.primary_t
                    if (!hasOnePointOne) {
                        player.runs[0] = runCopy
                        player.percentageSum += runCopy.percentage * (1 / categories.length)
                    } else if (player.runs[0].run.times.primary_t > run.run.times.primary_t) {
                        player.runs[0] = runCopy
                        player.percentageSum -= (onePointOneWR / onePointOneRun.run.times.primary_t) * (1 / categories.length)
                        player.percentageSum += runCopy.percentage * (1 / categories.length)
                    }
                }
            } else if (runIndex == 0) {
                hasOnePointOne = false
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
function applyPenalties(player) {
    player.runs.forEach((run, runIndex) => {
        if (!run) {
            if (fullgame) {
                if (categories[0].name == '1.1+' || categories[0].name == 'Full Clear 1.1+') {
                    if (runIndex == 0 && !player.runs[2] && player.runs[4]) {
                        player.explanation += player.name + ' is missing a 1.1+ run, but they have a DLC+Base run, so their 1.1+ penalty is halved.\n'
                    } else if (runIndex == 2 && !player.runs[0] && player.runs[4]) {
                        player.explanation += player.name + ' is missing an NMG run, but they have a DLC+Base run, so their NMG penalty is halved.\n'
                    } else if (runIndex == 2 && player.runs[0]) {
                        player.averagePercentage -= halfPenalty(player)
                        player.explanation += player.name + ' is missing an NMG run, but they have a 1.1+ run, so their NMG penalty is halved.\n'
                    } else if (runIndex == 3 && player.runs[4]) {
                        player.averagePercentage -= halfPenalty(player)
                        player.explanation += player.name + ' is missing a DLC run, but they have a DLC+Base run, so their DLC penalty is halved.\n'
                    } else if (runIndex == 4 && player.runs[3] && (player.runs[0] || player.runs[2])) {
                        player.averagePercentage -= halfPenalty(player)
                        player.explanation += player.name + ' is missing a DLC+Base run, but they have a 1.1+/NMG run and a DLC run, so their DLC+Base penalty is halved.\n'
                    } else {
                        player.averagePercentage -= penalty(player)
                    }
                } else if (categories[0].name == '120 Star') {
                    if (runIndex == 3 && player.runs[4]) {
                        player.averagePercentage -= halfPenalty(player)
                        player.explanation += player.name + ' is missing a 1-Star run, but they have a 0-Star run, so their 1-Star penalty is halved.\n'
                    } else {
                        player.averagePercentage -= penalty(player)
                    }
                } else {
                    player.averagePercentage -= penalty(player)
                }
            } else {
                player.averagePercentage -= levelPenalty(player)
            }
        }
    })
    // } else if (categories[0].name == 'NMG') {
    //     if (!player.runs[0] && (player.runs[1] || player.runs[4] || player.runs[5])) {
    //         halfPenalty(player)
    //     }
    //     if (!player.runs[1] && player.runs[5]) {
    //         halfPenalty(player)
    //     }
    //     if (!player.runs[2] && (player.runs[3] || player.runs[4] || player.runs[5])) {
    //         halfPenalty(player)
    //     }
    //     if (!player.runs[3] && player.runs[5]) {
    //         halfPenalty(player)
    //     }
    //     if (!player.runs[4] && player.runs[5]) {
    //         halfPenalty(player)
    //     }
}
function penalty(player) {
    return (player.averagePercentage * (1 / categories.length)) / categories.length
}
function halfPenalty(player) {
    return ((player.averagePercentage * (1 / categories.length)) / categories.length) / 2
}
function levelPenalty(player) {
    return (player.averagePercentage * (1 / categories.length))
}
function sortByCriteria(criteria) {
    players.sort((a, b) => {
        return b[criteria] - a[criteria];
    });
    players.forEach((player, playerIndex) => {
        player.rank = playerIndex + 1
    })
    generateLeaderboard(-1)
}
function sortByCategory(categoryIndex) {
    const isReverse = reverseScore.includes(categories[categoryIndex].name);
    players.sort((a, b) => {
        const aRun = a.runs[categoryIndex];
        const bRun = b.runs[categoryIndex];
        if (aRun && bRun) {
            const timeDiff = gameID == 'tetris' ? aRun.run.score - bRun.run.score : aRun.run.times.primary_t - bRun.run.times.primary_t;
            if (timeDiff !== 0) {
                return isReverse ? -timeDiff : timeDiff;
            }
            const aDate = new Date(aRun.run.date);
            const bDate = new Date(bRun.run.date);
            return isReverse ? bDate - aDate : aDate - bDate;
        }
        if (aRun) return -1;
        if (bRun) return 1;
        return 0;
    });
    generateLeaderboard(categoryIndex);
}
function refresh() {
    if (document.getElementById('checkbox_percentile').checked && !allRuns) {
        allRuns = true
        refreshLeaderboard()
    } else if (ILchange) {
        ILchange = false
        levelCategoryIndex = 0
        refreshLeaderboard()
    } else {
        generateLeaderboard(-1)
    }
}
function refreshLeaderboard() {
    gameID != 'tetris' ? fullgame ? getFullGame() : prepareLevelBoards() : ''
}
function showRefresh() {
    document.getElementById("refresh").style.display = ""
}
function resetLoad() {
    const progress = document.getElementById('loadingProgress')
    progress.value = 0
    progress.max = categories.length
}