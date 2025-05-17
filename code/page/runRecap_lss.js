function read_lss(content) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "application/xml");
    // console.log(xmlDoc)
    runRecap_lssFile = {}
    runRecap_lssFile = { bestSplits: [], bestSegments: [], pbSplits: [], pbSegments: [], attemptHistory: [], segmentHistory: [] }
    const attempts = Array.from(xmlDoc.querySelectorAll("AttemptHistory > Attempt"))
    const finishedAttempts = attempts.filter(attempt => attempt.querySelector("GameTime"));
    const attemptHistory = finishedAttempts.map(attempt => {
        return {
            id: attempt.getAttribute("id"),
            start: attempt.getAttribute("started"),
            end: attempt.getAttribute("ended"),
            gameTime: convertToSeconds(attempt.querySelector("GameTime").textContent.slice(3)),
            segments: [],
            splits: []
        }
    })
    const segments = xmlDoc.querySelectorAll("Segment");
    segments.forEach((segment, index) => {
        runRecap_lssFile.bestSegments.push(convertToSeconds(segment.querySelector("BestSegmentTime GameTime")?.textContent.slice(3)))
        const splitTime = convertToSeconds(segment.querySelector('SplitTimes SplitTime GameTime')?.textContent.slice(3))
        runRecap_lssFile.pbSplits.push(splitTime)
        let segmentTime = splitTime
        if (index > 0) {
            const prevSplitTime = runRecap_lssFile.pbSplits[index - 1]
            segmentTime = splitTime - prevSplitTime
        }
        runRecap_lssFile.pbSegments.push(segmentTime)
        const segmentAttempts = Array.from(segment.querySelectorAll('SegmentHistory > Time'))
        // console.log(segmentAttempts[0].querySelector("GameTime"))
        const result = segmentAttempts.map(attempt => {
            const timeMode = attempt.querySelector("GameTime") ? 'GameTime' : 'RealTime'
            return {
                id: attempt.getAttribute("id"),
                gameTime: convertToSeconds(attempt.querySelector(timeMode).textContent.slice(3))
            }
        })
        runRecap_lssFile.segmentHistory.push(result)
    })
    attemptHistory.forEach(attempt => {
        if (runRecap_lssFile.segmentHistory[0].find(segmentAttempt => segmentAttempt.id == attempt.id)) {
            runRecap_lssFile.attemptHistory.push(attempt)
        }
    })
    runRecap_lssFile.attemptHistory.findIndex(attempt => attempt.splits[attempt.splits.length - 1])
    let HTMLContent = ''
    const reverseAttempts = runRecap_lssFile.attemptHistory.reverse()
    let firstAttempt = 0
    const pbTime = runRecap_lssFile.pbSplits[runRecap_lssFile.pbSplits.length - 1]
    let prevPB = Infinity
    let prevPBIndex = 0
    reverseAttempts.forEach((attempt, index) => {
        if (index == 0) {
            firstAttempt = attempt.id
        }
        HTMLContent += `<option value="${attempt.id}">${secondsToHMS(attempt.gameTime)} - ${attempt.start.slice(0, 10)}</option>`
        if (attempt.gameTime > pbTime && attempt.gameTime < prevPB) {
            prevPB = attempt.gameTime
            prevPBIndex = attempt.id
        }
    })
    document.querySelectorAll('.lss_recentRuns').forEach(elem => {
        show(elem)
        elem.innerHTML = HTMLContent
    })
    const prevPBelem = document.getElementById('lss_prevPB')
    prevPBelem.innerHTML = secondsToHMS(prevPB) + ' - Previous PB'
    prevPBelem.value = prevPBIndex
    let comparisonValue = 'yourPB'
    if (reverseAttempts[0].gameTime == pbTime) {
        comparisonValue = prevPBIndex
    }
    document.getElementById('dropdown_runRecap_lss_comparison').value = comparisonValue
    document.getElementById('dropdown_runRecap_lss_vs').value = firstAttempt
    document.querySelectorAll('.lss_yourPB').forEach(elem => {
        elem.innerHTML = secondsToHMS(runRecap_lssFile.pbSplits[runRecap_lssFile.pbSplits.length - 1]) + ' - Your PB'
    })
    document.querySelectorAll('.lss_hide').forEach(elem => {
        show(elem)
    })
    runRecap_lssFile.attemptHistory.forEach(attempt => {
        let total = 0
        runRecap_lssFile.segmentHistory.forEach(segment => {
            const time = segment.find(segmentAttempt => segmentAttempt.id == attempt.id).gameTime
            if (time) {
                attempt.segments.push(time)
                total += time
                attempt.splits.push(total)
            }
        })
    })
    runRecap_lssFile.bestSplits = Array(runRecap_lssFile.bestSegments.length).fill(Infinity);
    runRecap_lssFile.attemptHistory.forEach(attempt => {
        attempt.splits.forEach((split, index) => {
            if (split < runRecap_lssFile.bestSplits[index]) {
                runRecap_lssFile.bestSplits[index] = split
            }
        })
    })
    // console.log(runRecap_lssFile)
    loadMarkin()
}
function generate_lss() {
    const comparison = document.getElementById('dropdown_runRecap_lss_comparison').value
    const currentRun = document.getElementById('dropdown_runRecap_lss_vs').value
    let HTMLContent = ''
    HTMLContent += `<div class='container'><table class='bigShadow'>`
    HTMLContent += `<tr style='font-size:60%'>`
    const comparisonTitle = segmentComparison(comparison)
    HTMLContent += `<td>${comparison == 'yourBest' ? 'Your BPE' : comparisonTitle}</td>`
    HTMLContent += `<td></td>`
    HTMLContent += `<td></td>`
    HTMLContent += `<td>Splits</td>`
    HTMLContent += `<td></td>`
    HTMLContent += `<td>${comparisonTitle}</td>`
    HTMLContent += `<td></td>`
    HTMLContent += `<td></td>`
    HTMLContent += `<td>Segments</td>`
    if (runRecap_savFile) {
        HTMLContent += `<td></td>`
        HTMLContent += `<td></td>`
        HTMLContent += `<td>Comparison</td>`
        HTMLContent += `<td></td>`
        HTMLContent += `<td></td>`
        HTMLContent += `<td>.sav ILs</td>`
    }
    // Offset for Follies, Mausoleum, Chalice Tutorial
    let offset = 1
    if (commBestILsCategory.name == 'DLC') {
        offset = commBestILsCategory.tabName == 'DLC C/S' ? 3 : 2
    }
    for (let index = 0; index < runRecap_lssFile.pbSplits.length && index < categories.length + offset; index++) {
        const comparisonSegment = segmentComparison(comparison, index)
        // const name = index == 0 ? 'Forest Follies' : categories[index - 1].name
        let id
        let className
        // let name
        const categoryIndex = index - offset
        if (commBestILsCategory.name == 'DLC' && index == 1) {
            id = 'other/mausoleum'
            className = ''
            // name = 'Mausoleum'
        } else if (commBestILsCategory.tabName == 'DLC C/S' && index == 2) {
            id = 'other/chalicetutorial'
            className = ''
            // name = 'Chalice Tutorial'
        } else {
            const category = index == 0 ? null : categories[categoryIndex]
            id = category ? category.info.id : 'other/forestfollies'
            className = category ? id : ''
            // name = category ? category.name : 'Forest Follies'
            if (category) {
                const nextCategory = categories[categoryIndex - 1]
                if (nextCategory && category.info.isle != nextCategory?.info.isle) {
                    HTMLContent += `<tr style='height:24px'></tr>`
                }
            }
        }
        // HTMLContent += `<td class='${className}' style='text-align:left'>${name}</td>`
        const currentSegment = segmentComparison(currentRun, index, true)
        const delta = currentSegment - comparisonSegment
        const trueDelta = Math.trunc(delta * 100) / 100
        const grade = runRecapGrade(trueDelta)
        const image = `<td class='${className}'><div class='container'>${getImage(id, 24)}</div></td>`
        // const segmentData = { name: name, image: image }
        // HTMLContent += `<tr class='${getRowColor(index)} clickable' onclick="openModal('runRecapSegment','up','${segmentData}')">`
        HTMLContent += `<tr class='${getRowColor(index)} clickable'>`
        const currentSplit = splitComparison(currentRun, index)
        const comparisonSplit = splitComparison(comparison, index)
        let comparisonContent = `<div class='container' style='gap:7px'>`
        if (comparison == 'commBest') {
            const player = players.find(player => player.name == runRecap_markin.bestSplitsPlayers[index].split('/')[0])
            comparisonContent += player ? getPlayerIcon(player, 24) : ''
        }
        comparisonContent += `<div>${secondsToHMS(comparisonSplit, true)}</div></div>`
        const splitDelta = currentSplit - comparisonSplit
        const trueSplitDelta = Math.trunc(splitDelta * 100) / 100
        HTMLContent += `<td style='padding:0 5px;font-size:80%'>${comparisonContent}</td>`
        HTMLContent += `<td style='padding:0 5px;color:${redGreen(trueSplitDelta)}'>${getDelta(trueSplitDelta)}</td>`
        HTMLContent += image
        HTMLContent += `<td class='${className}' style='padding:0 10px;font-size:120%'>${secondsToHMS(currentSplit, true)}</td>`
        HTMLContent += `<td style='padding:0 20px'></td>`
        comparisonContent = `<div class='container' style='gap:7px'>`
        if (comparison == 'commBest') {
            const player = players.find(player => player.name == runRecap_markin.bestSegmentsPlayers[index].split('/')[0])
            comparisonContent += player ? getPlayerIcon(player, 24) : ''
        }
        comparisonContent += `<div>${secondsToHMS(comparisonSegment, true)}</div></div>`
        const compareCustom = !isNaN(comparison) || comparison == 'yourPB'
        HTMLContent += `<td style='padding:0 5px;font-size:80%'>${comparisonContent}</td>`
        HTMLContent += `<td class='${compareCustom ? '' : grade.className}' style='padding:0 5px;color:${compareCustom ? redGreen(trueDelta) : ''}'>${getDelta(trueDelta)}</td>`
        HTMLContent += image
        HTMLContent += `<td class='${className}' style='padding:0 10px;font-size:120%'>${secondsToHMS(currentSegment, true)}</td>`
        HTMLContent += `<td class='${compareCustom ? '' : grade.className}' style='padding:0 5px;text-align:left'>${compareCustom ? '' : grade.grade}</td>`
        if (runRecap_savFile) {
            HTMLContent += `<td style='padding:0 20px'></td>`
            if (index >= offset) {
                const level = getCupheadLevel(categoryIndex)
                const runTime = level?.bestTime
                const comparisonTime = getComparisonTime(categoryIndex)
                const delta = runRecapDelta(runTime, comparisonTime)
                const ILgrade = runRecapGrade(delta)
                let comparisonContent = `<div class='container'>`
                if (document.getElementById('dropdown_runRecap_sav_comparison').value == 'top3Best') {
                    comparisonContent += `<div class='container'>`
                    commBestILsCategory.top3BestPlayers[categoryIndex].forEach(playerIndex => {
                        const player = players[playerIndex]
                        comparisonContent += getPlayerIcon(player, 24)
                    })
                    comparisonContent += `</div>`
                }
                comparisonContent += `<div>${secondsToHMS(comparisonTime)}</div></div>`
                HTMLContent += `<td style='padding:0 10px;font-size:80%'>${comparisonContent}</td>`
                HTMLContent += `<td class='${ILgrade.className}' style='padding:0 5px'>${runTime == nullTime ? '-' : getDelta(delta)}</td>`
                HTMLContent += image
                HTMLContent += `<td class='${className}' style='padding:0 10px;font-size:120%'>${runTime == nullTime ? '-' : secondsToHMS(runTime, true)}</td>`
                HTMLContent += `<td class='${ILgrade.className}' style='padding:0 5px;text-align:left'>${ILgrade.grade}</td>`
            } else if (index == 2) {
                HTMLContent += `<td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>`
            } else {
                const levelID = index == 0 ? forestfolliesID : mausoleumID
                const level = getCupheadLevel(levelID, true)
                HTMLContent += `<td></td>
                <td>${level.bestTime != nullTime ? image : ''}</td>
                <td>${level.bestTime != nullTime ? secondsToHMS(level.bestTime, true) : ''}</td>
                <td></td>
                <td></td>`
            }
        }
        HTMLContent += `</tr>`
    }
    HTMLContent += `</table></div>`
    document.getElementById('runRecap').innerHTML = HTMLContent
}
function redGreen(delta) {
    return delta > 0 ? 'red' : 'limegreen'
}
function segmentComparison(comparison, index, vs) {
    if (comparison == 'yourBest') {
        if (index == null) {
            return 'Your Golds'
        }
        return runRecap_lssFile.bestSegments[index]
    } else if (comparison == 'yourPB') {
        if (vs) {
            document.getElementById('runRecap_time').innerHTML = runRecapTimeElem(secondsToHMS(runRecap_lssFile.pbSplits[runRecap_lssFile.pbSplits.length - 1]))
        }
        if (index == null) {
            return 'Your PB'
        }
        return runRecap_lssFile.pbSegments[index]
    } else if (comparison == 'wr') {
        if (index == null) {
            return 'WR'
        }
        return runRecap_markin.wrSegments[index]
    } else if (comparison == 'commBest') {
        if (index == null) {
            return 'Comm Best'
        }
        return runRecap_markin.bestSegments[index]
    } else {
        const attempt = runRecap_lssFile.attemptHistory.find(attempt => attempt.id == comparison)
        if (vs) {
            document.getElementById('runRecap_time').innerHTML = runRecapTimeElem(secondsToHMS(attempt.gameTime))
        }
        if (index == null) {
            return secondsToHMS(attempt.gameTime)
        }
        return attempt.segments[index]
    }
}
function splitComparison(comparison, index) {
    if (comparison == 'yourBest') {
        return runRecap_lssFile.bestSplits[index]
    } else if (comparison == 'yourPB') {
        return runRecap_lssFile.pbSplits[index]
    } else if (comparison == 'wr') {
        return runRecap_markin.wrSplits[index]
    } else if (comparison == 'commBest') {
        return runRecap_markin.bestSplits[index]
    } else {
        return runRecap_lssFile.attemptHistory.find(attempt => attempt.id == comparison).splits[index]
    }
}
function loadMarkin(example) {
    if (runRecap_markin?.tabName != commBestILsCategory.tabName) {
        generateDropbox('lss', true)
        return gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: `1JgTjjonfC7bh4976NI4pCPeFp8LbA3HMKdvS_47-WtQ`,
            range: `'${commBestILsCategory.markin}'!B4:G23`
        }).then(response => {
            const values = response.result.values
            let lastIndex = values.length
            values.some((row, index) => {
                if (!row[0]) {
                    lastIndex = index
                }
            })
            runRecap_markin = { tabName: commBestILsCategory.tabName, bestSplits: [], bestSplitsPlayers: [], wrSplits: [], bestSegments: [], bestSegmentsPlayers: [], wrSegments: [] }
            for (let i = 0; i < lastIndex; i++) {
                runRecap_markin.bestSplits.push(convertToSeconds(values[i][0]))
                runRecap_markin.bestSplitsPlayers.push(values[i][1])
                runRecap_markin.wrSplits.push(convertToSeconds(values[i][2]))
                runRecap_markin.bestSegments.push(convertToSeconds(values[i][3]))
                runRecap_markin.bestSegmentsPlayers.push(values[i][4])
                runRecap_markin.wrSegments.push(convertToSeconds(values[i][5]))
            }
            if (example) {
                markinExample()
            } else {
                generateDropbox('lss')
            }
        })
    } else if (example) {
        markinExample()
    } else {
        generateDropbox('lss')
    }
}
function markinExample() {
    runRecap_lssFile = { pbSplits: [...runRecap_markin.wrSplits], pbSegments: [...runRecap_markin.wrSegments], bestSegments: [...runRecap_markin.bestSegments] }
    generateDropbox('lss')
    document.querySelectorAll('.lss_yourPB').forEach(elem => {
        elem.innerHTML = secondsToHMS(runRecap_markin.wrSplits[runRecap_markin.wrSplits.length - 1])
    })
}