function generateLeaderboards() {
    if (sortCategoryIndex == -1) {
        sortCategoryIndex = 0
    }
    let HTMLContent = ''
    HTMLContent += `<div class='container' style='gap:10px;${sortCategoryIndex == -1 ? 'overflow-x:scroll;margin:0 auto' : ''}align-items:flex-start'>`
    if (sortCategoryIndex == -1) {
        categories.forEach((category, categoryIndex) => {
            HTMLContent += `
            <div>
                <div class='container'>${generateBoardTitle(1, categoryIndex)}</div>
                ${leaderboardsSection(categoryIndex)}
            </div>`
        })
    } else {
        HTMLContent += leaderboardsSection(sortCategoryIndex)
    }
    if (sortCategoryIndex > -1) {
        sortPlayers(players)
        const everyRun = getEveryRun(10, null)
        HTMLContent += podium(everyRun)
        const store = sortCategoryIndex
        sortCategoryIndex = -1
        sortPlayers(players)
        sortCategoryIndex = store
    }
    HTMLContent += `</div>`
    document.getElementById('content').innerHTML = HTMLContent
}
function leaderboardsSection(categoryIndex) {
    let HTMLContent = ''
    const playersCopy = [...players]
    sortPlayers(playersCopy, categoryIndex)
    HTMLContent += playersTable(playersCopy.slice(0, sortCategoryIndex == -1 ? 20 : 100), categoryIndex)
    return HTMLContent
}