# react-hot-wire

## usage

* `services/language.service.js`

```js
export default class LanguageService {
    _currentLanguage = 'en';
    
	currentLanguage() {
		return this._currentLanguage;
	}
}
```

* `index.js`

```js
import ReactDOM from 'react-dom';
import HotWire from 'hot-wire';
import { Provider } from 'react-hot-wire';
import LanguageService from 'services/language.service';

const container = new HotWire().wire({
    services: {
        languageService: {
            class: LanguageService,
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

* `components/language.component.js`

```js
import React, { PureComponent } from 'react';
import { wire } from 'react-hot-wire';

export class Language extends PureComponent {
    render() {
        return this.props.languageService.currentLanguage();
    }
};

export default wire(Language, ['languageService']);
```

## advanced usage

### listen for changes

* `hoc/language.hoc.js`

```js
import React, { PureComponent } from 'react';
import { wire } from 'react-hot-wire';

export default function (Component) {
    return class LanguageHOC extends PureComponent {
        componentDidMount() {
            this._unregisterListener = this.props.languageService.addChangeListener(
                () => this.forceUpdate()
            );
        }

        render() {
            return (
                <Component
                    lang={this.props.languageService.currentLanguage()}
                    {...this.props}
                />
            );
        }

        componentWillUnmount() {
            this._unregisterListener();
        }
    };
};

export default wire(LanguageHOC, ['languageService']);
```

* `components/language.component.js`

```js
import React, { PureComponent } from 'react';
import LanguageHOC from 'hoc/language.hoc';

export class Language extends PureComponent {
    render() {
        return this.props.lang;
    }
};

export default LanguageHOC(Language);
```

* and small modification in `services/language.service.js` (extends for a `Service`)

```js
import { Service } from 'react-hot-wire';

export default class LanguageService extends Service {
    _currentLanguage = 'en';
    
    currentLanguage() {
        return this._currentLanguage;
    }
}
```
