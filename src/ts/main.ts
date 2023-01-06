const navToggle: HTMLButtonElement = document.querySelector('.toggle-button');

const handleNavigationToggle = (e: Event) => {
	const button: HTMLButtonElement = e.target as HTMLButtonElement;
	const wasExpanded: boolean = button.getAttribute('aria-expanded') === 'true';
	const targetNavID: string = button.getAttribute('aria-controls');
	const targetNav: HTMLElement = document.querySelector(`#${targetNavID}`);
	const buttonLabel: string = !wasExpanded ? 'Close menu' : 'Open menu';

	button.setAttribute('aria-expanded', (!wasExpanded).toString());
	button.setAttribute('aria-label', buttonLabel);
	targetNav?.toggleAttribute('data-expanded', !wasExpanded);
	document.body.classList.toggle('mobile-nav-dropshadow', !wasExpanded);
};

navToggle.addEventListener('click', handleNavigationToggle);
