function showTabCL(tab) {
    window.firebaseUtils.screenView()
    hideTabs()
    tooltipStyle?.remove()
    document.querySelectorAll('.hide').forEach(elem => {
        hide(elem)
    })
    if (['cuphead', 'sm64', 'nsmbw'].includes(gameID) && mode == 'fullgame') {
        show('fullgameCategoriesSection')
    }
    if (['cuphead', 'sm64', 'ssb64', 'ssbm'].includes(gameID) && mode == 'levels') {
        show('ILsSection_' + gameID)
    }
    show(tab + 'Tab')
    if (gameID == 'cuphead' && mode == 'levels') {
        document.getElementById('checkbox_hp').checked = true
    }
    if (gameID == 'cuphead' && mode == 'levels') {
        show('WRs_cupheadILs_options')
    }
}
function action() {
    parseCheckboxes()
    tabAction()
    if (['leaderboards', 'featured', 'map', 'sort'].includes(globalTab)) {
        show('categorySelect')
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
    switch (globalTab) {
        case 'home':
            generateHome();
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
        case 'map':
            generateMap();
            break;
        case 'sort':
            generateSort();
            break;
        case 'ballpit':
            ballpit()
            break
    }
    fontAwesomePage = fontAwesomeSet[globalTab]
    if (fontAwesomePage) {
        if (globalTab == 'home') {
            hide('pageTitle')
        } else {
            show('pageTitle')
            setPageTitle(fontAwesomePage[1], fontAwesomePage[0])
        }
    }
}
function setMode(newMode) {
    mode = newMode
    setParam('mode', mode)
    buttonClick(mode + 'Button', 'modeSelection', 'activeBanner')
    if (mode != 'levels') disableLevelModes()
}