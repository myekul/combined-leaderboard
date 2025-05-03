function getLetterGrade(percentage) {
    for (let grade of grades) {
        if (percentage >= grade.threshold) {
            return grade;
        }
    }
    return grades[grades.length - 1]
}
function secondsToHMS(seconds, exception) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    let HTMLContent = ''
    if (hours > 0) {
        HTMLContent = `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else {
        HTMLContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    if ((milliseconds && page != 'charts') || exception) {
        HTMLContent += displayDecimals(seconds)
    }
    return HTMLContent
}
function displayDecimals(value, exception) {
    let ms = Math.round((value % 1) * 1000)
    if (ms) {
        ms = gameID == 'mtpo' || exception ? ms / 10 : ms
        const padding = gameID == 'mtpo' || exception ? 2 : 3
        return `.<span style='font-size:75%'>${Math.round(ms).toString().padStart(padding, '0')}</span>`
    }
    return ''
}
function convertToSeconds(time) {
    if (time.includes(":")) {
        const [minutes, seconds] = time.split(":").map(Number);
        return minutes * 60 + seconds;
    } else {
        return Number(time);
    }
}
function getGPA(value) {
    const gpa = (value / 100 * 4).toString().slice(0, 4)
    return Math.floor(gpa) + displayDecimals(gpa, true)
}
function getPercentage(value) {
    if (value || value == 0) {
        return value * 100
    }
    return ''
}
function displayPercentage(percentage) {
    if (percentage) {
        percentage = percentage.toFixed(2).toString()
        let percentageDecimals = '00'
        if (percentage.split('.').length > 1) {
            percentageDecimals = percentage.split('.')[1]
            if (percentageDecimals.length == 1) {
                percentageDecimals += 0
            }
        }
        return percentage.split('.')[0] + `<span style='font-size:70%;justify-self:flex-end'>.${percentageDecimals}</span>`
    }
    return ''
}
function placeClass(place) {
    if (place == 1) {
        return 'first'
    } else if (place == 2) {
        return 'second'
    } else if (place == 3) {
        return 'third'
    }
    return null
}
function playSound(sfx) {
    if (['cuphead', 'smb3', 'sm64'].includes(gameID)) {
        const sound = document.getElementById(sfx)
        if (sound) {
            sound.currentTime = 0
            sound.volume = 0.2
            sound.play()
        }
    }
}
function stopSound(sfx) {
    const sound = document.getElementById(sfx)
    sound.pause()
    sound.currentTime = 0
}
function getImage(image, heightParam) {
    const height = heightParam ? heightParam : 42
    return `<img src='images/${gameID}/levels/${image}.png' style='height:${height}px;width:auto'>`
}
function getColorClass() {
    if (mode == 'commBestILs') {
        return commBestILsCategory.className
    }
    if (cupheadVersion == 'legacy') {
        return 'legacy'
    }
    return gameID == 'cuphead' ? DLCnoDLC == 'dlc' ? 'dlc' : 'cuphead' : ''
}
function getScore(category, runTime) {
    const wrTime = getWorldRecord(category)
    let percentage = wrTime / runTime
    if ((gameID == 'cuphead' && mode == 'levels')) {
        if (runTime > category.info.time) {
            percentage = 0
        } else {
            percentage = (category.info.time - runTime) / (category.info.time - wrTime);
        }
    } else if (reverseScore.includes(category.name)) {
        percentage = runTime / wrTime
    }
    return getPercentage(percentage)
}
function getTrophy(place) {
    let placeText = ''
    if (place == 1) {
        placeText = '1st'
    } else if (place == 2) {
        placeText = '2nd'
    } else if (place == 3) {
        placeText = '3rd'
    } else {
        return ''
    }
    themeID = gameID == 'cuphead' ? 'jre1dqwn' : 'e87d4p8q'
    if (place) {
        return `<img src='images/trophy/${['cuphead', 'sm64', 'titanfall_2'].includes(gameID) ? gameID + '/' : ''}${place}.png' title='${placeText}' style='height:14px'>`
    }
    return ''
}
function trophyCase(object) {
    let HTMLContent = object.count1 > 0 ? `<td class='trophyCase' style='text-align:left'>${getTrophy(1)}<span>${object.count1 > 1 ? object.count1 : ''}</span></td>` : '<td></td>'
    HTMLContent += object.count2 > 0 ? `<td class='trophyCase' style='text-align:left'>${getTrophy(2)}<span>${object.count2 > 1 ? object.count2 : ''}</span></td>` : '<td></td>'
    HTMLContent += object.count3 > 0 ? `<td class='trophyCase' style='text-align:left'>${getTrophy(3)}<span>${object.count3 > 1 ? object.count3 : ''}</span></td>` : '<td></td>'
    return HTMLContent
}
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
    document.getElementById('runRecapButton').classList.remove('active2')
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
    if (page == 'runRecap' && mode != 'commBestILs') {
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
        }
        fontAwesomePage = fontAwesomeSet[page]
        document.getElementById('pageTitle').innerHTML = fontAwesomePage ? fontAwesomeText(fontAwesomePage[1], fontAwesomePage[0]) : ''
    }
}
const fontAwesomeSet = {
    WRs: ['World Records', 'trophy',],
    featured: ['Featured', 'star'],
    charts: ['Charts', 'bar-chart'],
    map: ['Map', 'flag'],
    sort: ['Sort', 'sort-amount-asc'],
    runRecap: ['Run Recap', 'history']
}
function fontAwesome(icon) {
    return `<i class="fa fa-${icon}"></i>`
}
function fontAwesomeText(icon, text) {
    return fontAwesome(icon) + `&nbsp;&nbsp;` + text
}
function getAnchor(url) {
    return url ? `<a href="${url}" target='_blank'>` : ''
}
function getPlayerName(player) {
    if (player.name.charAt(0) == '[') {
        const match = player.name.match(/\(([^)]+)\)/)
        player.name = match ? match[1] : player.name.slice(4)
    }
    const HTMLContent = player['name-style'] ? `<span style='background: linear-gradient(90deg, ${player['name-style'].color1}, ${player['name-style'].color2});-webkit-background-clip: text;color: transparent;'>${player.name}</span>` : player.name
    return HTMLContent
}
function getPlayerFlag(player, size) {
    const playerLocation = player.location
    if (playerLocation) {
        let countryCode = playerLocation.country.code
        let countryName = playerLocation.country.names.international
        return getFlag(countryCode, countryName, size)
    }
    return ''
}
function getPlayerIcon(player, size) {
    const imgsrc = player.links?.img ? player.links.img : ''
    const src = imgsrc ? 'https://www.speedrun.com/static/user/' + player.id + '/image?v=' + imgsrc : 'images/null.png'
    return `<div style='width:${size}px;height:${size}px'><img src='${src}' style='width:100%;height:100%;border-radius: 50%;object-fit: cover;object-position:center' title='${player.name}'></img></div>`
}
function getFlag(countryCode, countryName, size) {
    let HTMLContent = `<img src="https://www.speedrun.com/images/flags/${countryCode}.png" style="height:${size}px" title="${countryName}" alt=''></img>`
    return HTMLContent
}
function buttonClick(pressed, unpressed, className) {
    document.querySelectorAll('#' + unpressed + ' .button').forEach(button => {
        button.classList.remove(className)
    })
    const button = document.getElementById(pressed)
    button.classList.add(className)
}
function getWorldRecord(category) {
    return category.runs[0]?.score
}
function toggleOptions(name) {
    let elemName = name ? name : page
    elemName += '_options'
    playSound('move')
    const visible = toggleVisibility(elemName)
    const button = document.getElementById(elemName + '_button')
    button.innerHTML = visible ? fontAwesome('close') : fontAwesome('ellipsis-h')
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
function isSelected(categoryIndex) {
    return categoryIndex == sortCategoryIndex ? 'selected' : ''
}
function createArray(object) {
    let array = []
    for (let key in object) {
        array.push(object[key])
    }
    return array
}
function getRowColor(index) {
    return index % 2 == 0 ? 'otherColor' : 'background'
}
function addOpacityToCSSVar(color) { // ChatGPT
    const rgb = color.trim().match(/rgb\((\d+), (\d+), (\d+)\)/);
    if (rgb) {
        const r = rgb[1];
        const g = rgb[2];
        const b = rgb[3];
        const rgba = `rgba(${r}, ${g}, ${b}, 0.1)`;
        return rgba;
    } else {
        return addOpacityToCSSVar(hexToRgb(color));
    }
}
function hexToRgb(hex) { // ChatGPT
    hex = hex.replace(/^#/, '');
    if (hex.length == 3) {
        hex = hex.split('').map(function (hexChar) {
            return hexChar + hexChar;
        }).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
}
function getNumCols() {
    let numCols = 0
    displayBoolean.forEach(display => {
        if (display) {
            numCols++
        }
    })
    if (mode == 'commBestILs') {
        numCols = 1
    }
    return numCols
}
function showDefault() {
    playSound('equip_move')
    sortCategoryIndex = -1
    document.getElementById('checkbox_isolate').checked = false
    sortPlayers(players)
    action()
}
function getVideoLink(run) {
    if (run.videos) {
        if (run.videos.links) {
            return run.videos.links[run.videos.links.length - 1].uri
        } else {
            return run.videos.text
        }
    } else {
        return ''
    }
}
function trimDifficulty(difficulty) {
    return difficulty.split(' ')[difficulty.split(' ').length - 1]
}
function cupheadNumCats(category) {
    return big5() ? difficultyILs ? 2 : category.info.time > 129 ? 4 : 6 : 1
}
function big4() {
    return gameID == 'cuphead' && (allILs || difficultyILs || groundPlane || isleIndex > -1)
}
function big5() {
    return bossILindex > -1 || big4()
}
function tetrisCheck(category, score) {
    if (score) {
        return gameID == 'tetris' ? reverseScore.includes(category.name) ? Math.round(score).toLocaleString() : (score / 1).toFixed(2) : secondsToHMS(score)
    }
    return ''
}
function getPlayerDisplay(player) {
    let HTMLContent = ''
    HTMLContent += mode != 'commBestILs' ? `<td class='${placeClass(player.rank)}' style='font-size:90%'>${player.rank}</td>` : ''
    if (gameID != 'tetris') {
        if (document.getElementById('checkbox_flags').checked) {
            HTMLContent += `<td>${getPlayerFlag(player, 12)}</td>`
        }
        if (document.getElementById('checkbox_icons').checked) {
            HTMLContent += `<td>${getPlayerIcon(player, 18)}</td>`
        }
    }
    HTMLContent += `<td onclick="openModal('player','up',${player.rank - 1})" class='clickable' style='text-align:left;font-weight: bold;font-size:80%;padding-right:5px'>${getPlayerName(player)}</td>`
    return HTMLContent
}
function getNumDisplay() {
    if (page == 'sort') {
        return showMore ? 1000 : 300
    }
    return mode == 'fullgame' ? showMore ? 300 : 100 : showMore ? 100 : 20
}
function toggleGameSelect() {
    const gameSelect = document.getElementById('gameSelect')
    if (showGameSelect) {
        showGameSelect = false
        gameSelect.classList.add('hidden')
        setTimeout(() => {
            hide(gameSelect)
        }, 200);
        playSound('carddown')
    } else {
        showGameSelect = true
        gameSelect.classList.remove('hidden')
        show(gameSelect)
        playSound('cardup')
    }
}
function classNameLogic(category) {
    return category.info ? category.info.id : category.className
}
function getColorFromClass(className, textColor) {
    const field = textColor ? 'color' : 'backgroundColor'
    const tempEl = document.createElement('div');
    tempEl.className = className;
    document.body.appendChild(tempEl);
    const color = getComputedStyle(tempEl)[field];
    document.body.removeChild(tempEl);
    return color;
}
function getBackgroundColor() {
    return rootStyles.getPropertyValue('--otherColor')
}
function getFont() {
    return rootStyles.getPropertyValue('--font')
}
function getDPS(category, score) {
    return Math.round(category.hp / (score - 4))
}
function getSeason(month) {
    if (month < 2 || month === 11) {
        return 3;
    } else if (month < 5) {
        return 0;
    } else if (month < 8) {
        return 1;
    } else {
        return 2;
    }
}
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}
function getSocial(player, social) {
    if (player.links[social]) {
        if (social == 'src') {
            return 'https://www.speedrun.com/user/' + player.name
        } else if (social == 'twitch') {
            return 'https://www.twitch.tv/' + player.links.twitch
        } else if (social == 'youtube') {
            return player.links.youtube
        }
    }
    return ''
}
function normalize50(percentage) {
    if (percentage < 50) {
        return 0
    }
    return ((percentage - 50) / (100 - 50)) * 100
}
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getEveryRun(numRuns, sortRange) {
    const everyRun = []
    players.slice(0, numRuns).forEach((player, playerIndex) => {
        if (sortCategoryIndex == -1) {
            player.runs.forEach((run, runIndex) => {
                if (run) {
                    if ((sortRange && sortLogic(run, sortRange)) || !sortRange) {
                        everyRun.push({ run: run, playerIndex: playerIndex, categoryIndex: runIndex })
                    }
                }
            })
        } else {
            const run = player.runs[sortCategoryIndex]
            if (run) {
                if ((sortRange && sortLogic(run, sortRange)) || !sortRange) {
                    everyRun.push({ run: run, playerIndex: playerIndex, categoryIndex: sortCategoryIndex })
                }
            }
        }
    })
    return everyRun
}
function categorySpan(category) {
    const className = big5() ? category.difficulty : classNameLogic(category)
    return `<span class='${className}' ${className ? "style='border-radius:5px;padding:0 3px'" : ''}>${category.name}</span>`
}
function scoreGradeSpan(percentage) {
    const grade = getLetterGrade(percentage)
    return `<span class='${grade.className}' style='border-radius:5px;padding:0 5px'>${displayPercentage(percentage)}% ${grade.grade}</span>`
}
function getDateDif(date1, date2) {
    return Math.floor((date1 - date2) / (100 * 60 * 60 * 24) / 10)
}
function toggleVisibility(elem) {
    if (document.getElementById(elem).style.display == '') {
        hide(elem)
    } else {
        show(elem)
        return 1
    }
}
function daysAgo(dateDif) {
    return dateDif == 0 ? 'Today' : dateDif + ` day${dateDif == 1 ? '' : 's'} ago`
}
function show(elem) {
    if (typeof (elem) == 'string') {
        elem = document.getElementById(elem)
    }
    elem.style.display = ''
}
function hide(elem) {
    if (typeof (elem) == 'string') {
        elem = document.getElementById(elem)
    }
    elem.style.display = 'none'
}
function cupheadShot(shot, size, extra) {
    return `<img src="images/cuphead/inventory/weapons/${shot}.png" ${extra ? `class='container'` : ''} ${size ? `style='height:${size}px'` : ''}></img>`
}