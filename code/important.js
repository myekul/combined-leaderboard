function showTabCL(tab) {
    window.firebaseUtils.screenView()
    hideTabs()
    tooltipStyle?.remove()
    document.querySelectorAll('.hide').forEach(elem => {
        hide(elem)
    })
    if (mode == 'commBestILs') {
        show('commBestILsSection')
        show('viableDiv')
    }
    if (['cuphead', 'sm64', 'nsmbw'].includes(gameID) && mode == 'fullgame') {
        show('fullgameCategoriesSection')
    }
    if (['cuphead', 'sm64', 'ssb64', 'ssbm'].includes(gameID) && mode == 'levels') {
        show('ILsSection_' + gameID)
    }
    show(tab + 'Tab')
    if (gameID == 'cuphead' && mode == 'levels' || mode == 'commBestILs') {
        document.getElementById('checkbox_hp').checked = true
    }
    const dropdown_sortCriteria = document.getElementById('dropdown_sortCriteria')
    const sort_options = document.getElementById('sort_options')
    if (mode == 'commBestILs' && tab == 'sort') {
        dropdown_sortCriteria.value = 'player'
        hide(sort_options)
    } else if (['tetris', 'ssbm'].includes(gameID)) {
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
    if (tab == 'runRecap') {
        show(runRecap_details)
    } else {
        hide(runRecap_details)
    }
}
function action() {
    parseCheckboxes()
    tabAction()
    if (globalTab != 'leaderboard') {
        document.getElementById('leaderboard').innerHTML = ''
    }
    if (globalTab != 'charts') {
        document.getElementById('chart').innerHTML = ''
    }
    if (globalTab != 'map') {
        countries = {}
        document.getElementById('world-map').innerHTML = ''
    }
    console.log(globalTab)
    if (['leaderboards', 'featured', 'charts', 'map', 'sort'].includes(globalTab)) {
        show('categorySelect')
        if (mode == 'commBestILs' && globalTab == 'leaderboards') {
            hide('categorySelect')
        }
    } else {
        hide('categorySelect')
    }
    if (localStorage.getItem('username') == 'Narcis Prince') {
        document.getElementById('myekulHeader').src = 'images/levels/spo/narcisprince.webp'
    }
    setBoardTitle()
    updateCategories()
}
function tabAction() {
    if (['runRecap', 'commBest'].includes(globalTab) && mode != 'commBestILs' || (globalTab == 'spotlight' && mode != 'fullgame')) {
        showTab('leaderboard')
    } else {
        switch (globalTab) {
            case 'leaderboard':
                generateLeaderboard();
                break;
            case 'leaderboards':
                generateLeaderboards();
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
            case 'ballpit':
                ballpit()
                break
        }
        fontAwesomePage = fontAwesomeSet[globalTab]
        const pageTitle = document.getElementById('pageTitle')
        if (globalTab == 'leaderboard') {
            if (mode == 'commBestILs') {
                show(pageTitle)
                pageTitle.innerHTML = fontAwesomeText('tasks', 'Comm Best ILs')
            } else {
                hide(pageTitle)
            }
        } else if (globalTab == 'ballpit') {
            hide(pageTitle)
        } else {
            show(pageTitle)
            pageTitle.innerHTML = fontAwesomeText(fontAwesomePage[1], fontAwesomePage[0])
        }
        if (globalTab == 'runRecap') {
            show('musicDiv')
        } else {
            hide('musicDiv')
        }
    }
}
function setMode(newMode) {
    mode = newMode
    url.searchParams.set('mode', mode);
    window.history.pushState({}, '', url);
    buttonClick(mode + 'Button', 'modeSelection', 'activeBanner')
    if (mode != 'levels') {
        disableLevelModes()
    }
}