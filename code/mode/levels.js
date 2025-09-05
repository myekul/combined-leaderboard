function getLevels() {
    if (gameID == 'cuphead' && mode != 'levels') allILs = true
    setMode('levels')
    if (gameID == 'cuphead') {
        cupheadLevelSetting()
    } else {
        getOtherLevels()
    }
}
function getOtherLevels(section) {
    fetch(`resources/levels/${gameID}.json`)
        .then(response => response.json())
        .then(data => {
            categories = data
            resetLoad()
            if (section) {
                buttonClick(section, 'ILcategories_' + gameID, 'activeBanner')
            } else {
                buttonClick('ILdefault_' + gameID, 'ILcategories_' + gameID, 'activeBanner')
            }
            if (['mtpo', 'spo', 'ssbm', 'ssb64'].includes(gameID)) {
                const style = document.createElement('style');
                document.head.appendChild(style);
                categories.forEach(category => {
                    style.sheet.insertRule(
                        `.${category.info} { background-color: ${category.bg}; color: ${category.color ? category.color : gameID == 'mtpo' ? 'white' : 'black'} }`,
                        style.sheet.cssRules.length
                    );
                    category.info = { id: category.info }
                })
            }
            if (gameID == 'sm64') {
                switch (section) {
                    case 'Lobby':
                        categories = categories.slice(0, 5)
                        break
                    case 'Basement':
                        categories = categories.slice(5, 9)
                        break
                    case 'Upstairs':
                        categories = categories.slice(9, 13)
                        break
                    case 'Tippy':
                        categories = categories.slice(13, 15)
                        break
                }
                categories.forEach((category) => {
                    getLeaderboard(category, `level/${category.id}/zdnq4oqd`, sm64Var) // Stage RTA
                })
            } else if (gameID == 'titanfall_2') {
                categories.forEach(category => {
                    getLeaderboard(category, `level/${category.id}/ndx8z6jk`, titanfall_2VarIL) // Any%
                })
            } else if (gameID == 'mtpo') {
                categories.forEach(category => {
                    getLeaderboard(category, `level/${category.id}/vdo93vdp`,) // Any%
                })
            } else if (gameID == 'spo') {
                categories.forEach(category => {
                    getLeaderboard(category, `level/${category.id}/wdmy8odq`, spoVarIL) // NTSC
                })
            } else if (gameID == 'nsmbw') {
                categories.forEach(category => {
                    getLeaderboard(category, `level/${category.id}/02qx7zky`, '&var-' + category.var + '=' + category.worldRTA) // Any%
                })
            } else if (gameID == 'ssbm') {
                ssbVar = section
                categories.forEach(category => {
                    getLeaderboard(category, `level/xd0xp0dq/9kvx3w32`, '&var-r8rp00ne=' + category.id)
                })
            } else if (gameID == 'ssb64') {
                ssbVar = section
                const cat = ssbVar ? '02qlrozk' : 'jdzvn8xk'
                categories.forEach(category => {
                    getLeaderboard(category, `level/${category.id}/` + cat)
                })
            }
        })
}