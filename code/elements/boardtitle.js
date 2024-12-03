function setBoardTitle() {
    const checkbox_isolate = document.getElementById('checkbox_isolate')
    const closeBoardTitle = document.getElementById('closeBoardTitle')
    if (sortCategoryIndex > -1) {
        if (page == 'leaderboard') {
            checkbox_isolate.style.display = ''
        }
        closeBoardTitle.style.display = ''
    } else {
        checkbox_isolate.style.display = 'none'
        closeBoardTitle.style.display = 'none'
    }
    let HTMLContent = generateBoardTitle()
    const boardTitle = document.getElementById('boardTitle')
    boardTitle.innerHTML = HTMLContent
    const boardTitleDiv = document.getElementById('boardTitleDiv')
    boardTitleDiv.style.display = ''
}
function generateBoardTitle(extra) {
    let HTMLContent = `<div><table style='border: 3px solid var(--banner)'><tr>`
    if (sortCategoryIndex == -1 || extra == 2) {
        if (difficultyILs) {
            HTMLContent += `<td class='${levelDifficulty}'>${levelDifficulty.charAt(0).toUpperCase() + levelDifficulty.slice(1)}</td>`
        } else if (groundPlane) {
            HTMLContent += `<th style='padding: 0 5px' class='container ${getColorClass()}'><img src='images/cuphead/${groundPlane}_${cupheadVersion}.png' style='height:42px;width:auto'></th>`
        } else if (isleIndex > -1) {
            const isle = isles[isleIndex]
            HTMLContent += `<td class='${isle.className}'>${isle.name}</td>`
        }
    }
    if (mode == 'levels' & bossILindex > -1) {
        category = bosses[bossILindex]
        imgsrc = category.id
        let className = category.className ? category.className : imgsrc
        let cellContent = category.name
        HTMLContent += `<th class='container ${className}'>${getImage(imgsrc)}<span id='boardLevel'>${cellContent}</span></th>`
    }
    if (sortCategoryIndex > -1 && extra != 2) {
        let category = categories[sortCategoryIndex]
        let imgsrc
        if (category.info) {
            imgsrc = category.info.id
        }
        let className = category.className ? category.className : imgsrc
        let image = ''
        if (imgsrc) {
            image = getImage(imgsrc)
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
        if (bossILindex == -1) {
            HTMLContent += `<th class='container ${className}'>${image}${cellContent}</th>`
        } else {
            category = categories[sortCategoryIndex]
            HTMLContent += `<td class='${category.difficulty}'>${category.name}</td>`
        }
        if (gameID == 'cuphead' && big4()) {
            const category = categories[sortCategoryIndex]
            HTMLContent += `<td class='${category.difficulty}'>${category.name}</td>`
        }
    } else if (mode == 'fullgame' && page == 'charts') {
        HTMLContent += `<td class='banner'>Player Score</td>`
    } else if (mode == 'levels' && allILs) {
        HTMLContent += `<td>Top IL Runners</td>`
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
    }
    if (mode == 'fullgameILs') {
        HTMLContent += `<td class=${fullgameILsCategory.className}>${fullgameILsCategory.name}</td>`
        HTMLContent +=
            `<th id='fullgameILsWeapons' class='container'>
                <img src="images/cuphead/inventory/weapons/${fullgameILsCategory.shot1}.png"></img>
                <img src="images/cuphead/inventory/weapons/${fullgameILsCategory.shot2}.png"></img>
            </th>`
    }
    HTMLContent += `</tr></table></div>`
    if (HTMLContent == `<div><table style='border: 3px solid var(--banner)'><tr></tr></table></div>`) {
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
            HTMLContent += `<th onclick="drawNewChart(${categoryIndex})" class='${category.info.id} clickable ${isSelected(categoryIndex)}'>${getImage(category.info.id)}</th>`
        } else {
            let categoryName = category.name
            if (bossILindex > -1) {
                className = category.difficulty
            }
            if (mode == 'levels' && big4()) {
                categoryName = trimDifficulty(category.name)
                className = category.difficulty
            }
            HTMLContent += `<th onclick="drawNewChart(${categoryIndex})" class='${className} clickable ${isSelected(categoryIndex)} chartTab'>${categoryName}</th>`
        }
    })
    HTMLContent += `</tr></table>`
    const categoriesElem = document.getElementById('categoriesElem')
    categoriesElem.innerHTML = HTMLContent
}