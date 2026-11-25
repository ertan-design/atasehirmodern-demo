for (const el of document.querySelectorAll("[data-hh1]")) el.addEventListener("click", function (event) {
focusTower(0,this)
});
for (const el of document.querySelectorAll("[data-hh2]")) el.addEventListener("click", function (event) {
focusTower(-1,this)
});
for (const el of document.querySelectorAll("[data-hh3]")) el.addEventListener("click", function (event) {
focusTower(0.5,this)
});
for (const el of document.querySelectorAll("[data-hh4]")) el.addEventListener("click", function (event) {
focusTower(1.2,this)
});
