import React from 'react';

export const createInstance = () => {
    const Context = React.createContext({});

    function find(dependencies, services) {
        return dependencies.reduce((result, dependency) => {
            result[dependency] = services[dependency];

            return result;
        }, {});
    }

    function Provider({ services, children }) {
        return <Context.Provider value={services}>{children}</Context.Provider>;
    }

    function Wire({ services }) {
        return <Context.Consumer>{_services => this.props.render(find(services, _services))}</Context.Consumer>;
    }

    function wire(dependencies, Component) {
        return props => (
            <Context.Consumer>
                {services => <Component {...find(dependencies, services)} {...props} />}
            </Context.Consumer>
        );
    }

    class Service {
        _changeListeners = [];

        addChangeListener(changeListener) {
            this._changeListeners.push(changeListener);

            return () => this._unregisterListener(changeListener);
        }

        runChangeListeners() {
            this._changeListeners.forEach(listener => listener());
        }

        _unregisterListener(changeListener) {
            this._changeListeners = this._changeListeners.filter(listener => listener !== changeListener);
        }
    }

    return {
        Provider,
        Wire,
        wire,
        Service,
    };
};

export const { Provider, Wire, wire, Service } = createInstance();
