function runRecapStart() {
    if (mode != 'fullgameILs') {
        getFullgameILs()
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
    document.getElementById('runRecap_' + elem).style.display = 'none'
    const input_runRecapElem = document.getElementById('input_runRecap_' + elem)
    input_runRecapElem.style.display = ''
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
    input_runRecapElem.style.display = 'none'
    if (elem == 'player') {
        playSound('category_select');
        runRecapPlayerName = input.trim() ? input : runRecapPlayerName
        updateRunRecapInfo()
    } else {
        stopSound('win_time_loop')
        playSound('win_time_loop_end')
        runRecapTime = input.trim() ? input : runRecapTime
    }
    const runRecapStartElem = document.getElementById('runRecap_' + elem)
    runRecapStartElem.innerHTML = elem == 'player' ? runRecapPlayer() : `<div style='font-size:150%'>${runRecapTime}</div>`
    runRecapStartElem.style.display = ''
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
    categories.forEach(category => {
        category.info.levelID = bossIDs[category.info.id]
    })
    const fileInput = event.target
    const file = fileInput.files[0];
    if (file) {
        runRecapDisplay()
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            runRecapFile = JSON.parse(content)
            document.getElementById('runRecapBack').style.display = ''
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
        document.getElementById('runRecapError').style.display = ''
    }
    fileInput.value = ''
}
function refreshRunRecap() {
    const dropdown_runRecap = document.getElementById('dropdown_runRecap')
    dropdown_runRecap.classList.remove(fullgameILsCategory.className)
    getFullgameILs(dropdown_runRecap.value)
    dropdown_runRecap.classList.add(fullgameILsCategory.className)
    document.getElementById('runRecapBoardTitle').innerHTML = generateBoardTitle(2)
}
const top3Text = "Average of top 3 players' boss times in their PBs"
const humanTheoryText = "Top 3 players' PB boss times averaged with run viable comm best ILs"
const commBestText = "Community best ILs with run viable strats"
function runRecapAction() {
    if (players[0]) {
        const score = getScore(extraCategory, convertToSeconds(runRecapTime))
        let HTMLContent = ''
        HTMLContent += `<div class='container clickable' onclick="runRecapRestart()" style='margin:0;gap:15px;padding-bottom:8px'>
        <div style='font-size:150%'>${runRecapTime}</div>
        ${scoreGradeSpan(score)}
        ${runRecapPlayer()}
        </div>`
        HTMLContent += `<div class="container" style='padding-bottom:3px'>
                &Delta;
                <select id="dropdown_runRecapComparison" onchange="playSound('cardflip');updateRunRecapComparison()">
                    <optgroup label="Custom">
                        <option value="top3" title="${top3Text}" selected>Top 3 Average</option>
                        <option value="humanTheory" title="${humanTheoryText}">Human Theory</option>
                        <option value="commBest" title="${commBestText}">Comm Best (Viable)</option>
                    </optgroup>
                    <optgroup label="Players">`
        for (let i = 0; i < fullgameILsCategory.numRuns; i++) {
            HTMLContent += `<option value="player_${i}">${i + 1}. ${fullgamePlayer(i)}</option>`
        }
        HTMLContent += `</optgroup></select>`
        HTMLContent += `<i class='fa fa-info-circle clickable' onclick="playSound('move');toggleVisibility('comparisonInfo')" style='padding-left:5px'></i>`
        HTMLContent += `</div>`
        HTMLContent += `<div id='comparisonInfo' class='textBlock container' style='display:none;font-size:75%'></div>`
        HTMLContent += `<div id='comparisonChart'>${runRecapComparison()}</div>`
        HTMLContent += `<div class='container' style='padding-top:20px'><div class='button cuphead' onclick="runRecapRestart()">Restart</div></div>`
        document.getElementById('runRecap').innerHTML = HTMLContent
        updateComparisonInfo()
    }
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
                if (!fullgameILsCategory.players) {
                    const player = players[parseInt(comparison.split('_')[1])]
                    comparisonInfo.innerHTML = 'Boss times in&nbsp;' + getPlayerName(player) + "'s " + secondsToHMS(player.extra.score)
                }
        }
    }
}
function fullgamePlayer(playerIndex) {
    return fullgameILsCategory.players ? fullgameILsCategory.players[playerIndex] : players[playerIndex].name
}
function runRecapRestart() {
    playSound('category_select')
    document.getElementById('runRecapStart').style.display = ''
    document.getElementById('runRecap').style.display = 'none'
}
function runRecapDisplay() {
    document.getElementById('runRecapStart').style.display = 'none'
    document.getElementById('runRecap').style.display = ''
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
    const dropdown_runRecapComparison = document.getElementById('dropdown_runRecapComparison')
    const comparison = dropdown_runRecapComparison ? dropdown_runRecapComparison.value : 'top3'
    updateComparisonInfo()
    isles.forEach(isle => {
        isle.sum = 0
    })
    HTMLContent += `<div class='container' style='padding-top:10px'><table>`
    categories.forEach((category, categoryIndex) => {
        let runTime = runRecapFile.levelDataManager.levelObjects.find(level => level.levelID == category.info.levelID)?.bestTime
        if (runTime) {
            let comparisonTime
            if (comparison == 'top3') {
                comparisonTime = fullgameILsCategory.top3[categoryIndex]
            } else if (comparison == 'humanTheory') {
                comparisonTime = fullgameILsCategory.humanTheory[categoryIndex]
            } else if (comparison == 'commBest') {
                comparisonTime = getWorldRecord(category)
            } else if (comparison.split('_')[0] == 'player') {
                comparisonTime = fullgameILsCategory.runs[parseInt(comparison.split('_')[1])][categoryIndex]
            }
            const delta = Math.floor(runTime) - Math.floor(comparisonTime)
            let score = 100 - delta
            if (document.getElementById('checkbox_runRecap_harsh').checked) {
                score = 100 - delta * 2
            }
            isles[category.info.isle - 1].sum += score
            const grade = getLetterGrade(score)
            HTMLContent += `<tr class='${getRowColor(categoryIndex)}'>
        <td style='font-size:80%'>${secondsToHMS(comparisonTime)}</td>
        <td class='${grade.className}'>${delta < 0 ? '' : '+'}${delta}s</td>
        <td class='container ${category.info.id}'>${getImage(category.info.id, 21)}</td>
        <td>${secondsToHMS(runTime, true)}</td>
        <td class='${grade.className}' style='text-align:left'>${grade.grade}</td>
        </tr>`
        }
    })
    HTMLContent += `</table>`
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