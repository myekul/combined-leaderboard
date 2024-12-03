function parseCheckboxes() {
    let displayCheck = ['percentile', 'percentage', 'grade', 'place', 'time', 'year']
    displayBoolean = []
    displayCheck.forEach(checkbox => {
        displayBoolean.push(document.getElementById('checkbox_' + checkbox).checked)
    })
    isolated = document.getElementById('checkbox_isolate').checked
    if (isolated && sortCategoryIndex == -1) {
        sortCategoryIndex = 0
        organizePlayers(sortCategoryIndex)
    }
}
function playersTable(playersArray) {
    let HTMLContent = `<table ${page == 'leaderboard' ? `class='bigShadow'` : ''} style="align-self: flex-end;margin:0">`
    if (page != 'map') {
        HTMLContent +=
            `<tr style='font-size:12px;${getHeaderSize()}'>
        <th colspan=${getPlayerCols()} class='clickable gray ${!(sortCategoryIndex > -1 || isolated) ? 'selected' : ''}' onclick="showDefault()">Player</th>
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
    HTMLContent += `</table>`
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
    if ((mode == 'levels' && bossILindex == -1) || mode == 'fullgameILs') {
        cellContent = getImage(category.info.id)
    }
    if (gameID == 'cuphead' && mode == 'levels' && big4()) {
        if (isolated) {
            cellContent = category.name
        } else {
            cellContent = trimDifficulty(category.name)
        }
    }
    let colorClass = mode == 'fullgame' ? 'gray' : category.info.id
    if (mode == 'levels' && big5()) {
        colorClass = category.difficulty
    }
    HTMLContent += `<th colspan=${getNumCols()} class='clickable ${!isolated ? isSelected(categoryIndex) : ''} ${colorClass}' onclick="playSound('equip_move');organizePlayers(${categoryIndex})">${cellContent}</td>`
    return HTMLContent
}
function generateLeaderboard() {
    numPlayersDisplay = mode == 'fullgame' ? showMore ? 300 : 100 : showMore ? 100 : 30
    playersCopy = [...players].slice(0, numPlayersDisplay)
    let HTMLContent = `<div class="container">`
    HTMLContent += playersTable(playersCopy)
    HTMLContent +=
        `<div id='leaderboardContainer' class='bigShadow'>
        <table>`
    // if (displayBoolean[0]) {
    //     HTMLContent +=
    //         `<tr>
    //         <th colspan=${getPlayerCols()}></th>`
    //     categories.forEach(category => {
    //         HTMLContent += `<th colspan=${getNumCols()}>${category.runs.length} runs</th>`
    //     })
    //     HTMLContent += `</tr>`
    // }
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
    players.slice(0, numPlayersDisplay).forEach((player, playerIndex) => {
        if (sortCategoryIndex == -1 || player.runs[sortCategoryIndex]) {
            HTMLContent += parsePlayerRuns(player, playerIndex)
        }
    })
    HTMLContent += `</tbody></table></div></div>`
    if (!showMore && (sortCategoryIndex == -1 ? players.length > numPlayersDisplay : categories[sortCategoryIndex].runs.length > numPlayersDisplay)) {
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
    player.scores = [];
    player.hasAllRuns = true
    player.runs.forEach(run => {
        if (run) {
            gameID == 'tetris' ? player.scores.push(null) : player.scores.push(run.score)
        } else {
            player.hasAllRuns = false;
        }
    })
    player.sum = player.hasAllRuns ? 0 : ''
    player.gpa = player.hasAllRuns ? parseFloat(getGPA(player.averagePercentage).slice(0, 3)).toFixed(1) : ''
    if (player.hasAllRuns) {
        player.scores.forEach(score => {
            player.sum += score
        })
        player.sum = secondsToHMS(player.sum)
    }
    let percentage = getPercentage(player.averagePercentage)
    let letterGrade = getLetterGrade(percentage)
    HTMLContent += `<tr class='${getRowColor(playerIndex)} categoryLabel' style='height:22px'>`
    if (mode == 'fullgameILs') {
        if (player.extra) {
            const extra = player.extra
            const newLetterGrade = getLetterGrade(getPercentage(extra.percentage))
            const thePlaceClass = placeClass(extra.place)
            const className = thePlaceClass ? thePlaceClass : mode == 'fullgameILs' ? fullgameILsCategory.className : sm64[0].className
            HTMLContent += `<td class='${newLetterGrade.className}' style='font-size:12px'>${newLetterGrade.grade}</td>`
            HTMLContent += gameID == 'sm64' ? `<td class='${className}' style='font-size:12px'>${player.extra.place}</td>` : ''
            HTMLContent += `<td class='${className} '>${secondsToHMS(player.extra.score)}</td>`
        } else {
            HTMLContent += `<td></td><td></td>`
            if (gameID == 'sm64') {
                HTMLContent += `<td></td>`
            }
        }
    }
    if (gameID == 'sm64' && mode == 'levels') {
        HTMLContent += parseRun(player, playerIndex, extraCategory)
    }
    HTMLContent += page == 'map' ? `<td class='${placeClass(playerIndex + 1)}'>${playerIndex + 1}</td>` : ''
    HTMLContent += (mode != 'fullgameILs' && !WRmode) ? `<td style='font-size:12px'>${percentage}</td>` : ''
    HTMLContent += (mode != 'fullgameILs' && !WRmode) ? `<td class='${letterGrade.className}' style='text-align:left'>${letterGrade.grade}</td>` : ''
    HTMLContent += `<td class='${placeClass(player.rank)}'>${player.rank}</td>`
    HTMLContent += `<td>${getPlayerFlag(player, 13)}</td>`
    HTMLContent += `<td onclick="playSound('cardup');openModal(${player.rank - 1})" class='clickable' style='text-align:left;font-weight: bold;padding-right:5px'>${getPlayerName(player)}</td>`
    if (page == 'map') {
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
            const gpaClass = player.gpa ? getLetterGrade(getPercentage(player.averagePercentage)).className : ''
            HTMLContent += gameID == 'tetris' ? '' : `<td>${player.sum}</td>`
            HTMLContent +=
                `<td class='${gpaClass}'>${player.gpa}</td>
                <td>${categories.length - player.scores.length}</td>`
        }
    }
    HTMLContent += `</tr>`
    return HTMLContent
}
function parseRun(player, playerIndex, category, categoryIndex) {
    let HTMLContent = ``
    let colorClass = category.className ? category.className : ''
    const grayedOut = categoryIndex != null && sortCategoryIndex > -1 ? categoryIndex == sortCategoryIndex ? '' : 'grayedOut' : ''
    const run = categoryIndex == null ? player.extra : player.runs[categoryIndex]
    if (!run) {
        if (!(mode == 'fullgameILs' || WRmode)) {
            numPlayersDisplay = mode == 'fullgame' ? showMore ? 300 : 100 : showMore ? 100 : 30
            if (sortCategoryIndex == -1 ? playerIndex == numPlayersDisplay - 1 : playerIndex == categories[sortCategoryIndex].runs.length - 1) {
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
    const place = run ? run.place : ''
    const percentage = getPercentage(run.percentage)
    const percentageObject = getLetterGrade(percentage)
    const percentageClass = percentageObject.className
    const percentageGrade = percentageObject.grade
    const date = new Date(run.date).getFullYear()
    const runLink = gameID != 'tetris' ? openLink(run.weblink) : ''
    const videoLink = getVideoLink(run)
    const thePlaceClass = placeClass(place)
    colorClass = thePlaceClass ? thePlaceClass : category.className
    const percentile = run.place != '-' ? (run.place / category.runs.length * 100).toFixed(1) : '-'
    if (mode == 'fullgameILs' || WRmode) {
        const debug = run.debug ? '*' : ''
        HTMLContent += `<td onclick="${videoLink}" class='${category.className} ${grayedOut} ${videoLink ? 'clickable' : ''}'>${getTrophy(run.place)}${debug}</td>`
    } else {
        HTMLContent += displayBoolean[0] ? `<td style='font-size:12px;text-align:left;' class='${colorClass} ${grayedOut} ${percentageClass}'>${percentile}</td>` : ''
        HTMLContent += displayBoolean[1] ? `<td style='font-size:12px;text-align:left;' class='${colorClass} ${grayedOut} ${percentageClass}'>${percentage}</td>` : ''
        HTMLContent += displayBoolean[2] ? `<td style='font-size:12px;text-align:left;' class='${colorClass} ${grayedOut} ${percentageClass}'>${percentageGrade}</td>` : ''
        HTMLContent += displayBoolean[3] ? `<td onclick="${runLink}" style='font-size:12px;' class='${colorClass} ${grayedOut} ${runLink ? 'clickable' : ''}'>${place}</td>` : ''
        HTMLContent += displayBoolean[4] ? `<td onclick="${videoLink}" class='${colorClass} ${grayedOut} ${videoLink ? 'clickable' : ''}'>${time}</td>` : ''
        HTMLContent += displayBoolean[5] ? `<td class='${colorClass} ${grayedOut}'>${date}</td>` : ''
    }
    return HTMLContent
}
function showMorePlayers() {
    playSound('ready')
    showMore = true
    generateLeaderboard()
}
function getHeaderSize() {
    if (bossILindex > -1) {
        return 'width:150px'
    }
    if (allILs || difficultyILs || isleIndex > -1 || groundPlane) {
        return ''
    }
}