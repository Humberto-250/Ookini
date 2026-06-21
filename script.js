// --- CONFIGURACIÓN DE TAILWIND ---
tailwind.config = {
    theme: {
        extend: {
            colors: {
                darkBg: '#0F0E0E',
                lightGray: '#EEEEEE',
                rusticWine: '#541212',
                tealAccent: '#468A9A',
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Plus Jakarta Sans', 'sans-serif'],
            }
        }
    }
}

// --- ESTADO GENERAL ---
let cupsRemaining = 50; // Capacidad máxima diaria para preparaciones especiales
let cataRemaining = 8;  // Capacidad máxima semanal de cupos para cata

// --- REFERENCIAS DEL DOM ---
const labelCupsRemaining = document.getElementById('label-cups-remaining');
const progressCups = document.getElementById('progress-cups');
const labelCataRemaining = document.getElementById('label-cata-remaining');
const progressCata = document.getElementById('progress-cata');

const reservationForm = document.getElementById('reservation-form');
const contactForm = document.getElementById('contact-form');

const optSpecial = document.getElementById('radio-special');
const optCata = document.getElementById('radio-cata');
const optSpecialContainer = document.getElementById('opt-special-container');
const optCataContainer = document.getElementById('opt-cata-container');

const sectionSpecialOptions = document.getElementById('section-special-options');
const sectionCataOptions = document.getElementById('section-cata-options');

const specialMethod = document.getElementById('special-method');
const specialQuantity = document.getElementById('special-quantity');
const cataQuantity = document.getElementById('cata-quantity');

const reservationSummary = document.getElementById('reservation-summary');
const reservationTotal = document.getElementById('reservation-total');

// --- ACTUALIZACIÓN DE INDICADORES VISUALES ---
function updateAvailabilityUI() {
    // Copa Especialidades
    labelCupsRemaining.innerText = `${cupsRemaining} / 50 disponibles`;
    const percentageCups = (cupsRemaining / 50) * 100;
    progressCups.style.width = `${percentageCups}%`;
    
    // Cata Semanal
    labelCataRemaining.innerText = `${cataRemaining} / 8 cupos`;
    const percentageCata = (cataRemaining / 8) * 100;
    progressCata.style.width = `${percentageCata}%`;
}

// --- CALCULAR Y ACTUALIZAR TOTALES ---
function calculateTotal() {
    let selectedType = document.querySelector('input[name="res-type"]:checked').value;
    let summaryText = "";
    let totalPrice = 0;

    if (selectedType === 'special') {
        const method = specialMethod.value;
        const qty = parseInt(specialQuantity.value);
        const selectedOption = specialMethod.options[specialMethod.selectedIndex];
        const unitPrice = parseFloat(selectedOption.getAttribute('data-price'));
        
        totalPrice = unitPrice * qty;
        summaryText = `${method} (Especialidad) x ${qty} ${qty === 1 ? 'Taza' : 'Tazas'}`;
    } else {
        const qty = parseInt(cataQuantity.value);
        const unitPrice = 25; // Precio estático por cata
        
        totalPrice = unitPrice * qty;
        summaryText = `Cata Semanal x ${qty} ${qty === 1 ? 'Persona' : 'Personas'}`;
    }

    reservationSummary.innerText = summaryText;
    reservationTotal.innerText = `$${totalPrice.toFixed(2)} USD`;
}

// --- SWITCH DE FORMULARIO DINÁMICO ---
function handleFormTypeChange() {
    if (optSpecial.checked) {
        sectionSpecialOptions.classList.remove('hidden');
        sectionCataOptions.classList.add('hidden');
        
        // Clases visuales de selección de tarjeta
        optSpecialContainer.classList.add('border-rusticWine', 'bg-rusticWine/5');
        optSpecialContainer.classList.remove('border-darkBg/10');
        
        optCataContainer.classList.add('border-darkBg/10');
        optCataContainer.classList.remove('border-rusticWine', 'bg-rusticWine/5');
    } else {
        sectionSpecialOptions.classList.add('hidden');
        sectionCataOptions.classList.remove('hidden');

        // Clases visuales de selección de tarjeta
        optCataContainer.classList.add('border-rusticWine', 'bg-rusticWine/5');
        optCataContainer.classList.remove('border-darkBg/10');
        
        optSpecialContainer.classList.add('border-darkBg/10');
        optSpecialContainer.classList.remove('border-rusticWine', 'bg-rusticWine/5');
    }
    calculateTotal();
}

