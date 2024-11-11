export function setupModalListeners() {
	const modal = document.getElementById('contactModal');
	const openButton = document.querySelector('.contact-button');
	const closeButton = document.querySelector('.modal .close');
	const form = document.getElementById('contactForm');

	if (!modal || !openButton || !closeButton || !form) return;

	form.setAttribute('novalidate', 'true');

	openButton.addEventListener('click', () => {
		openModal();
		modal.setAttribute('aria-hidden', 'false');
	});

	closeButton.addEventListener('click', () => {
		closeModal();
		modal.setAttribute('aria-hidden', 'true');
	});

	window.addEventListener('click', (event) => {
		if (event.target === modal) {
			closeModal();
			modal.setAttribute('aria-hidden', 'true');
		}
	});

	form.addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
	event.preventDefault();
	const form = event.target;

	clearAllErrors(form);

	if (validateAllFields(form)) {
		const formData = new FormData(form);
		const modal = document.getElementById('contactModal');
		if (modal) {
			modal.style.display = 'none';
			modal.setAttribute('aria-hidden', 'true');
		}
		form.reset();
	}
}

function validateAllFields(form) {
	const inputs = form.querySelectorAll('.form-group input, .form-group textarea');
	let isValid = true;

	inputs.forEach(input => {
		if (input.hasAttribute('required') && !input.value.trim()) {
			displayFieldError(input, 'Ce champ est requis');
			isValid = false;
		}

		if (input.type === 'email' && input.value.trim()) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(input.value)) {
				displayFieldError(input, 'Adresse email invalide');
				isValid = false;
			}
		}

		if (input.hasAttribute('minlength') && input.value.trim()) {
			const minLength = parseInt(input.getAttribute('minlength'));
			if (input.value.length < minLength) {
				displayFieldError(input, `Minimum ${minLength} caractères requis`);
				isValid = false;
			}
		}

		if (input.hasAttribute('maxlength') && input.value.trim()) {
			const maxLength = parseInt(input.getAttribute('maxlength'));
			if (input.value.length > maxLength) {
				displayFieldError(input, `Maximum ${maxLength} caractères autorisés`);
				isValid = false;
			}
		}

		if (input.hasAttribute('pattern') && input.value.trim()) {
			const pattern = new RegExp(input.getAttribute('pattern'));
			if (!pattern.test(input.value)) {
				displayFieldError(input, 'Format incorrect');
				isValid = false;
			}
		}
	});

	return isValid;
}

function displayFieldError(input, message) {
	input.classList.add('error');

	if (!input.parentNode.querySelector('.error-message')) {
		const errorMessage = document.createElement('div');
		errorMessage.className = 'error-message';
		errorMessage.setAttribute('role', 'alert');
		errorMessage.textContent = message;
		input.parentNode.appendChild(errorMessage);
	}
}

function clearAllErrors(form) {
	const errorMessages = form.querySelectorAll('.error-message');
	const errorInputs = form.querySelectorAll('.error');

	errorMessages.forEach(msg => msg.remove());
	errorInputs.forEach(input => input.classList.remove('error'));
}

function validateForm() {
	const inputs = document.querySelectorAll('.form-group input, .form-group textarea');

	inputs.forEach(input => {
		input.addEventListener('input', function () {
			this.classList.remove('error');
			const errorMessage = this.parentNode.querySelector('.error-message');
			if (errorMessage) {
				errorMessage.remove();
			}
		});
	});
}

function openModal() {
	document.getElementById('contactModal').style.display = 'block';
	document.body.classList.add('modal-open');
}

function closeModal() {
	document.getElementById('contactModal').style.display = 'none';
	document.body.classList.remove('modal-open');
}

document.addEventListener('DOMContentLoaded', validateForm);