function openModal(param, sound) {
    if (sound == 'up') {
        playSound('cardup')
    } else if (sound == 'move') {
        playSound('equip_move')
    } else if (sound == 'flip') {
        playSound('cardflip')
    }
    modalSliders = false
    let playerModal = false
    if (typeof param == 'number') {
        playerModal = true
    }
    showModal = true
    if (gameID == 'tetris') {
        numModalPages = 2
    } else if (mode == 'fullgameILs') {
        numModalPages = 1
    } else {
        numModalPages = 3
    }
    if (modalIndex > numModalPages) {
        modalIndex = 0
    }
    if (!playerModal) {
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
    const modalPlayer = document.getElementById('modal-player')
    modalPlayer.innerHTML = ''
    if (playerModal) {
        document.addEventListener("keydown", modalKeyPress);
        globalPlayerIndex = param
        let player = players[globalPlayerIndex]
        if (sortCategoryIndex > -1) {
            const oldIndex = sortCategoryIndex
            sortCategoryIndex = -1
            sortPlayers(players)
            sortCategoryIndex = oldIndex
            player = players[globalPlayerIndex]
        }
        let HTMLContent = `<div class='container' style='padding-top:8px'>`
        HTMLContent += gameID != 'tetris' ? `<div style='padding-right:10px'>${getPlayerIcon(player, 50)}</div>` : ''
        HTMLContent += `<div>`
        HTMLContent += `<div class='container' style='padding-bottom:2px'>`
        HTMLContent += `<div style='font-size:140%;margin:0'>${getPlayerName(player)}</div>`
        HTMLContent += mode != 'fullgameILs' ? `<div style='padding-left:8px'>${displayLetterGrade(player.score)}</div>` : ''
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
        modalPlayer.innerHTML = HTMLContent
        let modalPageNames = ['reportCard', 'runDetails', 'gradeTable', 'scoreBreakdown']
        if (mode == 'fullgameILs') {
            modalPageNames.slice(0, 2)
        }
        if (gameID == 'tetris') {
            modalPageNames.splice(1, 1)
        }
        const modalPage = modalPageNames[modalIndex]
        if (modalPage == 'reportCard') {
            modalTitle.innerText = 'REPORT CARD'
            modalBody.innerHTML = reportCard(player)
        } else if (modalPage == 'runDetails') {
            modalTitle.innerText = 'RUN DETAILS'
            modalBody.innerHTML = runDetails(player)
        } else if (modalPage == 'gradeTable') {
            modalTitle.innerText = 'GRADE TABLE'
            modalBody.innerHTML = gradeTable(player)
        } else if (modalPage == 'scoreBreakdown') {
            modalTitle.innerText = 'SCORE BREAKDOWN'
            modalBody.innerHTML = scoreBreakdown(player)
        }
        HTMLContent = `<div onclick="modalLeft()" class='clickable'>&#9664</div>`;
        for (let i = 0; i <= numModalPages; i++) {
            HTMLContent += `<div style='gap:10px'>`
            if (i == modalIndex) {
                HTMLContent += `<i class="fa fa-circle"></i>`
            } else {
                HTMLContent += `<i class="fa fa-circle-o"></i>`
            }
            HTMLContent += `</div>`
        }
        HTMLContent += `<div onclick="modalRight()" class='clickable'>&#9654</div>`
        const modalPages = document.getElementById('modal-pages')
        modalPages.innerHTML = HTMLContent
    } else if (param == 'info') {
        globalPlayerIndex = -1
        modalTitle.innerText = 'INFO'
        modalBody.innerHTML = modalInfo()
    } else if (param == 'runRecap') {
        modalTitle.innerText = 'RUN RECAP'
        modalBody.innerHTML = modalRunRecap()
    } else {
        globalPlayerIndex = -1
        modalTitle.innerText = 'COUNTRY'
        modalBody.innerHTML = countryModal(param)
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
function scoreFromGrade(category, percentage) {
    const worldRecord = getWorldRecord(category)
    let score = reverseScore.includes(category.name) ? worldRecord * (percentage / 100) : worldRecord / (percentage / 100)
    if (gameID == 'cuphead' && mode == 'levels') {
        score = category.info.time - (category.info.time - worldRecord) * (percentage / 100)
    }
    return score
}
function fetchYouTube(videoID) {
    return fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoID}&key=${API_KEY}&part=snippet,statistics&fields=items(snippet,statistics)`)
        .then(response => response.json())
        .then(data => {
            return data.items[0]
        })
}
function runDetails(player) {
    let HTMLContent = `<div class='container'><table>`
    player.runs.forEach((run, runIndex) => {
        if (run) {
            HTMLContent += `<tr>`
            const link = getVideoLink(run)
            if (link?.includes('you')) {
                let videoID = link.split('/')[link.split('/').length - 1].split('"')[0]
                if (link.includes('?') && !link.includes('watch?')) {
                    videoID = videoID.split('?')[0]
                }
                if (videoID.includes('=')) {
                    videoID = videoID.split('=')[1].split('&')[0]
                }
                HTMLContent += `<td id='modal_title_${runIndex}' style='text-align:center;max-width:200px;white-space: normal;padding-right:15px'></td>`
                HTMLContent += `<td>${getAnchor(link)}<img src='https://img.youtube.com/vi/${videoID}/mqdefault.jpg' class='clickable' style='width:160px;height:90px'></td>`
                HTMLContent += `<td id='modal_stats_${runIndex}' style='text-align:right'></td>`
                fetchYouTube(videoID).then(data => {
                    if (data) {
                        let innerHTMLContent = `<div class='container'><table>`
                        const viewCount = data.statistics.viewCount
                        innerHTMLContent += `<tr><td>${parseInt(viewCount).toLocaleString()} view${viewCount == 1 ? '' : 's'}</td></tr>`
                        innerHTMLContent += `<tr><td>${data.statistics.likeCount} <i class='fa fa-thumbs-up'></i></td></tr>`
                        innerHTMLContent += `<tr><td>${data.statistics.commentCount} <i class='fa fa-commenting'></i></td></tr>`
                        innerHTMLContent += `</table></div>`
                        if (modalIndex == 1) {
                            document.getElementById('modal_stats_' + runIndex).innerHTML = innerHTMLContent
                            document.getElementById('modal_title_' + runIndex).innerHTML = data.snippet.title
                        }
                    }
                })
            } else if (link.includes('twitch')) {
                HTMLContent += `<td></td>`
                HTMLContent += `<td>${getAnchor(link)}<img src='images/twitch.png' class='clickable' style='height:91px'></td>`
                HTMLContent += `<td></td>`
            } else {
                HTMLContent += `<td></td>`
                HTMLContent += `<td class='clickable'>${getAnchor(link)}External site</td>`
                HTMLContent += `<td></td>`
            }
            HTMLContent += mode != 'fullgameILs' ? `<td>${run.date}</td>` : ''
            HTMLContent += `</tr>`
        }
    })
    HTMLContent += `</table></div>`
    return HTMLContent
}
function gradeTable(player) {
    let HTMLContent = `<div class='container'><table>`
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
            const gradeTime = scoreFromGrade(category, grade.threshold)
            let cellContent = tetrisCheck(category, gradeTime)
            let className = grade.className
            const playerRun = player.runs[categoryIndex]
            if (playerRun) {
                const playerScore = playerRun.score
                const matchingRun = getLetterGrade(playerRun.percentage).grade == grade.grade
                className = matchingRun ? 'selected' : className
                if (matchingRun) {
                    cellContent = tetrisCheck(category, playerScore)
                }
            }
            HTMLContent += `<td class='${className}'>${cellContent}</td>`
        })
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table></div>`
    return HTMLContent
}
function scoreBreakdown(player) {
    const playerCategories = []
    const playerRuns = []
    const missingCategories = []
    let HTMLContent = `<div class='container'><table><tr>`
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
    const percentageSum = player.truePercentageSum.toFixed(1)
    HTMLContent += `<tr>`
    playerRuns.forEach((run, runIndex) => {
        const letterGrade = getLetterGrade(run.percentage)
        HTMLContent += `<td class=${letterGrade.className}>${displayPercentage(run.percentage)}</td>`
        if (runIndex < playerRuns.length - 1) {
            HTMLContent += `<td>+</td>`
        } else {
            HTMLContent += numRuns > 1 ? `<td>=${percentageSum}</td>` : ''
        }
    })
    HTMLContent += `</tr></table></div>`
    if (numRuns > 1) {
        HTMLContent += `<div class='container'><div>${percentageSum} / ${numRuns} = ${displayPercentage(player.truePercentageSum / numRuns)}</div></div>`
    }
    HTMLContent += missingRuns ? `<div class='container' style='padding:10px'>Missing Runs</div>` : ''
    HTMLContent += `<div class='container'><table><tr>`
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
    HTMLContent += `</table></div>`
    HTMLContent += `<div class='textBlock'>${player.explanation}</div>`
    HTMLContent += `<div class='container' style='padding-top:15px'>${displayLetterScore(player.score)}</div>`
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
    let HTMLContent = `<div class='container' style='padding:10px'>
    <div>${getFlag(country.code, country.name, 24)}</div>
    <div style='font-size:140%;padding-left:10px'>${countryName}</div>`
    const boardTitle = generateBoardTitle(1)
    HTMLContent += boardTitle ? `<div class='modalBoardTitle' style='padding-left:20px'>${boardTitle}</div>` : ''
    HTMLContent += `</div>`
    document.getElementById('modal-player').innerHTML = HTMLContent
    playersCopy = [...country.players].slice(0, 100)
    sortPlayers(playersCopy)
    return `<div class='container'>${playersTable(playersCopy)}</div>`
}
function modalKeyPress() {
    switch (event.key) {
        case 'ArrowLeft':
            event.preventDefault();
            modalLeft();
            break;
        case 'ArrowRight':
            event.preventDefault();
            modalRight()
            break;
        case 'ArrowUp':
            event.preventDefault();
            if (globalPlayerIndex > 0 && sortCategoryIndex == -1 && page == 'leaderboard') {
                globalPlayerIndex--
                openModal(globalPlayerIndex, 'flip')
            } else {
                playSound('locked')
            }
            break
        case 'ArrowDown':
            event.preventDefault();
            if (globalPlayerIndex < 300 && globalPlayerIndex < players.length - 1 && sortCategoryIndex == -1 && page == 'leaderboard') {
                globalPlayerIndex++
                openModal(globalPlayerIndex, 'flip')
            } else {
                playSound('locked')
            }
            break
    }
}
function modalLeft() {
    if (modalIndex > 0) {
        modalIndex--
        openModal(globalPlayerIndex, 'move')
    } else {
        playSound('locked')
    }
}
function modalRight() {
    if (modalIndex < numModalPages) {
        modalIndex++
        openModal(globalPlayerIndex, 'move')
    } else {
        playSound('locked')
    }
}