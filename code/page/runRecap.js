function runRecapHandle() {
    const newTab = 'runRecap'
    if (mode != 'commBestILs') {
        page = newTab
        getCommBestILs()
    } else {
        showTab(newTab)
    }
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
    } else {
        stopSound('win_time_loop')
        runRecapTime = input.trim() ? input : runRecapTime
    }
    const runRecapStartElem = document.getElementById('runRecap_' + elem)
    runRecapStartElem.innerHTML = elem == 'player' ? runRecapPlayer() : runRecapTimeElem(runRecapTime)
    show(runRecapStartElem)
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
function runRecapTimeElem(time) {
    return `<div style='font-size:150%'>${time}</div>`
}
function runRecapWelcome() {
    const HTMLContent = `
    <div class="container" style="padding:20px 0">
        <div class='textBlock'>
            Welcome to ${myekulColor('Run Recap')}! This tool allows you to upload
            a ${myekulColor('LiveSplit .lss')}
            and a ${myekulColor('Cuphead .sav')} file
            to gain valuable insights about your recent run performance.
            To get started, insert your ${myekulColor('run time')} and ${myekulColor('username')}.
        </div>
    </div>`
    document.getElementById('runRecap_welcome').innerHTML = HTMLContent
}
function generateDropbox(elem) {
    const dropBoxID = 'runRecap_dropBox_' + elem
    const dropBoxInnerID = dropBoxID + '_inner'
    const unsupported = elem == 'lss' && !commBestILsCategory.markin
    const fileUploaded = !unsupported && (elem == 'sav' && runRecap_savFile || elem == 'lss' && runRecap_lssFile.pbSplits)
    let HTMLContent = ''
    HTMLContent += `<div id='${dropBoxInnerID}' class="dropBox ${fileUploaded ? extraCategory.className + ' flash' : ''}">
                        <div>
                            <div class="container" style="font-family: 'cuphead-vogue';font-size:150%">.${elem}&nbsp;`
    if (fileUploaded) {
        HTMLContent += fontAwesome('check')
    }
    HTMLContent += `</div>
                    <div class="container">
                        <input type='file' id='${page}_${elem}_input' ${elem == 'lss' ? "accept='lss'" : ''} onchange="runRecapHandleFile(event,'${elem}')" style='display:none'>`
    if (unsupported) {
        HTMLContent += `<div>Category not supported!</div>`
    } else {
        HTMLContent += `<div onclick="document.getElementById('${page}_${elem}_input').click()" class='button cuphead'>${fontAwesome('upload')}&nbsp;Upload file</div>`
    }

    if (elem == 'sav') {
        HTMLContent += `<div onclick="openModal('runRecapInfo','up')" class='clickable' style="padding-left:5px">${fontAwesome('info-circle')}</div>`
        HTMLContent += `<div class='divider'></div>
    <div onclick="processSavFile()" class="button cuphead" style="width:110px">${fontAwesome('plus')}&nbsp;Empty file</div>`
    }
    HTMLContent += `</div>`
    if (fileUploaded) {
        cellContent = elem == 'sav' ? fontAwesome('folder') : `<img src="images/livesplit.png" style="width:30px">`
        HTMLContent += `<div class='container' style='padding-top:20px'>
        <div onclick="runRecapViewPage('content','${elem}')" class='button cuphead pulse' style="font-family:'cuphead-vogue';font-size:150%;width:200px;height:50px">${cellContent}&nbsp;View .${elem}</div>
        </div>`
        HTMLContent += `<div onclick="runRecapUnload('${elem}')" class='clickable' style='position:absolute;bottom:8px;right:10px;font-size:130%'>${fontAwesome('trash')}</div>`
    }
    HTMLContent += `</div>
                    </div>`
    const dropBox = document.getElementById(dropBoxID);
    dropBox.innerHTML = HTMLContent
    const dropBoxInner = document.getElementById(dropBoxInnerID);
    const className = 'dropBoxHover'
    dropBoxInner.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropBoxInner.classList.add(className);
    });
    dropBoxInner.addEventListener('dragleave', () => {
        dropBoxInner.classList.remove(className);
    });
    dropBoxInner.addEventListener('drop', (event) => {
        event.preventDefault();
        dropBoxInner.classList.remove(className);
        const files = event.dataTransfer.files;
        runRecapHandleFile(files[0], elem)
    });
}
function runRecapUnload(elem, shh) {
    if (!shh) {
        playSound('carddown')
    }
    if (elem == 'sav') {
        runRecap_savFile = null
    } else {
        runRecap_lssFile = {}
    }
    generateDropbox(elem)
}
async function runRecapHandleFile(event, elem) {
    const file = event.target?.files ? event.target.files[0] : event;
    if (file) {
        try {
            const content = await file.text()
            playSound('cardup')
            const checkbox_runRecap_harsh = document.getElementById('checkbox_runRecap_harsh')
            if (runRecapTime != 'XX:XX' && getScore(extraCategory, convertToSeconds(runRecapTime)) < 90) {
                checkbox_runRecap_harsh.checked = false
            } else {
                checkbox_runRecap_harsh.checked = true
            }
            if (elem == 'sav') {
                runRecap_savFile = JSON.parse(content)
                if ('isPlayer1Mugman' in runRecap_savFile) {
                    if (getCupheadLevel(mausoleumID, true).completed) {
                        if (runRecap_savFile.loadouts.playerOne.primaryWeapon == 1467024095) { // Lobber
                            if (getCupheadLevel(bossIDs['therootpack'], true).completed) {
                                getCommBestILs('DLC+Base L/S')
                            } else {
                                getCommBestILs('DLC L/S')
                            }
                        } else if (runRecap_savFile.loadouts.playerOne.primaryWeapon == 1466416941) { // Charge
                            if (getCupheadLevel(bossIDs['therootpack'], true).completed) {
                                getCommBestILs('DLC+Base C/S')
                            } else if (runRecap_savFile.loadouts.playerOne.secondaryWeapon == 1568276855) { // Twist-Up
                                getCommBestILs('DLC C/T')
                            } else if (getCupheadLevel(bossIDs['glumstonethegiant'], true).difficultyBeaten == 2) {
                                getCommBestILs('DLC Expert')
                            } else {
                                getCommBestILs('DLC C/S')
                            }
                        } else {
                            getCommBestILs('DLC Low%')
                        }
                    } else {
                        getCommBestILs('NMG')
                    }
                } else {
                    if (runRecap_savFile.loadouts.playerOne.secondaryWeapon == 1466518900) { // Roundabout
                        getCommBestILs('Legacy')
                    } else {
                        getCommBestILs('1.1+')
                    }
                }
            } else {
                read_lss(content)
            }
        } catch (error) {
            show('runRecapError')
            console.log(error)
        }
    } else {
        show('runRecapError')
    }
    if (event.target?.files) {
        event.target.value = ''
    }
}
function runRecapInfo() {
    const player = players[globalPlayerIndex]
    const playerName = player ? getPlayerName(player) : `<span style='color:white'>${runRecapPlayerName}</span>`
    let HTMLContent = ''
    HTMLContent += `<div>
                        SAVE FILE LOCATIONS:
                        <br>Windows: ${myekulColor(`C:\\Users\\<span class='runRecapInfoName'>${playerName}</span>\\AppData\\Roaming\\Cuphead`)}
                        <br>Mac: ${myekulColor(`/Users/<span class='runRecapInfoName'>${playerName}</span>/Library/Application\\ Support/unity.Studio\\ MDHR.Cuphead/Cuphead`)}
                    </div>`
    return HTMLContent
}
function runRecapViewPage(newPage, elem, shh) {
    sortCategoryIndex = -1
    runRecapView = newPage
    document.querySelectorAll('.runRecap_section').forEach(elem => {
        hide(elem)
    })
    if (elem) {
        runRecapElem = elem
        if (!shh) {
            playSound('ready')
        }
    }
    updateComparisonInfo()
    show('runRecap_' + newPage)
    if (newPage == 'home') {
        runRecapUpdateComparison()
        runRecapHome()
    } else {
        if (runRecap_savFile) {
            show('runRecap_sav_download')
            show('runRecap_sav_comparison')
        } else {
            hide('runRecap_sav_download')
            hide('runRecap_sav_comparison')
        }
        if (runRecapElem == 'sav') {
            show('runRecap_sav_tabs')
            hide('runRecap_lss_comparison')
            show('runRecap')
            hide('lss_chart')
            hide('runRecap_lss')
            runRecapAction()
        } else {
            hide('runRecap_sav_tabs')
            show('runRecap_lss_comparison')
            hide('runRecap')
            show('lss_chart')
            show('runRecap_lss')
            generate_lss()
        }
    }
}
function runRecapUpdateComparison() {
    let HTMLContent = ''
    for (let i = 0; i < commBestILsCategory.numRuns; i++) {
        HTMLContent += `<option value="player_${i}">${i + 1}. ${fullgamePlayer(i)}</option>`
    }
    document.getElementById('runRecap_optgroup').innerHTML = HTMLContent
}
function runRecapHome() {
    runRecapWelcome()
    if (runRecapExample) {
        runRecapUnload('sav', true)
        runRecapUnload('lss', true)
        runRecapExample = false
    }
    categories.forEach(category => {
        category.info.levelID = bossIDs[category.info.id]
    })
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
function runRecapGrade(delta) {
    let score = 100 - (delta * 4)
    if (!document.getElementById('checkbox_runRecap_harsh').checked) {
        score = 100 - delta
    }
    return getLetterGrade(score)
}
function runRecapDelta(runTime, comparisonTime) {
    return Math.floor(runTime) - Math.floor(comparisonTime)
}
function getDelta(delta) {
    return (delta < 0 ? '' : '+') + delta + 's'
}