import './scss/styles.scss';

import { ApiWebLarek } from './components/apiWebLarek';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { DataManager, CatalogChangeEvent } from './components/dataManager';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/common/modal';
import { Card } from './components/Card';
import { Basket } from './components/basket';
import { PaymentSuccess } from './components/success';
import { FormContact } from './components/formContact';
import { FormPayment } from './components/formPayment';
import { IFormOrder, IFormUser, IOrder, ICard } from './types';

const events = new EventEmitter();
const api = new ApiWebLarek(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

//все шаблоны
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

//модель данных приложения
const appData = new DataManager({}, events);

//Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderDelivery = new FormPayment(cloneTemplate(orderTemplate), events, {
	onClick: (event: Event) => events.emit('payment:toggle', event.target),
});
const orderContact = new FormContact(cloneTemplate(contactsTemplate), events);

export const PaymentType: { [key: string]: string } = {
	card: 'online',
	cash: 'cash',
};

//Обработка событий
api
	.getCatalog()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.log(err);
	});

events.on<CatalogChangeEvent>('product:change', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(catalogTemplate), {
			onClick: () => events.emit('preview:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('preview:select', (item: ICard) => {
	appData.setPreview(item);
});

events.on('preview:change', (item: ICard) => {
	const card = new Card(cloneTemplate(previewTemplate), {
		onClick: () => {
			events.emit('product:toggle', item);
			card.buttonText =
				appData.basket.indexOf(item) < 0 ? 'Купить' : 'Удалить из корзины';
		},
	});
	modal.render({
		content: card.render({
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			category: item.category,
			buttonText:
				appData.basket.indexOf(item) < 0 ? 'Купить' : 'Удалить из корзины',
		}),
	});
});

events.on('product:toggle', (item: ICard) => {
	if (appData.basket.indexOf(item) < 0) {
		events.emit('card:add', item);
	} else {
		events.emit('card:delete', item);
	}
});

events.on('card:add', (item: ICard) => {
	appData.addItemToBasket(item);
});

events.on('card:delete', (item: ICard) => appData.removeItemFromBasket(item));

events.on('basket:change', (items: ICard[]) => {
	basket.itemsList = items.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('card:delete', item);
			},
		});
		return card.render({
			index: (index + 1).toString(),
			title: item.title,
			price: item.price,
		});
	});
	const total = items.reduce((total, item) => total + item.price, 0);
	basket.totalPrice = total;
	appData.order.total = total;
	basket.selected = total === 0;
});

events.on('counter:change', (item: string[]) => {
	page.counter = appData.basket.length;
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render({}),
	});
});

events.on('order:open', () => {
	modal.render({
		content: orderDelivery.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
	appData.order.items = appData.basket.map((item) => item.id);
});

events.on('payment:toggle', (target: HTMLElement) => {
	if (!target.classList.contains('button_alt-active')) {
		orderDelivery.toggleButton(target);
		appData.order.payment = PaymentType[target.getAttribute('name')];
		console.log(appData.order);
	}
});

events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address, email, phone } = errors;
	orderDelivery.valid = !payment && !address;
	orderContact.valid = !email && !phone;
	orderDelivery.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	orderContact.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IFormOrder; value: string }) => {
		appData.setInfoDelivery(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IFormUser; value: string }) => {
		appData.setInfoContact(data.field, data.value);
	}
);

events.on('order:validation', () => {
	orderDelivery.valid = true;
});

events.on('contacts:validation', () => {
	orderContact.valid = true;
});

events.on('order:submit', () => {
	modal.render({
		content: orderContact.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	api
		.postOrder(appData.order)
		.then((result) => {
			appData.clearBasket();
			appData.clearOrder();

			const success = new PaymentSuccess(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			success.totalPrice = result.total.toString();

			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});
