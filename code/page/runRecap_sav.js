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
        if (elem == 'time') {
            playSound('win_time_loop_end')
        }
    });
    input_runRecapElem.addEventListener('blur', () => {
        runRecapStartElem(elem);
        if (elem == 'time') {
            playSound('win_time_loop_end')
        }
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
        runRecapTime = input.trim() ? input : runRecapTime
        // const score = getScore(extraCategory, convertToSeconds(runRecapTime))
        // document.getElementById('runRecap_grade').innerHTML = scoreGradeSpan(score)
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
    const file = event.target?.files ? event.target.files[0] : event;
    if (file) {
        runRecapDisplay()
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            runRecapFile = JSON.parse(content)
            playSound('ready')
            const checkbox_runRecap_harsh = document.getElementById('checkbox_runRecap_harsh')
            if (runRecapTime != 'XX:XX' && getScore(extraCategory, convertToSeconds(runRecapTime)) < 90) {
                checkbox_runRecap_harsh.checked = false
            } else {
                checkbox_runRecap_harsh.checked = true
            }
            runRecapAction()
        };
        reader.readAsText(file);
    } else {
        show('runRecapError')
    }
    if (event.target?.files) {
        event.target.value = ''
    }
}
function processSavFile(playerIndex) {
    fetch('resources/cupheadSav.json')
        .then(response => response.json())
        .then(data => {
            runRecapFile = data
            if (playerIndex != null) {
                // playSound('category_select')
                const player = players[playerIndex]
                runRecapPlayerName = player.name
                document.getElementById('input_runRecap_player').value = player.name
                runRecapStartElem('player')
                const time = secondsToHMS(player.extra.score)
                runRecapTime = time
                document.getElementById('input_runRecap_time').value = time
                runRecapStartElem('time')
                categories.forEach((category, categoryIndex) => {
                    const level = getCupheadLevel(categoryIndex)
                    level.bestTime = commBestILsCategory.runs[playerIndex][categoryIndex]
                })
            }
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
function runRecapAction() {
    // const score = getScore(extraCategory, convertToSeconds(runRecapTime))
    // document.getElementById('runRecap_grade').innerHTML = scoreGradeSpan(score)
    show('runRecapBack')
    if (players[0]) {
        let HTMLContent = ''
        for (let i = 0; i < commBestILsCategory.numRuns; i++) {
            HTMLContent += `<option value="player_${i}">${i + 1}. ${fullgamePlayer(i)}</option>`
        }
        document.getElementById('runRecap_optgroup').innerHTML = HTMLContent
        showRunRecapTab()
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
function fullgamePlayer(playerIndex) {
    return commBestILsCategory.players ? commBestILsCategory.players[playerIndex] : players[playerIndex].name
}
function runRecapRestart() {
    playSound('category_select')
    show('runRecap_controls')
    hide('runRecapSection')
}
function runRecapDisplay() {
    hide('runRecap_controls')
    show('runRecapSection')
}
function runRecapWelcome() {
    let HTMLContent = `<div class="container" style="padding:20px 0"><div class='textBlock'>`
    HTMLContent += `Welome to ${myekulColor('Run Recap')}! This tool allows you to upload a `
    if (page == 'runRecap_sav') {
        HTMLContent += `Cuphead .sav`
    } else {
        HTMLContent += `LiveSplit .lss`
    }
    HTMLContent += ` file to gain valuable insights about your recent run performance.
        To get started, ${myekulColor('choose a category above')} and insert your
        ${myekulColor('run time')} and ${myekulColor('username')}.`
    HTMLContent += `</div></div>`
    document.getElementById(page + '_welcome').innerHTML = HTMLContent
}
function updateRunRecapAction() {
    runRecapWelcome()
    categories.forEach(category => {
        category.info.levelID = bossIDs[category.info.id]
    })
    if (runRecapFile) {
        runRecapAction()
    }
    let HTMLContent = `<table class='bigShadow'>`
    players.slice(0, commBestILsCategory.numRuns).forEach((player, playerIndex) => {
        if (player.extra) {
            HTMLContent += `<tr class='${getRowColor(playerIndex)} clickable' onclick="processSavFile(${playerIndex})">`
            HTMLContent += `<td>${getTrophy(playerIndex + 1)}</td>`
            HTMLContent += `<td class='${placeClass(playerIndex + 1)}' style='padding:0 4px'>${secondsToHMS(player.extra.score)}</td>`
            HTMLContent += `<td>${getPlayerFlag(player, 12)}</td>`
            HTMLContent += `<td style='padding:0 3px'>${getPlayerIcon(player, 28)}</td>`
            HTMLContent += `<td style='padding-right:4px;text-align:left'>${getPlayerName(player)}</td>`
            HTMLContent += `</tr>`
        }
    })
    HTMLContent += `</table>`
    document.getElementById('runRecap_examples').innerHTML = HTMLContent
}
function assignIsles() {
    isles.forEach(isle => {
        isle.runRecapCategories = []
    })
    categories.forEach((category, categoryIndex) => {
        isles[category.info.isle - 1].runRecapCategories.push(categoryIndex)
    })
}
function runRecapTimes() {
    let HTMLContent = ''
    assignIsles()
    HTMLContent += `<div class='container' style='gap:25px'>`
    const follies = runRecapFile?.levelDataManager.levelObjects.find(level => level.levelID == 1464969490)
    if (follies.bestTime != nullTime) {
        HTMLContent += `<div>`
        HTMLContent += `<div class='container'>
        <div>${getImage('other/forestfollies', 42)}</div>
        <div style='padding-left:8px;font-size:135%'>${secondsToHMS(follies.bestTime, true)}</div>
        </div>`
        const mausoleum = runRecapFile.levelDataManager.levelObjects.find(level => level.levelID == 1481199742)
        if (mausoleum.bestTime != nullTime && ['DLC', 'DLC+Base'].includes(commBestILsCategory.name)) {
            HTMLContent += `<div class='container' style='margin:0'>
            <div>${getImage('other/mausoleum', 42)}</div>
            <div style='padding-left:8px;font-size:135%'>${secondsToHMS(mausoleum.bestTime, true)}</div>
            </div>`
        }
        HTMLContent += `</div>`
    }
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
    HTMLContent += `</div>`
    return HTMLContent
}
function isleHeader(isle) {
    return `<table class='bigShadow'><tr><td colspan=10 class='${isle.className}'>${isle.name}</td></td>`
}
function runRecapGrade(delta) {
    let score = 100 - (delta * 4)
    if (!document.getElementById('checkbox_runRecap_harsh').checked) {
        score = 100 - delta
    }
    return getLetterGrade(score)
}
function runRecapCategory(categoryIndex) {
    const category = categories[categoryIndex]
    const level = getCupheadLevel(categoryIndex)
    const runTime = level?.bestTime
    let HTMLContent = ''
    const done = runTime && runTime != nullTime
    const comparisonTime = getComparisonTime(categoryIndex)
    const delta = Math.floor(runTime) - Math.floor(comparisonTime)
    const grade = runRecapGrade(delta)
    HTMLContent += `<tr class='${getRowColor(categoryIndex)}'>`
    HTMLContent += done ? `<td style='font-size:80%'>${secondsToHMS(comparisonTime)}</td>` : `<td></td>`
    HTMLContent += done ? `<td class='${grade.className}' style='font-size:90%'>${getDelta(delta)}</td>` : `<td></td>`
    HTMLContent += `<td class='container ${category.info.id}'>${getImage(category.info.id, 42)}</td>`
    HTMLContent += `<td id='runRecap_${categoryIndex}' class='${category.info.id}' style='padding:0 6px'>${done ? runRecapIL(runTime, categoryIndex) : runRecapInput(categoryIndex)}</td>`
    HTMLContent += done ? `<td class='${grade.className}' style='text-align:left;padding:0 2px'>${grade.grade}</td>` : `<td></td>`
    HTMLContent += `</tr>`
    return HTMLContent
}
function getDelta(delta) {
    return (delta < 0 ? '' : '+') + delta + 's'
}
function getComparisonTime(categoryIndex) {
    const dropdown_runRecapComparison = document.getElementById('dropdown_runRecapComparison')
    const comparison = dropdown_runRecapComparison ? dropdown_runRecapComparison.value : 'top3'
    if (comparison == 'top3') {
        return commBestILsCategory.top3[categoryIndex]
    } else if (comparison == 'humanTheory') {
        return commBestILsCategory.humanTheory[categoryIndex]
    } else if (comparison == 'commBest') {
        return getWorldRecord(categories[categoryIndex])
    } else if (comparison.split('_')[0] == 'player') {
        return commBestILsCategory.runs[parseInt(comparison.split('_')[1])][categoryIndex]
    }
}
function getCupheadLevel(categoryIndex) {
    return runRecapFile.levelDataManager.levelObjects.find(level => level.levelID == categories[categoryIndex].info.levelID)
}
function updateRunRecapIL(categoryIndex) {
    playSound('category_select')
    const level = getCupheadLevel(categoryIndex)
    let userInput = document.getElementById('input_runRecapIL_' + categoryIndex).value
    if (userInput?.includes(':')) {
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
function runRecapInput(categoryIndex, value) {
    return `<input id='input_runRecapIL_${categoryIndex}' type='text' placeholder='X:XX' ${value ? `value='${value}'` : ''} style='font-size:100%;width:45px' onblur="updateRunRecapIL(${categoryIndex})">`
}
function runRecapPlaceholder(runTime, categoryIndex) {
    document.getElementById('runRecap_' + categoryIndex).innerHTML = runRecapInput(categoryIndex, runTime)
    const input = document.getElementById('input_runRecapIL_' + categoryIndex)
    input.focus()
    input.setSelectionRange(0, input.value.length)
}
function showRunRecapTab(tab) {
    runRecapTab = tab ? tab : runRecapTab
    buttonClick('runRecap_' + runRecapTab, 'runRecapTabs', 'active2')
    updateComparisonInfo()
    const runRecapElem = document.getElementById('runRecap_sav')
    if (runRecapTab == 'times') {
        runRecapElem.innerHTML = runRecapTimes()
    } else if (runRecapTab == 'sums') {
        runRecapElem.innerHTML = runRecapSums()
    }
}
function updateComparisonInfo() {
    const comparison = document.getElementById('dropdown_runRecapComparison')?.value
    const comparisonInfo = document.getElementById('comparisonInfo')
    if (comparisonInfo) {
        switch (comparison) {
            case 'top3':
                comparisonInfo.innerHTML = "Average of top 3 players' boss times in their PBs"
                break
            case 'humanTheory':
                comparisonInfo.innerHTML = "Top 3 players' PB boss times averaged with comm best ILs"
                break
            case 'commBest':
                comparisonInfo.innerHTML = "Community best ILs"
                break
            default:
                if (!commBestILsCategory.players) {
                    const player = players[parseInt(comparison.split('_')[1])]
                    comparisonInfo.innerHTML = 'Boss times in&nbsp;' + getPlayerName(player) + "'s " + secondsToHMS(player.extra.score)
                }
        }
    }
}
function runRecapSums() {
    isles.forEach(isle => {
        isle.sum = 0
        isle.comparisonSum = 0
    })
    assignIsles()
    let sum = 0
    let comparisonSum = 0
    let HTMLContent = ''
    isles.forEach(isle => {
        isle.runRecapCategories.forEach(categoryIndex => {
            isle.comparisonSum += getComparisonTime(categoryIndex)
            const bestTime = getCupheadLevel(categoryIndex).bestTime
            isle.sum += bestTime != nullTime ? Math.floor(bestTime) : 0
        })
    })
    HTMLContent += `<div class='container'><table class='bigShadow'>`
    isles.forEach((isle, isleIndex) => {
        isle.comparisonSum = Math.floor(isle.comparisonSum)
        sum += isle.sum
        comparisonSum += isle.comparisonSum
        if (isle.sum) {
            const delta = isle.sum - isle.comparisonSum
            const grade = runRecapGrade(delta)
            HTMLContent += `<tr class='${getRowColor(isleIndex)}'>
                <td style='font-size:80%'>${secondsToHMS(isle.comparisonSum)}</td>
                <td class='${grade.className}' style='font-size:80%'>${getDelta(delta)}</td>
                <td style='padding:0 5px' class='${isle.className}'>${isle.name}</td>
                <td class='${isle.className}'>${secondsToHMS(isle.sum)}</td>
                <td class='${grade.className}' style='text-align:left'>${grade.grade}</td>
                </tr>`
        }
    })
    HTMLContent += `<tr>
    <td>${secondsToHMS(comparisonSum)}</td>
    <td>${getDelta(sum - comparisonSum)}</td>
    <td></td>
    <td style='font-size:130%'>${secondsToHMS(sum)}</td>
    </tr>`
    HTMLContent += `</table></div>`
    return HTMLContent
}
function runRecapHandler(runRecapMode) {
    const newTab = 'runRecap_' + runRecapMode
    if (mode != 'commBestILs') {
        page = newTab
        getCommBestILs()
    } else {
        showTab(newTab)
    }
}
const dropBox = document.getElementById('dropBox');
dropBox.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropBox.classList.add('drag-over');
});
dropBox.addEventListener('dragleave', () => {
    dropBox.classList.remove('drag-over');
});
dropBox.addEventListener('drop', (event) => {
    event.preventDefault();
    dropBox.classList.remove('drag-over');
    const files = event.dataTransfer.files;
    runRecap(files[0])
});