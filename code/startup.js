initializeHash('leaderboard')
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
if (['tetris', 'smb1', 'smb2', 'smb3', 'nsmbds'].includes(gameID)) {
    setMode('fullgame')
    url.searchParams.delete('mode');
    window.history.pushState({}, '', url);
}
if (['titanfall_2', 'mtpo', 'spo', 'ssbm', 'ssb64'].includes(gameID)) {
    setMode('levels')
    url.searchParams.delete('mode');
    window.history.pushState({}, '', url);
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
function loadJSFile(path, callback) {
    const script = document.createElement('script');
    script.src = path;
    script.type = 'text/javascript';
    script.onload = callback;
    document.head.appendChild(script);
}
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
    if (gameID == 'cuphead') {
        audioNames = ['cardup', 'carddown', 'cardflip', 'category_select', 'equip_move', 'locked', 'move', 'ready', 'win_time_loop', 'win_time_loop_end']
    }
    if (gameID == 'smb3') {
        audioNames = ['cardup', 'carddown', 'locked', 'cardflip', 'equip_move']
    }
    if (gameID == 'sm64') {
        audioNames = ['cardup', 'carddown']
    }
    if (gameID == 'ssbm') {
        audioNames = ['cardup', 'carddown', 'category_select']
    }
    audioNames.forEach(audio => {
        const audioElement = document.createElement('audio');
        audioElement.id = audio;
        audioElement.src = 'sfx/' + gameID + '/' + audio + '.wav';
        document.body.appendChild(audioElement);
    });
}
document.addEventListener('DOMContentLoaded', function () {
    show('bodyContent')
    if (gameID == 'cuphead') {
        gapi.load("client", loadClient);
        loadJSFile('constants/cuphead/commBest.js', function () {
            commBestILsCategory = commBestILs['1.1+']
            generateDropbox('sav')
            generateDropbox('lss')
            runRecapDefault()
            DOMloaded()
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
if (['cuphead'].includes(gameID)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `styles/games/${gameID}.css`;
    document.head.appendChild(link);
}
function fetchDiscord() {
    fetch('https://discord.com/api/guilds/1386406855391313960/widget.json')
        .then(response => response.json())
        .then(data => {
            discordData = data
            discordOnline(data.presence_count)
        })
}
function discordOnline(num) {
    document.getElementById('discordOnline').innerHTML = `
        <div class='container grow' style='gap:5px' onclick="openModalCL('discord','up')">
            <img src="images/external/discord.png" class="brightPulse" style="padding-left:10px;height:24px">
            <div style='width:8px;height:8px;background-color:limegreen;border-radius:50%'></div>
            ${num}
        </div>`
}
fetchDiscord()
if (['ssbm', 'tetris'].includes(gameID)) {
    const style = document.createElement('style');
    style.innerHTML = `
        #github {
            filter: brightness(0) invert(1);
        }
    `;
    document.head.appendChild(style);
}
const closeModalOG = closeModal
closeModal = function () {
    closeModalOG()
    closeModalCL()
}
const showTabOG = showTab;
showTab = function (...args) {
    showTabOG(...args)
    showTabCL(...args)
}
const toggleSidebarOG = toggleSidebar;
toggleSidebar = function (...args) {
    toggleSidebarOG(...args)
    if (document.getElementById('sidebar').classList.contains('hidden')) {
        playSound('carddown')
    } else {
        playSound('cardup')
    }
}
setTitle('COMBINED LEADERBOARD')
setFooter('2024-2025')
setSidebar(generateSidebar())
    .then(() => {
        document.getElementById('sidebarLogo').src = `images/logo/${gameID}.png`
    })
setTabs(['leaderboard', 'featured', null, 'WRs', 'leaderboards', null, 'charts', 'map', 'sort', null, 'ballpit'])
    .then(() => {
        document.querySelectorAll('#tabs .button').forEach(elem => {
            elem.addEventListener('click', () => {
                playSound('category_select')
            })
        })
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
