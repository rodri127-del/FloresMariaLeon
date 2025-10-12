// script.js - VERSIÓN SIMPLIFICADA Y FUNCIONAL
class FloresBachApp {
    constructor() {
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
            // 🔥 SOLUCIÓN DIRECTA - Sin funciones complicadas
            const prompt = this.crearPrompt(floresInput);
            const informe = await this.llamarGeminiDirecto(prompt);
            this.mostrarResultado(informe);
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        } finally {
            this.mostrarLoading(false);
        }
    }

    async llamarGeminiDirecto(prompt) {
        // ⚠️ PON AQUÍ TU API KEY DE GEMINI directamente
        const apiKey = 'AIzaSyC6FeXKWkhvAmF6RPpqsuMiX4MPijB6YLs'; // 👈 REEMPLAZA ESTO
        
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
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
        return `Tu Rol y Personalidad:
Eres un asistente experto en Flores de Bach. Tu propósito es ayudar a terapeutas a comunicar los remedios seleccionados para sus pacientes. Tu tono es empático, profesional, claro y tranquilizador.

Genera un informe completo para el paciente basado en estas flores: ${floresInput}

Sigue esta estructura:
1. Agradecimiento y introducción amable
2. Visión general de la combinación de flores
3. Análisis detallado de cada flor (para qué sirve y cómo ayuda)
4. Mensaje final de esperanza

Usa exclusivamente la información de las 38 flores de Bach.`;
    }

    mostrarResultado(informe) {
        const resultadoDiv = document.getElementById('resultado');
        const textoResultado = document.getElementById('texto-resultado');
        
        textoResultado.textContent = informe;
        resultadoDiv.classList.remove('hidden');
        resultadoDiv.scrollIntoView({ behavior: 'smooth' });
    }

    copiarResultado(formato) {
        const textoOriginal = document.getElementById('texto-resultado').textContent;
        navigator.clipboard.writeText(textoOriginal).then(() => {
            alert(`✅ Informe copiado en formato ${formato.toUpperCase()}`);
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
