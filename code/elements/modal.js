function openModal(playerIndex) {
    let playerModal = false
    if (typeof playerIndex == 'number') {
        playerModal = true
    }
    showModal = true
    if (mode == 'fullgameILs' || !playerModal) {
        modalIndex = 0
    } else {
        document.getElementById('modal-pages').style.display = ''
        document.addEventListener("keydown", modalKeyPress);
    }
    document.addEventListener('keydown', function (event) {
        if (event.key == 'Escape' && showModal) {
            closeModal()
        }
    });
    const modalTitle = document.getElementById('modal-title')
    const modalBody = document.getElementById('modal-body')
    if (playerModal) {
        globalPlayerIndex = playerIndex
        let player = players[playerIndex]
        if (sortCategoryIndex > -1) {
            const oldIndex = sortCategoryIndex
            sortCategoryIndex = -1
            sortPlayers(players)
            sortCategoryIndex = oldIndex
            player = players[playerIndex]
        }
        let playerLink = player.weblink ? `onclick="window.open('${player.weblink}', '_blank')"` : null;
        let percentage = getPercentage(player.averagePercentage)
        const letterGrade = getLetterGrade(percentage)
        let HTMLContent =
            `<table>
                <tr>
                    <td>${getPlayerFlag(player, 25)}</td>
                    <td><h2 ${playerLink} class='${playerLink ? 'clickable' : ''}'>${getPlayerName(player)}</h2></td>`
        HTMLContent += mode != 'fullgameILs' ? `<td><h3 style='padding: 5px' class='${letterGrade.className}'>${letterGrade.grade}</h3></td>` : ''
        HTMLContent += `<td class='modalBoardTitle' style='padding-left:20px'>${generateBoardTitle(2)}</td>
                </tr>
            </table>`
        document.getElementById('modal-player').innerHTML = HTMLContent
        if (modalIndex == 0) {
            modalTitle.innerText = 'REPORT CARD'
            modalBody.innerHTML = reportCard(player, playerIndex)
        } else if (modalIndex == 1) {
            modalTitle.innerText = 'GRADE CALCULATOR'
            modalBody.innerHTML = gradeCalculator(player)
        } else if (modalIndex == 2) {
            modalTitle.innerText = 'SCORE BREAKDOWN'
            modalBody.innerHTML = scoreBreakdown(player)
        }
        HTMLContent = `<div onclick="modalLeft()" class='${modalIndex > 0 ? 'clickable' : ''}'>&#9664</div>`;
        for (i = 0; i < 3; i++) {
            if (i == modalIndex) {
                HTMLContent += `<div>&#9679</div>`
            } else {
                HTMLContent += `<div>&#9675</div>`
            }
        }
        HTMLContent += `<div onclick="modalRight()" class='${modalIndex < 2 ? 'clickable' : ''}'>&#9654</div>`
        const modalPages = document.getElementById('modal-pages')
        modalPages.innerHTML = HTMLContent
    } else {
        globalPlayerIndex = -1
        modalTitle.innerText = 'COUNTRY'
        modalBody.innerHTML = countryModal(playerIndex)
    }
    const modal = document.getElementById("modal");
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    modal.style.display = "block";
    const modalContent = document.getElementById('modal-content')
    modalContent.style.animation = 'slideUp 0.25s ease-out forwards';
}
function closeModal() {
    showModal = false
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
    if (gameID == 'cuphead' && mode == 'levels' && big5()) {
        let categoryIndex = 0
        while (categoryIndex < categories.length) {
            const category = categories[categoryIndex]
            const numCats = getNumCats(category)
            for (let i = 1; i <= numCats; i++) {
                const run = player.runs[categoryIndex]
                let score = run ? getPercentage(run.percentage) : ''
                let letterGrade = getLetterGrade(score)
                let place = run ? run.place : ''
                HTMLContent += `<tr class='${getRowColor(categoryIndex)}'>`
                if (i == 1) {
                    const height = big5() ? '' : 21
                    HTMLContent += `<th rowspan=${numCats} class='${category.info.id}'>${getImage(category.info.id, height)}</th>`
                }
                const thisCategory = categories[categoryIndex]
                HTMLContent += `<td>${getTrophy(place)}</td>`
                HTMLContent += `<td class='${thisCategory.difficulty}' style='text-align:left'>${difficultyILs ? trimDifficulty(thisCategory.name) : thisCategory.name}</td>`
                if (mode != 'fullgameILs' && !WRmode) {
                    HTMLContent +=
                        `<td class='${letterGrade.className}' style='text-align:left'>${letterGrade.grade}</td>
                        <td class='${letterGrade.className}'>${score}</td>`
                }
                categoryIndex++
            }
            HTMLContent += `</tr>`
        }
    } else {
        categories.forEach((category, categoryIndex) => {
            let run = player.runs[categoryIndex]
            let score = run ? getPercentage(run.percentage) : ''
            let letterGrade = getLetterGrade(score)
            let place = run ? run.place : ''
            let image = ''
            let className = getRowColor(categoryIndex)
            if (mode == 'levels' || mode == 'fullgameILs') {
                image = getImage(category.info.id, 21)
                className = category.info.id
            }
            HTMLContent +=
                `<tr class='${className}'>
                    <td class='background' style='color:white'>${run?.debug ? '*' : ''}${getTrophy(place)}</td>`
            HTMLContent += `<td id='modal-img'>${image}</td>`
            HTMLContent += `<td class='${category.className}' style='text-align:left'>${category.name}</td>`
            if (mode != 'fullgameILs' && !WRmode) {
                HTMLContent +=
                    `<td class='${letterGrade.className}' style='text-align:left'>${letterGrade.grade}</td>
                    <td class='${letterGrade.className}'>${score}</td>`
            }
            HTMLContent += `</tr>`
        })
    }
    HTMLContent += `</table>`
    if (mode != 'fullgameILs') {
        HTMLContent +=
            `<table id='modal-other'><tr>
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
    }
    return HTMLContent
}
function gradeCalculator(player) {
    let HTMLContent = `<table>`
    if (bossILindex == -1) {
        HTMLContent += `<tr><td></td><td></td>`
        if (big4()) {
            HTMLContent += fancyHeader(1, true)
        } else {
            categories.forEach(category => {
                HTMLContent += getCategoryHeader(category)
            })
        }
        HTMLContent += `</tr>`
    }
    if (mode == 'levels' && big5()) {
        HTMLContent += `<tr><td></td><td></td>`
        categories.forEach(category => {
            HTMLContent += getExtraHeader(category)
        })
        HTMLContent += `</tr>`
    }
    grades.slice(0, grades.length - 1).forEach(grade => {
        HTMLContent += `<tr><td class=${grade.className} style='text-align:left'>${grade.grade}</td>
        <td>${grade.threshold}%</td>`
        categories.forEach((category, categoryIndex) => {
            const worldRecord = getWorldRecord(category)
            let gradeTime = reverseScore.includes(category.name) ? worldRecord * (grade.threshold / 100) : worldRecord / (grade.threshold / 100)
            if (gameID == 'cuphead' && mode == 'levels') {
                gradeTime = category.info.time - (category.info.time - worldRecord) * (grade.threshold / 100)
            }
            let cellContent = tetrisCheck(category, gradeTime)
            let className = grade.className
            const playerRun = player.runs[categoryIndex]
            if (playerRun) {
                const playerScore = playerRun.score
                const matchingRun = getLetterGrade(getPercentage(playerRun.percentage)).grade == grade.grade
                className = matchingRun ? 'selected' : className
                if (matchingRun) {
                    cellContent = tetrisCheck(category, playerScore)
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
    const playerRuns = []
    const missingCategories = []
    let HTMLContent = `<table><tr>`
    categories.forEach((category, categoryIndex) => {
        if (player.runs[categoryIndex]) {
            playerCategories.push(category)
            playerRuns.push(player.runs[categoryIndex])
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
    HTMLContent += `</tr>`
    const extra = mode == 'levels' && big5()
    if (extra) {
        HTMLContent += `<tr>`
        playerCategories.forEach((category, categoryIndex) => {
            HTMLContent += getExtraHeader(category)
            if (categoryIndex < numRuns) {
                HTMLContent += `<th></th>`
            }
        })
        HTMLContent += `</tr>`
    }
    HTMLContent += `<tr>`
    playerRuns.forEach((run, runIndex) => {
        const percentage = getPercentage(run.percentage)
        const letterGrade = getLetterGrade(percentage)
        HTMLContent += `<td class=${letterGrade.className}>${percentage}</td>`
        if (runIndex < playerRuns.length - 1) {
            HTMLContent += `<td>+</td>`
        } else {
            HTMLContent += numRuns > 1 ? `<td>=${percentageSum}</td>` : ''
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
    HTMLContent += `</tr>`
    if (extra) {
        HTMLContent += `<tr>`
        missingCategories.forEach(missingCategory => {
            HTMLContent += getExtraHeader(missingCategory)
        })
        HTMLContent += `</tr>`
    }
    HTMLContent += `</table>`
    HTMLContent += `<p>${player.explanation}</p>`
    const averagePercentage = getPercentage(player.averagePercentage)
    HTMLContent += `<div class='container'><h2 class=${getLetterGrade(averagePercentage).className}>${averagePercentage}</h2></div>`
    return HTMLContent
}
function getCategoryHeader(category) {
    const colorClass = mode == 'levels' ? getColorClass() : ''
    const style = mode == 'fullgame' ? 'width:75px' : ''
    const cellContent = mode == 'fullgame' ? category.name : getImage(category.info.id)
    return `<th class='${category.className} ${colorClass}' style="${style}">${cellContent}</th>`
}
function getExtraHeader(category) {
    const colorClass = category.difficulty
    const style = 'width:45px'
    const cellContent = trimDifficulty(category.name)
    return `<th class='${category.className} ${colorClass}' style="${style}">${cellContent}</th>`
}
function countryModal(countryName) {
    globalCountryName = countryName
    const country = countries[countryName]
    let HTMLContent = `<table><tr>
    <td>${getFlag(country.code, country.name, 25)}</td>
    <td><h2>${countryName}</h2></td>`
    HTMLContent += `<td class='modalBoardTitle' style='padding-left:20px'>${generateBoardTitle(1)}</td>`
    HTMLContent += `</tr></table>`
    document.getElementById('modal-player').innerHTML = HTMLContent
    playersCopy = [...country.players].slice(0, 100)
    sortPlayers(playersCopy)
    return `<div class='container'>${playersTable(playersCopy)}</div>`
}
window.onclick = function (event) {
    const modal = document.getElementById("modal");
    if (event.target == modal) {
        // if (globalCountryName) {
        //     playSound('carddown')
        //     openModal(globalCountryName)
        // } else {
        closeModal()
        // }
    }
}
function modalKeyPress() {
    switch (event.key) {
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
            if (globalPlayerIndex < 300 && globalPlayerIndex < players.length - 1) {
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