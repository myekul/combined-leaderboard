document.querySelectorAll('#leaderboardOptions input,#boardTitleDiv input').forEach(input => {
    input.addEventListener('click', () => {
        action()
    });
})
document.querySelectorAll('input').forEach(elem => {
    elem.addEventListener('click', () => {
        playSound('move')
    })
})
document.querySelectorAll('.button').forEach(elem => {
    elem.addEventListener('click', () => {
        playSound('category_select')
    })
})
window.addEventListener('hashchange', () => {
    location.reload();
});
document.addEventListener('keydown', function (event) {
    if (!showModal && (event.key == 'ArrowLeft' || event.key == 'ArrowRight')) {
        if (['leaderboard', 'charts', 'map', 'sort'].includes(page) || (page == 'featured' && mode != 'fullgameILs')) {
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
window.onclick = function (event) {
    const modal = document.getElementById("modal");
    if (event.target == modal) {
        // if (globalCountryName) {
        //     playSound('carddown')
        //     openModal(globalCountryName)
        // } else {
        closeModal()
        // }
    }
}