function openModal(playerIndex) {
    globalPlayerIndex = playerIndex
    document.getElementById('modal-pages').style.display = ''
    document.addEventListener("keydown", modalKeyPress);
    let player = players[playerIndex]
    let playerLink = player.weblink ? `onclick="window.open('${player.weblink}', '_blank')"` : null;
    let percentage = getPercentage(player.averagePercentage)
    const letterGrade = getLetterGrade(percentage)
    let HTMLContent =
        `<table>
            <tr>
                <td>${getPlayerFlag(player, '20px')}</td>
                <td><h2 ${playerLink} class='${playerLink ? 'clickable' : ''}'>${getPlayerName(player)}</h2></td>
                <td><h3 style='padding: 5px' class='${letterGrade.className}'>${letterGrade.grade}</h3></td>
            </tr>
        </table>`
    document.getElementById('modal-player').innerHTML = HTMLContent
    if (modalIndex == 0) {
        document.getElementById('modal-title').innerText = 'REPORT CARD'
        document.getElementById('modal-body').innerHTML = reportCard(player, playerIndex)
        // modalPages.innerHTML = `<div>&#9664</div> <div>&#9679</div> <div>&#9675</div> <div onclick="modalRight()" class='clickable'>&#9654</div>`
    } else if (modalIndex == 1) {
        document.getElementById('modal-title').innerText = 'GRADE CALCULATOR'
        document.getElementById('modal-body').innerHTML = gradeCalculator(player)
        // modalPages.innerHTML = `<div onclick="modalLeft()" class='clickable'>&#9664</div> <div>&#9675</div> <div>&#9679</div> <div>&#9654</div>`
    } else if (modalIndex == 2) {
        document.getElementById('modal-title').innerText = 'SCORE BREAKDOWN'
        document.getElementById('modal-body').innerHTML = scoreBreakdown(player)
        // modalPages.innerHTML = `<div onclick="modalLeft()" class='clickable'>&#9664</div> <div>&#9675</div> <div>&#9679</div> <div>&#9654</div>`
    }
    HTMLContent = `<div onclick="modalLeft()" class='${modalIndex > 0 ? 'clickable' : ''}'>&#9664</div>`;
    ['a', 'a', 'a'].forEach((dummy, dummyIndex) => {
        if (modalIndex == dummyIndex) {
            HTMLContent += `<div>&#9679</div>`
        } else {
            HTMLContent += `<div>&#9675</div>`
        }
    })
    HTMLContent += `<div onclick="modalRight()" class='${modalIndex < 2 ? 'clickable' : ''}'>&#9654</div>`
    const modalPages = document.getElementById('modal-pages')
    modalPages.innerHTML = HTMLContent
    const modal = document.getElementById("modal");
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    const modalContent = document.getElementById('modal-content')
    modal.style.display = "block";
    modalContent.style.animation = 'slideUp 0.25s ease-out forwards';
}
function getTrophy(place) {
    if (gameID != 'tetris') {
        themeID = gameID == 'cuphead' ? 'jre1dqwn' : 'e87d4p8q'
        if (place) {
            return `<image src='https://www.speedrun.com/static/theme/${themeID}/${place}.png' title='${place}'>`
        }
    }
    return ''
}
function closeModal() {
    playSound('carddown')
    document.removeEventListener("keydown", modalKeyPress);
    const modal = document.getElementById("modal");
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    const modalContent = document.getElementById('modal-content')
    modalContent.style.animation = 'slideDown 0.25s ease-out forwards';
    document.getElementById('modal-pages').style.display = 'none'
    setTimeout(() => {
        modal.style.display = "none";
    }, 200);
}
function reportCard(player) {
    let HTMLContent = `<table><th></th>`
    categories.forEach((category, categoryIndex) => {
        let rowColor = categoryIndex % 2 == 0 ? 'otherRow' : 'background'
        let run = player.runs[categoryIndex]
        let score = run ? getPercentage(run.percentage) : ''
        let letterGrade = getLetterGrade(score)
        let place = run ? player.runs[categoryIndex].place : ''
        let placeText
        if (place == 1) {
            placeText = '1st'
        } else if (place == 2) {
            placeText = '2nd'
        } else if (place == 3) {
            placeText = '3rd'
        }
        image = fullgame ? '' : getImage(category.info.id)
        HTMLContent +=
            `<tr>
                <td>${getTrophy(placeText)}</td>
                <td id='modal-img'>${image}</td>
                <td class='${category.class ? category.class : rowColor}' style='text-align:left'>${category.name}<td>
                <td class='${letterGrade.className}' style='text-align:left'>${letterGrade.grade}<td>
                <td class='${letterGrade.className}'>${score}<td>
            </tr>`
    })
    HTMLContent += `</table><table id='modal-other'>`
    HTMLContent +=
        `<tr>
            <td>Rank:</td>
            <td>${player.rank}</td>
        </tr>`
    if (player.hasAllRuns) {
        HTMLContent +=
            `<tr>
                <td>GPA:</td>
                <td>${getGPA(player.averagePercentage)}</td>
            </tr>`
    }
    HTMLContent += `</table>`
    return HTMLContent
}
function gradeCalculator(player) {
    let HTMLContent = `<table><tr><td></td><td></td>`
    categories.forEach(category => {
        HTMLContent += getCategoryHeader(category)
    })
    // HTMLContent += `</tr><tr><td></td><td>WR</td>`
    // categories.forEach(category => {
    //     const worldRecord = gameID == 'tetris' ? category.runs.runs[0].run.score : category.runs.runs[0].run.times.primary_t
    //     HTMLContent += `<td>${gameID == 'tetris' ? worldRecord : secondsToHMS(worldRecord)}</td>`
    // })
    // HTMLContent += `</tr>`
    grades.slice(0, grades.length - 1).forEach(grade => {
        HTMLContent += `<tr><td class=${grade.className} style='text-align:left'>${grade.grade}</td>
        <td>${grade.threshold}%</td>`
        categories.forEach((category, categoryIndex) => {
            const worldRecord = getWorldRecord(category)
            const gradeTime = reverseScore.includes(category.name) ? worldRecord * (grade.threshold / 100) : worldRecord / (grade.threshold / 100)
            let cellContent = gameID == 'tetris' ? reverseScore.includes(category.name) ? Math.round(gradeTime) : gradeTime.toFixed(2) : secondsToHMS(gradeTime)
            let className = grade.className
            const playerRun = player.runs[categoryIndex]
            if (playerRun) {
                const playerRunTime = gameID == 'tetris' ? playerRun.run.score : playerRun.run.times.primary_t
                const matchingRun = getLetterGrade(getPercentage(playerRun.percentage)).grade == grade.grade
                className = matchingRun ? 'selected' : className
                if (matchingRun) {
                    if (reverseScore.includes(category.name)) {
                        cellContent = playerRunTime > gradeTime ? playerRunTime : cellContent
                    } else {
                        cellContent = playerRunTime < gradeTime ? gameID == 'tetris' ? playerRunTime : secondsToHMS(playerRunTime) : cellContent
                    }
                }
            }
            HTMLContent += `<td class='${className}'>${cellContent}</td>`
        })
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table>`
    return HTMLContent
}
function scoreBreakdown(player) {
    const playerCategories = []
    const missingCategories = []
    let HTMLContent = `<table><tr>`
    categories.forEach((category, categoryIndex) => {
        if (player.runs[categoryIndex]) {
            playerCategories.push(category)
        } else {
            missingCategories.push(category)
        }
    })
    const missingRuns = missingCategories.length > 0
    const numRuns = categories.length - missingCategories.length
    const percentageSum = (player.truePercentageSum * 100).toFixed(1)
    playerCategories.forEach((category, categoryIndex) => {
        HTMLContent += getCategoryHeader(category)
        if (categoryIndex < numRuns) {
            HTMLContent += `<th></th>`
        }
    })
    HTMLContent += `</tr><tr>`
    categories.forEach((category, categoryIndex) => {
        const run = player.runs[categoryIndex]
        const percentage = run ? getPercentage(run.percentage) : 0
        const letterGrade = getLetterGrade(percentage)
        if (run) {
            HTMLContent += `<td class=${letterGrade.className}>${percentage}</td>`
            if (category.name != playerCategories[playerCategories.length - 1].name) {
                HTMLContent += `<td>+</td>`
            } else {
                HTMLContent += numRuns > 1 ? `<td>=${percentageSum}</td>` : ''
            }
        }
    })
    HTMLContent += `</tr></table>`
    if (numRuns > 1) {
        HTMLContent += `<p>${percentageSum} / ${numRuns} = ${(percentageSum / numRuns).toFixed(1)}</p>`
    }
    HTMLContent += missingRuns ? `<h2>Missing Runs</h2>` : ''
    HTMLContent += `<table><tr>`
    missingCategories.forEach(missingCategory => {
        HTMLContent += getCategoryHeader(missingCategory)
    })
    HTMLContent += `</tr></table>`
    HTMLContent += `<p>${player.explanation}</p>`
    const averagePercentage = getPercentage(player.averagePercentage)
    HTMLContent += `<div class='container'><h2 class=${getLetterGrade(averagePercentage).className}>${averagePercentage}</h2></div>`
    return HTMLContent
}
function getCategoryHeader(category) {
    return `<th class='${category.class} ${fullgame ? '' : getColorClass()}' style="${fullgame ? 'width:75px' : ''}">${fullgame ? category.name : getImage(category.info.id)}</th>`
}
window.onclick = function (event) {
    const modal = document.getElementById("modal");
    if (event.target == modal) {
        closeModal()
    }
}
function modalKeyPress() {
    switch (event.key) {
        case 'Escape':
            closeModal();
            break;
        case 'ArrowLeft':
            event.preventDefault();
            modalLeft();
            break;
        case 'ArrowRight':
            event.preventDefault();
            modalRight();
            break;
        case 'ArrowUp':
            event.preventDefault();
            if (globalPlayerIndex > 0) {
                playSound('cardflip')
                globalPlayerIndex--
                openModal(globalPlayerIndex)
            } else {
                playSound('locked')
            }
            break
        case 'ArrowDown':
            event.preventDefault();
            if (globalPlayerIndex < 300 && globalPlayerIndex < players.length) {
                playSound('cardflip')
                globalPlayerIndex++
                openModal(globalPlayerIndex)
            } else {
                playSound('locked')
            }
            break
    }
}
function modalLeft() {
    if (modalIndex > 0) {
        playSound('equip_move')
        modalIndex--
        openModal(globalPlayerIndex)
    } else {
        playSound('locked')
    }
}
function modalRight() {
    if (modalIndex < 2) {
        playSound('equip_move')
        modalIndex++
        openModal(globalPlayerIndex)
    } else {
        playSound('locked')
    }
}