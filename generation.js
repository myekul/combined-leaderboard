// generateLevelIDs(gameID)
const runNguns = ['Forest Follies', 'Treetop Trouble', 'Funfair Fever', 'Funhouse Frazzle', 'Rugged Ridge', 'Perilous Piers']
function generateLevelIDs(gameID) {
    const url = `https://www.speedrun.com/api/v1/games/${gameID}/levels`
    fetch(url)
        .then(response => response.json())
        .then(data1 => {
            data1.data.forEach((level, levelIndex) => {
                const url2 = `https://www.speedrun.com/api/v1/levels/${level.id}/variables`
                if (gameID == 'cuphead') {
                    if (!runNguns.includes(level.name)) {
                        fetch(url2)
                            .then(response => response.json())
                            .then(data2 => {
                                level.numPlayersID = data2.data[0].id
                                level.soloID = data2.data[0].values.default
                                level.difficultyID = data2.data[1].id
                                for (let [key, value] of Object.entries(data2.data[1].values.choices)) {
                                    if (value == 'Simple') {
                                        level.simple = key
                                    } else if (value == 'Regular') {
                                        level.regular = key
                                    } else if (value == 'Expert') {
                                        level.expert = key
                                    }
                                }
                                if (data2.data.length > 2) {
                                    level.versionID = data2.data[2].id
                                    for (let [key, value] of Object.entries(data2.data[2].values.choices)) {
                                        if (value == 'Legacy') {
                                            level.legacy = key
                                        } else if (value == '1.1') {
                                            level.onePointOne = key
                                        } else if (value == '1.2+') {
                                            level.currentPatch = key
                                        }
                                    }
                                }
                                levels.push(level)
                                if (levelIndex == data1.data.length - 1) {
                                    console.log(JSON.stringify(levels))
                                }
                            })
                            .catch(error => console.error('Error fetching level variables:', error));
                    }
                } else if (gameID == 'sm64') {
                    // console.log(JSON.stringify(data1.data))
                }
            })
        })
        .catch(error => console.error('Error fetching leaderboard:', error));
}