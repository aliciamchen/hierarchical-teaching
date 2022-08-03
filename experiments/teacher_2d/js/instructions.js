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
    <p>
    You live on Mycotopia, an archipelago of islands which is famous for its large variety of native mushrooms. Locals know that some of the mushrooms are tasty but others are bitter. Every year people visit the islands to taste the mushrooms, but it's often hard for them to tell the difference between tasty mushrooms and bitter ones.
    </p>
    `
}

function instructionsStemCapIntro() {
    return `
    <p>
    The first thing every child learns on Mycotopia is mushrooms primarily differ in their <strong>stem height</strong> and <strong>cap width</strong>. You can always tell whether a mushroom is tasty or bitter based on these two features, but different islands have different rules; a mushroom that is tasty on one island may be bitter on another island.
    </p>
    `
}

function instructionsStemCapExamples() {
    return `
    <p>
    For example, on one island, mushrooms with a stem height greater than 3 inches and a cap width less than 7 may be tasty.
    </p>
    <p>
    But on another island, it may be the other way around:
    </p>
    `
}

function instructionsDirections() {
    return `
    <p>
    Although locals know these rules, students are often confused. Your goal is to show students <strong>examples of tasty mushrooms</strong> to teach them the correct rule.
    </p>
    <p>
    The tasty mushrooms will be marked in blue.
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
        <p>
        You will teach each student over either one or two lessons. During each lesson, you will send the student one example of a tasty mushroom.
        </p>
        <p>
        For some of the two-lesson students, after you send them the first mushroom we will give them all XXX mushrooms and ask them to classify all the mushrooms into tasty and bitter. Then we will show you how they classified the mushrooms.
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
    <p>
    Each student comes from a classroom, where they have already been taught some information about the island.
    </p>
    <p>
    However, their teachers in these classrooms don't know the full mushroom rule on the island! Each student will only have learned something about either the stem size rule or the cap size rule.
    </p>
    <p>
    Every time you encounter a new student, you will be given information about their classroom. For some students you might not know exactly which classroom they belonged to.
    </p>
    <p>
    So to teach effectively, you will want to consider what the students already know about the island.
    </p>
    `
}

function instructionsMoney(instructionsParams) {
    return `
    <h3>
    How can I earn as much money as possible from this experiment?
    </h3>
    <p>
    After you teach the students, we will test them. We will give them a bunch more example mushrooms from the island and they will have to classify them into tasty and safe mushrooms. We will award you a bonus for each student based on how well they did! In addition to your base pay of $${instructionsParams.basePay}, you can receive a total bonus of up to $${instructionsParams.maxBonus}.
    </p>
    <p>
    So to teach effectively, you should select mushroom(s) that lead your students as close as possible to the correct rules.
    </p>
    <p>
    Make sure to send each student a mushroom on every lesson. You have ${instructionsParams.timeout} seconds to send a mushroom for every lesson. If you miss a mushroom, you can't earn a bonus for that student.
    </p>
    <p>
    We will tell you how much bonus you have earned at the end of the study.
    </p>
    <p>
    On to the comprehension quiz! Feel free to flip back and forth in the instructions before pressing “Next” to proceed to the quiz.
    </p>
    `
}