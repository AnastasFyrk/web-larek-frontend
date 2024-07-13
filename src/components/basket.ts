import { Component } from './base/component';
import { EventEmitter } from './base/events';
import { ensureElement, createElement } from './../utils/utils';

interface IBasket {
	itemsList: string[];
	totalPrice: number | null;
}

export class Basket extends Component<IBasket> {
	protected _itemsList: HTMLElement;
	protected _totalPrice: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._itemsList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this._totalPrice = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.itemsList = [];
		this._button.disabled = true;
	}

	set itemsList(items: HTMLElement[]) {
		if (items.length) {
			this._itemsList.replaceChildren(...items);
		} else {
			this._itemsList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set selected(isDisabled: boolean) {
		this._button.disabled = isDisabled;
	}

	set totalPrice(total: number) {
		this.setText(this._totalPrice, `${total}` + ' синапсисов');
	}
}
