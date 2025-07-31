document.addEventListener('DOMContentLoaded', function() {
    // Código existente para el scroll suave de la navbar
    document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- NUEVO CÓDIGO PARA EL FORMULARIO DE CONTACTO ---
    const contactForm = document.getElementById('contactForm');
    const formMessages = document.getElementById('formMessages');

    if (contactForm && formMessages) { // Asegurarse de que los elementos existen
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Evita el envío tradicional del formulario (y la redirección)

            const form = event.target;
            const formData = new FormData(form); // Recopila todos los datos del formulario

            // Opcional: Mostrar un mensaje de carga
            formMessages.innerHTML = '<div class="alert alert-info" role="alert">Enviando...</div>';
            formMessages.style.display = 'block';
            form.querySelector('button[type="submit"]').disabled = true; // Deshabilitar botón para evitar múltiples envíos

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData, // FormData automáticamente establece el Content-Type correcto
                    headers: {
                        'Accept': 'application/json' // Formspree recomienda esto para envíos AJAX
                    }
                });

                if (response.ok) {
                    // Si el envío fue exitoso
                    formMessages.innerHTML = '<div class="alert alert-success" role="alert">¡Datos enviados correctamente! Nos pondremos en contacto contigo a la brevedad.</div>';
                    form.reset(); // Limpia los campos del formulario
                    form.style.display = 'none'; // Oculta el formulario
                    
                    // Opcional: Mostrar el formulario de nuevo después de un tiempo
                    setTimeout(() => {
                        form.style.display = 'block'; // Mostrar el formulario
                        formMessages.style.display = 'none'; // Ocultar el mensaje
                        formMessages.innerHTML = ''; // Limpiar el mensaje
                    }, 8000); // Se mostrará el formulario de nuevo después de 8 segundos
                } else {
                    // Si hubo un error en la respuesta de Formspree
                    const data = await response.json(); // Intentar leer el mensaje de error de Formspree
                    let errorMessage = 'Hubo un error al enviar tu consulta. Por favor, inténtalo de nuevo más tarde.';
                    if (data && data.errors) {
                        errorMessage += '<br>' + data.errors.map(err => err.message).join('<br>');
                    }
                    formMessages.innerHTML = `<div class="alert alert-danger" role="alert">${errorMessage}</div>`;
                }
            } catch (error) {
                // Si hubo un error de red o similar
                formMessages.innerHTML = '<div class="alert alert-danger" role="alert">Error de conexión. Por favor, verifica tu internet e inténtalo de nuevo.</div>';
                console.error('Error al enviar el formulario:', error);
            } finally {
                form.querySelector('button[type="submit"]').disabled = false; // Habilitar el botón nuevamente
            }
        });
    }
});