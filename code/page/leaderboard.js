function parseCheckboxes() {
    let displayCheck = ['percentage', 'grade', 'place', 'time', 'year']
    displayBoolean = []
    displayCheck.forEach(checkbox => {
        displayBoolean.push(document.getElementById('checkbox_' + checkbox).checked)
    })
    displayNumRuns = document.getElementById('checkbox_numRuns').checked
    milliseconds = document.getElementById('checkbox_milliseconds').checked
}
function playersTable(playersArray, categoryIndex) {
    let HTMLContent = `<div class='bigShadow' ${page != 'leaderboards' ? `style='align-self: flex-end;'` : ''}><div style='overflow-x:scroll;'><table>`
    if (!['leaderboards', 'map'].includes(page)) {
        HTMLContent +=
            `<tr style='${getHeaderSize()}'>
        <th colspan=10 class='clickable gray ${!(sortCategoryIndex > -1) ? 'selected' : ''}' onclick="showDefault()">Player</th>
        </tr>`
    }
    if (mode == 'commBestILs') {
        HTMLContent += `<tr></tr>`
    }
    playersArray.forEach((player, playerIndex) => {
        if (sortCategoryIndex == -1 || player.runs[sortCategoryIndex]) {
            if (!(mode == 'commBestILs' && sortCategoryIndex == -1 && page == 'leaderboards' && !player.extra)) {
                HTMLContent += parsePlayer(player, playerIndex, categoryIndex)
            }
        }
    })
    HTMLContent += `</table></div></div>`
    return HTMLContent
}
function fancyHeader(numCols, extra) {
    let HTMLContent = ''
    if (gameID == 'cuphead' && mode == 'levels' && numCols && big4()) {
        let categoryIndex = 0
        while (categoryIndex < categories.length) {
            const category = categories[categoryIndex]
            const numCats = cupheadNumCats(category)
            const cellText = !difficultyILs ? `<span style='font-size:120%;font-weight:bold'>${category.info.name}</span>` : ''
            HTMLContent +=
                `<td colspan=${numCols * numCats} ${!extra ? `onclick="getBossIL('${category.info.id}')" class='clickable'` : ''}>
                    <div style='padding:1px 10px;gap:10px' class='container ${category.info.id}'>${getImage(category.info.id, 36)}${cellText}</div>
                </td>`
            categoryIndex += numCats
        }
    }
    return HTMLContent
}
function generateHeader(category, categoryIndex) {
    let HTMLContent = ''
    let cellContent = category.name
    if ((category.info && bossILindex == -1) || mode == 'commBestILs') {
        cellContent = getImage(category.info.id)
    }
    if (gameID == 'cuphead' && mode == 'levels' && big5()) {
        if (page == 'leaderboards') {
            cellContent = category.name
        } else {
            cellContent = trimDifficulty(category.name)
        }
    }
    let colorClass = category.info ? category.info.id : 'gray'
    if (mode == 'levels' && big5()) {
        colorClass = category.difficulty
    }
    HTMLContent += `<th colspan=${getNumCols()} class='clickable ${page != 'leaderboards' ? isSelected(categoryIndex) : ''} ${colorClass}' onclick="organizePlayers(${categoryIndex})">${cellContent}</td>`
    return HTMLContent
}
function generateLeaderboard() {
    playersCopy = [...players].slice(0, getNumDisplay())
    let HTMLContent = `<div class="container" style='align-items:flex-start'>`
    HTMLContent += playersTable(playersCopy)
    HTMLContent +=
        `<div id='leaderboardContainer' class='bigShadow'>
        <table>`
    if (displayNumRuns) {
        categories.forEach(category => {
            let numRuns = category.runs.length
            let runs = numRuns > 1 ? 'runs' : 'run'
            if (numRuns == 300) {
                numRuns += '+'
            }
            HTMLContent += `<th colspan=${getNumCols()}>${numRuns} ${runs}</th>`
        })
    }
    HTMLContent += `</tr>`
    const numCols = getNumCols()
    if (page != 'leaderboards') {
        HTMLContent += fancyHeader(numCols)
    }
    if (numCols) {
        HTMLContent += `<tr style='${getHeaderSize()}'>`
        if (page == 'leaderboards') {
            HTMLContent += generateHeader(categories[sortCategoryIndex], sortCategoryIndex)
        } else {
            categories.forEach((category, categoryIndex) => {
                HTMLContent += generateHeader(category, categoryIndex)
            })
        }
    }
    if (mode != 'commBestILs' && page != 'leaderboards') {
        HTMLContent += !['tetris', 'mtpo', 'spo', 'ssb64', 'ssbm'].includes(gameID) ? `<th>Sum</td>` : ''
        HTMLContent += !['mtpo', 'spo', 'ssb64', 'ssbm'].includes(gameID) ? `<th>GPA</td>` : ''
        HTMLContent += mode != 'fullgame' ? `<th>N/A</td>` : ''
    }
    HTMLContent +=
        `</tr>`
    if (mode == 'commBestILs') {
        HTMLContent += `<tr>`
        if (page == 'leaderboards') {
            const category = categories[sortCategoryIndex]
            HTMLContent += category.runs[0] ? `<td colspan=${numCols} class='first'>${secondsToHMS(getWorldRecord(category))}</td>` : `<td></td>`
        } else {
            categories.forEach((category, categoryIndex) => {
                HTMLContent += category.runs[0] ? `<th colspan=${numCols} class='first ${isSelected(categoryIndex)}'>${secondsToHMS(getWorldRecord(category))}</th>` : `<td></td>`
            })
        }
        HTMLContent += `</tr>`
    }
    players.slice(0, getNumDisplay()).forEach((player, playerIndex) => {
        if (sortCategoryIndex == -1 || player.runs[sortCategoryIndex]) {
            HTMLContent += parsePlayerRuns(player, playerIndex)
        }
    })
    HTMLContent += `</table></div>`
    HTMLContent += `</div>`
    if (!showMore && (sortCategoryIndex == -1 ? players.length > getNumDisplay() : categories[sortCategoryIndex].runs.length > getNumDisplay())) {
        HTMLContent += `<div onclick="showMorePlayers()" class='button' style='margin:0 auto;margin-top:15px'>Show More</div>`
    } else {
        showMore = false
    }
    let leaderboardContainer = document.getElementById('leaderboardContainer')
    const scrollLeft = leaderboardContainer ? leaderboardContainer.scrollLeft : ''
    document.getElementById('leaderboard').innerHTML = HTMLContent
    leaderboardContainer = document.getElementById('leaderboardContainer')
    if (leaderboardContainer) {
        leaderboardContainer.scrollLeft = scrollLeft;
    }
}
function parsePlayer(player, playerIndex, categoryIndex) {
    let HTMLContent = ''
    player.numRuns = 0
    player.runs.forEach(run => {
        if (run) {
            player.numRuns++
        }
    })
    player.hasAllRuns = !player.runs.some(run => run == 0)
    if (!player.sum) {
        player.sum = player.hasAllRuns ? 0 : ''
        if (player.hasAllRuns) {
            player.runs.forEach(run => {
                player.sum += run.score
            })
            player.sum = secondsToHMS(player.sum)
        }
    }
    const letterGrade = getLetterGrade(player.score)
    const pulseClass = localStorage.getItem('username') == player.name ? 'pulseClass' : ''
    HTMLContent += `<tr class='${getRowColor(playerIndex)} categoryLabel ${pulseClass}' style='height:23px'>`
    if (categoryIndex > -1) {
        const categoryName = categories[categoryIndex].name
        if (['DLC', 'DLC+Base'].includes(categoryName) && !fullgameCategory) {
            if (player.runs[categoryIndex].percentage > 90) {
                HTMLContent += `<td>${cupheadShot(determineShot1(player, categoryName), 20, true)}</td>`
                HTMLContent += `<td>${cupheadShot('spread', 20, true)}</td>`
            } else {
                HTMLContent += `<td></td><td></td>`
            }
        }
        HTMLContent += parseRun(player, playerIndex, categories[categoryIndex], categoryIndex)
    }
    if (page == 'sort') {
        const sortCriteria = document.getElementById('dropdown_sortCriteria').value
        if (sortCriteria == 'joindate') {
            HTMLContent += `<td>${player.signup}</td>`
        } else if (sortCriteria == 'bestScore') {
            const runIndex = player.runs.findIndex(run => run.percentage == player.bestScore)
            HTMLContent += parseRun(player, playerIndex, categories[runIndex], runIndex)
            HTMLContent += `<td style='padding:0 10px'></td>`
        }
    }
    if (mode == 'commBestILs' || ['titanfall_2', 'mtpo', 'spo'].includes(gameID) || (['sm64', 'nsmbw'].includes(gameID) && mode == 'levels')) {
        if (mode == 'commBestILs') {
            if (['DLC', 'DLC+Base'].includes(commBestILsCategory.tabName) && !commBestILsCategory.extraPlayers) {
                if (player.extra?.percentage >= 90) {
                    HTMLContent += `<td>${cupheadShot(determineShot1(player), 20, true)}</td>`
                    HTMLContent += `<td>${cupheadShot('spread', 20, true)}</td>`
                } else {
                    HTMLContent += `<td></td><td></td>`
                }
            }
        }
        HTMLContent += parseRun(player, playerIndex, extraCategory, null, true)
        HTMLContent += mode != 'commBestILs' ? `<td style='padding:0 15px'></td>` : ''
    }
    HTMLContent += page == 'map' ? `<td class='${placeClass(playerIndex + 1)}'>${playerIndex + 1}</td>` : ''
    if (mode != 'commBestILs' && page != 'leaderboards') {
        if (!['mtpo', 'spo'].includes(gameID)) {
            HTMLContent += `<td style='font-size:75%'>${displayPercentage(player.score)}</td>`
        }
        HTMLContent += `<td class='${letterGrade.className}' style='font-size:75%;text-align:left'>${letterGrade.grade}</td>`
        if (['mtpo', 'spo', 'ssb64', 'ssbm'].includes(gameID)) {
            HTMLContent += player.hasAllRuns ? `<td class='${letterGrade.className}'>${getGPA(player.score)}</td>` : `<td></td>`
            if (!(gameID == 'ssbm' && ssbVar)) {
                HTMLContent += player.sum ? `<td>${player.sum}</td>` : `<td></td>`
            }
        }
    }
    HTMLContent += getPlayerDisplay(player, playerIndex)
    if (['map', 'sort'].includes(page)) {
        if (sortCategoryIndex == -1) {
            player.count1 = 0
            player.count2 = 0
            player.count3 = 0
            player.runs.forEach(run => {
                if (run) {
                    if (run.place == 1) {
                        player.count1++
                    } else if (run.place == 2) {
                        player.count2++
                    } else if (run.place == 3) {
                        player.count3++
                    }
                }
            })
            HTMLContent += trophyCase(player)
        } else {
            HTMLContent += parseRun(player, playerIndex, categories[sortCategoryIndex], sortCategoryIndex)
        }
    }
    HTMLContent += `</tr>`
    return HTMLContent
}
function determineShot1(player, categoryName) {
    const category = categoryName ? categoryName : commBestILsCategory.name
    if (commBestILs[category + ' L/S'].extraPlayers?.includes(player.name)) {
        return 'lobber'
    } else if (commBestILs[category + ' C/S'].extraPlayers?.includes(player.name)) {
        return 'charge'
    }
}
function parsePlayerRuns(player, playerIndex) {
    let HTMLContent = `<tr class=${getRowColor(playerIndex)} style='height:23px'>`
    if (page == 'leaderboards') {
        HTMLContent += parseRun(player, playerIndex, categories[sortCategoryIndex], sortCategoryIndex)
    } else {
        categories.forEach((category, categoryIndex) => {
            HTMLContent += parseRun(player, playerIndex, category, categoryIndex)
        })
        if (mode != 'commBestILs') {
            HTMLContent += !['tetris', 'mtpo', 'spo', 'ssb64', 'ssbm'].includes(gameID) ? `<td>${player.sum}</td>` : ''
            if (!['mtpo', 'spo', 'ssb64', 'ssbm'].includes(gameID)) {
                const gpaClass = player.hasAllRuns ? getLetterGrade(player.score).className : ''
                HTMLContent += player.hasAllRuns ? `<td class='${gpaClass}'>${getGPA(player.score)}</td>` : '<td></td>'
            }
            HTMLContent += mode != 'fullgame' ? `<td>${categories.length - player.numRuns}</td>` : ''
        }
    }
    HTMLContent += `</tr>`
    return HTMLContent
}
function parseRun(player, playerIndex, category, categoryIndex, exception) {
    let HTMLContent = ``
    let colorClass = category.className ? category.className : ''
    colorClass = category.info ? category.info.id : colorClass
    const grayedOut = categoryIndex != null && sortCategoryIndex > -1 ? categoryIndex == sortCategoryIndex ? '' : 'grayedOut' : ''
    const run = categoryIndex == null ? player.extra : player.runs[categoryIndex]
    if (!run) {
        if (mode != 'commBestILs' || exception) {
            if (!['mtpo', 'spo'].includes(gameID) && mode != 'commBestILs' && (playerIndex == 0 || playerIndex == 19)) {
                HTMLContent += displayBoolean[0] ? `<td class='hiddenText ${colorClass} ${grayedOut}' style='font-size:75%;text-align:left;'>100.0</td>` : ''
                HTMLContent += displayBoolean[1] ? `<td class='hiddenText ${colorClass} ${grayedOut}' style='font-size:75%;text-align:left;'>A+</td>` : ''
                HTMLContent += displayBoolean[2] ? `<td class='hiddenText ${colorClass} ${grayedOut}' style='font-size:75%;text-align:left;'>99</td>` : ''
                HTMLContent += displayBoolean[3] ? `<td class='hiddenText ${colorClass} ${grayedOut}'>9:99</td>` : ''
                HTMLContent += displayBoolean[4] ? `<td class='hiddenText ${colorClass} ${grayedOut}'>9999</td>` : ''
            } else {
                displayBoolean.forEach((boolean, booleanIndex) => {
                    if (booleanIndex == 2) {
                        HTMLContent += boolean ? `<td class='${colorClass} ${grayedOut}' style='padding:0 10px'></td>` : ''
                    } else {
                        if (!(['mtpo', 'spo'].includes(gameID) && categoryIndex == null && booleanIndex == 1)) {
                            HTMLContent += boolean ? `<td class='${colorClass} ${grayedOut}'></td>` : ''
                        }
                    }
                })
            }
        } else {
            HTMLContent += `<td></td>`
        }
        return HTMLContent
    }
    const score = run.score
    const time = tetrisCheck(category, score)
    const place = run.place
    const trophy = getTrophy(place)
    const percentage = run.percentage.toFixed(2)
    const grade = getLetterGrade(percentage)
    const thePlaceClass = placeClass(place)
    const newColorClass = thePlaceClass ? thePlaceClass : colorClass
    const runLink = gameID != 'tetris' && run.id ? getAnchor('https://www.speedrun.com/' + gameID + '/runs/' + run.id) : ''
    const videoLink = getAnchor(run.url)
    if (mode == 'commBestILs' && !exception) {
        const debug = run.debug ? '*' : ''
        HTMLContent += `<td class='${category.className} ${grayedOut} ${videoLink ? 'clickable' : ''}'>${videoLink}${getTrophy(run.place)}${debug}</td>`
    } else {
        HTMLContent += displayBoolean[0] ? `<td style='font-size:75%;text-align:left' class='${newColorClass} ${grayedOut} ${grade.className}'>${percentage}</td>` : ''
        HTMLContent += displayBoolean[1] && !(['mtpo', 'spo'].includes(gameID) && categoryIndex == null) ? `<td style='font-size:75%;text-align:left;' class='${newColorClass} ${grayedOut} ${grade.className}'>${grade.grade}</td>` : ''
        HTMLContent += displayBoolean[2] ? `<td style='font-size:75%;padding:0 1px' class='${page != 'sort' ? newColorClass : thePlaceClass} ${grayedOut} ${runLink ? 'clickable' : ''}'>${runLink}${trophy ? `<div class='container trophy'>${trophy}` : place}</td>` : ''
        HTMLContent += displayBoolean[3] ? `<td style='padding:0 3px;${['mtpo', 'spo'].includes(gameID) ? "text-align:left" : ""}' class='${page != 'sort' ? newColorClass : colorClass} ${grayedOut} ${videoLink ? 'clickable' : ''}'>${videoLink}${time}</td>` : ''
        HTMLContent += displayBoolean[4] ? `<td class='${newColorClass} ${grayedOut}'>${new Date(run.date).getFullYear()}</td>` : ''
    }
    return HTMLContent
}
function showMorePlayers() {
    playSound('ready')
    showMore = true
    action()
}
// Comm Best IL mugshot width
function getHeaderSize() {
    if (bossILindex > -1) {
        return 'width:150px'
    }
    if (big4()) {
        return ''
    }
}