function supporterModal() {
    let HTMLContent = `<div class='container' style='gap:20px;margin:20px'>`
    SUPPORTERS.forEach(supporter => {
        HTMLContent += `<div class='supporter'>${playerDisplay(supporter)}</div>`
    })
    HTMLContent += `</div></div>`
    let headerContent = `<div class='container' style='position:relative'>
    <img src='images/supporters.png' style='width:55px;position:absolute;left:0px'></div>
    <div style='margin-left:60px;margin-right:20px'>SUPPORTERS</div>
    <div>`
    HTMLContent += `<div style='width:520px;white-space:normal;margin:10px 0'>
    Thank you for using the Combined Leaderboard. It truly means a lot for my work to get appreciated the way it does.
    <br><br>
    If you would like to support the myekul project, a donation would be greatly appreciated.
    It costs me ${myekulColor('$10/year')} to keep the myekul.com domain name, and if we could get that community-funded, that would mean a lot.
    Anything beyond that is not necessary, but would put a smile on my silly face.
    ${myekulColor('For donations of $5 or more, you will receive a special supporter badge on your report card!')}
    <a href="https://ko-fi.com/myekul" target="_blank" class='button banner font2' style='margin:20px auto;font-size:170%;height:50px;width:150px;border-radius:40px'>DONATE</a>
    </div>`
    openModal(HTMLContent, headerContent)
}