function generateLeaderboards() {
    if (sortCategoryIndex == -1) {
        sortCategoryIndex = 0
    }
    let HTMLContent = ''
    if (mode == 'fullgame') {
        HTMLContent += `
        <div class='container' style='margin-bottom:15px'>
            <button class='button ${leaderboardsTab == 'leaderboards' ? 'cuphead' : ''}' onclick="leaderboardsTab='leaderboards';playSound('move');action()">Leaderboard</button>
            <button class='button ${leaderboardsTab == 'progression' ? 'cuphead' : ''}' onclick="leaderboardsTab='progression';playSound('move');action()">Progression</button>
        </div>`
    }
    HTMLContent += `<div class='container' style='gap:10px;${sortCategoryIndex == -1 ? 'overflow-x:scroll;margin:0 auto' : ''}align-items:flex-start'>`
    if (leaderboardsTab == 'leaderboards' || mode == 'levels') {
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
        sortPlayers(players)
        const everyRun = getEveryRun(10, null)
        HTMLContent += podium(everyRun)
        const store = sortCategoryIndex
        sortCategoryIndex = -1
        sortPlayers(players)
        sortCategoryIndex = store
    } else if (leaderboardsTab == 'progression') {
        HTMLContent += pbProgressionSection()
    }
    HTMLContent += `</div>`
    document.getElementById('content').innerHTML = HTMLContent
    if (leaderboardsTab == 'progression' && mode != 'levels') fetchTopRuns()
}
function leaderboardsSection(categoryIndex) {
    const playersCopy = [...players]
    sortPlayers(playersCopy, categoryIndex)
    return playersTable(playersCopy.slice(0, sortCategoryIndex == -1 ? 20 : 100), categoryIndex)
}