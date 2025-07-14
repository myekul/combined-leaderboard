const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: "src-cl.firebaseapp.com",
    projectId: "src-cl",
    storageBucket: "src-cl.appspot.com",
    messagingSenderId: "166725360763",
    appId: "1:166725360763:web:4940274a016bd7064796de"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, doc, addDoc, setDoc, getDocs, getDoc, collection, query, limit, where } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAnalytics, logEvent, setUserProperties } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js"

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const analytics = getAnalytics(app)
logEvent(analytics, 'page_view')

function getCollection() {
    return cupheadVersion + DLCnoDLC
}
function fixIndex(index) {
    if (index < 10) {
        return index = '0' + index
    }
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
window.firebaseUtils = {
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
    screenView: () => {
        logEvent(analytics, 'screen_view', {
            firebase_screen: page,
            firebase_screen_class: gameID + '_' + mode
        })
    },
    firestoreWriteMain: async () => {
        for (let i = 0; i < globalCache.length; i++) {
            const docRefMain = doc(db, gameID + '_main', String(i));
            await setDoc(docRefMain, globalCache[i])
                .then(() => {
                    console.log(`Document ${i} written`);
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
            if (mode != 'commBestILs') {
                cachedCategories()
            } else {
                extraCategory.players = globalCache[commBestILsCategory.category].players
                extraCategory.runs = globalCache[commBestILsCategory.category].runs
                gapi.load("client", loadClient);
            }
        } catch (error) {
            console.error("Error fetching documents: ", error)
        }
    },
    firestoreWriteRR: async () => {
        const obj = {
            sav: runRecap_savFile,
            username: localStorage.getItem('username'),
            category: commBestILsCategory.name,
            time: runRecapTime,
            date: new Date()
        }
        console.log(obj)
        // await addDoc(collection(db, 'runRecap'), obj)
        //     .then(() => {
        //         console.log(`Run Recap written`);
        //     })
        //     .catch((error) => {
        //         console.error(`Error writing document ${i}: `, error);
        //     });
    },
}