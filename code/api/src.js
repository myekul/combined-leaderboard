function getLeaderboard(category, query, variables, extra, thisGameID = gameID) {
    const url = `https://www.speedrun.com/api/v1/leaderboards/${thisGameID}/${query}?${variables}&top=300&embed=players,category`;
    fetch(url, {
        method: "GET",
        headers: {
            "User-Agent": "combinedLeaderboard",
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            if ((!data.data)) throw new Error('Wrong data!')
            if (stopLeaderboards) throw new Error('Leaderboards have stopped.')
            if (!extra) {
                // console.log(data.data)
                category.runs = cleanRuns(data.data.runs)
                category.players = cleanPlayers(data.data.players.data)
                getPlayers(category)
                load()
                if (processedCategories == categories.length) {
                    // console.log(JSON.stringify(categories)) // JSON
                    if (stopLeaderboards) {
                        stopLeaderboards = false
                    } else {
                        if (gameID == 'sm64' && mode == 'levels') {
                            getLeaderboard(categorySet[0], `category/${categorySet[0].id}`, sm64Var, true)
                        } else if (gameID == 'titanfall_2') {
                            getLeaderboard(titanfall_2, `category/${titanfall_2.id}`, titanfall_2VarFG, true)
                        } else if (gameID == 'nsmbw') {
                            getLeaderboard(categorySet[0], `category/${categorySet[0].id}`, 'var-wledqkxn=814g9yj1', true)
                        } else if (gameID == 'mtpo') {
                            getLeaderboard(mtpo, `category/${mtpo.id}`, '', true)
                        } else if (gameID == 'spo') {
                            getLeaderboard(spo, `category/${spo.id}`, '', true)
                        } else if (gameID == 'ssbm' && !ssbVar) {
                            fetchAllData()
                        } else {
                            const boardTitleSrc = document.getElementById('boardTitleSrc')
                            boardTitleSrc.innerHTML = getSRCicon()
                            if (bossILindex > -1) {
                                const boss = bosses[bossILindex]
                                console.log(boss.name + ' loaded')
                            } else {
                                console.log(categories.length + '/' + categories.length + ' loaded')
                            }
                            if (gameID == 'cuphead' && mode == 'levels' && !basegameILs) {
                                window.firebaseUtils.firestoreWrite()
                            }
                            if (((['cuphead', 'sm64'].includes(gameID) && categories.length == 5) || ['smb1', 'sms', 'bfbb'].includes(gameID)) && !fullgameCategory) {
                                globalCache = categories
                                window.firebaseUtils.firestoreWriteMain()
                            }
                            prepareData()
                        }
                    }
                }
            } else {
                extraCategory.runs = cleanRuns(data.data.runs)
                if (gameID == 'cuphead') {
                    extraCategory.players = cleanPlayers(data.data.players.data)
                    fetchAllData()
                } else {
                    if (gameID == 'sm64') {
                        extraCategory.className = categorySet[0].className
                    }
                    assignRuns(extraCategory)
                    prepareData()
                    const boardTitleSrc = document.getElementById('boardTitleSrc')
                    boardTitleSrc.innerHTML = getSRCicon()
                }
            }
        })
        .catch(error => {
            console.error('Error fetching leaderboard:', error)
            if (!stopLeaderboards) {
                stopLeaderboards = true
                if (gameID == 'cuphead' && mode == 'levels') {
                    window.firebaseUtils.firestoreRead()
                    console.log('Too many API requests!')
                } else {
                    // const loadingText = document.getElementById('loadingText')
                    // loadingText.innerText = 'Too many API requests! Please reload the page.'
                }
            }
        });
}
function getSRCicon() {
    return getAnchor('https://www.speedrun.com/' + gameID) + `<div class='grow'>${sharedAssetsImg('src')}</div>`
}