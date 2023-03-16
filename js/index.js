import {
  primaryQuestionMarkup,
  followupQuestionMarkup,
  questionMarkup,
} from "./markup.js";
import {
  goToFormBuildersLastDiv,
  goToLastSibling,
} from "./navigateFunctions.js";
import {
  shouldAddPrimaryQuestion,
  isPrimaryQuestion,
  getNestingDegree,
  prepareEmptyFollowupBox,
  prepareEmptyPrimaryBox,
} from "./supportFunctions.js";

const formBuilder = document.querySelector(".form-builder");
const generateButton = document.querySelector(".generate-button");
const targetForm = document.querySelector(".generated-form");
const formTree = {};
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
}

function handleAddFollowupQuestion(event) {
  const followupQuestionDiv = goToLastSibling(event.target);
  followupQuestionDiv.insertAdjacentHTML("afterbegin", questionMarkup(event));
  prepareEmptyFollowupBox(followupQuestionDiv, "beforeend");
  prepareEmptyFollowupBox(followupQuestionDiv, "afterend");
}

function handleSaveQuestion(event) {
  // formTree['primaryQuestion'+numberOfPrimaryQuestion] = {
  //     question: '',
  //     type: '',
  //     followups: []
  // }
  // console.log('form tree: ', formTree)
  console.log(isPrimaryQuestion(event.target));
}

function generateForm() {
  console.log("generate form so much");
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
      const followupDivs = document.querySelectorAll(".followup-box");
      followupDivs.forEach(
        (div) => (div.style.marginLeft = `${getNestingDegree(div) * 40}px`)
      );
      break;
    case "generate-button":
      generateForm();
      break;
    default:
      return;
  }
});
