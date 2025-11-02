// ===== CONTACT.JS =====
// Contact page form submission handler

function handleContactForm(event) {
  event.preventDefault()

  let form = event.target
  if (!form.checkValidity()) {
    form.classList.add('was-validated')
    return
  }

  let name = document.getElementById('name').value
  let email = document.getElementById('email').value
  let subject = document.getElementById('subject').value
  let message = document.getElementById('message').value

  // In production, this would send data to a server
  showNotification(
    'Thank you for your message! We will get back to you soon.',
    'success'
  )
  form.reset()
  form.classList.remove('was-validated')
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  let contactForm = document.getElementById('contactForm')
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm)
  }
})
