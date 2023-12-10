import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React from "react";
import { Game } from "./Game";
import { ExitSurvey } from "./intro-exit/ExitSurvey";
import { Instructions } from "./intro-exit/Introduction";
import { ConsentPage } from "./intro-exit/Consent";
import { Sorry } from "./intro-exit/Sorry";
import { ReturnHIT } from "./intro-exit/ReturnHIT";

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";

  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;

  function introSteps({ game, player }) {
    return [ConsentPage, Instructions];
  }

  function exitSteps({ game, player }) {
    console.log(game.get("endedReason"))
    if (player.get("ended") == "finished") {
      return [ExitSurvey];
    } else if (game.get("endedReason") == "shared lobby timeout") {
      return [ReturnHIT];
    } else {
      return [Sorry];
    }
  }

  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
      <div className="h-screen relative">
        <EmpiricaMenu position="bottom-left" />
        <div className="h-full overflow-auto">
          <EmpiricaContext introSteps={introSteps} exitSteps={exitSteps}>
            <Game />
          </EmpiricaContext>
        </div>
      </div>
    </EmpiricaParticipant>
  );
}
