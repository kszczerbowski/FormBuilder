import {
  questionMarkup,
  generatePrimaryQuestion,
  generateFollowupQuestion,
} from "./markup.js";
import {
  goToFormBuildersLastDiv,
  goToLastSibling,
  goToFollowupQuestionButton,
  goToNestedArray,
} from "./navigateFunctions.js";
import {
  isPrimaryQuestion,
  getNestingDegree,
  prepareEmptyFollowupBox,
  prepareEmptyPrimaryBox,
  getQuestionProperties,
  blockQuestionButtons,
  unblockQuestionButtons,
  generateFormTree,
  getCoordinates,
  generateQuestions,
  unhideFollowups,
} from "./supportFunctions.js";

const formBuilder = document.querySelector(".form-builder");
const primaryQuestionButton = document.querySelector(
  ".primary-question-button"
);
const generateButton = document.querySelector(".generate-button");
const targetForm = document.querySelector(".generated-form");
let formElements = [];
export const formTree = [];
const formMarkupArray = [];
let numberOfPrimaryQuestion = 0;

function handleAddPrimaryQuestion(event) {
  numberOfPrimaryQuestion++;
  const lastPrimaryQuestionDiv = goToFormBuildersLastDiv(event.target);
  lastPrimaryQuestionDiv.insertAdjacentHTML(
    "afterbegin",
    questionMarkup(event)
  );
  prepareEmptyFollowupBox(lastPrimaryQuestionDiv, "beforeend");
  prepareEmptyPrimaryBox(lastPrimaryQuestionDiv, "afterend");
  // blockQuestionButtons();
}

function handleAddFollowupQuestion(event) {
  const followupQuestionDiv = goToLastSibling(event.target);
  followupQuestionDiv.insertAdjacentHTML("afterbegin", questionMarkup(event));
  prepareEmptyFollowupBox(followupQuestionDiv, "beforeend");
  prepareEmptyFollowupBox(followupQuestionDiv, "afterend");
  // blockQuestionButtons();
}

export function handleSaveQuestion(targetElement) {
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
    });
  }
  // unblockQuestionButtons();
  // targetElement.classList.add("hidden");
}

function generateForm() {
  formMarkupArray.splice(0, formMarkupArray.length);
  generateQuestions(formTree, formMarkupArray);
  const formMarkup = formMarkupArray.join("");
  targetForm.innerHTML = formMarkup;
  formElements = targetForm.children;
  console.log("form tree: ", formTree);
  console.log("children: ", formElements);
}

formBuilder.addEventListener("click", (event) => {
  const eventTargetClass = event.target.classList[0];
  switch (eventTargetClass) {
    case "primary-question-button":
      generateButton.classList.remove("hidden");
      handleAddPrimaryQuestion(event);
      break;
    case "save-question-button":
      handleSaveQuestion(event.target);
      break;
    case "followup-question-button":
      handleAddFollowupQuestion(event);
      break;
    case "generate-button":
      formTree.splice(0, formTree.length);
      generateFormTree(formBuilder, formTree);
      generateForm();
      break;
    default:
      return;
  }
});

targetForm.addEventListener("input", (event) => {
  if (event.target.nodeName !== "INPUT") return;
  unhideFollowups(event.target, formElements);
});

// const arrayOfObjects = [{
//   question: question,
//   type: type,
//   followups: [],
// },{
//   question: question,
//   type: type,
//   followups: [
//     {
//       condition: condition,
//       question: question,
//       type: type,
//       followups: [],
//     },
//     {
//       condition: condition,
//       question: question,
//       type: type,
//       followups: [],
//     }
//   ],
// },{
//   question: question,
//   type: type,
//   followups: [],
// },{
//   question: question,
//   type: type,
//   followups: [],
// }]
