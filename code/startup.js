const hash = window.location.hash
let page = hash ? hash.slice(1) : 'leaderboard'
const url = new URL(window.location.href);
const params = new URLSearchParams(window.location.search);
let gameParam = params.get('game');
if (!gameParam) {
    gameParam = 'cuphead'
    url.searchParams.set('game', gameParam);
    window.history.pushState({}, '', url);
}
const gameID = gameParam;
let modeParam = params.get('mode')
if (['fullgame', 'levels', 'commBestILs'].includes(modeParam)) {
    setMode(modeParam)
} else {
    setMode('fullgame')
}
if (['cuphead', 'sm64', 'nsmbw'].includes(gameID)) {
    show(gameID + '_fullgameCategories')
}
let numModalPages = 3
const SHEET_ID = gameID == 'cuphead' ? '14l1hkW337uiyCRkNz61MNq99AEoidZdqaQUIpH5FlGU' : '1ZBxkZEsfwDsUpyire4Xb16er36Covk7nhR8BN_LPodI'
if (['tetris', 'smb1', 'smb2', 'smb3', 'nsmbds'].includes(gameID)) {
    setMode('fullgame')
    url.searchParams.delete('mode');
    window.history.pushState({}, '', url);
}
if (['titanfall_2', 'mtpo', 'spo'].includes(gameID)) {
    setMode('levels')
    url.searchParams.delete('mode');
    window.history.pushState({}, '', url);
}
// Stylization
document.addEventListener('DOMContentLoaded', function () {
    gameTabs()
    show('bodyContent')
})
function gameTabs() {
    let HTMLContent = ''
    const games = ['cuphead', 'sm64', 'tetris', 'titanfall_2']
    games.forEach(game => {
        HTMLContent += `<a href='?game=${game}' class="container clickable ${game}"><img src="images/logo/${game}.png"></a>`
    })
    const moreGames = [['mtpo', 'spo'], ['smb1', 'smbtll'], ['smb2', 'smb3'], ['nsmbds', 'nsmbw'], ['nsmbu', 'nslu'], ['sms', 'smo']]
    moreGames.forEach(gameSet => {
        HTMLContent += `<div class='container'>`
        gameSet.forEach(game => {
            HTMLContent += `<a href='?game=${game}' class="container clickable ${game}" style='width:100%'><img src="images/logo/${game}.png"></a>`
        })
        HTMLContent += `</div>`
    })
    document.getElementById('gameSelect').innerHTML = HTMLContent
}
document.getElementById('gameLogoButton').src = `images/logo/${gameID}.png`
const subtitle = document.getElementById('subtitle')
const header = document.querySelector('header')
// const gameIcons = document.querySelectorAll('.gameIcon')
// if (gameID == 'tetris' || categorySet[gameID]) {
//     gameIcons.forEach(gameIcon => {
//         gameIcon.src = `images/favicon/${gameID}.png`
//     })
// }
document.documentElement.style.setProperty('--banner', getColorFromClass(gameID));
document.documentElement.style.setProperty('--bannerText', getColorFromClass(gameID, true));
const title = document.querySelector('title')
switch (gameID) {
    case 'cuphead':
        show('commBestILsButton')
        show('dropdown_mode')
        document.querySelectorAll('.cupheadButton').forEach(elem => {
            elem.classList.add('button')
            elem.classList.add('container')
            show(elem)
        })
        break;
    case 'sm64':
        show('dropdown_mode')
        break;
    case 'tetris':
        document.querySelectorAll('.options').forEach(elem => hide(elem))
        hide('featuredButton')
        hide('mapButton')
        const github = document.getElementById('github');
        github.style.filter = 'brightness(0) invert(1)';
        break;
    case 'nsmbw':
        show('dropdown_mode')
        break;
}
if (['smb1', 'smbtll', 'mtpo', 'spo', 'titanfall_2'].includes(gameID)) {
    document.getElementById('checkbox_milliseconds').checked = true;
}
google.charts.load('current', { packages: ['corechart'] });
function loadJSFile(path, callback) {
    const script = document.createElement('script');
    script.src = path;
    script.type = 'text/javascript';
    script.onload = callback;
    document.head.appendChild(script);
}
document.addEventListener('DOMContentLoaded', function () {
    if (!['tetris', 'mtpo', 'spo', 'titanfall_2'].includes(gameID)) {
        fetch(`constants/categories/${gameID}.json`)
            .then(response => response.json())
            .then(data => {
                categorySet = data
                if (gameID == 'cuphead') {
                    loadJSFile('constants/cuphead/commBest.js', function () {
                        commBestILsCategory = commBestILs['1.1+']
                        generateDropbox('sav')
                        generateDropbox('lss')
                        refreshLeaderboard()
                    })
                } else {
                    refreshLeaderboard()
                }
            }).catch(error => {
                console.error('Error loading categories:', error);
                generateCategories(gameID)
            })
    } else {
        refreshLeaderboard()
    }
    let audioNames = []
    if (gameID == 'cuphead') {
        audioNames = ['cardup', 'carddown', 'cardflip', 'category_select', 'equip_move', 'locked', 'move', 'ready', 'win_time_loop', 'win_time_loop_end']
    }
    if (gameID == 'smb3') {
        audioNames = ['cardup', 'carddown', 'locked', 'cardflip', 'equip_move']
    }
    if (gameID == 'sm64') {
        audioNames = ['cardup', 'carddown']
    }
    audioNames.forEach(audio => {
        const audioElement = document.createElement('audio');
        audioElement.id = audio;
        audioElement.src = 'sfx/' + gameID + '/' + audio + '.wav';
        document.body.appendChild(audioElement);
    });
})
document.querySelectorAll('.options').forEach(elem => {
    elem.innerHTML = fontAwesome('ellipsis-h')
    elem.classList.add('container')
    elem.classList.add('clickable')
    elem.addEventListener('click', () => {
        toggleOptions()
    })
});
['leaderboard', 'WRs', 'featured', 'charts', 'map', 'sort'].forEach(pageName => {
    const button = document.getElementById(pageName + 'Button')
    button.innerHTML = fontAwesome(fontAwesomeSet[pageName][1])
    button.classList.add('button')
    button.addEventListener('click', () => {
        showTab(pageName)
    })
})
document.querySelectorAll('select').forEach(elem => {
    elem.addEventListener('change', () => {
        elem.classList.add('clickable')
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
            action()
        }
    })
})
if (gameID != 'tetris') {
    const url = `https://www.speedrun.com/api/v1/games/${gameID}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('srcGame').innerHTML = `${getAnchor('https://www.speedrun.com/' + gameID)}<img src='${data.data.assets['cover-tiny'].uri}' height='90px' class='clickable'></a>`
            // console.log(data.data)
        })
}
if (['cuphead', 'sm64', 'mtpo', 'spo'].includes(gameID)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `styles/games/${gameID}.css`;
    document.head.appendChild(link);
}