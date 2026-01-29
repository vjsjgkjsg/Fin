// app.js
// Точка входа приложения

document.addEventListener("DOMContentLoaded", () => {
    console.log("App started");

    if (typeof auth !== "undefined") auth.init();
    if (typeof ui !== "undefined") ui.init();
});
