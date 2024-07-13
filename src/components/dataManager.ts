import { EventEmitter, IEvents } from './base/events';
import { Model } from './base/model';
import { ICard, IFormOrder, IFormUser, IOrder, FormErrors } from '../types';

export interface IDataManager {
	catalog: ICard[];
	preview: string | null;
	basket: ICard[];
	order: IOrder | null;
	payment: IFormOrder | null;
	contact: IFormUser | null;
	events: EventEmitter;
}

export type CatalogChangeEvent = {
	catalog: ICard[];
};

export class DataManager extends Model<IDataManager> {
	catalog: ICard[];
	basket: ICard[] = [];
	order: IOrder = {
		payment: 'online',
		address: '',
		email: '',
		phone: '',
		items: [],
		total: 0,
	};
	preview: string | null;
	formErrors: FormErrors = {};
	events: IEvents;

	setCatalog(items: ICard[]) {
		this.catalog = items;
		this.emitChanges('product:change', { catalog: this.catalog });
	}

	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges('preview:change', item);
	}

	addItemToBasket(item: ICard) {
		if (this.basket.indexOf(item) < 0) {
			this.basket.push(item);
			this.updateBasket();
		}
	}

	removeItemFromBasket(item: ICard) {
		this.basket = this.basket.filter((i) => i != item);
		this.updateBasket();
	}

	clearBasket() {
		this.basket = [];
		this.updateBasket();
	}

	updateBasket() {
		this.emitChanges('basket:change', this.basket);
		this.emitChanges('counter:change', this.basket);
	}

	setInfoDelivery(field: keyof IFormOrder, value: string) {
		this.order[field] = value;

		if (this.FormOrderValidate()) {
			this.events.emit('order:validation', this.order);
		}
	}

	setInfoContact(field: keyof IFormUser, value: string) {
		this.order[field] = value;

		if (this.FormUserValidate()) {
			this.events.emit('contacts:validation', this.order);
		}
	}

	clearOrder() {
		this.order = {
			payment: 'online',
			address: '',
			email: '',
			phone: '',
			items: [],
			total: 0,
		};
	}

	FormOrderValidate() {
		const errors: typeof this.formErrors = {};

		if (!this.order.payment) {
			errors.payment = 'Необходимо указать тип оплаты';
		}

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	FormUserValidate() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
