document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM DE LA PÁGINA CHECKOUT ---
    const orderSummaryItems = document.getElementById('order-summary-items');
    const summaryTotalPriceElement = document.getElementById('summary-total-price');
    const checkoutForm = document.getElementById('checkout-form');
    
    // --- CONFIGURACIÓN ---
    // !!! RECUERDA PONER TU NÚMERO DE WHATSAPP AQUÍ !!!
    const tuNumeroDeWhatsApp = '573228497230'; // Ej: 573001234567

    // --- ESTADO ---
    let cart = [];
    let totalPrice = 0;

    // --- FUNCIONES ---

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    // Carga el carrito desde el almacenamiento local
    const loadCart = () => {
        const storedCart = localStorage.getItem('makiluShoppingCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            renderSummary();
        } else {
            // Si no hay carrito, no deberíamos estar aquí.
            document.querySelector('.checkout-layout').innerHTML = '<h2>Error: No se encontró tu carrito. Por favor, vuelve a la tienda y añade productos.</h2>';
        }
    };

    // Muestra el resumen del pedido en la página
    const renderSummary = () => {
        if (!orderSummaryItems) return; // Salir si no estamos en la página de checkout
        
        orderSummaryItems.innerHTML = '';
        totalPrice = 0;
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('summary-item');
            itemElement.innerHTML = `<span>${item.name}</span> <strong>${formatCurrency(item.price)}</strong>`;
            orderSummaryItems.appendChild(itemElement);
            totalPrice += parseFloat(item.price);
        });

        summaryTotalPriceElement.textContent = formatCurrency(totalPrice);
    };

    // Maneja el envío del formulario para crear el mensaje de WhatsApp
    if(checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Obtener datos del formulario (CON APELLIDOS AÑADIDO)
            const name = document.getElementById('name').value;
            const lastname = document.getElementById('lastname').value; // CAMPO NUEVO
            const cedula = document.getElementById('cedula').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const phone = document.getElementById('phone').value;

            // Construir el mensaje de texto (ACTUALIZADO)
            let pedidoText = `¡Hola Huerta Escolar! 🌿 Quiero hacer este pedido:\n\n`;
            cart.forEach(item => {
                pedidoText += `▪️ ${item.name} - ${formatCurrency(item.price)}\n`;
            });
            pedidoText += `\n*Total del Pedido:* ${formatCurrency(totalPrice)}\n\n`;
            pedidoText += `*--- Mis Datos de Envío ---*\n`;
            pedidoText += `*Nombre:* ${name} ${lastname}\n`; // CAMPO ACTUALIZADO
            pedidoText += `*Cédula:* ${cedula}\n`;
            pedidoText += `*Dirección:* ${address}\n`;
            pedidoText += `*Ciudad:* ${city}\n`;
            pedidoText += `*Celular/Nequi:* ${phone}\n\n`;
            pedidoText += `¡Quedo atento/a a las instrucciones de pago por Nequi!`;

            // Crear la URL de WhatsApp y abrirla
            const whatsappUrl = `https://wa.me/${tuNumeroDeWhatsApp}?text=${encodeURIComponent(pedidoText)}`;
            window.open(whatsappUrl, '_blank');
            
            // Limpiar el carrito y redirigir
            localStorage.removeItem('makiluShoppingCart');
            alert("¡Tu pedido se está procesando en WhatsApp! Gracias por tu apoyo a la huerta.");
            
            // Actualiza el contador del carrito en la UI antes de redirigir
            if (typeof window.renderCart === 'function') {
                window.renderCart();
            }
            
            window.location.href = 'index.html';
        });
    }

    // --- INICIALIZACIÓN ---
    loadCart();
});