// --- EVENT LISTENERS DE FORMULARIO DE RESERVA ---
optSpecial.addEventListener('change', handleFormTypeChange);
optCata.addEventListener('change', handleFormTypeChange);
specialMethod.addEventListener('change', calculateTotal);
specialQuantity.addEventListener('change', calculateTotal);
cataQuantity.addEventListener('change', calculateTotal);

// --- ENVÍO DEL FORMULARIO DE RESERVACIÓN & LÓGICA DE NEGOCIOS ---
reservationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('res-name').value;
    const email = document.getElementById('res-email').value;
    const resType = document.querySelector('input[name="res-type"]:checked').value;

    if (resType === 'special') {
        const qty = parseInt(specialQuantity.value);
        const method = specialMethod.value;

        // VALIDACIÓN 1: Máximo 2 tazas por persona
        if (qty > 2) {
            showCustomError("Límite de Reserva", "No puedes reservar más de 2 tazas por persona al día para preparaciones especiales.");
            return;
        }

        // VALIDACIÓN 2: Límite diario de tazas en stock
        if (cupsRemaining < qty) {
            showCustomError("Cupos Agotados", `Lo sentimos, sólo quedan ${cupsRemaining} tazas disponibles para métodos especiales hoy.`);
            return;
        }

        // Descontar cupos
        cupsRemaining -= qty;
        updateAvailabilityUI();

        // Mostrar Modal de Éxito
        const code = `OOK-${Math.floor(1000 + Math.random() * 9000)}`;
        showSuccessModal(name, `${method} x ${qty} ${qty === 1 ? 'taza' : 'tazas'}`, code);

    } else {
        const qty = parseInt(cataQuantity.value);

        // VALIDACIÓN 3: Límite de cupos en cata
        if (cataRemaining < qty) {
            showCustomError("Sin Lugares", `Lo sentimos, la cata de esta semana cuenta con sólo ${cataRemaining} cupos libres.`);
            return;
        }

        // Descontar cupos
        cataRemaining -= qty;
        updateAvailabilityUI();

        // Mostrar Modal de Éxito
        const code = `OOK-CATA-${Math.floor(1000 + Math.random() * 9000)}`;
        showSuccessModal(name, `Cata Semanal x ${qty} ${qty === 1 ? 'Persona' : 'Personas'}`, code);
    }

    reservationForm.reset();
    handleFormTypeChange();
});

// --- ENVÍO DEL FORMULARIO DE CONTACTO ---
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    
    // Mock de guardado de mensaje
    showSuccessModal(
        name, 
        "Tu mensaje ha sido enviado al equipo de Ookini. Nos comunicaremos contigo vía correo.", 
        "MSG-" + Math.floor(1000 + Math.random() * 9000), 
        "¡Mensaje Enviado!"
    );
    
    contactForm.reset();
});

// --- MODALES PERSONALIZADOS ---
function showSuccessModal(clientName, details, reservationCode, customTitle = "¡Reserva Confirmada!") {
    document.getElementById('modal-title').innerText = customTitle;
    document.getElementById('modal-meta-name').innerText = clientName;
    document.getElementById('modal-meta-detail').innerText = details;
    document.getElementById('modal-meta-code').innerText = reservationCode;
    
    const modal = document.getElementById('modal-success');
    modal.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('modal-container').classList.remove('scale-95');
        document.getElementById('modal-container').classList.add('scale-100');
    }, 50);
}

function showCustomError(title, description) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-meta-name').innerText = "Inconveniente";
    document.getElementById('modal-meta-detail').innerText = description;
    document.getElementById('modal-meta-code').innerText = "ERR-VALIDACION";
    
    const modal = document.getElementById('modal-success');
    modal.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('modal-container').classList.remove('scale-95');
        document.getElementById('modal-container').classList.add('scale-100');
    }, 50);
}

function closeModal(id) {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.classList.remove('scale-100');
    modalContainer.classList.add('scale-95');
    
    setTimeout(() => {
        document.getElementById(id).classList.add('hidden');
    }, 150);
}

// --- INICIALIZAR ---
window.onload = function() {
    updateAvailabilityUI();
    calculateTotal();
}