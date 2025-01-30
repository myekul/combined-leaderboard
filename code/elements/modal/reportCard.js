function reportCard(player) {
    let HTMLContent = `<div class='container'><table>`
    if (gameID == 'cuphead' && mode == 'levels' && big5()) {
        let categoryIndex = 0
        while (categoryIndex < categories.length) {
            const category = categories[categoryIndex]
            const numCats = getNumCats(category)
            for (let i = 1; i <= numCats; i++) {
                const run = player.runs[categoryIndex]
                const percentage = run?.percentage
                const place = run?.place
                HTMLContent += `<tr class='${getRowColor(categoryIndex)}'>`
                if (i == 1) {
                    HTMLContent += `<th rowspan=${numCats} class='${category.info.id}'>${getImage(category.info.id)}</th>`
                }
                const thisCategory = categories[categoryIndex]
                HTMLContent += `<td>${getTrophy(place)}</td>`
                HTMLContent += `<td class='${thisCategory.difficulty}' style='text-align:left'>${difficultyILs ? trimDifficulty(thisCategory.name) : thisCategory.name}</td>`
                if (run) {
                    HTMLContent += reportCardSection(category, categoryIndex, run.score, percentage)
                }
                categoryIndex++
            }
            HTMLContent += `</tr>`
        }
    } else {
        categories.forEach((category, categoryIndex) => {
            const run = player.runs[categoryIndex]
            const place = run?.place
            let image = ''
            if (category.info) {
                image = getImage(category.info.id, 21)
            }
            HTMLContent +=
                `<tr>
                    <td style='color:white;padding-right:3px;text-align:right'>${run?.debug ? '*' : ''}${getTrophy(place)}</td>`
            HTMLContent += image ? `<td id='modal-img' class='${classNameLogic(category)}'>${image}</td>` : ''
            HTMLContent += `<td class='${classNameLogic(category)}' style='text-align:left'>${category.name}</td>`
            if (run && mode != 'fullgameILs') {
                HTMLContent += reportCardSection(category, categoryIndex, run.score, run.percentage)
            }
            HTMLContent += `</tr>`
        })
    }
    HTMLContent += `</table>`
    // HTMLContent += `<div><div id='modal_rankComparison' style='min-width:70px'>${rankComparison(player.rank)}</div></div>`
    HTMLContent += `</div>`
    if (mode != 'fullgameILs') {
        HTMLContent += `<div class='container'>`
        HTMLContent += `<div id='modal_letterScore'>${displayLetterScore(player.score)}</div>`
        HTMLContent += `<div id='modal_letterGrade' style='display:none'>${displayLetterGrade(player.score)}</div>`
        HTMLContent +=
            `<div class='textBox'><table class='otherColor'>
            <tr>
                <td>Rank:</td>
                <td id='modal_rank'>${player.rank}</td>
            </tr>`
        if (player.hasAllRuns) {
            HTMLContent +=
                `<tr>
                    <td>GPA:</td>
                    <td id='modal_gpa'>${getGPA(player.score)}</td>
                </tr>`
        }
        HTMLContent += `</table></div>`
        HTMLContent += `<div id='modal_refresh' onclick="toggleSliders();toggleSliders()" class='clickable' style='display:none;padding-left:10px'><i class='fa fa-refresh'></i></div>`
        HTMLContent += `</div>`
        if (player.hasAllRuns) {
            HTMLContent += `<div id='modal_sliders' onclick="toggleSliders()" class='container clickable' style='width:50px'><i class="fa fa-sliders"></i></div>`
        }
    }
    return HTMLContent
}
// function rankComparison(rank) {
//     let HTMLContent = '<table>'
//     const thisPlayer = players[globalPlayerIndex]
//     let player2 = players[rank - 2]
//     if (player2?.name == thisPlayer.name) {
//         player2 = players[rank - 1]
//     }
//     HTMLContent += player2 ? `<tr><td>${rank > 1 ? rank - 1 : ''}</td><td>${rank > 1 ? getPlayerIcon(player2, 25) : `<td style='height:25px'></td>`}</td></tr>` : `<tr style='height:25px'></tr>`
//     HTMLContent += `<tr><td>${rank}</td><td>${getPlayerIcon(players[globalPlayerIndex], 35)}</td></tr>`
//     let player3 = players[rank]
//     if (player3?.name == thisPlayer.name) {
//         player3 = players[rank]
//     }
//     HTMLContent += player3 ? `<tr><td>${rank + 1}</td><td>${getPlayerIcon(player3, 25)}</td></tr>` : `<tr style='height:25px'></tr>`
//     HTMLContent += `</table>`
//     return HTMLContent
// }
function toggleSliders() {
    playSound('move')
    if (modalSliders) {
        openModal(globalPlayerIndex)
    } else {
        document.getElementById('modal_sliders').innerHTML = '&#10005'
        for (let i = 0; i < categories.length; i++) {
            document.getElementById('modal_category_' + i + '_slider_div').style.display = ''
            document.getElementById('modal_category_' + i + '_place').style.display = ''
        }
        document.getElementById('modal_letterGrade').style.display = ''
        // document.getElementById('modal_rankComparison').style.display = ''
        modalSliders = true
    }
    modalPercentages = []
    players[globalPlayerIndex].runs.forEach(run => {
        modalPercentages.push(run.percentage)
    })
}
function reportCardSection(category, categoryIndex, score, percentage) {
    const grade = getLetterGrade(percentage)
    const accentColor = ''
    // const accentColor=getColorFromClass(classNameLogic(category))
    let className = classNameLogic(category)
    if (!className) {
        className = 'banner'
    }
    const place = players[globalPlayerIndex].runs[categoryIndex].place
    let placeClassName = placeClass(place)
    if (!placeClassName) {
        placeClassName = classNameLogic(category)
    }
    const HTMLContent =
        `<td id='modal_category_${categoryIndex}_grade' class='${grade.className}' style='text-align:left;min-width:25px'>${grade.grade}</td>
        <td id='modal_category_${categoryIndex}_percentage' class='${grade.className}' style='min-width:45px'>${displayPercentage(percentage)}</td>
        <td id='modal_category_${categoryIndex}_place' class='${placeClassName}' style='display:none;font-size:75%;min-width:25px'>${place}</td>
        <td id='modal_category_${categoryIndex}_score' class='${classNameLogic(category)}'>${tetrisCheck(category, score)}</td>
        <td class='background' style='border-right:1px solid white'><div id='modal_category_${categoryIndex}_visual' class='${className}' style='color:transparent !important;width:${percentage == 100 ? 102 : normalize50(percentage)}%'>dummy</div></td>
        <td id='modal_category_${categoryIndex}_slider_div' style='display:none'><input id='modal_category_${categoryIndex}_slider' style='width:300px;accent-color:${accentColor}' type='range' oninput='adjustGrade(${categoryIndex})' step='0.1' min='50' max='${category.runs[0].percentage}' value='${Math.round(percentage)}'></td>`
    return HTMLContent
}
function adjustGrade(categoryIndex) {
    document.getElementById('modal_refresh').style.display = ''
    const newPercentage = parseFloat(document.getElementById('modal_category_' + categoryIndex + '_slider').value)
    const gradeElem = document.getElementById('modal_category_' + categoryIndex + '_grade')
    const newLetterGrade = getLetterGrade(newPercentage)
    gradeElem.innerHTML = newLetterGrade.grade
    gradeElem.classList.remove(...gradeElem.classList)
    gradeElem.classList.add(newLetterGrade.className)
    const percentageElem = document.getElementById('modal_category_' + categoryIndex + '_percentage')
    percentageElem.innerHTML = displayPercentage(newPercentage)
    percentageElem.classList.remove(...percentageElem.classList)
    percentageElem.classList.add(newLetterGrade.className)
    const scoreElem = document.getElementById('modal_category_' + categoryIndex + '_score')
    const category = categories[categoryIndex]
    modalPercentages[categoryIndex] = parseFloat(newPercentage)
    scoreElem.innerHTML = tetrisCheck(category, scoreFromGrade(category, newPercentage))
    const visualElem = document.getElementById('modal_category_' + categoryIndex + '_visual')
    visualElem.style.width = normalize50(newPercentage) + '%'
    let newPlayerPercentage = 0
    modalPercentages.forEach(modalPercentage => {
        newPlayerPercentage += modalPercentage
    })
    newPlayerPercentage = newPlayerPercentage / categories.length
    document.getElementById('modal_gpa').innerHTML = getGPA(newPlayerPercentage)
    let runIndex = 0
    let run = categories[categoryIndex].runs[runIndex]
    while (newPercentage < run?.percentage) {
        runIndex++
        run = categories[categoryIndex].runs[runIndex]
    }
    document.getElementById('modal_category_' + categoryIndex + '_place').innerHTML = runIndex + 1
    playerIndex = 0
    player = players[playerIndex]
    thisPlayer = false
    while (newPlayerPercentage < player?.score) {
        playerIndex++
        player = players[playerIndex]
        if (players[globalPlayerIndex].rank == playerIndex) {
            thisPlayer = true
        }
    }
    if (thisPlayer) {
        playerIndex--
    }
    playerIndex++
    document.getElementById('modal_rank').innerHTML = playerIndex
    document.getElementById('modal_letterScore').innerHTML = displayLetterScore(newPlayerPercentage)
    document.getElementById('modal_letterGrade').innerHTML = displayLetterGrade(newPlayerPercentage)
    // document.getElementById('modal_rankComparison').innerHTML = rankComparison(playerIndex)
}