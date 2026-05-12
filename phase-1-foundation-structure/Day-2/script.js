const tabButtons = document.querySelectorAll(".tab-btn"),
  tabPanels = document.querySelectorAll(".tab-panel"),
  indicator = document.getElementById("tab-indicator"),
  firstActiveBtn = document.querySelector(".tab-btn.active");

function moveIndicator(btn) {
  const btnRect = btn.getBoundingClientRect();
  const listRect = btn.closest(".tab-list").getBoundingClientRect();

  const offsetLeft = btnRect.left - listRect.left;
  const width = btnRect.width;

  indicator.style.transform = "translateX(" + offsetLeft + "px) scaleX(" + width + ")";
}

if (tabButtons.length > 0 && tabPanels.length > 0 && indicator && firstActiveBtn) {
  moveIndicator(firstActiveBtn);

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((button) => {
        button.classList.remove("active");
      });

      tabPanels.forEach((panel) => {
        panel.classList.remove("active");
      });

      btn.classList.add("active");

      const targetId = btn.dataset.tab;
      const targetPanel = document.getElementById(targetId);

      targetPanel.classList.add("active");

      moveIndicator(btn);
    });
  });
} else {
  console.error("Tabs setup failed. Check your HTML classes and IDs.");
}
