function openModalCL(modal, shh, param) {
    modalSliders = false
    showModal = true
    if (['tetris', 'ssbm'].includes(gameID)) {
        numModalPages = 1
    } else if (mode == 'commBestILs') {
        numModalPages = 1
    } else {
        numModalPages = 2
    }
    if (modalIndex > numModalPages) modalIndex = 0
    if (modal != 'player') {
        modalIndex = 0
    } else {
        show('modal-pages')
    }
    switch (modal) {
        case 'player':
            playerModal(param, shh)
            break
        case 'country':
            openModal(countryModal(param), 'COUNTRY', '', shh)
            break
        case 'runRecapSegment':
            openModal(runRecapSegment(param), 'SEGMENT INFO', '', shh)
            break
    }
}
function closeModalCL() {
    showModal = false
    document.removeEventListener("keydown", modalKeyPress);
    hide('modal-pages')
}
function playerModal(playerName, shh) {
    const playerIndex = players.findIndex(player => player.name == playerName)
    globalPlayerIndex = playerIndex
    document.addEventListener("keydown", modalKeyPress);
    let player = players[globalPlayerIndex]
    let pagesContent = `<div onclick="modalLeft()" class='grow'>${fontAwesome('caret-left')}</div>`;
    for (let i = 0; i <= numModalPages; i++) {
        pagesContent += `<div style='gap:10px'>`
        if (i == modalIndex) {
            pagesContent += fontAwesome('circle')
        } else {
            pagesContent += fontAwesome('circle-o')
        }
        pagesContent += `</div>`
    }
    pagesContent += `<div onclick="modalRight()" class='grow'>${fontAwesome('caret-right')}</div>`
    document.getElementById('modal-pages').innerHTML = pagesContent
    let modalPageNames = ['reportCard', 'videoCollection', 'gradeTable']
    if (mode == 'commBestILs') {
        modalPageNames.slice(0, 2)
    }
    if (['tetris', 'ssbm'].includes(gameID)) {
        modalPageNames.splice(1, 1)
    }
    const modalPage = modalPageNames[modalIndex]
    const subtitle = getPlayerProfile(globalPlayerIndex)
    if (modalPage == 'reportCard') {
        openModal(reportCard(player), 'REPORT CARD', subtitle, shh)
    } else if (modalPage == 'videoCollection') {
        openModal(videoCollection(player), 'VIDEO COLLECTION', subtitle, shh)
    } else if (modalPage == 'gradeTable') {
        openModal(gradeTable(player), 'GRADE TABLE', subtitle, shh)
    }
}
function scoreFromGrade(category, percentage) {
    const worldRecord = getWorldRecord(category)
    let score = category.reverse ? worldRecord * (percentage / 100) : worldRecord / (percentage / 100)
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
function getThumbnail(link, videoID, size) {
    const thumbnailSize = size ? 'width:224px;height:126px' : 'width:160px;height:90px'
    const src = link.includes('twitch') ? 'images/twitch.png' : `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`
    return getAnchor(link) + `<img src='${src}' class='grow' style="${thumbnailSize}"></img></a>`
}
function videoCollection(player) {
    let HTMLContent = `<div class='container'><table style='border-collapse:collapse'>`
    let runCount = 0
    player.runs.forEach((run, runIndex) => {
        if (run && !(gameID == 'mtpo' && runIndex == 0)) {
            HTMLContent += `<tr class='${getRowColor(runCount)}'>`
            const link = run.url
            HTMLContent += fancyRun(run, runIndex)
            if (link?.includes('you')) {
                const videoID = getYouTubeID(link)
                HTMLContent += `<td id='modal_stats_${runIndex}' style='text-align:right;padding:0 5px'></td>`
                fetchYouTube(videoID).then(data => {
                    if (data) {
                        // console.log(data)
                        let innerHTMLContent = `<div class='videoCollection'>`
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
        HTMLContent += `<tr><td class='${grade.className}' style='text-align:left'>${grade.grade}</td>
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
            HTMLContent += `<td class='${className}' style='padding:0 3px'>${cellContent}</td>`
        })
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table>`
    return HTMLContent
}
function getCategoryHeader(category) {
    const colorClass = mode == 'levels' ? getColorClass() : ''
    const style = category.info ? '' : 'width:80px'
    const cellContent = category.info ? getImage(category.info.id) : category.name
    return `<th class='${classNameLogic(category)} ${colorClass}' style="${style}">${cellContent}</th>`
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
            if (globalPlayerIndex > 0 && sortCategoryIndex == -1 && globalTab == 'home') {
                globalPlayerIndex--
                openModalCL('player', true, players[globalPlayerIndex].name)
                playSound('cardflip')
            } else {
                playSound('locked')
            }
            break
        case 'ArrowDown':
            event.preventDefault();
            if (globalPlayerIndex < 300 && globalPlayerIndex < players.length - 1 && sortCategoryIndex == -1 && globalTab == 'home') {
                globalPlayerIndex++
                openModalCL('player', true, players[globalPlayerIndex].name)
                playSound('cardflip')
            } else {
                playSound('locked')
            }
            break
    }
}
function modalLeft() {
    if (modalIndex > 0) {
        modalIndex--
        openModalCL('player', true, players[globalPlayerIndex].name)
        playSound('move')
    } else {
        playSound('locked')
    }
}
function modalRight() {
    if (modalIndex < numModalPages) {
        modalIndex++
        openModalCL('player', true, players[globalPlayerIndex].name)
        playSound('move')
    } else {
        playSound('locked')
    }
}