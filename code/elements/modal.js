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
    }
    document.addEventListener('keydown', function (event) {
        if (event.key == 'Escape' && showModal) {
            closeModal()
        }
    });
    const modalTitle = document.getElementById('modal-title')
    const modalBody = document.getElementById('modal-body')
    if (playerModal) {
        document.addEventListener("keydown", modalKeyPress);
        globalPlayerIndex = playerIndex
        let player = players[playerIndex]
        if (sortCategoryIndex > -1) {
            const oldIndex = sortCategoryIndex
            sortCategoryIndex = -1
            sortPlayers(players)
            sortCategoryIndex = oldIndex
            player = players[playerIndex]
        }
        const percentage = getPercentage(player.score)
        const grade = getLetterGrade(percentage)
        let HTMLContent = `<div class='container' style='padding-top:8px'>`
        HTMLContent += gameID != 'tetris' ? `<div style='width:50px;height:50px;padding-right:10px'>${getPlayerIcon(player)}</div>` : ''
        HTMLContent += `<div>`
        HTMLContent += `<div class='container' style='padding-bottom:2px'>`
        HTMLContent += `<h2 style='margin:0'>${getPlayerName(player)}</h2>`
        HTMLContent += mode != 'fullgameILs' ? `<div style='padding-left:8px'><h3 style='padding:3px;margin:0 5px;border-radius:5px' class='${grade.className}'>${grade.grade}</h3></div>` : ''
        HTMLContent += `</div>`
        if (player.links) {
            HTMLContent += `<div class='container' style='gap:5px;justify-content:flex-start'>`
            const flag = getPlayerFlag(player, 12)
            HTMLContent += `<div>${flag}</div>`
            HTMLContent += flag ? `<div class='container' style='width:10px;margin:0'>&#8226;</div>` : ''
            const socials = ['src', 'twitch', 'youtube']
            socials.forEach(social => {
                const anchor = getAnchor(getSocial(player, social))
                HTMLContent += anchor ? `${anchor}<img src='images/external/${social}.png' class='clickable container' style='height:16px;width:auto'>` : ''
            })
            HTMLContent += `</div>`
        }
        HTMLContent += `</div>`
        const boardTitle = generateBoardTitle(2)
        HTMLContent += boardTitle ? `<div class='modalBoardTitle' style='padding-left:20px'>${boardTitle}</div>` : ''
        HTMLContent += `</div>`
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
    let HTMLContent = `<table>`
    if (gameID == 'cuphead' && mode == 'levels' && big5()) {
        let categoryIndex = 0
        while (categoryIndex < categories.length) {
            const category = categories[categoryIndex]
            const numCats = getNumCats(category)
            for (let i = 1; i <= numCats; i++) {
                const run = player.runs[categoryIndex]
                const percentage = getPercentage(run?.percentage)
                const grade = getLetterGrade(percentage)
                const place = run?.place
                HTMLContent += `<tr class='${getRowColor(categoryIndex)}'>`
                if (i == 1) {
                    const height = big5() ? '' : 21
                    HTMLContent += `<th rowspan=${numCats} class='${category.info.id}'>${getImage(category.info.id, height)}</th>`
                }
                const thisCategory = categories[categoryIndex]
                HTMLContent += `<td>${getTrophy(place)}</td>`
                HTMLContent += `<td class='${thisCategory.difficulty}' style='text-align:left'>${difficultyILs ? trimDifficulty(thisCategory.name) : thisCategory.name}</td>`
                if (run) {
                    HTMLContent +=
                        `<td class='${grade.className}' style='text-align:left'>${grade.grade}</td>
                        <td class='${grade.className}'>${displayPercentage(percentage)}</td>`
                }
                categoryIndex++
            }
            HTMLContent += `</tr>`
        }
    } else {
        categories.forEach((category, categoryIndex) => {
            let run = player.runs[categoryIndex]
            let percentage = run ? getPercentage(run.percentage) : ''
            let grade = getLetterGrade(percentage)
            let place = run ? run.place : ''
            let image = ''
            let className = getRowColor(categoryIndex)
            if (category.info) {
                image = getImage(category.info.id, 21)
                className = category.info.id
            }
            HTMLContent +=
                `<tr class='${className}'>
                    <td class='background' style='color:white;padding-right:3px;text-align:right'>${run?.debug ? '*' : ''}${getTrophy(place)}</td>`
            HTMLContent += image ? `<td id='modal-img'>${image}</td>` : ''
            HTMLContent += `<td class='${category.className}' style='text-align:left'>${category.name}</td>`
            if (run && mode != 'fullgameILs') {
                HTMLContent +=
                    `<td class='${grade.className}' style='text-align:left'>${grade.grade}</td>
                    <td class='${grade.className}'>${displayPercentage(percentage)}</td>
                    <td class='${category.className}'>${tetrisCheck(category, run.score)}</td>`
            }
            HTMLContent += `</tr>`
        })
    }
    HTMLContent += `</table>`
    if (mode != 'fullgameILs') {
        HTMLContent +=
            `<table style='padding: 5px 0'><tr>
            <td>Rank:</td>
            <td>${player.rank}</td>
        </tr>`
        if (player.hasAllRuns) {
            HTMLContent +=
                `<tr>
                <td>GPA:</td>
                <td>${getGPA(player.score)}</td>
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
    const percentageSum = (player.truePercentageSum * 100).toFixed(1)
    HTMLContent += `<tr>`
    playerRuns.forEach((run, runIndex) => {
        const percentage = getPercentage(run.percentage)
        const letterGrade = getLetterGrade(percentage)
        HTMLContent += `<td class=${letterGrade.className}>${displayPercentage(percentage)}</td>`
        if (runIndex < playerRuns.length - 1) {
            HTMLContent += `<td>+</td>`
        } else {
            HTMLContent += numRuns > 1 ? `<td>=${percentageSum}</td>` : ''
        }
    })
    HTMLContent += `</tr></table>`
    if (numRuns > 1) {
        HTMLContent += `<p>${percentageSum} / ${numRuns} = ${displayPercentage(getPercentage(player.truePercentageSum / numRuns))}</p>`
    }
    HTMLContent += missingRuns ? `<h2 class='container' style='padding:10px'>Missing Runs</h2>` : ''
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
    const score = getPercentage(player.score)
    HTMLContent += `<div class='container'><h2 class='${getLetterGrade(score).className}' style='padding:5px;border-radius:5px'>${displayPercentage(score)}</h2></div>`
    return HTMLContent
}
function getCategoryHeader(category) {
    const colorClass = mode == 'levels' ? getColorClass() : ''
    const style = category.info ? '' : 'width:80px'
    const cellContent = category.info ? getImage(category.info.id) : category.name
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
function modalKeyPress() {
    switch (event.key) {
        case 'ArrowLeft':
            event.preventDefault();
            if (mode != 'fullgameILs') {
                modalLeft();
            }
            break;
        case 'ArrowRight':
            event.preventDefault();
            if (mode != 'fullgameILs') {
                modalRight()
            }
            break;
        case 'ArrowUp':
            event.preventDefault();
            if (globalPlayerIndex > 0 && sortCategoryIndex == -1 && page == 'leaderboard') {
                playSound('cardflip')
                globalPlayerIndex--
                openModal(globalPlayerIndex)
            } else {
                playSound('locked')
            }
            break
        case 'ArrowDown':
            event.preventDefault();
            if (globalPlayerIndex < 300 && globalPlayerIndex < players.length - 1 && sortCategoryIndex == -1 && page == 'leaderboard') {
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