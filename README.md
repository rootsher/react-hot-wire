# react-hot-wire

[![npm version](https://img.shields.io/npm/v/react-hot-wire.svg)](https://www.npmjs.com/package/react-hot-wire)
[![npm downloads](https://img.shields.io/npm/dm/react-hot-wire.svg)](https://www.npmjs.com/package/react-hot-wire)
[![GitHub issues](https://img.shields.io/github/issues/rootsher/react-hot-wire.svg)](https://github.com/rootsher/react-hot-wire/issues)
[![GitHub PRs](https://img.shields.io/github/issues-pr/rootsher/react-async-action.svg)](https://github.com/rootsher/react-hot-wire/pulls)
[![ISC license](https://img.shields.io/npm/l/react-hot-wire.svg)](https://opensource.org/licenses/ISC)

## motivation

I needed a React tool that would allow me to separate the view layer with other application layers. I wanted to be able to create services that are completely separated, that know nothing about the view. When I succeeded, there was a problem with injecting these services into individual components (at any application level). For this purpose a `react-hot-wire` was created. It allows to define what services a given component needs, and enables convenient injection. Additionally, the component can react to changes in services by plugging its own listener into the service cycle.

## installation

### main package (to integrate with React)

```bash
$ npm install --save react-hot-wire
```

### main dependency (to resolve DI container)

```bash
$ npm install --save hot-wire
```

## simple usage

First we should define the service(s) to be solved by the `hot-wire` module.

Example service:

```js
// services/language.service.js

export default class LanguageService {
    _currentLanguage = 'en';
    
    currentLanguage() {
        return this._currentLanguage;
    }
}
```

Then by using `hot-wire` we create the instances of the services and inject dependencies into the appropriate places (I suggest you see the `hot-wire` tests). Then we pass the solved services to `Provider`:

```js
// index.js

import ReactDOM from 'react-dom';
import HotWire from 'hot-wire';
import { Provider } from 'react-hot-wire';
import LanguageService from 'services/language.service';

const container = new HotWire().wire({
    services: {
    	// this is example usage, we can store definitions whenever we want
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

Now you would like to inject into a component, at any level, an instance of a selected service. With help comes the `wire` function, which in arguments accepts the component that is to have the service injected, and the array of services to be set in `props`:

```js
// components/language.component.js

import React, { PureComponent } from 'react';
import { wire } from 'react-hot-wire';

export class Language extends PureComponent {
    render() {
        return this.props.languageService.currentLanguage();
    }
};

export default wire(Language, ['languageService']);
```

Now we have injected the selected service into the component, and we can take full advantage of its capabilities. As the service was injected by props, we have the possibility of convenient component testing, substitution of this service, etc.

## advanced usage

### listening to changes

```js
// hoc/language.hoc.js

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

```js
// components/language.component.js

import React, { PureComponent } from 'react';
import LanguageHOC from 'hoc/language.hoc';

export class Language extends PureComponent {
    render() {
        return this.props.lang;
    }
};

export default LanguageHOC(Language);
```

* and small modification in the example service (extends for a `Service`)

```js
// services/language.service.js

import { Service } from 'react-hot-wire';

export default class LanguageService extends Service {
    _currentLanguage = 'en';
    
    currentLanguage() {
        return this._currentLanguage;
    }
}
```
