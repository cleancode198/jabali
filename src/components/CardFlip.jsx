import { useState, useEffect } from "react";

import "../styles/cardflip.css";

import { ddd } from "../utils/functions";

var flipCardAnimationIndex = 0;
var flipCardAnimationTimesIndex = 0;
var flipCardInterval;

export function CardFlip({
  prize,
  cardFlipStep,
  onNavChanged,
  setCardFlipStep,
}) {
  const [flipCardImageUrl, setFlipCardImageUrl] = useState(
    process.env.PUBLIC_URL +
      "/assets/images/Card_flip/card_flip_1.1001 copy.png"
  );

  useEffect(() => {
    if (cardFlipStep === "PRIZE") {
      flipCardAnimationIndex = 0;
      flipCardAnimationTimesIndex = 0;
      if (flipCardInterval) clearInterval(flipCardInterval);
    }
  }, [cardFlipStep]);

  const flipCardImageCount = 120;
  const flipCardAnimationDuration = 5;
  const flipCardAnimationTimes = (2 * 60) / flipCardAnimationDuration;

  const flipCard = () => {
    if (cardFlipStep === "PRIZE") {
      if (prize === "legendary" || prize === "epic" || prize === "rare") {
        setCardFlipStep("NFT");
        return;
      } else {
        setCardFlipStep("END");
        onNavChanged("LOTTERY");
        return;
      }
    } else if (cardFlipStep === "NFT") {
      setCardFlipStep("END");
      onNavChanged("LOTTERY");
      return;
    }

    if (flipCardAnimationIndex > 0 || flipCardAnimationTimesIndex > 0) return;

    flipCardInterval = setInterval(() => {
      if (flipCardAnimationTimesIndex === flipCardAnimationTimes) {
        setCardFlipStep("PRIZE");
        return;
      }
      if (flipCardAnimationIndex === flipCardImageCount) {
        flipCardAnimationIndex = 0;
        flipCardAnimationTimesIndex++;
      }

      setFlipCardImageUrl(
        `${process.env.PUBLIC_URL}/assets/images/Card_flip/card_flip_1.1${ddd(
          flipCardAnimationIndex + 1
        )} copy.png`
      );

      flipCardAnimationIndex++;
    }, (flipCardAnimationDuration * 1000.0) / flipCardImageCount);
  };

  return (
    <>
      <div id="overlay" className="overlay" onClick={flipCard}></div>
      {cardFlipStep === "FLIPPING" ? (
        <img className="card-flip" src={flipCardImageUrl} onClick={flipCard} />
      ) : (
        <img
          className="card-flip"
          src={
            process.env.PUBLIC_URL +
            "/assets/images/Card_flip/card_flip_1.1121 copy.png"
          }
          onClick={flipCard}
        />
      )}
      {cardFlipStep === "PRIZE" && (
        <img
          className="prize"
          src={
            process.env.PUBLIC_URL + "/assets/images/Cards/" + prize + ".jpg"
          }
          onClick={flipCard}
        />
      )}
    </>
  );
}
