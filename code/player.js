function getPlayerDisplay(player, playerIndex) {
    let HTMLContent = ''
    HTMLContent += mode != 'commBestILs' && globalTab != 'leaderboards' ? `<td class='${placeClass(player.rank)}' style='font-size:90%'>${player.rank}</td>` : ''
    if (gameID != 'tetris') {
        if (document.getElementById('checkbox_flags').checked && globalTab != 'commBest') {
            HTMLContent += `<td>${getPlayerFlag(player, 12)}</td>`
        }
        if (document.getElementById('checkbox_icons').checked) {
            HTMLContent += `<td>${getPlayerIcon(player, 18)}</td>`
        }
    }
    const clickable = player?.rank && !['map', 'commBest'].includes(globalTab) ? `onclick="openModalCL('player',false,'${player.name}')" class='clickable short-border'` : ''
    const vibrant = document.getElementById('checkbox_vibrant')?.checked ? `--border-color:${getColorFromClass(getLetterGrade(player.score).className)};` : ''
    HTMLContent += `<td ${clickable} style='--border-width:${normalize(player?.score, 80)}%;${vibrant}text-align:left;font-weight: bold;font-size:80%;padding-right:5px'>${getPlayerName(player ? player : playerIndex)}</td>`
    return HTMLContent
}
function getPlayerProfile(playerIndex) {
    let HTMLContent = ''
    const player = players[playerIndex]
    HTMLContent += `<div class='container' style='padding-top:8px'>`
    HTMLContent += gameID != 'tetris' ? `<div style='padding-right:10px'>${getPlayerIcon(player, 64)}</div>` : ''
    HTMLContent += `<div>`
    HTMLContent += `<div class='container' style='padding-bottom:2px'>`
    HTMLContent += `<div style='font-size:150%;margin:0'>${getPlayerName(player)}</div>`
    HTMLContent += `</div>`
    if (player.links) {
        HTMLContent += `<div class='container' style='gap:5px;justify-content:flex-start'>`
        const flag = getPlayerFlag(player, 14)
        HTMLContent += `<div>${flag}</div>`
        HTMLContent += flag ? `<div class='container' style='width:10px;margin:0'>&#8226;</div>` : ''
        const socials = ['src', 'twitch', 'youtube']
        socials.forEach(social => {
            const anchor = getAnchor(getSocial(player, social))
            HTMLContent += anchor ? `${anchor}<img src='${sharedAssetsURL(social)}' class='grow container' style='height:18px;width:auto'></a>` : ''
        })
        HTMLContent += `</div>`
    }
    HTMLContent += `</div>`
    const boardTitle = generateBoardTitle(2)
    HTMLContent += boardTitle ? `<div class='modalBoardTitle' style='padding-left:20px'>${boardTitle}</div>` : ''
    HTMLContent += `</div>`
    return HTMLContent
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