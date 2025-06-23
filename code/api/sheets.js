function loadClient() {
    if (!gapiClientLoaded) {
        gapiClientLoaded = true
        gapi.client.setApiKey(API_KEY);
        return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
            .then(() => {
                console.log("GAPI client loaded for API");
                fetchAllData()
            }, (err) => console.error("Error loading GAPI client for API", err));
    } else {
        fetchAllData()
    }
}
function fetchAllData() {
    if (gameID == 'cuphead') {
        fetchCuphead()
    } else if (gameID == 'ssbm') {
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
        load()
        if (processedCategories == categories.length) {
            prepareData()
            const url = 'https://docs.google.com/spreadsheets/d/1ZBxkZEsfwDsUpyire4Xb16er36Covk7nhR8BN_LPodI'
            const boardTitleSrc = document.getElementById('boardTitleSrc')
            boardTitleSrc.innerHTML = `<div class='clickable'>${getAnchor(url)}<img src='images/external/sheets.png'></div>`
        }
    }, (err) => console.error("Execute error", err));
}
function fetchCuphead(markin) {
    const sheetSrc = markin ? markinSheets : myekulSheets
    const sheetID = markin ? '1JgTjjonfC7bh4976NI4pCPeFp8LbA3HMKdvS_47-WtQ' : MYEKUL_SHEET_ID
    const sheetContent = markin ? 'formattedValue' : 'userEnteredValue,textFormatRuns'
    if (Object.keys(sheetSrc).length == 0) {
        return gapi.client.sheets.spreadsheets.get({
            spreadsheetId: sheetID,
            fields: `sheets(properties.title,data(rowData(values(${sheetContent}))))`
        }).then(response => {
            const sheets = response.result.sheets
            sheets.forEach(sheet => {
                const sheetName = sheet.properties.title
                let rowData = sheet.data[0].rowData
                if (markin) {
                    rowData = rowData.slice(3)
                    rowData = rowData.filter(row => row.values && row.values[0] && row.values[0].formattedValue)
                }
                rowData.forEach(row => {
                    if (row.values) {
                        const startIndex = markin ? 1 : 2
                        row.values = row.values.slice(startIndex)
                    }
                })
                sheetSrc[sheetName] = rowData
            })
            markin ? loadMarkin() : loadMyekul()
        }, (err) => console.error("Execute error", err));
    } else {
        markin ? loadMarkin() : loadMyekul()
    }
}
function loadMyekul() {
    const values = myekulSheets[commBestILsCategory.tabName]
    // console.log(values)
    categories = []
    bossesCopy = [...bosses]
    if (commBestILsCategory.name == 'DLC') {
        bossesCopy = bossesCopy.slice(19, 25)
    } else if (commBestILsCategory.name != 'DLC+Base') {
        bossesCopy = bossesCopy.slice(0, 19)
    }
    bossesCopy.sort((a, b) => (a.order || 0) - (b.order || 0));
    // OOB Route
    // if (commBestILsCategory.tabName == 'DLC+Base') {
    //     const elementsToMove = bossesCopy.slice(0, 6);
    //     bossesCopy.splice(0, 6);
    //     bossesCopy.splice(8, 0, ...elementsToMove);
    //     const elem = bossesCopy.splice(2, 1)[0];
    //     bossesCopy.unshift(elem);
    // }
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
        commBestILsCategory.top3Best = new Array(commBestILsCategory.runs[0].length).fill(Infinity)
        commBestILsCategory.top3BestPlayers = new Array(commBestILsCategory.runs[0].length).fill(null)
        commBestILsCategory.humanTheory = []
        categories.forEach((category, categoryIndex) => {
            let levelSum = 0
            commBestILsCategory.runs.forEach((run, index) => {
                const time = run[categoryIndex]
                levelSum += time
                if (time < commBestILsCategory.top3Best[categoryIndex]) {
                    commBestILsCategory.top3Best[categoryIndex] = time
                    commBestILsCategory.top3BestPlayers[categoryIndex] = [index]
                } else if (time == commBestILsCategory.top3Best[categoryIndex]) {
                    commBestILsCategory.top3BestPlayers[categoryIndex].push(index)
                }
            })
            commBestILsCategory.top3.push(levelSum / numRuns)
            commBestILsCategory.humanTheory.push((levelSum + categories[categoryIndex].runs[0].score) / (numRuns + 1))
        })
    }
    if (page == 'runRecap') {
        if (runRecapExample) {
            processSavFile(0, true)
        }
        generateDropbox('sav')
        generateDropbox('lss')
    } else if (runRecapExample) {
        runRecapViewPage('home')
    }
    if (commBestILsCategory.markin) {
        fetchCuphead(true)
    } else {
        prepareData()
    }
    categories.forEach(category => {
        category.info.levelID = bossIDs[category.info.id]
    })
}
function loadSheets() {
    gapi.client.sheets.spreadsheets.get({
        spreadsheetId: MYEKUL_SHEET_ID
    }).then(response => {
        const sheets = response.result.sheets;
        const tabMap = {};
        sheets.forEach(sheet => {
            const name = sheet.properties.title;
            const gid = sheet.properties.sheetId;
            tabMap[name] = gid;
        });
        const url = 'https://docs.google.com/spreadsheets/d/' + MYEKUL_SHEET_ID + '/edit?gid=' + tabMap[commBestILsCategory.tabName]
        const boardTitleSrc = document.getElementById('boardTitleSrc')
        boardTitleSrc.innerHTML = `<div class='clickable'>${getAnchor(url)}<img src='images/external/sheets.png'></div>`
        boardTitleSrc.innerHTML += `<div style='margin-left:5px'>${getSRCicon()}</div>`
    });
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
        if (!newPlayer) {
            players.find(player => player.name == playerName).sum = sum
        }
        playerRow.forEach((cell, index) => {
            const category = categories[index - 3]
            if (index > 2) {
                if (cell) {
                    category.runs.push({ score: convertToSeconds(cell), player: { name: playerName } })
                }
            }
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
    boardTitleSrc.innerHTML = `<div class='clickable'>${getAnchor(url)}<img src='images/external/sheets.png'></div>`
}