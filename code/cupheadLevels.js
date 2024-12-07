function cupheadLevelSetting(version, DLCorNot) {
    if (typeof version == 'string') {
        cupheadVersion = version
        DLCnoDLC = DLCorNot
    }
    buttonClick(cupheadVersion, 'versionTabs', 'active')
    buttonClick(DLCnoDLC + 'Boards', 'categoryTabs', 'active')
    if (bossILindex > -1 || isleIndex > -1) {
        if (cupheadVersion == 'legacy' && (bossILindex >= 19 || isleIndex == 4)) {
            cupheadVersion = 'currentPatch'
            buttonClick(cupheadVersion, 'versionTabs', 'active')
            document.getElementById('category_select').pause()
            playSound('locked')
        } else {
            if (bossILindex > -1) {
                getCupheadSRC()
            } else if (isleIndex > -1) {
                getIsle(isleIndex)
            }
        }
    } else if (allILs) {
        getAllLevels()
    } else if (difficultyILs) {
        getDifficulty(levelDifficulty)
    } else if (groundPlane) {
        getGroundPlane(groundPlane)
    } else {
        getCupheadSRC()
    }
    updateILbosses()
}
function getCupheadSRC() {
    fetch('resources/levels/cuphead.json')
        .then(response => response.json())
        .then(data => {
            categories = data
            categories.forEach((category, categoryIndex) => {
                category.info = bosses[categoryIndex]
            })
            if (cupheadVersion != 'currentPatch') {
                categories = categories.slice(0, 19)
            }
            if (levelDifficulty == 'simple') {
                categories = categories.slice(0, 24)
                categories.splice(17, 2)
            }
            categories.forEach(level => {
                level.difficulty = levelDifficulty
                level.version = cupheadVersion
                level.category = ILcats[anyHighest + DLCnoDLC].id
            });
            if (bossILindex > -1) {
                getCupheadBoss()
            } else {
                disableLevelModes()
            }
            resetLoad()
            categories.forEach(category => {
                cupheadPrep(category)
                setTimeout(() => {
                    if (processedCategories < categories.length && !stopLeaderboards) {
                        console.log('Took too long!')
                        stopLeaderboards = true
                        window.firebaseUtils.firestoreRead()
                    }
                }, 1000);
            })
        })
}
function getAllLevels() {
    sortCategoryIndex = -1
    categories = []
    disableLevelModes()
    document.getElementById('allLevels').classList.add('selected')
    allILs = true
    buttonClick('allLevels', 'difficultyTabs', 'selected')
    resetLoad()
    updateILbosses()
    if (firstTime) {
        fetch('resources/allLevels.json')
            .then(response => response.json())
            .then(data => {
                categories = data
                resetAndGo()
                completeLoad()
            })
        firstTime = false;
        const boardTitleSrc = document.getElementById('boardTitleSrc')
        boardTitleSrc.innerHTML = `<div style='font-size:16px;padding-bottom:5px'>{ }</div>`
    } else {
        window.firebaseUtils.firestoreRead25()
    }
}
function getDifficulty(difficulty) {
    levelDifficulty = difficulty
    categories = []
    resetLoad()
    disableLevelModes()
    difficultyILs = true
    buttonClick(levelDifficulty, 'difficultyTabs', 'selected')
    updateILbosses()
    window.firebaseUtils.firestoreRead25()
}
function specificDifficulty(difficulty, anyOrHighest) {
    levelDifficulty = difficulty
    anyHighest = anyOrHighest
    buttonClick(levelDifficulty + anyHighest, 'difficultyTabs', 'selected')
    disableLevelModes()
    cupheadLevelSetting()
}
function getIsle(index) {
    playSound('category_select')
    disableLevelModes()
    isleIndex = index
    categories = []
    resetLoad()
    if (cupheadVersion != 'currentPatch' && isleIndex == 4) {
        cupheadVersion = 'currentPatch'
        buttonClick(cupheadVersion, 'versionTabs', 'active')
    }
    document.querySelectorAll('#difficultyTabs .button').forEach(elem => {
        elem.classList.remove('selected')
    })
    updateILbosses()
    window.firebaseUtils.firestoreRead25()
}
function getGroundPlane(groundOrPlane) {
    disableLevelModes()
    groundPlane = groundOrPlane
    categories = []
    resetLoad()
    document.querySelectorAll('#difficultyTabs .button').forEach(elem => {
        elem.classList.remove('selected')
    })
    buttonClick(groundPlane, 'difficultyTabs', 'selected')
    updateILbosses()
    window.firebaseUtils.firestoreRead25()
}
function updateILbosses() {
    let HTMLContent = `<table><tr>`
    isles.forEach((isle, index) => {
        const selected = index == isleIndex ? 'selected' : ''
        HTMLContent += `<th colspan=${isle.numBosses} onclick="getIsle(${index})" class='clickable ${selected} ${isle.className}'>${isle.name}</th>`
    })
    HTMLContent += `</tr><tr>`
    bosses.forEach((category, categoryIndex) => {
        const selected = bossILindex == categoryIndex ? 'selected' : ''
        HTMLContent += `<th onclick="getBossIL('${category.id}')" class='clickable ${category.id} ${selected}'>${getImage(category.id)}</th>`
    })
    HTMLContent += `</tr></table>`
    const ILbosses = document.getElementById('ILbosses')
    ILbosses.innerHTML = HTMLContent
    document.getElementById('groundimg').src = `images/cuphead/ground_${cupheadVersion}.png`
    document.getElementById('planeimg').src = `images/cuphead/plane_${cupheadVersion}.png`
}
function getBossIL(bossName) {
    playSound('category_select')
    disableLevelModes()
    bosses.forEach((boss, bossIndex) => {
        if (boss.id == bossName) {
            bossILindex = bossIndex
        }
    })
    if (bossILindex >= 19) {
        cupheadVersion = 'currentPatch'
        buttonClick(cupheadVersion, 'versionTabs', 'active')
    }
    updateILbosses()
    document.querySelectorAll('#difficultyTabs .button').forEach(elem => {
        elem.classList.remove('selected')
    })
    getCupheadSRC()
}
function toggleILcategories() {
    playSound('move')
    if (ILcategories) {
        ILcategories = false
        const ILcategoriesButton = document.getElementById('ILcategoriesButton')
        const ILcategoriesElem = document.getElementById('ILcategories')
        ILcategoriesElem.style.display = 'none'
        ILcategoriesButton.innerHTML = '&#9660'
    } else {
        ILcategoriesOn()
    }
}
function ILcategoriesOn() {
    ILcategories = true
    const ILcategoriesButton = document.getElementById('ILcategoriesButton')
    const ILcategoriesElem = document.getElementById('ILcategories')
    ILcategoriesElem.style.display = ''
    ILcategoriesButton.innerHTML = '&#10005'
}
function getCupheadBoss() {
    const boss = categories[bossILindex]
    categories = []
    if (boss.info.time > 129) {
        ['regular', 'expert'].forEach(difficulty => {
            ['any', 'highest'].forEach(anyOrHighest => {
                const newBoss = { ...boss }
                newBoss.name = getCupheadCategory(anyOrHighest, difficulty)
                newBoss.difficulty = difficulty
                newBoss.category = ILcats[anyOrHighest + DLCnoDLC].id
                newBoss.version = cupheadVersion
                categories.push(newBoss)
            })
        })
    } else {
        ['simple', 'regular', 'expert'].forEach(difficulty => {
            ['any', 'highest'].forEach(anyOrHighest => {
                const newBoss = { ...boss }
                newBoss.name = getCupheadCategory(anyOrHighest, difficulty)
                newBoss.difficulty = difficulty
                newBoss.category = ILcats[anyOrHighest + DLCnoDLC].id
                newBoss.version = cupheadVersion
                categories.push(newBoss)
            })
        })
    }
    // resetLoad()
    // categories.forEach(category => {
    //     cupheadPrep(category)
    // })
}
function cupheadPrep(category) {
    let variables = `?var-${category.numPlayersID}=${category.soloID}&var-${category.difficultyID}=${category[category.difficulty]}`
    if (category.versionID) {
        variables += `&var-${category.versionID}=${category[category.version]}`
    }
    getLeaderboard(category, `level/${category.id}/${category.category}`, variables)
}
function getCupheadCategory(anyOrHighest, difficulty) {
    if (anyOrHighest == 'highest') {
        switch (difficulty) {
            case 'simple':
                return 'Simple B+'
            case 'regular':
                return 'Regular A+'
            case 'expert':
                return 'S-Rank'
        }
    } else {
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1) + ' Any%';
    }
}
function disableLevelModes() {
    difficultyILs = false
    allILs = false
    bossILindex = -1
    isleIndex = -1
    groundPlane = null
    document.getElementById('checkbox_isolate').checked = false
    document.getElementById('allLevels').classList.remove('selected')
}