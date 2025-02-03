function getLeaderboard(category, query, variables, extra, altGameID) {
    const url = `https://www.speedrun.com/api/v1/leaderboards/${altGameID ? altGameID : gameID}/${query}?${variables}&top=300&embed=players,category`;
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
                    if (stopLeaderboards) {
                        stopLeaderboards = false
                    } else {
                        if (gameID == 'sm64' && mode == 'levels') {
                            getLeaderboard(sm64[0], `category/${sm64[0].id}`, sm64Var, true)
                        } else if (gameID == 'titanfall_2') {
                            getLeaderboard(titanfall_2, `category/${titanfall_2.id}`, titanfall_2VarFG, true)
                        } else if (gameID == 'mtpo') {
                            getLeaderboard(mtpo, `category/${mtpo.id}`, '', true)
                        } else {
                            const boardTitleSrc = document.getElementById('boardTitleSrc')
                            boardTitleSrc.innerHTML = `${getAnchor(`https://www.speedrun.com/${gameID}`)}<img src='images/external/src.png' class='clickable'>`
                            if (bossILindex > -1) {
                                const boss = bosses[bossILindex]
                                console.log(boss.name + ' loaded')
                            } else {
                                console.log(categories.length + '/' + categories.length + ' loaded')
                            }
                            if (gameID == 'cuphead' && mode == 'levels' && !basegameILs) {
                                window.firebaseUtils.firestoreWrite()
                            }
                            prepareData()
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
                    if (gameID == 'sm64') {
                        extraCategory.className = sm64[0].className
                    }
                    assignRuns(extraCategory)
                    prepareData()
                    const boardTitleSrc = document.getElementById('boardTitleSrc')
                    boardTitleSrc.innerHTML = `${getAnchor(`https://www.speedrun.com/${gameID}`)}<img src='images/external/src.png' class='clickable'>`
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
            id: theRun.weblink.split('run/')[1]
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
        let img = null
        if (player.assets?.image.uri) {
            img = player.assets.image.uri.split('=')[1]
        }
        let color1 = '#fff', color2 = '#fff'
        if (player['name-style']) {
            if (player['name-style'].color) {
                color1 = player['name-style'].color.dark
                color2 = color1
            } else {
                color1 = player['name-style']['color-from'].dark
                color2 = player['name-style']['color-to'].dark
            }
        }
        const cleanPlayer =
        {
            id: player.id ? player.id : null,
            name: player.name,
            'name-style': { color1: color1, color2: color2 },
            links: { src: player.weblink ? true : false, img: img },
            location: player.location ? player.location : null,
            signup: player.signup ? player.signup.slice(0, 10) : null
        }
        if (player.twitch) {
            cleanPlayer.links.twitch = player.twitch.uri.split('twitch.tv/')[1]
        }
        if (player.youtube) {
            cleanPlayer.links.youtube = player.youtube.uri
        }
        newPlayers.push(cleanPlayer)
    })
    return newPlayers
}