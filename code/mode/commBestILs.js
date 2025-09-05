function getCommBestILs(categoryName) {
    setMode('commBestILs')
    sortCategoryIndex = -1
    categoryName = categoryName != null ? categoryName : commBestILsCategory.tabName
    commBestILsCategory = commBestILs[categoryName]
    const dropdown = document.getElementById('dropdown_runRecap_sav_comparison')
    if (commBestILsCategory.name == '1.1+') {
        dropdown.options[0].disabled = false
    } else {
        dropdown.options[0].disabled = true
    }
    updateLoadouts(categoryName)
    buttonClick('commBestILs_' + commBestILsCategory.className, 'commBestILsVersionTabs', 'selected')
    resetLoad()
    players = []
    playerNames = new Set()
    const category = commBestILsCategory.category
    if (category > -1) {
        if (globalCache) {
            extraCategory.players = globalCache[category].players
            extraCategory.runs = globalCache[category].runs
            fetchAllData()
        } else {
            window.firebaseUtils.firestoreReadMain()
        }
    } else {
        let variables = `var-${category.var}=${category.subcat}`
        if (category.var2) variables += `&var-${category.var2}=${category.subcat2}`
        getLeaderboard(category, `category/${category.id}`, variables, true)
    }
}
function updateLoadouts(categoryName) {
    let HTMLContent = ''
    let fullgameCategories = []
    if (commBestILsCategory.name == 'NMG') {
        fullgameCategories.push('NMG', 'NMG P/S')
    } else if (commBestILsCategory.name == 'DLC') {
        fullgameCategories.push('DLC', 'DLC L/S', 'DLC C/S', 'DLC C/T', 'DLC Low%', 'DLC Expert')
    } else if (commBestILsCategory.name == 'DLC+Base') {
        fullgameCategories.push('DLC+Base', 'DLC+Base L/S', 'DLC+Base C/S')
    }
    fullgameCategories.forEach(category => {
        const thisCategory = commBestILs[category]
        HTMLContent += `<div onclick="playSound('category_select');getCommBestILs('${category}')" class="button ${commBestILsCategory.className} container ${categoryName == category ? 'selected' : ''}">`
        HTMLContent += thisCategory.shot1 ? cupheadShot(thisCategory.shot1) : ''
        HTMLContent += thisCategory.shot2 ? cupheadShot(thisCategory.shot2) : ''
        HTMLContent += thisCategory.subcat ? thisCategory.subcat : ''
        HTMLContent += `</div>`
    })
    document.getElementById('loadouts').innerHTML = HTMLContent
}