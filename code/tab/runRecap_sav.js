function processSavFile(playerIndex, display) {
    fetch('resources/cupheadSav.json')
        .then(response => response.json())
        .then(data => {
            runRecap_savFile = data
            runRecapUnload('lss', true)
            if (playerIndex != null) {
                runRecapExample = true
                const player = players[playerIndex]
                globalPlayerIndex = playerIndex
                document.getElementById('runRecap_player').innerHTML = runRecapPlayer('runRecap_player')
                const time = secondsToHMS(player.extra.score)
                runRecapTime = time
                document.getElementById('input_runRecap_time').value = time
                hideInput('runRecap_time')
                categories.forEach((category, categoryIndex) => {
                    const level = getCupheadLevel(categoryIndex)
                    level.bestTime = commBestILsCategory.runs[playerIndex][categoryIndex]
                })
                if (playerIndex == 0 && commBestILsCategory.markin) {
                    bootMarkinExample()
                    if (display) {
                        runRecapViewPage('content', 'lss', true)
                        showTab('runRecap')
                    }
                }
                if (playerIndex > 0 || !commBestILsCategory.markin) {
                    runRecapViewPage('content', 'sav', true)
                }
            } else {
                runRecapViewPage('content', 'sav')
            }
            generateDropbox('sav')
        })
}
function bootMarkinExample() {
    markinExample()
    document.querySelectorAll('.lss_recentRuns').forEach(elem => {
        elem.innerHTML = ''
        hide(elem)
    })
    document.getElementById('dropdown_runRecap_lss_current').value = 'yourPB'
    document.getElementById('dropdown_runRecap_lss_comparison').value = 'commBest'
}
function refreshRunRecap() {
    const dropdown_runRecap = document.getElementById('dropdown_runRecap')
    dropdown_runRecap.classList.remove(commBestILsCategory.className)
    getCommBestILs(dropdown_runRecap.value)
    dropdown_runRecap.classList.add(commBestILsCategory.className)
    document.getElementById('runRecapBoardTitle').innerHTML = generateBoardTitle(2)
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
    const numDeaths = runRecap_savFile.statictics.playerOne.numDeaths
    if (numDeaths) {
        show('runRecap_ghost')
        document.getElementById('runRecap_numDeaths').innerHTML = numDeaths
        let char = runRecap_savFile.isPlayer1Mugman ? 'mugman' : 'cuphead'
        if (['DLC', 'DLC+Base'].includes(commBestILsCategory.name)) {
            char = 'chalice'
        }
        document.getElementById('runRecap_ghost').src = `images/cuphead/ghost_${char}.png`
    } else {
        document.getElementById('runRecap_numDeaths').innerHTML = ''
    }
    assignIsles()
    HTMLContent += `<div class='container' style='gap:25px'>`
    const follies = getCupheadLevel(runNguns['forestfollies'], true)
    const treetop = getCupheadLevel(runNguns['treetoptrouble'], true)
    HTMLContent += `<div>`
    if (follies.bestTime != nullTime && treetop.bestTime == nullTime) {
        HTMLContent += extraLevel('forestfollies', follies.bestTime)
    }
    const mausoleum = getCupheadLevel(mausoleumID, true)
    if (mausoleum.bestTime != nullTime && ['DLC', 'DLC+Base'].includes(commBestILsCategory.name)) {
        HTMLContent += extraLevel('mausoleum', mausoleum.bestTime)
    }
    HTMLContent += `</div>`
    if (['DLC', 'DLC+Base'].includes(commBestILsCategory.name)) {
        const isle = isles[4]
        HTMLContent += isleHeader(isle)
        isle.runRecapCategories.forEach(object => {
            HTMLContent += runRecapCategory(object)
        })
        HTMLContent += `</table></div>`
    }
    isles.slice(0, 4).forEach((isle, index) => {
        HTMLContent += isle.runRecapCategories.length ? isleHeader(isle) : ''
        isle.runRecapCategories.forEach(object => {
            HTMLContent += runRecapCategory(object)
        })
        HTMLContent += `</table>`
        const levels = [['forestfollies', 'treetoptrouble'], ['funfairfever', 'funhousefrazzle'], ['ruggedridge', 'perilouspiers']]
        levels.forEach((levelPair, levelIndex) => {
            if (index == levelIndex) {
                HTMLContent += `<div style='padding-top:15px'>`
                levelPair.forEach(level => {
                    const levelObj = getCupheadLevel(runNguns[level], true)
                    if (levelObj.bestTime != nullTime && !(level == 'forestfollies' && treetop.bestTime == nullTime)) {
                        HTMLContent += extraLevel(level, levelObj.bestTime)
                    }
                })
                HTMLContent += `</div>`
            }
        })
        HTMLContent += `</div>`
    })
    HTMLContent += `</div>`
    return HTMLContent
}
function extraLevel(name, time) {
    return `<div class='container'>
        <div>${getImage('other/' + name, 36)}</div>
        <div style='padding-left:8px;font-size:120%'>${secondsToHMS(time, true)}</div>
        </div>`
}
function isleHeader(isle) {
    return `<div><table class='bigShadow'><tr><td colspan=4 class='${isle.className}'>${isle.name}</td></td>`
}
function runRecapCategory(categoryIndex) {
    const category = categories[categoryIndex]
    const level = getCupheadLevel(categoryIndex)
    const runTime = level?.bestTime
    category.runTime = runTime
    const prevCategory = categories[categoryIndex - 1]
    if (prevCategory) category.runTime += prevCategory.runTime
    let HTMLContent = ''
    const done = runTime && runTime != nullTime
    const comparisonTime = getComparisonTime(categoryIndex)
    const delta = runRecapDelta(runTime, comparisonTime)
    category.delta = delta
    const grade = runRecapGrade(delta)
    let comparisonContent = `<div>${secondsToHMS(comparisonTime)}</div>`
    if (document.getElementById('dropdown_runRecap_sav_comparison').value == 'topBest') {
        comparisonContent += `<div class='container'>`
        commBestILsCategory.topBestPlayers[categoryIndex].forEach(playerIndex => {
            const player = players[playerIndex]
            comparisonContent += getPlayerIcon(player, 16)
        })
        comparisonContent += `</div>`
    }
    HTMLContent += `<tr class='${getRowColor(categoryIndex)}'>`
    HTMLContent += done ? `<td class='${grade.className}' style='text-align:left;padding:0 2px'>${grade.grade}</td>` : `<td></td>`
    HTMLContent += `<td class='container ${category.info.id}'>${getImage(category.info.id)}</td>`
    HTMLContent += `<td id='runRecap_${categoryIndex}' class='${category.info.id}'>${done ? runRecapIL(runTime, categoryIndex) : runRecapInput(categoryIndex)}</td>`
    HTMLContent += done ? `<td class='${grade.className}' style='font-size:90%'>${getDelta(delta)}</td>` : `<td></td>`
    HTMLContent += done ? `<td style='font-size:90%;color:var(--gray);padding:0 2px'>${comparisonContent}</td>` : `<td></td>`
    HTMLContent += `</tr>`
    return HTMLContent
}
function getComparisonTime(categoryIndex) {
    const dropdown_runRecap_sav_comparison = document.getElementById('dropdown_runRecap_sav_comparison')
    const comparison = dropdown_runRecap_sav_comparison ? dropdown_runRecap_sav_comparison.value : 'top3'
    if (comparison == 'top') {
        return commBestILsCategory.top[categoryIndex]
    } else if (comparison == 'top3') {
        return commBestILsCategory.top3[categoryIndex]
    } else if (comparison == 'topBest') {
        return commBestILsCategory.topBest[categoryIndex]
    } else if (comparison == 'theoryRun') {
        return commBestILsCategory.theoryRun[categoryIndex]
    } else if (comparison == 'commBest') {
        return getWorldRecord(categories[categoryIndex])
    } else if (comparison.split('_')[0] == 'player') {
        return commBestILsCategory.runs[parseInt(comparison.split('_')[1])][categoryIndex]
    }
}
function getCupheadLevel(param, other) {
    const id = other ? param : categories[param].info.levelID
    return runRecap_savFile.levelDataManager.levelObjects.find(level => level.levelID == id)
}
function updateRunRecapIL(categoryIndex) {
    playSound('category_select')
    const level = getCupheadLevel(categoryIndex)
    let userInput = document.getElementById('input_runRecapIL_' + categoryIndex).value
    if (userInput?.includes(':')) userInput = convertToSeconds(userInput)
    if (!userInput) {
        userInput = nullTime
        level.completed = false
        level.played = false
    } else {
        level.completed = true
        level.played = true
    }
    level.bestTime = parseFloat(userInput)
    generate_sav()
}
function runRecapIL(runTime, categoryIndex) {
    return `<div class='grow' onclick="runRecapPlaceholder('${runTime}',${categoryIndex})" style='font-size:130%;padding:0 8px'>${secondsToHMS(runTime, true)}</div>`
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
function generate_sav(tab) {
    runRecapTab = tab ? tab : runRecapTab
    buttonClick('runRecap_' + runRecapTab, 'runRecap_sav_tabs', 'activeBanner')
    const runRecapElem = document.getElementById('runRecap')
    switch (runRecapTab) {
        case 'times':
            runRecapElem.innerHTML = runRecapTimes()
            break
        case 'sums':
            runRecapElem.innerHTML = runRecapSums()
            break
        case 'grid':
            runRecapElem.innerHTML = runRecapGrid()
            break
    }
    const times = categories.map(category => category.runTime)
    const deltas = categories.map(category => category.delta)
    runRecap_chart(times, deltas)
}
function updateComparisonInfo() {
    const comparison = document.getElementById('dropdown_runRecap_sav_comparison')?.value
    let HTMLContent = ''
    switch (comparison) {
        case 'top':
            HTMLContent = "Average of top 10 players' boss times in their PBs"
            break
        case 'top3':
            HTMLContent = "Average of top 3 players' boss times in their PBs"
            break
        case 'topBest':
            HTMLContent = "Best of top players' boss times in their PBs"
            break
        case 'theoryRun':
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
                <td class='${grade.className}' style='text-align:left'>${grade.grade}</td>
                <td style='padding:0 5px' class='${isle.className}'>${isle.name}</td>
                <td class='${isle.className}'>${secondsToHMS(isle.sum)}</td>
                <td class='${grade.className}' style='font-size:90%'>${getDelta(delta)}</td>
                <td style='font-size:90%;color:var(--gray)'>${secondsToHMS(isle.comparisonSum)}</td>
                </tr>`
        }
    })
    const delta = sum - comparisonSum
    HTMLContent += `<tr>
    <td></td>
    <td></td>
    <td style='font-size:130%'>${secondsToHMS(sum)}</td>
    <td style='${redGreen(delta)}'>${getDelta(delta)}</td>
    <td style='color:var(--gray)'>${secondsToHMS(comparisonSum)}</td>
    </tr>`
    HTMLContent += `</table></div>`
    return HTMLContent
}
function runRecapGrid() {
    let HTMLContent = `<div class='container' style='overflow-x:auto'>`
    HTMLContent += `<table class='bigShadow'>`
    HTMLContent += `<tr><td></td><td></td><td></td><td></td><td></td><td></td>`
    categories.forEach(category => {
        HTMLContent += `<td colspan=2 class='${category.info.id}'>${getImage(category.info.id)}</td>`
    })
    HTMLContent += `</tr>`
    HTMLContent += `<tr><td></td><td></td><td></td><td></td><td></td><th style='text-align:right'>Your run</th>`
    categories.forEach((category, categoryIndex) => {
        const ILtime = getCupheadLevel(categoryIndex).bestTime
        const comparisonTime = getComparisonTime(categoryIndex)
        const delta = runRecapDelta(ILtime, comparisonTime)
        const grade = runRecapGrade(delta)
        HTMLContent += `<td class='${grade.className}' style='font-size:70%;text-align:left'>${grade.grade}</td>`
        HTMLContent += `<td class='${category.info.id}'>${secondsToHMS(ILtime)}</td>`
    })
    HTMLContent += `</tr>`
    HTMLContent += `<tr><td></td><td></td><td></td><td></td><td></td><th style='text-align:right'>&Delta;</th>`
    categories.forEach((category, categoryIndex) => {
        HTMLContent += `<th colspan=2 class='cuphead'>${secondsToHMS(getComparisonTime(categoryIndex))}</th>`
    })
    HTMLContent += `</tr>`
    commBestILsCategory.runs.forEach((run, index) => {
        const player = players[index]
        HTMLContent += `<tr class='${getRowColor(index)} hover'>`
        HTMLContent += parseRun(player, index, extraCategory, null, true)
        HTMLContent += getPlayerDisplay(player)
        categories.forEach((category, categoryIndex) => {
            const ILtime = run[categoryIndex]
            const comparisonTime = getComparisonTime(categoryIndex)
            const delta = runRecapDelta(ILtime, comparisonTime)
            const grade = runRecapGrade(delta)
            HTMLContent += `<td class='${grade.className}' style='font-size:70%;text-align:left'>${grade.grade}</td>`
            HTMLContent += `<td style='color:gray'>${secondsToHMS(ILtime)}</td>`
        })
        HTMLContent += `</tr>`
    })
    HTMLContent += `<tr><td></td><td></td><td></td><td></td><td></td><th style='text-align:right'>&Delta;</th>`
    categories.forEach((category, categoryIndex) => {
        HTMLContent += `<th colspan=2 class='cuphead'>${secondsToHMS(getComparisonTime(categoryIndex))}</th>`
    })
    HTMLContent += `</tr>`
    HTMLContent += `</table>`
    HTMLContent += `</div>`
    return HTMLContent
}
function runRecapCopy() {
    let clipboardContent = ''
    categories.forEach(category => {
        let time = secondsToHMS(category.runTime, true, true)
        if (!runRecapExample) {
            time = time.replace(/^0:/, "");
        }
        clipboardContent += `[${time}] ${category.name}\n`
    })
    navigator.clipboard.writeText(clipboardContent)
        .then(() => {
            // Success!
        })
}