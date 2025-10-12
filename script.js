// script.js
import { FLORES_DATA } from './flores.js';

class FloresBachApp {
    constructor() {
        this.geminiApiKey = 'tu_api_key_aqui'; // Puedes ponerla directa o usar variables de entorno
        this.init();
    }

    init() {
        document.getElementById('generar-btn').addEventListener('click', () => {
            this.generarInforme();
        });
        
        document.getElementById('copiar-btn').addEventListener('click', () => {
            this.copiarResultado();
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
            const informe = await this.llamarGemini(floresInput);
            this.mostrarResultado(informe);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al generar el informe. Inténtalo de nuevo.');
        } finally {
            this.mostrarLoading(false);
        }
    }

    async llamarGemini(floresInput) {
        const prompt = `Tu Rol y Personalidad:
Eres un asistente experto en Flores de Bach, con una profunda comprensión de la filosofía del Dr. Bach. Tu propósito es ayudar a terapeutas a comunicar de manera efectiva los remedios seleccionados para sus pacientes. Tu tono es empático, profesional, claro y tranquilizador. Escribes en un español impecable, con una comunicación que inspira confianza y calidez.

INSTRUCCIÓN IMPORTANTE: Basa tus descripciones ÚNICAMENTE en la siguiente base de conocimiento:

${JSON.stringify(FLORES_DATA, null, 2)}

Las flores proporcionadas por el terapeuta son: ${floresInput}

Genera el informe completo siguiendo EXACTAMENTE la estructura y estilo del ejemplo proporcionado.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
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
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    mostrarResultado(informe) {
        const resultadoDiv = document.getElementById('resultado');
        const textoResultado = document.getElementById('texto-resultado');
        
        textoResultado.textContent = informe;
        resultadoDiv.classList.remove('hidden');
        
        // Scroll al resultado
        resultadoDiv.scrollIntoView({ behavior: 'smooth' });
    }

    copiarResultado() {
        const texto = document.getElementById('texto-resultado').textContent;
        navigator.clipboard.writeText(texto).then(() => {
            alert('✅ Informe copiado al portapapeles');
        });
    }

    mostrarLoading(mostrar) {
        const loading = document.getElementById('loading');
        if (mostrar) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }
}

// Inicializar la app
new FloresBachApp();
