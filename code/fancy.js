function fancyRun(run, categoryIndex, extra) {
    const category = categories[categoryIndex]
    let HTMLContent = ''
    HTMLContent += fancyDate(run)
    if (sortCategoryIndex == -1 && mode != 'fullgame') {
        HTMLContent += `
        <td style='padding:0 5px'>
            ${category?.info?.id && bossILindex == -1 ? `<div class='container ${category.info.id}' style='border-radius:5px;width:50px;height:50px'>${getImage(category.info.id)}</div>` : ''}
            ${sortCategoryIndex == -1 ? categorySpan(category) : ''}
        </td>`
    }
    HTMLContent += fancyTime(run, categoryIndex, extra)
    HTMLContent += fancyThumbnail(run)
    return HTMLContent
}