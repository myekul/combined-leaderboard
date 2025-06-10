function showTab(newPage) {
    page = newPage
    window.firebaseUtils.screenView()
    window.history.pushState(null, null, '#' + page);
    hideTabs()
    tooltipStyle?.remove()
    document.querySelectorAll('.hide').forEach(elem => {
        hide(elem)
    })
    if (gameID == 'cuphead') {
        if (mode == 'levels') {
            show('ILsSection_cuphead')
        }
        if (mode == 'commBestILs') {
            show('commBestILsSection')
        }
    }
    if (['cuphead', 'sm64', 'nsmbw'].includes(gameID) && mode == 'fullgame') {
        show('fullgameCategoriesSection')
    }
    if (gameID == 'sm64' && mode == 'levels') {
        show('ILsSection_sm64')
    }
    show(page + 'Tab')
    buttonClick(page + 'Button', 'tabs', 'active2')
    if (gameID == 'cuphead' && mode == 'levels' || mode == 'commBestILs') {
        document.getElementById('checkbox_hp').checked = true
    }
    if (page != 'leaderboard') {
        document.getElementById('checkbox_isolate').checked = false
        isolated = false
    }
    const dropdown_sortCriteria = document.getElementById('dropdown_sortCriteria')
    const sort_options = document.getElementById('sort_options')
    if (mode == 'commBestILs' && page == 'sort') {
        dropdown_sortCriteria.value = 'player'
        hide(sort_options)
    } else if (gameID == 'tetris') {
        dropdown_sortCriteria.value = 'score'
        hide(sort_options)
    } else {
        show(sort_options)
    }
    const WRs_cupheadILs_options = document.getElementById('WRs_cupheadILs_options')
    if (gameID == 'cuphead' && mode == 'levels' || mode == 'commBestILs') {
        show(WRs_cupheadILs_options)
    } else {
        hide(WRs_cupheadILs_options)
    }
    const runRecap_details = document.getElementById('runRecap_details')
    if (page == 'runRecap') {
        show(runRecap_details)
    } else {
        hide(runRecap_details)
    }
    action()
}
function action() {
    parseCheckboxes()
    pageAction()
    if (page != 'leaderboard') {
        document.getElementById('leaderboard').innerHTML = ''
    }
    if (page != 'charts') {
        document.getElementById('chart').innerHTML = ''
    }
    if (page != 'map') {
        countries = {}
        document.getElementById('world-map').innerHTML = ''
    }
    const categoriesSection = document.getElementById('categoriesSection')
    if (['featured', 'charts', 'map', 'sort'].includes(page) || (isolated && !(mode == 'commBestILs' && sortCategoryIndex == -1))) {
        show(categoriesSection)
    } else {
        hide(categoriesSection)
    }
    setBoardTitle()
    updateCategories()
}
function pageAction() {
    if (['runRecap', 'commBest'].includes(page) && mode != 'commBestILs' || (page == 'spotlight' && mode != 'fullgame')) {
        showTab('leaderboard')
    } else {
        switch (page) {
            case 'leaderboard':
                generateLeaderboard();
                break;
            case 'WRs':
                generateWRs();
                break;
            case 'featured':
                generateFeatured();
                break;
            case 'charts':
                refreshCharts();
                break;
            case 'map':
                generateMap();
                break;
            case 'sort':
                generateSort();
                break;
            case 'runRecap':
                runRecapViewPage(runRecapView)
                break
            case 'commBest':
                generateCommBest()
                break
            case 'spotlight':
                generateSpotlight()
                break
        }
        fontAwesomePage = fontAwesomeSet[page]
        const pageTitle = document.getElementById('pageTitle')
        if (page != 'leaderboard') {
            show(pageTitle)
            pageTitle.innerHTML = fontAwesomeText(fontAwesomePage[1], fontAwesomePage[0])
        } else {
            hide(pageTitle)
        }
    }
}
function setMode(newMode) {
    mode = newMode
    url.searchParams.set('mode', mode);
    window.history.pushState({}, '', url);
    buttonClick(mode + 'Button', 'modeSelection', 'active2')
    if (mode != 'levels') {
        disableLevelModes()
    }
}