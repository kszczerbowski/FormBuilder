import { questionMarkup } from "./markup.js";
import {
  goToFormBuildersLastDiv,
  goToLastSibling,
  goToFollowupQuestionButton,
  goToNestedArray
} from "./navigateFunctions.js";
import {
  isPrimaryQuestion,
  getNestingDegree,
  prepareEmptyFollowupBox,
  prepareEmptyPrimaryBox,
  getQuestionProperties,
  blockQuestionButtons,
  unblockQuestionButtons,
  getCoordinates
} from "./supportFunctions.js";

const formBuilder = document.querySelector(".form-builder");
const primaryQuestionButton = document.querySelector(
  ".primary-question-button"
);
const generateButton = document.querySelector(".generate-button");
const targetForm = document.querySelector(".generated-form");
const formTree = [];
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
  blockQuestionButtons();
}

function handleAddFollowupQuestion(event) {
  const followupQuestionDiv = goToLastSibling(event.target);
  followupQuestionDiv.insertAdjacentHTML("afterbegin", questionMarkup(event));
  prepareEmptyFollowupBox(followupQuestionDiv, "beforeend");
  prepareEmptyFollowupBox(followupQuestionDiv, "afterend");
  blockQuestionButtons();
}

function handleSaveQuestion(event) {
  const followupQuestionButton = goToFollowupQuestionButton(event.target);
  if (isPrimaryQuestion(event.target)) {
    const [question, type] = getQuestionProperties(event.target);
    formTree.push({
      question: question,
      type: type,
      followups: [],
    });
  } else {
    const [condition, question, type] = getQuestionProperties(event.target);
    console.log("condition: ", condition);
    console.log("question: ", question);
    console.log("type: ", type);
    const coordinates = getCoordinates(event.target)
    const nestedArray = goToNestedArray(coordinates,formTree)
    nestedArray.push({
      condition: condition,
      question: question,
      type: type,
      followups: [],
    });
  }
  unblockQuestionButtons();
  event.target.classList.add("hidden");
}

function generateForm() {
  console.log("generate form so much");
  console.log('form tree: ', formTree)
}

formBuilder.addEventListener("click", (event) => {
  const eventTargetClass = event.target.classList[0];
  switch (eventTargetClass) {
    case "primary-question-button":
      generateButton.classList.remove("hidden");
      handleAddPrimaryQuestion(event);
      break;
    case "save-question-button":
      handleSaveQuestion(event);
      break;
    case "followup-question-button":
      handleAddFollowupQuestion(event);
      break;
    case "generate-button":
      generateForm();
      break;
    default:
      return;
  }
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
