function getFullgame(categoryName) {
    setMode('fullgame')
    sortCategoryIndex = -1
    spotlightFlag = false
    if (gameID == 'cuphead') {
        categories = categorySet['main'].map(obj => ({ ...obj }))
        if (categoryName) {
            if (['basegame', 'currentPatch', 'trueAny', 'simple', 'expert', 'oneGun'].includes(categoryName)) {
                if (categoryName == 'basegame') {
                    categories = categorySet['main'].slice(0, 3)
                } else if (categoryName == 'currentPatch') {
                    categories = categorySet['main'].slice(2, 5)
                } else if (categoryName == 'trueAny') {
                    categories = [...categorySet['main'].slice(0, 2), ...categorySet['main'].slice(3, 5)]
                } else if (categoryName == 'simple') {
                    const simple = ['zqoeg95l', 'jq6owpvq', 'jqz5w02q']
                    simple.forEach((subcat, index) => {
                        categories[index].subcat = subcat
                    })
                    categories[3].subcat2 = '192g6pyq'
                    categories[4].subcat2 = 'ln86pool'
                } else if (categoryName == 'expert') {
                    const expert = ['rqv209r1', '81w2j9m1', 'gq74o7yq']
                    expert.forEach((subcat, index) => {
                        categories[index].subcat = subcat
                    })
                    categories[3].subcat2 = '12ver0dq'
                    categories[4].subcat2 = '10ve8ool'
                } else if (categoryName == 'oneGun') {
                    // const objective = categoryName.split('_')[1]
                    categories = categorySet['One Gun']
                    categories.forEach(category => {
                        category.id = 'jdz8ro3d'
                        category.var = 'kn049kdl'
                        category.var2 = 'dlo67y5l'
                        category.subcat2 = document.getElementById('dropdown_oneGun_objective').value
                        category.var3 = 'ql6gwyx8'
                        category.subcat3 = document.getElementById('dropdown_oneGun_difficulty').value
                        category.var4 = 'wl36rvyl'
                        category.subcat4 = '4qyndmd1'
                    })
                }
                fullgameCategory = categoryName
                buttonClick('fullgameCategories_' + categoryName, 'fullgameCategories', 'active')
            } else {
                fullgameCategory = categoryName
                categories = categorySet[categoryName]
                buttonClick('fullgameCategories_' + categories[0].className, 'fullgameCategories', 'active')
            }
        } else {
            fullgameCategory = null
            spotlightFlag = true
        }
    } else {
        categories = categorySet
        if (!categories) categories = generateCategories(gameID)
        if (categoryName) {
            if (gameID == 'sm64') {
                if (categoryName == 'long') {
                    categories = categories.slice(0, 2)
                } else if (categoryName == 'short') {
                    categories = categories.slice(2, 5)
                }
            }
            if (gameID == 'nsmbw') {
                if (categoryName == 'main3') categories = categorySet.slice(0, 3)
            }
            buttonClick('fullgameCategories_' + categoryName, 'fullgameCategories', 'active')
        }
    }
    if (!categoryName) {
        fullgameCategory = ''
        if (['cuphead', 'sm64', 'nsmbw', 'tetris'].includes(gameID)) {
            buttonClick(gameID + '_fullgameCategories_main', 'fullgameCategories', 'active')
        }
    }
    resetLoad()
    if (!(['cuphead', 'sm64', 'smb1', 'sms', 'bfbb'].includes(gameID) && mode == 'fullgame' && !categoryName && firstTimeFull)) {
        categories.forEach(category => {
            let variables = ''
            if (category.var) {
                variables += `var-${category.var}=${category.subcat}`
            }
            if (category.var2) {
                variables += `&var-${category.var2}=${category.subcat2}`
            }
            if (category.var3) {
                variables += `&var-${category.var3}=${category.subcat3}`
            }
            if (category.var4) {
                variables += `&var-${category.var4}=${category.subcat4}`
            }
            let game = categoryName == 'oneGun' ? 'cuphead_category_extensions' : gameID
            getLeaderboard(category, `category/${category.id}`, variables, '', game)
        })
    } else {
        if (globalCache) {
            cachedCategories()
        } else {
            // firstTimeFull = false
            categories = []
            window.firebaseUtils.firestoreReadMain()
        }
    }
}