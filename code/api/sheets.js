function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
        .then(() => {
            console.log("GAPI client loaded for API");
            fetchAllData()
        }, (err) => console.error("Error loading GAPI client for API", err));
}
function fetchAllData() {
    if (gameID == 'cuphead') {
        fetchCuphead()
    } else {
        categories.forEach((category, categoryIndex) => {
            fetchTetris(category, categoryIndex)
        })
    }
}
function fetchTetris(category, categoryIndex) {
    resetLoad()
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `'${category.tabName}'!${category.range}`
    }).then(response => {
        const values = response.result.values;
        categories[categoryIndex].runs = {}
        const headers = values[0];
        let data = values.slice(1);
        let lastIndex = data.length
        data.forEach((run, runIndex) => {
            if (!run[0].trim()) {
                lastIndex = runIndex
            }
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
                    if (header == 'Video PB') {
                        header = 'score'
                    }
                    rowObject[header.toLowerCase()] = row[index] || null;
                }
            });
            return rowObject;
        });
        categories[categoryIndex].runs = objects
        load(categories)
        if (processedCategories == categories.length) {
            prepareData()
            const url = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID
            const boardTitleSrc = document.getElementById('boardTitleSrc')
            boardTitleSrc.innerHTML = `<div class='clickable'>${getAnchor(url)}<img src='images/external/sheets.png'></div>`
        }
    }, (err) => console.error("Execute error", err));
}
function fetchCuphead() {
    return gapi.client.sheets.spreadsheets.get({
        spreadsheetId: SHEET_ID,
        ranges: [`'${commBestILsCategory.tabName}'!${commBestILsCategory.range}`],
        fields: 'sheets(data(rowData(values(userEnteredValue,textFormatRuns))))'
    }).then(response => {
        const values = response.result.sheets[0].data[0].rowData;
        // console.log(values)
        categories = []
        bossesCopy = [...bosses]
        if (commBestILsCategory.name == 'DLC') {
            bossesCopy = bossesCopy.slice(19, 25)
        } else if (commBestILsCategory.name != 'DLC+Base') {
            bossesCopy = bossesCopy.slice(0, 19)
        }
        bossesCopy.sort((a, b) => (a.order || 0) - (b.order || 0));
        if (commBestILsCategory.tabName == 'DLC+Base') {
            const elementsToMove = bossesCopy.slice(0, 6);
            bossesCopy.splice(0, 6);
            bossesCopy.splice(8, 0, ...elementsToMove);
            const elem = bossesCopy.splice(2, 1)[0];
            bossesCopy.unshift(elem);
        }
        bossesCopy.forEach(boss => {
            categories.push({ name: boss.name, info: boss, runs: [] })
        })
        players.forEach(player => {
            player.runs = new Array(categories.length).fill(0)
        })
        let ILindex = 0
        let lastIndex = 0
        values[0].values.forEach((value, valueIndex) => {
            if (value.userEnteredValue?.formulaValue?.includes('=INDEX')) {
                ILindex = valueIndex
            }
            lastIndex = valueIndex
        })
        if (!ILindex) {
            ILindex = lastIndex + 1
        }
        const viable = new Array(categories.length).fill(true)
        categories.forEach((category, categoryIndex) => {
            if (values[categoryIndex].values[ILindex + 1]) {
                viable[categoryIndex] = false
            }
        })
        const numRuns = commBestILsCategory.numRuns
        const checkbox_viable = document.getElementById('checkbox_viable').checked
        categories.forEach((category, categoryIndex) => {
            const viableCheck = !checkbox_viable && !viable[categoryIndex]
            category.difficulty = 'regular'
            if (values[categoryIndex]) {
                if (values[categoryIndex].values) {
                    if (values[categoryIndex].values[numRuns]) {
                        const rawTime = values[categoryIndex].values[viableCheck ? ILindex + 1 : numRuns].userEnteredValue?.numberValue
                        const time = convertToSeconds(secondsToHMS(Math.round(rawTime * 24 * 60)))
                        const runs = viableCheck ? values[categoryIndex].values.slice(ILindex + 2) : values[categoryIndex].values.slice(numRuns + 1, ILindex)
                        runs.forEach(column => {
                            if (column.userEnteredValue) {
                                let playerName = column.userEnteredValue.formulaValue.split(',')[1].trim().slice(1).split('"')[0]
                                const link = column.userEnteredValue.formulaValue.slice(12).split('"')[0]
                                let debug = false
                                if (playerName.startsWith("*")) {
                                    playerName = playerName.slice(1);
                                    debug = true
                                }
                                addPlayer({ name: playerName })
                                category.runs.push({ place: 1, debug: debug, player: { name: playerName }, score: time, date: category.runs.length, videos: { links: [{ uri: link }] } })
                            }
                        })
                    }
                }
            }
        })
        if (!commBestILsCategory.runs) {
            commBestILsCategory.runs = new Array(numRuns).fill().map(() => [])
            categories.forEach((category, categoryIndex) => {
                for (let i = 0; i < numRuns; i++) {
                    const rawTime = values[categoryIndex].values[i].userEnteredValue?.numberValue
                    const time = convertToSeconds(secondsToHMS(Math.round(rawTime * 24 * 60)))
                    commBestILsCategory.runs[i].push(time)
                }
            })
            commBestILsCategory.top3 = []
            commBestILsCategory.humanTheory = []
            categories.forEach((category, categoryIndex) => {
                let levelSum = 0
                commBestILsCategory.runs.forEach(run => {
                    levelSum += run[categoryIndex]
                })
                commBestILsCategory.top3.push(levelSum / numRuns)
                commBestILsCategory.humanTheory.push((levelSum + categories[categoryIndex].runs[0].score) / (numRuns + 1))
            })
        }
        completeLoad()
        prepareData()
        gapi.client.sheets.spreadsheets.get({
            spreadsheetId: SHEET_ID
        }).then(response => {
            const sheets = response.result.sheets;
            const tabMap = {};
            sheets.forEach(sheet => {
                const name = sheet.properties.title;
                const gid = sheet.properties.sheetId;
                tabMap[name] = gid;
            });
            const url = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit?gid=' + tabMap[commBestILsCategory.tabName]
            const boardTitleSrc = document.getElementById('boardTitleSrc')
            boardTitleSrc.innerHTML = `<div class='clickable'>${getAnchor(url)}<img src='images/external/sheets.png'></div>`
            boardTitleSrc.innerHTML += `<div style='margin-left:5px'>${getSRCicon()}</div>`
        });
    }, (err) => console.error("Execute error", err));
}