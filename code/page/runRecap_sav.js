function processSavFile(playerIndex) {
    fetch('resources/cupheadSav.json')
        .then(response => response.json())
        .then(data => {
            runRecap_savFile = data
            runRecapUnload('lss', true)
            generateDropbox('sav')
            if (playerIndex != null) {
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
                if (playerIndex == 0 && commBestILsCategory.markin) {
                    generateDropbox('lss', true)
                    loadMarkin(true)
                    document.querySelectorAll('.lss_recentRuns').forEach(elem => {
                        elem.innerHTML = ''
                        hide(elem)
                    })
                    document.getElementById('dropdown_runRecap_lss_comparison').value = 'commBest'
                    document.querySelectorAll('.lss_hide').forEach(elem => {
                        hide(elem)
                    })
                }
            } else {
                runRecapViewPage('content', 'sav')
            }
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
    if (players[0]) {
        showRunRecapTab()
    }
}
function runRecapDownload() {
    const jsonStr = JSON.stringify(runRecap_savFile, null, 2)
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
    const follies = runRecap_savFile?.levelDataManager.levelObjects.find(level => level.levelID == forestfolliesID)
    if (follies.bestTime != nullTime) {
        HTMLContent += `<div>`
        HTMLContent += `<div class='container'>
        <div>${getImage('other/forestfollies', 42)}</div>
        <div style='padding-left:8px;font-size:135%'>${secondsToHMS(follies.bestTime, true)}</div>
        </div>`
        const mausoleum = runRecap_savFile.levelDataManager.levelObjects.find(level => level.levelID == mausoleumID)
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
function runRecapCategory(categoryIndex) {
    const category = categories[categoryIndex]
    const level = getCupheadLevel(categoryIndex)
    const runTime = level?.bestTime
    let HTMLContent = ''
    const done = runTime && runTime != nullTime
    const comparisonTime = getComparisonTime(categoryIndex)
    const delta = runRecapDelta(runTime, comparisonTime)
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
function getComparisonTime(categoryIndex) {
    const dropdown_runRecap_sav_comparison = document.getElementById('dropdown_runRecap_sav_comparison')
    const comparison = dropdown_runRecap_sav_comparison ? dropdown_runRecap_sav_comparison.value : 'top3'
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
    return runRecap_savFile.levelDataManager.levelObjects.find(level => level.levelID == categories[categoryIndex].info.levelID)
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
    buttonClick('runRecap_' + runRecapTab, 'runRecap_sav_tabs', 'active2')
    updateComparisonInfo()
    const runRecapElem = document.getElementById('runRecap')
    if (runRecapTab == 'times') {
        runRecapElem.innerHTML = runRecapTimes()
    } else if (runRecapTab == 'sums') {
        runRecapElem.innerHTML = runRecapSums()
    }
}
function updateComparisonInfo() {
    const comparison = document.getElementById('dropdown_runRecap_sav_comparison')?.value
    let HTMLContent = ''
    switch (comparison) {
        case 'top3':
            HTMLContent = "Average of top 3 players' boss times in their PBs"
            break
        case 'humanTheory':
            HTMLContent = "Top 3 players' PB boss times averaged with comm best ILs"
            break
        case 'commBest':
            HTMLContent = "Community best ILs"
            break
        default:
            if (!commBestILsCategory.players) {
                const player = players[parseInt(comparison.split('_')[1])]
                HTMLContent = 'Boss times in&nbsp;' + getPlayerName(player) + "'s " + secondsToHMS(player.extra.score)
            }
    }
    document.getElementById('comparisonInfo').innerHTML = HTMLContent
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