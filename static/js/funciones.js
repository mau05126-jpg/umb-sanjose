// static/js/funciones.js

// Buscador que busca en todo el contenido de la página
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');

    // Función para realizar búsqueda en todo el contenido
    function performSearch(query) {
        if (!query.trim()) {
            searchResults.style.display = 'none';
            return;
        }

        // Limpiar resultados anteriores
        searchResults.innerHTML = '';
        
        // Buscar en todo el contenido del main
        const mainContent = document.querySelector('main');
        const elements = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, a, span, strong, em');
        
        let resultsFound = false;
        
        elements.forEach(element => {
            const text = element.textContent || element.innerText;
            if (text.toLowerCase().includes(query.toLowerCase())) {
                resultsFound = true;
                
                // Crear elemento de resultado
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                
                // Obtener texto del elemento padre para contexto
                let context = text.substring(0, 100);
                if (text.length > 100) {
                    context += '...';
                }
                
                // Resaltar el término de búsqueda
                const highlightedContext = highlightText(context, query);
                
                resultItem.innerHTML = `
                    <strong>${element.tagName}: ${highlightedContext}</strong>
                `;
                
                resultItem.addEventListener('click', () => {
                    // Desplazarse al elemento
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Resaltar el elemento encontrado
                    highlightElement(element);
                    
                    // Ocultar resultados
                    searchResults.style.display = 'none';
                    searchInput.value = '';
                });
                
                searchResults.appendChild(resultItem);
            }
        });
        
        if (!resultsFound) {
            searchResults.innerHTML = '<div class="search-result-item">No se encontraron resultados</div>';
        }
        
        searchResults.style.display = 'block';
    }

    // Función para resaltar texto en los resultados
    function highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // Función para resaltar elemento encontrado
    function highlightElement(element) {
        // Quitar resaltado anterior
        if (previousHighlight) {
            previousHighlight.classList.remove('search-highlight');
        }
        
        // Aplicar resaltado
        element.classList.add('search-highlight');
        
        // Quitar resaltado después de 3 segundos
        setTimeout(() => {
            element.classList.remove('search-highlight');
        }, 3000);
    }

    // Event listeners para el buscador
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    searchInput.addEventListener('input', () => {
        performSearch(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });

    // Ocultar resultados al hacer clic fuera
    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && !searchContainer.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cambiar clase activa en la navegación
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Efecto de scroll para la barra de navegación
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        }
    });


});

        // Control del Modal
        document.addEventListener('DOMContentLoaded', function() {
            const modal = document.getElementById('contact-modal');
            const openModalBtn = document.getElementById('open-contact-modal');
            const closeModalBtn = document.getElementById('close-modal');
            const submitBtn = document.getElementById('submit-btn');
            
            // Abrir modal
            openModalBtn.addEventListener('click', function(e) {
                e.preventDefault();
                modal.style.display = 'block';
            });
            
            // Cerrar modal
            closeModalBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            // Cerrar modal al hacer clic fuera
            window.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
            
            // Envío del formulario
            const contactForm = document.getElementById('contactForm');
            const formMessage = document.getElementById('formMessage');
            
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Deshabilitar botón para evitar múltiples envíos
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
                
                // Mostrar mensaje de carga
                formMessage.textContent = 'Enviando mensaje...';
                formMessage.className = 'form-message';
                formMessage.style.display = 'block';
                
                // Recolectar datos del formulario
                const formData = new FormData(contactForm);
                const data = {
                    nombre: formData.get('nombre'),
                    email: formData.get('email'),
                    telefono: formData.get('telefono'),
                    carrera: formData.get('carrera'),
                    mensaje: formData.get('mensaje'),
                    timestamp: new Date().toISOString()
                };
                
                console.log('Datos a enviar:', data);
                
                // URL de tu Web App de Google Apps Script
                const scriptURL = 'https://script.google.com/macros/s/AKfycbw67Hq30L5lHAHwIp871EZ0nLf0TRKB1bF76-U_tDrAC2ZalAo7p6xRxFv6yRuaXSCR/exec';
                
                // Enviar datos a Google Apps Script
                fetch(scriptURL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    console.log('Respuesta recibida:', response);
                    // Con no-cors, no podemos leer la respuesta, pero podemos ver si llegó
                    formMessage.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
                    formMessage.className = 'form-message success';
                    contactForm.reset();
                    
                    // Restaurar botón
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar Mensaje';
                    
                    // Ocultar mensaje después de 5 segundos y cerrar modal
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                        modal.style.display = 'none';
                    }, 5000);
                })
                .catch(error => {
                    console.error('Error completo:', error);
                    formMessage.textContent = 'Error al enviar el mensaje. Por favor, intenta nuevamente.';
                    formMessage.className = 'form-message error';
                    
                    // Restaurar botón
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar Mensaje';
                    
                    // Ocultar mensaje después de 5 segundos
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 5000);
                });
            });
        });


// Añadir estilos para el resaltado de búsqueda
const highlightStyles = `
    .search-highlight {
        background-color: yellow !important;
        transition: background-color 0.5s ease;
        padding: 2px;
        border-radius: 2px;
    }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = highlightStyles;
document.head.appendChild(styleSheet);