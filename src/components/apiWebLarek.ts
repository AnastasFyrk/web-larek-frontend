import { Api, ApiListResponse } from './base/api';
import { ICard, IOrder, IOrderResult } from '../types';

export interface IApiWebLarek {
	getCatalog: () => Promise<ICard[]>;
	getCard: (id: string) => Promise<ICard>;
	postOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class ApiWebLarek extends Api implements IApiWebLarek {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCatalog(): Promise<ICard[]> {
		return this.get(`/product`).then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getCard(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	postOrder(order: IOrder): Promise<IOrderResult> {
		return this.post(`/order`, order).then((data: IOrderResult) => data);
	}
}
