// Sign-up form: sends in the background and shows the answer on the page.
// Without JavaScript the form still posts normally and lands on thanks.html.
(function () {
  var form = document.getElementById("join-form");
  if (!form) return;

  var status = document.getElementById("join-status");
  var button = document.getElementById("join-submit");
  var email = document.getElementById("f-email");
  var emailError = document.getElementById("f-email-error");

  // Remember which link brought them (?src=hsc, ?src=fb, ...), so we can see what works.
  try {
    var src = new URLSearchParams(window.location.search).get("src");
    if (src) document.getElementById("f-src").value = src.slice(0, 40);
  } catch (e) { /* not essential */ }

  function show(message, isError) {
    status.hidden = false;
    status.textContent = message;
    status.className = "form-status " + (isError ? "bad" : "good");
    status.focus();
  }

  form.addEventListener("submit", function (event) {
    emailError.hidden = true;
    email.removeAttribute("aria-invalid");
    if (!email.checkValidity()) {
      event.preventDefault();
      emailError.textContent = "Please enter the email of the Google account on your phone, like name@gmail.com.";
      emailError.hidden = false;
      email.setAttribute("aria-invalid", "true");
      email.focus();
      return;
    }
    if (!window.fetch || !window.FormData) return; // fall back to a normal post

    event.preventDefault();
    button.disabled = true;
    var label = button.textContent;
    button.textContent = "Sending...";

    fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (response) { return response.json().then(function (data) { return { ok: response.ok, data: data }; }); })
      .then(function (result) {
        if (result.ok) {
          form.reset();
          form.hidden = true;
          show("You're on the list. We'll email you at the address you gave, usually within a day, with your Google Play install link. If it doesn't arrive, check spam or write to hello@solentcompanion.com.", false);
        } else {
          throw new Error(result.data && result.data.error ? result.data.error : "failed");
        }
      })
      .catch(function (err) {
        button.disabled = false;
        button.textContent = label;
        show("Sorry, that didn't send. Please try again, or email hello@solentcompanion.com with your Google account email and phone model.", true);
      });
  });

  // Sticky "Join" bar on phones: shown once the top of the page has gone, hidden over the form.
  var bar = document.getElementById("join-bar");
  var join = document.getElementById("join");
  var hero = document.querySelector(".hero");
  if (bar && join && hero && "IntersectionObserver" in window) {
    var heroGone = false, joinVisible = false;
    function update() { bar.hidden = !(heroGone && !joinVisible); }
    new IntersectionObserver(function (e) { heroGone = !e[0].isIntersecting; update(); }).observe(hero);
    new IntersectionObserver(function (e) { joinVisible = e[0].isIntersecting; update(); }).observe(join);
  }
})();
