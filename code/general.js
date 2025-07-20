function getLetterGrade(percentage) {
    for (let grade of grades) {
        if (percentage >= grade.threshold) {
            return grade;
        }
    }
    return grades[grades.length - 1]
}
function secondsToHMS(seconds, exception, raw) {
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
        HTMLContent += displayDecimals(seconds, null, raw)
    }
    return HTMLContent
}
function displayDecimals(value, exception, raw) {
    let msString = value.toString().split('.')[1] || '';
    const twoDecimals = ['cuphead', 'mtpo', 'ssbm', 'ssb64'].includes(gameID) || exception;
    const length = twoDecimals ? 2 : 3;
    msString = msString.padEnd(3, '0').slice(0, length);
    if (parseInt(msString)) {
        return raw ? '.' + msString : `.<span style='font-size:75%'>${msString}</span>`;
    }
    return '';
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
    if (['cuphead', 'smb3', 'sm64', 'ssbm'].includes(gameID)) {
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
    const extension = gameID == 'spo' ? 'webp' : 'png'
    const height = heightParam ? heightParam : 36
    return `<img src='images/levels/${gameID}/${image}.${extension}' style='height:${height}px;width:auto'>`
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
    // if ((gameID == 'cuphead' && mode == 'levels')) {
    //     if (runTime > category.info.time) {
    //         percentage = 0
    //     } else {
    //         percentage = (category.info.time - runTime) / (category.info.time - wrTime);
    //     }
    // } else if (category.reverse) {
    //     percentage = runTime / wrTime
    // }
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
        return `<img src='images/trophy/${['cuphead', 'sm64', 'titanfall_2', 'ssb64', 'ssbm'].includes(gameID) ? gameID + '/' : ''}${place}.png' title='${placeText}' style='height:14px'>`
    }
    return ''
}
function trophyCase(object) {
    let HTMLContent = object.count1 > 0 ? `<td class='trophyCase' style='text-align:left'>${getTrophy(1)}<span>${object.count1 > 1 ? object.count1 : ''}</span></td>` : '<td></td>'
    HTMLContent += object.count2 > 0 ? `<td class='trophyCase' style='text-align:left'>${getTrophy(2)}<span>${object.count2 > 1 ? object.count2 : ''}</span></td>` : '<td></td>'
    HTMLContent += object.count3 > 0 ? `<td class='trophyCase' style='text-align:left'>${getTrophy(3)}<span>${object.count3 > 1 ? object.count3 : ''}</span></td>` : '<td></td>'
    return HTMLContent
}
const fontAwesomeSet = {
    leaderboard: ['Leaderboard', 'home'],
    leaderboards: ['Leaderboards', 'cubes'],
    WRs: ['World Records', 'trophy',],
    featured: ['Featured', 'star'],
    charts: ['Charts', 'bar-chart'],
    map: ['Map', 'flag'],
    sort: ['Sort', 'sort-amount-asc'],
    runRecap: ['Run Recap', 'history'],
    commBest: ['Comm Best Splits', 'tasks'],
    spotlight: ['Daily Spotlight', 'user-circle-o']
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
function getFlag(countryCode, countryName, size) {
    let HTMLContent = `<img src="https://www.speedrun.com/images/flags/${countryCode}.png" style="height:${size}px" title="${countryName}" alt=''></img>`
    return HTMLContent
}
function buttonClick(pressed, unpressed, className) {
    document.querySelectorAll('#' + unpressed + ' .button').forEach(button => {
        button.classList.remove(className)
    })
    const button = document.getElementById(pressed)
    button?.classList.add(className)
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
    sortPlayers(players)
    action()
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
        return gameID == 'tetris' ? category.reverse ? Math.round(score).toLocaleString() : (score / 1).toFixed(2) : secondsToHMS(score)
    }
    return ''
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
function getEveryRun(numRuns, sortRange, extra) {
    const everyRun = []
    players.slice(0, numRuns).forEach((player, playerIndex) => {
        if (extra && mode == 'commBestILs') {
            if (player.extra && commBest) {
                everyRun.push({ run: player.extra, playerIndex: playerIndex })
            }
        } else {
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
function daysAgo(dateDif) {
    dateDif = dateDif.toLocaleString()
    return dateDif == 0 ? 'Today' : dateDif + ` day${dateDif == 1 ? '' : 's'} ago`
}
function toggleVisibility(elem) {
    const element = document.getElementById(elem)
    if (element) {
        if (document.getElementById(elem).style.display == '') {
            hide(elem)
        } else {
            show(elem)
            return 1
        }
    }
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
function toggleSection(section) {
    playSound('move')
    const toggleButton = document.getElementById(section + 'Button')
    if (toggleButton.dataset.flag == 'true') {
        toggleButton.dataset.flag = 'false'
        hide(section)
        toggleButton.innerHTML = fontAwesome('bars')
    } else {
        toggleButton.dataset.flag = 'true'
        show(section)
        toggleButton.innerHTML = fontAwesome('close')
    }
}
function cupheadShot(shot, size, extra) {
    if (shot) {
        return `<img src="images/cuphead/inventory/weapons/${shot}.png" ${extra ? `class='container'` : ''} ${size ? `style='height:${size}px'` : ''}></img>`
    }
    return ''
}
function getDelta(delta) {
    const negative = delta < 0
    delta = Math.abs(delta)
    return (negative ? '-' : '+') + (delta >= 60 ? secondsToHMS(delta) : delta + 's')
}
function redGreen(delta) {
    return 'color:' + (delta > 0 ? 'red' : 'limegreen')
}