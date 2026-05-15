/* ============================================================
   script.js — Phase 1
   Foundation: static tabs, sliding indicator, fade transition

   This file is linked at the BOTTOM of index.html, just before
   </body>. That means all HTML elements already exist by the
   time this script runs.

   This JavaScript controls:
   - which tab button is active
   - which content panel is visible
   - where the sliding indicator sits
============================================================ */

/* ============================================================
   STEP 1 — GRAB THE ELEMENTS
   We collect the HTML elements JavaScript needs to control.

   querySelectorAll() finds EVERY element matching the selector.
   It returns a NodeList, which behaves like an array for looping.

   getElementById() finds ONE element with the exact matching id.

   querySelector() finds only the FIRST matching element.
============================================================ */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");
const indicator = document.getElementById("tab-indicator");
const firstActiveBtn = document.querySelector(".tab-btn.active");

/* ============================================================
   STEP 2 — THE moveIndicator FUNCTION
   This function moves the gold indicator line under the active tab.

   It takes one argument:
     btn → the button the indicator should sit underneath

   The function measures:
   - the clicked button's position and width
   - the tab list's position

   Then it calculates how far the indicator needs to move.
============================================================ */
function moveIndicator(btn) {
  /* getBoundingClientRect() measures the button's size and
     position relative to the visible browser window.

     It returns values like:
     - left
     - right
     - top
     - bottom
     - width
     - height
  */
  const btnRect = btn.getBoundingClientRect();

  /* closest(".tab-list") walks upward from the button until it
     finds the nearest parent element with the class .tab-list.

     We measure .tab-list because the indicator should move
     relative to the tab list, not relative to the full page.
  */
  const listRect = btn.closest(".tab-list").getBoundingClientRect();

  /* offsetLeft tells us how far the button sits from the left
     edge of the tab list.

     Example:
       listRect.left = 40
       btnRect.left  = 160

       offsetLeft = 160 - 40
       offsetLeft = 120

     So the indicator needs to move 120px from the tab list's
     left edge.
  */
  const offsetLeft = btnRect.left - listRect.left;

  /* width is the button's actual width.
     The indicator starts as 1px wide in CSS, then JavaScript
     stretches it to match the button width using scaleX().
  */
  const width = btnRect.width;

  /* This line moves and stretches the indicator.

     translateX(offsetLeft) moves it horizontally.
     scaleX(width) stretches it from 1px to the button's width.

     CSS handles the smooth animation because .tab-indicator has
     a transition on transform.
  */
  indicator.style.transform = "translateX(" + offsetLeft + "px) scaleX(" + width + ")";
}

/* ============================================================
   STEP 3 — SAFETY CHECK
   Before running the tabs logic, we confirm that the important
   elements actually exist in the HTML.

   This prevents JavaScript from breaking silently if:
   - a class name is misspelled
   - the indicator id is missing
   - no active tab exists
   - the panels are not found

   If everything exists, the tabs system runs.
   If something is missing, we show a clear console error.
============================================================ */
if (tabButtons.length > 0 && tabPanels.length > 0 && indicator && firstActiveBtn) {
  /* ============================================================
     STEP 4 — SET THE INITIAL INDICATOR POSITION
     The first tab already has .active in the HTML.

     But the indicator does not automatically know where that
     active tab is.

     So on page load, we move the indicator under the first
     active button immediately.
  ============================================================ */
  moveIndicator(firstActiveBtn);

  /* ============================================================
     STEP 5 — ATTACH CLICK LISTENERS TO EVERY TAB BUTTON
     forEach() loops over every tab button.

     For each button, we attach a click event listener.

     That means:
     "When this button is clicked, run the function inside."
  ============================================================ */
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      /* ── CLEAR ALL ACTIVE BUTTONS ───────────────────────────
         Before activating the clicked button, we remove .active
         from every button.

         This prevents multiple buttons from looking active at
         the same time.
      ─────────────────────────────────────────────────────── */
      tabButtons.forEach((button) => {
        button.classList.remove("active");
      });

      /* ── CLEAR ALL ACTIVE PANELS ────────────────────────────
         We also remove .active from every content panel.

         This hides the currently visible panel before showing
         the new one.
      ─────────────────────────────────────────────────────── */
      tabPanels.forEach((panel) => {
        panel.classList.remove("active");
      });

      /* ── ACTIVATE THE CLICKED BUTTON ────────────────────────
         btn is the specific button the user clicked.

         We add .active to it so CSS can style it as the selected
         tab.
      ─────────────────────────────────────────────────────── */
      btn.classList.add("active");

      /* ── FIND THE MATCHING PANEL ────────────────────────────
         Each button has a data-tab attribute in the HTML.

         Example:
           <button data-tab="craft">

         btn.dataset.tab reads that value.

         So:
           btn.dataset.tab → "craft"

         Then getElementById("craft") finds:

           <div id="craft" class="tab-panel">

         This connects the clicked button to the correct panel.
      ─────────────────────────────────────────────────────── */
      const targetId = btn.dataset.tab;
      const targetPanel = document.getElementById(targetId);

      /* ── ACTIVATE THE MATCHING PANEL ────────────────────────
         Once we find the correct panel, we add .active to it.

         CSS then makes it visible by changing:
         - opacity
         - visibility
         - pointer-events
         - position
      ─────────────────────────────────────────────────────── */
      targetPanel.classList.add("active");

      /* ── MOVE THE INDICATOR ─────────────────────────────────
         Finally, we move the indicator under the clicked button.

         JavaScript calculates the new position.
         CSS animates the movement.
      ─────────────────────────────────────────────────────── */
      moveIndicator(btn);
    }); /* end click listener */
  }); /* end forEach */
} else {
  /* ============================================================
     SETUP FAILED
     This runs only if one of the required HTML elements is missing.

     If you see this error in the browser console, check:
     - .tab-btn
     - .tab-panel
     - #tab-indicator
     - .tab-btn.active
  ============================================================ */
  console.error("Tabs setup failed. Check your HTML classes and IDs.");
}
