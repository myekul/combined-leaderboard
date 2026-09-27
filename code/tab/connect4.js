let connect4GameId = localStorage.getItem('connect4GameId') || ''
let connect4Player = Number(localStorage.getItem('connect4Player')) || 0
let connect4Game = null
let connect4Unsubscribe = null
let connect4PendingTurn = null
let connect4ClockEstimate = null
let connect4ClockInterval = null
let connect4PresenceInterval = null
let connect4TimeoutPending = false
let connect4TimeoutRetryAt = 0
let connect4URLJoinAttempted = false
let connect4Creating = false
let connect4PreviewTurns = []
let connect4WarningTurn = null
let connect4ResultHandled = null
let connect4StartHandled = null
let connect4StartSequence = null
const CONNECT4_TURN_LIMIT = 30000
const CONNECT4_START_SEQUENCE_DURATION = 2700
function generateConnect4() {
    connect4StartFromURL()
    connect4WatchGame()
    connect4StartClock()
    renderConnect4()
}

function connect4StartFromURL() {
    const gameId = new URLSearchParams(window.location.search).get('connect4')?.trim()
    if (!gameId || connect4URLJoinAttempted) return
    connect4URLJoinAttempted = true
    if (connect4GameId === gameId && connect4Player) return
    connect4Unsubscribe?.()
    connect4Unsubscribe = null
    connect4GameId = ''
    connect4Player = 0
    connect4Game = null
    renderConnect4()
    connect4JoinGameId(gameId)
}

function connect4StartClock() {
    if (!connect4ClockInterval) connect4ClockInterval = setInterval(connect4Tick, 250)
}

function connect4StartPresenceHeartbeat() {
    if (connect4PresenceInterval) clearInterval(connect4PresenceInterval)
    connect4PresenceInterval = null
    if (!connect4GameId || ![1, 2].includes(connect4Player)) return
    const sendHeartbeat = () => window.firebaseUtils.connect4Heartbeat(connect4GameId, connect4Player)
        .catch(error => console.warn('Could not update Connect 4 presence:', error))
    sendHeartbeat()
    connect4PresenceInterval = setInterval(sendHeartbeat, 10000)
}

function connect4ReturnToLanding() {
    connect4Unsubscribe?.()
    connect4Unsubscribe = null
    if (connect4PresenceInterval) clearInterval(connect4PresenceInterval)
    connect4PresenceInterval = null
    connect4GameId = ''
    connect4Player = 0
    connect4Game = null
    connect4PendingTurn = null
    connect4ClockEstimate = null
    connect4ResultHandled = null
    connect4StartHandled = null
    connect4StartSequence = null
    connect4Creating = false
    localStorage.removeItem('connect4GameId')
    localStorage.removeItem('connect4Player')
    connect4URLJoinAttempted = false
    window.CupheadEffects.stop()

    const url = new URL(window.location.href)
    if (url.searchParams.has('connect4')) {
        url.searchParams.delete('connect4')
        window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
    }
}

function connect4SetGame(gameId, playerNumber) {
    connect4Unsubscribe?.()
    connect4Unsubscribe = null
    connect4GameId = gameId
    connect4Player = playerNumber
    connect4Game = null
    connect4PendingTurn = null
    connect4ClockEstimate = null
    connect4Creating = false
    connect4PreviewTurns = []
    connect4WarningTurn = null
    connect4ResultHandled = null
    connect4StartHandled = null
    connect4StartSequence = null
    window.CupheadEffects.stop()
    localStorage.setItem('connect4GameId', gameId)
    localStorage.setItem('connect4Player', String(playerNumber))
    connect4WatchGame()
    renderConnect4()
}

