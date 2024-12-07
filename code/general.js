function getLetterGrade(percentage) {
    for (let grade of grades) {
        if (percentage >= grade.threshold) {
            return grade;
        }
    }
    return grades[grades.length - 1]
}
function secondsToHMS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}
function convertToSeconds(time) {
    const [minutes, seconds] = time.split(":").map(Number);
    return minutes * 60 + seconds;
}
function getGPA(value) {
    return (value * 4).toString().slice(0, 4)
}
function getPercentage(value, fixed) {
    const fixedValue = fixed != null ? fixed : 2
    if (value) {
        if (fixed == 0) {
            return parseInt(value * 100)
        }
        return parseFloat(value * 100).toFixed(fixedValue)
    }
    return ''
}
function displayPercentage(percentage) {
    return percentage ? percentage.split('.')[0] + `<span style='font-size:70%'>.${percentage.split('.')[1]}</span>` : ''
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
function getClassColor(className) {
    var element = document.querySelector('.' + className);
    var color = window.getComputedStyle(element).backgroundColor;
    return color;
}
function playSound(sfx) {
    if (gameID == 'cuphead') {
        const sound = document.getElementById(sfx)
        sound.currentTime = 0
        sound.volume = 0.4
        sound.play()
    }
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
function getScore(category, wrTime, runTime) {
    if (gameID == 'cuphead' && mode == 'levels') {
        if (runTime > category.info.time) {
            return 0
        }
        return (category.info.time - runTime) / (category.info.time - wrTime);
    }
    if (reverseScore.includes(category.name)) {
        return runTime / wrTime
    }
    return wrTime / runTime
}
function getTrophy(place) {
    if (gameID != 'tetris') {
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
            return `<img src='images/trophy/${gameID}/${place}.png' title='${placeText}' style='height:14px'>`
        }
    }
    return ''
}
function trophyCase(object) {
    let HTMLContent = object.count1 > 0 ? `<td class='trophyCase' style='text-align:left'>${getTrophy(1)}<span>${object.count1 > 1 ? object.count1 : ''}</span></td>` : '<td></td>'
    HTMLContent += object.count2 > 0 ? `<td class='trophyCase' style='text-align:left'>${getTrophy(2)}<span>${object.count2 > 1 ? object.count2 : ''}</span></td>` : '<td></td>'
    HTMLContent += object.count3 > 0 ? `<td class='trophyCase' style='text-align:left'>${getTrophy(3)}<span>${object.count3 > 1 ? object.count3 : ''}</span></td>` : '<td></td>'
    return HTMLContent
}
function showTab(tab) {
    page = tab
    window.history.pushState(null, null, '#' + page);
    hideTabs()
    document.querySelectorAll('.hide').forEach(elem => {
        elem.style.display = 'none'
    })
    if (gameID == 'cuphead') {
        if (mode == 'levels') {
            document.getElementById('ILsSection').style.display = ''
        }
        if (mode == 'fullgameILs') {
            document.getElementById('fullgameILsSection').style.display = ''
        }
    }
    document.getElementById(page + 'Tab').style.display = ''
    buttonClick(page + 'Button', 'tabs', 'active2')
    // if (tab == 'leaderboard' && sortCategoryIndex > -1 && !isolated) {
    //     document.getElementById('checkbox_isolate').checked = true
    // }
    if (page != 'leaderboard') {
        document.getElementById('checkbox_isolate').checked = false
        isolated = false
    }
    const optionsButton = document.getElementById('optionsButton')
    if (['sort'].includes(page) && gameID != 'tetris' && !(page == 'sort' && mode == 'fullgameILs')) {
        optionsOn(true)
        optionsButton.style.display = 'none'
    } else {
        if (mode == 'fullgameILs' && ['info', 'sort'].includes(page)) {
            if (page == 'sort') {
                document.getElementById('dropdown_sortCriteria').value = 'player'
            }
            optionsButton.style.display = 'none'
        } else {
            optionsButton.style.display = ''
        }
        optionsOff()
    }
    action()
}
function openLink(url) {
    return `window.open('${url}', '_blank')`
}
function getPlayerName(player) {
    let colorFrom = '#FFFFFF'
    let colorTo = '#FFFFFF'
    if (player['name-style']) {
        if (player['name-style'].color) {
            colorFrom = player['name-style'].color.dark
            colorTo = player['name-style'].color.dark
        } else {
            colorFrom = player['name-style']['color-from'].dark
            colorTo = player['name-style']['color-to'].dark
        }
    }
    if (player.name.charAt(0) == '[') {
        const match = player.name.match(/\(([^)]+)\)/)
        player.name = match ? match[1] : player.name.slice(4)
    }
    const HTMLContent = `<span style='background: linear-gradient(90deg, ${colorFrom}, ${colorTo});-webkit-background-clip: text;color: transparent;'>${player.name}</span>`
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
    if (!((mode == 'fullgameILs' && ['leaderboard', 'info', 'sort'].includes(page)) || ['info', 'sort'].includes(page) && gameID == 'tetris')) {
        if (!shh) {
            playSound('move')
        }
        options = true
        const optionsElem = document.querySelectorAll('.options')
        const optionsButton = document.getElementById('optionsButton')
        optionsElem.forEach(elem => {
            elem.style.display = ''
        })
        optionsButton.innerHTML = '&#10005'
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
    optionsButton.innerHTML = `<i class="fa fa-ellipsis-h"></i>`
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
    if (mode == 'fullgameILs' || WRmode) {
        numCols = 1
    }
    return numCols
}
function action() {
    parseCheckboxes()
    if (page == 'leaderboard') {
        generateLeaderboard()
    } else if (page == 'charts') {
        refreshCharts()
    } else if (page == 'map') {
        generateMap()
    } else if (page == 'info') {
        generateInfo()
    } else if (page == 'sort') {
        generateSort()
    }
    if (page != 'map') {
        countries = {}
        document.getElementById('world-map').innerHTML = ''
    }
    const categoriesSection = document.getElementById('categoriesSection')
    if (['charts', 'map'].includes(page) || isolated) {
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
function showDefault() {
    playSound('equip_move')
    sortCategoryIndex = -1
    document.getElementById('checkbox_isolate').checked = false
    sortPlayers(players)
    action()
}
function getVideoLink(run) {
    if (run.videos) {
        return openLink(run.videos.links[run.videos.links.length - 1].uri)
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
        return gameID == 'tetris' ? reverseScore.includes(category.name) ? Math.round(score) : (score / 1).toFixed(2) : secondsToHMS(score)
    }
    return ''
}
function getPlayerDisplay(player) {
    return `<td class='${placeClass(player.rank)}'>${player.rank}</td>
    <td>${getPlayerFlag(player, 13)}</td>
    <td onclick="playSound('cardup');openModal(${player.rank - 1})" class='clickable' style='text-align:left;font-weight: bold;padding-right:5px'>${getPlayerName(player)}</td>`
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