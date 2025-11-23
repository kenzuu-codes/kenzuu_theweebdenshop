// ===== COMMON.JS =====
// Shared functions for cart, products, and notifications

// ===== CART MANAGEMENT =====
let cart = []

// Load cart from localStorage on page load
function loadCart() {
  try {
    let saved = localStorage.getItem('cart')
    if (saved) {
      let parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        cart = parsed
      } else {
        cart = []
        localStorage.removeItem('cart')
      }
    }
  } catch (e) {
    cart = []
    localStorage.removeItem('cart')
  }
  updateCartBadge()
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart))
  updateCartBadge()
}

// ===== NOTIFICATIONS =====
// Display success, error, or info messages to user
function showNotification(message, type = 'success') {
  let existing = document.querySelector('.custom-notification')
  if (existing) {
    existing.remove()
  }

  let notification = document.createElement('div')
  notification.className = 'custom-notification'

  let icon =
    type === 'success'
      ? 'fa-check-circle'
      : type === 'error'
      ? 'fa-exclamation-circle'
      : 'fa-info-circle'

  let bgGradient =
    type === 'success'
      ? 'linear-gradient(135deg, #10b981, #059669)'
      : type === 'error'
      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
      : 'linear-gradient(135deg, #f59e0b, #d97706)'

  // Apply responsive positioning based on viewport width
  const width = window.innerWidth
  let topPos = '90px'
  let rightPos = '20px'
  let minWidth = '300px'

  if (width <= 390) {
    rightPos = '5px'
    minWidth = '280px'
  } else if (width <= 520) {
    rightPos = '10px'
    topPos = '80px'
    minWidth = '290px'
  }

  notification.style.cssText = `
    position: fixed;
    top: ${topPos};
    right: ${rightPos};
    z-index: 9999;
  `

  notification.innerHTML = `
    <div style="
      background: ${bgGradient};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1rem;
      font-weight: 500;
      min-width: ${minWidth};
      max-width: calc(100vw - ${rightPos} - ${rightPos});
      animation: notificationSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    ">
      <i class="fas ${icon}" style="
        font-size: 1.5rem;
        animation: notificationIconPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
        flex-shrink: 0;
      "></i>
      <span style="word-break: break-word;">${message}</span>
    </div>
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation =
      'notificationSlideOut 0.4s cubic-bezier(0.6, -0.28, 0.74, 0.05) forwards'
    setTimeout(() => notification.remove(), 400)
  }, 3000)
}

// Update the cart badge count in navigation
function updateCartBadge() {
  let badge = document.getElementById('cart-badge')
  if (badge) {
    let totalItems = 0
    for (let i = 0; i < cart.length; i++) {
      totalItems += cart[i].quantity
    }
    badge.textContent = totalItems
  }
}

// ===== ADD TO CART =====
// Adds a product to cart or increases quantity if already exists
function addToCart(productId) {
  fetchProducts(function (products) {
    let product = null
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === productId) {
        product = products[i]
        break
      }
    }

    if (!product) {
      showNotification('Product not found!', 'error')
      return
    }

    if (product.stock === 0) {
      showNotification('Sorry, this product is out of stock', 'error')
      return
    }

    let existingItem = null
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === productId) {
        existingItem = cart[i]
        break
      }
    }

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        showNotification('Cannot add more items. Stock limit reached!', 'error')
        return
      }
      existingItem.quantity++
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        stock: product.stock,
      })
    }

    saveCart()
    showNotification(product.name + ' added to cart!', 'success')
  })
}

// Fetch products from JSON
function fetchProducts(callback) {
  let dataPath = location.pathname.includes('/pages/')
    ? '../data/products.json'
    : 'data/products.json'

  fetch(dataPath)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      callback(data)
    })
    .catch(function (error) {
      callback([])
    })
}

// ===== UTILITY FUNCTIONS =====

// Format price in Philippine Pesos
function formatPrice(price) {
  return (
    '₱' +
    price.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}

// Generate star rating HTML from number (0-5)
function generateStars(rating) {
  let stars = ''
  let fullStars = Math.floor(rating)
  let hasHalf = rating % 1 >= 0.5

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star text-warning"></i>'
  }

  if (hasHalf) {
    stars += '<i class="fas fa-star-half-alt text-warning"></i>'
    fullStars++
  }

  for (let i = fullStars; i < 5; i++) {
    stars += '<i class="far fa-star text-warning"></i>'
  }

  return stars
}

// ===== INITIALIZATION =====
// Load cart and set up event listeners
document.addEventListener('DOMContentLoaded', function () {
  loadCart()

  // Handle all "Add to Cart" button clicks
  document.addEventListener('click', function (e) {
    // Handle regular add buttons
    let addBtn = e.target.closest('.btn-add')
    if (addBtn && !addBtn.disabled) {
      let productId = addBtn.getAttribute('data-product-id')
      if (productId) {
        addToCart(productId)
      }
    }

    // Handle detail page add button
    let detailBtn = e.target.closest('.btn-add-detail')
    if (detailBtn && !detailBtn.disabled) {
      let productId = detailBtn.getAttribute('data-product-id')
      if (productId) {
        addToCart(productId)
      }
    }
  })

  // ===== SCROLL TO TOP BUTTON =====
  createScrollToTopButton()

  // ===== RESPONSIVE NOTIFICATION SCALING =====
  applyNotificationResponsiveSettings()
})

// ===== RESPONSIVE NOTIFICATION SETTINGS =====
// Adjusts notification position and scale based on viewport width
function applyNotificationResponsiveSettings() {
  const width = window.innerWidth

  // Apply responsive settings on resize
  window.addEventListener('resize', function () {
    const notification = document.querySelector('.custom-notification')
    if (!notification) return

    const currentWidth = window.innerWidth
    if (currentWidth <= 390) {
      // Extra small devices
      notification.style.transform = 'scale(0.75)'
      notification.style.right = '5px'
    } else if (currentWidth <= 520) {
      // Small devices
      notification.style.transform = 'scale(0.85)'
      notification.style.right = '10px'
    } else {
      // Normal size for larger screens
      notification.style.transform = ''
      notification.style.right = '20px'
    }
  })
}

// ===== SCROLL TO TOP FUNCTIONALITY =====
function createScrollToTopButton() {
  // Create button element
  let scrollBtn = document.createElement('button')
  scrollBtn.id = 'scrollToTop'
  scrollBtn.className = 'scroll-to-top-btn'
  scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'
  scrollBtn.setAttribute('aria-label', 'Scroll to top')
  scrollBtn.style.display = 'none'
  document.body.appendChild(scrollBtn)

  // Show/hide button based on scroll position
  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
      scrollBtn.style.display = 'flex'
    } else {
      scrollBtn.style.display = 'none'
    }
  })

  // Scroll to top when clicked
  scrollBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  })
}
