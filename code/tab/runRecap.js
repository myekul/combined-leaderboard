function runRecapHandle(tab) {
    if (mode != 'commBestILs') {
        globalTab = tab
        getCommBestILs()
    } else {
        showTab(tab)
    }
}
function showInput(elem) {
    playSound('move')
    hide(elem)
    const input_elem = document.getElementById('input_' + elem)
    show(input_elem)
    input_elem.focus()
    input_elem.select()
    if (elem == 'runRecap_time') playSound('win_time_loop')
    let handled = false;
    input_elem.addEventListener('change', () => {
        if (!handled) {
            hideInput(elem);
            handled = true;
            if (elem == 'runRecap_time') playSound('win_time_loop_end');
        }
    });
    input_elem.addEventListener('blur', () => {
        if (!handled) {
            hideInput(elem);
            handled = true;
            if (elem == 'runRecap_time') playSound('win_time_loop_end');
        }
    });
}
function hideInput(elem) {
    const input_elem = document.getElementById('input_' + elem)
    const input = input_elem.value
    hide(input_elem)
    if (elem == 'username') {
        playSound('category_select')
    } else if (elem == 'runRecap_time') {
        stopSound('win_time_loop')
        runRecapTime = input.trim() ? input : runRecapTime
    }
    const startElem = document.getElementById(elem)
    if (elem == 'username') {
        localStorage.setItem('username', input.trim() ? input : localStorage.getItem('username'))
        startElem.innerHTML = runRecapPlayer(elem)
        action()
    } else {
        startElem.innerHTML = runRecapTimeElem(runRecapTime)
    }
    show(startElem)
}
function runRecapPlayer(elem) {
    const playerString = runRecapExample ? players[globalPlayerIndex].name : localStorage.getItem('username')
    const player = players.find(player => player.name == playerString)
    globalPlayerIndex = player ? player.rank - 1 : -1
    const playerName = player ? getPlayerName(player) : playerString
    let HTMLContent = `<div class='container' style='gap:8px;margin:0'>`
    HTMLContent += player ? `<div>${getPlayerIcon(player, elem == 'username' ? 28 : 40)}</div>` : ''
    HTMLContent += `<div style='font-size:${elem == 'username' ? '110' : '130'}%'>${playerName}</div>`
    HTMLContent += player ? `<div>${getPlayerFlag(player, elem == 'username' ? 14 : 18)}</div>` : ''
    HTMLContent += `</div>`
    return HTMLContent
}
function runRecapTimeElem(time) {
    return `<div style='font-size:150%'>${time}</div>`
}
function generateDropbox(elem) {
    const dropBoxID = 'runRecap_dropBox_' + elem
    const dropBoxInnerID = dropBoxID + '_inner'
    const unsupported = elem == 'lss' && !commBestILsCategory.markin
    const fileUploaded = !unsupported && (elem == 'sav' && runRecap_savFile || elem == 'lss' && runRecap_lssFile.pbSplits)
    let HTMLContent = ''
    HTMLContent += `<div id='${dropBoxInnerID}' class="dropBox ${fileUploaded ? extraCategory.className + ' flash' : ''}">
                        <div>
                            <div class="container" style="font-family:var(--font2);font-size:150%">.${elem}&nbsp;`
    if (fileUploaded) {
        HTMLContent += fontAwesome('check')
    }
    HTMLContent += `</div>
                    <div class="container">
                        <input type='file' id='runRecap_${elem}_input' ${elem == 'lss' ? "accept='lss'" : ''} onchange="runRecapHandleFile(event,'${elem}')" style='display:none'>`
    if (unsupported) {
        HTMLContent += `<div>Category not supported!</div>`
    } else {
        HTMLContent += `<div onclick="document.getElementById('runRecap_${elem}_input').click()" class='button cuphead'>${fontAwesome('upload')}&nbsp;Upload file</div>`
    }

    if (elem == 'sav') {
        HTMLContent += `<div onclick="openModalCL('runRecapInfo','up')" class='grow' style="padding-left:5px">${fontAwesome('info-circle')}</div>`
        HTMLContent += `<div class='divider'></div>
    <div onclick="processSavFile()" class="button cuphead" style="width:110px">${fontAwesome('plus')}&nbsp;Empty file</div>`
    }
    HTMLContent += `</div>`
    if (fileUploaded) {
        cellContent = elem == 'sav' ? fontAwesome('folder') : `<img src="images/livesplit.png" style="width:30px">`
        HTMLContent += `<div class='container' style='padding-top:20px'>
        <div onclick="runRecapViewPage('content','${elem}')" class='button cuphead pulseSize' style="font-family:var(--font2);font-size:150%;width:200px;height:50px">${cellContent}&nbsp;View .${elem}</div>
        </div>`
        HTMLContent += `<div onclick="runRecapUnload('${elem}')" class='grow' style='position:absolute;bottom:8px;right:10px;font-size:130%'>${fontAwesome('trash')}</div>`
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
                let category
                if ('isPlayer1Mugman' in runRecap_savFile) {
                    if (getCupheadLevel(mausoleumID, true).completed) {
                        if (runRecap_savFile.loadouts.playerOne.primaryWeapon == 1467024095) { // Lobber
                            if (getCupheadLevel(bossIDs['therootpack'], true).completed) {
                                category = 'DLC+Base L/S'
                            } else {
                                category = 'DLC L/S'
                            }
                        } else if (runRecap_savFile.loadouts.playerOne.primaryWeapon == 1466416941) { // Charge
                            if (getCupheadLevel(bossIDs['therootpack'], true).completed) {
                                category = 'DLC+Base C/S'
                            } else if (runRecap_savFile.loadouts.playerOne.secondaryWeapon == 1568276855) { // Twist-Up
                                category = 'DLC C/T'
                            } else if (getCupheadLevel(bossIDs['glumstonethegiant'], true).difficultyBeaten == 2) {
                                category = 'DLC Expert'
                            } else {
                                category = 'DLC C/S'
                            }
                        } else {
                            category = 'DLC Low%'
                        }
                    } else {
                        category = 'NMG'
                    }
                } else {
                    if (runRecap_savFile.loadouts.playerOne.secondaryWeapon == 1466518900) { // Roundabout
                        category = 'Legacy'
                    } else {
                        category = '1.1+'
                    }
                }
                getCommBestILs(category)
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
    const playerName = player ? getPlayerName(player) : `<span style='color:white'>${localStorage.getItem('username')}</span>`
    let HTMLContent = ''
    HTMLContent += `<div>
                        SAVE FILE LOCATIONS:
                        <br>Windows: ${myekulColor(`C:\\Users\\<span class='runRecapInfoName'>${playerName}</span>\\AppData\\Roaming\\Cuphead`)}
                        <br>Mac: ${myekulColor(`/Users/<span class='runRecapInfoName'>${playerName}</span>/Library/Application\\ Support/unity.Studio\\ MDHR.Cuphead/Cuphead`)}
                    </div>`
    return HTMLContent
}
function runRecapDatabase() {
    let HTMLContent = ''
    HTMLContent += `<div>Coming soon!</div>`
    return HTMLContent
}
function runRecapUploadButton() {
    if (localStorage.getItem('username') && runRecapTime != 'XX:XX') {
        window.firebaseUtils.firestoreWriteRR()
    } else {
        openModalCL('runRecapUpload')
    }
}
function runRecapUpload() {
    let HTMLContent = ''
    HTMLContent += `
    <div style='margin-bottom:20px'>${myekulColor(fontAwesome('warning'))} Please insert your run time and username.</div>
    <div>Fraudulent or duplicate submissions are subject to deletion.</div>`
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
    show('runRecap_' + runRecapView)
    if (runRecapView == 'home') {
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
            generate_sav()
        } else {
            hide('runRecap_sav_tabs')
            show('runRecap_lss_comparison')
            generate_lss()
        }
    }
    if (runRecapElem == 'lss' && !runRecapExample) {
        show('runRecap_lss_comparison')
    } else {
        hide('runRecap_lss_comparison')
    }
    if (runRecapElem == 'lss' && (!runRecap_savFile || runRecapExample)) {
        hide('runRecap_divider')
    } else {
        show('runRecap_divider')
    }
    if (runRecapExample) {
        show('runRecap_example_div')
        // hide('runRecap_upload_div')
    } else {
        hide('runRecap_example_div')
        // show('runRecap_upload_div')
    }
    if (runRecapView != 'home' && runRecapTheoretical) {
        show('runRecap_theoretical_div')
    } else {
        hide('runRecap_theoretical_div')
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
    if (runRecapExample) {
        runRecapDefault()
        runRecapUnload('sav', true)
        runRecapUnload('lss', true)
        runRecapExample = false
        hide('runRecap_example_div')
    }
    if (localStorage.getItem('username')) {
        document.getElementById('runRecap_player').innerHTML = runRecapPlayer('runRecap_player')
    }
    let HTMLContent = `<div><table class='bigShadow'>`
    players.slice(0, commBestILsCategory.numRuns).forEach((player, playerIndex) => {
        if (player.extra) {
            HTMLContent += `<tr class='${getRowColor(playerIndex)} clickable' onclick="processSavFile(${playerIndex});playSound('category_select')">`
            HTMLContent += `<td>${getTrophy(playerIndex + 1)}</td>`
            HTMLContent += `<td class='${placeClass(playerIndex + 1)}' style='padding:0 4px'>${secondsToHMS(player.extra.score)}</td>`
            HTMLContent += `<td>${getPlayerFlag(player, 12)}</td>`
            HTMLContent += `<td style='padding:0 3px'>${getPlayerIcon(player, 28)}</td>`
            HTMLContent += `<td style='padding-right:4px;text-align:left'>${getPlayerName(player)}</td>`
            HTMLContent += `</tr>`
        }
    })
    HTMLContent += `</table>`
    HTMLContent += `
    <div class='container' style='margin-top:10px'>
        <div class='button cuphead' style='gap:5px;width:170px' onclick="openModalCL('runRecapDatabase','up')">
            ${fontAwesome('cloud')}
            Browse database
        </div>
    </div>`
    HTMLContent += `</div>`
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
function runRecap_chart(times, deltas, lss) {
    const data = new google.visualization.DataTable()
    data.addColumn('number', 'Times')
    data.addColumn('number', 'Delta')
    data.addColumn({ type: 'string', role: 'style' })
    // data.addColumn({ role: 'annotation' })
    const rows = []
    const startingIndex = lss ? getOffset() : 1
    for (let i = 0; i < startingIndex; i++) {
        rows.push([0, 0, ''])
    }
    times.forEach((time, index) => {
        let colorClass
        if (lss) {
            colorClass = index >= getOffset() ? splitInfo[index].id : ''
        } else {
            colorClass = categories[index].info.id
        }
        const color = colorClass ? getColorFromClass(colorClass) : ''
        // rows.push([split, deltas[index], `point { fill-color: ${color}; }`, getDelta(deltas[index])])
        rows.push([time, deltas[index], `point { fill-color: ${color}; }`])
    })
    data.addRows(rows)
    const options = {
        // curveType: 'function', // Smooth curves
        chartArea: { height: '90%' },
        legend: { position: 'none' },
        backgroundColor: 'transparent',
        pointSize: 9,
        lineWidth: 2,
        series: { 0: { color: 'gray' } },
        hAxis: {
            textStyle: {
                color: 'transparent',
                fontName: getFont()
            },
            minValue: 0,
            gridlines: { count: 0 }
        },
        vAxis: {
            textStyle: {
                color: 'transparent',
                fontName: getFont()
            },
            gridlines: { count: 0 },
            baselineColor: 'gray'
        },
        tooltip: { trigger: 'none' },
        // annotations: {
        //     style: 'none',
        //     textStyle: {
        //         fontName: getFont()
        //     }
        // },
    };
    const chart = new google.visualization.LineChart(document.getElementById('runRecap_chart'));
    chart.draw(data, options);
}
function runRecapDefault() {
    document.getElementById('runRecap_time').innerHTML = `
    <div style='font-size:150%'>XX:XX</div>
    <div style='font-size:160%'>${fontAwesome('edit')}</div>`
    runRecapTime = 'XX:XX'
}
function runRecapMusic() {
    const src = ['DLC', 'DLC+Base'].includes(commBestILsCategory.name) ? `https://www.youtube.com/embed/L6T3fpUGSmE?si=CY3h0TbNYkQ003eZ` : `https://www.youtube.com/embed/cdvSNkW3Uyk?si=VcZ9Du_FsD5A8O6g`
    document.getElementById('musicDiv').innerHTML = `
    <iframe width="150" height="150" src="${src}&amp;controls=0" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    `
}