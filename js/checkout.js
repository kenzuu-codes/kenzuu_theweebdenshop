// Checkout page specific JavaScript

function initCheckout() {
  let checkoutItems = document.getElementById('checkoutItems')
  let subtotalEl = document.getElementById('checkoutSubtotal')
  let taxEl = document.getElementById('checkoutTax')
  let totalEl = document.getElementById('checkoutTotal')

  if (cart.length === 0) {
    window.location.href = 'cart.html'
    return
  }

  let html = ''
  let subtotal = 0

  for (let i = 0; i < cart.length; i++) {
    let item = cart[i]
    let itemTotal = item.price * item.quantity
    subtotal += itemTotal

    html +=
      '<div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">' +
      '<div class="d-flex align-items-center">' +
      '<img src="../' +
      item.image +
      '" alt="' +
      item.name +
      '" class="rounded me-3" style="width: 60px; height: 80px; object-fit: cover;">' +
      '<div>' +
      '<h6 class="mb-0">' +
      item.name +
      '</h6>' +
      '<small class="text-muted">Qty: ' +
      item.quantity +
      ' × ' +
      formatPrice(item.price) +
      '</small>' +
      '</div></div>' +
      '<strong>' +
      formatPrice(itemTotal) +
      '</strong>' +
      '</div>'
  }

  if (checkoutItems) {
    checkoutItems.innerHTML = html
  }

  let tax = subtotal * 0.08
  let total = subtotal + tax

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal)
  if (taxEl) taxEl.textContent = formatPrice(tax)
  if (totalEl) totalEl.textContent = formatPrice(total)
}

function handleCheckout(event) {
  event.preventDefault()

  let form = event.target
  if (!form.checkValidity()) {
    form.classList.add('was-validated')
    return
  }

  showNotification(
    'Order placed successfully! Thank you for your purchase.',
    'success'
  )
  cart = []
  saveCart()

  setTimeout(() => {
    window.location.href = '../index.html'
  }, 1500)
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  initCheckout()

  let checkoutForm = document.getElementById('checkoutForm')
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckout)
  }
})
