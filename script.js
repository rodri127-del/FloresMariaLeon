// script.js
class FloresBachApp {
    constructor() {
        this.init();
    }

    init() {
        document.getElementById('generar-btn').addEventListener('click', () => {
            this.generarInforme();
        });
        
        // Event listeners para los botones de copiar
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

Contexto Clave:

El usuario que interactúa contigo es un terapeuta experto que ya ha seleccionado las flores adecuadas para su paciente. Tu tarea no es recomendar flores, sino generar un informe claro y bien estructurado para el paciente final. Este paciente puede no tener conocimientos previos sobre las Flores de Bach, por lo que la claridad y la sencillez, sin perder la profundidad, son fundamentales.

Flujo de la Interacción:

Generación del Informe: Una vez que el usuario te proporcione la lista de flores, generarás una respuesta única y completa siguiendo la estructura y el estilo del ejemplo de excelencia proporcionado.

EJEMPLO DE INTERACCIÓN IDEAL (ONE-SHOT EXAMPLE)

Este es el estándar de calidad que debes seguir.

(INPUT DEL USUARIO):
Las flores son: Wild Oat, Olive, Hornbeam y Walnut.

(OUTPUT PERFECTO GENERADO POR TI):
Quiero darte las gracias, de corazón, por tu confianza. Es un auténtico privilegio poder acompañarte en este camino de autodescubrimiento y bienestar.

Análisis de Remedios Florales de Bach

Hola,

Este es un resumen de las esencias florales que han sido seleccionadas para ti. El objetivo de los remedios del Dr. Bach es ayudarnos a gestionar los estados emocionales pasajeros y a fomentar un mayor bienestar y equilibrio interior. No buscan tratar síntomas físicos, sino la actitud y los sentimientos que nos acompañan en un momento determinado de nuestra vida.

Visión General: Un Momento de Pausa, Agotamiento y Búsqueda

La combinación de estas cuatro flores sugiere que te encuentras en una encrucijada vital importante. Por un lado, sientes un profundo deseo de encontrar un camino o propósito que te llene de verdad (Wild Oat), pero te resulta difícil ver con claridad cuál es la dirección correcta. Esta incertidumbre fundamental puede ser muy agotadora y es posible que haya consumido gran parte de tu energía vital, dejándote en un estado de profundo cansancio físico y mental (Olive).

Este agotamiento se manifiesta de dos maneras: como una fatiga extrema después de un gran esfuerzo y, a la vez, como una falta de fuerza mental para afrontar el día a día, una especie de "pereza" para arrancar (Hornbeam). En medio de esta situación de duda y cansancio, te encuentras también más vulnerable a las opiniones de los demás y a las circunstancias externas, lo que puede desviarte o hacerte dudar aún más de tus propias decisiones en este momento crucial de cambio (Walnut).

En conjunto, estas flores te ayudarán a recargar tu energía, proteger tu estado de ánimo, clarificar tu mente y encontrar la fuerza y la convicción para descubrir y seguir tu propio camino.

Análisis Detallado de cada Flor

1. Wild Oat (Avena Silvestre)

Para qué sirve: Para la persona que siente que tiene talentos y ambición, pero está en un estado de insatisfacción y duda sobre qué camino tomar en la vida. Es la incertidumbre vocacional que lleva a probar muchas cosas sin encontrar un propósito real, generando frustración.

Cómo ayuda: Aporta claridad y dirección. Ayuda a conectar con la vocación interior para poder ver y elegir un camino de vida definido y satisfactorio.

2. Olive (Olivo)

Para qué sirve: Para el agotamiento total del cuerpo y de la mente. Es la sensación de estar completamente vacío de energía tras largos períodos de esfuerzo, enfermedad o lucha personal. No queda ninguna reserva.

Cómo ayuda: Actúa como un revitalizante profundo. Restaura la fuerza, la vitalidad y el interés por la vida, aportando una sensación de paz y regeneración.

3. Hornbeam (Hojarazo)

Para qué sirve: Se dirige al cansancio mental, a la sensación de "lunes por la mañana" que aparece solo de pensar en las tareas pendientes. Es la duda sobre la propia capacidad para afrontar el día, aunque una vez en acción, se cumple con todo.

Cómo ayuda: Devuelve la chispa, la fortaleza mental y la espontaneidad. Ayuda a despejar la cabeza y a afrontar las responsabilidades con energía, disipando la procrastinación.

4. Walnut (Nogal)

Para qué sirve: Es la flor para las etapas de transición y para protegerse de influencias externas. Ayuda a las personas que, aunque tienen claro su camino, se ven fácilmente afectadas o desviadas por las opiniones, la energía o las circunstancias de su entorno.

Cómo ayuda: Funciona como un "protector psíquico". Fortalece la capacidad de mantenerse firme en las propias decisiones, facilita la adaptación a los cambios y ayuda a romper con vínculos o hábitos del pasado que ya no sirven.

Espero que este análisis te sea de gran utilidad. El camino con las flores de Bach es un proceso amable y personal de autodescubrimiento y equilibrio.

BASE DE CONOCIMIENTO AMPLIADA: LAS 38 FLORES DE BACH

Utiliza exclusivamente esta información para tus descripciones.

[TU PROMPT COMPLETO AQUÍ - LO MANTENEMOS IGUAL]

Las flores proporcionadas por el terapeuta son: ${floresInput}

Genera el informe completo siguiendo EXACTAMENTE la estructura y estilo del ejemplo proporcionado.`;

        // Usamos la Cloudflare Function en lugar de llamar directo a Gemini
        const response = await fetch('/functions/gemini-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
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

    copiarResultado(formato) {
        const textoOriginal = document.getElementById('texto-resultado').textContent;
        let textoACopiar = textoOriginal;

        if (formato === 'html') {
            // Convertir a HTML básico
            textoACopiar = this.convertirAHTML(textoOriginal);
        } else if (formato === 'markdown') {
            // Convertir a Markdown
            textoACopiar = this.convertirAMarkdown(textoOriginal);
        }
        // Para texto plano, se queda igual

        navigator.clipboard.writeText(textoACopiar).then(() => {
            alert(`✅ Informe copiado en formato ${formato.toUpperCase()}`);
        });
    }

    convertirAHTML(texto) {
        return texto
            .split('\n')
            .map(linea => {
                if (linea.trim() === '') return '<br>';
                if (linea.match(/^[0-9]+\./)) return `<p><strong>${linea}</strong></p>`;
                if (linea.match(/^[A-Z][A-Za-záéíóúñ\s]+:/)) return `<p><strong>${linea}</strong></p>`;
                return `<p>${linea}</p>`;
            })
            .join('');
    }

    convertirAMarkdown(texto) {
        return texto
            .split('\n')
            .map(linea => {
                if (linea.match(/^[0-9]+\./)) return `**${linea}**`;
                if (linea.match(/^[A-Z][A-Za-záéíóúñ\s]+:/)) return `**${linea}**`;
                return linea;
            })
            .join('\n');
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

// Inicializar la app cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new FloresBachApp();
});
