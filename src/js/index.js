import { questionMarkup, initialFormBuilderMarkup } from "./markup.js";
import {
  goToFormBuildersLastDiv,
  goToLastSibling,
  goToQuestionBox,
} from "./navigateFunctions.js";
import {
  prepareEmptyFollowupBox,
  prepareEmptyPrimaryBox,
  generateFormTree,
  generateQuestions,
  unhideFollowups,
  restoreFormBuilderAndForm,
  containsEmptyInputs,
  toggleFormBuilderVisibility,
  regenerateFollowups,
} from "./supportFunctions.js";

let shouldShowFormBuilder = JSON.parse(
  localStorage.getItem("shouldShowFormBuilder")
);
export const formBuilder = document.querySelector(".form-builder");
export let generateButton = document.querySelector(".generate-button");
export const clearButton = document.querySelector(".clear-button");
const targetForm = document.querySelector(".generated-form");
let formElements = [];
export const formTree = [];
const formMarkupArray = [];
let numberOfPrimaryQuestion = 0;

restoreFormBuilderAndForm();
export function handleAddPrimaryQuestion(
  targetElement,
  predefinedObject = { question: "", type: "" }
) {
  numberOfPrimaryQuestion++;
  const lastPrimaryQuestionDiv = goToFormBuildersLastDiv(targetElement);
  lastPrimaryQuestionDiv.insertAdjacentHTML(
    "afterbegin",
    questionMarkup(targetElement, predefinedObject)
  );
  prepareEmptyFollowupBox(lastPrimaryQuestionDiv, "beforeend");
  prepareEmptyPrimaryBox(lastPrimaryQuestionDiv, "afterend");
  generateButton.classList.remove("hidden");
}

if (shouldShowFormBuilder === false) toggleFormBuilderVisibility();

export function handleAddFollowupQuestion(
  targetElement,
  predefinedObject = { question: "", type: "" }
) {
  const followupQuestionDiv = goToLastSibling(targetElement);
  followupQuestionDiv.insertAdjacentHTML(
    "afterbegin",
    questionMarkup(targetElement, predefinedObject)
  );
  prepareEmptyFollowupBox(followupQuestionDiv, "beforeend");
  prepareEmptyFollowupBox(followupQuestionDiv, "afterend");
}

export function generateForm() {
  formMarkupArray.splice(0, formMarkupArray.length);
  generateQuestions(formTree, formMarkupArray);
  const formMarkup = formMarkupArray.join("");
  targetForm.innerHTML = formMarkup;
  formElements = targetForm.children;
  localStorage.setItem("formTree", JSON.stringify(formTree));
  targetForm.classList.add("form-padding");
}

function clearFormAndBuilder() {
  formBuilder.innerHTML = initialFormBuilderMarkup;
  targetForm.innerHTML = ``;
  localStorage.removeItem("formTree");
  clearButton.classList.add("hidden");
  generateButton = document.querySelector(".generate-button");
  numberOfPrimaryQuestion = 0;
  targetForm.classList.remove("form-padding");
}

formBuilder.addEventListener("click", (event) => {
  const eventTargetClass = event.target.classList[0];
  let questionBox;
  switch (eventTargetClass) {
    case "primary-question-button":
      generateButton.classList.remove("hidden");
      clearButton.classList.remove("hidden");
      handleAddPrimaryQuestion(event.target);
      break;
    case "followup-question-button":
      handleAddFollowupQuestion(event.target);
      break;
    case "delete-question-button":
    case "delete-cross-icon":
    case "delete-path":
      questionBox = goToQuestionBox(event.target);
      questionBox.remove();
      break;
    case "generate-button":
      if (containsEmptyInputs()) {
        Notiflix.Notify.failure(
          "Please fill in all fields before generating the form!"
        );
        return;
      }
      formTree.splice(0, formTree.length);
      generateFormTree(formBuilder, formTree);
      generateForm();
      Notiflix.Notify.info(
        "If you want to hide the form builder, press ctrl+shift+H."
      );
      break;
    default:
      return;
  }
});

formBuilder.addEventListener("input", (event) => {
  const eventTargetID = event.target.id;
  if (eventTargetID === "answer-type") {
    regenerateFollowups(event.target);
  } else {
    return;
  }
});

targetForm.addEventListener("input", (event) => {
  if (event.target.nodeName !== "INPUT") return;
  unhideFollowups(event.target, formElements);
});

clearButton.addEventListener("click", clearFormAndBuilder);

document.addEventListener("keydown", (event) => {
  if (
    (event.ctrlKey || event.metaKey) &&
    event.shiftKey &&
    event.code === "KeyH"
  ) {
    toggleFormBuilderVisibility();
    if (shouldShowFormBuilder === true) {
      shouldShowFormBuilder = false;
      localStorage.setItem("shouldShowFormBuilder", "false");
      Notiflix.Notify.info(
        "If you want to unhide the form builder, press ctrl+shift+H again."
      );
    } else {
      shouldShowFormBuilder = true;
      localStorage.setItem("shouldShowFormBuilder", "true");
    }
  }
});
