function parseCheckboxes() {
    let displayCheck = ['percentage', 'grade', 'place', 'time', 'year']
    displayBoolean = []
    displayCheck.forEach(checkbox => {
        displayBoolean.push(document.getElementById('checkbox_' + checkbox).checked)
    })
    isolated = document.getElementById('checkbox_isolate').checked
    displayNumRuns = document.getElementById('checkbox_numRuns').checked
    milliseconds = document.getElementById('checkbox_milliseconds').checked
}
function playersTable(playersArray) {
    let HTMLContent = `<div class='bigShadow' style='align-self: flex-end;'><div style='overflow-x:scroll;'><table>`
    if (page != 'map' && !(mode == 'commBestILs' && sortCategoryIndex == -1 && isolated)) {
        HTMLContent +=
            `<tr style='${getHeaderSize()}'>
        <th colspan=10 class='clickable gray ${!(sortCategoryIndex > -1 || isolated) ? 'selected' : ''}' onclick="showDefault()">Player</th>
        </tr>`
    }
    if (mode == 'commBestILs') {
        HTMLContent += `<tr></tr>`
    }
    playersArray.forEach((player, playerIndex) => {
        if (sortCategoryIndex == -1 || player.runs[sortCategoryIndex]) {
            if (!(mode == 'commBestILs' && sortCategoryIndex == -1 && isolated && !player.extra)) {
                HTMLContent += parsePlayer(player, playerIndex)
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
            const cellText = !difficultyILs ? `<span style='font-size:175%;padding-left:10px'>${category.info.name}</span>` : ''
            HTMLContent +=
                `<th colspan=${numCols * numCats} ${!extra ? `onclick="getBossIL('${category.info.id}')" class='clickable'` : ''}>
                    <div style='padding:1px 10px' class='container ${category.info.id}'>${getImage(category.info.id)}${cellText}</div>
                </th>`
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
        if (isolated) {
            cellContent = category.name
        } else {
            cellContent = trimDifficulty(category.name)
        }
    }
    let colorClass = category.info ? category.info.id : 'gray'
    if (mode == 'levels' && big5()) {
        colorClass = category.difficulty
    }
    HTMLContent += `<th colspan=${getNumCols()} class='clickable ${!isolated ? isSelected(categoryIndex) : ''} ${colorClass}' onclick="organizePlayers(${categoryIndex})">${cellContent}</td>`
    return HTMLContent
}
function generateLeaderboard() {
    playersCopy = [...players].slice(0, getNumDisplay())
    let HTMLContent = `<div class="container">`
    HTMLContent += playersTable(playersCopy)
    if (!(mode == 'commBestILs' && sortCategoryIndex == -1 && isolated)) {
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
        if (!isolated) {
            HTMLContent += fancyHeader(numCols)
        }
        if (numCols) {
            HTMLContent += `<tr style='${getHeaderSize()}'>`
            if (isolated) {
                HTMLContent += generateHeader(categories[sortCategoryIndex], sortCategoryIndex)
            } else {
                categories.forEach((category, categoryIndex) => {
                    HTMLContent += generateHeader(category, categoryIndex)
                })
            }
        }
        if (mode != 'commBestILs' && !isolated) {
            HTMLContent += !['tetris', 'mtpo'].includes(gameID) ? `<th>Sum</td>` : ''
            HTMLContent += gameID != 'mtpo' ? `<th>GPA</td>` : ''
            HTMLContent += mode != 'fullgame' ? `<th>N/A</td>` : ''
        }
        HTMLContent +=
            `</tr>
        <tbody>`
        if (mode == 'commBestILs') {
            HTMLContent += `<tr>`
            if (isolated) {
                const category = categories[sortCategoryIndex]
                HTMLContent += category.runs[0] ? `<td colspan=${numCols} class='first'>${secondsToHMS(getWorldRecord(category))}</td>` : `<td></td>`
            } else {
                categories.forEach((category, categoryIndex) => {
                    HTMLContent += category.runs[0] ? `<td colspan=${numCols} class='first ${isSelected(categoryIndex)}'>${secondsToHMS(getWorldRecord(category))}</td>` : `<td></td>`
                })
            }
            HTMLContent += `</tr>`
        }
        players.slice(0, getNumDisplay()).forEach((player, playerIndex) => {
            if (sortCategoryIndex == -1 || player.runs[sortCategoryIndex]) {
                HTMLContent += parsePlayerRuns(player, playerIndex)
            }
        })
        HTMLContent += `</tbody></table></div>`
    }
    HTMLContent += `</div>`
    if (!showMore && (sortCategoryIndex == -1 ? players.length > getNumDisplay() : categories[sortCategoryIndex].runs.length > getNumDisplay())) {
        HTMLContent += `<div onclick="showMorePlayers()" class='button' style='margin:0 auto;margin-top:15px'>Show More</div>`
    } else {
        showMore = false
    }
    let leaderboardContainer = document.getElementById('leaderboardContainer')
    const scrollLeft = leaderboardContainer ? leaderboardContainer.scrollLeft : ''
    const leaderboard = document.getElementById('leaderboard')
    leaderboard.innerHTML = HTMLContent
    leaderboardContainer = document.getElementById('leaderboardContainer')
    if (leaderboardContainer) {
        leaderboardContainer.scrollLeft = scrollLeft;
    }
}
function parsePlayer(player, playerIndex) {
    let HTMLContent = ''
    player.numRuns = 0
    player.runs.forEach(run => {
        if (run) {
            player.numRuns++
        }
    })
    player.hasAllRuns = !player.runs.some(run => run == 0)
    player.sum = player.hasAllRuns ? 0 : ''
    if (player.hasAllRuns) {
        player.runs.forEach(run => {
            player.sum += run.score
        })
        player.sum = secondsToHMS(player.sum)
    }
    const letterGrade = getLetterGrade(player.score)
    HTMLContent += `<tr class='${getRowColor(playerIndex)} categoryLabel' style='height:23px'>`
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
    if (mode == 'commBestILs' || ['titanfall_2', 'mtpo'].includes(gameID) || (gameID == 'sm64' && mode == 'levels')) {
        if (mode == 'commBestILs') {
            if (['DLC', 'DLC+Base'].includes(commBestILsCategory.tabName) && !commBestILsCategory.extraPlayers) {
                if (player.extra?.percentage >= 90) {
                    const shot1 = commBestILs[commBestILsCategory.name + ' C/S'].extraPlayers.includes(player.name) ? 'charge' : 'lobber'
                    HTMLContent += `<td>${cupheadShot(shot1, 20, true)}</td>`
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
    if (mode != 'commBestILs') {
        if (gameID != 'mtpo') {
            HTMLContent += `<td style='font-size:75%'>${displayPercentage(player.score)}</td>`
        }
        HTMLContent += `<td class='${letterGrade.className}' style='font-size:75%;text-align:left'>${letterGrade.grade}</td>`
        if (gameID == 'mtpo') {
            HTMLContent += player.hasAllRuns ? `<td class='${letterGrade.className}'>${getGPA(player.score)}</td>` : `<td></td>`
            HTMLContent += player.sum ? `<td>${player.sum}</td>` : `<td></td>`
        }
    }
    HTMLContent += getPlayerDisplay(player)
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
function parsePlayerRuns(player, playerIndex) {
    let HTMLContent = `<tr class=${getRowColor(playerIndex)} style='height:23px'>`
    if (isolated) {
        HTMLContent += parseRun(player, playerIndex, categories[sortCategoryIndex], sortCategoryIndex)
        const categoryName = categories[sortCategoryIndex].name
        if (player.runs[sortCategoryIndex].percentage > 90 && ['DLC', 'DLC+Base'].includes(categoryName)) {
            const shot1 = commBestILs[categoryName + ' C/S'].extraPlayers.includes(player.name) ? 'charge' : 'lobber'
            HTMLContent += `<td>${cupheadShot(shot1, 20, true)}</td>`
            HTMLContent += `<td>${cupheadShot('spread', 20, true)}</td>`
        }
    } else {
        categories.forEach((category, categoryIndex) => {
            HTMLContent += parseRun(player, playerIndex, category, categoryIndex)
        })
        if (mode != 'commBestILs') {
            HTMLContent += !['tetris', 'mtpo'].includes(gameID) ? `<td>${player.sum}</td>` : ''
            if (gameID != 'mtpo') {
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
            if (gameID != 'mtpo' && mode != 'commBestILs' && (playerIndex == 0 || playerIndex == 19)) {
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
                        if (!(gameID == 'mtpo' && categoryIndex == null && booleanIndex == 1)) {
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
    const videoLink = getAnchor(getVideoLink(run))
    if (mode == 'commBestILs' && !exception) {
        const debug = run.debug ? '*' : ''
        HTMLContent += `<td class='${category.className} ${grayedOut} ${videoLink ? 'clickable' : ''}'>${videoLink}${getTrophy(run.place)}${debug}</td>`
    } else {
        HTMLContent += displayBoolean[0] ? `<td style='font-size:75%;text-align:left' class='${newColorClass} ${grayedOut} ${grade.className}'>${percentage}</td>` : ''
        HTMLContent += displayBoolean[1] && !(gameID == 'mtpo' && categoryIndex == null) ? `<td style='font-size:75%;text-align:left;' class='${newColorClass} ${grayedOut} ${grade.className}'>${grade.grade}</td>` : ''
        HTMLContent += displayBoolean[2] ? `<td style='font-size:75%;padding:0 1px' class='${page != 'sort' ? newColorClass : thePlaceClass} ${grayedOut} ${runLink ? 'clickable' : ''}'>${runLink}${trophy ? `<div class='container trophy'>${trophy}` : place}</td>` : ''
        HTMLContent += displayBoolean[3] ? `<td style='padding:0 3px;${gameID == 'mtpo' ? "text-align:left" : ""}' class='${page != 'sort' ? newColorClass : colorClass} ${grayedOut} ${videoLink ? 'clickable' : ''}'>${videoLink}${time}</td>` : ''
        HTMLContent += displayBoolean[4] ? `<td class='${newColorClass} ${grayedOut}'>${new Date(run.date).getFullYear()}</td>` : ''
    }
    return HTMLContent
}
function showMorePlayers() {
    playSound('ready')
    showMore = true
    action()
}
function getHeaderSize() {
    if (bossILindex > -1) {
        return 'width:150px'
    }
    if (big4()) {
        return ''
    }
}