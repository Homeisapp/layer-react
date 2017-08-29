import { Component, Children } from 'react';
import PropTypes from 'prop-types';
/**
 * This class uses React's childContexts to propagate the client property to all
 * subcomponents within this component's subtree.  Subcomponents access
 * the client property via `this.context.client`.
 *
 * This component expects only a single subcomponent, which in turn can have many subcomponents.
 */
export default class LayerProvider extends Component {

  static propTypes = {
    client: PropTypes.object.isRequired,
    children: PropTypes.element,
  }

  static childContextTypes = {
    client: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.client = props.client;
  }

  getChildContext() {
    return { client: this.client };
  }

  render() {
    let { children } = this.props;

    if (typeof children === 'function') {
      children = children();
    }

    return Children.only(children);
  }
}
