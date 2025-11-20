function generateConnect4() {
    const board = Array.from({ length: 7 }, () => []);
    board[2].push(1)
    let HTMLContent = ''
    HTMLContent += `
    <div class='container' style='margin-bottom:20px'>Coming soon!</div>
    <div class='container banner' style='width:520px;height:430px;border-radius:15px;'>`
    board.forEach(row => {
        HTMLContent += `<div class='clickable'>`
        for (let i = 5; i >= 0; i--) {
            let cellContent = row[i] ? getPlayerIcon(players.find(player => player.name == localStorage.getItem('username'))) : ''
            HTMLContent += `<div class='background2' style='border-radius:50%;height:67px;width:67px;margin:3px'>${cellContent}</div>`
        }
        HTMLContent += `</div>`
    })
    // const snapshot = {
    //     board: board,
    // }
    HTMLContent += `</div>`
    document.getElementById('connect4').innerHTML = HTMLContent
}