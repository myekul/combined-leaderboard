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
function secondsToHMS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}
function getGPA(value) {
    let gpa = (value * 4).toString().slice(0, 4)
    return gpa
}
function getPercentage(value) {
    return parseFloat(value * 100).toFixed(1)
}
function placeClass(place) {
    if (place == 1) {
        return 'first'
    } else if (place == 2) {
        return 'second'
    } else if (place == 3) {
        return 'third'
    }
    return null
}
function getClassColor(className) {
    var element = document.querySelector('.' + className);
    var color = window.getComputedStyle(element).backgroundColor;
    return color;
}
function playSound(sfx) {
    if (gameID == 'cuphead') {
        const sound = document.getElementById(sfx)
        sound.currentTime = 0
        sound.volume = 0.4
        sound.play()
    }
}