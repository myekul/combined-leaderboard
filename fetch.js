const API_KEY = 'AIzaSyDg6FBho-vfAm67-UdGP-8IbVFdLV23unY'
const SHEET_ID = '1ZBxkZEsfwDsUpyire4Xb16er36Covk7nhR8BN_LPodI'
function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
        .then(() => {
            console.log("GAPI client loaded for API");
            fetchAllData()
        }, (err) => console.error("Error loading GAPI client for API", err));
}
function fetchAllData() {
    processedCategories = 0
    categories.forEach((category, categoryIndex) => {
        fetchData(category, categoryIndex)
    })
}
function fetchData(category, categoryIndex) {
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `'${category.tabName}'!${category.range}`,
    }).then(response => {
        const values = response.result.values;
        const headers = values[0];
        let data = values.slice(1);
        let lastIndex = data.length
        data.forEach((run, runIndex) => {
            if (run[0] == '') {
                lastIndex = runIndex
            }
        })
        data = data.slice(0, lastIndex)
        const objects = data.map(row => {
            const rowObject = {};
            rowObject.run = {}
            headers.forEach((header, index) => {
                if (header == '') {
                    rowObject['place'] = row[index] || null;
                } else if (header == 'Name') {
                    const player = { name: row[index] }
                    rowObject.run.player = player || null;
                    addPlayer(player, tetris)
                } else {
                    if (header == 'Video PB') {
                        header = 'score'
                    }
                    rowObject.run[header.toLowerCase()] = row[index] || null;
                }
            });
            return rowObject;
        });
        tetris[categoryIndex].runs = {}
        tetris[categoryIndex].runs.runs = objects
        load(tetris)
        if (processedCategories == tetris.length) {
            prepareData(tetris)
        }
    }, (err) => console.error("Execute error", err));
}