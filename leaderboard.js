function parseCheckboxes() {
    let displayCheck = ['percentile', 'percentage', 'grade', 'place', 'time', 'year']
    let displayBoolean = []
    displayCheck.forEach(checkbox => {
        displayBoolean.push(document.getElementById('checkbox_' + checkbox).checked)
    })
    return displayBoolean
}
function generateLeaderboard(sortCategoryIndex) {
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
            HTMLContent +=
                `<tr>
                <th colspan=5></th>`
            categories.forEach(category => {
                HTMLContent += `<th colspan=${numCols} class=${getColorClass()}><img src='images/${gameID}/${category.info.id}.png'></th>`
            })
            HTMLContent += `</tr>`
        }
    }
    HTMLContent +=
        `<tr style='font-size:12px'>
        <th colspan=5 class='clickable ${!(sortCategoryIndex > -1) ? 'selected' : ''}' onclick="playSound('equip_move');sortByCriteria('averagePercentage')">Player</td>`
    if (numCols) {
        categories.forEach((category, categoryIndex) => {
            HTMLContent += `<th colspan=${numCols} class='clickable ${categoryIndex == sortCategoryIndex ? 'selected' : ''}' onclick="playSound('equip_move');sortByCategory(${categoryIndex})">${category.name}</td>`
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
function parsePlayer(sortCategoryIndex, player, playerIndex, displayBoolean) {
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
                <td onclick="playSound('cardup');openModal(${playerIndex})" class='clickable ${rowColor}' style='text-align:left;font-weight: bold;${border}'>${getPlayerName(player)}</td>`
        categories.forEach((category, categoryIndex) => {
            const run = player.runs[categoryIndex]
            const time = run ? gameID == 'tetris' ? run.run.score : secondsToHMS(run.run.times.primary_t) : ''
            const place = run ? run.place : ''
            const percentage = run ? getPercentage(run.percentage) : ''
            const percentageObject = run ? getLetterGrade(percentage) : ''
            const percentageClass = run ? percentageObject.className : ''
            const percentageGrade = run ? percentageObject.grade : ''
            const date = run ? new Date(run.run.date).getFullYear() : ''
            const runLink = run && gameID != 'tetris' ? openLink(run.run.weblink) : ''
            const runLinkClickable = run && gameID != 'tetris' ? 'clickable' : ''
            let videoLink = ''
            let videoLinkClickable = ''
            if (run) {
                if (run.run.videos) {
                    videoLink = openLink(run.run.videos.links[run.run.videos.links.length - 1].uri)
                    videoLinkClickable = 'clickable'
                }
            }
            const thePlaceClass = placeClass(place)
            const colorClass = thePlaceClass ? thePlaceClass : category.class
            const percentile = run ? run.place != '-' ? (run.place / category.runs.runs.length * 100).toFixed(1) : '-' : ''
            const grayedOut = sortCategoryIndex > -1 ? categoryIndex == sortCategoryIndex ? '' : 'grayedOut' : ''
            HTMLContent += displayBoolean[0] ? `<td style='font-size:12px;text-align:left;' class='${colorClass} ${grayedOut} ${percentageClass}'>${percentile}</td>` : ''
            HTMLContent += displayBoolean[1] ? `<td style='font-size:12px;text-align:left;' class='${colorClass} ${grayedOut} ${percentageClass}'>${percentage}</td>` : ''
            HTMLContent += displayBoolean[2] ? `<td style='font-size:12px;text-align:left;' class='${colorClass} ${grayedOut} ${percentageClass}'>${percentageGrade}</td>` : ''
            HTMLContent += displayBoolean[3] ? `<td onclick="${runLink}" style='font-size:12px;width:20px;' class='${colorClass} ${grayedOut} ${runLinkClickable}'>${place}</td>` : ''
            HTMLContent += displayBoolean[4] ? `<td onclick="${videoLink}" class='${colorClass} ${grayedOut} ${videoLinkClickable}'>${time}</td>` : ''
            HTMLContent += displayBoolean[5] ? `<td class='${colorClass} ${grayedOut}'>${date}</td>` : ''
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
function toggleDisplayOptions() {
    playSound('move')
    const displayOptionsElem = document.getElementById('displayOptions')
    const displayOptionsButton = document.getElementById('displayOptionsButton')
    if (displayOptions) {
        displayOptions = false
        displayOptionsElem.style.display = 'none'
        displayOptionsButton.innerHTML = `<i class="fa fa-sliders"></i>`
    } else {
        displayOptions = true
        displayOptionsElem.style.display = ''
        displayOptionsButton.innerHTML = '&#10005'
    }
}