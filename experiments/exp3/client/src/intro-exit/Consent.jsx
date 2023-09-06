import React from "react";
import { Button } from "../components/Button";

export function ConsentPage({ next }) {
  return (
    // <div className="mt-3 sm:mt-5 p-20">
    <div className="consent">
        <h1>Consent</h1>
      {/* <div className="mt-2 mb-6"> */}

        <p>
          Please read this consent agreement carefully before deciding whether
          to participate in this experiment.
        </p>

        <p>
          <strong>Purpose of the research:</strong> To examine what people learn
          from information provided to them by teachers.
        </p>

        <p>
          <strong>What you will do in this research:</strong> In this task you
          will answer a series of multiple choice questions. You will get hints
          on how to answer these questions from teachers who played an earlier
          version of this HIT.{" "}
        </p>

        <p>
          <strong>Time required:</strong> This experiment will take 30-40
          minutes to complete.
        </p>

        <p>
          <strong>Risks:</strong> There are no anticipated risks associated with
          participating in this study. The effects of participating should be
          comparable to those you would experience from viewing a computer
          monitor and using a mouse for the duration of the experiment.
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
          <strong>Confidentiality:</strong> Your participation in this study
          will remain confidential. No personally identifiable information will
          be associated with your data. Your de-identified data may be shared
          with other researchers and used in future projects.
        </p>

        <p>
          <strong>Participation and withdrawal:</strong> Your participation in
          this study is completely voluntary and you may refuse to participate
          or you may choose to withdraw at any time without penalty or loss of
          benefits to which you are otherwise entitled.
        </p>

        <p>
          <strong>How to contact the researcher:</strong> If you have questions
          or concerns about your participation or payment, or want to request a
          summary of research findings, please contact Natalia Velez,
          nvelez@fas.harvard.edu.
        </p>

        <p>
          <strong>Whom to contact about your rights in this research:</strong>{" "}
          For questions, concerns, suggestions, or complaints that have not been
          or cannot be addressed by the researcher, or to report
          research-related harm, please contact the Committee on the Use of
          Human Subjects in Research at Harvard University, 1414 Massachusetts
          Avenue, Second Floor, Cambridge, MA 02138. Phone: 617-496-2847. Email:
          cuhs@fas.harvard.edu.
        </p>

      {/* </div> */}

      <Button handleClick={next} autoFocus>
        <p>I consent</p>
      </Button>
    </div>
  );
}
// import { Centered, ConsentButton } from "@empirica/core/player/react";

// export function Consent({ next }) {
//   return (
//     <Centered>
//       <div className="consent bp3-ui-text">
//         <h5 className="bp3-heading">INTRODUCTION</h5>
//         <p>
//           Thank you for deciding to participate in this research project. This
//           research is being conducted by Robert Hawkins, a postdoctoral research
//           fellow, Irina Liu and Alicia Chen, research assistants, and Tom
//           Griffiths, a faculty member, all at Princeton University. This study
//           takes approximately 30 minutes to complete, but will vary a bit
//           depending on how long you must wait for other participants to join.
//           Your participation in this research is voluntary. You are free to
//           refuse to take part, and you may stop taking part at any time. You are
//           free to discontinue participation in this study at any time with no
//           penalty. Below is a description of the research project, and your
//           consent to participate. Read this information carefully. If you agree
//           to participate, click "I agree" to indicate that you have read and
//           understood the information provided on this consent form.
//         </p>

//         <h5 className="bp3-heading">PROCEDURES</h5>
//         <p>
//           If you agree to take part in the research, you will play a series of
//           communication games with other participants: one of you will describe
//           a picture for the other to choose out of a lineup of other pictures.
//           All of the information we obtain during the research will be kept
//           confidential, and not associated with your name in any way. However,
//           while the study is running it will be associated with your worker id.
//           Once the study is complete we will replace your worker id with a
//           random string.
//         </p>

//         <h5 className="bp3-heading">Benefits and Risks</h5>
//         <p>
//           <strong>Benefits:</strong> The research team expects to learn about
//           how humans communicate and solve problems together, which we hope will
//           result in one or more academic publications. You will receive payment
//           after completing this session as well as any public benefit that may
//           come these Research Results being shared with the greater scientific
//           community and public.{" "}
//         </p>
//         <p>
//           <strong>Risks: </strong> During your participation, you may experience
//           frustration if you are unable to communicate effectively with your
//           partner or if one of your partners disconnect and terminate the game
//           early. To help reduce such risks, the research team will include
//           comprehension checking steps to ensure that all participants
//           understand the task.
//         </p>

//         <h5 className="bp3-heading">YOUR AUTHORITY TO PARTICIPATE</h5>
//         <p>
//           You represent that you have the full right and authority to sign this
//           form, and if you are a minor that you have the consent (as indicated
//           below) of your legal guardian to sign and acknowledge this form. By
//           signing this form, you confirm that you understand the purpose of the
//           project and how it will be conducted and consent to participate on the
//           terms set forth above. If you have any questions about this research,
//           do not hesitate to contact Robert Hawkins at hawkrobe@gmail.com. If
//           you have any questions about your rights or treatment as a participant
//           in this research project, please contact the Princeton Office for
//           Research Integrity and Assurance by phone at 609-258-0865 or by email
//           at ria@princeton.edu.
//         </p>

//         <p>
//           By consenting to participate, you acknowledge that you are 18 years or
//           older, have read this consent form, agree to its contents, and agree
//           to take part in this research. If you do not wish to consent, close
//           this page and return the task.
//         </p>

//         <ConsentButton text="I AGREE" />
//       </div>
//     </Centered>
//   );
// }
