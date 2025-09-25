// //function for buttons
const buttonGroups = document.querySelectorAll(".filter-and-buttons, .sorting-and-buttons")

buttonGroups.forEach(group => {
  const buttons = group.querySelectorAll("button")

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("selected"));
      button.classList.add("selected");
    });
  });
});


