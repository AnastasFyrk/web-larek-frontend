//карточка товара
export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    buttonText?: string;
    index: string;
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
export type FormErrors = Partial<Record<keyof IOrder, string>>;
//Информация о заказе
export interface IOrder extends IFormOrder, IFormUser {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    items: string[];
    total: number;
}

export interface IActions {
    onClick : (event: MouseEvent)=> void;
}