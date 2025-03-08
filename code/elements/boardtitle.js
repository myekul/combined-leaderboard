function setBoardTitle() {
    if (sortCategoryIndex > -1) {
        if (page == 'leaderboard') {
            show('checkbox_isolate')
        }
        show('closeBoardTitle')
    } else {
        if (mode != 'commBestILs') {
            hide('checkbox_isolate')
        }
        hide('closeBoardTitle')
    }
    if (mode == 'commBestILs') {
        if (page == 'leaderboard') {
            show('checkbox_isolate')
        } else {
            hide('checkbox_isolate')
        }
    }
    let HTMLContent = generateBoardTitle()
    const boardTitle = document.getElementById('boardTitle')
    boardTitle.innerHTML = HTMLContent
}
function generateBoardTitle(extra, categoryIndex) {
    let worldRecord
    let imgSize = 42
    if (categoryIndex == null) {
        categoryIndex = sortCategoryIndex
    } else {
        worldRecord = true
        imgSize = 21
    }
    let HTMLContent = `<div><table class='boardTitleTable'><tr>`
    if (worldRecord) {
        HTMLContent += `<td class='first'>${secondsToHMS(getWorldRecord(categories[categoryIndex]))}</td>`
    }
    if (mode == 'levels' & bossILindex > -1) {
        category = bosses[bossILindex]
        imgsrc = category.id
        let className = category.className ? category.className : imgsrc
        let cellContent = category.name
        HTMLContent += `<th class='container ${className}'>${getImage(imgsrc, imgSize)}<span id='boardLevel'>${cellContent}</span></th>`
    }
    if (categoryIndex > -1 && extra != 2) {
        let category = categories[categoryIndex]
        let imgsrc
        if (category.info) {
            imgsrc = category.info.id
        }
        let className = category.className ? category.className : imgsrc
        let image = ''
        if (imgsrc) {
            image = getImage(imgsrc, imgSize)
        }
        let cellContent = category.name
        if (gameID == 'cuphead' && big4()) {
            cellContent = category.info.name
        }
        if (mode != 'fullgame' && extra) {
            cellContent = ''
        }
        if (cellContent) {
            cellContent = `<span id='boardLevel'>${cellContent}</span>`
        }
        if ((gameID == 'cuphead' && bossILindex == -1) || ['sm64', 'mtpo'].includes(gameID)) {
            HTMLContent += `<th class='container ${className}'>${image}${cellContent}</th>`
        } else {
            HTMLContent += `<td class='${category.difficulty}'>${category.name}</td>`
        }
        if (gameID == 'cuphead' && big4()) {
            HTMLContent += `<td class='${category.difficulty}'>${category.name}</td>`
        }
    } else if (mode == 'levels' && ((gameID == 'cuphead' && bossILindex == -1) || gameID != 'cuphead')) {
        HTMLContent += `<td>Top IL Runners</td>`
    }
    if (categoryIndex == -1 || extra == 2) {
        if (difficultyILs) {
            HTMLContent += `<td class='${levelDifficulty}'>${levelDifficulty.charAt(0).toUpperCase() + levelDifficulty.slice(1)}</td>`
        } else if (groundPlane) {
            HTMLContent += `<th style='padding: 0 5px' class='container ${getColorClass()}'><img src='images/cuphead/${groundPlane}_${cupheadVersion == 'currentPatch' ? 'mugman' : 'cuphead'}.png' style='height:42px;width:auto'></th>`
        } else if (isleIndex > -1) {
            const isle = isles[isleIndex]
            HTMLContent += `<td class='${isle.className}'>${isle.name}</td>`
        }
    }
    if (mode == 'fullgame' && fullgameCategory) {
        if (fullgameCategory == 'basegame') {
            HTMLContent += `<td class='cuphead'>Base Game</td>`
        } else if (fullgameCategory == 'currentPatch') {
            HTMLContent += `<td class='cuphead'>Current Patch</td>`
        } else {
            HTMLContent += `<td class='${cuphead[fullgameCategory][0].className}'>${fullgameCategory}</td>`
        }
    }
    if (mode == 'levels' && sm64ILsSection) {
        HTMLContent += `<td class='banner'>${sm64ILsSection}</td>`
    }
    if (gameID == 'cuphead' && mode == 'levels') {
        if (!big5()) {
            HTMLContent += `<td class='${levelDifficulty}'>${getCupheadCategory(anyHighest, levelDifficulty)}</td>`
        }
        if (DLCnoDLC == 'dlc') {
            HTMLContent += `<td class='dlc'>DLC</td>`
        }
        if (cupheadVersion == 'legacy') {
            HTMLContent += `<td class='legacy'>Legacy</td>`
        }
        if (basegameILs && isleIndex == -1 && bossILindex == -1) {
            HTMLContent += `<td class='cuphead'>Base Game</td>`
        }
    }
    if (mode == 'commBestILs') {
        const shotSize = categoryIndex > -1 ? imgSize : 30
        HTMLContent += `<td class=${commBestILsCategory.className}>${commBestILsCategory.name}</td>`
        HTMLContent += commBestILsCategory.shot1 ? `<th id='commBestILsWeapons' class='container'>` : ''
        HTMLContent += commBestILsCategory.shot1 ? `<img src="images/cuphead/inventory/weapons/${commBestILsCategory.shot1}.png" style='height:${shotSize}px'></img>` : ''
        HTMLContent += commBestILsCategory.shot2 ? `<img src="images/cuphead/inventory/weapons/${commBestILsCategory.shot2}.png" style='height:${shotSize}px'></img>` : ''
        HTMLContent += commBestILsCategory.subcat ? `<td>${commBestILsCategory.subcat}</td>` : ''
        HTMLContent += commBestILsCategory.shot1 ? `</th>` : ''
    }
    if (page == 'charts' && sortCategoryIndex == -1 && mode != 'commBestILs') {
        HTMLContent += `<td class='banner'>Player Score</td>`
    }
    HTMLContent += `</tr></table></div>`
    if (HTMLContent == `<div><table class='boardTitleTable'><tr></tr></table></div>`) {
        return ''
    }
    return HTMLContent
}
function updateCategories() {
    let HTMLContent = `<table>`
    HTMLContent += `<tr>${fancyHeader(1)}</tr>`
    HTMLContent += `<tr>`
    categories.forEach((category, categoryIndex) => {
        let className = category.className
        if (category.info && bossILindex == -1 && !(gameID == 'cuphead' && big4())) {
            HTMLContent += `<th onclick="organizePlayers(${categoryIndex})" class='${category.info.id} clickable ${isSelected(categoryIndex)}'>${getImage(category.info.id)}</th>`
        } else {
            let categoryName = category.name
            if (bossILindex > -1) {
                className = category.difficulty
            }
            if (mode == 'levels' && big4()) {
                categoryName = trimDifficulty(category.name)
                className = category.difficulty
            }
            if (!className) {
                className = 'gray'
            }
            HTMLContent += `<th onclick="organizePlayers(${categoryIndex})" class='${className} clickable ${isSelected(categoryIndex)} chartTab'>${categoryName}</th>`
        }
    })
    HTMLContent += `</tr></table>`
    const categoriesElem = document.getElementById('categoriesElem')
    categoriesElem.innerHTML = HTMLContent
}