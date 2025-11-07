document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.addEventListener('click', (e) => {
        // Solo reacciona si se hace clic en un botón de añadir
        if (e.target.classList.contains('add-to-cart-btn')) {
            const button = e.target;
            const card = button.closest('.product-card');
            
            // Saca los datos del producto de la tarjeta
            const productName = card.querySelector('h3').textContent;
            const productPrice = button.dataset.price;
            const productImage = card.querySelector('img').src;
            const productId = button.dataset.id;

            const productToAdd = {
                id: `${productId}-${Date.now()}`, // ID único para poder borrarlo
                name: productName,
                price: parseFloat(productPrice),
                image: productImage
            };

            // Carga el carrito actual de localStorage
            const storedCart = localStorage.getItem('makiluShoppingCart');
            let cart = storedCart ? JSON.parse(storedCart) : [];

            // Añade el nuevo producto y guarda
            cart.push(productToAdd);
            localStorage.setItem('makiluShoppingCart', JSON.stringify(cart));

            // Llama a la función renderCart() (que está en carrito.js)
            // para actualizar el icono y el modal
            if (typeof window.renderCart === 'function') {
                window.renderCart(); 
            }
            
            // Da feedback al usuario
            button.textContent = '¡Añadido!';
            button.style.backgroundColor = '#66bb6a'; // Un verde más claro
            setTimeout(() => {
                button.textContent = 'Añadir al Carrito';
                button.style.backgroundColor = '#4CAF50'; // Vuelve al verde original
            }, 1500);
        }
    });
});