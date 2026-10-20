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

  function emailProblem(raw) {
    var v = raw.trim();
    if (!v) return "We need an email to add you to the test list.";
    if (!/^[^\s@]+@[^\s@]+$/.test(v)) return "That email doesn't look quite right. It should look like name@example.com.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "That email looks unfinished. Did you mean " + v + ".com?";
    return "";
  }

  function showEmailError(message) {
    emailError.textContent = message;
    emailError.hidden = false;
    email.setAttribute("aria-invalid", "true");
    email.focus();
  }

  form.addEventListener("submit", function (event) {
    emailError.hidden = true;
    email.removeAttribute("aria-invalid");
    var problem = emailProblem(email.value);
    if (problem) {
      event.preventDefault();
      showEmailError(problem);
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
          show("You're on the test list. We'll email you when the closed test opens on Google Play, with your install link. We don't have a date yet, so it could be days or weeks. Nothing to do until then. If you hear nothing, check spam or write to hello@solentcompanion.com.", false);
        } else {
          throw new Error(result.data && result.data.error ? result.data.error : "failed");
        }
      })
      .catch(function (err) {
        button.disabled = false;
        button.textContent = label;
        if (err && err.message === "email") {
          showEmailError("That email doesn't look quite right. It should look like name@example.com.");
          return;
        }
        if (navigator.onLine === false) {
          show("You look to be offline. Try again when you have signal.", true);
          return;
        }
        show("That didn't send. Your details are still here, so try again. If it keeps failing, email hello@solentcompanion.com with your Google account email and I'll add you by hand.", true);
      });
  });

  // Sticky "Join" bar on phones: shown from the start, hidden while the form or the footer is on screen.
  var bar = document.getElementById("join-bar");
  var join = document.getElementById("join");
  var footer = document.querySelector("footer");
  if (bar && join && "IntersectionObserver" in window) {
    var joinVisible = false, footerVisible = false;
    var update = function () { bar.hidden = joinVisible || footerVisible; };
    new IntersectionObserver(function (e) { joinVisible = e[0].isIntersecting; update(); }).observe(join);
    if (footer) new IntersectionObserver(function (e) { footerVisible = e[0].isIntersecting; update(); }).observe(footer);
    update();
  }
})();
