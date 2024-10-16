let playerNames = new Set()
let players = []
let game = cuphead
let gameName = 'cuphead'
let processedCategories = 0
game.forEach(category => {
    getLeaderboard(gameName, game, category)
})
function getLeaderboard(gameId, categories, category) {
    let variables = `?var-${category.var}=${category.subcat}`
    if (category.var2) {
        variables += `&var-${category.var2}=${category.subcat2}`
    }
    const url = `https://www.speedrun.com/api/v1/leaderboards/${gameId}/category/${category.id + variables}&top=300&embed=players&embed=players,category`;
    // const url = `https://www.speedrun.com/api/v1/games/sm64?embed=categories.variables`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Data loaded')
            data.data.players.data.forEach(player => {
                if (!player.name) {
                    player.name = player.names.international
                }
                const initialSize = playerNames.size
                playerNames.add(player.name)
                if (playerNames.size > initialSize) {
                    player.runs = new Array(5).fill(null)
                    players.push(player)
                }
            })
            category.runs = data.data
            processedCategories++
            if (processedCategories == categories.length) {
                determineWeight(categories)
                generatePlaces(categories)
                generateRanks(categories)
                sortByCriteria('averagePercentile')
            }
        })
        .catch(error => console.error('Error fetching leaderboard:', error));
}
function determineWeight(categories) {
    let numRuns = 0
    categories.forEach(category => {
        numRuns += category.runs.runs.length
    })
    categories.forEach(category => {
        category.weight = category.runs.runs.length / numRuns
    })
}
function generatePlaces(categories) {
    categories.forEach((category, index) => {
        category.runs.runs.forEach(run => {
            const runPlayer = run.run.players[0]
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
                }
            }
            if (thePlayer.runs) {
                thePlayer.runs[index] = run
            }
            run.run.player = thePlayer
        })
    })
}
function generateRanks(categories) {
    players.forEach(player => {
        let placeSum = 0
        let percentileSum = 0
        let playerCats = []
        let hasOnePointOne = true
        player.runs.forEach((run, runIndex) => {
            if (run) {
                placeSum += parseInt(run.place)
                let category = categories[runIndex]
                if (category) {
                    playerCats.push(category)
                    percentileSum += (category.runs.runs[0].run.times.primary_t / run.run.times.primary_t) * (category.weight)
                    if (category.id == 'zd38jgek' && !hasOnePointOne) {
                        let runCopy = { ...run }
                        runCopy.place = '-'
                        player.runs[0] = runCopy
                        let onePointOne = categories[0]
                        playerCats.push(onePointOne)
                        percentileSum += (onePointOne.runs.runs[0].run.times.primary_t / run.run.times.primary_t) * (onePointOne.weight)
                    }
                }
            } else if (runIndex == 0) {
                hasOnePointOne = false
            }
        })
        let missingRunWeights = []
        let totalWeight = 0
        categories.forEach(category => {
            let runMissing = true
            playerCats.forEach(playerCat => {
                if (category.id == playerCat.id) {
                    runMissing = false
                    totalWeight += category.weight
                }
            })
            if (runMissing) {
                missingRunWeights.push(category.weight)
            }
        })
        player.averageRank = placeSum / player.runs.length
        player.averagePercentile = percentileSum / totalWeight
        // Penalty for missing runs
        missingRunWeights.forEach(missingRunWeight => {
            player.averagePercentile -= (player.averagePercentile * missingRunWeight) / categories.length
        })
    })
}
function sortByCriteria(criteria) {
    players.sort((a, b) => {
        return b[criteria] - a[criteria];
    });
    generateRankTable(game)
}
function sortByCategory(categoryIndex) {
    players.sort((a, b) => {
        const aRun = a.runs[categoryIndex]
        const bRun = b.runs[categoryIndex]
        if (aRun && bRun) {
            return aRun.run.times.primary_t - bRun.run.times.primary_t;
        }
        if (aRun) return -1;
        if (bRun) return 1;
        return 0;
    });
    generateRankTable(game)
}
function generateRankTable(categories) {
    let HTMLContent = `<table>
    <tr style='font-size:12px'>
    <th colspan=5 class='clickable' onclick="sortByCriteria('averagePercentile')">Runner</td>`
    categories.forEach((category, categoryIndex) => {
        HTMLContent += `<th colspan=3 class='clickable' onclick="sortByCategory(${categoryIndex})">${category.name}</td>`
    })
    HTMLContent +=
        `<th>Sum</td>
        <th>Runs Missing</td>
        </tr>`
    players.slice(0, 300).forEach((player, index) => {
        let times = [];
        let sum = ''
        let hasAllRuns = true
        player.runs.forEach(run => {
            if (run) {
                times.push(run.run.times.primary_t)
            } else {
                hasAllRuns = false;
            }
        })
        if (hasAllRuns) {
            sum = 0;
            times.forEach(time => {
                sum += time
            })
            sum = secondsToHMS(sum)
        }
        let otherRow = ''
        if (index % 2 == 0) {
            otherRow = 'otherRow'
        }
        let percentile = (player.averagePercentile * 100).toFixed(1)
        let letterGrade = getLetterGrade(percentile)
        let countryCode = ''
        let countryName = ''
        if (player.location) {
            countryCode = player.location.country.code
            countryName = player.location.country.names.international
        }
        let colorFrom = '#FFFFFF'
        let colorTo = '#FFFFFF'
        if (player['name-style']) {
            if (player['name-style'].color) {
                colorFrom = player['name-style'].color.dark
                colorTo = player['name-style'].color.dark
            } else {
                colorFrom = player['name-style']['color-from'].dark
                colorTo = player['name-style']['color-to'].dark
            }
        }
        let clickable = ''
        let playerLink = ''
        if (player.weblink) {
            clickable = 'clickable'
            playerLink = `window.open('${player.weblink}', '_blank')`
        }
        HTMLContent +=
            `<tr class=${otherRow}>
            <td style='font-size:12px'>${percentile}</td>
            <td style='text-align:left' class='${letterGrade.className}'>${letterGrade.grade}</td>
            <td class=${placeClass(index + 1)}>${index + 1}</td>
            <td><img src="https://www.speedrun.com/images/flags/${countryCode}.png" height='13px' title="${countryName}"></td>
            <td onclick="${playerLink}" class='${clickable}' style='text-align:left;font-weight: bold;background: linear-gradient(90deg, ${colorFrom}, ${colorTo});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;'>${player.name}</td>`
        categories.forEach((category, categoryIndex) => {
            let time = ''
            let videoLink = ''
            let clickable = ''
            let place = ''
            let percentile = ''
            let percentileClass = ''
            let percentileGrade = ''
            let run = player.runs[categoryIndex]
            if (run) {
                time = secondsToHMS(run.run.times.primary_t)
                if (run.run.videos) {
                    videoLink = `window.open('${run.run.videos.links[run.run.videos.links.length - 1].uri}', '_blank')`
                    clickable = 'clickable'
                }
                place = run.place
                percentile = getLetterGrade((category.runs.runs[0].run.times.primary_t / run.run.times.primary_t) * 100)
                percentileClass = percentile.className
                percentileGrade = percentile.grade
            }
            let theClass = placeClass(place)
            if (!theClass) {
                theClass = category.class
            }
            HTMLContent +=
                `<td style='font-size:12px;width:20px;text-align:left' class='${theClass} ${percentileClass}'>${percentileGrade}</td>
                <td style='font-size:12px;width:20px' class=${theClass}>${place}</td>
                <td onclick="${videoLink}" style='width:50px' class='${theClass} ${clickable}'>${time}</td>`
        })
        HTMLContent +=
            `<td>${sum}</td>
            <td>${categories.length - times.length}</td>
            </tr>`
    })
    const theTable = document.getElementById('theTable')
    theTable.innerHTML = HTMLContent
}
function secondsToHMS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}
function placeClass(place) {
    let theClass
    if (place == 1) {
        return 'first'
    } else if (place == 2) {
        return 'second'
    } else if (place == 3) {
        return 'third'
    }
    return theClass
}