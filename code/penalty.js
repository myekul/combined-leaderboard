function applyPenalty(player, runIndex, minimum) {
    const ideal = (player.bestScore + minimum) / 2
    const reduced = (player.bestScore + ideal) / 2
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
            player.score -= penalty(player)
        } else if (allILs || isleIndex > -1 || groundPlane) {
            const category = categories[runIndex]
            if (category.name == 'Simple Any%' && (player.runs[runIndex + 1] || player.runs[runIndex + 2] || player.runs[runIndex + 3] || player.runs[runIndex + 4] || player.runs[runIndex + 5])) {
                player.score -= penalty(player)
            } else if (category.name == 'Simple B+' && (player.runs[runIndex - 1] || player.runs[runIndex + 1] || player.runs[runIndex + 2] || player.runs[runIndex + 3] || player.runs[runIndex + 4])) {
                player.score -= penalty(player)
            } else if (category.name == 'Regular Any%' && (player.runs[runIndex - 2] || player.runs[runIndex - 1] || player.runs[runIndex + 1] || player.runs[runIndex + 2] || player.runs[runIndex + 3])) {
                if (category.info.time == 129) {
                    player.score -= penalty(player)
                } else {
                    if (player.runs[runIndex + 1] || player.runs[runIndex + 2] || player.runs[runIndex + 3]) {
                        player.score -= penalty(player)
                    } else {
                        player.score -= levelPenalty(player)
                    }
                }
            } else if (category.name == 'Regular A+' && (player.runs[runIndex - 3] || player.runs[runIndex - 2] || player.runs[runIndex - 1] || player.runs[runIndex + 1] || player.runs[runIndex + 2])) {
                if (category.info.time == 129) {
                    player.score -= penalty(player)
                } else {
                    if (player.runs[runIndex - 1] || player.runs[runIndex + 1] || player.runs[runIndex + 2]) {
                        player.score -= penalty(player)
                    } else {
                        player.score -= levelPenalty(player)
                    }
                }
            } else if (category.name == 'Expert Any%' && (player.runs[runIndex - 4] || player.runs[runIndex - 3] || player.runs[runIndex - 2] || player.runs[runIndex - 1] || player.runs[runIndex + 1])) {
                if (category.info.time == 129) {
                    player.score -= penalty(player)
                } else {
                    if (player.runs[runIndex - 2] || player.runs[runIndex - 1] || player.runs[runIndex + 1]) {
                        player.score -= penalty(player)
                    } else {
                        player.score -= levelPenalty(player)
                    }
                }
            } else if (category.name == 'S-Rank' && (player.runs[runIndex - 5] || player.runs[runIndex - 4] || player.runs[runIndex - 3] || player.runs[runIndex - 2] || player.runs[runIndex - 1])) {
                if (category.info.time == 129) {
                    player.score -= penalty(player)
                } else {
                    if (player.runs[runIndex - 3] || player.runs[runIndex - 2] || player.runs[runIndex - 1]) {
                        player.score -= penalty(player)
                    } else {
                        player.score -= levelPenalty(player)
                    }
                }
            } else {
                player.score -= levelPenalty(player)
            }
        } else if (difficultyILs) {
            if (runIndex % 2 == 0) {
                if (player.runs[runIndex + 1]) {
                    player.score -= penalty(player)
                } else {
                    player.score -= levelPenalty(player)
                }
            } else {
                if (player.runs[runIndex - 1]) {
                    player.score -= penalty(player)
                } else {
                    player.score -= levelPenalty(player)
                }
            }
        } else {
            player.score -= levelPenalty(player)
        }
    }
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