function connect4WatchGame() {
    if (!connect4GameId) return
    connect4StartPresenceHeartbeat()
    if (connect4Unsubscribe) return
    connect4Unsubscribe = window.firebaseUtils.connect4Subscribe(connect4GameId, game => {
        if (connect4PendingTurn && (game?.turns || []).length > connect4PendingTurn.turnIndex) {
            connect4PendingTurn = null
        }
        const snapshotTurnCount = (game?.turns || []).length
        const serverTurnStartedAt = game?.turnStartedAt?.toMillis?.()
        const startSequence = game?.startSequence || 0
        if (!game) {
            connect4ClockEstimate = null
        } else if (game.started && (
            connect4ClockEstimate?.turnCount !== snapshotTurnCount ||
            connect4ClockEstimate?.startSequence !== startSequence
        )) {
            connect4ClockEstimate = {
                turnCount: snapshotTurnCount,
                startSequence,
                startedAt: serverTurnStartedAt || Date.now()
            }
        } else if (serverTurnStartedAt && connect4ClockEstimate) {
            connect4ClockEstimate.startedAt = Math.min(connect4ClockEstimate.startedAt, serverTurnStartedAt)
        }
        connect4TimeoutPending = false
        if (!game) {
            toast('This game could not be found.')
            connect4ReturnToLanding()
        } else {
            connect4Game = game
        }
        renderConnect4()
        connect4Tick()
    }, error => {
        console.error('Connect 4 subscription failed:', error)
        toast('Unable to connect to this game.')
        renderConnect4()
    })
}

async function createConnect4Game(copyInvite = false) {
    if (connect4Creating) return
    connect4Creating = true
    renderConnect4()
    try {
        const gameId = await window.firebaseUtils.connect4Create(localStorage.getItem('username'))
        connect4SetGame(gameId, 1)
        if (copyInvite) await copyConnect4InviteLink(gameId)
    } catch (error) {
        console.error('Could not create Connect 4 game:', error)
        connect4Creating = false
        toast('Could not create a game. Please try again.')
        renderConnect4()
    }
}

function connect4RenderEmptyBoard(turns = [], canPreview = false) {
    const board = connect4BoardState(turns)
    const previewPlayer = typeof players !== 'undefined'
        ? players.find(player => player.name === localStorage.getItem('username'))
        : null
    let boardHTML = `<div class='connect4-board banner' role='group'>`
    for (let x = 0; x < 7; x++) {
        const columnHeight = turns.filter(turn => turn.x === x).length
        const canPlay = canPreview && columnHeight < 6 && !connect4Creating
        boardHTML += canPreview
            ? `<button type='button' class='connect4-column${canPlay ? ' clickable' : ''}' onclick='insertPreviewChip(${x})' ${canPlay ? '' : 'disabled'}>`
            : `<div class='connect4-column'>`
        for (let y = 5; y >= 0; y--) {
            const player = board[x][y]
            const icon = player && typeof getPlayerIcon === 'function' ? getPlayerIcon(previewPlayer, 48) : ''
            const colors = player ? connect4PlayerColors(player, previewPlayer) : ''
            boardHTML += `<div class='connect4-cell player${player}' style='${colors}'>${icon}</div>`
        }
        boardHTML += canPreview ? '</button>' : '</div>'
    }
    return boardHTML + '</div>'
}

function insertPreviewChip(column) {
    if (connect4Creating || connect4GameId) return
    const height = connect4PreviewTurns.filter(turn => turn.x === column).length
    if (height >= 6) {
        playSound('locked')
        return
    }
    connect4PreviewTurns.push({ x: column, y: height })
    playSound('move')
    renderConnect4()
}

async function connect4JoinGameId(gameId) {
    try {
        await window.firebaseUtils.connect4Join(gameId, localStorage.getItem('username'))
        connect4SetGame(gameId, 2)
    } catch (error) {
        console.error('Could not join Connect 4 game:', error)
        const notFound = /not found/i.test(error.message || '')
        toast(notFound ? 'This game could not be found.' : 'Could not join this game.')
        connect4ReturnToLanding()
        renderConnect4()
    }
}

