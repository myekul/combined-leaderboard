function getFullgame(categoryName) {
    setMode('fullgame')
    sortCategoryIndex = -1
    spotlightFlag = false
    if (gameID == 'cuphead') {
        categories = categorySet['main']
        if (categoryName) {
            if (['basegame', 'currentPatch'].includes(categoryName)) {
                if (categoryName == 'basegame') {
                    categories = categorySet['main'].slice(0, 3)
                } else if (categoryName == 'currentPatch') {
                    categories = categorySet['main'].slice(2, 5)
                }
                fullgameCategory = categoryName
                buttonClick('fullgameCategories_' + categoryName, 'fullgameCategories', 'active')
            } else {
                fullgameCategory = categoryName
                categories = categorySet[categoryName]
                buttonClick('fullgameCategories_' + categories[0].className, 'fullgameCategories', 'active')
            }
        } else {
            spotlightFlag = true
        }
    } else {
        categories = categorySet
        if (!categories) {
            categories = generateCategories(gameID)
        }
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
                    categories = categorySet.slice(0, 3)
                }
            }
            buttonClick('fullgameCategories_' + categoryName, 'fullgameCategories', 'active')
        }
    }
    if (!categoryName) {
        fullgameCategory = ''
        if (['cuphead', 'sm64', 'nsmbw', 'tetris'].includes(gameID)) {
            buttonClick(gameID + '_fullgameCategories_main', 'fullgameCategories', 'active')
        }
    }
    resetLoad()
    if (!(['cuphead', 'sm64', 'smb1', 'sms'].includes(gameID) && mode == 'fullgame' && !categoryName && firstTimeFull)) {
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
    } else {
        if (globalCache) {
            cachedCategories()
        } else {
            // firstTimeFull = false
            categories = []
            window.firebaseUtils.firestoreReadMain()
        }
    }
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
    sortCategoryIndex = -1
    categoryName = categoryName != null ? categoryName : commBestILsCategory.tabName
    commBestILsCategory = commBestILs[categoryName]
    updateLoadouts(categoryName)
    buttonClick('commBestILs_' + commBestILsCategory.className, 'commBestILsVersionTabs', 'active')
    resetLoad()
    players = []
    playerNames = new Set()
    const category = commBestILsCategory.category
    if (category > -1) {
        if (globalCache) {
            extraCategory.players = globalCache[category].players
            extraCategory.runs = globalCache[category].runs
            gapi.load("client", loadClient);
        } else {
            window.firebaseUtils.firestoreReadMain()
        }
    } else {
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
}
function updateLoadouts(categoryName) {
    let HTMLContent = ''
    let fullgameCategories = []
    if (commBestILsCategory.name == 'NMG') {
        fullgameCategories.push('NMG', 'NMG P/S')
    } else if (commBestILsCategory.name == 'DLC') {
        fullgameCategories.push('DLC', 'DLC L/S', 'DLC C/S', 'DLC C/T', 'DLC Low%', 'DLC Expert')
    } else if (commBestILsCategory.name == 'DLC+Base') {
        fullgameCategories.push('DLC+Base', 'DLC+Base L/S', 'DLC+Base C/S')
    }
    fullgameCategories.forEach(category => {
        const thisCategory = commBestILs[category]
        HTMLContent += `<div onclick="playSound('category_select');getCommBestILs('${category}')" class="button ${commBestILsCategory.className} container ${categoryName == category ? 'active' : ''}">`
        HTMLContent += thisCategory.shot1 ? cupheadShot(thisCategory.shot1) : ''
        HTMLContent += thisCategory.shot2 ? cupheadShot(thisCategory.shot2) : ''
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
            if (section) {
                buttonClick(section, 'ILcategories_' + gameID, 'active2')
            } else {
                buttonClick('ILdefault_' + gameID, 'ILcategories_' + gameID, 'active2')
            }
            if (['sm64', 'mtpo', 'spo', 'ssbm', 'ssb64'].includes(gameID)) {
                const style = document.createElement('style');
                document.head.appendChild(style);
                categories.forEach(category => {
                    style.sheet.insertRule(
                        `.${category.info} { background-color: ${category.bg}; color: ${category.color ? category.color : gameID == 'mtpo' ? 'white' : 'black'} }`,
                        style.sheet.cssRules.length
                    );
                    category.info = { id: category.info }
                })
            }
            if (gameID == 'sm64') {
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
                categories.forEach((category) => {
                    getLeaderboard(category, `level/${category.id}/zdnq4oqd`, sm64Var) // Stage RTA
                })
            } else if (gameID == 'titanfall_2') {
                categories.forEach(category => {
                    getLeaderboard(category, `level/${category.id}/ndx8z6jk`, titanfall_2VarIL) // Any%
                })
            } else if (gameID == 'mtpo') {
                categories.forEach(category => {
                    getLeaderboard(category, `level/${category.id}/vdo93vdp`,) // Any%
                })
            } else if (gameID == 'spo') {
                categories.forEach(category => {
                    getLeaderboard(category, `level/${category.id}/wdmy8odq`, spoVarIL) // NTSC
                })
            } else if (gameID == 'nsmbw') {
                categories.forEach(category => {
                    getLeaderboard(category, `level/${category.id}/02qx7zky`, '&var-' + category.var + '=' + category.worldRTA) // Any%
                })
            } else if (gameID == 'ssbm') {
                ssbVar = section
                categories.forEach(category => {
                    getLeaderboard(category, `level/xd0xp0dq/9kvx3w32`, '&var-r8rp00ne=' + category.id)
                })
            } else if (gameID == 'ssb64') {
                ssbVar = section
                const cat = ssbVar ? '02qlrozk' : 'jdzvn8xk'
                categories.forEach(category => {
                    getLeaderboard(category, `level/${category.id}/` + cat)
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
    if (mode == 'commBestILs') {
        assignRuns(extraCategory)
        if (commBestILsCategory.extraRuns || commBestILsCategory.extraPlayers) {
            const morePlayers = []
            commBestILsCategory.extraRuns?.forEach(run => {
                morePlayers.push(run.playerName)
            })
            players = players.filter(player => commBestILsCategory.extraPlayers?.includes(player.name) || morePlayers.includes(player.name) || player.runs.some(run => run != 0))
            const worldRecord = getWorldRecord(extraCategory)
            commBestILsCategory.extraRuns?.forEach(run => {
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
        if (!(gameID == 'ssbm' && !ssbVar)) {
            sortPlayers(players)
        }
    }
    players.forEach((player, playerIndex) => {
        player.rank = playerIndex + 1
    })
    // hide('loading')
    if (mode == 'fullgame' && spotlightFlag) {
        generateSpotlightPlayer()
        show('spotlightDiv')
    } else {
        hide('spotlightDiv')
    }
    if (mode == 'fullgame' && firstTimeFull) {
        show('refreshDiv')
    } else {
        hide('refreshDiv')
    }
    const username = localStorage.getItem('username')
    if (username && !runRecapExample) {
        document.getElementById('input_username').value = username
        document.getElementById('username').innerHTML = runRecapPlayer('username')
    }
    show('username')
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
            if (!(mode == 'commBestILs' && commBestILsCategory.extraRuns && !commBestILsCategory.extraPlayers?.includes(thePlayer.name))) {
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
        const good = player.runs.some(run => run?.percentage >= threshold)
        player.runs.forEach((run, runIndex) => {
            const category = categories[runIndex]
            if (run) {
                const newScore = goodRunCheck(run, good, ideal)
                player.percentageSum += newScore
                player.truePercentages[runIndex] = newScore
            } else {
                // NMG run in place of a 1.1 run
                if ((category.name == '1.1+') && player.runs[2]) {
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
        // player.explanation = ''
        missingRuns.forEach(runIndex => {
            const penalty = gameID == 'cuphead' && mode == 'levels' ? applyPenalty(player, runIndex, threshold) : ''
            const numCats = cupheadNumCats(categories[runIndex])
            const placeholder = penalty ? penalty : big4() ? 100 * ((numCats - 1) / numCats) : ideal
            player.percentageSum += placeholder
            player.truePercentages[runIndex] = placeholder
        })
        player.score = player.percentageSum / categories.length
    })
}
function goodRunCheck(run, good, ideal) {
    return run.percentage >= ideal ? run.percentage : ideal
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
        if (gameID == 'ssbm' && !ssbVar) {
            players.sort((a, b) => {
                if (!a.sum && !b.sum) return 0;
                if (!a.sum) return 1;
                if (!b.sum) return -1;
                return convertToSeconds(a.sum) - convertToSeconds(b.sum);
            });
        } else {
            let criteria = 'score'
            if (mode == 'commBestILs') {
                criteria == 'rank'
            }
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
        gapi.load("client", loadClient);
    } else if (mode == 'fullgame' && !categorySet) {
        generateCategories(gameID)
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
    // show('loading')
}
function completeLoad() {
    document.getElementById('progress-bar').style.width = '100%';
    if (mode == 'commBestILs') {
        loadSheets()
    }
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
function cachedCategories() {
    categories = globalCache
    resetAndGo()
    firebaseReadSuccess()
}
function firebaseReadSuccess() {
    completeLoad()
    const boardTitleSrc = document.getElementById('boardTitleSrc')
    boardTitleSrc.innerHTML = `<img src='images/external/firebase.png'>`
}