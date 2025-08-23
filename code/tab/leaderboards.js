function generateLeaderboards() {
    let HTMLContent = ''
    HTMLContent += `<div class='container' style='gap:10px;${sortCategoryIndex == -1 && mode != 'commBestILs' ? 'overflow-x:scroll;justify-content:left;margin:0 auto' : ''}align-items:flex-start'>`
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
        const everyRun = getEveryRun(10, null, true)
        HTMLContent += `<div style='padding-left:40px'>${fancyTable(everyRun, 10)}</div>`
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