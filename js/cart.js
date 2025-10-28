// Cart page specific JavaScript

function renderCartItems() {
  console.log('=== RENDER CART ITEMS ===')
  console.log('Current cart:', cart)

  let cartContainer = document.getElementById('cartItems')
  let cartEmpty = document.getElementById('cartEmpty')
  let cartContent = document.getElementById('cartContent')
  let subtotalEl = document.getElementById('subtotal')
  let taxEl = document.getElementById('tax')
  let totalEl = document.getElementById('total')

  console.log('Cart container found:', !!cartContainer)
  console.log('Cart empty div found:', !!cartEmpty)
  console.log('Cart content div found:', !!cartContent)

  if (cart.length === 0) {
    console.log('Cart is empty, showing empty message')
    if (cartEmpty) cartEmpty.classList.remove('d-none')
    if (cartContent) cartContent.classList.add('d-none')
    return
  }

  console.log('Cart has items, rendering...')
  if (cartEmpty) cartEmpty.classList.add('d-none')
  if (cartContent) cartContent.classList.remove('d-none')

  let html = ''
  let subtotal = 0

  for (let i = 0; i < cart.length; i++) {
    let item = cart[i]
    let itemTotal = item.price * item.quantity
    subtotal += itemTotal

    html +=
      '<div class="cart-item p-3 mb-3 bg-white rounded shadow-sm">' +
      '<div class="row g-3 align-items-center">' +
      '<div class="col-md-2 col-3">' +
      '<img src="../' +
      item.image +
      '" class="img-fluid rounded" alt="' +
      item.name +
      '">' +
      '</div>' +
      '<div class="col-md-4 col-9">' +
      '<h6 class="mb-1">' +
      item.name +
      '</h6>' +
      '<small class="text-muted">Price: ' +
      formatPrice(item.price) +
      '</small>' +
      '</div>' +
      '<div class="col-md-3 col-6">' +
      '<div class="input-group input-group-sm">' +
      '<button class="btn btn-outline-secondary" onclick="updateQuantity(\'' +
      item.id +
      '\', -1)">-</button>' +
      '<input type="text" class="form-control text-center" value="' +
      item.quantity +
      '" readonly>' +
      '<button class="btn btn-outline-secondary" onclick="updateQuantity(\'' +
      item.id +
      '\', 1)">+</button>' +
      '</div>' +
      '<small class="text-muted d-block mt-1">Stock: ' +
      item.stock +
      '</small>' +
      '</div>' +
      '<div class="col-md-2 col-4">' +
      '<strong>' +
      formatPrice(itemTotal) +
      '</strong>' +
      '</div>' +
      '<div class="col-md-1 col-2">' +
      '<button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(\'' +
      item.id +
      '\')"><i class="fas fa-trash"></i></button>' +
      '</div>' +
      '</div></div>'
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
