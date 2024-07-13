import { EventEmitter } from './base/events';
import { IFormUser } from '../types';
import { Form } from './common/form';

export class FormContact extends Form<IFormUser> {
	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container, events);
	}

	set email(value: string) {
		const emailInput = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;
		if (emailInput) {
			emailInput.value = value;
		}
	}

	set phone(value: string) {
		const phoneInput = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
		if (phoneInput) {
			phoneInput.value = value;
		}
	}
}
