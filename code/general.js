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
        return `.<span style='font-size:75%'>${ms.toString().padStart(padding, '0')}</span>`
    }
    return ''
}
function convertToSeconds(time) {
    const [minutes, seconds] = time.split(":").map(Number);
    return minutes * 60 + seconds;
}
function getGPA(value) {
    const gpa = (value / 100 * 4).toString().slice(0, 4)
    return Math.floor(gpa) + displayDecimals(gpa, true)
}
function getPercentage(value) {
    if (value) {
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
function displayLetterGrade(percentage) {
    const grade = getLetterGrade(percentage)
    return `<div style='padding:4px;margin:0 5px;border-radius:5px;min-width:20px;text-align:center' class='${grade.className}'>${grade.grade}</div>`
}
function displayLetterScore(percentage) {
    const grade = getLetterGrade(percentage)
    return `<div style='font-size:120%;padding:3px;margin:0 5px;border-radius:5px;min-width:50px;text-align:center' class='${grade.className}'>${displayPercentage(percentage)}</div>`
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
    if (mode == 'fullgameILs') {
        return fullgameILsCategory.className
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
        elem.style.display = 'none'
    })
    if (gameID == 'cuphead') {
        if (mode == 'levels') {
            document.getElementById('ILsSection_cuphead').style.display = ''
        }
        if (mode == 'fullgameILs') {
            document.getElementById('fullgameILsSection').style.display = ''
        }
    }
    if (['cuphead', 'sm64'].includes(gameID) && mode == 'fullgame') {
        document.getElementById('fullgameCategoriesSection').style.display = ''
    }
    if (gameID == 'sm64' && mode == 'levels') {
        document.getElementById('ILsSection_sm64').style.display = ''
    }
    document.getElementById(page + 'Tab').style.display = ''
    buttonClick(page + 'Button', 'tabs', 'active2')
    if (gameID == 'cuphead' && mode == 'levels' || mode == 'fullgameILs') {
        document.getElementById('checkbox_hp').checked = true
    }
    if (page != 'leaderboard') {
        document.getElementById('checkbox_isolate').checked = false
        isolated = false
    }
    const optionsButton = document.getElementById('optionsButton')
    if (['sort', 'featured'].includes(page) && gameID != 'tetris' && !(page == 'sort' && mode == 'fullgameILs')) {
        optionsOn(true)
        optionsButton.style.display = 'none'
    } else {
        if (mode == 'fullgameILs' && ['leaderboard', 'WRs', 'sort'].includes(page)) {
            if (page == 'sort') {
                document.getElementById('dropdown_sortCriteria').value = 'player'
            }
            optionsButton.style.display = 'none'
        } else {
            optionsButton.style.display = ''
        }
        optionsOff()
    }
    const WRsCupheadILsOptions = document.getElementById('WRsCupheadILsOptions')
    if (gameID == 'cuphead' && mode == 'levels' || mode == 'fullgameILs') {
        WRsCupheadILsOptions.style.display = ''
    } else {
        WRsCupheadILsOptions.style.display = 'none'
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
    if (['charts', 'map', 'sort'].includes(page) || (isolated && !(mode == 'fullgameILs' && sortCategoryIndex == -1)) || (page == 'featured' && mode != 'fullgameILs')) {
        categoriesSection.style.display = ''
        if (sortCategoryIndex == -1) {
            categoriesSection.classList.remove('sticky')
        } else {
            categoriesSection.classList.add('sticky')
        }
    } else {
        categoriesSection.style.display = 'none'
    }
    setBoardTitle()
    updateCategories()
}
function pageAction() {
    const pageTitle = document.getElementById('pageTitle')
    switch (page) {
        case 'leaderboard':
            generateLeaderboard();
            pageTitle.innerHTML = ''
            break;
        case 'WRs':
            generateWRs();
            pageTitle.innerHTML = fontAwesomeText('trophy', 'World Records')
            break;
        case 'featured':
            generateFeatured();
            pageTitle.innerHTML = fontAwesomeText('star', 'Featured')
            break;
        case 'charts':
            refreshCharts();
            pageTitle.innerHTML = fontAwesomeText('bar-chart', 'Charts')
            break;
        case 'map':
            generateMap();
            pageTitle.innerHTML = fontAwesome('flag') + `&nbsp;&nbsp;Map`
            break;
        case 'sort':
            generateSort();
            pageTitle.innerHTML = fontAwesome('sort-amount-asc') + `&nbsp;&nbsp;Sort`
            break;
        case 'runRecap':
            if (mode == 'fullgameILs') {
                updateRunRecapAction()
                pageTitle.innerHTML = fontAwesome('history') + `&nbsp;&nbsp;Run Recap`
            } else {
                showTab('leaderboard')
            }
            break
    }
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
    let HTMLContent = `<img src="https://www.speedrun.com/images/flags/${countryCode}.png" class='container' style="height:${size}px" title="${countryName}" alt=''></img>`
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
function toggleOptions() {
    if (options) {
        playSound('move')
        optionsOff()
    } else {
        optionsOn()
    }
}
function optionsOn(shh) {
    if (!((mode == 'fullgameILs' && ['leaderboard', 'WRs', 'sort'].includes(page)) || ['WRs', 'sort'].includes(page) && gameID == 'tetris')) {
        if (!shh) {
            playSound('move')
        }
        options = true
        const optionsElem = document.querySelectorAll('.options')
        const optionsButton = document.getElementById('optionsButton')
        optionsElem.forEach(elem => {
            elem.style.display = ''
        })
        optionsButton.innerHTML = fontAwesome('close')
    } else {
        playSound('locked')
    }
}
function optionsOff() {
    options = false
    const optionsElem = document.querySelectorAll('.options')
    const optionsButton = document.getElementById('optionsButton')
    optionsElem.forEach(elem => {
        elem.style.display = 'none'
    })
    optionsButton.innerHTML = fontAwesome('ellipsis-h')
}
function setMode(newMode) {
    mode = newMode
    url.searchParams.set('mode', mode);
    window.history.pushState({}, '', url);
    buttonClick(mode + 'Button', 'modeSelection', 'active2')
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
function addOpacityToCSSVar(color) {
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
function hexToRgb(hex) {
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
    if (mode == 'fullgameILs') {
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
function getNumCats(category) {
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
    HTMLContent += `<td class='${placeClass(player.rank)}'>${player.rank}</td>`
    if (gameID != 'tetris') {
        if (document.getElementById('checkbox_flags').checked) {
            HTMLContent += `<td>${getPlayerFlag(player, 12)}</td>`
        }
        if (document.getElementById('checkbox_icons').checked) {
            HTMLContent += `<td>${getPlayerIcon(player, 18)}</td>`
        }
    }
    HTMLContent += `<td onclick="playSound('cardup');openModal(${player.rank - 1})" class='clickable' style='text-align:left;font-weight: bold;padding-right:5px'>${getPlayerName(player)}</td>`
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
            gameSelect.style.display = "none";
        }, 200);
        playSound('carddown')
    } else {
        showGameSelect = true
        gameSelect.classList.remove('hidden')
        gameSelect.style.display = ''
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
    return Math.round(category.hp / score)
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
    return `<span class='${category.className}' ${category.className ? "style='border-radius:5px;padding:0 3px'" : ''}>${category.name}</span>`
}
function scoreGradeSpan(percentage) {
    const grade = getLetterGrade(percentage)
    return `<span class='${grade.className}' style='border-radius:5px;padding:0 5px'>${displayPercentage(percentage)}% ${grade.grade}</span>`
}
function getDateDif(date1, date2) {
    return (date1 - date2) / (100 * 60 * 60 * 24) / 10
}
function toggleOptionsNew(name) {
    playSound('move')
    const visible = toggleVisibility(name)
    const button = document.getElementById(name + 'Button')
    button.innerHTML = visible ? fontAwesome('close') : fontAwesome('ellipsis-h')
}
function toggleVisibility(elem) {
    const element = document.getElementById(elem)
    if (element.style.display == '') {
        element.style.display = 'none'
    } else {
        element.style.display = ''
        return 1
    }
}