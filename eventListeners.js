document.querySelectorAll('#displayOptions input').forEach(input => {
    input.addEventListener('click', () => {
        refresh();
    });
})
document.querySelectorAll('#ILoptions input').forEach(input => {
    input.addEventListener('click', () => {
        showRefresh();
        ILchange = true
    });
})
document.querySelectorAll('input').forEach(elem => {
    elem.addEventListener('click', () => {
        playSound('move')
    })
})
document.querySelectorAll('button').forEach(elem => {
    elem.addEventListener('click', () => {
        playSound('category_select')
    })
})
window.addEventListener('hashchange', () => {
    location.reload();
});
document.addEventListener('keydown', function (event) {
    if (page == 'charts') {
        let categoryIndex = fullgame ? fullgameCategoryIndex : levelCategoryIndex
        switch (event.key) {
            case 'ArrowLeft':
                if (categoryIndex > 0) {
                    playSound('equip_move')
                    categoryIndex--
                    drawChart(categoryIndex)
                }
                break;
            case 'ArrowRight':
                if (categoryIndex < categories.length - 1) {
                    playSound('equip_move')
                    categoryIndex++
                    drawChart(categoryIndex)
                }
                break;
        }
    }
});