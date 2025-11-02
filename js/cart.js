// ===== CART.JS =====
// Cart page functions for managing shopping cart

function renderCartItems() {
  let cartContainer = document.getElementById('cartItems')
  let cartEmpty = document.getElementById('cartEmpty')
  let cartContent = document.getElementById('cartContent')
  let subtotalEl = document.getElementById('subtotal')
  let taxEl = document.getElementById('tax')
  let totalEl = document.getElementById('total')

  // Show loading state
  if (cartContainer) {
    cartContainer.innerHTML =
      '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>'
  }

  if (cart.length === 0) {
    if (cartEmpty) cartEmpty.classList.remove('d-none')
    if (cartContent) cartContent.classList.add('d-none')
    return
  }
  if (cartEmpty) cartEmpty.classList.add('d-none')
  if (cartContent) cartContent.classList.remove('d-none')

  let html = ''
  let subtotal = 0

  for (let i = 0; i < cart.length; i++) {
    let item = cart[i]
    let itemTotal = item.price * item.quantity
    subtotal += itemTotal

    html +=
      '<div class="cart-item mb-3 bg-white rounded-3 shadow-sm overflow-hidden border border-light">' +
      '<div class="row g-0 align-items-center">' +
      '<div class="col-lg-2 col-md-3 col-4">' +
      '<div class="position-relative" style="padding-top: 130%;">' +
      '<img src="../' +
      item.image +
      '" class="position-absolute top-0 start-0 w-100 h-100" style="object-fit: cover;" alt="' +
      item.name +
      '" loading="lazy">' +
      '</div>' +
      '</div>' +
      '<div class="col-lg-10 col-md-9 col-8">' +
      '<div class="p-3 p-md-4">' +
      '<div class="row g-3 align-items-center">' +
      '<div class="col-lg-4 col-md-12">' +
      '<h5 class="mb-2 fw-bold text-truncate">' +
      item.name +
      '</h5>' +
      '<div class="d-flex align-items-center gap-3 flex-wrap">' +
      '<span class="badge bg-primary-subtle text-primary border border-primary">' +
      formatPrice(item.price) +
      ' each</span>' +
      '<small class="text-muted"><i class="fas fa-box me-1"></i>Stock: ' +
      item.stock +
      '</small>' +
      '</div>' +
      '</div>' +
      '<div class="col-lg-3 col-md-5 col-12">' +
      '<label class="form-label small text-muted mb-2">Quantity</label>' +
      '<div class="input-group">' +
      '<button class="btn btn-outline-primary" onclick="updateQuantity(\'' +
      item.id +
      '\', -1)" type="button"><i class="fas fa-minus"></i></button>' +
      '<input type="text" class="form-control text-center fw-bold" value="' +
      item.quantity +
      '" readonly style="max-width: 60px;">' +
      '<button class="btn btn-outline-primary" onclick="updateQuantity(\'' +
      item.id +
      '\', 1)" type="button"><i class="fas fa-plus"></i></button>' +
      '</div>' +
      '</div>' +
      '<div class="col-lg-3 col-md-4 col-7">' +
      '<label class="form-label small text-muted mb-2">Subtotal</label>' +
      '<h4 class="mb-0 text-primary fw-bold">' +
      formatPrice(itemTotal) +
      '</h4>' +
      '</div>' +
      '<div class="col-lg-2 col-md-3 col-5 text-end">' +
      '<button class="btn btn-outline-danger" onclick="removeFromCart(\'' +
      item.id +
      '\')" title="Remove item">' +
      '<i class="fas fa-trash-alt me-1"></i><span class="d-none d-md-inline">Remove</span>' +
      '</button>' +
      '</div>' +
      '</div></div></div></div></div>'
  }

  if (cartContainer) {
    cartContainer.innerHTML = html
  }

  let tax = subtotal * 0.08
  let total = subtotal + tax

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal)
  if (taxEl) taxEl.textContent = formatPrice(tax)
  if (totalEl) totalEl.textContent = formatPrice(total)
}

function updateQuantity(productId, change) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      let newQty = cart[i].quantity + change
      if (newQty <= 0) {
        removeFromCart(productId)
        return
      }
      if (newQty > cart[i].stock) {
        alert('Cannot exceed available stock!')
        return
      }
      cart[i].quantity = newQty
      break
    }
  }
  saveCart()
  renderCartItems()
}

function removeFromCart(productId) {
  let newCart = []
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id !== productId) {
      newCart.push(cart[i])
    }
  }
  cart = newCart
  saveCart()
  renderCartItems()
}

function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = []
    saveCart()
    renderCartItems()
    showNotification('Cart cleared successfully!', 'success')
  }
}

// Make functions globally available
window.updateQuantity = updateQuantity
window.removeFromCart = removeFromCart
window.clearCart = clearCart

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  renderCartItems()
})
