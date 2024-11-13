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
function getGPA(value) {
    return (value * 4).toString().slice(0, 4)
}
function getPercentage(value) {
    return parseFloat(value * 100).toFixed(1)
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
function getImage(image) {
    return `<image src='images/${gameID}/${image}.png'`
}
function getColorClass() {
    return gameID == 'cuphead' ? DLCnoDLC == 0 ? 'cuphead' : 'dlc' : ''
}
function getScore(category, wrTime, runTime) {
    if (gameID == 'cuphead' && !fullgame) {
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
function showTab(tab) {
    page = tab
    window.history.pushState(null, null, '#' + tab);
    document.querySelectorAll('.tabs').forEach(elem => {
        elem.style.display = 'none'
    })
    document.getElementById(tab + 'Tab').style.display = ''
    document.querySelectorAll('#tabs button').forEach(elem => {
        elem.classList.remove('active2')
    })
    document.getElementById(tab + 'Button').classList.add('active2')
    tab == 'charts' ? refreshCharts() : ''
    if (tab == 'stats') {
        allRuns = true
        getFullGame()
    }
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
    let HTMLContent = `<img src="https://www.speedrun.com/images/flags/${countryCode}.png" height='${size}' title="${countryName}" alt=''></img>`
    return HTMLContent
}
function buttonClick(pressed, unpressed, className) {
    const button1 = document.getElementById(pressed)
    const button2 = document.getElementById(unpressed)
    button1.classList.add(className)
    button2.classList.remove(className)
}
function getWorldRecord(category) {
    return gameID == 'tetris' ? category.runs.runs[0].run.score : category.runs.runs[0].run.times.primary_t
}