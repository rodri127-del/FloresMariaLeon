class FloresBachApp {
    constructor() {
        this.workerUrl = 'https://floresmarialeon.novaproflow.com/';
        this.init();
    }

    init() {
        document.getElementById('generar-btn').addEventListener('click', () => {
            this.generarInforme();
        });
        
        // Un solo botón de copiar - siempre texto plano
        document.getElementById('btn-copiar').addEventListener('click', () => {
            this.copiarResultado();
        });
        
        // Botón de compartir por WhatsApp
        document.getElementById('btn-compartir').addEventListener('click', () => {
            this.compartirWhatsApp();
        });
    }

    async generarInforme() {
        const floresInput = document.getElementById('flores-input').value.trim();
        
        if (!floresInput) {
            alert('Por favor, introduce al menos una flor');
            return;
        }

        this.mostrarLoading(true);
        document.getElementById('resultado').classList.add('hidden');
        
        try {
            const response = await fetch(this.workerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ flores: floresInput })
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            this.mostrarResultado(data.informe);
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error al generar el informe: ' + error.message);
        } finally {
            this.mostrarLoading(false);
        }
    }

    mostrarResultado(informe) {
        const resultadoDiv = document.getElementById('resultado');
        const textoResultado = document.getElementById('texto-resultado');
        
        textoResultado.textContent = informe;
        resultadoDiv.classList.remove('hidden');
        
        // Scroll suave al resultado
        resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // SOLO TEXTO PLANO - eliminados HTML y Markdown
    copiarResultado() {
        const textoOriginal = document.getElementById('texto-resultado').textContent;
        
        navigator.clipboard.writeText(textoOriginal).then(() => {
            this.mostrarNotificacion('✅ Informe copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar:', err);
            // Fallback para navegadores antiguos
            this.copiarFallback(textoOriginal);
        });
    }

    compartirWhatsApp() {
        const textoOriginal = document.getElementById('texto-resultado').textContent;
        
        // Codificar el texto para URL
        const textoCodificado = encodeURIComponent(textoOriginal);
        
        // Crear URL de WhatsApp
        const urlWhatsApp = `https://wa.me/?text=${textoCodificado}`;
        
        // Abrir en una nueva ventana
        window.open(urlWhatsApp, '_blank', 'width=600,height=600');
    }

    copiarFallback(texto) {
        const textArea = document.createElement('textarea');
        textArea.value = texto;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            this.mostrarNotificacion('✅ Informe copiado al portapapeles');
        } catch (err) {
            alert('Error al copiar. Por favor, copia manualmente.');
        }
        document.body.removeChild(textArea);
    }

    mostrarNotificacion(mensaje) {
        // Notificación simple - podríamos hacerla más elegante después
        alert(mensaje);
    }

    mostrarLoading(mostrar) {
        const loading = document.getElementById('loading');
        const boton = document.getElementById('generar-btn');
        
        if (mostrar) {
            loading.classList.remove('hidden');
            boton.disabled = true;
            boton.textContent = 'Generando...';
        } else {
            loading.classList.add('hidden');
            boton.disabled = false;
            boton.textContent = 'Generar Informe Profesional';
        }
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new FloresBachApp();
});
