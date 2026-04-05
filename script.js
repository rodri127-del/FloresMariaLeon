class FloresBachApp {
    constructor() {
        this.apiUrl = 'https://n8n.novaproflow.com/webhook/flores-bach';
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

            if (!data.output) {
                throw new Error('La respuesta no contiene un informe válido');
            }

            this.mostrarResultado(data.output);
            this.mostrarNotificacion('✨ Informe generado con cariño', 'success');
            
        } catch (error) {
            console.error('Error detallado:', error);
            this.mostrarNotificacion('❌ Error al generar el informe: ' + error.message, 'error');
            
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
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.textContent = mensaje;
        
        document.body.appendChild(notificacion);
        
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
            boton.textContent = mostrar ? '🌿 Tejiendo tu informe...' : 'Generar Informe Profesional';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FloresBachApp();
});
