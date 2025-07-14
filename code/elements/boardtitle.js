function setBoardTitle() {
    if (sortCategoryIndex > -1) {
        show('closeBoardTitle')
    } else {
        hide('closeBoardTitle')
    }
    let HTMLContent = generateBoardTitle()
    const boardTitle = document.getElementById('boardTitle')
    boardTitle.innerHTML = HTMLContent
}
function generateBoardTitle(extra, categoryIndex, commBest) {
    let worldRecord
    const imgSize = 32
    if (categoryIndex == null) {
        categoryIndex = sortCategoryIndex
    } else if (page == 'WRs') {
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
        let cellContent = extra ? '' : category.name
        const content = `<div class='container' style='gap:4px'>${getImage(imgsrc, imgSize) + cellContent}</div>`
        HTMLContent += boardTitleCell('container ' + className, content)
    }
    if (gameID == 'ssb64') {
        const image = `<img src='images/ssb64/${ssbVar ? 'platform' : 'target'}.png' style='height:${imgSize}px'>`
        const cellContent = ssbVar ? 'Board the Platforms!' : 'Break the Targets!'
        const content = `<div class='container' style='gap:10px'>${image + (sortCategoryIndex == -1 ? cellContent : '')}</div>`
        HTMLContent += boardTitleCell('', content)
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
        if (['cuphead', 'sm64', 'mtpo', 'spo', 'ssb64', 'ssbm'].includes(gameID) && bossILindex == -1) {
            const content = `<div class='container' style='gap:4px'>${image + cellContent}</div>`
            HTMLContent += boardTitleCell('container ' + className, content)
        } else {
            HTMLContent += boardTitleCell(category.difficulty, category.name)
        }
        if (gameID == 'cuphead' && big4()) {
            HTMLContent += boardTitleCell(category.difficulty, category.name)
        }
    } else if (mode == 'levels' && ((gameID == 'cuphead' && bossILindex == -1) || gameID != 'cuphead') && !['ssb64', 'ssbm'].includes(gameID)) {
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
        } else if (fullgameCategory == 'simple') {
            HTMLContent += boardTitleCell('simple', 'Simple')
        } else if (fullgameCategory == 'expert') {
            HTMLContent += boardTitleCell('expert', 'Expert')
        } else if (fullgameCategory == 'oneGun') {
            HTMLContent += boardTitleCell('cuphead', 'One Gun')
            const selectElem = document.getElementById('dropdown_oneGun_objective');
            const selectedOption = selectElem.options[selectElem.selectedIndex];
            const optionHTML = selectedOption.innerHTML;
            if (optionHTML != 'Base Game') {
                HTMLContent += boardTitleCell('cuphead', optionHTML)
            }
            const selectElem2 = document.getElementById('dropdown_oneGun_difficulty');
            const selectedOption2 = selectElem2.options[selectElem2.selectedIndex];
            const optionHTML2 = selectedOption2.innerHTML;
            if (optionHTML2 != 'Regular') {
                HTMLContent += boardTitleCell(optionHTML2.toLowerCase(), optionHTML2)
            }
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
        const category = commBest ? commBestILs[commBest] : commBestILsCategory
        const shotSize = categoryIndex > -1 ? 30 : 30
        HTMLContent += boardTitleCell(category.className, category.name)
        HTMLContent += category.shot1 ? `<td id='commBestILsWeapons' class='container' style='margin:0;gap:4px;padding:0 3px'>` : ''
        HTMLContent += category.shot1 ? cupheadShot(category.shot1, shotSize) : ''
        HTMLContent += category.shot2 ? cupheadShot(category.shot2, shotSize) : ''
        HTMLContent += category.shot1 ? `</td>` : ''
        HTMLContent += category.subcat ? boardTitleCell('', category.subcat) : ''
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