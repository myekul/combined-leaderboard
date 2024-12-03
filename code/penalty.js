function applyPenalties(player) {
    player.runs.forEach((run, runIndex) => {
        if (!run) {
            if (mode == 'fullgame') {
                if (categories[0].name == '1.1+' || categories[0].name == 'Full Clear 1.1+') {
                    if (runIndex == 0 && !player.runs[2] && player.runs[4]) {
                        player.explanation += player.name + ' is missing a 1.1+ run, but they have a DLC+Base run, so their 1.1+ penalty is halved.\n'
                    } else if (runIndex == 2 && !player.runs[0] && player.runs[4]) {
                        player.explanation += player.name + ' is missing an NMG run, but they have a DLC+Base run, so their NMG penalty is halved.\n'
                    } else if (runIndex == 2 && player.runs[0]) {
                        player.averagePercentage -= halfPenalty(player)
                        player.explanation += player.name + ' is missing an NMG run, but they have a 1.1+ run, so their NMG penalty is halved.\n'
                    } else if (runIndex == 3 && player.runs[4]) {
                        player.averagePercentage -= halfPenalty(player)
                        player.explanation += player.name + ' is missing a DLC run, but they have a DLC+Base run, so their DLC penalty is halved.\n'
                    } else if (runIndex == 4 && player.runs[3] && (player.runs[0] || player.runs[2])) {
                        player.averagePercentage -= halfPenalty(player)
                        player.explanation += player.name + ' is missing a DLC+Base run, but they have a 1.1+/NMG run and a DLC run, so their DLC+Base penalty is halved.\n'
                    } else {
                        player.averagePercentage -= penalty(player)
                    }
                } else if (categories[0].name == '120 Star') {
                    if (runIndex == 3 && player.runs[4]) {
                        player.averagePercentage -= halfPenalty(player)
                        player.explanation += player.name + ' is missing a 1-Star run, but they have a 0-Star run, so their 1-Star penalty is halved.\n'
                    } else {
                        player.averagePercentage -= penalty(player)
                    }
                } else {
                    player.averagePercentage -= penalty(player)
                }
            } else {
                if (bossILindex > -1) {
                    player.averagePercentage -= penalty(player)
                } else if (allILs || isleIndex > -1 || groundPlane) {
                    const category = categories[runIndex]
                    if (category.name == 'Simple Any%' && (player.runs[runIndex + 1] || player.runs[runIndex + 2] || player.runs[runIndex + 3] || player.runs[runIndex + 4] || player.runs[runIndex + 5])) {
                        player.averagePercentage -= penalty(player)
                    } else if (category.name == 'Simple B+' && (player.runs[runIndex - 1] || player.runs[runIndex + 1] || player.runs[runIndex + 2] || player.runs[runIndex + 3] || player.runs[runIndex + 4])) {
                        player.averagePercentage -= penalty(player)
                    } else if (category.name == 'Regular Any%' && (player.runs[runIndex - 2] || player.runs[runIndex - 1] || player.runs[runIndex + 1] || player.runs[runIndex + 2] || player.runs[runIndex + 3])) {
                        if (category.info.time == 129) {
                            player.averagePercentage -= penalty(player)
                        } else {
                            if (player.runs[runIndex + 1] || player.runs[runIndex + 2] || player.runs[runIndex + 3]) {
                                player.averagePercentage -= penalty(player)
                            } else {
                                player.averagePercentage -= levelPenalty(player)
                            }
                        }
                    } else if (category.name == 'Regular A+' && (player.runs[runIndex - 3] || player.runs[runIndex - 2] || player.runs[runIndex - 1] || player.runs[runIndex + 1] || player.runs[runIndex + 2])) {
                        if (category.info.time == 129) {
                            player.averagePercentage -= penalty(player)
                        } else {
                            if (player.runs[runIndex - 1] || player.runs[runIndex + 1] || player.runs[runIndex + 2]) {
                                player.averagePercentage -= penalty(player)
                            } else {
                                player.averagePercentage -= levelPenalty(player)
                            }
                        }
                    } else if (category.name == 'Expert Any%' && (player.runs[runIndex - 4] || player.runs[runIndex - 3] || player.runs[runIndex - 2] || player.runs[runIndex - 1] || player.runs[runIndex + 1])) {
                        if (category.info.time == 129) {
                            player.averagePercentage -= penalty(player)
                        } else {
                            if (player.runs[runIndex - 2] || player.runs[runIndex - 1] || player.runs[runIndex + 1]) {
                                player.averagePercentage -= penalty(player)
                            } else {
                                player.averagePercentage -= levelPenalty(player)
                            }
                        }
                    } else if (category.name == 'S-Rank' && (player.runs[runIndex - 5] || player.runs[runIndex - 4] || player.runs[runIndex - 3] || player.runs[runIndex - 2] || player.runs[runIndex - 1])) {
                        if (category.info.time == 129) {
                            player.averagePercentage -= penalty(player)
                        } else {
                            if (player.runs[runIndex - 3] || player.runs[runIndex - 2] || player.runs[runIndex - 1]) {
                                player.averagePercentage -= penalty(player)
                            } else {
                                player.averagePercentage -= levelPenalty(player)
                            }
                        }
                    } else {
                        player.averagePercentage -= levelPenalty(player)
                    }
                } else if (difficultyILs) {
                    if (runIndex % 2 == 0) {
                        if (player.runs[runIndex + 1]) {
                            player.averagePercentage -= penalty(player)
                        } else {
                            player.averagePercentage -= levelPenalty(player)
                        }
                    } else {
                        if (player.runs[runIndex - 1]) {
                            player.averagePercentage -= penalty(player)
                        } else {
                            player.averagePercentage -= levelPenalty(player)
                        }
                    }
                } else {
                    player.averagePercentage -= levelPenalty(player)
                }
            }
        }
    })
}
function penalty(player) {
    return (player.averagePercentage * (1 / categories.length)) / categories.length
}
function halfPenalty(player) {
    return ((player.averagePercentage * (1 / categories.length)) / categories.length) / 2
}
function levelPenalty(player) {
    return (player.averagePercentage * (1 / categories.length))
}