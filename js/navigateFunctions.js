export function goToFormBuildersLastDiv(targetELement) {
  if (!targetELement.classList.contains("form-builder")) {
    return goToFormBuildersLastDiv(targetELement.parentElement);
  }
  return targetELement.lastElementChild.previousElementSibling;
}

export function goToLastSibling(targetElement) {
  return targetElement.parentNode.lastElementChild;
}

export function goToFollowupQuestionButton(targetElement) {
    return targetElement.parentNode.querySelector('.followup-question-button');
  }

export function goToNestedArray(coordinates, formTree) {
  // console.log('coordinates: ', coordinates)
  // console.log('coordinates[0]: ', coordinates[0])
  // console.log('formTree[0]: ', formTree[0])

  let nestedArray = formTree[coordinates[0]].followups
  for (let i=1; i<coordinates.length; i++ ) {
    nestedArray = nestedArray[coordinates[i]].followups
  }
  return nestedArray;
}
