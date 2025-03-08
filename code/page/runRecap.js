function runRecapStart() {
    if (mode != 'commBestILs') {
        getCommBestILs()
    }
}
function updateRunRecapInfo() {
    const player = players[globalPlayerIndex]
    const playerNames = document.querySelectorAll('.runRecapInfoName')
    playerNames.forEach(playerName => {
        playerName.innerHTML = player ? getPlayerName(player) : `<span style='color:white'>${runRecapPlayerName}</span>`
    })
}
function hideRunRecap(elem) {
    playSound('move')
    hide('runRecap_' + elem)
    const input_runRecapElem = document.getElementById('input_runRecap_' + elem)
    show(input_runRecapElem)
    input_runRecapElem.focus()
    input_runRecapElem.select()
    if (elem == 'time') {
        playSound('win_time_loop')
    }
    input_runRecapElem.addEventListener('change', () => {
        runRecapStartElem(elem);
    });
    input_runRecapElem.addEventListener('blur', () => {
        runRecapStartElem(elem);
    });
}
function runRecapStartElem(elem) {
    const input_runRecapElem = document.getElementById('input_runRecap_' + elem)
    const input = input_runRecapElem.value
    hide(input_runRecapElem)
    if (elem == 'player') {
        playSound('category_select');
        runRecapPlayerName = input.trim() ? input : runRecapPlayerName
        updateRunRecapInfo()
    } else {
        stopSound('win_time_loop')
        playSound('win_time_loop_end')
        runRecapTime = input.trim() ? input : runRecapTime
        const score = getScore(extraCategory, convertToSeconds(runRecapTime))
        document.getElementById('runRecap_grade').innerHTML = scoreGradeSpan(score)
    }
    const runRecapStartElem = document.getElementById('runRecap_' + elem)
    runRecapStartElem.innerHTML = elem == 'player' ? runRecapPlayer() : `<div style='font-size:150%'>${runRecapTime}</div>`
    show(runRecapStartElem)
    updateRunRecapAction()
}
function runRecapPlayer() {
    const player = players.find(player => player.name == runRecapPlayerName)
    globalPlayerIndex = player ? player.rank - 1 : -1
    const playerName = player ? getPlayerName(player) : runRecapPlayerName
    let HTMLContent = `<div class='container' style='gap:8px;margin:0'>`
    HTMLContent += player ? `<div>${getPlayerIcon(player, 40)}</div>` : ''
    HTMLContent += `<div style='font-size:140%'>${playerName}</div>`
    HTMLContent += player ? `<div>${getPlayerFlag(player, 18)}</div>` : ''
    HTMLContent += `</div>`
    return HTMLContent
}
function runRecap(event) {
    const fileInput = event.target
    const file = fileInput.files[0];
    if (file) {
        runRecapDisplay()
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            runRecapFile = JSON.parse(content)
            showTab('runRecap')
            playSound('ready')
            const checkbox_runRecap_harsh = document.getElementById('checkbox_runRecap_harsh')
            if (getScore(extraCategory, convertToSeconds(runRecapTime)) >= 90) {
                checkbox_runRecap_harsh.checked = true
            } else {
                checkbox_runRecap_harsh.checked = false
            }
            runRecapAction()
        };
        reader.readAsText(file);
    } else {
        show('runRecapError')
    }
    fileInput.value = ''
}
function processSavFile() {
    fetch('resources/cupheadSav.json')
        .then(response => response.json())
        .then(data => {
            runRecapFile = data
            runRecapDisplay()
            runRecapAction()
        })
}
function refreshRunRecap() {
    const dropdown_runRecap = document.getElementById('dropdown_runRecap')
    dropdown_runRecap.classList.remove(commBestILsCategory.className)
    getCommBestILs(dropdown_runRecap.value)
    dropdown_runRecap.classList.add(commBestILsCategory.className)
    document.getElementById('runRecapBoardTitle').innerHTML = generateBoardTitle(2)
}
const top3Text = "Average of top 3 players' boss times in their PBs"
const humanTheoryText = "Top 3 players' PB boss times averaged with comm best ILs"
const commBestText = "Community best ILs"
function runRecapAction() {
    const score = getScore(extraCategory, convertToSeconds(runRecapTime))
    document.getElementById('runRecap_grade').innerHTML = scoreGradeSpan(score)
    show('runRecapBack')
    categories.forEach(category => {
        category.info.levelID = bossIDs[category.info.id]
    })
    if (players[0]) {
        let HTMLContent = ''
        HTMLContent += `<div class="container" style='padding-bottom:3px'>
                &Delta;
                <select id="dropdown_runRecapComparison" onchange="playSound('cardflip');updateRunRecapComparison()">
                    <optgroup label="Custom">
                        <option value="top3" title="${top3Text}" selected>Top 3 Average</option>
                        <option value="humanTheory" title="${humanTheoryText}">Human Theory</option>
                        <option value="commBest" title="${commBestText}">Comm Best${document.getElementById('checkbox_viable').checked ? ' (Viable)' : ''}</option>
                    </optgroup>
                    <optgroup label="Players">`
        for (let i = 0; i < commBestILsCategory.numRuns; i++) {
            HTMLContent += `<option value="player_${i}">${i + 1}. ${fullgamePlayer(i)}</option>`
        }
        HTMLContent += `</optgroup></select>`
        HTMLContent += `<i class='fa fa-info-circle clickable' onclick="playSound('move');toggleVisibility('comparisonInfo')" style='padding-left:5px'></i>`
        HTMLContent += `</div>`
        HTMLContent += `<div id='comparisonInfo' class='textBlock container' style='display:none;font-size:75%'></div>`
        HTMLContent += `<div id='comparisonChart'>${runRecapComparison()}</div>`
        HTMLContent += `<div class='container' style='padding-top:20px'>
        <div class='button cuphead' onclick="runRecapRestart()" style='width:100px'>${fontAwesome('reply')}&nbsp;Restart</div>
        <div class='divider'></div>
        <div class='button cuphead' onclick="runRecapDownload()" style='width:100px'>${fontAwesome('download')}&nbsp;Save file</div>
        </div>`
        document.getElementById('runRecap').innerHTML = HTMLContent
        updateComparisonInfo()
    }
}
function runRecapDownload() {
    const jsonStr = JSON.stringify(runRecapFile, null, 2)
    const blob = new Blob([jsonStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url;
    a.download = 'cuphead_player_data_v1_slot_0.sav';
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}
function updateComparisonInfo() {
    const comparison = document.getElementById('dropdown_runRecapComparison')?.value
    const comparisonInfo = document.getElementById('comparisonInfo')
    if (comparisonInfo) {
        switch (comparison) {
            case 'top3':
                comparisonInfo.innerHTML = top3Text
                break
            case 'humanTheory':
                comparisonInfo.innerHTML = humanTheoryText
                break
            case 'commBest':
                comparisonInfo.innerHTML = commBestText
                break
            default:
                if (!commBestILsCategory.players) {
                    const player = players[parseInt(comparison.split('_')[1])]
                    comparisonInfo.innerHTML = 'Boss times in&nbsp;' + getPlayerName(player) + "'s " + secondsToHMS(player.extra.score)
                }
        }
    }
}
function fullgamePlayer(playerIndex) {
    return commBestILsCategory.players ? commBestILsCategory.players[playerIndex] : players[playerIndex].name
}
const runRecapElems = ['welcome', 'controls']
const runRecapDisplayElems = ['runRecap', 'runRecap_options_elem']
function runRecapRestart() {
    playSound('category_select')
    runRecapElems.forEach(elem => {
        show('runRecap_' + elem)
    })
    runRecapDisplayElems.forEach(elem => {
        hide(elem)
    })
}
function runRecapDisplay() {
    runRecapElems.forEach(elem => {
        hide('runRecap_' + elem)
    })
    runRecapDisplayElems.forEach(elem => {
        show(elem)
    })
}
function updateRunRecapComparison() {
    document.getElementById('comparisonChart').innerHTML = runRecapComparison()
}
function updateRunRecapAction() {
    const comparisonChart = document.getElementById('comparisonChart')
    if (comparisonChart) {
        runRecapAction()
    }
}
function runRecapComparison() {
    let HTMLContent = ''
    updateComparisonInfo()
    isles.forEach(isle => {
        isle.sum = 0
    })
    HTMLContent += `<div class='container' style='padding-top:10px;gap:30px'>`
    isles.forEach(isle => {
        isle.runRecapCategories = []
    })
    categories.forEach((category, categoryIndex) => {
        isles[category.info.isle - 1].runRecapCategories.push([category, categoryIndex])
    })
    if (['DLC', 'DLC+Base'].includes(commBestILsCategory.name)) {
        const isle = isles[4]
        HTMLContent += isleHeader(isle)
        isle.runRecapCategories.forEach(object => {
            HTMLContent += runRecapCategory(object)
        })
        HTMLContent += `</table>`
    }
    isles.slice(0, 4).forEach(isle => {
        HTMLContent += isle.runRecapCategories.length ? isleHeader(isle) : ''
        isle.runRecapCategories.forEach(object => {
            HTMLContent += runRecapCategory(object)
        })
        HTMLContent += `</table>`
    })
    // HTMLContent += `<table>`
    // isles.forEach(isle => {
    //     if (isle.sum) {
    //         const score = isle.sum / isle.numBosses
    //         const grade = getLetterGrade(score)
    //         HTMLContent += `<tr>
    //             <td class=${isle.className}>${isle.name}</td>
    //             <td class=${grade.className}>${grade.grade}</td>
    //             <td class=${grade.className}>${displayPercentage(score)}</td>
    //             </tr>`
    //     }
    // })
    // HTMLContent += `</table>`
    HTMLContent += `</div>`
    return HTMLContent
}
function isleHeader(isle) {
    return `<table class='bigShadow'><tr><td colspan=10 class='${isle.className}'>${isle.name}</td></td>`
}
function runRecapCategory(object) {
    const dropdown_runRecapComparison = document.getElementById('dropdown_runRecapComparison')
    const comparison = dropdown_runRecapComparison ? dropdown_runRecapComparison.value : 'top3'
    const category = object[0]
    const categoryIndex = object[1]
    const level = runRecapFile.levelDataManager.levelObjects.find(level => level.levelID == category.info.levelID)
    const runTime = level?.bestTime
    let HTMLContent = ''
    const done = runTime && runTime != nullTime
    let comparisonTime
    if (comparison == 'top3') {
        comparisonTime = commBestILsCategory.top3[categoryIndex]
    } else if (comparison == 'humanTheory') {
        comparisonTime = commBestILsCategory.humanTheory[categoryIndex]
    } else if (comparison == 'commBest') {
        comparisonTime = getWorldRecord(category)
    } else if (comparison.split('_')[0] == 'player') {
        comparisonTime = commBestILsCategory.runs[parseInt(comparison.split('_')[1])][categoryIndex]
    }
    const delta = Math.floor(runTime) - Math.floor(comparisonTime)
    let score = 100 - delta
    if (document.getElementById('checkbox_runRecap_harsh').checked) {
        // const playerScore = getScore(extraCategory, convertToSeconds(runRecapTime))
        // if (playerScore < 90) {
        score = 100 - (delta * 3)
        // } else {
        //     score = 100 - (delta * ((playerScore - 90) / 2))
        // }
    }
    isles[category.info.isle - 1].sum += score
    const grade = getLetterGrade(score)
    HTMLContent += `<tr class='${getRowColor(categoryIndex)}'>`
    HTMLContent += done ? `<td style='font-size:80%'>${secondsToHMS(comparisonTime)}</td>` : `<td></td>`
    HTMLContent += done ? `<td class='${grade.className}'>${delta < 0 ? '' : '+'}${delta}s</td>` : `<td></td>`
    HTMLContent += `<td class='container ${category.info.id}'>${getImage(category.info.id, 42)}</td>`
    HTMLContent += `<td id='runRecap_${categoryIndex}' class='${category.info.id}' style='padding:0 5px'>${done ? runRecapIL(runTime, categoryIndex) : runRecapInput(categoryIndex)}</td>`
    HTMLContent += done ? `<td class='${grade.className}' style='text-align:left'>${grade.grade}</td>` : `<td></td>`
    HTMLContent += `</tr>`
    return HTMLContent
}
function updateRunRecapIL(categoryIndex) {
    playSound('category_select')
    const category = categories[categoryIndex]
    const level = runRecapFile.levelDataManager.levelObjects.find(level => level.levelID == category.info.levelID)
    let userInput = document.getElementById('input_runRecapIL_' + categoryIndex).value
    if (userInput.includes(':')) {
        userInput = convertToSeconds(userInput)
    }
    if (!userInput) {
        userInput = nullTime
        level.completed = false
        level.played = false
    } else {
        level.completed = true
        level.played = true
    }
    level.bestTime = userInput
    runRecapAction()
}
function runRecapIL(runTime, categoryIndex) {
    return `<div class='clickable' onclick="runRecapPlaceholder('${runTime}',${categoryIndex})" style='font-size:135%'>${secondsToHMS(runTime, true)}</div>`
}
function runRecapPlaceholder(runTime, categoryIndex) {
    document.getElementById('runRecap_' + categoryIndex).innerHTML = runRecapInput(categoryIndex, runTime)
    const input = document.getElementById('input_runRecapIL_' + categoryIndex)
    input.focus()
    input.setSelectionRange(0, input.value.length)
}
function runRecapInput(categoryIndex, value) {
    value = value ? value : ''
    return `<input id='input_runRecapIL_${categoryIndex}' type='text' placeholder='X:XX' value='${value}' style='font-size:100%;width:45px' onchange="updateRunRecapIL(${categoryIndex})" onblur="updateRunRecapIL(${categoryIndex})">`
}