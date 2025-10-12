class FloresBachApp {
    constructor() {
        this.workerUrl = 'https://flores-bach-backend.rodri127.workers.dev';
        this.init();
    }

    init() {
        document.getElementById('generar-btn').addEventListener('click', () => {
            this.generarInforme();
        });
        
        document.querySelectorAll('.btn-copiar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const formato = e.target.getAttribute('data-formato');
                this.copiarResultado(formato);
            });
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

    copiarResultado(formato) {
        const textoOriginal = document.getElementById('texto-resultado').textContent;
        let textoACopiar = textoOriginal;

        if (formato === 'html') {
            textoACopiar = this.convertirAHTML(textoOriginal);
        } else if (formato === 'markdown') {
            textoACopiar = this.convertirAMarkdown(textoOriginal);
        }

        navigator.clipboard.writeText(textoACopiar).then(() => {
            this.mostrarNotificacion(`✅ Informe copiado en formato ${formato.toUpperCase()}`);
        }).catch(err => {
            console.error('Error al copiar:', err);
            // Fallback para navegadores antiguos
            this.copiarFallback(textoACopiar, formato);
        });
    }

    convertirAHTML(texto) {
        return texto
            .split('\n')
            .map(linea => {
                if (linea.trim() === '') return '<br>';
                if (linea.match(/^\*\*.*\*\*$/)) {
                    // Títulos en negrita
                    return `<h3>${linea.replace(/\*\*/g, '')}</h3>`;
                }
                if (linea.match(/^\*   \*\*.*\*\*:/)) {
                    // Elementos de lista con negrita
                    return `<li><strong>${linea.replace(/^\*   \*\*|\*\*:/g, '')}</strong>`;
                }
                if (linea.match(/^\*   /)) {
                    // Elementos de lista normales
                    return `<li>${linea.replace(/^\*   /, '')}</li>`;
                }
                return `<p>${linea}</p>`;
            })
            .join('')
            .replace(/<li><\/li>/g, '') // Limpiar elementos vacíos
            .replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>'); // Agrupar listas
    }

    convertirAMarkdown(texto) {
        return texto;
        // El texto ya viene en un formato similar a Markdown
    }

    copiarFallback(texto, formato) {
        const textArea = document.createElement('textarea');
        textArea.value = texto;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            this.mostrarNotificacion(`✅ Informe copiado en formato ${formato.toUpperCase()}`);
        } catch (err) {
            alert('Error al copiar. Por favor, copia manualmente.');
        }
        document.body.removeChild(textArea);
    }

    mostrarNotificacion(mensaje) {
        // Podríamos implementar notificaciones más elegantes aquí
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
