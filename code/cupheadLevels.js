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
            if (cupheadVersion != 'currentPatch' || basegameILs) {
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
                }, 2000);
            })
        })
}
function getAllLevels() {
    sortCategoryIndex = -1
    categories = []
    disableLevelModes()
    allILs = true
    buttonClick('allLevels', 'difficultyTabs', 'selected')
    resetLoad()
    updateILbosses()
    // if (firstTime) {
    //     fetch('https://gist.githubusercontent.com/myekul/a62e824b667fd6f37b9881f397263f66/raw/c68dfac4c810172a21229d55b4194de090361f35/allLevels.json')
    //         .then(response => response.json())
    //         .then(data => {
    //             categories = data
    //             resetAndGo()
    //             completeLoad()
    //         })
    //     firstTime = false;
    //     const boardTitleSrc = document.getElementById('boardTitleSrc')
    //     boardTitleSrc.innerHTML = `<div style='font-size:16px;padding-bottom:5px'>{ }</div>`
    // } else {
    window.firebaseUtils.firestoreRead25()
    // }
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
function toggleFullgameCategories() {
    playSound('move')
    const fullgameCategoriesButton = document.getElementById('fullgameCategoriesButton')
    if (showFullgameCategories) {
        showFullgameCategories = false
        hide('fullgameCategories')
        fullgameCategoriesButton.innerHTML = '&#9660'
    } else {
        showFullgameCategories = true
        show('fullgameCategories')
        fullgameCategoriesButton.innerHTML = fontAwesome('close')
    }
}
function toggleILcategories() {
    playSound('move')
    const ILcategoriesButton = document.getElementById('ILcategoriesButton_' + gameID)
    const ILcategoriesElem = document.getElementById('ILcategories_' + gameID)
    if (ILcategories) {
        ILcategories = false
        hide(ILcategoriesElem)
        ILcategoriesButton.innerHTML = '&#9660'
    } else {
        ILcategories = true
        show(ILcategoriesElem)
        ILcategoriesButton.innerHTML = fontAwesome('close')
    }
}
function toggleBasegameILs() {
    if (basegameILs) {
        basegameILs = false
    } else {
        basegameILs = true
    }
    if (bossILindex == -1 && isleIndex == -1) {
        refreshLeaderboard()
    } else {
        updateILbosses()
    }
}
function getCupheadBoss() {
    const boss = categories[bossILindex]
    let difficulties = ['simple', 'regular', 'expert']
    if (boss.info.time > 129) {
        difficulties = difficulties.slice(1, 3)
    }
    categories = []
    difficulties.forEach(difficulty => {
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
function cupheadPrep(category) {
    let variables = `var-2lgzzwo8=21ge8p8l&var-${category.difficultyID}=${category[category.difficulty]}` // Players - Solo
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
function updateILbosses() {
    let HTMLContent = `<table><tr>`
    if (cupheadVersion != 'onePointOne') {
        const checkbox_basegameILs = document.getElementById('checkbox_basegameILs')
        if (DLCnoDLC == 'dlc' || cupheadVersion == 'legacy') {
            basegameILs = false
            checkbox_basegameILs.checked = true
            checkbox_basegameILs.style.opacity = 0
        } else {
            checkbox_basegameILs.style.opacity = 1
        }
        isles.forEach((isle, index) => {
            let grayscale = ''
            let clickevent = `getIsle(${index})`
            if (basegameILs && index == 4) {
                grayscale = 'grayscale'
                clickevent = `playSound('locked')`
            }
            const selected = index == isleIndex ? 'selected' : ''
            HTMLContent += `<th colspan=${isle.numBosses} onclick="${clickevent}" class='clickable ${selected} ${isle.className} ${grayscale}'>${isle.name}</th>`
        })
        HTMLContent += `</tr><tr>`
        bosses.forEach((category, categoryIndex) => {
            let grayscale = ''
            let clickevent = `getBossIL('${category.id}')`
            if (basegameILs && category.isle == 5) {
                grayscale = 'grayscale'
                clickevent = `playSound('locked')`
            }
            const selected = bossILindex == categoryIndex ? 'selected' : ''
            HTMLContent += `<th onclick="${clickevent}" class='clickable ${category.id} ${selected} ${grayscale}'>${getImage(category.id)}</th>`
        })
        const character = cupheadVersion == 'currentPatch' ? 'mugman' : 'cuphead'
        document.getElementById('groundimg').src = `images/cuphead/ground_${character}.png`
        document.getElementById('planeimg').src = `images/cuphead/plane_${character}.png`
    }
    HTMLContent += `</tr></table>`
    const ILbosses = document.getElementById('ILbosses')
    ILbosses.innerHTML = HTMLContent
}