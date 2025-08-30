import { useEffect } from "react";

import { MAX_GRID_COLUMNS } from "../constants/gameConstants";
import { loadBg } from "../utilities/images";

const bgImgs = loadBg()

export function useCSSVariables(numPairs: number, bgImgInd: number = 0) {
  useEffect(() => {
    const prevBg = document.body.style.getPropertyValue("--bg-img");
    const prevCols = document.body.style.getPropertyValue("--cols");
    const prevMaxCols = document.body.style.getPropertyValue("--max-cols");

    const cols = Math.ceil(Math.sqrt(numPairs * 2));

    document.body.style.setProperty("--bg-img", `url(${bgImgs[bgImgInd]})`);
    document.body.style.setProperty("--cols", `${cols}`);
    document.body.style.setProperty(
      "--max-cols",
      `${cols > MAX_GRID_COLUMNS ? MAX_GRID_COLUMNS : cols}`,
    );

    return () => {
      document.body.style.setProperty("--bg-img", prevBg);
      document.body.style.setProperty("--cols", prevCols);
      document.body.style.setProperty("--max-cols", prevMaxCols);
    };
  }, [numPairs, bgImgInd]);
}
