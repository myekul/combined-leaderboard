(() => {
    const scriptURL = document.currentScript?.src || document.baseURI
    const assetRoot = new URL('../', scriptURL)
    const audioPlayers = new Map(['ready', 'knockout', 'youdied'].map(name => {
        const audio = new Audio(new URL(`sfx/cuphead/${name}.wav`, assetRoot).href)
        audio.preload = 'auto'
        audio.addEventListener('error', () => console.warn(`Could not load Cuphead ${name} sound:`, audio.currentSrc))
        return [name, audio]
    }))
    let activeEffect = null
    let audioUnlocked = false
    let audioUnlocking = false

    function unlock() {
        if (audioUnlocked || audioUnlocking) return
        audioUnlocking = true
        const unlockAttempts = [...audioPlayers.values()].map(async audio => {
            audio.muted = true
            try {
                await audio.play()
                audio.pause()
                audio.currentTime = 0
                audio.muted = false
                return true
            } catch {
                audio.muted = false
                return false
            }
        })
        Promise.all(unlockAttempts).then(results => {
            audioUnlocked = results.some(Boolean)
            audioUnlocking = false
            if (audioUnlocked) {
                document.removeEventListener('pointerdown', unlock, true)
                document.removeEventListener('keydown', unlock, true)
                document.removeEventListener('touchstart', unlock, true)
            }
        })
    }

    document.addEventListener('pointerdown', unlock, true)
    document.addEventListener('keydown', unlock, true)
    document.addEventListener('touchstart', unlock, true)

    function stop() {
        const effect = activeEffect
        if (effect) {
            activeEffect = null
            effect.timers.forEach(clearTimeout)
            if (effect.interval) clearInterval(effect.interval)
            effect.node.remove()
            effect.resolve()
        }
        for (const audio of audioPlayers.values()) {
            audio.pause()
            audio.currentTime = 0
        }
    }

    function play(name, { volume = 0.2 } = {}) {
        const normalizedName = ({ victory: 'knockout', defeat: 'youdied' })[name] || name
        if (!['ready', 'wallop', 'knockout', 'youdied'].includes(normalizedName)) {
            return Promise.reject(new Error(`Unknown Cuphead effect: ${name}`))
        }

        stop()
        return new Promise(resolve => {
            const effect = {
                node: document.createElement('div'),
                timers: [],
                interval: null,
                audio: null,
                resolve
            }
            activeEffect = effect

            const finish = () => {
                if (activeEffect !== effect) return
                activeEffect = null
                effect.timers.forEach(clearTimeout)
                if (effect.interval) clearInterval(effect.interval)
                effect.node.remove()
                resolve()
            }
            const later = (callback, delay) => {
                effect.timers.push(setTimeout(() => {
                    if (activeEffect === effect) callback()
                }, delay))
            }
            const showImage = (imageName, className = '') => {
                effect.node.replaceChildren()
                const image = document.createElement('img')
                image.className = className
                image.src = new URL(`images/cuphead/${imageName}`, assetRoot).href
                image.alt = ''
                effect.node.append(image)
                return image
            }
            const playSound = soundName => {
                effect.audio = audioPlayers.get(soundName)
                effect.audio.pause()
                effect.audio.currentTime = 0
                effect.audio.volume = Math.max(0, Math.min(1, volume))
                effect.audio.muted = false
                effect.audio.play().catch(error => console.warn(`Could not play Cuphead ${soundName} sound:`, error))
            }
            const showWallop = () => {
                effect.node.className = 'cuphead-effect-layer cuphead-effect-start'
                const image = showImage('wallop.png', 'cuphead-effect-wallop')
                let inverted = false
                later(() => {
                    effect.interval = setInterval(() => {
                        inverted = !inverted
                        image.style.filter = inverted ? 'invert(1)' : 'invert(0)'
                    }, 25)
                }, 240)
                later(() => {
                    if (effect.interval) clearInterval(effect.interval)
                    effect.interval = null
                    image.style.filter = ''
                }, 960)
                later(finish, 1200)
            }

            document.body.append(effect.node)

            if (normalizedName === 'ready') {
                effect.node.className = 'cuphead-effect-layer cuphead-effect-start'
                showImage('ready.gif', 'cuphead-effect-ready')
                playSound('ready')
                later(showWallop, 1500)
                later(finish, 2700)
                return
            }

            if (normalizedName === 'wallop') {
                showWallop()
                return
            }

            const isVictory = normalizedName === 'knockout'
            effect.node.className = `cuphead-effect-layer cuphead-effect-result ${isVictory ? 'cuphead-effect-victory' : 'cuphead-effect-defeat'}`
            showImage(`${normalizedName}.gif`)
            playSound(normalizedName)
            later(finish, 2000)
        })
    }

    window.CupheadEffects = { play, stop, unlock }
})()
