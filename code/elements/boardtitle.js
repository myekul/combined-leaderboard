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
    const imgSize = 32
    if (categoryIndex == null) {
        categoryIndex = sortCategoryIndex
    } else {
        worldRecord = true
    }
    let HTMLContent = `<div><table class='boardTitleTable'><tr>`
    if (worldRecord) {
        HTMLContent += boardTitleCell('first', secondsToHMS(getWorldRecord(categories[categoryIndex])))
    }
    if (mode == 'levels' & bossILindex > -1) {
        category = bosses[bossILindex]
        imgsrc = category.id
        let className = category.className ? category.className : imgsrc
        let cellContent = category.name
        const content = getImage(imgsrc, imgSize) + cellContent
        HTMLContent += boardTitleCell('container ' + className, content)
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
        if ((gameID == 'cuphead' && bossILindex == -1) || ['sm64', 'mtpo', 'spo'].includes(gameID)) {
            const content = `<div class='container' style='gap:4px'>${image + cellContent}</div>`
            HTMLContent += boardTitleCell('container ' + className, content)
        } else {
            HTMLContent += boardTitleCell(category.difficulty, category.name)
        }
        if (gameID == 'cuphead' && big4()) {
            HTMLContent += boardTitleCell(category.difficulty, category.name)
        }
    } else if (mode == 'levels' && ((gameID == 'cuphead' && bossILindex == -1) || gameID != 'cuphead')) {
        HTMLContent += boardTitleCell('', 'Top IL Runners')
    }
    if (categoryIndex == -1 || extra == 2) {
        if (difficultyILs) {
            HTMLContent += boardTitleCell(levelDifficulty, levelDifficulty.charAt(0).toUpperCase() + levelDifficulty.slice(1))
        } else if (groundPlane) {
            const img = `<img src='images/cuphead/${groundPlane}_${cupheadVersion == 'currentPatch' ? 'mugman' : 'cuphead'}.png' style='height:${imgSize}px;width:auto'>`
            HTMLContent += boardTitleCell(getColorClass(), img)
        } else if (isleIndex > -1) {
            const isle = isles[isleIndex]
            HTMLContent += boardTitleCell(isle.className, isle.name)
        }
    }
    if (mode == 'fullgame' && fullgameCategory) {
        if (fullgameCategory == 'basegame') {
            HTMLContent += boardTitleCell('cuphead', 'Base Game')
        } else if (fullgameCategory == 'currentPatch') {
            HTMLContent += boardTitleCell('cuphead', 'Current Patch')
        } else {
            HTMLContent += boardTitleCell(categorySet[fullgameCategory][0].className, fullgameCategory)
        }
    }
    if (mode == 'levels' && sm64ILsSection) {
        HTMLContent += boardTitleCell('banner', sm64ILsSection)
    }
    if (gameID == 'cuphead' && mode == 'levels') {
        if (!big5()) {
            HTMLContent += boardTitleCell(levelDifficulty, getCupheadCategory(anyHighest, levelDifficulty))
        }
        if (DLCnoDLC == 'dlc') {
            HTMLContent += boardTitleCell('dlc', 'DLC')
        }
        if (cupheadVersion == 'legacy') {
            HTMLContent += boardTitleCell('legacy', 'Legacy')
        }
        if (basegameILs && isleIndex == -1 && bossILindex == -1) {
            HTMLContent += boardTitleCell('cuphead', 'Base Game')
        }
    }
    if (mode == 'commBestILs') {
        const shotSize = categoryIndex > -1 ? 30 : 30
        HTMLContent += boardTitleCell(commBestILsCategory.className, commBestILsCategory.name)
        HTMLContent += commBestILsCategory.shot1 ? `<td id='commBestILsWeapons' class='container' style='margin:0;gap:4px;padding:0 3px'>` : ''
        HTMLContent += commBestILsCategory.shot1 ? cupheadShot(commBestILsCategory.shot1, shotSize) : ''
        HTMLContent += commBestILsCategory.shot2 ? cupheadShot(commBestILsCategory.shot2, shotSize) : ''
        HTMLContent += commBestILsCategory.shot1 ? `</td>` : ''
        HTMLContent += commBestILsCategory.subcat ? boardTitleCell('', commBestILsCategory.subcat) : ''
    }
    if (page == 'charts' && sortCategoryIndex == -1 && mode != 'commBestILs') {
        HTMLContent += boardTitleCell('banner', 'Player Score')
    }
    HTMLContent += `</tr></table></div>`
    if (HTMLContent == `<div><table class='boardTitleTable'><tr></tr></table></div>`) {
        return ''
    }
    return HTMLContent
}
function boardTitleCell(className, content) {
    return `<td class='${className}' style='height:32px;padding:0 5px'>${content}</td>`
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