google.charts.load('current', { packages: ['corechart'] });
showLeaderboard()
gameID == 'cuphead' || gameID == 'sm64' ? getFullGame() : ''
function getFullGame() {
    fullgame = true
    document.getElementById('fullgameButton').classList.add('active2')
    document.getElementById('ILbutton').classList.remove('active2')
    categories = gameID == 'cuphead' ? cuphead : sm64
    const loading = document.getElementById('loading')
    loading.innerHTML = 'Loading API...'
    const ILsSection = document.getElementById('ILsSection')
    ILsSection.style.display = 'none'
    playerNames = new Set()
    players = []
    processedCategories = 0
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
    document.getElementById('fullgameButton').classList.remove('active2')
    document.getElementById('ILbutton').classList.add('active2')
    processedCategories = 0
    if (gameID == 'cuphead') {
        const ILsSection = document.getElementById('ILsSection')
        ILsSection.style.display = ''
        const category = ILcats[DLCorNot + categoryIndex]
        let label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1, difficulty.length) + ' Any%'
        document.querySelectorAll('#versionTabs button,#categoryTabs button,#difficultyTabs button').forEach(button => {
            button.classList.remove('active')
        })
        const versionButton = version == 'currentPatch' ? document.getElementById('currentPatch') : document.getElementById('legacy')
        versionButton.classList.add('active')
        const categoryButton = DLCorNot == 0 ? document.getElementById('mainBoards') : document.getElementById('dlcBoards')
        categoryButton.classList.add('active')
        // if (!event.shiftKey) {
        // }
        let button = categoryIndex == 0 ? document.getElementById(difficulty + 'any') : document.getElementById(difficulty + 'highest')
        // if (button.classList.contains('active')) {
        //     button.classList.remove('active')
        // } else {
        button.classList.add('active')
        // }
        if (categoryIndex == 1) {
            let highestGradeLabel = ''
            if (difficulty == 'simple') {
                highestGradeLabel = 'Simple B+'
            } else if (difficulty == 'regular') {
                highestGradeLabel = 'Regular A+'
            } else if (difficulty == 'expert') {
                highestGradeLabel = 'S-Rank'
            }
            label = highestGradeLabel
        }
        label += category.label
        cupheadVersion = version
        levelDifficulty = difficulty
        highestGrade = categoryIndex
        DLCnoDLC = DLCorNot
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
        getCupheadLevels(difficulty, version, category.id)
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
        const loading = document.getElementById('loading')
        loading.innerHTML = 'Loading API...'
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
    document.getElementById('loading').style.display = ''
    document.getElementById("refresh").style.display = "none"
    let url = `https://www.speedrun.com/api/v1/leaderboards/${gameID}/${query}${variables}&top=300&embed=players,category`;
    // const url = `https://www.speedrun.com/api/v1/levels/o9x22m3w/categories`
    if (document.getElementById('checkbox_percentile').checked) {
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
            const loading = document.getElementById('loading')
            loading.innerHTML = 'Too many API requests! Please reload the page.'
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
    processedCategories++
    const loading = document.getElementById('loading')
    loading.innerHTML = `Loading API...<br><progress value=${processedCategories} max=${categories.length}></progress><br>${processedCategories}/${categories.length}`
    if (processedCategories > categories.length) {
        loading.innerHTML = 'An error has occurred. Please reload the page.'
    }
}
function prepareData() {
    determineWeight()
    generatePlaces()
    generateRanks()
    sortByCriteria('averagePercentage')
    google.charts.setOnLoadCallback(function () {
        fullgame ? drawChart(fullgameCategoryIndex) : drawChart(levelCategoryIndex);
    });
    const tabs = document.querySelectorAll('.tabs div')
    tabs.forEach(elem => {
        elem.style.display = ''
    })
    document.getElementById('loading').style.display = 'none'
    updateChartCategories()
    updateStats()
}
function showLeaderboard() {
    charts = false
    document.querySelectorAll('.tabs').forEach(elem => {
        elem.style.display = 'none'
    })
    document.getElementById('leaderboardTab').style.display = ''
    document.querySelectorAll('#tabs button').forEach(elem => {
        elem.classList.remove('active2')
    })
    document.getElementById('leaderboardButton').classList.add('active2')
}
function determineWeight() {
    let numRuns = 0
    categories.forEach(category => {
        numRuns += category.runs.runs.length
    })
    categories.forEach(category => {
        category.weight = 100 / categories.length / 100
        // category.weight = category.runs.runs.length / numRuns
    })
    // console.log(numRuns)
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
        let placeSum = 0
        let percentageSum = 0
        let hasOnePointOne = true
        player.runs.forEach((run, runIndex) => {
            if (run) {
                placeSum += parseInt(run.place)
                let category = categories[runIndex]
                let percentage = 0
                const wrTime = gameID == 'tetris' ? category.runs.runs[0].run.score : category.runs.runs[0].run.times.primary_t
                const runTime = gameID == 'tetris' ? run.run.score : run.run.times.primary_t
                if (reverseScore.includes(category.name)) {
                    percentage = runTime / wrTime
                } else {
                    percentage = wrTime / runTime
                }
                percentageSum += (percentage) * (category.weight)
                run.percentage = percentage
                // NMG run in place of a 1.1 run
                if (category.name == 'NMG') {
                    let runCopy = { ...run }
                    runCopy.place = '-'
                    const onePointOne = categories[0]
                    const onePointOneRun = player.runs[0]
                    runCopy.percentage = onePointOne.runs.runs[0].run.times.primary_t / run.run.times.primary_t
                    if (!hasOnePointOne) {
                        player.runs[0] = runCopy
                        percentageSum += runCopy.percentage * onePointOne.weight
                    } else if (player.runs[0].run.times.primary_t > run.run.times.primary_t) {
                        player.runs[0] = runCopy
                        percentageSum -= (onePointOne.runs.runs[0].run.times.primary_t / onePointOneRun.run.times.primary_t) * (onePointOne.weight)
                        percentageSum += runCopy.percentage * category.weight
                    }
                }
            } else if (runIndex == 0) {
                hasOnePointOne = false
            }
        })
        let totalWeight = 0
        categories.forEach((category, categoryIndex) => {
            if (player.runs[categoryIndex]) {
                totalWeight += category.weight
            }
        })
        player.averageRank = placeSum / player.runs.length
        player.averagePercentage = percentageSum / totalWeight
        // Penalty for missing runs
        categories.forEach((category, categoryIndex) => {
            if (!player.runs[categoryIndex]) {
                if (fullgame) {
                    player.averagePercentage -= (player.averagePercentage * category.weight) / categories.length
                } else {
                    player.averagePercentage -= (player.averagePercentage * category.weight)
                }
            }
        })
        if (categories[0].name == '1.1+') {
            if (!player.runs[3] && player.runs[4]) {
                halfPenalty(player)
            }
            if (!player.runs[2] && player.runs[0]) {
                halfPenalty(player)
            }
            if (!player.runs[4] && player.runs[3] && (player.runs[0] || player.runs[2])) {
                halfPenalty(player)
            }
            if (player.runs[4] && !player.runs[0] && !player.runs[2]) {
                halfPenalty(player)
                halfPenalty(player)
            }
        } else if (categories[0].name == '120 Star') {
            if (!player.runs[3] && player.runs[4]) {
                halfPenalty(player)
            }
        }
    })
}
function halfPenalty(player) {
    player.averagePercentage += ((player.averagePercentage * (1 / categories.length)) / categories.length) / 2
}
function sortByCriteria(criteria) {
    players.sort((a, b) => {
        return b[criteria] - a[criteria];
    });
    players.forEach((player, playerIndex) => {
        player.rank = playerIndex + 1
    })
    generateRankTable(-1)
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
    generateRankTable(categoryIndex);
}
function parseCheckboxes() {
    let displayCheck = ['percentile', 'percentage', 'grade', 'place', 'time', 'year']
    let displayBoolean = []
    displayCheck.forEach(checkbox => {
        displayBoolean.push(document.getElementById('checkbox_' + checkbox).checked)
    })
    return displayBoolean
}
function generateRankTable(sortCategoryIndex) {
    document.getElementById("refresh").style.display = "none"
    let HTMLContent = '<div class="table-container"><table><thead>'
    const displayBoolean = parseCheckboxes()
    let numCols = 0;
    displayBoolean.forEach(display => {
        if (display) {
            numCols++
        }
    })
    if (displayBoolean[0]) {
        HTMLContent +=
            `<tr>
            <th colspan=5></th>`
        categories.forEach(category => {
            HTMLContent += `<th colspan=${numCols}>${category.runs.runs.length} runs</th>`
        })
        HTMLContent += `</tr>`
    }
    if (numCols) {
        if (categories[0].info) {
            let colorClass = ''
            if (gameID == 'cuphead') {
                colorClass = DLCnoDLC == 0 ? 'cuphead' : 'dlc'
            }
            HTMLContent +=
                `<tr>
                <th colspan=5></th>`
            categories.forEach(category => {
                HTMLContent += `<th colspan=${numCols} class=${colorClass}><img src='images/${gameID}/${category.info.id}.png'></th>`
            })
            HTMLContent += `</tr>`
        }
    }
    let selected = ''
    if (!(sortCategoryIndex > -1)) {
        selected = 'selected'
    }
    HTMLContent +=
        `<tr style='font-size:12px'>
        <th colspan=5 class='clickable ${selected}' onclick="playSound('equip_move');sortByCriteria('averagePercentage')">Player</td>`
    if (numCols > 0) {
        categories.forEach((category, categoryIndex) => {
            let selected = ''
            if (categoryIndex == sortCategoryIndex) {
                selected = 'selected'
            }
            HTMLContent += `<th colspan=${numCols} class='clickable ${selected}' onclick="playSound('equip_move');sortByCategory(${categoryIndex})">${category.name}</td>`
        })
    }
    HTMLContent += gameID == 'tetris' ? '' : `<th>Sum</td>`
    HTMLContent +=
        `<th>GPA</td>
        <th>Runs Missing</td>
        </tr>
        </thead>`
    players.slice(0, 300).forEach((player, playerIndex) => {
        HTMLContent += parsePlayer(sortCategoryIndex, player, playerIndex, displayBoolean)
    })
    HTMLContent += `</table></div>`
    const leaderboard = document.getElementById('leaderboard')
    leaderboard.innerHTML = HTMLContent
}
function parsePlayer(sortCategoryIndex, player, playerIndex, displayBoolean, demo) {
    let HTMLContent = ''
    let scores = [];
    player.hasAllRuns = true
    player.runs.forEach(run => {
        if (run) {
            gameID == 'tetris' ? scores.push(null) : scores.push(run.run.times.primary_t)
        } else {
            player.hasAllRuns = false;
        }
    })
    let sum = player.hasAllRuns ? 0 : ''
    let gpa = player.hasAllRuns ? parseFloat(getGPA(player.averagePercentage).slice(0, 3)).toFixed(1) : ''
    if (player.hasAllRuns) {
        scores.forEach(score => {
            sum += score
        })
        sum = secondsToHMS(sum)
    }
    let rowColor = playerIndex % 2 == 0 ? 'otherRow' : 'background'
    let percentage = getPercentage(player.averagePercentage)
    let letterGrade = getLetterGrade(percentage)
    let border = categories.length > 5 ? 'border-right:2px solid black' : ''
    if (sortCategoryIndex == -1 || player.runs[sortCategoryIndex]) {
        HTMLContent +=
            `<tr class=${rowColor}>
                <td class='${rowColor}' style='font-size:12px;'>${percentage}</td>
                <td class='${letterGrade.className}' style='text-align:left;'>${letterGrade.grade}</td>
                <td class='${placeClass(player.rank)}'>${player.rank}</td>
                <td class='${rowColor}'>${getPlayerFlag(player, '13px')}</td>
                <td onclick="openModal(${playerIndex})" class='clickable ${rowColor}' style='text-align:left;font-weight: bold;${border}'>${getPlayerName(player)}</td>`
        categories.forEach((category, categoryIndex) => {
            if (categoryIndex == 0 || !demo && categoryIndex > 0) {
                let run = player.runs[categoryIndex]
                let time = run ? gameID == 'tetris' ? run.run.score : secondsToHMS(run.run.times.primary_t) : ''
                let place = run ? run.place : ''
                let percentage = run ? getPercentage(run.percentage) : ''
                let percentageObject = run ? getLetterGrade(percentage) : ''
                let percentageClass = run ? percentageObject.className : ''
                let percentageGrade = run ? percentageObject.grade : ''
                let date = run ? new Date(run.run.date).getFullYear() : ''
                let videoLink = ''
                let clickable = ''
                if (run) {
                    if (run.run.videos) {
                        videoLink = `window.open('${run.run.videos.links[run.run.videos.links.length - 1].uri}', '_blank')`
                        clickable = 'clickable'
                    }
                }
                const thePlaceClass = placeClass(place)
                let colorClass = thePlaceClass ? thePlaceClass : category.class
                let percentile = run ? run.place != '-' ? (run.place / category.runs.runs.length * 100).toFixed(1) : '-' : ''
                HTMLContent += displayBoolean[0] ? `<td style='font-size:12px;text-align:left;' class='${colorClass} ${percentageClass}'>${percentile}</td>` : ''
                HTMLContent += displayBoolean[1] ? `<td style='font-size:12px;text-align:left;' class='${colorClass} ${percentageClass}'>${percentage}</td>` : ''
                HTMLContent += displayBoolean[2] ? `<td style='font-size:12px;text-align:left;' class='${colorClass} ${percentageClass}'>${percentageGrade}</td>` : ''
                HTMLContent += displayBoolean[3] ? `<td style='font-size:12px;width:20px;' class=${colorClass}>${place}</td>` : ''
                HTMLContent += displayBoolean[4] ? `<td onclick="${videoLink}" class='${colorClass} ${clickable}'>${time}</td>` : ''
                HTMLContent += displayBoolean[5] ? `<td class='${colorClass}'>${date}</td>` : ''
            }
        })
        const gpaClass = gpa ? letterGrade.className : ''
        HTMLContent += gameID == 'tetris' ? '' : `<td>${sum}</td>`
        HTMLContent +=
            `<td class='${gpaClass}'>${gpa}</td>
            <td>${categories.length - scores.length}</td>
            </tr>`
    }
    return HTMLContent
}
function getPlayerName(player) {
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
    const HTMLContent = `<span style='background: linear-gradient(90deg, ${colorFrom}, ${colorTo});-webkit-background-clip: text;color: transparent;'>${player.name}</span>`
    return HTMLContent
}
function getPlayerFlag(player, size) {
    const playerLocation = player.location
    if (playerLocation) {
        let countryCode = playerLocation.country.code
        let countryName = playerLocation.country.names.international
        return getFlag(countryCode, countryName, size)
    }
    return ''
}
function getFlag(countryCode, countryName, size) {
    let HTMLContent = `<img src="https://www.speedrun.com/images/flags/${countryCode}.png" height='${size}' title="${countryName}" alt=''></img>`
    return HTMLContent
}
function refresh() {
    if (document.getElementById('checkbox_percentile').checked || ILchange) {
        ILchange = false
        levelCategoryIndex = 0
        fullgame ? getFullGame() : prepareLevelBoards(levelDifficulty, cupheadVersion, highestGrade, DLCnoDLC)
    } else {
        generateRankTable(-1)
    }
}
function showRefresh() {
    document.getElementById("refresh").style.display = ""
}