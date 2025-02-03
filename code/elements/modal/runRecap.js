function modalRunRecap(extra) {
    let HTMLContent = ''
    if (globalPlayerIndex == -1) {
        globalPlayerIndex = 0
    }
    const player = players[globalPlayerIndex]
    if (!runRecapPlayerName) {
        runRecapPlayerName = players[globalPlayerIndex].name
    }
    if (mode != 'fullgameILs') {
        getFullgameILs()
    }
    HTMLContent += `<div class='container'>
    <div class='textBlock'>
    Welome to <span class='myekulColor'>Run Recap</span>! This tool allows you to upload a Cuphead .sav file to gain valuable insights about your recent run performance.
    To get started, <span class='myekulColor'>choose a category ${extra ? 'above' : ''}</span> and insert your <span class='myekulColor'>run time</span> and <span class='myekulColor'>username</span>:
    </div>
    </div>
    <br>`
    if (!extra) {
        HTMLContent += `<select id='dropdown_runRecap' onchange="refreshRunRecap()" class='container ${fullgameILsCategory.className}' style='margin-bottom:10px'>`
        for (const category in fullgameILs) {
            HTMLContent += `<option value="${category}" ${category == fullgameILsCategory.name ? 'selected' : ''}>${category}</option>`
        }
        HTMLContent += `</select>`
    }
    HTMLContent += `<div class='container' style='padding-bottom:10px;gap:20px'>
            <input id='input_runRecap_time' type='text' placeholder='XX:XX' style='display:none;width:65px;font-size:100%'>
            <div id='modal_runRecap_time' onclick="hideRunRecap('time')" class='container clickable' style='margin:0;gap:8px'>
                <div style='font-size:150%'>${runRecapTime}</div>
                <div style='font-size:160%'><i class='fa fa-edit'></i></div>
            </div>
            <input id='input_runRecap_player' type='text' placeholder='Your SRC username' style='display:none;width:200px;font-size:100%'>
            <div id='modal_runRecap_player' onclick="hideRunRecap('player')" class='container clickable' style='margin:0;gap:8px'>
                ${runRecapPlayer(player)}
                <div style='font-size:160%'><i class='fa fa-edit'></i></div>
            </div>
        </div>`
    if (!extra) {
        HTMLContent += `<div id='runRecapBoardTitle' class='container' style='padding-bottom:20px'>${generateBoardTitle(2)}</div>`
    }
    HTMLContent += `<div class='container'>
            <input type='file' id='runRecapInput' onchange="runRecap(event)" style='display:none'>
            <div onclick="document.getElementById('runRecapInput').click()" class='button cuphead'>Upload file</div>
            <div onclick="playSound('move');updateRunRecapInfo()" class='clickable' style='padding-left:5px'><i class='fa fa-info-circle'></i></div>
        </div>
        <div id='runRecapInfo' style='display:none;padding-bottom:10px'>
            ${runRecapInfo()}
        </div>
        <div id='runRecapError' style='display:none'>Error!</div>`
    return HTMLContent
}
function updateRunRecapInfo(noShow) {
    const runRecapInfoElem = document.getElementById('runRecapInfo')
    if (!noShow) {
        runRecapInfoElem.style.display = ''
    }
    runRecapInfoElem.innerHTML = runRecapInfo()
}
function runRecapInfo() {
    const player = players[globalPlayerIndex]
    const playerName = player ? getPlayerName(player) : `<span style='color:white'>${runRecapPlayerName}</span>`
    let HTMLContent = `<div class='container'><div>
            SAVE FILE LOCATIONS:
            <br>Windows: <span class='myekulColor'>C:\\Users\\${playerName}\\AppData\\Roaming\\Cuphead</span>
            <br>Mac: <span class='myekulColor'>/Users/${playerName}/Library/Application\\ Support/unity.Studio\\ MDHR.Cuphead/Cuphead</span>
            </div></div>`
    return HTMLContent
}
function hideRunRecap(elem) {
    playSound('move')
    document.getElementById('modal_runRecap_' + elem).style.display = 'none'
    const input_runRecapElem = document.getElementById('input_runRecap_' + elem)
    input_runRecapElem.style.display = ''
    input_runRecapElem.focus()
    input_runRecapElem.select()
    input_runRecapElem.addEventListener('change', () => {
        playSound('ready');
        modalRunRecapElem(elem);
    });
    input_runRecapElem.addEventListener('blur', () => {
        modalRunRecapElem(elem);
    });
}
function modalRunRecapElem(elem) {
    const input_runRecapElem = document.getElementById('input_runRecap_' + elem)
    const input = input_runRecapElem.value
    input_runRecapElem.style.display = 'none'
    if (elem == 'player') {
        runRecapPlayerName = input.trim() ? input : runRecapPlayerName
        updateRunRecapInfo(true)
    } else {
        runRecapTime = input.trim() ? input : runRecapTime
    }
    const modalRunRecapElem = document.getElementById('modal_runRecap_' + elem)
    modalRunRecapElem.innerHTML = elem == 'player' ? runRecapPlayer() : `<div style='font-size:150%'>${runRecapTime}</div>`
    modalRunRecapElem.style.display = ''
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
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            runRecapFile = JSON.parse(content)
            showTab('runRecap')
            document.getElementById('runRecapSection').style.display = ''
            closeModal()
            runRecapAction()
        };
        reader.readAsText(file);
    } else {
        document.getElementById('runRecapError').style.display = ''
    }
}
function refreshRunRecap() {
    const dropdown_runRecap = document.getElementById('dropdown_runRecap')
    dropdown_runRecap.classList.remove(fullgameILsCategory.className)
    getFullgameILs(dropdown_runRecap.value)
    dropdown_runRecap.classList.add(fullgameILsCategory.className)
    document.getElementById('runRecapBoardTitle').innerHTML = generateBoardTitle(2)
}
function runRecapAction() {
    let HTMLContent = ''
    HTMLContent += `<div class='container' style='margin:0;gap:15px;padding-bottom:8px'>
    <div style='font-size:150%'>${runRecapTime}</div>
    ${scoreGradeSpan(getPercentage(getWorldRecord(extraCategory) / convertToSeconds(runRecapTime)))}
    ${runRecapPlayer()}
    </div>`
    HTMLContent += `<div class="container" style='padding-bottom:3px'>
            &Delta;
            <select id="dropdown_runRecapComparison" onchange="updateRunRecapComparison()">
                <optgroup label="Custom">
                    <option value="top3" selected>Top 3 Average</option>
                    <option value="humanTheory">Human Theory</option>
                    <option value="commBest">Comm Best</option>
                </optgroup>
                <optgroup label="Players">`
    for (let i = 0; i < fullgameILsCategory.numRuns; i++) {
        const content = fullgameILsCategory.players ? fullgameILsCategory.players[i] : players[i].name
        HTMLContent += `<option value="player_${i}">${i + 1}. ${content}</option>`
    }
    HTMLContent += `</optgroup></select></div>`
    HTMLContent += `<div id='comparisonChart' class='container'>${runRecapComparison()}</div>`
    document.getElementById('runRecap').innerHTML = HTMLContent
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
    isles.forEach(isle => {
        isle.sum = 0
    })
    let HTMLContent = `<table>`
    categories.forEach((category, categoryIndex) => {
        let runTime = runRecapFile.levelDataManager.levelObjects.find(level => level.levelID == category.info.levelID)?.bestTime
        if (runTime) {
            const dropdown_runRecapComparison = document.getElementById('dropdown_runRecapComparison')
            let comparison = 'top3'
            let comparisonTime
            if (dropdown_runRecapComparison) {
                comparison = dropdown_runRecapComparison.value
            }
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
        <td style='font-size:80%'>${Math.floor(score)}%</td>
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
    return HTMLContent
}