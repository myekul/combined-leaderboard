function applyPenalty(player, runIndex, minimum) {
    const ideal = (player.bestScore + minimum) / 2
    const reduced = ideal
    if (mode == 'fullgame') {
        if (categories[0].name == '1.1+' || categories[0].name == 'Full Clear 1.1+') {
            if (runIndex == 2 && player.runs[0]) {
                player.explanation += '-Missing an NMG run, but has a 1.1+ run, so NMG penalty is reduced<br>'
                return reduced
            } else if (runIndex == 3 && player.runs[4]) {
                player.explanation += '-Missing a DLC run, but has a DLC+Base run, so DLC penalty is reduced<br>'
                return reduced
            } else if (runIndex == 4 && player.runs[3] && (player.runs[0] || player.runs[2])) {
                player.explanation += '-Missing a DLC+Base run, but has a 1.1+/NMG run and a DLC run, so DLC+Base penalty is reduced<br>'
                return reduced
            }
            return null
        } else if (categories[1].name == 'All Flags') {
            if (runIndex == 0 && (player.runs[1] || player.runs[2])) {
                player.explanation += '-Missing an Any% run, but has an All Flags / Full Clear run, so Any% penalty is reduced<br>'
                return reduced
            } else if (runIndex == 1 && (player.runs[2])) {
                player.explanation += '-Missing an All Flags run, but has a Full Clear run, so All Flags penalty is reduced<br>'
                return reduced
            }
            return null
        } else if (['100%', '300%'].includes(categories[1].name)) {
            if (runIndex == 0 && player.runs[1]) {
                player.explanation += '-Missing an Any% run, but has a completion run, so Any% penalty is reduced<br>'
                return reduced
            }
            return null
        } else if (categories[0].name == '120 Star') {
            if (runIndex == 3 && player.runs[4]) {
                player.explanation += '-Missing a 1-Star run, but has a 0-Star run, so 1-Star penalty is reduced<br>'
                return reduced
            }
            return null
        }
        return null
    } else {
        if (bossILindex > -1) {
            return null
        } else if (allILs || isleIndex > -1 || groundPlane) {
            const category = categories[runIndex]
            let startOffset, endOffset;
            switch (category.name) {
                case 'Simple Any%':
                    startOffset = 1;
                    endOffset = 5;
                    break;
                case 'Simple B+':
                    startOffset = -1;
                    endOffset = 4;
                    break;
                case 'Regular Any%':
                    startOffset = category.info.time == 129 ? -2 : 1;
                    endOffset = category.info.time == 129 ? 3 : 3;
                    break;
                case 'Regular A+':
                    startOffset = category.info.time == 129 ? -3 : -1;
                    endOffset = category.info.time == 129 ? 2 : 2;
                    break;
                case 'Expert Any%':
                    startOffset = category.info.time == 129 ? -4 : -2;
                    endOffset = category.info.time == 129 ? 1 : 1;
                    break;
                case 'S-Rank':
                    startOffset = category.info.time == 129 ? -5 : -3;
                    endOffset = category.info.time == 129 ? -1 : -1;
                    break;
                default:
                    return null;
            }
            const numCats = cupheadNumCats(category)
            const minim = 100 * (numCats - 1) / numCats
            const maxScore = adjacentRunsMax(player, runIndex, startOffset, endOffset);
            if (maxScore) {
                if (maxScore > minim) {
                    return (maxScore + minim) / 2;
                }
                return minim
            }
            return null;
        } else if (difficultyILs) {
            if (runIndex % 2 == 0) {
                if (player.runs[runIndex + 1]) {
                    return reduced
                } else {
                    return null
                }
            } else {
                if (player.runs[runIndex - 1]) {
                    return reduced
                } else {
                    return null
                }
            }
        }
        return null
    }
}
function adjacentRunsMax(player, runIndex, startOffset, endOffset) {
    let max = 0
    for (let i = startOffset; i <= endOffset; i++) {
        const adjacentRun = player.runs[runIndex + i]
        if (adjacentRun?.percentage > max) {
            max = adjacentRun.percentage
        }
    }
    return max ? max : null
}
function penalty(player) {
    return 1 / ((player.bestScore * ((categories.length - 1) / categories.length)))
}
function halfPenalty(player) {
    return penalty(player) / 2
}
function levelPenalty() {
    return (1 / categories.length, 2)
}