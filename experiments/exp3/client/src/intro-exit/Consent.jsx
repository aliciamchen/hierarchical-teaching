import React from "react";
import { Button } from "../components/Button";

export function ConsentPage({ next }) {
  return (
    <div className="consent">
      <h1>Consent</h1>

      <p>
        Please read this consent agreement carefully before deciding whether to
        participate in this experiment.
      </p>

      <p>
        <strong>Purpose of the research:</strong> To understand how teachers
        teach and how learners learn.
      </p>

      <p>
        <strong>What you will do in this research:</strong> In this task you
        will be paired up with another participant and assigned to be either a teacher or a learner. If you are the
        teacher, you will be asked to select hints for your partner to help them answer questions. If you are a learner, you will be asked to
        answer questions based on your teacher's hints.
      </p>

      <p>
        <strong>Time required:</strong> This experiment will take 30-40 minutes
        to complete.
      </p>

      <p>
        <strong>Risks:</strong> There are no anticipated risks associated with
        participating in this study. The effects of participating should be
        comparable to those you would experience from viewing a computer monitor
        and using a mouse for the duration of the experiment.
      </p>

      <p>
        <strong>Benefits:</strong> The study provides important information
        about the nature of learning, decision making, and action selection.
      </p>

      <p>
        <strong>Compensation:</strong> You will receive $2 for completing the
        experiment and a performance bonus of up to $5.
      </p>

      <p>
        <strong>Confidentiality:</strong> Your participation in this study will
        remain confidential. No personally identifiable information will be
        associated with your data. Your de-identified data may be shared with
        other researchers and used in future projects.
      </p>

      <p>
        <strong>Participation and withdrawal:</strong> Your participation in
        this study is completely voluntary and you may refuse to participate or
        you may choose to withdraw at any time without penalty or loss of
        benefits to which you are otherwise entitled.
      </p>

      <p>
        <strong>How to contact the researcher:</strong> If you have questions or
        concerns about your participation or payment, or want to request a
        summary of research findings, please contact Alicia Chen,
        aliciach@mit.edu.
      </p>

      <p>
        <strong>Whom to contact about your rights in this research:</strong> For
        questions, concerns, suggestions, or complaints that have not been or
        cannot be addressed by the researcher, or to report research-related
        harm, please contact the Committee on the Use of Human Subjects in
        Research at Harvard University, 1414 Massachusetts Avenue, Second Floor,
        Cambridge, MA 02138. Phone: 617-496-2847. Email: cuhs@fas.harvard.edu.
      </p>

      <Button handleClick={next} autoFocus>
        <p>I consent</p>
      </Button>
    </div>
  );
}
