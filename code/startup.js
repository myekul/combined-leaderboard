initializeHash('home')
setTitle('COMBINED LEADERBOARD')
setFooter('2024-2025')
setSidebar(generateSidebar())
    .then(() => {
        document.getElementById('sidebarLogo').src = `images/logo/${gameID}.png`
    })
let gameParam = getParam('game')
if (!gameParam) {
    gameParam = 'cuphead'
    setParam('game', gameParam)
}
const gameID = gameParam;
let modeParam = getParam('mode')
if (['fullgame', 'levels', 'commBestILs'].includes(modeParam)) {
    setMode(modeParam)
} else {
    setMode('fullgame')
}
if (['cuphead', 'sm64', 'nsmbw'].includes(gameID)) {
    show(gameID + '_fullgameCategories')
}
if (['tetris', 'smb1', 'smb2', 'smb3', 'nsmbds'].includes(gameID)) {
    setMode('fullgame')
    deleteParam('mode')
}
if (['titanfall_2', 'mtpo', 'spo', 'ssbm', 'ssb64'].includes(gameID)) {
    setMode('levels')
    deleteParam('mode')
}
function generateSidebar() {
    let HTMLContent = ''
    const games = [['cuphead'], ['sm64', 'sms'], ['smb1', 'smbtll'], ['smb2', 'smb3'], ['nsmbds', 'nsmbw'], ['nsmbu', 'nslu'], ['dkc', 'dkc2', 'dkc3'], ['mtpo', 'spo'], ['ssb64', 'ssbm'], ['titanfall_2']]
    games.forEach(gameSet => {
        HTMLContent += `<div class='container'>`
        gameSet.forEach(game => {
            HTMLContent += `<a href='?game=${game}' class="container grow ${game}" style='width:100%'><img src="images/logo/${game}.png"></a>`
        })
        HTMLContent += `</div>`
    })
    return HTMLContent
}
document.documentElement.style.setProperty('--banner', getColorFromClass(gameID));
document.documentElement.style.setProperty('--bannerText', getColorFromClass(gameID, true));
if (['smb1', 'smbtll', 'mtpo', 'spo', 'titanfall_2', 'ssbm', 'ssb64'].includes(gameID)) {
    document.getElementById('checkbox_milliseconds').checked = true;
}
google.charts.load('current', { packages: ['corechart'] });
function hideTabs() {
    const tabs = document.querySelectorAll('.tabs')
    tabs.forEach(elem => {
        hide(elem)
    })
}
hideTabs()
function DOMloaded() {
    if (!['tetris', 'mtpo', 'spo', 'titanfall_2', 'ssbm', 'ssb64'].includes(gameID)) {
        fetch(`constants/categories/${gameID}.json`)
            .then(response => response.json())
            .then(data => {
                categorySet = data
                refreshLeaderboard()
            }).catch(error => {
                console.error('Error loading categories:', error);
                generateCategories(gameID)
            })
    } else {
        refreshLeaderboard()
    }
    let audioNames = []
    if (gameID == 'smb3') {
        audioNames = ['cardup', 'carddown', 'locked', 'cardflip', 'equip_move']
    }
    if (gameID == 'sm64') {
        audioNames = ['cardup', 'carddown']
    }
    if (gameID == 'ssbm') {
        audioNames = ['cardup', 'carddown', 'category_select']
    }
    setAudio(gameID, audioNames)
}
document.addEventListener('DOMContentLoaded', function () {
    show('bodyContent')
    if (gameID == 'cuphead') {
        gapi.load("client", loadClient);
        addJSFile('https://myekul.github.io/shared-assets/cuphead/cuphead.js', () => {
            addJSFile('constants/cuphead/commBest.js', () => {
                commBestILsCategory = commBestILs['1.1+']
                generateDropbox('sav')
                generateDropbox('lss')
                runRecapDefault()
                DOMloaded()
            })
        })
    } else if (gameID == 'ssbm') {
        gapi.load("client", loadClient);
        DOMloaded()
    } else {
        DOMloaded()
    }
})
document.querySelectorAll('.options').forEach(elem => {
    elem.innerHTML = fontAwesome('ellipsis-h')
    elem.classList.add('container')
    elem.classList.add('grow')
    elem.addEventListener('click', () => {
        toggleOptions()
    })
});
document.querySelectorAll('.toggleSection').forEach(elem => {
    elem.innerHTML = fontAwesome('bars')
    elem.classList.add('container')
    elem.classList.add('grow')
    elem.style.width = '50px'
});
document.querySelectorAll('select').forEach(elem => {
    elem.addEventListener('change', () => {
        playSound('cardflip')
        if (elem.id == 'dropdown_mode') {
            switch (elem.value) {
                case 'fullgame':
                    getFullgame()
                    break;
                case 'levels':
                    getLevels()
                    break;
                case 'commBestILs':
                    getCommBestILs()
                    break;
            }
        } else {
            if (!elem.classList.contains('oneGun')) {
                action()
            }
        }
    })
})
if (gameID != 'tetris') {
    const url = `https://www.speedrun.com/api/v1/games/${gameID}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('srcGame').innerHTML = `${getAnchor('https://www.speedrun.com/' + gameID)}<img src='${data.data.assets['cover-tiny'].uri}' height='90px' class='grow'></a>`
            // console.log(data.data)
        })
}
if (['ssbm', 'tetris'].includes(gameID)) {
    const style = document.createElement('style');
    style.innerHTML = `
        #github {
            filter: brightness(0) invert(1);
        }
    `;
    document.head.appendChild(style);
}
const showTabOG = showTab;
showTab = function (...args) {
    if (globalTab == 'leaderboards') {
        sortCategoryIndex = -1
    }
    showTabOG(...args)
    showTabCL(...args)
}
setTabs(['home', 'featured', 'leaderboards', null, 'WRs', 'map', 'sort', null, 'ballpit'])
    .then(() => {
        switch (gameID) {
            case 'cuphead':
                show('modeSelection')
                document.querySelectorAll('.cupheadButton').forEach(elem => {
                    show(elem)
                })
                break;
            case 'sm64':
                show('modeSelection')
                break;
            case 'tetris':
                document.querySelectorAll('.options').forEach(elem => hide(elem))
                hide('featuredButton')
                hide('mapButton')
                break;
            case 'nsmbw':
                show('modeSelection')
                break;
            case 'ssbm':
                hide('featuredButton')
                hide('mapButton')
                break;
        }
    })