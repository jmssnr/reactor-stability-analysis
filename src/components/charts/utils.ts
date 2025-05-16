import { MARGIN } from "@/components/charts/margin";

export const getBounds = (width: number, height: number) => {
  return {
    innerWidth: width - MARGIN.left - MARGIN.right,
    innerHeight: height - MARGIN.top - MARGIN.bottom,
  };
};

import { createElement, CSSProperties } from "react";
import ReactDOMServer from "react-dom/server";

const temporarilyAddToDOM = (
  html: string,
  callback: (element: HTMLDivElement) => { width: number; height: number }
) => {
  const tempEl = document.createElement("div");
  tempEl.style.position = "absolute";
  tempEl.style.visibility = "hidden";

  tempEl.innerHTML = html;
  document.body.appendChild(tempEl);

  const callbackReturn = callback(tempEl);

  tempEl.remove();

  return callbackReturn;
};

export const getStringWidthAndHeight = (text: string, style: CSSProperties) => {
  const textElement = createElement("text", style, text);

  const svgElement = createElement(
    "svg",
    {
      viewbox: "0 0 1920 1080",
      x: 0,
      y: 0,
    },
    textElement
  );

  const svgString = ReactDOMServer.renderToString(svgElement);

  return temporarilyAddToDOM(svgString, (element) => {
    const temporaryTextElement = element.querySelector("text")!;

    const { width, height } = temporaryTextElement.getBBox();

    return { width, height };
  });
};
