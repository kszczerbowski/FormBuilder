import { generateFollowupQuestion, generatePrimaryQuestion } from "./markup.js";

export function shouldAddPrimaryQuestion(event) {
  return event.target.parentNode.classList.contains("form-builder");
}

export function isPrimaryQuestion(targetElement) {
  return targetElement.parentNode.classList.contains("primary-box");
}

export function getQuestionType(targetELement) {
  const parent = targetELement.parentNode;
  const type = parent.querySelector("#answer-type").value;
  return type;
}

export function blockQuestionButtons() {
  const questionButtons = document.querySelectorAll(
    ".followup-question-button, .primary-question-button, .generate-button"
  );
  questionButtons.forEach((button) => button.setAttribute("disabled", ""));
}

export function unblockQuestionButtons() {
  const questionButtons = document.querySelectorAll(
    ".followup-question-button, .primary-question-button, .generate-button"
  );
  questionButtons.forEach((button) => button.removeAttribute("disabled"));
}

export function getNestingDegree(targetELement) {
  let nestingDegree = 0;
  while (!targetELement.parentNode.classList.contains("primary-box")) {
    nestingDegree++;
    targetELement = targetELement.parentNode;
  }
  return nestingDegree;
}

export function prepareEmptyPrimaryBox(element, position) {
  element.insertAdjacentHTML(position, `<div class="primary-box"></div>`);
}

export function prepareEmptyFollowupBox(element, position) {
  element.insertAdjacentHTML(position, `<div class="followup-box"></div>`);
}

export function getQuestionProperties(targetElement) {
  const parent = targetElement.parentNode;
  const question = parent.querySelector("#question").value;
  const type = parent.querySelector("#answer-type").value;
  if (!isPrimaryQuestion(targetElement)) {
    const grandParent = parent.parentNode;
    const parentQuestion = grandParent.querySelector("#question").value;
    const conditionType = parent.querySelector("#condition-type").value;
    const conditionValue = parent.querySelector("#condition").value;
    const condition = {
      parentQuestion: parentQuestion.split(' ').join('%^&'),
      conditionType: conditionType,
      conditionValue: conditionValue.split(' ').join('%^&'),
    };
    return [condition, question, type];
  } else {
    return [question, type];
  }
}

function isQuestionBox(targetElement) {
  return (
    targetElement.classList.contains("followup-box") ||
    targetElement.classList.contains("primary-box")
  );
}

export function getCoordinates(targetElement) {
  targetElement = targetElement.parentNode.parentNode;
  const coordinates = [];
  let coordinate = 0;
  while (
    !targetElement.parentNode.classList.contains("form-builder") ||
    targetElement.previousElementSibling !== null
  ) {
    // console.log(targetElement.classList)
    if (targetElement.previousElementSibling !== null) {
      targetElement = targetElement.previousElementSibling;
      if (isQuestionBox(targetElement)) {
        coordinate++;
      }
    } else {
      coordinates.unshift(coordinate);
      // console.log("coordinate: ", coordinate);
      targetElement = targetElement.parentNode;
      coordinate = 0;
    }
  }
  coordinates.unshift(coordinate);
  // console.log('coordinates: ',coordinates)
  return coordinates;
}

export function generateQuestions(formTree, markupArray) {
formTree.forEach((question, index) => {
  if (question.nestingDegree !== undefined) {
    generatePrimaryQuestion(question, index, markupArray)
  } else {
    generateFollowupQuestion(question, index, markupArray)
  }
  if (question.followups.length > 0) {
    generateQuestions(question.followups, markupArray)
  }
})
}

export function unhideFollowups(targetElement, formElements) {
  const labelSibling = targetElement.previousElementSibling
  const labelQuestion = labelSibling.textContent
  const currentAnswer = targetElement.value
  for (let i=0; i<formElements.length; i++) {
    if (formElements[i].dataset.condition !== undefined) {
      let {parentQuestion, conditionType, conditionValue} = JSON.parse(formElements[i].dataset.condition)
      parentQuestion = parentQuestion.split('%^&').join(' ')
      conditionValue = conditionValue.split('%^&').join(' ')
      if (parentQuestion === labelQuestion) {
        switch (conditionType) {
          case '===':
            if (conditionValue === currentAnswer) formElements[i].classList.remove('hidden')
          break;
          case 'greater':
            if (conditionValue < currentAnswer) formElements[i].classList.remove('hidden')
          break;
          case 'smaller':
            if (conditionValue > currentAnswer) formElements[i].classList.remove('hidden')
          break;
        }
      }
    }
  }
}