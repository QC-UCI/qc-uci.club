const navContainer = document.getElementById('team__navContainer');
const navs = navContainer.getElementsByClassName('team__li');
const teamMessages = [...document.getElementsByClassName('team__message')];
const teamContainer = document.getElementsByClassName('team');
const teamMembers = [...document.getElementsByClassName('team__member')];

// Set default (current) members active
updateMembers('current');
updateMessage('current');

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
         updateMessage(currentNav.id);
         updateMembers(currentNav.id);
      }
   });
}

function updateMessage(id) {
   teamMessages.forEach((teamMessage) => {
      if (teamMessage.dataset.id === id) teamMessage.classList.add('active');
      else teamMessage.classList.remove('active');
   });
}

function updateMembers(id) {
   teamMembers.forEach((teamMember) => {
      if (teamMember.dataset.id.indexOf(id) !== -1) teamMember.classList.add('active');
      else teamMember.classList.remove('active');
   });
}

// Removing president tag from founding section
var a =document.getElementById("founding")
a.addEventListener('click',function(){
   var b = document.getElementsByClassName("team__president"); 
   b[b.length-1].innerHTML="";
   var d= document.getElementById("prev")
   d.addEventListener("click",function(){
      var e = document.getElementsByClassName("team__president");
      e[e.length-1].innerHTML="<h4>[ President ]</h4>";
   })
})


