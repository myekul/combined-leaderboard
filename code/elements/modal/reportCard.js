function reportCard(player) {
    let HTMLContent = `<div class='container'><table>`
    if (gameID == 'cuphead' && mode == 'levels' && big5()) {
        let categoryIndex = 0
        while (categoryIndex < categories.length) {
            const category = categories[categoryIndex]
            const numCats = cupheadNumCats(category)
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
                HTMLContent += reportCardSection(category, categoryIndex, run.score, percentage)
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
            HTMLContent += `<td class='${classNameLogic(category)}' style='text-align:left;padding:2px 3px'>${category.name}</td>`
            HTMLContent += reportCardSection(category, categoryIndex, run.score, run.percentage)
            HTMLContent += `</tr>`
        })
    }
    HTMLContent += `</table>`
    // HTMLContent += `<div><div id='modal_rankComparison' style='min-width:70px'>${rankComparison(player.rank)}</div></div>`
    HTMLContent += `</div>`
    HTMLContent += `<div class='container' style='gap:8px'>`
    if (player.hasAllRuns) {
        HTMLContent += `<div id='modal_sliders' onclick="toggleSliders()" class='grow'>${fontAwesome('sliders')}</div>`
    }
    HTMLContent +=
        `<div class='textBox'><table class='background2'>
            <tr>
                <td>Rank:</td>
                <td id='modal_rank' style='padding:0 5px'>${player.rank}</td>
            </tr>`
    if (player.hasAllRuns) {
        HTMLContent +=
            `<tr>
                    <td>GPA:</td>
                    <td id='modal_gpa'>${getGPA(player.score)}</td>
                </tr>`
    }
    HTMLContent += `<td colspan=2 id='modal_scoreGradeSpan'>${scoreGradeSpan(player.score)}</td>`
    HTMLContent += `</table></div>`
    HTMLContent += `<div id='modal_refresh' onclick="toggleSliders();toggleSliders()" class='grow' style='display:none'>${fontAwesome('refresh')}</div>`
    HTMLContent += `</div>`
    const myekulSaysCheck = myekulSays[player.name]
    const iconSize = 26
    HTMLContent += `<div class='container' style='align-items:center'>`
    HTMLContent += myekulSaysCheck ? `<div id='myekulSaysButton' class='grow' onclick="myekulSaysAction()"><img src='${sharedAssetsURL('myekul')}' style='width:${iconSize}px;height:auto'></div>` : `<div style='width:${iconSize}px;height:${iconSize}px'></div>`
    HTMLContent += myekulSaysCheck ? `<div id='myekulSaysEmpty' style='display:none;width:${iconSize}px;height:auto'></div>` : ''
    HTMLContent += `<div class='container'></div>`
    const iconSize2 = 30
    const user = players.find(player => player.name == localStorage.getItem('username'))
    HTMLContent += user ? `<div id='modal_userComparison' onclick="toggleUserComparison()" class='grow' style='width:${iconSize2}px;text-align:center'>${fontAwesome('exchange')}</div>` : ''
    HTMLContent += `<div id='modal_sliders' onclick="scoreBreakdownInfo()" class='grow ${player.explanation ? 'myekulColor' : ''}' style='width:${iconSize2}px;text-align:center'>${fontAwesome('info-circle')}</div>`
    HTMLContent += `</div>`
    const textStyle = 'font-size:80%;max-width:275px;padding-bottom:15px'
    HTMLContent += player.explanation ? `<div id='playerExplanation' class='container textBlock' style='display:none;${textStyle}'>${player.explanation}</div>` : ''
    HTMLContent += myekulSaysCheck ? `<div id='myekulSays' style='display:none'>
        <div class='clickable' onclick="myekulSaysAction()">${myekulSaysDiv()}</div>
        <div class='container textBlock' style='${textStyle}'>${myekulSaysCheck}</div>
        </div>` : ''
    return HTMLContent
}
function myekulSaysDiv() {
    return `<div class='container' style='justify-content:left;margin:0'>
    <img src='${sharedAssetsURL('myekul')}' style='height:30px;width:auto;padding-right:5px'>
    <div style='font-size:110%'>${myekulColor('myekul')} says...</div>
    </div>`
}
function myekulSaysAction() {
    playSound('move')
    toggleVisibility('myekulSays')
    toggleVisibility('myekulSaysButton')
    toggleVisibility('myekulSaysEmpty')
}
function scoreBreakdownInfo() {
    playSound('move')
    players[globalPlayerIndex].explanation ? toggleVisibility('playerExplanation') : ''
    for (let i = 0; i < categories.length; i++) {
        toggleVisibility('modal_category_' + i + '_truePercentage')
    }
}
function toggleUserComparison() {
    playSound('move')
    for (let i = 0; i < categories.length; i++) {
        toggleVisibility('modal_category_' + i + '_visual_div')
        toggleVisibility('modal_category_' + i + '_userDelta')
        toggleVisibility('modal_category_' + i + '_userComparison')
    }
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
        openModalCL('player', true, players[globalPlayerIndex].name)
    } else {
        document.getElementById('modal_sliders').innerHTML = fontAwesome('close')
        for (let i = 0; i < categories.length; i++) {
            show('modal_category_' + i + '_slider_div')
            show('modal_category_' + i + '_place')
            hide('modal_category_' + i + '_visual_div')
            show('modal_category_' + i + '_leftArrow')
            show('modal_category_' + i + '_rightArrow')
        }
        // show('modal_rankComparison')
        modalSliders = true
    }
    modalPercentages = []
    players[globalPlayerIndex].runs.forEach(run => {
        modalPercentages.push(run.percentage)
    })
}
function reportCardSection(category, categoryIndex, score, percentage) {
    let HTMLContent = ''
    if (score) {
        const grade = getLetterGrade(percentage)
        const accentColor = ''
        // const accentColor=getColorFromClass(classNameLogic(category))
        const className = classNameLogic(category) || 'banner'
        const place = players[globalPlayerIndex].runs[categoryIndex].place
        HTMLContent =
            `<td id='modal_category_${categoryIndex}_grade' class='${grade.className}' style='font-size:90%;text-align:left;min-width:25px'>${grade.grade}</td>
        <td id='modal_category_${categoryIndex}_percentage' class='${grade.className}' style='font-size:90%;min-width:40px'>${displayPercentage(percentage)}</td>
        ${truePercentage(categoryIndex)}
        <td id='modal_category_${categoryIndex}_place' class='${classNameLogic(category)}' style='display:none;font-size:75%;min-width:25px'>${place}</td>
        <td id='modal_category_${categoryIndex}_score' class='${classNameLogic(category)}' style='padding:0 3px'>${tetrisCheck(category, score)}</td>
        ${userComparison(categoryIndex)}
        <td id='modal_category_${categoryIndex}_leftArrow' class='grow' style='display:none;padding-left:7px' onclick="moveSlider(${categoryIndex})">${fontAwesome('toggle-left')}</td>
        <td id='modal_category_${categoryIndex}_rightArrow' class='grow' style='display:none;padding-right:5px' onclick="moveSlider(${categoryIndex},-0.1)">${fontAwesome('toggle-right')}</td>
        <td id='modal_category_${categoryIndex}_visual_div' class='background1 container' style='justify-content:left'><div class='${className}' style='height:23px;color:transparent !important;width:${percentage == 100 ? 102 : normalize(percentage, 80)}%'>dummy</div></td>
        <td id='modal_category_${categoryIndex}_slider_div' style='display:none'><input id='modal_category_${categoryIndex}_slider' style='width:250px;accent-color:${accentColor}' class='reverse' type='range' oninput='adjustGrade(${categoryIndex})' step='0.1' min='80' max='${category.runs[0].percentage}' value='${Math.round(percentage)}'></td>`
    } else {
        HTMLContent += `<td></td><td></td>${truePercentage(categoryIndex)}`
    }
    return HTMLContent
}
function moveSlider(categoryIndex, amount = 0.1) {
    const slider = document.getElementById(`modal_category_${categoryIndex}_slider`);
    slider.value = (parseFloat(slider.value) + amount);
    playSound('move')
    adjustGrade(categoryIndex)
}
function truePercentage(categoryIndex) {
    const player = players[globalPlayerIndex]
    const fakePercentage = player.runs[categoryIndex]?.percentage
    const truePercentage = player.truePercentages[categoryIndex]
    const grade = getLetterGrade(truePercentage)
    return `<td id='modal_category_${categoryIndex}_truePercentage' class='${fakePercentage != truePercentage ? grade.className : ''}' style='display:none;min-width:30px;font-size:80%'>${displayPercentage(truePercentage)}</td>`
}
function userComparison(categoryIndex) {
    const player = players[globalPlayerIndex]
    const playerScore = player.runs[categoryIndex]?.score
    const user = players.find(player => player.name == localStorage.getItem('username'))
    const userScore = user?.runs[categoryIndex]?.score
    if (userScore) {
        const delta = userScore - playerScore
        return `<td id='modal_category_${categoryIndex}_userDelta' style='display:none;min-width:30px;font-size:80%;padding:0 2px;${redGreen(delta)}'>${getDelta((delta).toFixed(2))}</td>
    <td id='modal_category_${categoryIndex}_userComparison' style='display:none;min-width:30px;font-size:80%;padding:0 2px'>${tetrisCheck(categories[categoryIndex], userScore)}</td>`
    }
    return `<td id='modal_category_${categoryIndex}_userDelta' style='display:none'></td>
    <td id='modal_category_${categoryIndex}_userComparison' style='display:none'></td>`
}
function adjustGrade(categoryIndex) {
    show('modal_refresh')
    const newPercentage = parseFloat(document.getElementById('modal_category_' + categoryIndex + '_slider').value)
    const gradeElem = document.getElementById('modal_category_' + categoryIndex + '_grade')
    const newLetterGrade = getLetterGrade(newPercentage)
    gradeElem.innerHTML = newLetterGrade.grade
    gradeElem.classList.remove(...gradeElem.classList)
    const percentageElem = document.getElementById('modal_category_' + categoryIndex + '_percentage')
    percentageElem.innerHTML = displayPercentage(newPercentage)
    percentageElem.classList.remove(...percentageElem.classList)
    newLetterGrade.className.split(' ').forEach(className => {
        gradeElem.classList.add(className)
        percentageElem.classList.add(className)
    })
    const scoreElem = document.getElementById('modal_category_' + categoryIndex + '_score')
    const category = categories[categoryIndex]
    modalPercentages[categoryIndex] = parseFloat(newPercentage)
    scoreElem.innerHTML = tetrisCheck(category, scoreFromGrade(category, newPercentage))
    let newPlayerPercentage = 0
    modalPercentages.forEach(modalPercentage => {
        newPlayerPercentage += modalPercentage
    })
    newPlayerPercentage = newPlayerPercentage / categories.length
    const gpa = document.getElementById('modal_gpa')
    if (gpa) gpa.innerHTML = getGPA(newPlayerPercentage)
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
        thisPlayer = players[globalPlayerIndex].rank == playerIndex
    }
    if (thisPlayer) playerIndex--
    playerIndex++
    document.getElementById('modal_rank').innerHTML = playerIndex
    document.getElementById('modal_scoreGradeSpan').innerHTML = scoreGradeSpan(newPlayerPercentage)
    // document.getElementById('modal_rankComparison').innerHTML = rankComparison(playerIndex)
}