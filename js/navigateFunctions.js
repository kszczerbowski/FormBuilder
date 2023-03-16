export function goToFormBuildersLastDiv(targetELement) {
  if (!targetELement.classList.contains("form-builder")) {
    return goToFormBuildersLastDiv(targetELement.parentElement);
  }
  return targetELement.lastElementChild.previousElementSibling;
}

export function goToLastSibling(targetElement) {
  return targetElement.parentNode.lastElementChild;
}
