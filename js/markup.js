import { shouldAddPrimaryQuestion } from "./supportFunctions.js";
import { getQuestionType } from "./supportFunctions.js";

export const primaryQuestionMarkup = `
<label for="question">Question</label>
<input name="question" id="question" type="text" />
<label for="answer-type">Type</label>
<select name="answer-type" id="answer-type">
  <option value="text">Text</option>
  <option value="number">Number</option>
  <option value="radio">Yes / No</option>
</select>
<button type="button" class="save-question-button">Save question</button>
<button type="button" class="followup-question-button" disabled>Add follow-up question</button>
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
        ? ` <option value=">">Greater than</option>
    <option value="<">Less than</option>`
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
    <option value="=">Equals</option>` +
      numberOptions +
      `</select>` +
      conditionInput +
      primaryQuestionMarkup
    );
  }
}

// export function questionMarkup(event) {
//   return shouldAddPrimaryQuestion(event)
//     ? primaryQuestionMarkup
//     : followupQuestionMarkup;
// }
