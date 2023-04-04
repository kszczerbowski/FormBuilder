import {
  generateFollowupQuestion,
  generatePrimaryQuestion,
  conditionDivMarkup,
} from "./markup.js";
import { goToNestedArray, goToQuestionBox } from "./navigateFunctions.js";
import {
  formTree,
  generateButton,
  clearButton,
  formBuilder,
  generateForm,
} from "./index.js";
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

export function getQuestionType(targetElement) {
  const parent = targetElement.parentNode;
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

export function getNestingDegree(targetElement) {
  let nestingDegree = 0;
  while (!targetElement.parentNode.classList.contains("primary-box")) {
    nestingDegree++;
    targetElement = targetElement.parentNode;
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

export function isQuestionBox(targetElement) {
  return (
    targetElement.classList.contains("followup-box") ||
    targetElement.classList.contains("primary-box")
  );
}

function getCoordinates(targetElement) {
  targetElement = targetElement.parentNode;
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
    if (coordinates.length - 1 > primaryQuestion.nestingDegree)
      primaryQuestion.nestingDegree = coordinates.length - 1;
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

export function unhideFollowups(targetElement, formElements, shouldHideDescendants = false) {
  const labelSibling = targetElement.previousElementSibling;
  let labelQuestion = labelSibling.textContent;
  if (targetElement.value === "no") {
    const labelWithQuestionForRadioValueNo =
      targetElement.previousElementSibling.previousElementSibling
        .previousElementSibling.previousElementSibling;
    labelQuestion = labelWithQuestionForRadioValueNo.textContent;
  }
  let currentAnswer = targetElement.value;
  if ((shouldHideDescendants) || (currentAnswer === 'no' && targetElement.checked === false)) currentAnswer = '';
  const coordinatesString = targetElement.getAttribute('data-coordinates')
  const coordinatesArray = coordinatesString.split(',')
  const detectSubQuestions = () => {
    const subQuestions = [];
    for (let i = 0; i < formElements.length; i++) {
      if (formElements[i].getAttribute('data-coordinates') === null) continue
      const subCoordinatesString = formElements[i].getAttribute('data-coordinates')
      const subCoordinatesArray = subCoordinatesString.split(',')
      if ((subCoordinatesArray.length === coordinatesArray.length+1) && (subCoordinatesString.startsWith(coordinatesString))) subQuestions.push(formElements[i])
    }
    return subQuestions;
  }
  const subQuestions = detectSubQuestions();
  for (let i = 0; i < subQuestions.length; i++) {
    if (subQuestions[i].dataset.condition !== undefined) {
      let { parentQuestion, conditionType, conditionValue } = JSON.parse(
        subQuestions[i].dataset.condition
      );
      parentQuestion = parentQuestion.split("%^&").join(" ");
      conditionValue = conditionValue.split("%^&").join(" ");
      if ((parentQuestion === labelQuestion) 
      ) {
        switch (conditionType) {
          case "===":
            if (conditionValue === currentAnswer) {
              subQuestions[i].classList.remove("hidden");
              shouldHideDescendants = false;
            } else {
              subQuestions[i].classList.add("hidden");
              shouldHideDescendants = true;
            }
            break;
          case "greater":
            if (conditionValue < currentAnswer) {
              subQuestions[i].classList.remove("hidden");
              shouldHideDescendants = false;
            } else {
              subQuestions[i].classList.add("hidden");
              shouldHideDescendants = true;
            }
            break;
          case "smaller":
            if (conditionValue > currentAnswer && currentAnswer !=='') {
              subQuestions[i].classList.remove("hidden");
              shouldHideDescendants = false;
            } else {
              subQuestions[i].classList.add("hidden");
              shouldHideDescendants = true;
            }
            break;
        }
      }
      const siblingYesInput = subQuestions.find(element => element.value === 'yes' && element.nodeName === 'INPUT');
      const hasCheckedYesSibling = siblingYesInput !== undefined && siblingYesInput.checked && subQuestions[i].value !== 'yes';
      if ((subQuestions[i].nodeName === "INPUT") && (!hasCheckedYesSibling)) unhideFollowups(subQuestions[i],formElements, shouldHideDescendants);
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

function getFollowupQuestionButton(higherElement) {
  const allChildren = higherElement.children;
  let followupQuestionButton;
  for (let i = 0; i < allChildren.length; i++) {
    if (allChildren[i].classList.contains('followup-question-button')) followupQuestionButton = allChildren[i];
  }
  return followupQuestionButton;
}

function goToCurrentFollowup(coordinates) {
  const primaryBoxes = getQuestionBoxes(formBuilder);
  let currentBox = primaryBoxes[coordinates[0]];
  for (let i = 1; i < coordinates.length - 1; i++) {
    const lowerBoxes = getQuestionBoxes(currentBox);
    currentBox = lowerBoxes[coordinates[i]];
  }
  const lowestRow = getQuestionBoxes(currentBox);
  const currentFollowup = lowestRow[lowestRow.length - 1];
  return currentFollowup;
}

function fillInCurrentFollowup(followup, coordinates) {
  const currentFollowup = goToCurrentFollowup(coordinates);
  const questionInput = currentFollowup.querySelector("#question");
  const conditionInput = currentFollowup.querySelector("input#condition");
  const conditionSelect = currentFollowup.querySelector("select#condition");
  const conditionTypeSelect = currentFollowup.querySelector(
    "select#condition-type"
  );
  conditionTypeSelect.value = followup.condition.conditionType;
  if (conditionSelect === null)
    conditionInput.value = followup.condition.conditionValue
      .split("%^&")
      .join(" ");
  if (conditionInput === null)
    conditionSelect.value = followup.condition.conditionValue;
  questionInput.value = followup.question;
}

function restoreFollowupQuestions(higherQuestion) {
  const primaryBoxes = getQuestionBoxes(formBuilder);
  higherQuestion.followups.forEach((followup) => {
    const coordinates = followup.coordinates;
    let nestedButtonBox = primaryBoxes[coordinates[0]];
    for (let i = 1; i < coordinates.length - 1; i++) {
      const nestedQuestionBoxes = getQuestionBoxes(nestedButtonBox);
      nestedButtonBox = nestedQuestionBoxes[coordinates[i]];
    }
    const nestedButton = nestedButtonBox.querySelector(
      ".followup-question-button"
    );
    handleAddFollowupQuestion(nestedButton, followup);
    fillInCurrentFollowup(followup, coordinates);
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
    if (question.followups.length > 0) {
      restoreFollowupQuestions(question);
    }
  });
  formTree.splice(0, formTree.length);
  generateFormTree(formBuilder, formTree);
  generateForm();
  generateButton.classList.remove("hidden");
  clearButton.classList.remove("hidden");
}

export function containsEmptyInputs() {
  const inputFields = formBuilder.querySelectorAll("input");
  for (let i = 0; i < inputFields.length; i++) {
    if (inputFields[i].value === "") {
      return true;
    }
  }
}

export function toggleFormBuilderVisibility() {
  formBuilder.classList.toggle("hidden");
  clearButton.classList.toggle("hidden");
}

export function regenerateFollowups(targetElement) {
  const parentQuestionBox = goToQuestionBox(targetElement);
  const subQuestionBoxes = getQuestionBoxes(parentQuestionBox);
  const followupQuestionButton = getFollowupQuestionButton(parentQuestionBox)
  if (subQuestionBoxes.length === 0) return;
  for (let i = 0; i < subQuestionBoxes.length; i++) {
    const divMarkup = conditionDivMarkup(followupQuestionButton);
    const oldConditionDiv = subQuestionBoxes[i].querySelector(".condition-div");
    oldConditionDiv.remove();
    subQuestionBoxes[i].insertAdjacentHTML("afterbegin", divMarkup);
  }
}
