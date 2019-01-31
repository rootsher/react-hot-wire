# react-hot-wire

## usage

* `services/product.service.js`

```js
export default class ProductService {
	list() {
		return [
			{ id: 1, name: 'product 1' },
			{ id: 2, name: 'product 2' },
			{ id: 3, name: 'product 3' },
		];
	}
}
```

* `index.js`

```js
import ReactDOM from 'react-dom';
import HotWire from 'hot-wire';
import { Provider } from 'react-hot-wire';
import ProductService from './services/product.service';

const container = new HotWire().wire({
    services: {
    	productService: {
    		class: ProductService,
    		public: true,
    	},
    	// other definitions of services here...
    },
});

container.then(services => {
    ReactDOM.render(
        <Provider services={services}>
            {/* application code here */}
        </Provider>,
        document.getElementById('app')
    );
});
```

* `components/product-list.component.js`

```js
import React, { PureComponent } from 'react';
import { wire } from 'react-hot-wire';

export class ProductList extends PureComponent {
    componentDidMount() {
        console.log(this.props.productService.list());
    }

    render() {
        return null;
    }
};

export default wire(ProductList, ['productService']);
```
