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
  restoreFormBuilderAndForm,
} from "./supportFunctions.js";

export const formBuilder = document.querySelector(".form-builder");
const primaryQuestionButton = document.querySelector(
  ".primary-question-button"
);
export const generateButton = document.querySelector(".generate-button");
const targetForm = document.querySelector(".generated-form");
let formElements = [];
export const formTree = [];
const formMarkupArray = [];
let numberOfPrimaryQuestion = 0;

restoreFormBuilderAndForm();

export function handleAddPrimaryQuestion(targetElement, predefinedObject = { question: "", type: "" }) {
  numberOfPrimaryQuestion++;
  const lastPrimaryQuestionDiv = goToFormBuildersLastDiv(targetElement);
  lastPrimaryQuestionDiv.insertAdjacentHTML(
    "afterbegin",
    questionMarkup(targetElement, predefinedObject)
  );
  prepareEmptyFollowupBox(lastPrimaryQuestionDiv, "beforeend");
  prepareEmptyPrimaryBox(lastPrimaryQuestionDiv, "afterend");
  // blockQuestionButtons();
}

export function handleAddFollowupQuestion(targetElement, predefinedObject = { question: "", type: "" }) {
  const followupQuestionDiv = goToLastSibling(targetElement);
  followupQuestionDiv.insertAdjacentHTML("afterbegin", questionMarkup(targetElement, predefinedObject));
  prepareEmptyFollowupBox(followupQuestionDiv, "beforeend");
  prepareEmptyFollowupBox(followupQuestionDiv, "afterend");
  // blockQuestionButtons();
}

function generateForm() {
  formMarkupArray.splice(0, formMarkupArray.length);
  generateQuestions(formTree, formMarkupArray);
  const formMarkup = formMarkupArray.join("");
  targetForm.innerHTML = formMarkup;
  formElements = targetForm.children;
  localStorage.setItem('formTree', JSON.stringify(formTree))
  console.log("form tree: ", formTree);
  console.log("children: ", formElements);
}

formBuilder.addEventListener("click", (event) => {
  const eventTargetClass = event.target.classList[0];
  switch (eventTargetClass) {
    case "primary-question-button":
      generateButton.classList.remove("hidden");
      handleAddPrimaryQuestion(event.target);
      break;
    case "followup-question-button":
      handleAddFollowupQuestion(event.target);
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

function isQuestionBox(targetElement) {
  return (
    targetElement.classList.contains("followup-box") ||
    targetElement.classList.contains("primary-box")
  );
}

function getQuestionBoxes(higherElement) {
  const allChildren = higherElement.children;
  const questionBoxes = [];
  for (let i = 0; i < allChildren.length; i++) {
    if (
      allChildren[i].children.length > 0 && isQuestionBox(allChildren[i])
    )
      questionBoxes.push(allChildren[i]);
  }
  console.log('questionBoxes: ',questionBoxes)
  return questionBoxes;
}

getQuestionBoxes(formBuilder)
