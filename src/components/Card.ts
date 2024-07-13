import { Component } from './base/component';
import { IActions, ICard } from '../types';
import { ensureElement } from '../utils/utils';

export const CardCategory: { [key: string]: string } = {
	'софт-скил': 'card__category_soft',
	'хард-скил': 'card__category_hard',
	'дополнительное': 'card__category_additional',
	'кнопка': 'card__category_button',
	'другое': 'card__category_other',
};

export class Card<T> extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _buttonText: string;
	protected _description?: HTMLElement;
	protected _index?: HTMLElement;
	protected _category?: HTMLElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = container.querySelector('.card__image');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button');
		this._description = container.querySelector('.card__text');
		this._index = container.querySelector('.basket__item-index');
		this._category = container.querySelector('.card__category');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title() {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this._button, true);
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}

	buttonDisabled(state: boolean) {
		if (this._button) {
			if (state) {
				this._button.setAttribute('disabled', 'disabled');
			} else {
				this._button.removeAttribute('disabled');
			}
		}
	}

	set buttonText(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set index(value: string) {
		this._index.textContent = value;
	}

	get index(): string {
		return this._index.textContent || '';
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add(CardCategory[value]);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}
}
