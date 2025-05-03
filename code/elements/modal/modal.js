function openModal(modal, sound, param) {
    if (sound == 'up') {
        playSound('cardup')
    } else if (sound == 'move') {
        playSound('equip_move')
    } else if (sound == 'flip') {
        playSound('cardflip')
    }
    modalSliders = false
    showModal = true
    if (gameID == 'tetris') {
        numModalPages = 1
    } else if (mode == 'commBestILs') {
        numModalPages = 1
    } else {
        numModalPages = 2
    }
    if (modalIndex > numModalPages) {
        modalIndex = 0
    }
    if (modal != 'player') {
        modalIndex = 0
    } else {
        show('modal-pages')
    }
    document.addEventListener('keydown', function (event) {
        if (event.key == 'Escape' && showModal) {
            closeModal()
        }
    });
    let modalTitle = ''
    let modalBody = ''
    document.getElementById('modal-subtitle').innerHTML = ''
    switch (modal) {
        case 'player':
            modalBody = playerModal(param)
            break
        case 'info':
            modalTitle = 'INFO'
            modalBody = modalInfo()
            break
        case 'runRecapInfo':
            modalTitle = 'INFO'
            modalBody = runRecapInfo()
            break
        case 'country':
            modalTitle = 'COUNTRY'
            modalBody = countryModal(param)
            break
        case 'runRecapSegment':
            modalTitle = 'SEGMENT INFO'
            modalBody = runRecapSegment(param)
            break
    }
    if (modalTitle) {
        document.getElementById('modal-title').innerHTML = modalTitle
    }
    document.getElementById('modal-body').innerHTML = modalBody
    const modalElem = document.getElementById("modal");
    modalElem.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    modalElem.style.display = "block";
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
    hide('modal-pages')
    setTimeout(() => {
        hide(modal)
    }, 200);
}
function playerModal(playerIndex) {
    globalPlayerIndex = playerIndex
    window.firebaseUtils.lastCheckedUser()
    document.addEventListener("keydown", modalKeyPress);
    let player = players[globalPlayerIndex]
    if (sortCategoryIndex > -1) {
        const oldIndex = sortCategoryIndex
        sortCategoryIndex = -1
        sortPlayers(players)
        sortCategoryIndex = oldIndex
        player = players[globalPlayerIndex]
    }
    playerModalSubtitle(globalPlayerIndex)
    let pagesContent = `<div onclick="modalLeft()" class='clickable'>${fontAwesome('caret-left')}</div>`;
    for (let i = 0; i <= numModalPages; i++) {
        pagesContent += `<div style='gap:10px'>`
        if (i == modalIndex) {
            pagesContent += fontAwesome('circle')
        } else {
            pagesContent += fontAwesome('circle-o')
        }
        pagesContent += `</div>`
    }
    pagesContent += `<div onclick="modalRight()" class='clickable'>${fontAwesome('caret-right')}</div>`
    document.getElementById('modal-pages').innerHTML = pagesContent
    let modalPageNames = ['reportCard', 'videoCollection', 'gradeTable']
    if (mode == 'commBestILs') {
        modalPageNames.slice(0, 2)
    }
    if (gameID == 'tetris') {
        modalPageNames.splice(1, 1)
    }
    const modalPage = modalPageNames[modalIndex]
    let modalTitle
    let modalBody
    if (modalPage == 'reportCard') {
        modalTitle = 'REPORT CARD'
        modalBody = reportCard(player)
    } else if (modalPage == 'videoCollection') {
        modalTitle = 'VIDEO COLLECTION'
        modalBody = videoCollection(player)
    } else if (modalPage == 'gradeTable') {
        modalTitle = 'GRADE TABLE'
        modalBody = gradeTable(player)
    }
    document.getElementById('modal-title').innerHTML = modalTitle
    return modalBody
}
function playerModalSubtitle(playerIndex) {
    const player = players[playerIndex]
    let modalSubtitle = `<div class='container' style='padding-top:8px'>`
    modalSubtitle += gameID != 'tetris' ? `<div style='padding-right:10px'>${getPlayerIcon(player, 50)}</div>` : ''
    modalSubtitle += `<div>`
    modalSubtitle += `<div class='container' style='padding-bottom:2px'>`
    modalSubtitle += `<div style='font-size:140%;margin:0'>${getPlayerName(player)}</div>`
    modalSubtitle += `</div>`
    if (player.links) {
        modalSubtitle += `<div class='container' style='gap:5px;justify-content:flex-start'>`
        const flag = getPlayerFlag(player, 12)
        modalSubtitle += `<div>${flag}</div>`
        modalSubtitle += flag ? `<div class='container' style='width:10px;margin:0'>&#8226;</div>` : ''
        const socials = ['src', 'twitch', 'youtube']
        socials.forEach(social => {
            const anchor = getAnchor(getSocial(player, social))
            modalSubtitle += anchor ? `${anchor}<img src='images/external/${social}.png' class='clickable container' style='height:16px;width:auto'>` : ''
        })
        modalSubtitle += `</div>`
    }
    modalSubtitle += `</div>`
    const boardTitle = generateBoardTitle(2)
    modalSubtitle += boardTitle ? `<div class='modalBoardTitle' style='padding-left:20px'>${boardTitle}</div>` : ''
    modalSubtitle += `</div>`
    document.getElementById('modal-subtitle').innerHTML = modalSubtitle
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
    return fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoID}&key=${API_KEY}&part=statistics&fields=items(statistics)`)
        .then(response => response.json())
        .then(data => {
            return data.items[0]
        })
}
function getYouTubeID(link) {
    let videoID = link.split('/')[link.split('/').length - 1].split('"')[0]
    if (link.includes('?') && !link.includes('watch?')) {
        videoID = videoID.split('?')[0]
    }
    if (videoID.includes('=')) {
        videoID = videoID.split('=')[1].split('&')[0]
    }
    return videoID
}
function getThumbnail(link, videoID) {
    const src = link.includes('twitch') ? 'images/twitch.png' : `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`
    return getAnchor(link) + `<img src='${src}' class='clickable' style='width:160px;height:90px'></img></a>`
}
function videoCollection(player) {
    let HTMLContent = `<div class='container'><table style='border-collapse:collapse'>`
    let runCount = 0
    player.runs.forEach((run, runIndex) => {
        if (run && !(gameID == 'mtpo' && runIndex == 0)) {
            HTMLContent += `<tr class='${getRowColor(runCount)}'>`
            const link = getVideoLink(run)
            HTMLContent += fancyRun(run, runIndex)
            if (link?.includes('you')) {
                const videoID = getYouTubeID(link)
                HTMLContent += `<td id='modal_stats_${runIndex}' style='text-align:right;padding:0 5px'></td>`
                fetchYouTube(videoID).then(data => {
                    if (data) {
                        // console.log(data)
                        let innerHTMLContent = `<div id='videoCollection'>`
                        const viewCount = data.statistics.viewCount
                        innerHTMLContent += `<div>${parseInt(viewCount).toLocaleString()} view${viewCount == 1 ? '' : 's'}</div>`
                        innerHTMLContent += `<div>${parseInt(data.statistics.likeCount).toLocaleString()}&nbsp;${fontAwesome('thumbs-up')}</div>`
                        innerHTMLContent += `<div>${parseInt(data.statistics.commentCount).toLocaleString()}&nbsp;${fontAwesome('commenting')}</div>`
                        innerHTMLContent += `</div>`
                        if (modalIndex == 1) {
                            document.getElementById('modal_stats_' + runIndex).innerHTML = innerHTMLContent
                        }
                    }
                })
            } else {
                HTMLContent += `<td></td>`
            }
            HTMLContent += `</tr>`
            runCount++
        }
    })
    HTMLContent += `</table></div>`
    return HTMLContent
}
function gradeTable(player) {
    let HTMLContent = `<table style='margin:0 auto'>`
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
    HTMLContent += `</table>`
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
    HTMLContent += `</tr>`
    HTMLContent += `</tr></table></div>`
    HTMLContent += missingRuns ? `<div class='container' style='padding:10px'>Missing Runs</div>` : ''
    HTMLContent += `<div class='container'><table><tr>`
    missingCategories.forEach(missingCategory => {
        HTMLContent += getCategoryHeader(missingCategory)
    })
    HTMLContent += `</tr>`
    if (mode == 'levels' && big5()) {
        HTMLContent += `<tr>`
        missingCategories.forEach(missingCategory => {
            HTMLContent += getExtraHeader(missingCategory)
        })
        HTMLContent += `</tr>`
    }
    HTMLContent += `</table></div>`
    HTMLContent += `<div class='textBlock'>${player.explanation}</div>`
    HTMLContent += `<div class='container' style='padding-top:15px'>${scoreGradeSpan(player.score)}</div>`
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
    let HTMLContent = `<div class='container' style='padding-top:10px'>
    <div>${getFlag(country.code, country.name, 24)}</div>
    <div style='font-size:140%;padding-left:10px'>${countryName}</div>`
    const boardTitle = generateBoardTitle(1)
    HTMLContent += boardTitle ? `<div class='modalBoardTitle' style='padding-left:20px'>${boardTitle}</div>` : ''
    HTMLContent += `</div>`
    document.getElementById('modal-subtitle').innerHTML = HTMLContent
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
                openModal('player', 'flip', globalPlayerIndex)
            } else {
                playSound('locked')
            }
            break
        case 'ArrowDown':
            event.preventDefault();
            if (globalPlayerIndex < 300 && globalPlayerIndex < players.length - 1 && sortCategoryIndex == -1 && page == 'leaderboard') {
                globalPlayerIndex++
                openModal('player', 'flip', globalPlayerIndex)
            } else {
                playSound('locked')
            }
            break
    }
}
function modalLeft() {
    if (modalIndex > 0) {
        modalIndex--
        openModal('player', 'move', globalPlayerIndex)
    } else {
        playSound('locked')
    }
}
function modalRight() {
    if (modalIndex < numModalPages) {
        modalIndex++
        openModal('player', 'move', globalPlayerIndex)
    } else {
        playSound('locked')
    }
}