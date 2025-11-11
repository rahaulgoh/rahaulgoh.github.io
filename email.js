const SERVICE_ID = "service_raqorzo";
const TEMPLATE_ID = "template_4fy6le8";
const PUBLIC_KEY = "sBws5lKX6wC6BBXuJ";

// Show notification banner instead of alert()
function showNotification(message, isError = false) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = isError ? "show error" : "show";
  setTimeout(() => {
    notification.className = "hidden";
  }, 4000); // stays visible for 4 seconds
}

document.addEventListener("DOMContentLoaded", () => {
  emailjs.init(PUBLIC_KEY);

  const form = document.getElementById("contact-form");
  const submitBtn = form.querySelector('button[type="submit"]');
  const label = submitBtn.querySelector(".btn-label");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (form.hp_field?.value) return; // honeypot anti-spam

    submitBtn.disabled = true;
    submitBtn.classList.add("is-sending");
    const originalText = label.textContent;
    label.textContent = "Sending…";

    try {
      // fake delay for demo purposes without wasting my quota
      // await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
      // uncomment below when ready to deploy.
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);
      form.reset();

      // success state
      submitBtn.classList.remove("is-sending");
      submitBtn.classList.add("is-success");
      label.textContent = "Sent!";
      showNotification("Message sent! I’ll get back to you soon.");
      
      // revert
      setTimeout(() => {
        submitBtn.classList.remove("is-success");
        label.textContent = originalText;
        submitBtn.disabled = false;
      }, 1400);
    
    } catch (err) {
      console.error(err);
      submitBtn.classList.remove("is-sending");
      submitBtn.classList.add("is-error");
      label.textContent = originalText;
      submitBtn.disabled = false;
      showNotification("Could not send. Please try again later.", true);
      
      // clear shake state
      setTimeout(() => submitBtn.classList.remove("is-error"), 350);
    } 
  });
});
