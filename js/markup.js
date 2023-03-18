import { shouldAddPrimaryQuestion } from "./supportFunctions.js";
import { getQuestionType } from "./supportFunctions.js";

export const primaryQuestionMarkup =
  `
<label for="question">Question</label>
<input name="question" id="question" type="text" />
<label for="answer-type">Type</label>
<select name="answer-type" id="answer-type">
  <option value="text">Text</option>
  <option value="number">Number</option>
  <option value="radio">Yes / No</option>
</select>
<button type="button" class="save-question-button">Save question</button>
<button type="button" class="followup-question-button"` +
  //  disabled
  `>Add follow-up question</button>
`;

export const followupQuestionMarkup =
  `
<label for="condition">Condition</label>
<select name="condition-type" id="condition-type">
  <option value="=">Equals</option>
  <option value=">">Greater than</option>
  <option value="<">Less than</option>
</select>
<input name="question" id="condition" type="text" />` + primaryQuestionMarkup;

export function questionMarkup(event) {
  if (shouldAddPrimaryQuestion(event)) {
    return primaryQuestionMarkup;
  } else {
    const questionType = getQuestionType(event.target);
    const numberOptions =
      questionType === "number"
        ? ` <option value="greater">Greater than</option>
    <option value="smaller">Less than</option>`
        : null;
    const conditionInput =
      questionType === "radio"
        ? `<select name="condition" id="condition">
    <option value="yes">Yes</option>
    <option value="no">No</option>
    </select>
    `
        : `<input name="question" id="condition" type="text" />`;
    return (
      `
  <label for="condition">Condition</label>
  <select name="condition-type" id="condition-type">
    <option value="===">Equals</option>` +
      numberOptions +
      `</select>` +
      conditionInput +
      primaryQuestionMarkup
    );
  }
}

export function generatePrimaryQuestion(primaryQuestion, index, markupArray) {
  let labelMarkup = "";
  if (primaryQuestion.type === "radio") {
    labelMarkup = `<label class="form-question" for='primaryQuestion${
      index + 1
    }y'>${primaryQuestion.question}</label>
      <input type="radio" name='primaryQuestion${
        index + 1
      }' id='primaryQuestion${index + 1}y' value="yes">
      Yes
    <label for='primaryQuestion${index + 1}n'></label>
      <input type="radio" name='primaryQuestion${
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
    }' id='primaryQuestion${index + 1}' type=${primaryQuestion.type}/>`;
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
    )} class="hidden" type="radio" name='followupQuestion${
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
    )} class="hidden" type="radio" name='followupQuestion${
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
    }' id='followupQuestion${index + 1}' type=${followupQuestion.type}/>`;
  }
  markupArray.push(labelMarkup);
}
