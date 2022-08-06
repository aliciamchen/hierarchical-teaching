function instructions(instructionsParams) {
    return {
        type: jsPsychInstructions,
        pages: [
            instructionsIntro(),
            instructionsMycotopiaIntro(),
            instructionsStemCapIntro(),
            instructionsStemCapExamples(),
            instructionsDirections(),
            instructionsFeedbackDetails(instructionsParams),
            instructionsPriors(),
            instructionsMoney(instructionsParams)
        ],
        show_clickable_nav: true,
        show_page_number: true
    }
}

function instructionsIntro() {
    return `
    <p>
    Please read the following instructions carefully as there will be a comprehension quiz. If your answers on the comprehension quiz indicate that you have not read the instructions, we will ask you to repeat them.
    </p>
    `
}

function instructionsMycotopiaIntro() {
    return `
    <h2>🏝 Mycotopia 🏝</h2>
    <p>
    You live on Mycotopia, an archipelago of islands that is famous for its large variety of native mushrooms 🍄
    </p>
    <p>Locals know that some of the mushrooms are <b>tasty</b> but others are <b>bitter</b>.
    </p>
    <p>
    Every year people visit the islands to taste the mushrooms, but it's often hard for them to tell the difference between tasty mushrooms and bitter ones. 😕
    </p>
    `
}

function instructionsStemCapIntro() {
    return `
    <p>
    The first thing every child learns on Mycotopia is that mushrooms primarily differ in their <strong>stem height</strong> and <strong>cap width</strong>.
    </p>
    <p>
    You can always tell whether a mushroom is tasty or bitter based on these two features, but <b>different islands have different rules</b>; a mushroom that is tasty on one island may be bitter on another island.
    </p>
    `
}

function instructionsStemCapExamples() {
    var gridhtml = $('#mushroomGrid').html()
    return `
    <p style="text-align: center;">
    For example, on one island, mushrooms with a stem height greater than 6.5 inches and a cap width less than 3.5 inches may be tasty:
    </p>
    ${makeGridFromHTML(3.5, 'less', 6.5, 'greater', gridhtml, '1.8vw')}
    <br>
    <p style="text-align: center;">
    But on another island, it may be the other way around:
    </p>
    ${makeGridFromHTML(3.5, 'greater', 6.5, 'less', gridhtml, '1.8vw')}
    <br>
    <p style="text-align: center;">
    The tasty mushrooms will be marked in <b style="color: #648FFF">blue</b>.
    </p>
    `
}

function instructionsDirections() {
    return `
    <p>
    Although locals know these rules, students are often confused 🤔
    </p>
    <p>
    Your goal is to show students <strong>examples of tasty mushrooms</strong> to teach them the correct rule.
    </p>
    `
}

function instructionsFeedbackDetails(instructionsParams) {

    // possible feedback conditions:
    // teacherActive: teacher selects an example
    // teacherPassive: teacher is given an example
    // studentPassive: student reports estimate of true concept
    // studentActive: student reports example turtles they think is helpful for teacher

    if (instructionsParams.feedbackCondition === 'teacherActive') {
        return `
        <p>
        You will teach each student over either one or two lessons. During each lesson, you will send the student one example of a tasty mushroom.
        </p>
        <p>
        For some of the two-lesson students, after you send them the first mushroom you will test the student. You will select any mushroom (tasty or bitter) to send to the student. They will tell you whether they think the mushroom is tasty or bitter.
        </p>
        <p>
        After testing the student, you will proceed to the second lesson where you will send them a second example mushroom.
        </p>
        `
    } else if (instructionsParams.feedbackCondition === 'teacherPassive') {
        return `
        <h2>How to teach</h2>
        <p>
        You will teach each student over either one or two lessons. During each lesson, you will send the student one example of a tasty mushroom.
        </p>
        <p>
        For some of the two-lesson students, after you send them the first mushroom you will test the student. We will give you a mushroom (tasty or bitter) to send to the student. They will tell you whether they think the mushroom is tasty or bitter.
        </p>
        <p>
        After testing the student, you will proceed to the second lesson where you will send them a second example mushroom.
        </p>
        `
    } else if (instructionsParams.feedbackCondition === 'studentPassive') {
        return `
        <h2>🍄 How to teach 🍄</h2>
        <p>
        You will teach each student <b>over either one or two lessons</b>. During each lesson, you will send the student one example of a tasty mushroom. You will be able to use sliders to select the mushroom's stem height and cap width.
        </p>
        <h4>Two-lesson students</h4>
        <p>
        For some of the two-lesson students, after you send them the first mushroom we will ask them to guess the rule for what makes mushrooms tasty or bitter. Then we will show you their guess.
        </p>
        <p>
        Then you will proceed to the second lesson, where you will send them a second example mushroom.
        </p>
        `
    } else if (instructionsParams.feedbackCondition === 'studentActive') {
        return `
        <p>
        You will teach each student over either one or two lessons. During each lesson, you will send the student one example of a tasty mushroom.
        </p>
        <p>
        For some of the two-lesson students, after you send them the first mushroom the student will give you feedback on your teaching. The students will select a few mushrooms to send you and they will tell you whether they think the mushrooms are tasty or bitter.
        </p>
        <p>
        After receiving feedback from the student, you will proceed to the second lesson where you will send them a second example mushroom.
        </p>
        `
    }
}

function instructionsPriors() {
    return `
    <h2>🧑‍🏫 Different classrooms 🧑‍🏫</h2>
    <p>
    Each student comes from a classroom, where they have already been taught some information about the island.
    </p>
    <p>
    However, their teachers in these classrooms <b>don't know the full mushroom rule on the island</b>! Each student will only have learned something about either the <b>stem size rule</b> or the <b>cap size rule</b>.
    </p>
    <p>
    For some of the students, we will tell you which classroom they belonged to.
    </p>
    <p>
    So to teach effectively, you will want to consider what the students already know about the island.
    </p>
    `
}

function instructionsMoney(instructionsParams) {
    return `
    <h2>
    💰 How can I earn as much money as possible from this experiment? 💰
    </h2>
    <p>
    After you teach the students, <b>we will test them</b>. We will give them a bunch more example mushrooms from the island and they will have to classify them into tasty and safe mushrooms. We will award you a bonus for each student based on how well they did! In addition to your base pay of $${instructionsParams.basePay}, you can receive a total bonus of up to $${instructionsParams.maxBonus}.
    </p>
    <p>
    <b>
    So to teach effectively, you should select mushroom(s) that lead your students as close as possible to the correct rules.
    </b>
    </p>
    <p>
    Make sure to send each student a mushroom on every lesson. You have ${instructionsParams.timeout} seconds to send a mushroom for every lesson. If you miss a mushroom, you can't earn a bonus for that student.
    </p>
    <p>
    We will tell you how much bonus you have earned at the end of the study.
    </p>
    <p>
    <b>
    On to the comprehension quiz! Feel free to flip back and forth in the instructions before pressing “Next” to proceed to the quiz.
    </b>
    </p>
    `
}