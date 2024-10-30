getFullGame(game)
window.addEventListener('hashchange', () => {
    location.reload();
});
const ILcats = [
    {
        name: 'anyNoDLC',
        label: '',
        id: '8246xjgd'
    },
    {
        name: 'highestGradeNoDLC',
        label: '',
        id: '9d86pe32'
    },
    {
        name: 'anyDLC',
        label: ' - DLC',
        id: 'z275j35k'
    },
    {
        name: 'highestGradeDLC',
        label: ' - DLC',
        id: 'zdno9r72'
    }
]
function prepareLevelBoards(gameID, difficulty, version, categoryIndex, DLCorNot) {
    fullgame = false
    const ILsSection = document.getElementById('ILsSection')
    ILsSection.style.display = ''
    const category = ILcats[DLCorNot + categoryIndex]
    let label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1, difficulty.length) + ' Any%'
    document.querySelectorAll('.categoryTabs button').forEach(button => {
        button.classList.remove('active')
    })
    const categoryButton = DLCorNot == 0 ? document.getElementById('mainBoards') : document.getElementById('dlcBoards')
    categoryButton.classList.add('active')
    // if (!event.shiftKey) {
    document.querySelectorAll('.difficultyTabs button').forEach(button => {
        button.classList.remove('active')
    })
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
    getLevels(gameID, difficulty, version, category.id)
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
function getFullGame(theGame) {
    fullgame = true
    const theTable = document.getElementById('theTable')
    theTable.innerHTML = 'Loading API...'
    game = theGame
    const ILsSection = document.getElementById('ILsSection')
    ILsSection.style.display = 'none'
    playerNames = new Set()
    players = []
    processedCategories = 0
    game.forEach(category => {
        let variables = `?var-${category.var}=${category.subcat}`
        if (category.var2) {
            variables += `&var-${category.var2}=${category.subcat2}`
        }
        getLeaderboard(gameID, game, category, `category/${category.id}`, variables)
    })
}
function getLevels(gameID, difficulty, version, category, all) {
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
    ['isle1', 'isle2', 'isle3', 'hell', 'isle4'].forEach((isle, isleIndex) => {
        if (!document.getElementById('checkbox_' + isle).checked) {
            let anotherCopy = []
            levelsCopy.forEach(level => {
                if (level.boss.isle != isleIndex + 1) {
                    anotherCopy.push(level)
                }
            })
            levelsCopy = anotherCopy
        }
    })
    if (!document.getElementById('checkbox_ground').checked) {
        let anotherCopy = []
        levelsCopy.forEach(level => {
            if (level.boss.plane == true) {
                anotherCopy.push(level)
            }
        })
        levelsCopy = anotherCopy
    }
    if (!document.getElementById('checkbox_plane').checked) {
        let anotherCopy = []
        levelsCopy.forEach(level => {
            if (level.boss.plane == false) {
                anotherCopy.push(level)
            }
        })
        levelsCopy = anotherCopy
    }
    if (all) {
        game.push(...levelsCopy)
    } else {
        game = levelsCopy
    }
    if (!all || game.length > 25) { // Fix this
        playerNames = new Set()
        players = []
        const theTable = document.getElementById('theTable')
        theTable.innerHTML = 'Loading API...'
        processedCategories = 0
        game.forEach(level => {
            let variables = `?var-${level.numPlayersID}=${level.soloID}&var-${level.difficultyID}=${level[level.difficulty]}`
            if (level.versionID) {
                variables += `&var-${level.versionID}=${level[level.version]}`
            }
            getLeaderboard(gameID, game, level, `level/${level.id}/${level.category}`, variables)
        })
    }
}
function getLeaderboard(gameID, categories, category, query, variables) {
    let url = `https://www.speedrun.com/api/v1/leaderboards/${gameID}/${query}${variables}&top=300&embed=players&embed=players,category`;
    if (document.getElementById('checkbox_percentile').checked) {
        url = `https://www.speedrun.com/api/v1/leaderboards/${gameID}/${query}${variables}&embed=players&embed=players,category`;
    }
    // const url = `https://www.speedrun.com/api/v1/levels/69z3n2xd/categories`
    fetch(url, {
        method: "GET",
        headers: {
            "User-Agent": "combinedLeaderboard",
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            data.data.players.data.forEach(player => {
                if (!player.name) {
                    player.name = player.names.international
                }
                const initialSize = playerNames.size
                playerNames.add(player.name)
                if (playerNames.size > initialSize) {
                    player.runs = new Array(categories.length).fill(null)
                    players.push(player)
                }
            })
            category.runs = data.data
            processedCategories++
            const theTable = document.getElementById('theTable')
            theTable.innerHTML = `Loading API...<br><progress value=${processedCategories} max=${categories.length}></progress><br>${processedCategories}/${categories.length}`
            if (processedCategories > categories.length) {
                theTable.innerHTML = 'An error has occurred. Please reload the page.'
            }
            if (processedCategories == categories.length) {
                prepareData(categories)
            }
        })
        .catch(error => {
            console.error('Error fetching leaderboard:', error)
            const theTable = document.getElementById('theTable')
            theTable.innerHTML = 'Too many API requests! Please reload the page.'
        });
}
function prepareData(categories) {
    determineWeight(categories)
    generatePlaces(categories)
    generateRanks(categories)
    sortByCriteria('averagePercentage')
}
function determineWeight(categories) {
    let numRuns = 0
    categories.forEach(category => {
        numRuns += category.runs.runs.length
    })
    categories.forEach(category => {
        category.weight = 100 / categories.length / 100
        // category.weight = category.runs.runs.length / numRuns
    })
    console.log(numRuns)
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
        let percentageSum = 0
        let hasOnePointOne = true
        player.runs.forEach((run, runIndex) => {
            if (run) {
                placeSum += parseInt(run.place)
                let category = categories[runIndex]
                percentageSum += (category.runs.runs[0].run.times.primary_t / run.run.times.primary_t) * (category.weight)
                // NMG run in place of a 1.1 run
                if (category.id == 'zd38jgek') {
                    let runCopy = { ...run }
                    runCopy.place = '-'
                    const onePointOne = categories[0]
                    const onePointOneRun = player.runs[0]
                    if (!hasOnePointOne) {
                        player.runs[0] = runCopy
                        percentageSum += (onePointOne.runs.runs[0].run.times.primary_t / run.run.times.primary_t) * (onePointOne.weight)
                    } else if (player.runs[0].run.times.primary_t > run.run.times.primary_t) {
                        player.runs[0] = runCopy
                        percentageSum -= (onePointOne.runs.runs[0].run.times.primary_t / onePointOneRun.run.times.primary_t) * (onePointOne.weight)
                        percentageSum += (category.runs.runs[0].run.times.primary_t / run.run.times.primary_t) * (onePointOne.weight)
                    }
                }
            } else if (runIndex == 0) {
                hasOnePointOne = false
            }
        })
        let missingRunWeights = []
        let totalWeight = 0
        categories.forEach((category, categoryIndex) => {
            if (player.runs[categoryIndex]) {
                totalWeight += category.weight
            } else {
                missingRunWeights.push(category.weight)
            }
        })
        player.averageRank = placeSum / player.runs.length
        player.averagePercentage = percentageSum / totalWeight
        // Penalty for missing runs
        missingRunWeights.forEach(missingRunWeight => {
            if (categories.length == 5) {
                player.averagePercentage -= (player.averagePercentage * missingRunWeight) / categories.length
            } else {
                player.averagePercentage -= (player.averagePercentage * missingRunWeight)
            }
        })
    })
}
function sortByCriteria(criteria) {
    players.sort((a, b) => {
        return b[criteria] - a[criteria];
    });
    generateRankTable(game, -1)
}
function sortByCategory(categoryIndex) {
    players.sort((a, b) => {
        const aRun = a.runs[categoryIndex];
        const bRun = b.runs[categoryIndex];
        if (aRun && bRun) {
            const timeDiff = aRun.run.times.primary_t - bRun.run.times.primary_t;
            if (timeDiff !== 0) {
                return timeDiff;
            }
            const aDate = new Date(aRun.run.date);
            const bDate = new Date(bRun.run.date);
            return aDate - bDate;
        }
        if (aRun) return -1;
        if (bRun) return 1;
        return 0;
    });
    generateRankTable(game, categoryIndex)
}
function generateRankTable(categories, sortCategoryIndex) {
    let HTMLContent = '<div class="table-container"><table><thead>'
    let displayPercentile = document.getElementById('checkbox_percentile').checked
    let displayPercentage = document.getElementById('checkbox_percentage').checked
    let displayGrade = document.getElementById('checkbox_grade').checked
    let displayPlace = document.getElementById('checkbox_place').checked
    let displayTime = document.getElementById('checkbox_time').checked
    let displayYear = document.getElementById('checkbox_year').checked
    let numCols = 0;
    [displayPercentile, displayPercentage, displayGrade, displayPlace, displayTime, displayYear].forEach(display => {
        if (display) {
            numCols++
        }
    })
    if (displayPercentile) {
        HTMLContent +=
            `<tr>
            <th colspan=5></th>`
        categories.forEach(category => {
            HTMLContent += `<th colspan=${numCols}>${category.runs.runs.length} runs</th>`
        })
        HTMLContent += `</tr>`
    }
    if (numCols) {
        if (categories[0].boss) {
            const colorClass = DLCnoDLC == 0 ? 'cuphead' : 'dlc'
            HTMLContent +=
                `<tr>
                <th colspan=5></th>`
            categories.forEach(category => {
                HTMLContent += `<th colspan=${numCols} class=${colorClass}><img src='images/mugshots/${category.boss.id}.png'></th>`
            })
            HTMLContent += `</tr>`
        }
    }
    HTMLContent +=
        `<tr style='font-size:12px'>
        <th colspan=5 class='clickable' onclick="sortByCriteria('averagePercentage')">Runner</td>`
    if (numCols > 0) {
        categories.forEach((category, categoryIndex) => {
            HTMLContent += `<th colspan=${numCols} class='clickable' onclick="sortByCategory(${categoryIndex})">${category.name}</td>`
        })
    }
    HTMLContent +=
        `<th>Sum</td>
        <th>GPA</td>
        <th>Runs Missing</td>
        </tr>
        </thead>`
    players.slice(0, 300).forEach((player, index) => {
        let times = [];
        let hasAllRuns = true
        player.runs.forEach(run => {
            if (run) {
                times.push(run.run.times.primary_t)
            } else {
                hasAllRuns = false;
            }
        })
        let sum = hasAllRuns ? 0 : ''
        let gpa = hasAllRuns ? 0 : ''
        if (hasAllRuns) {
            times.forEach(time => {
                sum += time
            })
            sum = secondsToHMS(sum)
            gpa = (player.averagePercentage * 4).toFixed(1)
            if (player.averagePercentage < 1 && gpa == 4) {
                gpa = 3.9
            }
        }
        let rowColor = index % 2 == 0 ? 'otherRow' : 'background'
        let percentage = (player.averagePercentage * 100).toFixed(1)
        let letterGrade = getLetterGrade(percentage)
        let countryCode = player.location ? player.location.country.code : ''
        let countryName = player.location ? player.location.country.names.international : ''
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
        let clickable = player.weblink ? 'clickable' : '';
        let playerLink = player.weblink ? `window.open('${player.weblink}', '_blank')` : '';
        let border = categories.length > 5 ? 'border-right:2px solid black' : ''
        if (sortCategoryIndex == -1 || player.runs[sortCategoryIndex]) {
            HTMLContent +=
                `<tr class=${rowColor}>
            <td class='${rowColor}' style='font-size:12px;'>${percentage}</td>
            <td class='${letterGrade.className}' style='text-align:left;'>${letterGrade.grade}</td>
            <td class='${placeClass(index + 1, rowColor)}'>${index + 1}</td>
            <td class='${rowColor}'><img src="https://www.speedrun.com/images/flags/${countryCode}.png" height='13px' title="${countryName}" alt=''></td>
            <td onclick="${playerLink}" class='${clickable} ${rowColor}' style='text-align:left;font-weight: bold;${border}'><span style='background: linear-gradient(90deg, ${colorFrom}, ${colorTo});
    -webkit-background-clip: text;
    color: transparent;'>${player.name}</span></td>`
            categories.forEach((category, categoryIndex) => {
                let run = player.runs[categoryIndex]
                let time = run ? secondsToHMS(run.run.times.primary_t) : ''
                let place = run ? run.place : ''
                let percentage = run ? (category.runs.runs[0].run.times.primary_t / run.run.times.primary_t) * 100 : ''
                let percentageObject = run ? getLetterGrade(percentage) : ''
                let percentageClass = run ? percentageObject.className : ''
                let percentageGrade = run ? percentageObject.grade : ''
                percentage = percentage > 0 ? parseFloat(percentage).toFixed(1) : ''
                let date = run ? new Date(run.run.date).getFullYear() : ''
                let videoLink = ''
                let clickable = ''
                if (run) {
                    if (run.run.videos) {
                        videoLink = `window.open('${run.run.videos.links[run.run.videos.links.length - 1].uri}', '_blank')`
                        clickable = 'clickable'
                    }
                }
                let theClass = placeClass(place) ? placeClass(place) : category.class
                let percentile = run ? run.place != '-' ? (run.place / category.runs.runs.length * 100).toFixed(1) : '-' : ''
                HTMLContent += displayPercentile ? `<td style='font-size:12px;text-align:left;' class='${theClass} ${percentageClass}'>${percentile}</td>` : ''
                HTMLContent += displayPercentage ? `<td style='font-size:12px;text-align:left;' class='${theClass} ${percentageClass}'>${percentage}</td>` : ''
                HTMLContent += displayGrade ? `<td style='font-size:12px;text-align:left;' class='${theClass} ${percentageClass}'>${percentageGrade}</td>` : ''
                HTMLContent += displayPlace ? `<td style='font-size:12px;width:20px;' class=${theClass}>${place}</td>` : ''
                HTMLContent += displayTime ? `<td onclick="${videoLink}" class='${theClass} ${clickable}'>${time}</td>` : ''
                HTMLContent += displayYear ? `<td class='${theClass}'>${date}</td>` : ''
            })
            const gpaClass = gpa ? letterGrade.className : ''
            HTMLContent +=
                `<td>${sum}</td>
                <td class='${gpaClass}'>${gpa}</td>
                <td>${categories.length - times.length}</td>
                </tr>`
        }
    })
    HTMLContent += `</table></div>`
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
function placeClass(place, rowColor) {
    let theClass = rowColor
    if (place == 1) {
        return 'first'
    } else if (place == 2) {
        return 'second'
    } else if (place == 3) {
        return 'third'
    }
    return theClass
}
function refresh() {
    fullgame ? getFullGame(game) : prepareLevelBoards(gameID, levelDifficulty, 'currentPatch', highestGrade, DLCnoDLC)
    document.getElementById("refresh").style.display = "none"
}
function showRefresh() {
    document.getElementById("refresh").style.display = ""
}