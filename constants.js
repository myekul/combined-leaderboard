const cuphead = [
    {
        name: '1.1+',
        class: 'onePointOne',
        id: '9d8lxv62',
        var: '0nwpgqr8',
        subcat: '013kjprq',
        var2: 'ylp6g4rn',
        subcat2: 'mlnv7no1'
    },
    {
        name: 'Legacy',
        class: 'legacy',
        id: '82481pmk',
        var: 'onvv9m0n',
        subcat: '5lm3ep81',
        var2: 'ql6ew5kn',
        subcat2: '21d8nwpl'
    },
    {
        name: 'NMG',
        class: 'nmg',
        id: 'zd38jgek',
        var: 'kn0z0do8',
        subcat: 'klr0d5ol',
        var2: '6njqk9jl',
        subcat2: 'xqk43zdl'
    },
    {
        name: 'DLC',
        class: 'dlc',
        id: '7kjl0wz2',
        var: 'wl3ddqo8',
        subcat: '8104dd5l',
        var2: 'wl3d6vw8',
        subcat2: 'p127504q'
    },
    {
        name: 'DLC+Base',
        class: 'dlcbase',
        id: 'xk95z7g2',
        var: 'wlekk5el',
        subcat: 'jq6dee71',
        var2: 'wlek63rl',
        subcat2: 'xqkvrnkl'
    }
]
const sm64 = [
    {
        name: '120 Star',
        class: 'onePointOne',
        id: 'wkpoo02r',
        var: 'e8m7em86',
        subcat: '9qj7z0oq'
    },
    {
        name: '70 Star',
        class: 'legacy',
        id: '7dgrrxk4',
        var: 'e8m7em86',
        subcat: '9qj7z0oq'
    },
    {
        name: '16 Star',
        class: 'nmg',
        id: 'n2y55mko',
        var: 'e8m7em86',
        subcat: '9qj7z0oq'
    },
    {
        name: '1 Star',
        class: 'dlc',
        id: '7kjpp4k3',
        var: 'e8m7em86',
        subcat: '9qj7z0oq'
    },
    {
        name: '0 Star',
        class: 'dlcbase',
        id: 'xk9gg6d0',
        var: 'e8m7em86',
        subcat: '9qj7z0oq'
    }
]
function getLetterGrade(percentage) {
    let result = {
        grade: '',
        className: ''
    };
    switch (true) {
        case (percentage >= 97):
            result.grade = "A+";
            result.className = "grade-a-plus";
            break;
        case (percentage >= 93):
            result.grade = "A";
            result.className = "grade-a";
            break;
        case (percentage >= 90):
            result.grade = "A-";
            result.className = "grade-a-minus";
            break;
        case (percentage >= 87):
            result.grade = "B+";
            result.className = "grade-b-plus";
            break;
        case (percentage >= 83):
            result.grade = "B";
            result.className = "grade-b";
            break;
        case (percentage >= 80):
            result.grade = "B-";
            result.className = "grade-b-minus";
            break;
        case (percentage >= 77):
            result.grade = "C+";
            result.className = "grade-c-plus";
            break;
        case (percentage >= 73):
            result.grade = "C";
            result.className = "grade-c";
            break;
        case (percentage >= 70):
            result.grade = "C-";
            result.className = "grade-c-minus";
            break;
        case (percentage >= 67):
            result.grade = "D+";
            result.className = "grade-d-plus";
            break;
        case (percentage >= 63):
            result.grade = "D";
            result.className = "grade-d";
            break;
        case (percentage >= 60):
            result.grade = "D-";
            result.className = "grade-d-minus";
            break;
        case (percentage < 60):
            result.grade = "F";
            result.className = "grade-f";
            break;
        default:
            result.grade = "Invalid percentage";
            result.className = "grade-invalid";
    }
    return result;
}