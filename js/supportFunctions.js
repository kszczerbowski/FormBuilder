export function shouldAddPrimaryQuestion(event) {
  return event.target.parentNode.classList.contains("form-builder");
}

export function isPrimaryQuestion(targetElement) {
  return targetElement.parentNode.classList.contains("primary-box");
}

export function getNestingDegree(targetELement, nestingDegree = 0) {
  nestingDegree++;
  if (!targetELement.parentNode.classList.contains("primary-box")) {
    return getNestingDegree(targetELement.parentElement);
  }
  return nestingDegree;
}

export function prepareEmptyPrimaryBox(element, position) {
  element.insertAdjacentHTML(position, `<div class="primary-box"></div>`);
}

export function prepareEmptyFollowupBox(element, position) {
  element.insertAdjacentHTML(position, `<div class="followup-box"></div>`);
}