async function copyConnect4InviteLink(gameId = connect4GameId) {
    const inviteURL = new URL(window.location.href)
    inviteURL.searchParams.set('connect4', gameId)
    try {
        await navigator.clipboard.writeText(inviteURL.href)
        toast('Invite link copied')
    } catch (error) {
        toast('Could not copy invite link')
    }
}

function leaveConnect4Game() {
    if (connect4GameId && [1, 2].includes(connect4Player)) {
        window.firebaseUtils.connect4Leave(connect4GameId, connect4Player)
            .catch(error => console.warn('Could not record Connect 4 leave:', error))
    }
    connect4ReturnToLanding()
    renderConnect4()
}

async function restartConnect4Game() {
    try {
        const startingPlayer = await window.firebaseUtils.connect4Restart(connect4GameId, connect4Player)
        connect4ResultHandled = null
        connect4Game = {
            ...connect4Game,
            turns: [],
            winner: null,
            endedReason: null,
            startingPlayer,
            turnStartedAt: null
        }
        connect4ClockEstimate = { turnCount: 0, startedAt: Date.now() }
        connect4TimeoutPending = false
        connect4WarningTurn = null
        renderConnect4()
    } catch (error) {
        console.error('Could not restart Connect 4 game:', error)
        if (/opponent is no longer present/i.test(error.message || '')) {
            toast('Your opponent is no longer present.')
            leaveConnect4Game()
            return
        }
        toast(error.message || 'Could not restart the game')
        renderConnect4()
    }
}

function connect4VisibleTurns() {
    const turns = connect4Game?.turns || []
    if (!connect4PendingTurn || turns.length !== connect4PendingTurn.turnIndex) return turns
    return [...turns, { x: connect4PendingTurn.x, y: connect4PendingTurn.y }]
}

function connect4RemainingMilliseconds() {
    if (!connect4Game?.started) return CONNECT4_TURN_LIMIT
    const turnCount = (connect4Game.turns || []).length
    if (connect4ClockEstimate?.turnCount === turnCount) {
        const introDelay = turnCount === 0 ? CONNECT4_START_SEQUENCE_DURATION : 0
        return Math.max(0, connect4ClockEstimate.startedAt + introDelay + CONNECT4_TURN_LIMIT - Date.now())
    }
    const startedAt = connect4Game.turnStartedAt?.toMillis?.()
    const introDelay = turnCount === 0 ? CONNECT4_START_SEQUENCE_DURATION : 0
    return startedAt ? Math.max(0, startedAt + introDelay + CONNECT4_TURN_LIMIT - Date.now()) : CONNECT4_TURN_LIMIT
}

function connect4Tick() {
    if (!connect4Game?.started || connect4Game.winner) return
    const turns = connect4VisibleTurns()
    if (connect4Winner(connect4BoardState(turns)) || turns.length >= 42) return

    const remaining = connect4RemainingMilliseconds()
    const seconds = Math.ceil(remaining / 1000)
    const turnCount = (connect4Game.turns || []).length
    if (remaining <= 5000 && remaining > 0 && connect4WarningTurn !== turnCount) {
        connect4WarningTurn = turnCount
        playSound('win_time_loop')
    }
    const timer = document.getElementById('connect4RadialTimer')
    const timerText = document.getElementById('connect4TimerSeconds')
    if (timer) {
        timer.style.setProperty('--timer-progress', `${remaining / CONNECT4_TURN_LIMIT * 100}%`)
    }
    if (timerText) timerText.textContent = String(seconds)
    timer?.classList.toggle('warning', remaining > 0 && remaining <= 10000)

    if (remaining === 0) {
        document.querySelectorAll('.connect4-column').forEach(column => {
            column.disabled = true
            column.classList.remove('clickable')
        })
    }

    if (remaining === 0 && !connect4PendingTurn && !connect4TimeoutPending && Date.now() >= connect4TimeoutRetryAt) {
        connect4TimeoutPending = true
        window.firebaseUtils.connect4Timeout(connect4GameId).then(didTimeout => {
            if (!didTimeout) connect4TimeoutPending = false
        }).catch(error => {
            console.error('Could not record Connect 4 timeout:', error)
            toast('Could not confirm timeout. Retrying...')
            connect4TimeoutRetryAt = Date.now() + 3000
            connect4TimeoutPending = false
            renderConnect4()
        })
    }
}

