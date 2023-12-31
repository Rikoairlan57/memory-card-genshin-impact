import { useState, useEffect } from "react";
import {
  Complete,
  Fetching,
  Control,
  Header,
  Footer,
  Main,
  Game,
} from "./components";
import { getRandomCards, cacheImages, sleep } from "./common";
import { genshinCharacter } from "./assets";
import type {
  DifficultyModes,
  ICurrentCards,
  IAllCards,
  MaxCards,
  MaxScore,
} from "./types";

export function App() {
  const [allCards, setAllCards] = useState<null | IAllCards>(null);
  const [currentCards, setCurrentCards] = useState<null | ICurrentCards>(null);
  const [currentScore, setCurrentScore] = useState<null | number>(null);
  const [maxScore, setMaxScore] = useState<null | MaxScore>(null);
  const [maxCards, setMaxCards] = useState<null | MaxCards>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);

  useEffect(() => {
    if (!maxScore) return;

    const fetchCards = async () => {
      let cards: IAllCards;

      setIsFetching(true);

      try {
        cards = await cacheImages(genshinCharacter, maxScore!);
      } catch (error) {
        console.log(error);
        setIsFetching(false);
        setIsError(true);
        return;
      }
      await sleep(1000);

      setAllCards(cards);
    };

    fetchCards();
  }, [maxScore]);

  useEffect(() => {
    if (isGameOver || !allCards) return;

    const cards = getRandomCards(allCards, maxCards!, true) as ICurrentCards;

    setCurrentCards(cards);
    setIsFetching(false);
  }, [allCards, isGameOver, maxCards]);

  const handleDifficultyMode = (mode: DifficultyModes) => () => {
    const [maxCardsNumber, maxScoreNumber]: [MaxCards, MaxScore] =
      mode === "easy" ? [3, 10] : mode === "medium" ? [4, 20] : [5, 30];

    setCurrentScore(1);
    setMaxScore(maxScoreNumber);
    setMaxCards(maxCardsNumber);
  };

  const handleCardClick = (name: string) => () => {
    const cardIndex = allCards!.findIndex((card) => card.name === name);
    const { isClicked } = allCards![cardIndex];

    if (isClicked) {
      setIsGameOver(true);
      return;
    }

    setCurrentScore((prevCurrentScore) => prevCurrentScore! + 1);
    setAllCards((prevAllCards) => {
      const newCards = [...prevAllCards!];
      newCards[cardIndex].isClicked = true;
      return newCards;
    });

    if (currentScore === maxScore) {
      setIsGameOver(true);
      setIsWin(true);
    }
  };

  const resetGame = () => {
    setAllCards(null);
    setCurrentCards(null);
    setCurrentScore(null);
    setMaxScore(null);
    setMaxCards(null);
    setIsFetching(false);
    setIsError(false);
    setIsGameOver(false);
    setIsWin(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 py-10 font-kumbh-san bg-bg-color text-center text-main-color">
      <Header currentScore={currentScore} />
      <Main>
        {isError ? (
          <Complete error resetGame={resetGame} />
        ) : isWin ? (
          <Complete won resetGame={resetGame} />
        ) : isGameOver && !isWin ? (
          <Complete lost resetGame={resetGame} />
        ) : currentCards ? (
          <Game
            maxScoreNumber={maxScore!}
            currentScore={currentScore!}
            currentCards={currentCards}
            resetGame={resetGame}
            handleCardClick={handleCardClick}
          />
        ) : isFetching ? (
          <Fetching />
        ) : (
          <Control handleDifficultyMode={handleDifficultyMode} />
        )}
      </Main>
      <Footer />
    </div>
  );
}
