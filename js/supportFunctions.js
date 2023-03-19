import { generateFollowupQuestion, generatePrimaryQuestion } from "./markup.js";
import { goToNestedArray } from "./navigateFunctions.js";
import { formTree, generateButton, formBuilder } from "./index.js";
import {
  handleAddPrimaryQuestion,
  handleAddFollowupQuestion,
} from "./index.js";

export function shouldAddPrimaryQuestion(targetElement) {
  return targetElement.parentNode.classList.contains("form-builder");
}

export function isPrimaryQuestion(targetElement) {
  return targetElement.parentNode.classList.contains("primary-box");
}

function getBoxType(targetElement) {
  if (targetElement.classList.contains("primary-box")) return "primary";
  if (targetElement.classList.contains("followup-box")) return "followup";
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
      parentQuestion: parentQuestion.split(" ").join("%^&"),
      conditionType: conditionType,
      conditionValue: conditionValue.split(" ").join("%^&"),
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
    if (targetElement.previousElementSibling !== null) {
      targetElement = targetElement.previousElementSibling;
      if (isQuestionBox(targetElement)) {
        coordinate++;
      }
    } else {
      coordinates.unshift(coordinate);
      targetElement = targetElement.parentNode;
      coordinate = 0;
    }
  }
  coordinates.unshift(coordinate);
  return coordinates;
}

function addQuestionToTree(targetElement) {
  if (isPrimaryQuestion(targetElement)) {
    const [question, type] = getQuestionProperties(targetElement);
    formTree.push({
      question: question,
      type: type,
      followups: [],
      nestingDegree: 0,
    });
  } else {
    const [condition, question, type] = getQuestionProperties(targetElement);
    const coordinates = getCoordinates(targetElement);
    const primaryQuestion = formTree[coordinates[0]];
    if (coordinates.length > primaryQuestion.nestingDegree)
      primaryQuestion.nestingDegree = coordinates.length;
    const nestedArray = goToNestedArray(coordinates, formTree);
    nestedArray.push({
      condition: condition,
      question: question,
      type: type,
      followups: [],
      coordinates: coordinates,
    });
  }
}

export function generateFormTree(formBuilder, formTree) {
  const children = formBuilder.children;
  for (let i = 0; i < children.length; i++) {
    if (
      children[i].children.length > 0 &&
      (getBoxType(children[i]) === "primary" ||
        getBoxType(children[i]) === "followup")
    ) {
      const button = children[i].querySelector(".followup-question-button");
      console.log("children[i]: ", children[i]);
      console.log("button: ", button);
      addQuestionToTree(button);
      generateFormTree(children[i], formTree);
    }
  }
}

export function generateQuestions(formTree, markupArray) {
  formTree.forEach((question, index) => {
    if (question.nestingDegree !== undefined) {
      generatePrimaryQuestion(question, index, markupArray);
    } else {
      generateFollowupQuestion(question, index, markupArray);
    }
    if (question.followups.length > 0) {
      generateQuestions(question.followups, markupArray);
    }
  });
}

export function unhideFollowups(targetElement, formElements) {
  const labelSibling = targetElement.previousElementSibling;
  const labelQuestion = labelSibling.textContent;
  const currentAnswer = targetElement.value;
  for (let i = 0; i < formElements.length; i++) {
    if (formElements[i].dataset.condition !== undefined) {
      let { parentQuestion, conditionType, conditionValue } = JSON.parse(
        formElements[i].dataset.condition
      );
      parentQuestion = parentQuestion.split("%^&").join(" ");
      conditionValue = conditionValue.split("%^&").join(" ");
      if (parentQuestion === labelQuestion) {
        switch (conditionType) {
          case "===":
            if (conditionValue === currentAnswer)
              formElements[i].classList.remove("hidden");
            break;
          case "greater":
            if (conditionValue < currentAnswer)
              formElements[i].classList.remove("hidden");
            break;
          case "smaller":
            if (conditionValue > currentAnswer)
              formElements[i].classList.remove("hidden");
            break;
        }
      }
    }
  }
}

function getQuestionBoxes(higherElement) {
  const allChildren = higherElement.children;
  const questionBoxes = [];
  for (let i = 0; i < allChildren.length; i++) {
    if (allChildren[i].children.length > 0 && isQuestionBox(allChildren[i]))
      questionBoxes.push(allChildren[i]);
  }
  return questionBoxes;
}

function restoreFollowupQuestions(higherQuestion) {
  const primaryBoxes = getQuestionBoxes(formBuilder);
  higherQuestion.followups.forEach((followup) => {
    const coordinates = followup.coordinates;
    let nestedButtonBox = primaryBoxes[coordinates[0]];
    for (let i = 1; i < coordinates.length; i++) {
      const nestedQuestionBoxes = getQuestionBoxes(nestedButtonBox);
      nestedButtonBox = nestedQuestionBoxes[coordinates[i]];
    }
    const nestedButton = nestedButtonBox.querySelector(
      ".followup-question-button"
    );
    handleAddFollowupQuestion(nestedButton, followup);
    if (followup.followups.length > 0) restoreFollowupQuestions(followup);
  });
}

export function restoreFormBuilderAndForm() {
  const formTree = JSON.parse(localStorage.getItem("formTree"));
  if (formTree === null || formTree.length === 0) return;
  const primaryButton = document.querySelector(".primary-question-button");
  formTree.forEach((question, index) => {
    handleAddPrimaryQuestion(primaryButton, question);
    const primaryBoxes = document.querySelectorAll(".primary-box");
    primaryBoxes[index].querySelector("#question").value = question.question;
    // mamy wygenerowane primaries
    if (question.followups.length > 0) {
      restoreFollowupQuestions(question);
    }
  });

  generateButton.classList.remove("hidden");
}
