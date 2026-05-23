google.charts.load('current', { packages: ['corechart'] });
initializeHash('home')
setFooter(2024)
grades.unshift({ grade: 'S', className: 'grade-s grade', threshold: 100 })
let gameParam = getParam('game')
if (!gameParam) {
    gameParam = 'cuphead'
    setParam('game', gameParam)
}
const gameID = gameParam;
let modeParam = getParam('mode')
if (['fullgame', 'levels'].includes(modeParam)) {
    setMode(modeParam)
} else {
    setMode('fullgame')
}
if (['cuphead', 'sm64', 'nsmbw'].includes(gameID)) {
    show(gameID + '_fullgameCategories')
}
if (['smb1', 'smb2', 'smb3', 'nsmbds'].includes(gameID)) {
    setMode('fullgame')
    deleteParam('mode')
}
if (['titanfall_2', 'mtpo', 'spo', 'ssbm', 'ssb64'].includes(gameID)) {
    setMode('levels')
    deleteParam('mode')
}
setSidebar(generateSidebar())
    .then(() => {
        document.getElementById('sidebarLogo').src = `images/logo/${gameID}.png`
        document.getElementById('gameLogo').src = `images/logo/${gameID}.png`
    })
function generateSidebar() {
    let HTMLContent = ''
    const games = [['cuphead'], ['sm64', 'sms'], ['smg1', 'smg2'], ['smo', 'dkb'], ['smb1', 'smbtll'], ['smb2', 'smb3'], ['dkc', 'dkc2', 'dkc3'], ['mtpo', 'spo'], ['ssb64', 'ssbm']]
    gamesShort = ['cuphead', 'sm64', 'smo', 'smb1']
    gamesShort.forEach(game => {
        HTMLContent += `<a href='?game=${game}' class="container grow ${game}" style='width:100%'><img src="images/logo/${game}.png"></a>`
    })
    HTMLContent += `
    <div class='container grow banner font2' style='gap:8px;font-size:120%;height:50px' onclick="moreGames()">
        ${fontAwesome('plus')}
        MORE GAMES
        ${fontAwesome('plus')}
    </div>`
    return HTMLContent
}
function moreGames() {
    const games = []
    games.push([['cuphead', 'titanfall_2'], ['dkc', 'dkc2'], ['dkc3', 'dkb'], ['mtpo', 'spo'], ['ssb64', 'ssbm'], ['bfbb', 'facade'], ['the_escapists', 'the_messenger'], ['splatoon1', 'shar']])
    games.push([['smb1', 'smbtll'], ['smb2', 'smb3'], ['nsmbds', 'nsmbw'], ['nsmb2', 'nsmbu'], ['nslu', 'sm64ds'], ['sm64', 'sms'], ['smg1', 'smg2'], ['smo']])
    let HTMLContent = `<div class='container' style='margin:20px'>`
    games.forEach(gameSetSet => {
        HTMLContent += `<div>`
        gameSetSet.forEach(gameSet => {
            HTMLContent += `<div class='container'>`
            gameSet.forEach(game => {
                HTMLContent += `<a href='?game=${game}' class="container grow ${game}" style='width:120px;height:60px'><img src="images/logo/${game}.png" style='max-width: 250px;
            width: 80%;
            height: 55px;
            object-fit: contain;
            padding: 1px 0'></a>`
            })
            HTMLContent += `</div>`
        })
        HTMLContent += `</div>`
    })
    HTMLContent += `</div>`
    openModal(HTMLContent, 'ALL GAMES')
}
document.documentElement.style.setProperty('--banner', getColorFromClass(gameID));
document.documentElement.style.setProperty('--bannerText', getColorFromClass(gameID, true));
if (['smb1', 'smbtll', 'mtpo', 'spo', 'titanfall_2', 'ssbm', 'ssb64'].includes(gameID)) {
    document.getElementById('checkbox_milliseconds').checked = true;
}
function hideTabs() {
    const tabs = document.querySelectorAll('.tabs')
    tabs.forEach(elem => {
        hide(elem)
    })
}
hideTabs()
function DOMloaded() {
    if (!['mtpo', 'spo', 'titanfall_2', 'ssbm', 'ssb64'].includes(gameID)) {
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
        addJSFile('https://myekul.com/shared-assets/cuphead/cuphead.js', () => {
            fetch(`https://myekul.com/run-recap/resources/categoryData.json`)
                .then(response => response.json())
                .then(data => {
                    commBestILs = data
                    DOMloaded()
                }).catch(error => {
                    console.error('Oops!', error)
                })
        })
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
        if (!elem.classList.contains('oneGun')) {
            action()
        }
    })
})
const url = `https://www.speedrun.com/api/v1/games/${gameID}`
fetch(url)
    .then(response => response.json())
    .then(data => {
        document.getElementById('srcGame').innerHTML = `${getAnchor('https://www.speedrun.com/' + gameID)}<img src='${data.data.assets['cover-tiny'].uri}' height='70px' class='grow'></a>`
        // console.log(data.data)
    })
if (['ssbm'].includes(gameID)) {
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
setTabs(['info', 'home', 'featured', 'leaderboards', null, 'WRs', 'map', 'sort', null, 'ballpit'])
    .then(() => {
        if (['cuphead', 'sm64', 'nsmbw'].includes(gameID)) {
            show('modeSelection')
        }
    })