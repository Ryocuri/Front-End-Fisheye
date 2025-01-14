function openModal() { // Affiche le modal
  document.getElementById('contactModal').style.display = 'block';
  document.body.classList.add('modal-open');
}

function closeModal() { // Cache le modal
  document.getElementById('contactModal').style.display = 'none';
  document.body.classList.remove('modal-open');
}

function clearAllErrors(form) {
  const errorMessages = form.querySelectorAll('.error-message');
  const errorInputs = form.querySelectorAll('.error');

  errorMessages.forEach((msg) => msg.remove()); // Supprime tous les messages d'erreur
  errorInputs.forEach((input) => input.classList.remove('error')); // Supprime la classe d'erreur sur tous les champs
}

function displayFieldError(input, message) {
  input.classList.add('error');

  if (!input.parentNode.querySelector('.error-message')) { // Vérifie si un message d'erreur est déjà affiché
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.setAttribute('role', 'alert');
    errorMessage.textContent = message;
    input.parentNode.appendChild(errorMessage);
  }
}

function validateAllFields(form) {
  const inputs = form.querySelectorAll('.form-group input, .form-group textarea'); // Récupère tous les champs du formulaire
  let isValid = true; // Initialise la variable de validation

  // eslint-disable-next-line complexity
  inputs.forEach((input) => { // Parcours tous les champs
    if (input.hasAttribute('required') && !input.value.trim()) { // Vérifie si le champ est requis et s'il est vide
      displayFieldError(input, 'Ce champ est requis');
      isValid = false;
    }

    if (input.type === 'email' && input.value.trim()) { // Vérifie si le champ est de type email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expression régulière pour valider une adresse email
      if (!emailRegex.test(input.value)) {
        displayFieldError(input, 'Adresse email invalide');
        isValid = false;
      }
    }

    if (input.hasAttribute('minlength') && input.value.trim()) { // Vérifie si le champ a une longueur minimale
      const minLength = parseInt(input.getAttribute('minlength'));
      if (input.value.length < minLength) {
        displayFieldError(input, `Minimum ${minLength} caractères requis`);
        isValid = false;
      }
    }

    if (input.hasAttribute('maxlength') && input.value.trim()) { // Vérifie si le champ a une longueur maximale
      const maxLength = parseInt(input.getAttribute('maxlength'));
      if (input.value.length > maxLength) {
        displayFieldError(input, `Maximum ${maxLength} caractères autorisés`);
        isValid = false;
      }
    }

    if (input.hasAttribute('pattern') && input.value.trim()) { // Vérifie si le champ a un motif de validation
      const pattern = new RegExp(input.getAttribute('pattern'));
      if (!pattern.test(input.value)) {
        displayFieldError(input, 'Format incorrect');
        isValid = false;
      }
    }
  });

  return isValid;
}

function handleSubmit(event) {
  event.preventDefault(); // Empêche l'envoi du formulaire
  const form = event.target; // Récupère le formulaire

  clearAllErrors(form); // Supprime les messages d'erreur

  if (validateAllFields(form)) { // Vérifie que tous les champs du formulaire sont corrects
	  new FormData(form);
	  const modal = document.getElementById('contactModal');
	  if (modal) {
		  modal.style.display = 'none';
		  modal.setAttribute('aria-hidden', 'true');
	  }
	  form.reset(); // Réinitialise le formulaire
  }
}

function validateForm() {
  const inputs = document.querySelectorAll('.form-group input, .form-group textarea'); // Récupère tous les champs du formulaire

  inputs.forEach((input) => { // Parcours tous les champs
    input.addEventListener('input', function () { // Ajoute un écouteur d'événement sur l'entrée utilisateur
      this.classList.remove('error');
      const errorMessage = this.parentNode.querySelector('.error-message');
      if (errorMessage) {
        errorMessage.remove();
      }
    });
  });
}

export function setupModalListeners() {
  const modal = document.getElementById('contactModal');
  const openButton = document.querySelector('.contact-button');
  const closeButton = document.querySelector('.modal .close');
  const form = document.getElementById('contactForm');

  if (!modal || !openButton || !closeButton || !form) return;

  form.setAttribute('novalidate', 'true'); // Désactive la validation HTML5

  openButton.addEventListener('click', () => {
    openModal();
    modal.setAttribute('aria-hidden', 'false'); // Affiche le modal
  });

  closeButton.addEventListener('click', () => {
    closeModal();
    modal.setAttribute('aria-hidden', 'true'); // Cache le modal
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
      modal.setAttribute('aria-hidden', 'true'); // Cache le modal
    }
  });

  form.addEventListener('submit', handleSubmit); // Validation du formulaire
}

document.addEventListener('DOMContentLoaded', validateForm);