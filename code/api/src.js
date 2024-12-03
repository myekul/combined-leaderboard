function getLeaderboard(category, query, variables, extra) {
    const url = `https://www.speedrun.com/api/v1/leaderboards/${gameID}/${query}${variables}&top=300&embed=players,category`;
    // const url = `https://www.speedrun.com/api/v1/games/cuphead/categories`
    fetch(url, {
        method: "GET",
        headers: {
            "User-Agent": "combinedLeaderboard",
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            if ((!data.data)) {
                throw new Error('Wrong data!')
            }
            if (stopLeaderboards) {
                throw new Error('Leaderboards have stopped.')
            }
            if (!extra) {
                // console.log(data.data)
                category.runs = cleanRuns(data.data.runs)
                category.players = cleanPlayers(data.data.players.data)
                getPlayers(category)
                load()
                if (processedCategories == categories.length) {
                    // console.log(JSON.stringify(categories)) // JSON
                    const boardTitleSrc = document.getElementById('boardTitleSrc')
                    boardTitleSrc.innerHTML = `<img src='images/social/speedrun.png'>`
                    if (stopLeaderboards) {
                        stopLeaderboards = false
                    } else {
                        if (gameID == 'sm64' && mode == 'levels') {
                            const variable = `?var-${platform.var}=${platform.subcat}`
                            getLeaderboard(sm64[0], `category/${sm64[0].id}`, variable, true)
                        } else {
                            prepareData()
                            if (bossILindex > -1) {
                                const boss = bosses[bossILindex]
                                console.log(boss.name + ' loaded')
                            } else {
                                console.log(categories.length + '/' + categories.length + ' loaded')
                            }
                            if (gameID == 'cuphead' && mode == 'levels') {
                                window.firebaseUtils.firestoreWrite()
                            }
                        }
                    }
                }
            } else {
                extraCategory.runs = cleanRuns(data.data.runs)
                if (gameID == 'cuphead') {
                    extraCategory.players = cleanPlayers(data.data.players.data)
                    getPlayers(extraCategory)
                    gapi.load("client", loadClient);
                } else {
                    extraCategory.className = sm64[0].className
                    assignRuns(extraCategory)
                    prepareData()
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
                    const loadingText = document.getElementById('loadingText')
                    loadingText.innerText = 'Too many API requests! Please reload the page.'
                }
            }
        });
}
function cleanRuns(runs) {
    const newRuns = []
    runs.forEach(run => {
        const theRun = run.run
        let playerContent = { rel: theRun.players[0].rel, id: theRun.players[0].id }
        if (theRun.players[0].name) {
            playerContent = { name: theRun.players[0].name }
        }
        const newRun =
        {
            date: theRun.date,
            place: run.place,
            player: playerContent,
            score: theRun.times.primary_t,
            videos: theRun.videos,
            weblink: theRun.weblink
        }
        newRuns.push(newRun)
    })
    return newRuns
}
function cleanPlayers(thePlayers) {
    const newPlayers = []
    thePlayers.forEach(player => {
        if (!player.name) {
            player.name = player.names.international
        }
        const cleanPlayer =
        {
            id: player.id ? player.id : null,
            name: player.name,
            'name-style': player['name-style'] ? player['name-style'] : null,
            location: player.location ? player.location : null,
            weblink: player.weblink ? player.weblink : null
        }
        newPlayers.push(cleanPlayer)
    })
    return newPlayers
}