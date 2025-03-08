function getFullgame(categoryName) {
    setMode('fullgame')
    disableLevelModes()
    sortCategoryIndex = -1
    if (gameID == 'cuphead') {
        if (categoryName) {
            if (['basegame', 'currentPatch'].includes(categoryName)) {
                if (categoryName == 'basegame') {
                    categories = cuphead['main'].slice(0, 3)
                } else if (categoryName == 'currentPatch') {
                    categories = cuphead['main'].slice(2, 5)
                }
                fullgameCategory = categoryName
                buttonClick('fullgameCategories_' + categoryName, 'fullgameCategories', 'active')
            } else {
                fullgameCategory = categoryName
                categories = cuphead[categoryName]
                buttonClick('fullgameCategories_' + categories[0].className, 'fullgameCategories', 'active')
            }
        }
    } else {
        categories = categorySet[gameID]
        if (categoryName) {
            if (gameID == 'sm64') {
                if (categoryName == 'long') {
                    categories = categories.slice(0, 2)
                } else if (categoryName == 'short') {
                    categories = categories.slice(2, 5)
                }
            }
            if (gameID == 'nsmbw') {
                if (categoryName == 'main3') {
                    categories = nsmbw.slice(0, 3)
                }
            }
            buttonClick('fullgameCategories_' + categoryName, 'fullgameCategories', 'active')
        }
    }
    if (!categoryName) {
        fullgameCategory = ''
        categories = categorySet[gameID]
        if (['cuphead', 'sm64', 'nsmbw'].includes(gameID)) {
            buttonClick(gameID + '_fullgameCategories_main', 'fullgameCategories', 'active')
        }
    }
    resetLoad()
    categories.forEach(category => {
        let variables = ''
        if (category.var) {
            variables += `var-${category.var}=${category.subcat}`
        }
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
    if (gameID == 'cuphead') {
        cupheadLevelSetting()
    } else {
        getOtherLevels()
    }
}
function getCommBestILs(categoryName) {
    setMode('commBestILs')
    disableLevelModes()
    sortCategoryIndex = -1
    categoryName = categoryName != null ? categoryName : commBestILsCategory.tabName
    commBestILsCategory = commBestILs[categoryName]
    updateLoadouts(categoryName)
    buttonClick('commBestILs_' + commBestILsCategory.className, 'commBestILsVersionTabs', 'active')
    resetLoad()
    players = []
    playerNames = new Set()
    let category = commBestILsCategory.category
    let variables = `var-${category.var}=${category.subcat}`
    if (category.var2) {
        variables += `&var-${category.var2}=${category.subcat2}`
    }
    let altGameID = false
    if (['DLC Expert'].includes(categoryName)) {
        altGameID = 'cuphead_category_extensions'
    }
    getLeaderboard(category, `category/${category.id}`, variables, true, altGameID)
}
function updateLoadouts(categoryName) {
    let HTMLContent = ''
    let fullgameCategories = []
    if (commBestILsCategory.name == 'DLC') {
        fullgameCategories.push('DLC', 'DLC C/S', 'DLC C/T', 'DLC Low%', 'DLC C-less', 'DLC Expert')
    } else if (commBestILsCategory.name == 'DLC+Base') {
        fullgameCategories.push('DLC+Base', 'DLC+Base C/S')
    }
    fullgameCategories.forEach(category => {
        const thisCategory = commBestILs[category]
        HTMLContent += `<div onclick="playSound('category_select');getCommBestILs('${category}')" class="button ${commBestILsCategory.className} container ${categoryName == category ? 'active' : ''}">`
        HTMLContent += thisCategory.shot1 ? `<img src="images/cuphead/inventory/weapons/${thisCategory.shot1}.png">` : ''
        HTMLContent += thisCategory.shot2 ? `<img src="images/cuphead/inventory/weapons/${thisCategory.shot2}.png">` : ''
        HTMLContent += thisCategory.subcat ? thisCategory.subcat : ''
        HTMLContent += `</div>`
    })
    document.getElementById('loadouts').innerHTML = HTMLContent
}
function getOtherLevels(section) {
    fetch(`resources/levels/${gameID}.json`)
        .then(response => response.json())
        .then(data => {
            categories = data
            resetLoad()
            if (gameID == 'sm64') {
                categories.forEach((category, categoryIndex) => {
                    category.info = sm64LevelIDs[categoryIndex]
                })
                switch (section) {
                    case 'Lobby':
                        categories = categories.slice(0, 5)
                        break
                    case 'Basement':
                        categories = categories.slice(5, 9)
                        break
                    case 'Upstairs':
                        categories = categories.slice(9, 13)
                        break
                    case 'Tippy':
                        categories = categories.slice(13, 15)
                        break
                }
                sm64ILsSection = section
                if (sm64ILsSection) {
                    buttonClick(sm64ILsSection, 'ILcategories_sm64', 'active2')
                } else {
                    buttonClick('sm64ILsAll', 'ILcategories_sm64', 'active2')
                }
                categories.forEach((category) => {
                    getLeaderboard(category, `level/${category.id}/zdnq4oqd`, sm64Var) // Stage RTA
                })
            } else if (gameID == 'titanfall_2') {
                categories.forEach((category, categoryIndex) => {
                    category.name = titanfall_2LevelIDs[categoryIndex].name
                    getLeaderboard(category, `level/${category.id}/ndx8z6jk`, titanfall_2VarIL) // Any%
                })
            } else if (gameID == 'mtpo') {
                categories.forEach((category, categoryIndex) => {
                    category.info = mtpoLevelIDs[categoryIndex]
                    getLeaderboard(category, `level/${category.id}/vdo93vdp`) // Any%
                })
            } else if (gameID == 'nsmbw') {
                categories.forEach(category => {
                    getLeaderboard(category, `level/${category.id}/02qx7zky`, '&var-' + category.var + '=' + category.worldRTA) // Any%
                })
            }
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
        const playerCopy = { ...player }
        playerCopy.runs = new Array(categories.length).fill(0)
        players.push(playerCopy)
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
function moveObject(array, fromIndex, toIndex) {
    const [movedObject] = array.splice(fromIndex, 1); // Remove the object from its current position
    array.splice(toIndex, 0, movedObject); // Insert the object at the desired position
}
function prepareData() {
    categories.forEach((category, categoryIndex) => {
        assignRuns(category, categoryIndex)
    })
    if (mode == 'commBestILs') {
        assignRuns(extraCategory)
        const categoryName = commBestILsCategory.tabName
        if (commBestExtra.includes(categoryName)) {
            const morePlayers = []
            commBestILsCategory.extraRuns.forEach(run => {
                morePlayers.push(run.playerName)
            })
            players = players.filter(player => commBestILsCategory.extraPlayers?.includes(player.name) || morePlayers.includes(player.name) || player.runs.some(run => run != 0))
            const worldRecord = getWorldRecord(extraCategory)
            commBestILsCategory.extraRuns.forEach(run => {
                const player = players.find(player => player.name == run.playerName)
                run.score = run.score > 0 ? run.score : convertToSeconds(run.score)
                run.percentage = getPercentage(worldRecord / run.score)
                player.extra = run
            })
            const newPlayers = []
            const badPlayers = []
            players.forEach(player => {
                if (player.extra) {
                    newPlayers.push(player)
                } else {
                    badPlayers.push(player)
                }
            })
            players = newPlayers
            badPlayers.forEach(badPlayer => {
                players.push(badPlayer)
            })
            players.sort((a, b) => a.extra?.score - b.extra?.score)
            players.forEach((player, playerIndex) => {
                if (player.extra) {
                    player.extra.place = playerIndex + 1
                }
            })
            // newRuns = []
            // extraCategory.runs.forEach(run => {
            //     if (chargeDLC.includes(run.playerName)) {
            //         newRuns.push(run)
            //     }
            // })
            // extraCategory.runs = newRuns
        }
        players.forEach((player, playerIndex) => {
            player.score = -playerIndex
        })
    } else {
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
        sortPlayers(players)
    }
    players.forEach((player, playerIndex) => {
        player.rank = playerIndex + 1
    })
    const tabs = document.querySelectorAll('.tabs')
    tabs.forEach(elem => {
        show(elem)
    })
    hide('loading')
    showTab(page)
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
            if (!(mode == 'commBestILs' && commBestExtra.includes(commBestILsCategory.tabName) && !commBestILsCategory.extraPlayers?.includes(thePlayer.name))) {
                thePlayer.extra = run
            }
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
        run.playerName = thePlayer.name
    })
}
function generateRanks() {
    const minimum = mode == 'fullgame' ? getPercentage((categories.length - 1) / categories.length) : 80
    const threshold = minimum
    // const threshold = 0
    players.forEach(player => {
        player.truePercentages = new Array(categories.length).fill(0)
        const ideal = (minimum + player.bestScore) / 2
        player.percentageSum = 0
        const missingRuns = []
        const good = player.runs.some(run => run?.percentage >= threshold)
        player.runs.forEach((run, runIndex) => {
            const category = categories[runIndex]
            if (run) {
                const newScore = goodRunCheck(run, good, ideal)
                player.percentageSum += newScore
                player.truePercentages[runIndex] = newScore
            } else {
                // NMG run in place of a 1.1 run
                if ((category.name == '1.1+' || category.name == 'Full Clear 1.1+') && player.runs[2]) {
                    placeholderRun(player, good, ideal, 2, 0)

                    // } else if (player.runs[0].score > run.score) {
                    //     player.runs[0] = runCopy
                    //     const oldScore = getScore(onePointOne, onePointOneRun.score)
                    //     const newOldScore = oldScore >= threshold || !good ? oldScore : ideal
                    //     player.percentageSum -= newOldScore
                    //     player.percentageSum += newScore
                } else if (mode == 'levels' && big5() && runIndex % 2 == 0 && (player.runs[runIndex + 1])) {
                    placeholderRun(player, good, ideal, runIndex + 1, runIndex)
                } else {
                    missingRuns.push(runIndex)
                }
            }
        })
        player.explanation = ''
        missingRuns.forEach(runIndex => {
            const penalty = gameID == 'cuphead' && mode == 'levels' ? applyPenalty(player, runIndex, minimum) : ''
            const numCats = cupheadNumCats(categories[runIndex])
            const placeholder = penalty ? penalty : big4() ? 100 * ((numCats - 1) / numCats) : categories.length > 6 ? 80 : ideal
            player.percentageSum += placeholder
            player.truePercentages[runIndex] = placeholder
        })
        player.score = player.percentageSum / categories.length
    })
}
function goodRunCheck(run, good, ideal) {
    return run.percentage >= ideal || !good ? run.percentage : ideal
}
function placeholderRun(player, good, ideal, copyIndex, pasteIndex) {
    const runCopy = { ...player.runs[copyIndex] }
    runCopy.percentage = getScore(categories[pasteIndex], runCopy.score)
    runCopy.place = runCopy.percentage >= 100 ? 1 : '-'
    runCopy.first = false
    runCopy.untied = false
    const newScore = goodRunCheck(runCopy, good, ideal)
    player.runs[pasteIndex] = runCopy
    player.percentageSum += newScore
    player.truePercentages[pasteIndex] = newScore
}
function organizePlayers(categoryIndex, shh) {
    if (categoryIndex > categories.length - 1 || categoryIndex < 0) {
        playSound('locked')
    } else {
        if (!shh) {
            playSound('equip_move')
        }
        sortCategoryIndex = categoryIndex
        sortPlayers(players)
        action()
    }
}
function sortPlayers(playersArray, customCategoryIndex) {
    const categoryIndex = customCategoryIndex != null ? customCategoryIndex : sortCategoryIndex
    if (categoryIndex == -1) {
        let criteria = 'score'
        if (mode == 'commBestILs') {
            criteria == 'rank'
        }
        playersArray.sort((a, b) => {
            return b[criteria] - a[criteria];
        });
    } else {
        const isReverse = reverseScore.includes(categories[categoryIndex].name);
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
        categories = tetris
        gapi.load("client", loadClient);
    } else {
        if (mode == 'fullgame') {
            getFullgame()
        } else if (mode == 'levels') {
            getLevels()
        } else if (mode == 'commBestILs') {
            getCommBestILs()
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
    show('loading')
}
function completeLoad() {
    document.getElementById('progress-bar').style.width = '100%';
}
function hideTabs() {
    const tabs = document.querySelectorAll('.tabs')
    tabs.forEach(elem => {
        hide(elem)
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