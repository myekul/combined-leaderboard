function setBoardTitle() {
    if (sortCategoryIndex > -1 && globalTab != 'leaderboards') {
        show('closeBoardTitle')
    } else {
        hide('closeBoardTitle')
    }
    document.getElementById('boardTitle').innerHTML = generateBoardTitle()
}
function generateBoardTitle(extra, categoryIndex) {
    let worldRecord
    const imgSize = 32
    if (categoryIndex == null) {
        categoryIndex = sortCategoryIndex
    } else if (globalTab == 'WRs') {
        worldRecord = true
    }
    let HTMLContent = ''
    if (worldRecord) HTMLContent += boardTitleCell('first', secondsToHMS(getWorldRecord(categories[categoryIndex])))
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
        const category = categories[categoryIndex]
        let imgsrc
        if (category.info) imgsrc = category.info.id
        let className = category.className ? category.className : imgsrc
        let image = ''
        if (imgsrc) image = getImage(imgsrc, imgSize)
        let cellContent = category.name
        if (gameID == 'cuphead' && big4()) cellContent = category.info.name
        if (mode != 'fullgame' && extra) cellContent = ''
        if (bossILindex > -1) {
            HTMLContent += boardTitleCell(category.difficulty, category.name)
        } else {
            const content = `<div class='container' style='gap:4px'>${image + cellContent}</div>`
            HTMLContent += boardTitleCell('container ' + className, content)
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
                HTMLContent += boardTitleCell(optionHTML.toLowerCase(), optionHTML)
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
    return boardTitleWrapper(HTMLContent)
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
            if (bossILindex > -1) className = category.difficulty
            if (mode == 'levels' && big4()) {
                categoryName = trimDifficulty(category.name)
                className = category.difficulty
            }
            if (!className) className = 'gray'
            HTMLContent += `<th onclick="organizePlayers(${categoryIndex})" class='${className} clickable ${isSelected(categoryIndex)}' style='width:80px'>${categoryName}</th>`
        }
    })
    HTMLContent += `</tr></table>`
    const categoriesElem = document.getElementById('categoriesElem')
    categoriesElem.innerHTML = HTMLContent
}