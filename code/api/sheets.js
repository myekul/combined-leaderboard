function fetchAllData() {
    if (gameID == 'ssbm') {
        fetchSSBM()
    } else {
        categories.forEach((category, categoryIndex) => {
            fetchTetris(category, categoryIndex)
        })
    }
}
function fetchTetris(category, categoryIndex) {
    resetLoad()
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1ZBxkZEsfwDsUpyire4Xb16er36Covk7nhR8BN_LPodI',
        range: `'${category.tabName}'!${category.range}`
    }).then(response => {
        const values = response.result.values;
        categories[categoryIndex].runs = {}
        const headers = values[0];
        let data = values.slice(1);
        let lastIndex = data.length
        data.forEach((run, runIndex) => {
            if (!run[0].trim()) lastIndex = runIndex
        })
        data = data.slice(0, lastIndex)
        const objects = data.map(row => {
            const rowObject = {};
            headers.forEach((header, index) => {
                if (!header.trim()) {
                    rowObject['place'] = row[index] || null;
                } else if (header == 'Name') {
                    const player = { name: row[index] }
                    rowObject.player = player || null;
                    addPlayer(player)
                } else {
                    if (header == 'Video PB') header = 'score'
                    rowObject[header.toLowerCase()] = row[index] || null;
                }
            });
            return rowObject;
        });
        categories[categoryIndex].runs = objects
        load()
        if (processedCategories == categories.length) {
            prepareData()
            const url = 'https://docs.google.com/spreadsheets/d/1ZBxkZEsfwDsUpyire4Xb16er36Covk7nhR8BN_LPodI'
            const boardTitleSrc = document.getElementById('boardTitleSrc')
            boardTitleSrc.innerHTML = `<div class='grow'>${getAnchor(url)}${sharedAssetsImg('sheets')}</div>`
        }
    }, (err) => console.error("Execute error", err));
}
function loadSheetIcon(url, flash) {
    const boardTitleSrc = document.getElementById('boardTitleSrc')
    boardTitleSrc.innerHTML = `<div class='grow ${flash ? 'flash' : ''}'>${getAnchor(url)}${sharedAssetsImg('sheets')}</div>`
    boardTitleSrc.innerHTML += `<div style='margin-left:5px'>${getSRCicon()}</div>`
}
function fetchSSBM() {
    // resetLoad()
    if (!globalCache) {
        const sheetID = '15wdkLsmSU2T9Os1j-lISe-XmXH-l3Awk9xBipYnTQCI'
        return gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: sheetID,
            range: `'BTT (combined)'!A2:AB1000`
        }).then(response => {
            globalCache = response.result.values
            loadSSBM()
        }, (err) => console.error("Execute error", err));
    } else {
        loadSSBM()
    }
}
function loadSSBM() {
    categories.forEach(category => {
        category.runs = []
    })
    globalCache.forEach(playerRow => {
        const playerName = playerRow[0]
        const sum = playerRow[2]
        const newPlayer = addPlayer({ name: playerName, sum: sum })
        if (!newPlayer) players.find(player => player.name == playerName).sum = sum
        playerRow.forEach((cell, index) => {
            const category = categories[index - 3]
            if (cell & index > 2) category.runs.push({ score: convertToSeconds(cell), player: { name: playerName } })
        })
    })
    categories.forEach(category => {
        category.runs.sort((a, b) => {
            return a.score - b.score
        })
        let currentPlace = 1
        category.runs.forEach((run, index) => {
            if (index > 0 && run.score == category.runs[index - 1].score) {
                run.place = category.runs[index - 1].place; // Same rank as previous if tie
            } else {
                run.place = currentPlace;
            }
            currentPlace++;
        })
    })
    // players.sort((a, b) => {
    //     return convertToSeconds(a.sum) - convertToSeconds(b.sum)
    // })
    players.sort((a, b) => {
        if (!a.sum && !b.sum) return 0;
        if (!a.sum) return 1;
        if (!b.sum) return -1;
        return convertToSeconds(a.sum) - convertToSeconds(b.sum);
    });
    prepareData()
    const url = 'https://docs.google.com/spreadsheets/d/15wdkLsmSU2T9Os1j-lISe-XmXH-l3Awk9xBipYnTQCI'
    const boardTitleSrc = document.getElementById('boardTitleSrc')
    boardTitleSrc.innerHTML = `<div class='grow'>${getAnchor(url)}${sharedAssetsImg('sheets')}</div>`
}