class FloresBachApp {
    constructor() {
        this.apiKey = ''; // Tu API key
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
        
        try {
            const prompt = this.crearPrompt(floresInput);
            const informe = await this.llamarGemini(prompt);
            this.mostrarResultado(informe);
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        } finally {
            this.mostrarLoading(false);
        }
    }

    async llamarGemini(prompt) {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    crearPrompt(floresInput) {
        return `Eres un experto en Flores de Bach. Genera un informe para el paciente basado en estas flores: ${floresInput}

Sigue esta estructura:
- Agradecimiento y introducción amable
- Visión general de la combinación  
- Análisis detallado de cada flor (para qué sirve y cómo ayuda)
- Mensaje final de esperanza

Tono: empático, profesional y tranquilizador.`;
    }

    mostrarResultado(informe) {
        const resultadoDiv = document.getElementById('resultado');
        const textoResultado = document.getElementById('texto-resultado');
        
        textoResultado.textContent = informe;
        resultadoDiv.classList.remove('hidden');
    }

    copiarResultado(formato) {
        const textoOriginal = document.getElementById('texto-resultado').textContent;
        let textoACopiar = textoOriginal;

        if (formato === 'html') {
            textoACopiar = textoOriginal.replace(/\n/g, '<br>');
        } else if (formato === 'markdown') {
            textoACopiar = textoOriginal;
        }

        navigator.clipboard.writeText(textoACopiar).then(() => {
            alert(`✅ Copiado en formato ${formato.toUpperCase()}`);
        });
    }

    mostrarLoading(mostrar) {
        const loading = document.getElementById('loading');
        loading.classList.toggle('hidden', !mostrar);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new FloresBachApp();
});