function connect4PlayerForTurn(turnIndex, startingPlayer = connect4Game?.startingPlayer || 1) {
    return turnIndex % 2 === 0 ? startingPlayer : startingPlayer === 1 ? 2 : 1
}

function connect4BoardState(turns = connect4Game?.turns || []) {
    const board = Array.from({ length: 7 }, () => Array(6).fill(0))
    turns.forEach((turn, index) => {
        if (Number.isInteger(turn.x) && Number.isInteger(turn.y) && board[turn.x]?.[turn.y] === 0) {
            board[turn.x][turn.y] = connect4PlayerForTurn(index)
        }
    })
    return board
}

function connect4WinningCells(board) {
    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            const player = board[x][y]
            if (!player) continue
            for (const [dx, dy] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
                const cells = Array.from({ length: 4 }, (_, step) => ({ x: x + dx * step, y: y + dy * step }))
                if (cells.every(cell => board[cell.x]?.[cell.y] === player)) {
                    return cells
                }
            }
        }
    }
    return []
}

function connect4Winner(board) {
    const winningCell = connect4WinningCells(board)[0]
    return winningCell ? board[winningCell.x][winningCell.y] : 0
}

function connect4PlayerData(playerNumber) {
    const playerName = connect4PendingTurn?.playerNumber === playerNumber
        ? connect4PendingTurn.playerName
        : connect4Game?.[`player${playerNumber}Name`]
    return playerName && typeof players !== 'undefined' ? players.find(player => player.name === playerName) : null
}

