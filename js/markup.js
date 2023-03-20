import { shouldAddPrimaryQuestion } from "./supportFunctions.js";
import { getQuestionType } from "./supportFunctions.js";

export const initialFormBuilderMarkup = `<button type="button" class="primary-question-button">
Add question
</button>
<div class="primary-box"></div>
<button type="button" class="generate-button hidden">
Generate form
</button>`;

export const primaryQuestionMarkup = (predefinedObject) => {
  const { type } = predefinedObject;
  let optionValues;
  switch (type) {
    case "number":
      optionValues = `<option value="text">Text</option>
    <option value="number" selected>Number</option>
    <option value="radio">Yes / No</option>`;
      break;
    case "radio":
      optionValues = `<option value="text">Text</option>
    <option value="number">Number</option>
    <option value="radio" selected>Yes / No</option>`;
      break;
    default:
      optionValues = `<option value="text">Text</option>
    <option value="number">Number</option>
    <option value="radio">Yes / No</option>`;
  }
  return (
    `
<label for="question">Question</label>
<input name="question" id="question" type="text"/>
<label for="answer-type">Type</label>
<select name="answer-type" id="answer-type">` +
    optionValues +
    `</select>
    <button type="button" class="delete-question-button">
    <span>
      <svg class="delete-cross-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        viewBox="0 0 24 24"
      >
        <path class="delete-path" d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
      </svg>
    </span>
  </button>
<button type="button" class="followup-question-button">Add follow-up question</button>
`
  );
};

export function questionMarkup(targetElement, predefinedObject) {
  if (shouldAddPrimaryQuestion(targetElement)) {
    return primaryQuestionMarkup(predefinedObject);
  } else {
    const questionType = getQuestionType(targetElement);
    const numberOptions =
      questionType === "number"
        ? ` <option value="greater">Greater than</option>
    <option value="smaller">Less than</option>`
        : null;
    let conditionInput;
    switch (questionType) {
      case "radio":
        conditionInput = `<select name="condition" id="condition">
        <option value="yes">Yes</option>
        <option value="no">No</option>
        </select>
        `;
        break;
      case "number":
        conditionInput = `<input name="question" id="condition" type="number" />`;
        break;
      default:
        conditionInput = `<input name="question" id="condition" type="text" />`;
    }
    return (
      `
  <label for="condition">Condition</label>
  <select name="condition-type" id="condition-type">
    <option value="===">Equals</option>` +
      numberOptions +
      `</select>` +
      conditionInput +
      primaryQuestionMarkup(predefinedObject)
    );
  }
}

export function generatePrimaryQuestion(primaryQuestion, index, markupArray) {
  let labelMarkup = "";
  if (primaryQuestion.type === "radio") {
    labelMarkup = `<label class="form-question" for='primaryQuestion${
      index + 1
    }y'>${primaryQuestion.question}</label>
      <input class='radio-input' type="radio" name='primaryQuestion${
        index + 1
      }' id='primaryQuestion${index + 1}y' value="yes">
      Yes
    <label for='primaryQuestion${index + 1}n'></label>
      <input class='radio-input' type="radio" name='primaryQuestion${
        index + 1
      }' id='primaryQuestion${index + 1}n' value="no">
      No`;
  } else {
    labelMarkup = `<label for="primaryQuestion${
      index + 1
    }" class="form-question">${
      primaryQuestion.question
    }</label><input class="form-input" name='primaryQuestion${
      index + 1
    }' id='primaryQuestion${index + 1}' type=${primaryQuestion.type}>`;
  }
  markupArray.push(labelMarkup);
}

export function generateFollowupQuestion(followupQuestion, index, markupArray) {
  let labelMarkup = "";
  if (followupQuestion.type === "radio") {
    labelMarkup = `<label data-condition=${JSON.stringify(
      followupQuestion.condition
    )} class="form-question hidden" for='followupQuestion${index + 1}y'>${
      followupQuestion.question
    }</label>
    <input data-condition=${JSON.stringify(
      followupQuestion.condition
    )} class="hidden radio-input" type="radio" name='followupQuestion${
      index + 1
    }' id='followupQuestion${index + 1}y' value="yes">
    <span data-condition=${JSON.stringify(
      followupQuestion.condition
    )} class="hidden">Yes</span>
  <label data-condition=${JSON.stringify(
    followupQuestion.condition
  )} for='followupQuestion${index + 1}n'></label>
    <input data-condition=${JSON.stringify(
      followupQuestion.condition
    )} class="hidden radio-input" type="radio" name='followupQuestion${
      index + 1
    }' id='followupQuestion${index + 1}n' value="no">
    <span data-condition=${JSON.stringify(
      followupQuestion.condition
    )} class="hidden">No</span>`;
  } else {
    labelMarkup = `<label data-condition=${JSON.stringify(
      followupQuestion.condition
    )} for="followupQuestion${index + 1}" class="form-question hidden">${
      followupQuestion.question
    }</label><input data-condition=${JSON.stringify(
      followupQuestion.condition
    )} class="form-input hidden" name='followupQuestion${
      index + 1
    }' id='followupQuestion${index + 1}' type=${followupQuestion.type}>`;
  }
  markupArray.push(labelMarkup);
}
