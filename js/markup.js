import { shouldAddPrimaryQuestion } from "./supportFunctions.js";

export const primaryQuestionMarkup = `
<label for="question">Question</label>
<input name="question" id="question" type="text" />
<label for="answer-type">Type</label>
<select name="answer-type" id="answer-type">
  <option value="text">Text</option>
  <option value="number">Number</option>
  <option value="yesNo">Yes / No</option>
</select>
<button type="button" class="save-question-button">Save question</button>
<button type="button" class="followup-question-button">Add follow-up question</button>
`;

export const followupQuestionMarkup =
  `
<label for="condition">Condition</label>
<input name="question" id="condition" type="text" />` + primaryQuestionMarkup;

export function questionMarkup(event) {
  return shouldAddPrimaryQuestion(event)
    ? primaryQuestionMarkup
    : followupQuestionMarkup;
}
