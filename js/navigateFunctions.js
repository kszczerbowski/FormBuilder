import { isQuestionBox } from "./supportFunctions.js";

export function goToFormBuildersLastDiv(targetElement) {
  if (!targetElement.classList.contains("form-builder")) {
    return goToFormBuildersLastDiv(targetElement.parentElement);
  }
  return targetElement.lastElementChild.previousElementSibling;
}

export function goToLastSibling(targetElement) {
  return targetElement.parentNode.lastElementChild;
}

export function goToFollowupQuestionButton(targetElement) {
  return targetElement.parentNode.querySelector(".followup-question-button");
}

export function goToNestedArray(coordinates, formTree) {
  let nestedArray = formTree[coordinates[0]].followups;
  for (let i = 1; i < coordinates.length; i++) {
    nestedArray = nestedArray[coordinates[i]].followups;
  }
  return nestedArray;
}

export function goToQuestionBox(targetElement) {
  while (!isQuestionBox(targetElement)) {
    targetElement = targetElement.parentNode
  }
  return targetElement;
}
