// generateLevelIDs('nsmbw')
// const tempCategories = []
// let tempProcessedCategories = 0
// const runNguns = ['Forest Follies', 'Treetop Trouble', 'Funfair Fever', 'Funhouse Frazzle', 'Rugged Ridge', 'Perilous Piers']
// function generateLevelIDs(gameID) {
//     const url = `https://www.speedrun.com/api/v1/games/${gameID}/levels`
//     fetch(url)
//         .then(response => response.json())
//         .then(data1 => {
//             data1.data.forEach((category, levelIndex) => {
//                 // console.log(category)
//                 category = cleanCategory(category)
//                 const url2 = `https://www.speedrun.com/api/v1/levels/${category.id}/variables`
//                 if (['cuphead', 'nsmbw'].includes(gameID)) {
//                     if (!runNguns.includes(category.name)) {
//                         fetch(url2)
//                             .then(response => response.json())
//                             .then(data2 => {
//                                 console.log(data2)
//                                 if (gameID == 'cuphead') {
//                                     category.difficultyID = data2.data[1].id
//                                     for (let [key, value] of Object.entries(data2.data[1].values.choices)) {
//                                         if (value == 'Simple') {
//                                             category.simple = key
//                                         } else if (value == 'Regular') {
//                                             category.regular = key
//                                         } else if (value == 'Expert') {
//                                             category.expert = key
//                                         }
//                                     }
//                                     if (data2.data.length > 2) {
//                                         category.versionID = data2.data[2].id
//                                         for (let [key, value] of Object.entries(data2.data[2].values.choices)) {
//                                             if (value == 'Legacy') {
//                                                 category.legacy = key
//                                             } else if (value == '1.1') {
//                                                 category.onePointOne = key
//                                             } else if (value == '1.2+') {
//                                                 category.currentPatch = key
//                                             }
//                                         }
//                                     }

//                                 } else {
//                                     category.var = data2.data[0].id
//                                     for (let [key, value] of Object.entries(data2.data[0].values.choices)) {
//                                         if (value == 'Individual World RTA') {
//                                             category.worldRTA = key
//                                         }
//                                     }
//                                 }
//                                 tempCategories[levelIndex] = category
//                                 tempProcessedCategories++
//                                 if (tempProcessedCategories == 9) {
//                                     console.log(JSON.stringify(tempCategories)) // JSON
//                                 }
//                             })
//                             .catch(error => console.error('Error fetching level variables:', error));
//                     }
//                 } else {
//                     tempCategories[levelIndex] = category
//                     tempProcessedCategories++
//                     if (tempProcessedCategories == 9) {
//                         console.log(JSON.stringify(tempCategories)) // JSON
//                     }
//                 }
//             })
//         })
//         .catch(error => console.error('Error fetching leaderboard:', error));
// }
// function cleanCategory(category) {
//     delete category.links
//     delete category.rules
//     delete category.weblink
//     return category
// }