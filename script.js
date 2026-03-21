class FloresBachApp {
    constructor() {
        // 🔧 CAMBIA ESTA URL POR LA DE TU WEBHOOK DE N8N
        // Ejemplo: https://tu-dominio.com/webhook/flores-bach
        // Si tienes n8n en un puerto: http://tu-ip:5678/webhook/flores-bach
        this.apiUrl = 'https://tu-n8n-webhook.com/webhook/flores-bach';
        
        this.init();
    }

    init() {
        const generarBtn = document.getElementById('generar-btn');
        if (generarBtn) {
            generarBtn.addEventListener('click', () => this.generarInforme());
        }
        
        const copiarBtn = document.getElementById('btn-copiar');
        if (copiarBtn) {
            copiarBtn.addEventListener('click', () => this.copiarResultado());
        }
        
        const compartirBtn = document.getElementById('btn-compartir');
        if (compartirBtn) {
            compartirBtn.addEventListener('click', () => this.compartirWhatsApp());
        }
    }

    async generarInforme() {
        const floresInput = document.getElementById('flores-input').value.trim();
        
        if (!floresInput) {
            this.mostrarNotificacion('🌿 Por favor, introduce al menos una flor', 'warning');
            return;
        }

        // Convertir el texto en un array de flores (separado por comas)
        const floresArray = floresInput.split(',').map(f => f.trim()).filter(f => f);
        
        if (floresArray.length === 0) {
            this.mostrarNotificacion('🌿 Formato incorrecto. Usa comas para separar las flores', 'warning');
            return;
        }

        this.mostrarLoading(true);
        this.ocultarResultado();
        
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ flores: floresArray })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            if (!data.informe) {
                throw new Error('La respuesta no contiene un informe válido');
            }

            this.mostrarResultado(data.informe);
            this.mostrarNotificacion('✅ Informe generado correctamente', 'success');
            
        } catch (error) {
            console.error('Error detallado:', error);
            this.mostrarNotificacion('❌ Error al generar el informe: ' + error.message, 'error');
            
            // Mensaje de ayuda si el error es de conexión
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                this.mostrarNotificacion('🔌 No se pudo conectar con el servidor. Verifica que n8n esté corriendo.', 'error');
            }
        } finally {
            this.mostrarLoading(false);
        }
    }

    mostrarResultado(informe) {
        const resultadoDiv = document.getElementById('resultado');
        const textoResultado = document.getElementById('texto-resultado');
        
        if (textoResultado) {
            textoResultado.textContent = informe;
        }
        
        if (resultadoDiv) {
            resultadoDiv.classList.remove('hidden');
            // Scroll suave al resultado
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    ocultarResultado() {
        const resultadoDiv = document.getElementById('resultado');
        if (resultadoDiv) {
            resultadoDiv.classList.add('hidden');
        }
    }

    copiarResultado() {
        const textoOriginal = document.getElementById('texto-resultado')?.textContent;
        
        if (!textoOriginal) {
            this.mostrarNotificacion('No hay informe para copiar', 'warning');
            return;
        }
        
        navigator.clipboard.writeText(textoOriginal).then(() => {
            this.mostrarNotificacion('📋 Informe copiado al portapapeles', 'success');
        }).catch(err => {
            console.error('Error al copiar:', err);
            this.copiarFallback(textoOriginal);
        });
    }

    compartirWhatsApp() {
        const textoOriginal = document.getElementById('texto-resultado')?.textContent;
        
        if (!textoOriginal) {
            this.mostrarNotificacion('No hay informe para compartir', 'warning');
            return;
        }
        
        // Limitar el texto para WhatsApp (máximo recomendado)
        const textoLimitado = textoOriginal.length > 4000 
            ? textoOriginal.substring(0, 4000) + '...\n\n(Informe truncado por longitud)'
            : textoOriginal;
        
        const textoCodificado = encodeURIComponent(textoLimitado);
        const urlWhatsApp = `https://wa.me/?text=${textoCodificado}`;
        
        window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
    }

    copiarFallback(texto) {
        const textArea = document.createElement('textarea');
        textArea.value = texto;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            this.mostrarNotificacion('📋 Informe copiado al portapapeles', 'success');
        } catch (err) {
            alert('No se pudo copiar automáticamente. Por favor, copia manualmente.');
        }
        document.body.removeChild(textArea);
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.textContent = mensaje;
        
        // Estilos inline para que funcione sin CSS adicional
        notificacion.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        // Colores según tipo
        if (tipo === 'success') notificacion.style.backgroundColor = '#10b981';
        else if (tipo === 'error') notificacion.style.backgroundColor = '#ef4444';
        else if (tipo === 'warning') notificacion.style.backgroundColor = '#f59e0b';
        else notificacion.style.backgroundColor = '#3b82f6';
        
        document.body.appendChild(notificacion);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            notificacion.style.opacity = '0';
            notificacion.style.transition = 'opacity 0.3s';
            setTimeout(() => notificacion.remove(), 300);
        }, 3000);
    }

    mostrarLoading(mostrar) {
        const loading = document.getElementById('loading');
        const boton = document.getElementById('generar-btn');
        
        if (loading) {
            if (mostrar) {
                loading.classList.remove('hidden');
            } else {
                loading.classList.add('hidden');
            }
        }
        
        if (boton) {
            boton.disabled = mostrar;
            boton.textContent = mostrar ? '🔄 Generando...' : 'Generar Informe Profesional';
        }
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new FloresBachApp();
});
