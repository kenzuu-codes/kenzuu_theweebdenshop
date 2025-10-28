// Home page specific JavaScript

function renderProductCard(product) {
  let imagePath = product.image

  let stockBadge = ''
  if (product.stock < 10 && product.stock > 0) {
    stockBadge =
      '<span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2">Low Stock</span>'
  } else if (product.stock === 0) {
    stockBadge =
      '<span class="badge bg-danger position-absolute top-0 end-0 m-2">Out of Stock</span>'
  }

  let addButton = ''
  if (
    product.stock === 0 ||
    product.stock === null ||
    product.stock === undefined
  ) {
    addButton =
      '<button class="btn btn-sm btn-add" disabled><i class="fas fa-ban me-1"></i>Out of Stock</button>'
  } else {
    addButton =
      '<button class="btn btn-sm btn-add" data-product-id="' +
      product.id +
      '"><i class="fas fa-cart-plus me-1"></i>Add</button>'
  }

  return (
    '<div class="col-sm-6 col-md-4 col-lg-3 mb-4">' +
    '<div class="card product-card h-100 shadow-sm">' +
    '<div class="position-relative overflow-hidden">' +
    stockBadge +
    '<img src="' +
    imagePath +
    '" class="card-img-top" alt="' +
    product.name +
    '" loading="lazy">' +
    '</div>' +
    '<div class="card-body d-flex flex-column">' +
    '<h5 class="card-title">' +
    product.name +
    '</h5>' +
    '<p class="author-info mb-2"><i class="fas fa-user-edit me-1"></i>' +
    product.author +
    '</p>' +
    '<div class="rating mb-2">' +
    generateStars(product.rating) +
    '<small class="text-muted ms-1">(' +
    (product.rating || 0) +
    ')</small></div>' +
    '<div class="price-section mb-2"><span class="price">' +
    formatPrice(product.price) +
    '</span><span class="genre-badge">' +
    product.genre +
    '</span></div>' +
    '<p class="card-text text-muted small mb-3">' +
    product.short +
    '</p>' +
    '<div class="btn-group mt-auto">' +
    '<a href="pages/product.html?id=' +
    product.id +
    '" class="btn btn-sm btn-details"><i class="fas fa-info-circle me-1"></i>Details</a>' +
    addButton +
    '</div></div></div></div>'
  )
}

function renderProducts(container, products) {
  if (!container) return

  if (products.length === 0) {
    container.innerHTML =
      '<div class="col-12"><div class="alert alert-info text-center"><i class="fas fa-info-circle me-2"></i>No products found</div></div>'
    return
  }

  let html = ''
  for (let i = 0; i < products.length; i++) {
    html += renderProductCard(products[i])
  }
  container.innerHTML = html
}

function initHome() {
  let container = document.getElementById('featuredProducts')
  if (!container) return

  container.innerHTML =
    '<div class="col-12"><div class="text-center py-5"><div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;"><span class="visually-hidden">Loading...</span></div><p class="text-muted">Loading featured collection...</p></div></div>'

  fetchProducts(function (products) {
    let featured = products.slice(0, 8)
    renderProducts(container, featured)
  })
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  initHome()
})
