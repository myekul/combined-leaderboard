document.querySelectorAll('#home_options input').forEach(input => {
    input.addEventListener('click', () => {
        action()
    });
})
window.addEventListener('hashchange', () => {
    location.reload();
});
document.addEventListener('keydown', function (event) {
    if (!showModal && (event.key == 'ArrowLeft' || event.key == 'ArrowRight')) {
        if (['home', 'leaderboards', 'featured', 'map', 'sort'].includes(globalTab)) {
            let success = false
            switch (event.key) {
                case 'ArrowLeft':
                    if (sortCategoryIndex > 0) {
                        sortCategoryIndex--
                        success = true
                    }
                    break;
                case 'ArrowRight':
                    if (sortCategoryIndex < categories.length - 1) {
                        sortCategoryIndex++
                        success = true
                    }
                    break;
            }
            if (success) {
                playSound('equip_move')
                sortPlayers(players)
                action()
            } else {
                playSound('locked')
            }
        }
    }
});