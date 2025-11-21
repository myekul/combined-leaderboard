function generateWRs() {
    showWRsTab(WRsTab)
}
function WRsPlayers() {
    let HTMLContent = `<div class='container'><table class='bigShadow' style='${mode == 'fullgame' && gameID != 'tetris' ? 'border-collapse:collapse' : ''}'>`
    if (gameID == 'cuphead' && mode != 'fullgame') {
        if (document.getElementById('checkbox_WRs_dps').checked || document.getElementById('checkbox_WRs_hp').checked) {
            assignHP()
        }
    }
    HTMLContent += gameID == 'cuphead' && mode == 'levels' ? cupheadLevelWRs() : WRs()
    HTMLContent += `</table></div>`
    sortCategoryIndex = -1
    sortPlayers(players)
    document.getElementById('WRs').innerHTML = HTMLContent
}
function getWorldRecordPlayers(categoryIndex) {
    let HTMLContent = ''
    sortCategoryIndex = categoryIndex
    const playersCopy = [...players]
    sortPlayers(playersCopy)
    // if (['levels'].includes(mode)) {
    //     HTMLContent += `<td>${getImage(categories[categoryIndex].info.id)}</td>`
    // }
    const category = categories[categoryIndex]
    let worldRecord = getWorldRecord(category)
    if (!worldRecord) worldRecord = ''
    if (document.getElementById('checkbox_WRs_date').checked) {
        HTMLContent += gameID != 'tetris' ? `<td>${playersCopy[0].runs[sortCategoryIndex].date}</td>` : ''
    }
    if (gameID == 'cuphead' && mode != 'fullgame') {
        if (document.getElementById('checkbox_WRs_dps').checked) {
            HTMLContent += `<td>${getDPS(category, worldRecord)} DPS</td>`
        }
        if (document.getElementById('checkbox_WRs_hp').checked) {
            HTMLContent += `<td style='font-size:75%'>${category.hp} HP</td>`
        }
    }
    const className = mode == 'fullgame' ? 'first' : classNameLogic(category)
    HTMLContent += `<td class='${className}' style='padding:0 5px'>${tetrisCheck(category, worldRecord)}</td>`
    let count = 0
    category.runs.forEach(run => {
        if (run.place == 1) count++
    })
    if (count > 4) {
        HTMLContent += `<td></td><td class='clickable' style='text-align:left' onclick="showTab('home');organizePlayers(${categoryIndex})">-- ${count}-way tie --</td>`
    } else {
        playersCopy.forEach(player => {
            const run = player.runs[sortCategoryIndex]
            if (run?.place == 1) {
                // HTMLContent += `<td>${getPlayerFlag(player, 12)}</td>`
                HTMLContent += `<td>${getPlayerIcon(player, 18)}</td>`
                HTMLContent += `<td class='clickable' style='text-align:left'>${getAnchor(run.url)}${run.debug ? '*' : ''}${getPlayerName(player)}</td>`
            }
        })
    }
    return HTMLContent
}
function WRs() {
    let HTMLContent = ''
    if (mode == 'fullgame' && gameID != 'tetris') {
        let everyRun = getEveryRun()
        everyRun.sort((a, b) => b.run.percentage - a.run.percentage)
        everyRun = everyRun.slice(0, categories.length)
        everyRun.sort((a, b) => a.categoryIndex - b.categoryIndex)
        HTMLContent += fancyTable(everyRun)
    } else {
        categories.forEach((category, categoryIndex) => {
            HTMLContent += WRsCategoryDisplay(category, categoryIndex)
            HTMLContent += getWorldRecordPlayers(categoryIndex)
            HTMLContent += `</tr>`
        })
    }
    return HTMLContent
}
function WRsCategoryDisplay(category, categoryIndex) {
    let HTMLContent = ''
    const className = classNameLogic(category)
    HTMLContent += `<tr class='${getRowColor(categoryIndex)}'>`
    HTMLContent += `<td class='${className}' style='text-align:left;font-weight:bold;padding:0 3px'>${category.name}</td>`
    if (category.info) {
        HTMLContent += `<td style='padding:0' class='${className} container'>${getImage(category.info.id, 24)}</td>`
    }
    return HTMLContent
}
function cupheadLevelWRs() {
    let HTMLContent = ''
    let categoryIndex = 0
    const loadoutsChecked = document.getElementById('checkbox_WRs_loadouts').checked
    if (loadoutsChecked && !categories[0].loadout) assignLoadouts()
    while (categoryIndex < categories.length) {
        const category = categories[categoryIndex]
        const numCats = cupheadNumCats(category)
        for (let i = 1; i <= numCats; i++) {
            HTMLContent += `<tr class='${getRowColor(categoryIndex)}'>`
            if (i == 1) {
                const clickEvent = bossILindex == -1 ? `onclick="getBossIL('${category.info.id}')"` : ''
                const clickable = bossILindex == -1 ? 'clickable' : ''
                const height = big5() ? '' : 21
                HTMLContent += `<th rowspan=${numCats} ${clickEvent} class='${clickable} ${category.info.id}'>${getImage(category.info.id, height)}</th>`
            }
            const thisCategory = categories[categoryIndex]
            if (loadoutsChecked) {
                const loadout = thisCategory.loadout
                HTMLContent += `<td>${loadout[0] ? cupheadShot(loadout[0], '', true) : ''}</td>`
                HTMLContent += `<td>${loadout[1] ? cupheadShot(loadout[1], '', true) : ''}</td>`
                HTMLContent += loadout[2] ? `<td><img src='https://myekul.com/shared-assets/cuphead/images/inventory/super/${loadout[2]}.png' class='container'></td>` : `<td></td>`
                HTMLContent += loadout[3] ? `<td><img src='https://myekul.com/shared-assets/cuphead/images/inventory/charm/${loadout[3]}.png' class='container'></td>` : `<td></td>`
            }
            if (big5()) {
                HTMLContent += `<td class='${thisCategory.difficulty}' style='width:6px'></td>`
            }
            HTMLContent += getWorldRecordPlayers(categoryIndex, category.info.id)
            HTMLContent += `</tr>`
            categoryIndex++
        }
    }
    return HTMLContent
}
function WRsSums() {
    let HTMLContent = ''
    if (gameID == 'cuphead' && mode == 'levels') {
        HTMLContent += WRsSumsCuphead()
    } else {
        HTMLContent += `<div class='container'><table>`
        sum = 0
        categories.forEach((category, categoryIndex) => {
            const worldRecord = getWorldRecord(category)
            sum += worldRecord
            HTMLContent += WRsCategoryDisplay(category, categoryIndex)
            HTMLContent += `<td class='${classNameLogic(category)}' style='padding:0 3px'>${tetrisCheck(category, worldRecord)}</td>`
            HTMLContent += `</tr>`
        })
        HTMLContent += `</table></div>`
        HTMLContent += `<div class='container' style='margin-top:20px;font-size:150%'>${secondsToHMS(sum)}</div>`
    }
    document.getElementById('WRs').innerHTML = HTMLContent
}
function WRsSumsCuphead() {
    let HTMLContent = `<div class='container'><table>`
    let totalSum = 0
    let categoryIndex = 0
    while (categoryIndex < categories.length) {
        const category = categories[categoryIndex]
        const numCats = cupheadNumCats(category)
        if (categoryIndex == 0 && big5()) {
            HTMLContent += `<tr><td></td><td></td>`
            for (let i = 0; i < numCats; i++) {
                const thisCategory = categories[i]
                HTMLContent += `<td class='${thisCategory.difficulty}' style='font-size:60%'>${trimDifficulty(thisCategory.name)}</td>`
            }
            HTMLContent += `</tr>`
        }
        HTMLContent += `<tr class='${getRowColor(categoryIndex)}'>`
        HTMLContent += `<td class='${category.info.id}' style='text-align:right'>${category.info.name}</td>`
        HTMLContent += `<th class='${category.info.id} container'>${getImage(category.info.id, 21)}</th>`
        if (numCats == 4) HTMLContent += `<td></td><td></td>`
        let sum = 0
        let thisCategory
        for (let i = 1; i <= numCats; i++) {
            thisCategory = categories[categoryIndex]
            const worldRecord = getWorldRecord(thisCategory)
            HTMLContent += `<td class='${category.info.id}' style='padding:0 4px'>${secondsToHMS(worldRecord)}</td>`
            sum += worldRecord
            categoryIndex++
        }
        HTMLContent += big4() ? `<td>${secondsToHMS(sum)}</td>` : ''
        totalSum += sum
        HTMLContent += `</tr>`
    }
    HTMLContent += `</table></div>`
    HTMLContent += bigTextDisplay(secondsToHMS(totalSum))
    return HTMLContent
}
function bigTextDisplay(text) {
    return `<div class='container' style='margin-top:20px;font-size:150%'>${text}</div>`
}
function WRsChart() {
    const allWRs = []
    const WRs = { count: [] }
    const isleObject = { 1: [], 2: [], 3: [], 4: [], 5: [] }
    const difficultyObject = { simple: [], simplehighest: [], regular: [], regularhighest: [], expert: [], experthighest: [] }
    const groundPlaneObject = { ground: [], plane: [] }
    const dropdown_WRsChart = document.getElementById('dropdown_WRsChart').value
    const checkbox_hp = document.getElementById('checkbox_hp').checked
    let sortObject
    let objectReference
    categories.forEach((category, categoryIndex) => {
        let worldRecord = getWorldRecord(category)
        worldRecord = worldRecord ? worldRecord.toString().split('.')[0] : 0
        const worldRecordObject = { score: worldRecord }
        if (checkbox_hp) worldRecordObject.categoryIndex = categoryIndex
        if (dropdown_WRsChart == 'isle') {
            sortObject = isleObject
            sortObject[category.info.isle].push(worldRecordObject)
            objectReference = isles
        } else if (dropdown_WRsChart == 'difficulty') {
            sortObject = difficultyObject
            sortObject[(big5() && categoryIndex % 2 == 0) || (!big5() && anyHighest == 'any') ? category.difficulty : category.difficulty + 'highest'].push(worldRecordObject)
            objectReference = difficulties
        } else if (dropdown_WRsChart == 'groundPlane') {
            sortObject = groundPlaneObject
            sortObject[category.info.plane ? 'plane' : 'ground'].push(worldRecordObject)
            objectReference = groundPlaneArray
        } else {
            sortObject = WRs
        }
        WRs['count'].push(worldRecordObject)
        allWRs.push(worldRecord)
    })
    WRsInfo(sortObject, objectReference, WRs, allWRs)
    const min = Math.min(...allWRs)
    const max = Math.max(...allWRs)
    const fullData = [];
    if (checkbox_hp) {
        assignHP()
        let sortObjectIndex = 0
        for (const key in sortObject) {
            sortObject[key].forEach(elem => {
                const worldRecord = parseInt(elem.score)
                const categoryIndex = elem.categoryIndex
                const category = categories[categoryIndex]
                const newEntry = [worldRecord]
                for (let i = 0; i < Object.keys(sortObject).length; i++) {
                    const entry = i == sortObjectIndex ? category.hp : Infinity
                    newEntry.push(entry)
                }
                if (!objectReference) {
                    newEntry.push('color: ' + getColorFromClass(category.info.id))
                    newEntry.push(generateBoardTitle(0, categoryIndex))
                }
                fullData.push(newEntry)
            })
            sortObjectIndex++
        }
    } else {
        for (const key in sortObject) {
            sortObject[key] = sortObject[key].reduce((acc, item) => {
                acc[item.score] = (acc[item.score] || 0) + 1;
                return acc;
            }, {});
        }
        for (let i = min; i <= max; i++) {
            const newEntry = [i]
            for (const key in sortObject) {
                newEntry.push(sortObject[key][i] || Infinity)
            }
            fullData.push(newEntry);
        }
    }
    if (!objectReference && checkbox_hp) {
        tooltipStyle = document.createElement('style');
        tooltipStyle.innerHTML =
            `.google-visualization-tooltip {
                background-color: transparent !important;
                border: none !important;
                box-shadow: none !important;
                transform: translate(-5%, 50%);
            }`
        document.head.appendChild(tooltipStyle);
    } else {
        tooltipStyle?.remove()
    }
    const labels = ['Time']
    let colors = []
    if (objectReference) {
        objectReference.forEach(object => {
            labels.push(object.name)
            colors.push(getColorFromClass(object.className))
        })
    } else {
        labels.push('Count')
        if (checkbox_hp) {
            labels.push({ role: 'style' })
            labels.push({ role: 'tooltip', p: { html: true } })
        }
        const colorClass = bossILindex > -1 ? bosses[bossILindex].id : 'banner'
        colors.push(getColorFromClass(colorClass))
    }
    const chartData = [labels, ...fullData]
    var data = google.visualization.arrayToDataTable(chartData);
    var options = {
        chartArea: { width: '80%' },
        hAxis: {
            title: 'Time',
            titleTextStyle: {
                color: 'white',
                fontName: getFont()
            },
            textStyle: {
                color: 'white',
                fontName: getFont(),
                fontSize: 12
            },
            minValue: 0,
            maxValue: gameID == 'cuphead' && mode == 'levels' ? 120 : max
        },
        vAxis: {
            title: checkbox_hp ? 'HP' : '# of WRs',
            titleTextStyle: {
                color: 'white',
                fontName: getFont()
            },
            textStyle: {
                color: 'white',
                fontName: getFont(),
                fontSize: 12
            },
            minValue: 0,
            maxValue: checkbox_hp ? 3500 : 10
        },
        tooltip: {
            textStyle: {
                fontName: getFont()
            },
            isHtml: checkbox_hp && !objectReference
        },
        legend: {
            position: objectReference ? 'top' : 'none',
            textStyle: {
                fontName: getFont(),
                fontSize: 12,
                color: 'white'
            }
        },
        isStacked: true,
        colors: colors,
        backgroundColor: getBackgroundColor()
    };
    document.getElementById('WRs').innerHTML = ''
    var chart
    if (checkbox_hp) {
        chart = new google.visualization.ScatterChart(document.getElementById('WRsChart'));
    } else {
        chart = new google.visualization.ColumnChart(document.getElementById('WRsChart'));
    }
    chart.draw(data, options);
}
function WRsInfo(sortObject, objectReference, WRs, allWRs) {
    if (bossILindex > -1) {
        objectReference = null
        sortObject = WRs
    }
    let HTMLContent = `<div class='container'><table>`
    HTMLContent += `<tr><td></td>`
    if (objectReference) {
        HTMLContent += `<td>All</td>`
        objectReference.forEach(object => {
            if (document.getElementById('dropdown_WRsChart').value == 'difficulty') {
                HTMLContent += `<td class='${object.className.split('highest')[0]}'>${trimDifficulty(object.name)}</td>`
            } else {
                HTMLContent += `<td class='${object.className}'>${object.name}</td>`
            }
        })
    }
    statTypes.forEach((statType, index) => {
        HTMLContent += `</tr><tr class='${getRowColor(index)}'><td>${statType.label}</td>`
        if (objectReference) {
            HTMLContent += `<td>${statType.func(allWRs)}</td>`
        }
        for (const key in sortObject) {
            HTMLContent += `<td>${statType.func(sortObjectArray(sortObject[key]))}</td> `
        }
    })
    HTMLContent += `</table></div>`
    document.getElementById('WRsInfo').innerHTML = HTMLContent
}
function sortObjectArray(arr) {
    return arr.map(elem => elem.score)
}
function showWRsTab(tab) {
    WRsTab = tab
    buttonClick('WRs_' + WRsTab, 'WRsTabs', 'activeBanner')
    document.getElementById('WRsChart').innerHTML = ''
    if (WRsTab == 'chart') {
        show('WRsChartSection')
        if ((gameID == 'cuphead' && mode == 'levels')) {
            show('WRsChart_options')
        } else {
            document.getElementById('dropdown_WRsChart').value = 'default'
            document.getElementById('checkbox_hp').checked = false
        }
    }
    if (gameID == 'tetris') hide('WRsTabs')
    if (WRsTab == 'players') {
        WRsPlayers()
    } else if (WRsTab == 'sums') {
        WRsSums()
    } else if (WRsTab == 'chart') {
        WRsChart()
    }
}
function assignLoadouts() {
    let categoryIndex = 0
    while (categoryIndex < categories.length) {
        const category = categories[categoryIndex]
        const numCats = cupheadNumCats(category)
        for (let i = 1; i <= numCats; i++) {
            let loadout = cupheadVersion == 'legacy' ? loadoutsLegacy[category.info.id] : DLCnoDLC == 'nodlc' ? loadouts[category.info.id] : loadoutsDLC[category.info.id]
            if (difficultyILs && loadout.length > 1) {
                if (levelDifficulty == 'simple') {
                    loadout = loadout.slice(0, 2)
                } else if (levelDifficulty == 'regular') {
                    loadout = loadout.slice(2, 4)
                } else if (levelDifficulty == 'expert') {
                    loadout = loadout.slice(4, 6)
                }
            }
            let theLoadout = []
            if (loadout.length == 0) {
                const charm = DLCnoDLC == 'nodlc' ? 'whetstone' : 'divinerelic'
                theLoadout = ['', '', '', charm]
            } else {
                let index = loadout.length == 1 ? 0 : i - 1
                if (loadout.length > 1 && numCats == 4 && !difficultyILs) {
                    index += 2
                }
                for (let j = 0; j < 4; j++) {
                    const item = loadout[index][j]
                    theLoadout.push(item)
                }
            }
            categories[categoryIndex].loadout = theLoadout
            categoryIndex++
        }
    }
}
function assignHP() {
    categories.forEach((category, categoryIndex) => {
        const hp = bossHP[category.info.id]
        let hpIndex
        switch (category.difficulty) {
            case 'simple':
                hpIndex = 0
                break
            case 'regular':
                hpIndex = 1
                break
            case 'expert':
                hpIndex = 2
                break
        }
        if (hp.length == 6) {
            hpIndex *= 2
            hpIndex += categoryIndex % 2
            if (!big5() && anyHighest == 'highest') {
                hpIndex++
            }
        }
        category.hp = hp[hpIndex]
    })
}