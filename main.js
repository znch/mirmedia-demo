/**
 * Změna padding v navbaru při scrollování
 */
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbar").style.padding = "0.5rem";
    
  } else {
    document.getElementById("navbar").style.padding = "1.7rem";
    }
}