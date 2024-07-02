//карточка товара
export interface ICard {
    _id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

//список карточек на странице
export interface ICardList {
    cards: ICard[];
    preview: string | null;
}

//карточка в корзине
export type TBasket = Pick<ICard,  'title' | 'price'>;

//Форма способа оплаты и адреса
export interface IFormOrder {
    address: string;
    payment: string;
}

//Форма контактных данных пользователя
export interface IFormUser {
    email: string;
    phone: string;
}

//Проверка валидации формы оплаты и адреса
export interface IFormOrderValidate {
    checkValidation(data: Record<keyof IFormOrder, string>): boolean;
}

//Проверка валидации формы контактных данных
export interface IFormUserValidate {
    checkValidation(data: Record<keyof IFormUser, string>): boolean;
}

//Информация о заказе
export interface IOrder {
    items: string[];
    total: number;
}