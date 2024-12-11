function parseCheckboxes() {
    let displayCheck = ['percentile', 'percentage', 'grade', 'place', 'time', 'year']
    displayBoolean = []
    displayCheck.forEach(checkbox => {
        displayBoolean.push(document.getElementById('checkbox_' + checkbox).checked)
    })
    isolated = document.getElementById('checkbox_isolate').checked
    displayNumRuns = document.getElementById('checkbox_numRuns').checked
    milliseconds = document.getElementById('checkbox_milliseconds').checked
    if (isolated && sortCategoryIndex == -1) {
        sortCategoryIndex = 0
        organizePlayers(sortCategoryIndex)
    }
}
function playersTable(playersArray) {
    let HTMLContent = `<div class='bigShadow' style='align-self: flex-end;'><div style='overflow-x:scroll;'><table>`
    if (page != 'map') {
        HTMLContent +=
            `<tr style='font-size:12px;${getHeaderSize()}'>
        <th colspan=10 class='clickable gray ${!(sortCategoryIndex > -1 || isolated) ? 'selected' : ''}' onclick="showDefault()">Player</th>
        </tr>`
    }
    if (mode == 'fullgameILs' || WRmode) {
        HTMLContent += `<tr></tr>`
    }
    playersArray.forEach((player, playerIndex) => {
        if (sortCategoryIndex == -1 || player.runs[sortCategoryIndex]) {
            HTMLContent += parsePlayer(player, playerIndex)
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
            const numCats = getNumCats(category)
            const cellText = !difficultyILs ? `<span style='font-size:20px;padding-left:10px'>${category.info.name}</span>` : ''
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
    if ((category.info && bossILindex == -1) || mode == 'fullgameILs') {
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
    HTMLContent += `<th colspan=${getNumCols()} class='clickable ${!isolated ? isSelected(categoryIndex) : ''} ${colorClass}' onclick="playSound('equip_move');organizePlayers(${categoryIndex})">${cellContent}</td>`
    return HTMLContent
}
function generateLeaderboard() {
    playersCopy = [...players].slice(0, getNumDisplay())
    let HTMLContent = `<div class="container">`
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
    if (!(mode == 'fullgameILs' || WRmode || isolated)) {
        HTMLContent += gameID == 'tetris' ? '' : `<th>Sum</td>`
        HTMLContent +=
            `<th>GPA</td>
            <th>N/A</td>`
    }
    HTMLContent +=
        `</tr>
        <tbody>`
    if ((mode == 'fullgameILs' || WRmode)) {
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
    HTMLContent += `</tbody></table></div></div>`
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
    leaderboardContainer.scrollLeft = scrollLeft;
}
function parsePlayer(player, playerIndex) {
    let HTMLContent = ''
    player.hasAllRuns = true
    player.numRuns = 0
    player.runs.forEach(run => {
        if (run) {
            player.numRuns++
        } else {
            player.hasAllRuns = false;
        }
    })
    player.sum = player.hasAllRuns ? 0 : ''
    if (player.hasAllRuns) {
        player.runs.forEach(run => {
            player.sum += run.score
        })
        player.sum = secondsToHMS(player.sum)
    }
    player.gpa = player.hasAllRuns ? parseFloat(getGPA(player.score).slice(0, 3)).toFixed(1) : ''
    let percentage = getPercentage(player.score)
    let letterGrade = getLetterGrade(percentage)
    HTMLContent += `<tr class='${getRowColor(playerIndex)} categoryLabel' style='height:22px'>`
    if (mode == 'fullgameILs') {
        if (player.extra) {
            const extra = player.extra
            const grade = getLetterGrade(getPercentage(extra.percentage))
            const thePlaceClass = placeClass(extra.place)
            const className = thePlaceClass ? thePlaceClass : mode == 'fullgameILs' ? fullgameILsCategory.className : sm64[0].className
            HTMLContent += `<td class='${grade.className}' style='font-size:12px;text-align:left'>${grade.grade}</td>`
            HTMLContent += gameID == 'sm64' ? `<td class='${className}' style='font-size:12px'>${player.extra.place}</td>` : ''
            HTMLContent += `<td class='${className} '>${secondsToHMS(player.extra.score)}</td>`
        } else {
            HTMLContent += `<td></td><td></td>`
            if (gameID == 'sm64') {
                HTMLContent += `<td></td>`
            }
        }
    }
    if (gameID == 'titanfall_2' || (gameID == 'sm64' && mode == 'levels')) {
        HTMLContent += parseRun(player, playerIndex, extraCategory)
    }
    HTMLContent += page == 'map' ? `<td class='${placeClass(playerIndex + 1)}'>${playerIndex + 1}</td>` : ''
    HTMLContent += (mode != 'fullgameILs' && !WRmode) ? `<td style='font-size:12px'>${displayPercentage(percentage)}</td>` : ''
    HTMLContent += (mode != 'fullgameILs' && !WRmode) ? `<td class='${letterGrade.className}' style='text-align:left'>${letterGrade.grade}</td>` : ''
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
    let HTMLContent = `<tr class=${getRowColor(playerIndex)} style='height:22px'>`
    if (isolated) {
        HTMLContent += parseRun(player, playerIndex, categories[sortCategoryIndex], sortCategoryIndex)
    } else {
        categories.forEach((category, categoryIndex) => {
            HTMLContent += parseRun(player, playerIndex, category, categoryIndex)
        })
        if (!(mode == 'fullgameILs' || WRmode)) {
            const gpaClass = player.gpa ? getLetterGrade(getPercentage(player.score)).className : ''
            HTMLContent += gameID == 'tetris' ? '' : `<td>${player.sum}</td>`
            HTMLContent +=
                `<td class='${gpaClass}'>${player.gpa}</td>
                <td>${categories.length - player.numRuns}</td>`
        }
    }
    HTMLContent += `</tr>`
    return HTMLContent
}
function parseRun(player, playerIndex, category, categoryIndex) {
    let HTMLContent = ``
    let colorClass = category.className ? category.className : ''
    colorClass = category.info ? category.info.id : colorClass
    const grayedOut = categoryIndex != null && sortCategoryIndex > -1 ? categoryIndex == sortCategoryIndex ? '' : 'grayedOut' : ''
    const run = categoryIndex == null ? player.extra : player.runs[categoryIndex]
    if (!run) {
        if (!(mode == 'fullgameILs' || WRmode)) {
            if (sortCategoryIndex == -1 ? playerIndex == getNumDisplay() - 1 : playerIndex == categories[sortCategoryIndex].runs.length - 1) {
                HTMLContent += displayBoolean[0] ? `<td class='hiddenText ${colorClass} ${grayedOut}' style='font-size:12px;text-align:left;'>99.9</td>` : ''
                HTMLContent += displayBoolean[1] ? `<td class='hiddenText ${colorClass} ${grayedOut}' style='font-size:12px;text-align:left;'>100.0</td>` : ''
                HTMLContent += displayBoolean[2] ? `<td class='hiddenText ${colorClass} ${grayedOut}' style='font-size:12px;text-align:left;'>A+</td>` : ''
                HTMLContent += displayBoolean[3] ? `<td class='hiddenText ${colorClass} ${grayedOut}' style='font-size:12px;text-align:left;'>99</td>` : ''
                HTMLContent += displayBoolean[4] ? `<td class='hiddenText ${colorClass} ${grayedOut}'>9:99</td>` : ''
                HTMLContent += displayBoolean[5] ? `<td class='hiddenText ${colorClass} ${grayedOut}'>9999</td>` : ''
            } else {
                displayBoolean.forEach(boolean => {
                    HTMLContent += boolean ? `<td class='${colorClass} ${grayedOut}'></td>` : ''
                })
            }
        } else {
            HTMLContent += `<td></td>`
        }
        return HTMLContent
    }
    const score = run.score
    const time = gameID == 'tetris' ? score : secondsToHMS(score)
    const place = run.place
    const percentage = getPercentage(run.percentage)
    const grade = getLetterGrade(percentage)
    const thePlaceClass = placeClass(place)
    const newColorClass = thePlaceClass ? thePlaceClass : colorClass
    const percentile = run.place != '-' ? (run.place / category.runs.length * 100).toFixed(1) : '-'
    const runLink = gameID != 'tetris' ? openLink(run.weblink) : ''
    const videoLink = getVideoLink(run)
    if (mode == 'fullgameILs' || (WRmode && page != 'sort')) {
        const debug = run.debug ? '*' : ''
        HTMLContent += `<td onclick="${videoLink}" class='${category.className} ${grayedOut} ${videoLink ? 'clickable' : ''}'>${getTrophy(run.place)}${debug}</td>`
    } else {
        HTMLContent += displayBoolean[0] ? `<td style='font-size:12px;text-align:left;' class='${newColorClass} ${grayedOut} ${grade.className}'>${percentile}</td>` : ''
        HTMLContent += displayBoolean[1] ? `<td style='font-size:12px;text-align:left;' class='${newColorClass} ${grayedOut} ${grade.className}'>${percentage}</td>` : ''
        HTMLContent += displayBoolean[2] ? `<td style='font-size:12px;text-align:left;' class='${newColorClass} ${grayedOut} ${grade.className}'>${grade.grade}</td>` : ''
        HTMLContent += displayBoolean[3] ? `<td onclick="${runLink}" style='font-size:12px;' class='${page != 'sort' ? newColorClass : thePlaceClass} ${grayedOut} ${runLink ? 'clickable' : ''}'>${place}</td>` : ''
        HTMLContent += displayBoolean[4] ? `<td onclick="${videoLink}" class='${page != 'sort' ? newColorClass : colorClass} ${grayedOut} ${videoLink ? 'clickable' : ''}'>${time}</td>` : ''
        HTMLContent += displayBoolean[5] ? `<td class='${newColorClass} ${grayedOut}'>${new Date(run.date).getFullYear()}</td>` : ''
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