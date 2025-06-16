//type scrubPosition = "top top" | "top bottom" | "bottom bottom" | "bottom top";
const scrubsPositionsList: string[] = ["top", "bottom", "center"];

const composedByTwoWords = (scrub: string): boolean => {
  const validate: boolean = scrub.split(/\W+/).length == 2;
  return validate;
};

const compsedByCorrectWords = (scrub: string): boolean => {
  const [elementPosition, windowPosition] = scrub.split(" ");
  const elemPosValidate: boolean = scrubsPositionsList.includes(
    elementPosition.toLowerCase(),
  );
  const windPosValidate: boolean = scrubsPositionsList.includes(
    windowPosition.toLowerCase(),
  );
  const validate: boolean = elemPosValidate && windPosValidate ? true : false;
  return validate;
};

const verifyScrub = (scrub: string): boolean => {
  if (composedByTwoWords(scrub)) {
    return compsedByCorrectWords(scrub);
  } else {
    return false;
  }
};

const verifyScrubs = (scrubStart: string, scrubEnd: string): boolean => {
  const scrubStartValidate: boolean = verifyScrub(scrubStart);
  const scrubEndValidate: boolean = verifyScrub(scrubEnd);
  const validate: boolean = scrubStartValidate && scrubEndValidate;
  return validate;
};

export { verifyScrub, verifyScrubs, composedByTwoWords, compsedByCorrectWords };
