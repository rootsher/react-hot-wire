import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

export const createInstance = () => {
	const Context = React.createContext();

	function find(dependencies, services) {
		return dependencies.reduce((result, dependency) => {
			result[dependency] = services[dependency];

			return result;
		}, {});
	}

	class Provider extends PureComponent {
		static propTypes = {
			services: PropTypes.object.isRequired,
			children: PropTypes.oneOfType([
				PropTypes.arrayOf(PropTypes.node),
				PropTypes.node,
				PropTypes.func,
			]),
		};

		render() {
			return (
				<Context.Provider value={this.props.services}>
					{this.props.children}
				</Context.Provider>
			);
		}
	}

	class Wire extends PureComponent {
        static propTypes = {
            services: PropTypes.arrayOf(PropTypes.string),
            render: PropTypes.func.isRequired,
        };

        render() {
            return (
                <Context.Consumer>
                    {services => this.props.render(find(this.props.services, services))}
                </Context.Consumer>
            );
        }
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
			this._changeListeners = this._changeListeners.filter(listener => (listener !== changeListener));
		}
	}

	return {
		Provider,
        Wire,
		wire,
		Service,
	};
};

export const {Provider, Wire, wire, Service} = createInstance();
