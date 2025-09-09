function generateLeaderboards() {
    if (sortCategoryIndex == -1) {
        sortCategoryIndex = 0
    }
    let HTMLContent = ''
    HTMLContent += `<div class='container' style='gap:10px;${sortCategoryIndex == -1 && mode != 'commBestILs' ? 'overflow-x:scroll;margin:0 auto' : ''}align-items:flex-start'>`
    if (sortCategoryIndex == -1 && mode != 'commBestILs') {
        categories.forEach((category, categoryIndex) => {
            HTMLContent += `<div>`
            HTMLContent += `<div class='container'>${generateBoardTitle(1, categoryIndex)}</div>`
            HTMLContent += leaderboardsSection(categoryIndex)
            HTMLContent += `</div>`
        })
    } else {
        HTMLContent += leaderboardsSection(sortCategoryIndex)
    }
    if (sortCategoryIndex > -1 || mode == 'commBestILs') {
        sortPlayers(players)
        const everyRun = getEveryRun(10, null, true)
        HTMLContent += `<div style='padding-left:20px'>
        <div id='podium' class='container' style='height:120px;align-items:flex-end;margin:0 100px'>
            <div class='second' style='height:50%'><div class='container' style='transform: translate(0px, -60px)'>${getPlayerIcon(players[1], 70)}</div></div>
            <div class='first' style='height:70%'><div class='container' style='transform: translate(0px, -60px)'>${getPlayerIcon(players[0], 70)}</div></div>
            <div class='third' style='height:30%'><div class='container' style='transform: translate(0px, -60px)'>${getPlayerIcon(players[2], 70)}</div></div>
        </div>`
        HTMLContent += `<div class='container' style='gap:10px;padding:15px 0'>`
        players.slice(3, 10).forEach(player => {
            HTMLContent += `<div>${getPlayerIcon(player, 50)}</div>`
        })
        HTMLContent += `</div>`
        HTMLContent += fancyTable(everyRun, 10)
        HTMLContent += `</div>`
        const store = sortCategoryIndex
        sortCategoryIndex = -1
        sortPlayers(players)
        sortCategoryIndex = store
    }
    HTMLContent += `</div>`
    document.getElementById('leaderboards').innerHTML = HTMLContent
}
function leaderboardsSection(categoryIndex) {
    let HTMLContent = ''
    const playersCopy = [...players]
    sortPlayers(playersCopy, categoryIndex)
    HTMLContent += playersTable(playersCopy.slice(0, sortCategoryIndex == -1 ? 20 : 100), categoryIndex)
    return HTMLContent
}