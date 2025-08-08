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
    if (['tetris', 'ssbm'].includes(gameID)) {
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
        case 'country':
            modalTitle = 'COUNTRY'
            modalBody = countryModal(param)
            break
        case 'runRecapInfo':
            modalTitle = 'INFO'
            modalBody = runRecapInfo()
            break
        case 'runRecapSegment':
            modalTitle = 'SEGMENT INFO'
            modalBody = runRecapSegment(param)
            break
        case 'runRecapDatabase':
            modalTitle = 'DATABASE'
            modalBody = runRecapDatabase()
            break
        case 'runRecapUpload':
            modalTitle = 'UPLOAD'
            modalBody = runRecapUpload()
            break
        case 'discord':
            modalTitle = 'DISCORD'
            modalBody = discord()
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
function playerModal(playerName) {
    const playerIndex = players.findIndex(player => player.name == playerName)
    globalPlayerIndex = playerIndex
    document.addEventListener("keydown", modalKeyPress);
    let player = players[globalPlayerIndex]
    document.getElementById('modal-subtitle').innerHTML = getPlayerProfile(globalPlayerIndex)
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
function discord() {
    let HTMLContent = ''
    HTMLContent += `<div class='textBlock' style='max-width:500px;font-size:90%'>Join our vibrant community of Combined Leaderboard enjoyers in ${myekulColor('myekul castle')}! Stay up-to-date with all the latest features and behind-the-scenes glimpses of the website.</div>`
    HTMLContent += `
            <div class='container' style='padding:16px 0;gap:8px'>
            <img src='images/external/discord.png' style='height:24px'></img>
                ${getAnchor(discordData.instant_invite)}<div class='button banner'>Join Server!</div></a>
                <div style='width:8px;height:8px;background-color:limegreen;border-radius:50%'></div>
                ${discordData.presence_count}
            </div>`
    HTMLContent += `<div class='container'><table>`
    discordData.members.forEach(member => {
        if (member.username == 'm...') {
            member.username = 'myekul'
        }
        const srcMember = players.find(player => player.name == member.username)
        HTMLContent += `<tr>`
        HTMLContent += `<td><img src='${member.avatar_url}' style='height:30px;border-radius:15px'></td>`
        HTMLContent += `<td style='text-align:left;padding-left:5px'>${srcMember ? getPlayerName(srcMember) : member.username}</td>`
        HTMLContent += member.game ? `<td style='padding-left:10px;color:var(--gray);text-align:left'>${member.game.name}</td>` : ''
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table></div>`
    return HTMLContent
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
                openModal('player', 'flip', players[globalPlayerIndex].name)
            } else {
                playSound('locked')
            }
            break
        case 'ArrowDown':
            event.preventDefault();
            if (globalPlayerIndex < 300 && globalPlayerIndex < players.length - 1 && sortCategoryIndex == -1 && page == 'leaderboard') {
                globalPlayerIndex++
                openModal('player', 'flip', players[globalPlayerIndex].name)
            } else {
                playSound('locked')
            }
            break
    }
}
function modalLeft() {
    if (modalIndex > 0) {
        modalIndex--
        openModal('player', 'move', players[globalPlayerIndex].name)
    } else {
        playSound('locked')
    }
}
function modalRight() {
    if (modalIndex < numModalPages) {
        modalIndex++
        openModal('player', 'move', players[globalPlayerIndex].name)
    } else {
        playSound('locked')
    }
}