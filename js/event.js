const navContainer = document.getElementById('event__navContainer');
const navs = navContainer.getElementsByClassName('event__li');
const eventContainer = document.getElementsByClassName('event');
const eventTexts = document.getElementsByClassName('event__text');

// Set default (current) members active
updateEvents('events');

// Add event listenter to navs
let currentNav = null;
for (let i = 0; i < navs.length; i++) {
   if (navs[i].classList.contains('active')) {
      currentNav = navs[i];
   }
}

for (let i = 0; i < navs.length; i++) {
   navs[i].addEventListener('click', (e) => {
      if (e.target.id !== currentNav.id) {
         currentNav.classList.remove('active');
         e.target.classList.add('active');
         currentNav = e.target;
         updateEvents(currentNav.id);
      }
   });
}

function updateEvents(id) {
   for (let i = 0; i < eventTexts.length; i++) {
      let eventText = eventTexts[i];
      if (eventText.dataset.id === id) {
         eventText.classList.add('active');
      } else {
         eventText.classList.remove('active');
      }
   }
}