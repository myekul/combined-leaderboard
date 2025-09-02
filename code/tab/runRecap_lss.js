const NUM_SPLITS = 10
function convertDateToISO(dateString) {
    const [month, day, year] = dateString.slice(0, 10).split('/')
    const date = new Date(`${year}-${month}-${day}`)
    return date.toISOString().split('T')[0]
}
function read_lss(content) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "application/xml");
    // console.log(xmlDoc)
    runRecap_lssFile = {}
    runRecap_lssFile = { bestSplits: [], bestSegments: [], sob: [], pbSplits: [], pbSegments: [], attemptHistory: [] }
    runRecap_lssFile.attemptCount = xmlDoc.querySelector('AttemptCount').innerHTML
    const allAttempts = Array.from(xmlDoc.querySelectorAll("AttemptHistory > Attempt"))
    const finishedAttempts = allAttempts.filter(attempt => attempt.querySelector("GameTime"));
    const attemptHistory = finishedAttempts.map(attempt => {
        return {
            id: attempt.getAttribute("id"),
            date: convertDateToISO(attempt.getAttribute("ended")),
            gameTime: convertToSeconds(attempt.querySelector("GameTime").textContent.slice(3)),
            segments: [],
            splits: []
        }
    })
    runRecap_lssFile.attemptSet = {}
    allAttempts.forEach(attempt => {
        runRecap_lssFile.attemptSet[attempt.id] = {
            segments: [],
            splits: [],
            date: convertDateToISO(attempt.getAttribute("ended"))
        }
    })
    const segments = xmlDoc.querySelectorAll("Segment");
    segments.forEach((segment, index) => {
        const bestSegmentTime = convertToSeconds(segment.querySelector("BestSegmentTime GameTime")?.textContent.slice(3))
        runRecap_lssFile.bestSegments.push(bestSegmentTime)
        runRecap_lssFile.sob.push(index == 0 ? bestSegmentTime : runRecap_lssFile.sob[index - 1] + bestSegmentTime)
        const splitTime = convertToSeconds(segment.querySelector('SplitTimes SplitTime GameTime')?.textContent.slice(3))
        runRecap_lssFile.pbSplits.push(splitTime)
        let segmentTime = splitTime
        if (index > 0) {
            const prevSplitTime = runRecap_lssFile.pbSplits[index - 1]
            segmentTime = splitTime - prevSplitTime
        }
        runRecap_lssFile.pbSegments.push(segmentTime)
        const segmentAttempts = Array.from(segment.querySelectorAll('SegmentHistory > Time'))
        segmentAttempts.forEach(attempt => {
            const timeMode = attempt.querySelector("GameTime") ? 'GameTime' : 'RealTime'
            const id = attempt.getAttribute("id")
            if (attempt.hasChildNodes()) {
                const segmentTime = convertToSeconds(attempt.querySelector(timeMode).textContent.slice(3))
                runRecap_lssFile.attemptSet[id]?.segments.push(segmentTime)
            } else {
                runRecap_lssFile.attemptSet[id]?.segments.push(null)
            }
        })
    })
    runRecap_lssFile.segmentHistory = Array.from({ length: runRecap_lssFile.bestSegments.length }, () => []);
    Object.entries(runRecap_lssFile.attemptSet).forEach(([key, attempt]) => {
        attempt.segments?.forEach((segment, index) => {
            let split = segment
            if (index > 0) {
                const prevSplit = attempt.splits[index - 1]
                if (prevSplit) {
                    split = prevSplit + segment
                } else {
                    split = attempt.splits[index - 2] + segment
                }
                if (!split) split = segment
                if (split == prevSplit) split = null
            }
            attempt.splits.push(split);
            if (segment && !(index > 0 && attempt.splits[index - 1] == null)) {
                runRecap_lssFile.segmentHistory[index].push({ id: key, segment: segment, split: split });
            }
        });
    });
    runRecap_lssFile.theorySegments = []
    runRecap_lssFile.theorySplits = []
    runRecap_lssFile.bestSplits = Array(runRecap_lssFile.bestSegments.length).fill(Infinity);
    runRecap_lssFile.segmentHistory.forEach((segment, index) => {
        segment.sort((a, b) => a.segment - b.segment)
        let sum = 0
        segment.slice(0, NUM_SPLITS).forEach(attempt => {
            sum += attempt.segment
        })
        const segmentTime = sum / NUM_SPLITS
        runRecap_lssFile.theorySegments.push(segmentTime)
        runRecap_lssFile.theorySplits.push(index == 0 ? segmentTime : runRecap_lssFile.theorySplits[index - 1] + segmentTime)
        segment.forEach(attempt => {
            if (attempt.split < runRecap_lssFile.bestSplits[index]) {
                runRecap_lssFile.bestSplits[index] = attempt.split
            }
        })
    })
    attemptHistory.forEach(attempt => {
        if (runRecap_lssFile.attemptSet[attempt.id]) {
            runRecap_lssFile.attemptHistory.push(attempt)
        }
    })
    let HTMLContent = ''
    const reverseAttempts = runRecap_lssFile.attemptHistory.reverse()
    let firstAttempt = 0
    const pbTime = runRecap_lssFile.pbSplits[runRecap_lssFile.pbSplits.length - 1]
    let prevPB = Infinity
    let prevPBIndex = 0
    reverseAttempts.forEach((attempt, index) => {
        if (index == 0) firstAttempt = attempt.id
        HTMLContent += `<option value="${attempt.id}">${secondsToHMS(attempt.gameTime)} - ${attempt.date}</option>`
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
    document.getElementById('dropdown_runRecap_lss_current').value = firstAttempt
    document.getElementById('dropdown_runRecap_lss_comparison').value = comparisonValue
    document.querySelectorAll('.lss_yourPB').forEach(elem => {
        elem.innerHTML = secondsToHMS(runRecap_lssFile.pbSplits[runRecap_lssFile.pbSplits.length - 1]) + ' - Your PB'
    })
    runRecap_lssFile.attemptHistory.forEach(attempt => {
        let total = 0
        runRecap_lssFile.attemptSet[attempt.id].segments.forEach(segment => {
            attempt.segments.push(segment)
            total += segment
            attempt.splits.push(total)
        })
    })
    generateDropbox('lss')
    // console.log(runRecap_lssFile)
}
function runRecap_lss_splitInfo() {
    splitInfo = []
    for (let index = 0; index < runRecap_markin.bestSplits.length && index < categories.length + getOffset(); index++) {
        const categoryIndex = index - getOffset()
        if (index == 0) {
            splitInfo.push({ id: 'other/forestfollies', name: 'Forest Follies', isle: null })
        } else if (index == 1 && ['DLC', 'DLC+Base'].includes(commBestILsCategory.name)) {
            splitInfo.push({ id: 'other/mausoleum', name: 'Mausoleum', isle: null })
        } else if (index == 2 && commBestILsCategory.shot1 == 'charge') {
            splitInfo.push({ id: 'other/chalicetutorial', name: 'Chalice Tutorial', isle: null })
        } else {
            const category = categories[categoryIndex]
            if (category) {
                splitInfo.push({ id: category.info.id, name: category.name, isle: category.info.isle })
            }
        }
    }
}
function getOffset() {
    let offset = 1
    if (['DLC', 'DLC+Base'].includes(commBestILsCategory.name)) {
        offset = commBestILsCategory.shot1 == 'charge' ? 3 : 2
    }
    return offset
}
function generate_lss() {
    runRecap_lss_splitInfo()
    const currentRun = document.getElementById('dropdown_runRecap_lss_current').value
    const comparison = document.getElementById('dropdown_runRecap_lss_comparison').value
    runRecapTheoretical = ['yourBest', 'sob', 'theoryRun'].includes(currentRun)
    let HTMLContent = ''
    HTMLContent += `<div class='container'><table class='bigShadow'>`
    HTMLContent += `<tr style='font-size:60%'>`
    const comparisonTitle = segmentComparison(comparison)
    HTMLContent += `<td></td>`
    HTMLContent += `<td>Splits</td>`
    HTMLContent += `<td></td>`
    let splitTitle = comparisonTitle
    if (comparison == 'yourBest') {
        splitTitle = 'Your BPE'
    } else if (comparison == 'sob') {
        splitTitle = 'Your SoB'
    }
    HTMLContent += `
    <td>${splitTitle}</td>
    <td></td>
    <td></td>
    <td></td>
    <td>Segments</td>
    <td></td>
    <td>${comparisonTitle}</td>`
    if (runRecap_savFile) {
        HTMLContent += `
        <td></td>
        <td></td>
        <td></td>
        <td>.sav ILs</td>
        <td></td>
        <td>Comparison</td>`
    }
    // Offset for Follies, Mausoleum, Chalice Tutorial
    const splits = []
    const deltas = []
    for (let index = 0; index < runRecap_lssFile.pbSplits.length && index < categories.length + getOffset(); index++) {
        const currentSegment = segmentComparison(currentRun, index, true)
        const comparisonSegment = segmentComparison(comparison, index)
        const categoryIndex = index - getOffset()
        const delta = currentSegment - comparisonSegment
        const trueDelta = Math.trunc(delta * 100) / 100
        const grade = runRecapGrade(trueDelta)
        const className = splitInfo[index].id
        const image = `<td class='${className}'><div class='container'>${getImage(className, 24)}</div></td>`
        HTMLContent += `<tr class='${getRowColor(index)} ${!runRecapExample ? `clickable' onclick='openModalCL("runRecapSegment",false,${index})` : ''}'>`
        // HTMLContent += `<tr class='${getRowColor(index)} clickable'>`
        const currentSplit = splitComparison(currentRun, index)
        splits.push(currentSplit)
        const comparisonSplit = splitComparison(comparison, index)
        const splitDelta = currentSplit - comparisonSplit
        const trueSplitDelta = Math.trunc(splitDelta * 100) / 100
        deltas.push(trueSplitDelta)
        HTMLContent += image
        HTMLContent += `<td class='${className}' style='padding:0 10px;font-size:120%'>${secondsToHMS(currentSplit, true)}</td>`
        HTMLContent += `<td style='padding:0 5px;font-size:90%;${redGreen(trueSplitDelta)}'>${getDelta(trueSplitDelta)}</td>`
        HTMLContent += `<td style='padding:0 5px;'>${comparisonContent('split', index, comparisonSplit, comparison)}</td>`
        HTMLContent += `<td style='padding:0 20px'></td>`
        const compareCustom = !isNaN(comparison) || comparison == 'yourPB'
        HTMLContent += `<td class='${compareCustom ? '' : grade.className}' style='padding:0 5px;text-align:left'>${compareCustom ? '' : grade.grade}</td>`
        HTMLContent += image
        HTMLContent += `<td class='${className}' style='padding:0 10px;font-size:120%'>${secondsToHMS(currentSegment, true)}</td>`
        HTMLContent += `<td class='${compareCustom ? '' : grade.className}' style='padding:0 5px;font-size:90%;${compareCustom ? redGreen(trueDelta) : ''}'>${getDelta(trueDelta)}</td>`
        HTMLContent += `<td style='padding:0 5px;'>${comparisonContent('segment', index, comparisonSegment, comparison)}</td>`
        if (runRecap_savFile) {
            HTMLContent += `<td style='padding:0 20px'></td>`
            if (index >= getOffset()) {
                const level = getCupheadLevel(categoryIndex)
                const runTime = level?.bestTime
                const comparisonTime = getComparisonTime(categoryIndex)
                const delta = runRecapDelta(runTime, comparisonTime)
                const ILgrade = runRecapGrade(delta)
                let comparisonContents = `<div class='container'>`
                if (document.getElementById('dropdown_runRecap_sav_comparison').value == 'topBest') {
                    comparisonContents += `<div class='container' style='padding-right:6px'>`
                    commBestILsCategory.topBestPlayers[categoryIndex].forEach(playerIndex => {
                        const player = players[playerIndex]
                        comparisonContents += getPlayerIcon(player, 24)
                    })
                    comparisonContents += `</div>`
                }
                comparisonContents += `<div>${secondsToHMS(comparisonTime)}</div></div>`
                HTMLContent += `<td class='${ILgrade.className}' style='padding:0 5px;text-align:left'>${ILgrade.grade}</td>`
                HTMLContent += image
                HTMLContent += `<td class='${className}' style='padding:0 10px;font-size:120%'>${runTime == nullTime ? '-' : secondsToHMS(runTime, true)}</td>`
                HTMLContent += `<td class='${ILgrade.className}' style='padding:0 5px;font-size:90%'>${runTime == nullTime ? '-' : getDelta(delta)}</td>`
                HTMLContent += `<td style='padding:0 10px;font-size:90%;color:var(--gray)'>${comparisonContents}</td>`
            } else if (index == 2) {
                HTMLContent += `
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>`
            } else {
                const levelID = index == 0 ? runNguns['forestfollies'] : mausoleumID
                const level = getCupheadLevel(levelID, true)
                HTMLContent += `
                <td>${level.bestTime != nullTime ? image : ''}</td>
                <td>${level.bestTime != nullTime ? secondsToHMS(level.bestTime, true) : ''}</td>
                <td></td>
                <td></td>`
            }
        }
        HTMLContent += `</tr>`
        if (index >= getOffset()) {
            const category = categories[categoryIndex]
            const nextCategory = categories[categoryIndex + 1]
            if (nextCategory && category.info.isle != nextCategory?.info.isle) {
                HTMLContent += `<tr style='height:20px'></tr>`
            }
        }

    }
    HTMLContent += `</table></div>`
    document.getElementById('runRecap').innerHTML = HTMLContent
    runRecap_chart(splits, deltas, true)
}
function comparisonContent(type, index, time, comparison) {
    const source = type == 'split' ? 'bestSplitsPlayers' : 'bestSegmentsPlayers'
    let HTMLContent = `<div class='container' style='gap:7px;justify-content:left;color:var(--gray);font-size:90%'>`
    if (comparison == null || comparison == 'commBest') {
        const player = players.find(player => player.name == runRecap_markin[source][index].split('/')[0])
        HTMLContent += player ? getPlayerIcon(player, 24) : ''
    }
    HTMLContent += `<div>${secondsToHMS(time, true)}</div></div>`
    return HTMLContent
}
function segmentComparison(comparison, index, current) {
    if (comparison == 'yourBest') {
        if (current) {
            setRunRecapTime('bestSplits')
        }
        if (index == null) {
            return 'Your Golds'
        }
        return runRecap_lssFile.bestSegments[index]
    } else if (comparison == 'sob') {
        if (current) {
            setRunRecapTime('sob')
        }
        if (index == null) {
            return 'Your Golds'
        }
        return runRecap_lssFile.bestSegments[index]
    } else if (comparison == 'theoryRun') {
        if (current) {
            setRunRecapTime('theorySplits')
        }
        if (index == null) {
            return 'Theory'
        }
        return runRecap_lssFile.theorySegments[index]
    } else if (comparison == 'yourPB') {
        if (current) {
            setRunRecapTime('pbSplits')
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
    } else if (comparison == 'commSoB') {
        if (index == null) {
            return 'Comm SoB'
        }
        return runRecap_markin.bestSegments[index]
    } else {
        const attempt = runRecap_lssFile.attemptHistory.find(attempt => attempt.id == comparison)
        if (current) {
            document.getElementById('runRecap_time').innerHTML = runRecapTimeElem(secondsToHMS(attempt.gameTime))
        }
        if (index == null) {
            return secondsToHMS(attempt.gameTime)
        }
        return attempt.segments[index]
    }
}
function setRunRecapTime(src) {
    document.getElementById('runRecap_time').innerHTML = runRecapTimeElem(secondsToHMS(runRecap_lssFile[src].at(-1)))
}
function splitComparison(comparison, index) {
    if (comparison == 'yourBest') {
        return runRecap_lssFile.bestSplits[index]
    } else if (comparison == 'sob') {
        return runRecap_lssFile.sob[index]
    } else if (comparison == 'theoryRun') {
        return runRecap_lssFile.theorySplits[index]
    } else if (comparison == 'yourPB') {
        return runRecap_lssFile.pbSplits[index]
    } else if (comparison == 'wr') {
        return runRecap_markin.wrSplits[index]
    } else if (comparison == 'commBest') {
        return runRecap_markin.bestSplits[index]
    } else if (comparison == 'commSoB') {
        return runRecap_markin.commSoB[index]
    } else {
        return runRecap_lssFile.attemptHistory.find(attempt => attempt.id == comparison).splits[index]
    }
}
function loadMarkin() {
    const values = markinSheets[commBestILsCategory.markin]
    runRecap_markin = { tabName: commBestILsCategory.tabName, bestSplits: [], bestSplitsPlayers: [], wrSplits: [], bestSegments: [], bestSegmentsPlayers: [], wrSegments: [], commSoB: [] }
    values.forEach((row, index) => {
        runRecap_markin.bestSplits.push(convertToSeconds(row.values[0].formattedValue))
        runRecap_markin.bestSplitsPlayers.push(row.values[1].formattedValue)
        runRecap_markin.wrSplits.push(convertToSeconds(row.values[2].formattedValue))
        runRecap_markin.bestSegments.push(convertToSeconds(row.values[3].formattedValue))
        runRecap_markin.bestSegmentsPlayers.push(row.values[4].formattedValue)
        runRecap_markin.wrSegments.push(convertToSeconds(row.values[5].formattedValue))
        const bestSegment = runRecap_markin.bestSegments[index]
        runRecap_markin.commSoB.push(index == 0 ? bestSegment : runRecap_markin.commSoB[index - 1] + bestSegment)
    })
    runRecap_lss_splitInfo()
    prepareData()
}
function markinExample() {
    runRecap_lssFile.pbSplits = [...runRecap_markin.wrSplits]
    runRecap_lssFile.pbSegments = [...runRecap_markin.wrSegments]
    runRecap_lssFile.bestSegments = [...runRecap_markin.bestSegments]
    generateDropbox('lss')
    document.querySelectorAll('.lss_yourPB').forEach(elem => {
        elem.innerHTML = secondsToHMS(runRecap_markin.wrSplits[runRecap_markin.wrSplits.length - 1])
    })
}
function runRecapSegment(index) {
    const split = splitInfo[index]
    let HTMLContent = ''
    HTMLContent += `<div class='container ${split.id}' style='gap:10px;margin-top:10px;padding:5px;border-radius:5px'>`
    HTMLContent += getImage(split.id, 36)
    HTMLContent += `<div style='font-size:20px;font-weight:bold'>${split.name}</div>`
    HTMLContent += `</div>`
    document.getElementById('modal-subtitle').innerHTML = HTMLContent
    HTMLContent = ''
    const thisSegment = runRecap_lssFile.segmentHistory[index].length
    let prevSegment = runRecap_lssFile.segmentHistory[index - 1]?.length
    if (!prevSegment) {
        prevSegment = 0
    }
    const numResets = Math.abs(prevSegment - thisSegment)
    const segmentAttemptCount = index == 0 ? runRecap_lssFile.attemptCount : thisSegment
    const resetRate = getPercentage(numResets / segmentAttemptCount)
    const display = resetRate ? displayPercentage(resetRate) : 0
    const grade = getLetterGrade(100 - resetRate)
    HTMLContent += `<div class='container' style='gap:8px'>`
    HTMLContent += `<div>Reset rate:</div>`
    HTMLContent += `<div class='${grade.className}' style='border-radius:5px;padding:5px;${grade.grade == 'F' ? 'color:white' : ''}'>${display}%</div>`
    HTMLContent += `<div>=</div>`
    HTMLContent += `<div style='font-size:80%'>
        <div class='container'>${numResets} reset${numResets == 1 ? '' : 's'}</div>
        <div style='margin: 5px 0;border-bottom: 2px solid white;width: 100px;'></div>
        <div class='container'>${segmentAttemptCount} attempts</div>
    </div>`
    HTMLContent += `</div>`
    HTMLContent += `<div class='container' style='gap:20px'>`
    const sortedSplits = runRecap_lssFile.segmentHistory[index].sort((a, b) => a.split - b.split)
    HTMLContent += splitSegmentInfo(sortedSplits, index, 'Split')
    const sortedSegments = runRecap_lssFile.segmentHistory[index].sort((a, b) => a.segment - b.segment)
    HTMLContent += splitSegmentInfo(sortedSegments, index, 'Segment')
    HTMLContent += `</div>`
    HTMLContent += `</div>`
    return HTMLContent
}
function splitSegmentInfo(array, index, type) {
    const split = splitInfo[index]
    let HTMLContent = ''
    HTMLContent += `<div style='padding-top:15px'>`
    HTMLContent += `<table>
    <tr class='gray'><th colspan=6>Your Top 10 ${type}s</th></tr>`
    let sum = 0
    array.slice(0, NUM_SPLITS).forEach((arrayAttempt, segmentIndex) => {
        const run = runRecap_lssFile.attemptHistory.find(attempt => attempt.id == arrayAttempt.id)
        const date = runRecap_lssFile.attemptSet[arrayAttempt.id].date
        const trophy = getTrophy(segmentIndex + 1)
        const time = arrayAttempt[type.toLowerCase()]
        sum += time
        HTMLContent += `<tr class='${getRowColor(segmentIndex)}'>
        <td style='font-size:70%;text-align:right;padding:0 5px'>${date ? daysAgo(getDateDif(new Date(), new Date(date))) : ''}</td>
        <td class='${placeClass(segmentIndex + 1)}' style='font-size:70%;padding:0 3px'>${trophy ? `<div class='container trophy'>${trophy}` : segmentIndex + 1}</td>
        <td class='${split.id}' style='padding:0 5px'>${secondsToHMS(time, true)}</td>
        <td class='${run ? commBestILsCategory.className : ''}' style='font-size:80%;padding:0 5px'>${run ? secondsToHMS(run.gameTime, true) : ''}</td>
        <td style='font-size:70%;padding:0 5px'>${date ? date : ''}</td>
        <td style='font-size:50%'>${arrayAttempt.id}</td>
        </tr>`
    })
    HTMLContent += `</table>`
    HTMLContent += `<div class='container' style='padding-top:15px'><table><tr class='gray'><th>Your Top 10 Average</th></tr><tr><td class='${split.id}'>${secondsToHMS(sum / NUM_SPLITS, true)}</td></tr></table></div>`
    HTMLContent += `<div class='container' style='padding-top:15px;gap:8px'>`
    HTMLContent += `<table>
        <tr class='gray'><th colspan=2>Comm Best</th></tr>
        <tr>
            <td>${getPlayerIcon(players.find(player => player.name == runRecap_markin[type == 'Split' ? 'bestSplitsPlayers' : 'bestSegmentsPlayers'][index].split('/')[0]), 24)}</td>
            <td class='${split.id}' style='padding:0 5px'>${secondsToHMS(runRecap_markin[type == 'Split' ? 'bestSplits' : 'bestSegments'][index], true)}</td>
        </tr>
    </table>`
    HTMLContent += `<table>
        <tr class='gray'><th colspan=2>World Record</th></tr>
        <tr>
            <td>${getPlayerIcon(players[0], 24)}</td>
            <td class='${split.id}' style='padding:0 5px'>${secondsToHMS(runRecap_markin[type == 'Split' ? 'wrSplits' : 'wrSegments'][index], true)}</td>
        </tr>
    </table>`
    HTMLContent += `</div></div>`
    return HTMLContent
}