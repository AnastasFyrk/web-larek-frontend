import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { IFormOrder, IActions } from '../types';
import { Form } from './common/form';

export class FormPayment extends Form<IFormOrder> {
	protected _online: HTMLButtonElement;
	protected _cash: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents, action?: IActions) {
		super(container, events);

		this._online = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			this.container
		);
		this._cash = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			this.container
		);
		this._online.classList.add('button_alt-active');

		if (action?.onClick) {
			this._online.addEventListener('click', action.onClick);
			this._cash.addEventListener('click', action.onClick);
		}
	}

	toggleButton(target: HTMLElement) {
		this._online.classList.toggle('button_alt-active');
		this._cash.classList.toggle('button_alt-active');
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
