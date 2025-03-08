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
if (['titanfall_2', 'mtpo'].includes(gameID)) {
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
    const games = ['cuphead', 'sm64', 'tetris', 'titanfall_2', 'mtpo']
    games.forEach(game => {
        HTMLContent += `<a href='?game=${game}' class="container clickable ${game}"><img src="images/logo/${game}.png"></a>`
    })
    const moreGames = [['smb1', 'smbtll'], ['smb2', 'smb3'], ['nsmbds', 'nsmbw'], ['sms', 'smo']]
    moreGames.forEach(gameSet => {
        HTMLContent += `<div class='container'>`
        gameSet.forEach(game => {
            HTMLContent += `<a href='?game=${game}' class="container clickable ${game}" style='width:100%'><img src="images/logo/${game}.png"></a>`
        })
        HTMLContent += `</div>`
    })
    document.getElementById('gameSelect').innerHTML = HTMLContent
}
const gameLogo = document.getElementById('gameLogo')
gameLogo.src = `images/logo/${gameID}.png`
document.getElementById('gameLogoButton').src = `images/logo/${gameID}.png`
const subtitle = document.getElementById('subtitle')
const header = document.querySelector('header')
const gameIcons = document.querySelectorAll('.gameIcon')
gameIcons.forEach(gameIcon => {
    gameIcon.src = `images/favicon/${gameID}.png`
})
document.documentElement.style.setProperty('--banner', getColorFromClass(gameID));
document.documentElement.style.setProperty('--bannerText', getColorFromClass(gameID, true));
const title = document.querySelector('title')
switch (gameID) {
    case 'cuphead':
        show('commBestILsButton')
        show('modeSelection')
        show('runRecapButton')
        break;
    case 'sm64':
        show('modeSelection')
        break;
    case 'tetris':
        subtitle.innerText = 'PACE ACADEMY';
        document.querySelectorAll('.options').forEach(elem => hide(elem))
        hide('featuredButton')
        hide('mapButton')
        const github = document.getElementById('github');
        github.style.filter = 'brightness(0) invert(1)';
        break;
    case 'nsmbw':
        show('modeSelection')
        break;
}
if (['smb1', 'smbtll', 'mtpo'].includes(gameID)) {
    document.getElementById('checkbox_milliseconds').checked = true;
}
if (['tetris', 'smb1', 'smbtll', 'smb2', 'smb3'].includes(gameID)) {
    header.style.fontFamily = 'pressStart2P';
    subtitle.style.fontFamily = 'pressStart2P'
    if (['smb2', 'smb3'].includes(gameID)) {
        gameLogo.src = ''
        const gameTitle = document.getElementById('gameTitle')
        gameTitle.innerText = 'SUPER MARIO BROS. ' + gameID.slice(-1)
        if (gameID == 'smb2') {
            gameTitle.style.color = 'gold'
            gameTitle.style.textShadow = '-3px 3px 0px red'
        } else {
            gameTitle.style.color = 'royalblue'
            gameTitle.style.textShadow = '-2px 2px 0px red'
        }
        subtitle.style.padding = '6px 0'
    } else {
        gameLogo.style.height = '80px'
        header.style.height = '140px'
        subtitle.style.padding = '10px 0'
    }
    gameIcons.forEach(gameIcon => {
        gameIcon.style.marginBottom = '8px'
    })
}
if (['sm64', 'sms', 'smo', 'nsmbds', 'nsmbw'].includes(gameID)) {
    gameLogo.style.height = '80px'
    header.style.height = '130px'
}
// document.getElementById('favicon').href = `images/favicon/${gameID}.png`
google.charts.load('current', { packages: ['corechart'] });
document.addEventListener('DOMContentLoaded', function () {
    refreshLeaderboard()
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
})