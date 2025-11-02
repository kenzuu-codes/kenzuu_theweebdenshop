// Product detail page specific JavaScript

function initProductDetail() {
  let urlParams = new URLSearchParams(window.location.search)
  let productId = urlParams.get('id')

  if (!productId) {
    window.location.href = 'products.html'
    return
  }

  let container = document.getElementById('productDetail')
  if (!container) return

  container.innerHTML =
    '<div class="text-center py-5"><div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;"><span class="visually-hidden">Loading...</span></div><p class="text-muted">Loading product details...</p></div>'

  fetchProducts(function (products) {
    let product = null
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === productId) {
        product = products[i]
        break
      }
    }

    if (!product) {
      container.innerHTML =
        '<div class="alert alert-danger"><i class="fas fa-exclamation-triangle me-2"></i>Product not found</div>'
      return
    }

    let imagePath = '../' + product.image
    let stockBadge =
      product.stock > 10
        ? 'bg-success'
        : product.stock === 0
        ? 'bg-danger'
        : 'bg-warning'
    let stockText =
      product.stock === 0 ? 'Out of Stock' : product.stock + ' in stock'

    let addToCartButton = ''
    if (product.stock === 0) {
      addToCartButton =
        '<button class="btn btn-primary flex-grow-1" disabled><i class="fas fa-ban me-2"></i>Out of Stock</button>'
    } else {
      addToCartButton =
        '<button class="btn btn-primary flex-grow-1 btn-add-detail" data-product-id="' +
        product.id +
        '"><i class="fas fa-cart-plus me-2"></i>Add to Cart</button>'
    }

    container.innerHTML =
      '<div class="row g-4">' +
      '<div class="col-lg-5"><div class="product-detail-image"><img src="' +
      imagePath +
      '" class="img-fluid rounded shadow" alt="' +
      product.name +
      '" loading="lazy"></div></div>' +
      '<div class="col-lg-7"><div class="product-detail-info">' +
      '<div class="mb-3"><h1 class="product-detail-title mb-2">' +
      product.name +
      '</h1>' +
      '<p class="product-detail-author mb-3"><i class="fas fa-pen-fancy me-2"></i>by <strong>' +
      product.author +
      '</strong></p></div>' +
      '<div class="product-rating mb-4"><span class="rating-stars">' +
      generateStars(product.rating) +
      '</span><span class="rating-text ms-2">' +
      product.rating +
      ' out of 5</span></div>' +
      '<div class="product-price-section mb-4"><div class="d-flex align-items-center justify-content-between flex-wrap">' +
      '<div><h2 class="product-price mb-0">' +
      formatPrice(product.price) +
      '</h2><small class="text-muted">Free shipping on orders over ₱2,500</small></div>' +
      '<div><span class="badge ' +
      stockBadge +
      ' fs-6"><i class="fas fa-box me-1"></i>' +
      stockText +
      '</span></div></div></div>' +
      '<div class="product-description mb-4"><h5 class="mb-3"><i class="fas fa-info-circle me-2"></i>Description</h5><p class="text-muted">' +
      product.description +
      '</p></div>' +
      '<div class="product-meta-info mb-4"><h5 class="mb-3"><i class="fas fa-list-ul me-2"></i>Product Details</h5>' +
      '<div class="row g-3"><div class="col-md-6"><div class="detail-item"><i class="fas fa-tag text-primary me-2"></i><strong>Genre:</strong><span class="badge bg-primary ms-2">' +
      product.genre +
      '</span></div></div>' +
      '<div class="col-md-6"><div class="detail-item"><i class="fas fa-book text-primary me-2"></i><strong>Volumes:</strong><span class="ms-2">' +
      product.volumes +
      '</span></div></div></div></div>' +
      '<div class="product-actions d-flex gap-2 flex-wrap">' +
      addToCartButton +
      '<a href="cart.html" class="btn btn-outline-secondary"><i class="fas fa-shopping-cart me-2"></i>View Cart</a>' +
      '<a href="products.html" class="btn btn-outline-primary"><i class="fas fa-arrow-left me-2"></i>Back to Products</a>' +
      '</div></div></div></div>'

    // Show related products
    showRelatedProducts(product, products)
  })
}

// Show related products based on same genre
function showRelatedProducts(currentProduct, allProducts) {
  let relatedContainer = document.getElementById('relatedProducts')
  if (!relatedContainer) return

  // Filter products by same genre, exclude current product
  let related = []
  for (let i = 0; i < allProducts.length; i++) {
    if (
      allProducts[i].genre === currentProduct.genre &&
      allProducts[i].id !== currentProduct.id
    ) {
      related.push(allProducts[i])
    }
  }

  // Shuffle and take first 4
  for (let i = related.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = related[i]
    related[i] = related[j]
    related[j] = temp
  }
  related = related.slice(0, 4)

  if (related.length === 0) {
    relatedContainer.innerHTML = ''
    return
  }

  let html =
    '<div class="related-products-section mt-5 pt-4 border-top">' +
    '<h3 class="mb-4"><i class="fas fa-book-open me-2"></i>Related Products</h3>' +
    '<div class="row g-4">'

  for (let i = 0; i < related.length; i++) {
    let product = related[i]
    let imagePath = '../' + product.image
    html +=
      '<div class="col-sm-6 col-lg-3">' +
      '<div class="card product-card h-100 shadow-sm">' +
      '<div class="position-relative overflow-hidden">' +
      '<img src="' +
      imagePath +
      '" class="card-img-top" alt="' +
      product.name +
      '" loading="lazy">' +
      '</div>' +
      '<div class="card-body d-flex flex-column">' +
      '<h5 class="card-title text-truncate">' +
      product.name +
      '</h5>' +
      '<p class="author-info mb-2 small"><i class="fas fa-user-edit me-1"></i>' +
      product.author +
      '</p>' +
      '<div class="rating mb-2">' +
      generateStars(product.rating) +
      '</div>' +
      '<div class="price-section mb-3"><span class="price">' +
      formatPrice(product.price) +
      '</span></div>' +
      '<a href="product.html?id=' +
      product.id +
      '" class="btn btn-sm btn-primary mt-auto">View Details</a>' +
      '</div></div></div>'
  }

  html += '</div></div>'
  relatedContainer.innerHTML = html
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  initProductDetail()
})
