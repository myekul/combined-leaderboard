const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: "src-cl.firebaseapp.com",
    projectId: "src-cl",
    storageBucket: "src-cl.appspot.com",
    messagingSenderId: "166725360763",
    appId: "1:166725360763:web:4940274a016bd7064796de"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, doc, addDoc, setDoc, getDocs, getDoc, collection, query, limit, where, onSnapshot, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

function getCollection() {
    return cupheadVersion + DLCnoDLC
}
function fixIndex(index) {
    if (index < 10) return index = '0' + index
    return index
}
function docRef() {
    const document = bossILindex > -1
        ? fixIndex(bossILindex + 1) + '-' + bosses[bossILindex].id
        : levelDifficulty + anyHighest
    return doc(db, getCollection(), document)
}
function reduction() {
    const obj = {};
    categories.forEach((category, categoryIndex) => {
        obj[categoryIndex] = category;
    });
    return obj
}
function connect4PlayerForTurn(turnIndex, startingPlayer = 1) {
    return turnIndex % 2 === 0 ? startingPlayer : startingPlayer === 1 ? 2 : 1
}
function connect4HasWinner(turns, startingPlayer = 1) {
    const board = Array.from({ length: 7 }, () => Array(6).fill(0))
    turns.forEach((turn, index) => {
        if (Number.isInteger(turn.x) && Number.isInteger(turn.y) && board[turn.x]?.[turn.y] === 0) {
            board[turn.x][turn.y] = connect4PlayerForTurn(index, startingPlayer)
        }
    })
    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            const player = board[x][y]
            if (!player) continue
            for (const [dx, dy] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
                if (Array.from({ length: 3 }, (_, step) => board[x + dx * (step + 1)]?.[y + dy * (step + 1)] === player).every(Boolean)) {
                    return true
                }
            }
        }
    }
    return false
}
window.firebaseUtils = {
    connect4Create: async (playerName) => {
        const gameRef = await addDoc(collection(db, 'connect4'), {
            turns: [],
            player1Name: playerName || '',
            player1Joined: true,
            player2Joined: false,
            player1LastSeenAt: serverTimestamp(),
            started: false,
            startSequence: 0,
            startingPlayer: Math.random() < 0.5 ? 1 : 2
        })
        return gameRef.id
    },
    connect4Join: async (gameId, playerName) => {
        const gameRef = doc(db, 'connect4', gameId)
        await runTransaction(db, async transaction => {
            const gameSnapshot = await transaction.get(gameRef)
            if (!gameSnapshot.exists()) throw new Error('Game not found.')
            if (gameSnapshot.data().player2Joined) throw new Error('This game already has two players.')
            transaction.update(gameRef, {
                player2Name: playerName || '',
                player2Joined: true,
                player2LastSeenAt: serverTimestamp(),
                started: true,
                startSequence: gameSnapshot.data().startSequence || 0,
                turnStartedAt: serverTimestamp()
            })
        })
    },
    connect4Subscribe: (gameId, onUpdate, onError) => {
        return onSnapshot(doc(db, 'connect4', gameId), gameSnapshot => {
            onUpdate(gameSnapshot.exists() ? gameSnapshot.data() : null)
        }, onError)
    },
    connect4Heartbeat: async (gameId, playerNumber) => {
        const gameRef = doc(db, 'connect4', gameId)
        return runTransaction(db, async transaction => {
            const gameSnapshot = await transaction.get(gameRef)
            if (!gameSnapshot.exists()) return false
            if (!gameSnapshot.data()[`player${playerNumber}Joined`]) return false
            transaction.update(gameRef, { [`player${playerNumber}LastSeenAt`]: serverTimestamp() })
            return true
        })
    },
    connect4Leave: async (gameId, playerNumber) => {
        const gameRef = doc(db, 'connect4', gameId)
        return runTransaction(db, async transaction => {
            const gameSnapshot = await transaction.get(gameRef)
            if (!gameSnapshot.exists()) return false
            transaction.update(gameRef, {
                [`player${playerNumber}Joined`]: false,
                [`player${playerNumber}LastSeenAt`]: null
            })
            return true
        })
    },
    connect4Play: async (gameId, x, playerNumber, playerName) => {
        const gameRef = doc(db, 'connect4', gameId)
        return runTransaction(db, async transaction => {
            const gameSnapshot = await transaction.get(gameRef)
            if (!gameSnapshot.exists()) throw new Error('Game not found.')
            const game = gameSnapshot.data()
            const turns = game.turns || []
            if (!game.started || !game.player1Joined || !game.player2Joined) throw new Error('Waiting for both players to join.')
            if (game.winner) throw new Error('The game is already over.')
            const startingPlayer = game.startingPlayer || 1
            if (connect4HasWinner(turns, startingPlayer)) throw new Error('The game is already over.')
            const nextPlayer = connect4PlayerForTurn(turns.length, startingPlayer)
            if (nextPlayer !== playerNumber) throw new Error('It is not your turn.')
            if (game.turnStartedAt && Date.now() >= game.turnStartedAt.toMillis() + 30000) throw new Error('Turn time expired.')
            if (!Number.isInteger(x) || x < 0 || x > 6) throw new Error('Invalid column.')
            const y = turns.filter(turn => turn.x === x).length
            if (y >= 6) throw new Error('That column is full.')
            if (turns.length >= 42) throw new Error('The board is full.')
            const updatedTurns = [...turns, { x, y }]
            const playerNameField = `player${playerNumber}Name`
            const savedPlayerName = playerName || ''
            transaction.update(gameRef, {
                turns: updatedTurns,
                [playerNameField]: savedPlayerName,
                turnStartedAt: serverTimestamp()
            })
            return { turns: updatedTurns, playerName: savedPlayerName }
        })
    },
    connect4Timeout: async (gameId) => {
        const gameRef = doc(db, 'connect4', gameId)
        return runTransaction(db, async transaction => {
            const gameSnapshot = await transaction.get(gameRef)
            if (!gameSnapshot.exists()) throw new Error('Game not found.')
            const game = gameSnapshot.data()
            const turns = game.turns || []
            if (!game.started || game.winner || connect4HasWinner(turns, game.startingPlayer || 1)) return false
            const turnStartedAt = game.turnStartedAt?.toMillis()
            if (!turnStartedAt || Date.now() < turnStartedAt + 30000) return false
            const activePlayer = connect4PlayerForTurn(turns.length, game.startingPlayer || 1)
            transaction.update(gameRef, { winner: activePlayer === 1 ? 2 : 1, endedReason: 'timeout' })
            return true
        })
    },
    connect4Restart: async (gameId, playerNumber) => {
        const gameRef = doc(db, 'connect4', gameId)
        return runTransaction(db, async transaction => {
            const gameSnapshot = await transaction.get(gameRef)
            if (!gameSnapshot.exists()) throw new Error('Game not found.')
            const game = gameSnapshot.data()
            const turns = game.turns || []
            const startingPlayer = Math.random() < 0.5 ? 1 : 2
            const gameEnded = Boolean(game.winner) || connect4HasWinner(turns, game.startingPlayer || 1) || turns.length >= 42
            if (!gameEnded) throw new Error('The game is still in progress.')
            if (![1, 2].includes(playerNumber) || !game[`player${playerNumber}Joined`]) {
                throw new Error('Only a player in this game can restart it.')
            }
            const opponentNumber = playerNumber === 1 ? 2 : 1
            const opponentLastSeen = game[`player${opponentNumber}LastSeenAt`]?.toMillis?.()
            const opponentPresent = game[`player${opponentNumber}Joined`] &&
                opponentLastSeen && Date.now() - opponentLastSeen < 30000
            if (!opponentPresent) throw new Error('Your opponent is no longer present.')
            transaction.update(gameRef, {
                turns: [],
                winner: null,
                endedReason: null,
                startingPlayer,
                startSequence: (game.startSequence || 0) + 1,
                turnStartedAt: serverTimestamp()
            })
            return startingPlayer
        })
    },
    firestoreWrite: async () => {
        const documentData = bossILindex > -1
            ? { categories: reduction() }
            : { cats: reduction() };
        setDoc(docRef(), documentData)
            .then(() => {
                if (bossILindex > -1) {
                    const boss = bosses[bossILindex]
                    console.log(boss.name + ' written')
                } else {
                    console.log('Document written');
                }
            })
            .catch((error) => {
                console.error('Error writing document: ', error);
            });
    },
    firestoreRead: async () => {
        const docSnap = await getDoc(docRef())
        if (docSnap.exists()) {
            const fieldName = bossILindex > -1 ? 'categories' : 'cats'
            categories = Object.values(await docSnap.data()[fieldName])
            resetAndGo()
            if (bossILindex > -1) {
                const boss = bosses[bossILindex]
                console.log(boss.name + ' loaded')
            } else {
                console.log('Document read')
            }
            firebaseReadSuccess()
        } else {
            console.log("Document not found");
        }
    },
    firestoreRead25: async () => {
        let numDocs = cupheadVersion == 'currentPatch' && !basegameILs ? 25 : 19
        const collectionRef = collection(db, getCollection())
        let query1 = query(collectionRef, limit(numDocs))
        if (difficultyILs && levelDifficulty == 'simple') {
            numDocs = cupheadVersion == 'currentPatch' && !basegameILs ? 22 : 17
            query1 = query(collectionRef, where('categories.0.info.time', '==', 129), limit(numDocs))
        } else if (isleIndex > -1) {
            query1 = query(collectionRef, where('categories.0.info.isle', '==', isleIndex + 1), limit(numDocs))
        } else if (groundPlane == 'ground') {
            numDocs = basegameILs ? 14 : 19
            query1 = query(collectionRef, where('categories.0.info.plane', '==', false), limit(numDocs))
        } else if (groundPlane == 'plane') {
            numDocs = basegameILs ? 5 : 6
            query1 = query(collectionRef, where('categories.0.info.plane', '==', true), limit(numDocs))
        }
        try {
            let querySnapshot = await getDocs(query1)
            firebaseReadSuccess()
            if (difficultyILs) {
                querySnapshot.forEach(doc => {
                    const data = [...Object.values(doc.data().categories)]
                    if (levelDifficulty == 'simple') {
                        categories.push(...data.slice(0, 2))
                    } else if (levelDifficulty == 'regular') {
                        categories.push(...data.slice(-4, -2))
                    } else if (levelDifficulty == 'expert') {
                        categories.push(...data.slice(-2))
                    }
                });
            } else {
                querySnapshot.forEach(doc => {
                    categories.push(...Object.values(doc.data().categories))
                });
            }
            resetAndGo()
            // const categoriesCopy = [...categories]
            // console.log(JSON.stringify(categoriesCopy)) // JSON
        } catch (error) {
            console.error("Error fetching documents: ", error)
        }
    },
    firestoreWriteMain: async () => {
        for (let i = 0; i < globalCache.length; i++) {
            if (globalCache[i].vars[0]) globalCache[i].var1 = globalCache[i].vars[0]
            if (globalCache[i].vars[1]) globalCache[i].var2 = globalCache[i].vars[1]
            const docRefMain = doc(db, gameID + '_main', String(i));
            const temp = { ...globalCache[i] }
            delete temp.vars
            await setDoc(docRefMain, temp)
                .then(() => {
                    console.log(`Document ${i + 1} written`);
                })
                .catch((error) => {
                    console.error(`Error writing document ${i}: `, error);
                });
        }
    },
    firestoreReadMain: async () => {
        const collectionRef = collection(db, gameID + '_main')
        let query1 = query(collectionRef)
        try {
            let querySnapshot = await getDocs(query1)
            globalCache = []
            querySnapshot.forEach(doc => {
                globalCache.push(doc.data());
            });
            cachedCategories()
        } catch (error) {
            console.error("Error fetching documents: ", error)
        }
    },
}
