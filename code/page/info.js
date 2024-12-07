function generateInfo() {
    let HTMLContent = `<table class='bigShadow'>`
    if (gameID == 'cuphead' && mode == 'levels') {
        HTMLContent += cupheadLevelInfo()
    } else {
        HTMLContent += info()
    }
    HTMLContent += `</table>`
    sortCategoryIndex = -1
    sortPlayers(players)
    document.getElementById('info').innerHTML = HTMLContent
}
function getWorldRecordPlayers(categoryIndex, className) {
    let HTMLContent = ''
    sortCategoryIndex = categoryIndex
    const playersCopy = [...players]
    sortPlayers(playersCopy)
    // if (['levels', 'fullgameILs'].includes(mode)) {
    //     HTMLContent += `<td>${getImage(categories[categoryIndex].info.id)}</td>`
    // }
    let worldRecord = getWorldRecord(categories[categoryIndex])
    if (!worldRecord) {
        worldRecord = ''
    }
    if (document.getElementById('checkbox_info_date').checked) {
        HTMLContent += gameID != 'tetris' && mode != 'fullgameILs' ? `<td>${playersCopy[0].runs[sortCategoryIndex].date}</td>` : ''
    }
    if (mode == 'fullgame') {
        className = 'first'
    }
    HTMLContent += `<td class='${className}'>${tetrisCheck(categories[categoryIndex], worldRecord)}</td>`
    playersCopy.forEach(player => {
        const run = player.runs[sortCategoryIndex]
        if (run) {
            if (run.place == 1) {
                HTMLContent += `<td>${getPlayerFlag(player, 13)}</td>`
                HTMLContent += `<td onclick="${getVideoLink(run)}" class='clickable' style='text-align:left'>${getPlayerName(player)}</td>`
            }
        }
    })
    return HTMLContent
}
function info() {
    let HTMLContent = ''
    categories.forEach((category, categoryIndex) => {
        HTMLContent += `<tr class='${getRowColor(categoryIndex)}'>`
        const className = category.info ? category.info.id : category.className
        HTMLContent += `<td class='${className}' style='text-align:left;font-weight:bold'>${category.name}</td>`
        if (category.info) {
            HTMLContent += `<td style='padding:0' class='${className}'>${getImage(category.info.id, 21)}</td>`
        }
        HTMLContent += getWorldRecordPlayers(categoryIndex, className)
        HTMLContent += `</tr>`
    })
    return HTMLContent
}
function cupheadLevelInfo() {
    let HTMLContent = ''
    // let loadoutsArray = [[], [], [], []]
    let categoryIndex = 0
    while (categoryIndex < categories.length) {
        const category = categories[categoryIndex]
        const numCats = getNumCats(category)
        for (let i = 1; i <= numCats; i++) {
            HTMLContent += `<tr class='${getRowColor(categoryIndex)}'>`
            if (i == 1) {
                const clickEvent = bossILindex == -1 ? `onclick="getBossIL('${category.info.id}')"` : ''
                const clickable = bossILindex == -1 ? 'clickable' : ''
                const height = big5() ? '' : 21
                HTMLContent += `<th rowspan=${numCats} ${clickEvent} class='${clickable} ${category.info.id}'>${getImage(category.info.id, height)}</th>`
            }
            if (document.getElementById('checkbox_info_loadouts').checked) {
                HTMLContent += getLoadout(category, numCats, i)
            }
            if (big5()) {
                const thisCategory = categories[categoryIndex]
                HTMLContent += `<td class='${thisCategory.difficulty}' style='width:6px'></td>`
            }
            HTMLContent += getWorldRecordPlayers(categoryIndex, category.info.id)
            HTMLContent += `</tr>`
            categoryIndex++
        }
    }
    return HTMLContent
}
function getLoadout(category, numCats, i) {
    let HTMLContent = ''
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
    if (loadout.length == 0) {
        const charm = DLCnoDLC == 'nodlc' ? 'whetstone' : 'divinerelic'
        HTMLContent += `<td></td><td></td><td></td><td><img src='images/cuphead/inventory/charms/${charm}.png' class='container'></td>`
    } else {
        let index = loadout.length == 1 ? 0 : i - 1
        if (loadout.length > 1 && numCats == 4 && !difficultyILs) {
            index += 2
        }
        const theLoadout = []
        for (let j = 0; j < 4; j++) {
            const item = loadout[index][j]
            // loadoutsArray[j].push(item)
            theLoadout.push(item)
        }
        HTMLContent += theLoadout[0] ? `<td><img src='images/cuphead/inventory/weapons/${theLoadout[0]}.png' class='container'></td>` : `<td></td>`
        HTMLContent += theLoadout[1] ? `<td><img src='images/cuphead/inventory/weapons/${theLoadout[1]}.png' class='container'></td>` : `<td></td>`
        HTMLContent += theLoadout[2] ? `<td><img src='images/cuphead/inventory/supers/${theLoadout[2]}.png' class='container'></td>` : `<td></td>`
        HTMLContent += theLoadout[3] ? `<td><img src='images/cuphead/inventory/charms/${theLoadout[3]}.png' class='container'></td>` : `<td></td>`
    }
    return HTMLContent
}