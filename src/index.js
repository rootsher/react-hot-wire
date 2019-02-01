import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

export const createInstance = () => {
	const Context = React.createContext();

	function find(services, dependencies) {
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

	function wire(Component, dependencies) {
		return props => (
			<Context.Consumer>
				{services => <Component {...find(services || {}, dependencies)} {...props} />}
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
		wire,
		Service,
	};
};

export const {Provider, wire, Service} = createInstance();
