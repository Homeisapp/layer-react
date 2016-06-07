# Layer React
[![npm version](http://img.shields.io/npm/v/layer-react.svg)](https://npmjs.org/package/layer-react)

This library is the glue between your [React](http://facebook.github.io/react/) App and the [Layer WebSDK](https://github.com/layerhq/layer-websdk/).

## Disclaimer

This project is in Beta, no claims are made of the production-readiness of this project.  We encourage you to provide feedback and pull requests to this project.  Please feel free to use [Github's Issues](https://github.com/layerhq/layer-react/issues) to submit

* Bug reports
* Compliments
* Proposals adjustments to the architecture that are more consistent with the philosophy of a Flux architecture or that work with a broader range of Flux implementations.

Our emphasis as an organization has not been on mastery of React architectures, feedback is very much appreciated.

## Overview

It provides an interface to subscribe to both local and remote changes in any Queryable Layer data.

`connectQuery` creates a [higher order component](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) from `WrappedComponent` that receives updates to its props whenever the queries built in `getQueries` return results.

If you were to compare this and the Layer WebSDK to Flux: Queries act as Flux stores, `Layer.Client` acts as a dispatcher, and Layer WebSDK methods act as actions.

Queries allow you to subscribe to changes in the `Layer.Client`'s data. All Layer WebSDK methods are asynchronous and optimistic updates are received by subscribing queries.

For example: `conversation.createMessage('test').send()` will trigger an optimistic update in any query that subscribes to that conversation's messages. `WrappedComponent` (defined below) will immediately receive an update to its props. When the server responds with the created message, it's id will be set and the `WrappedComponent` will receive another update to its props.

## Installation

    npm install --save layer-sdk layer-react

## API

### `<LayerReact.LayerProvider client/>`
Injects the Layer client into its child component hierarchy allowing `connectQuery` and `connectTypingIndicator` to reference the Layer client.  Using React's `getChildContext()` method, this component insures that every subcomponent at any depth of its subtree will be able to access the client using `this.context.client`.

It is not required to use LayerProvider as part of a layer-react project; this is primarily a convenience method to simplify propagating the Client to multiple components that depend upon that property.

#### Props
* `client`: (Layer Client): An instance of the Layer client.
* `children`: (ReactElement)

#### Usage
```javascript
import ReactDOM from 'react-dom';
import { LayerProvider } from 'layer-react';
import Messenger from './components/Messenger';

ReactDOM.render(
  <LayerProvider client={client}>
    <Messenger/>
  </LayerProvider>
);
```

The Messenger component and all of its children will now have a client property.

### `connectQuery`
The connectQuery module creates a Wrapped Component; it takes in a specification for the Queries that the Wrapped Component will need, and passes the Query data as properties into the Wrapped Component.

```javascript
connectQuery([getInitialQueryParams]: function | object, getQueries: function)(WrappedComponent: ReactClass): ReactClass
```

##### `getInitialQueryParams(props: object): object`
Initialize query params for the query container inside this function. Return an object with the initial query parameter key value pairs. If you do not require props from the container's parent component, you may pass an object to `connectQuery` instead.

##### `getQueries(props: object, queryParams: object): object`
This method is called every time the container's props or queryParams change. Return an object of the following form to map query results to props which will then be passed into the `WrappedComponent`.

```javascript
{
  propName: QueryBuilder
}
```

#### Usage

```javascript
import { connectQuery } from 'layer-react';

function getInitialQueryParams (props) {
  return {
    paginationWindow: props.startingPaginationWindow || 100
  };
}

function getQueries(props, queryParams) {
  return {
    conversations: QueryBuilder.conversations().paginationWindow(queryParams.paginationWindow)
  };
}

var ConversationListContainer = connectQuery(getInitialQueryParams, getQueries)(ConversationList);

...

render() {
  return <ConversationListContainer client={client}/>;
}
```

#### Usage as ES6 Decorator

```javascript
import { connectQuery } from 'layer-react';

@connectQuery(getInitialQueryParams, getQueries)
class ConversationList extends Component {
  render() {
    ...
  }
}

...

render() {
  return <ConversationList client={client}/>;
}
```

#### WrappedComponent Props
The properties passed to WrappedComponent are:

* `this.props[<propName>]`
The results of each query will be mapped according to the object returned by the query function in the component's QueryContainer.

* `this.props.query.queryParams`
`queryParams` contains the set of parameters that was used to fetch the current set of props. Similar to React's `this.state`.

* `this.props.query.setQueryParams`

```javascript
setQueryParams(nextQueryParams: function|object, [function callback])
```

Performs a shallow merge of nextQueryParams into current queryParams. This is used to update the query parameters used in the component's QueryContainer. The API for this method matches React's [setState](https://facebook.github.io/react/docs/component-api.html#setstate).

#### Usage

```javascript
class ConversationList extends React.Component {
  onLoadMoreMessages = () => {
    this.props.query.setQueryParams({
      paginationWindow: this.props.query.queryParams.paginationWindow + 100
    });
  }

  renderConversationItem(conversation) {
    return <li key={conversation.id}>{conversation.id}</li>
  }

  render() {
    render (
      <InfiniteScrollList className='conversation-list' onLoadMore={this.onLoadMoreMessages}>
        {this.props.conversations.map(this.renderConversationItem)}
      </InfiniteScrollList>
    );

  }
}
```

```javascript
<ConversationList
  client={client}
  startingPaginationWindow={200}/>
```

### `createTypingIndicator`

The createTypingIndicator module creates a Wrapped Component; it takes in a Client (typically via the LayerProvider) and a conversationId (the Conversation the user is currently viewing) and adds `typing` and `paused` properties to the Wrapped Component allowing for the component to render a typing indicator.

```javascript
connectTypingIndicator()(WrappedComponent: ReactClass): ReactClass
```

#### Usage

```javascript
import { connectTypingIndicator } from 'layer-react';

var TypingIndicatorContainer = connectTypingIndicator(TypingIndicator);
```

#### Usage as ES6 Decorator

```javascript
import { connectTypingIndicator } from 'layer-react';

@connectTypingIndicator()
class MyTypingIndicator extends Component {
  render() {
    ...
  }
}
```

#### WrappedComponent Props
The properties passed to WrappedComponent are:

* `this.props.typing`: An array of user ids that represents who is currently typing.

* `this.props.paused`: An array of user ids that represents who have currently paused typing.

#### Usage

```javascript
import React, { Component, PropTypes } from 'react';
import { connectTypingIndicator } from 'layer-react';

class TypingIndicator extends Component {

  getTypingText(users, typingIds) {
    const userNames = typingIds.map((id) => users[id].first_name).join(', ');

    if (typingIds.length == 1) {
      return userNames + ' is typing.'
    } else if (typingIds.length > 1) {
      return userNames + ' are typing.'
    } else {
      return '';
    }
  }

  render() {
    const typingText = this.getTypingText(this.props.users, this.props.typing);

    return (
      <div className='typing-indicator-panel'>{typingText}</div>
    );

  }
}

export default connectTypingIndicator(TypingIndicator);
```

## Credits

Layer React's API inspiration comes from Dan Abramov's [React Redux](https://github.com/rackt/react-redux) library.

## Contributing

Layer React is an Open Source project maintained by Layer, inc. Feedback and contributions are always welcome and the maintainers try to process patches as quickly as possible. Feel free to open up a Pull Request or Issue on Github.

### Building from Source

In order to build and test your code run the following command:

    npm run build

### Code style

We enforce strict code style rules that conform to [Airbnb Style Guide](https://github.com/airbnb/javascript). Make sure you run `eslint` before submitting a Pull Request:

    npm run lint

## Contact

Layer React was developed in San Francisco by the Layer team. If you have any technical questions or concerns about this project feel free to reach out to engineers responsible for the development:

* [Michael Kantor](mailto:michael@layer.com)
* [Nil Gradisnik](mailto:nil@layer.com)
