function openModal(playerIndex) {
    playSound('cardup')
    document.addEventListener("keydown", handleEscapePress);
    let player = players[playerIndex]
    let playerLink = player.weblink ? `onclick="window.open('${player.weblink}', '_blank')"` : null;
    let percentage = getPercentage(player.averagePercentage)
    const letterGrade = getLetterGrade(percentage)
    let HTMLContent =
        `<table id='modal-title'>
            <tr>
                <td>${getPlayerFlag(player, '20px')}</td>
                <td><h2 ${playerLink} class='${playerLink ? 'clickable' : ''}'>${getPlayerName(player)}</h2></td>
                <td><h3 style='padding: 5px' class='${letterGrade.className}'>${letterGrade.grade}</h3></td>
            </tr>
        </table>`
    HTMLContent += `<table>`
    HTMLContent += `<th></th>`
    categories.forEach((category, categoryIndex) => {
        let run = player.runs[categoryIndex]
        let score = run ? getPercentage(run.percentage) : ''
        let letterGrade = getLetterGrade(score)
        HTMLContent +=
            `<tr>
                <td class=${category.class} style='text-align:left'>${category.name}<td>
                <td class=${letterGrade.className} style='text-align:left'>${letterGrade.grade}<td>
                <td class=${letterGrade.className}>${score}<td>
            </tr>`
    })
    HTMLContent += `</table><table id='modal-other'>`
    HTMLContent +=
        `<tr>
            <td>Rank:</td>
            <td>${player.rank}</td>
        </tr>`
    HTMLContent += player.hasAllRuns ?
        `<tr>
            <td>GPA:</td>
            <td>${getGPA(player.averagePercentage)}</td>
        </tr>` : ''
    HTMLContent += `</table>`
    document.getElementById('reportCard').innerHTML = HTMLContent
    const modal = document.getElementById("myModal");
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    const modalContent = modal.querySelector('.modal-content');
    modal.style.display = "block";
    modalContent.style.animation = 'slideUp 0.25s ease-out forwards';
}
function closeModal() {
    playSound('carddown')
    document.removeEventListener("keydown", handleEscapePress);
    const modal = document.getElementById("myModal");
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'slideDown 0.25s ease-out forwards';
    setTimeout(() => {
        modal.style.display = "none";
    }, 200);
}
window.onclick = function (event) {
    const modal = document.getElementById("myModal");
    if (event.target == modal) {
        closeModal()
    }
}
function handleEscapePress() {
    if (event.key == "Escape") {
        closeModal();
    }
}