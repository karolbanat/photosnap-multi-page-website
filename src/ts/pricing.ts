const switchButton: HTMLButtonElement | null = document.querySelector('#pricing-switch-button');
const switchMonthlyLabel: HTMLElement | null = document.querySelector('#monthly-label');
const switchYearlyLabel: HTMLElement | null = document.querySelector('#yearly-label');

const basicPriceElement: HTMLElement | null = document.querySelector('#basic-plan-price');
const proPriceElement: HTMLElement | null = document.querySelector('#pro-plan-price');
const businessPriceElement: HTMLElement | null = document.querySelector('#business-plan-price');
const frequencyLabels: NodeListOf<HTMLElement> = document.querySelectorAll('.plan-card__frequency');

const pricings: Pricing = {
	basic: {
		monthly: 19.0,
		yearly: 190.0,
	},
	pro: {
		monthly: 39.0,
		yearly: 390.0,
	},
	business: {
		monthly: 99.0,
		yearly: 990.0,
	},
};

const handlePricingSwitch = (e: Event): void => {
	const button: HTMLButtonElement = e.target as HTMLButtonElement;
	const prevSwitchState: boolean = button.getAttribute('aria-checked') === 'true';

	/*  
    If previously switch was OFF, it was set to monthly billing, so new will be yearly.
    If previously switch was ON, it was set to yearly billing, so new will be monthly.
    */
	const newFrequency: Frequencies = prevSwitchState ? 'monthly' : 'yearly';

	/* Set switch elements attributes */
	button.setAttribute('aria-checked', (!prevSwitchState).toString());
	switchMonthlyLabel?.setAttribute('data-active', prevSwitchState.toString());
	switchYearlyLabel?.setAttribute('data-active', (!prevSwitchState).toString());

	/* Set new prices */
	basicPriceElement.innerText = `$${pricings.basic[newFrequency].toFixed(2)}`;
	proPriceElement.innerText = `$${pricings.pro[newFrequency].toFixed(2)}`;
	businessPriceElement.innerText = `$${pricings.business[newFrequency].toFixed(2)}`;

	/* Set new label under price. Slice method removes 'ly' from the end of period name */
	frequencyLabels.forEach(label => (label.innerText = `per ${newFrequency.slice(0, -2)}`));
};

switchButton?.addEventListener('click', handlePricingSwitch);

/* types */
type Billing = {
	monthly: number;
	yearly: number;
};

type Frequencies = keyof Billing;

type Pricing = {
	basic: Billing;
	pro: Billing;
	business: Billing;
};
/* types end */