function connect4PlayerColors(playerNumber, playerData) {
    const style = (playerData || connect4PlayerData(playerNumber))?.['name-style']
    const colors = [style?.color1, style?.color2].map(color => /^#[0-9a-f]{3,8}$/i.test(color || '') ? color : '')
    if (!colors[0] || !colors[1]) return ''
    return `--connect4-color-start:${colors[0]};--connect4-color-end:${colors[1]}`
}

function connect4PlayerHeader(playerOneIcon, playerTwoIcon, centerContent = '', playerOneClass = '', playerTwoClass = '') {
    return `
    <div class='connect4-match-header' role='group'>
        <div class='connect4-player ${playerOneClass}'>${playerOneIcon}</div>
        <div class='connect4-match-center'>${centerContent}</div>
        <div class='connect4-player ${playerTwoClass}'>${playerTwoIcon}</div>
    </div>`
}

function renderConnect4() {
    const content = document.getElementById('content')
    if (!content) return
    if (!connect4Game) {
        const landingPlayerName = localStorage.getItem('username') || 'Player 1'
        const landingPlayer = typeof players !== 'undefined'
            ? players.find(player => player.name === landingPlayerName)
            : null
        const localPlayerIcon = typeof getPlayerIcon === 'function' ? getPlayerIcon(landingPlayer, 42) : ''
        const isLanding = !connect4GameId
        const createPlayerButton = `<button type='button' class='connect4-empty-player grow' onclick='createConnect4Game(true)'>${fontAwesome('plus')}</button>`
        const invitePlayerButton = `<button type='button' class='connect4-empty-player grow' onclick='copyConnect4InviteLink()'>${fontAwesome('plus')}</button>`
        const playerOneIcon = connect4Player === 2 ? '' : localPlayerIcon
        const playerTwoIcon = isLanding ? createPlayerButton : connect4Player === 2 ? localPlayerIcon : invitePlayerButton
        content.innerHTML = `
            <div class='connect4-landing'>
                ${connect4PlayerHeader(playerOneIcon, playerTwoIcon)}
                ${connect4RenderEmptyBoard(isLanding ? connect4PreviewTurns : [], isLanding)}
            </div>`
        return
    }

    const turns = connect4VisibleTurns()
    const board = connect4BoardState(turns)
    const winningCells = new Set(connect4WinningCells(board).map(cell => `${cell.x},${cell.y}`))
    const boardWinner = connect4Winner(board)
    const winner = connect4Game.winner || boardWinner
    const resultKey = winner && !connect4PendingTurn ? `${connect4GameId}:${winner}:${turns.length}` : null
    if (resultKey && connect4ResultHandled !== resultKey) {
        connect4ResultHandled = resultKey
        window.CupheadEffects.play(Number(winner) === connect4Player ? 'knockout' : 'youdied')
    }
    const startKey = connect4Game.started
        ? `${connect4GameId}:${connect4Game.startSequence || 0}`
        : null
    if (startKey && !winner && connect4StartHandled !== startKey) {
        connect4StartHandled = startKey
        connect4StartSequence = { key: startKey }
        window.CupheadEffects.play('ready').then(() => {
            if (connect4StartSequence?.key !== startKey) return
            connect4StartSequence = null
            renderConnect4()
        })
    }
    const isDraw = turns.length >= 42 && !winner
    const nextPlayer = connect4PlayerForTurn(turns.length)
    const activePlayer = connect4PendingTurn?.playerNumber || nextPlayer
    const playerOneIcon = typeof getPlayerIcon === 'function' ? getPlayerIcon(connect4PlayerData(1), 42) : ''
    const playerTwoIcon = connect4Game.player2Joined && typeof getPlayerIcon === 'function'
        ? getPlayerIcon(connect4PlayerData(2), 42)
        : `<button type='button' class='connect4-empty-player grow' onclick='copyConnect4InviteLink()'>${fontAwesome('plus')}</button>`
    const playerOneActive = Boolean(winner || isDraw) || !connect4Game.started || (Number(winner) === 1 || activePlayer === 1)
    const playerTwoActive = Boolean(winner || isDraw) || !connect4Game.started || (Number(winner) === 2 || activePlayer === 2)
    const playerOneWon = Number(winner) === 1
    const playerTwoWon = Number(winner) === 2
    const playerOnePfp = `<span class='connect4-player-icon ${playerOneActive ? '' : 'grayedOut'}'>${playerOneIcon}${playerOneWon ? `<img class='connect4-player-crown' src='images/cuphead/crown.png' alt=''>` : ''}</span>`
    const playerTwoPfp = `<span class='connect4-player-icon ${playerTwoActive ? '' : 'grayedOut'}'>${playerTwoIcon}${playerTwoWon ? `<img class='connect4-player-crown' src='images/cuphead/crown.png' alt=''>` : ''}</span>`
    const opponentNumber = connect4Player === 1 ? 2 : 1
    const hasOpponent = connect4Game.player2Joined && [1, 2].includes(connect4Player)
    const playerOneSlot = `${playerOneWon ? `<span class='connect4-winner-label'>Winner!</span>` : ''}${hasOpponent && opponentNumber === 1
        ? `<button type='button' class='connect4-opponent-leave' onclick='leaveConnect4Game()' title='Leave game' aria-label='Leave game'>${playerOnePfp}<span class='connect4-opponent-leave-mark'>${fontAwesome('close')}</span></button>`
        : playerOnePfp}`
    const playerTwoSlot = `${hasOpponent && opponentNumber === 2
        ? `<button type='button' class='connect4-opponent-leave' onclick='leaveConnect4Game()' title='Leave game' aria-label='Leave game'>${playerTwoPfp}<span class='connect4-opponent-leave-mark'>${fontAwesome('close')}</span></button>`
        : playerTwoPfp}${playerTwoWon ? `<span class='connect4-winner-label'>Winner!</span>` : ''}`
    let boardHTML = `<div class='connect4-board banner' role='group'>`
    for (let x = 0; x < 7; x++) {
        const columnHeight = turns.filter(turn => turn.x === x).length
        const canPlayColumn = connect4Game.started && !connect4StartSequence && !winner && !isDraw && !connect4PendingTurn && connect4RemainingMilliseconds() > 0 && nextPlayer === connect4Player && columnHeight < 6
        boardHTML += `<button type='button' class='connect4-column${canPlayColumn ? ' clickable' : ''}' onclick='insertChip(${x})' ${canPlayColumn ? '' : 'disabled'}>`
        for (let y = 5; y >= 0; y--) {
            const player = board[x][y]
            const icon = player && typeof getPlayerIcon === 'function' ? getPlayerIcon(connect4PlayerData(player), 48) : ''
            const isWinningChip = winningCells.has(`${x},${y}`)
            const cellColors = player ? connect4PlayerColors(player) : ''
            boardHTML += `<div class='connect4-cell player${player}${isWinningChip ? ' connect4-winning-chip' : ''}' style='${cellColors}'>${icon}${isWinningChip ? `<span class='connect4-win-star' style='color:${cellColors.match(/--connect4-color-start:([^;]+)/)?.[1] || 'currentColor'}'>${fontAwesome('star')}</span>` : ''}</div>`
        }
        boardHTML += '</button>'
    }
    boardHTML += '</div>'
    const timerRemaining = connect4RemainingMilliseconds()
    const timerSeconds = Math.ceil(timerRemaining / 1000)
    const timerProgress = timerRemaining / CONNECT4_TURN_LIMIT * 100
    const timerHTML = connect4Game.started && !winner && !isDraw
        ? `<div id='connect4RadialTimer' class='connect4-radial-timer${timerRemaining > 0 && timerRemaining <= 10000 ? ' warning' : ''}' role='timer' style='--timer-progress:${timerProgress}%'><span id='connect4TimerSeconds'>${timerSeconds}</span></div>`
        : ''
    const restartHTML = winner || isDraw
        ? `<button type='button' class='button banner connect4-rematch' onclick='restartConnect4Game()'>Rematch</button>`
        : ''
    content.innerHTML = `
        ${connect4PlayerHeader(
            playerOneSlot,
            playerTwoSlot,
            timerHTML || restartHTML,
            playerOneWon ? 'connect4-winner-slot connect4-winner-left' : '',
            playerTwoWon ? 'connect4-winner-slot connect4-winner-right' : ''
        )}
        ${boardHTML}`
}

async function insertChip(colIndex) {
    if (!connect4Game || !connect4Player || connect4PendingTurn) return
    const turns = connect4Game.turns || []
    const nextPlayer = connect4PlayerForTurn(turns.length)
    if (nextPlayer !== connect4Player) {
        playSound('locked')
        return
    }
    const playerName = localStorage.getItem('username') || ''
    const turnIndex = turns.length
    const y = turns.filter(turn => turn.x === colIndex).length
    connect4PendingTurn = { x: colIndex, y, turnIndex, playerNumber: connect4Player, playerName }
    renderConnect4()
    try {
        const committedMove = await window.firebaseUtils.connect4Play(connect4GameId, colIndex, connect4Player, playerName)
        const currentTurnCount = (connect4Game?.turns || []).length
        if (currentTurnCount < committedMove.turns.length) {
            connect4Game = {
                ...connect4Game,
                turns: committedMove.turns,
                [`player${connect4Player}Name`]: committedMove.playerName
            }
        }
        if (currentTurnCount <= committedMove.turns.length &&
            connect4ClockEstimate?.turnCount !== committedMove.turns.length) {
            connect4ClockEstimate = { turnCount: committedMove.turns.length, startedAt: Date.now() }
        }
        if (connect4PendingTurn?.turnIndex === turnIndex) connect4PendingTurn = null
        playSound('move')
        renderConnect4()
    } catch (error) {
        console.error('Could not play Connect 4 move:', error)
        if (connect4PendingTurn?.turnIndex === turnIndex) connect4PendingTurn = null
        toast(error.message || 'Could not make that move.')
        renderConnect4()
    }
}
