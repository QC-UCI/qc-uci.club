const navContainer = document.getElementById('event__navContainer');
const navs = navContainer.getElementsByClassName('event__li');
const eventContainer = document.getElementsByClassName('event');
const eventTexts = document.getElementsByClassName('event__text');
const eventInfos = document.getElementsByClassName('event__info');

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


// Grey out the past events
var today = new Date();
today.setHours(0,0,0,0);
for (let i = 0; i < eventInfos.length; i++) {
  var datexx = eventInfos[i].querySelectorAll('[id^=edate]')[0].innerText.split('\/').map(x=>+x);
  var datex = new Date(datexx[2],datexx[0]-1,datexx[1]);
  if (today > datex) {
    eventInfos[i].style.color = "#d3d3d3";
  }
}
