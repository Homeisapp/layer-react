'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Connects your Queries to your React Component properties.
 * In the example below, a ConversationList is passed in,
 * and a ConversationListContainer that contains a child of ConversationList
 * and which provides ConversationList with properties provided
 * by the queries.
 *
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
 *
 * @method connectQuery
 * @param  {Object|Function} getInitialQueryParams   Initial properties for all queries
 * @param  {Function} getQueries          A function that returns a hash of QueryBuilders
 * @param {Object} getQueries.props       All properties passed in from the parent of this component
 * @param {Object} getQueries.queryParams Initial property values as specified by getInitialQueryParams
 * @param {Object} getQueries.return      A hash of Query instances
 * @return {Function}                     Call this function to create a wrapped component which can be
 *                                        be rendered and which passes query data to your component.
 */
exports.default = function () {
  var getInitialQueryParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var getQueries = arguments[1];
  return (
    /**
     * Takes a Component, and wraps it with a QueryContainer (makes the
     * input Component a child Component of the QueryContainer) and
     * passes in Query data to the wrapped Component in the form of properties.
     * Note that the property names will match the keys returned by getQueries().
     *
     * @method
     * @param  {Component} ComposedComponent   The Component to wrap
     * @return {QueryContainer}                A Component that wraps the specified Component
     */
    function (ComposedComponent) {
      var _class, _temp, _initialiseProps;

      return (
        /**
         * A Component which manages a set of Queries and passes the output
         * of those queries into its child component.
         *
         * @class QueryContainer
         * @extends {react.Component}
         */
        _temp = _class = function (_Component) {
          _inherits(QueryContainer, _Component);

          /**
           * Call getQueries to get our QueryBuilder instances, and populate
           * state with the Query Parameters and Query Results (initially results
           * are all [])
           *
           * @method constructor
           */
          function QueryContainer(props, context) {
            _classCallCheck(this, QueryContainer);

            var _this = _possibleConstructorReturn(this, (QueryContainer.__proto__ || Object.getPrototypeOf(QueryContainer)).call(this, props, context));

            _initialiseProps.call(_this);

            _this.client = props.client || context.client;
            _this.queries = {};
            _this.callbacks = {};

            var queryParams = typeof getInitialQueryParams === 'function' ? getInitialQueryParams(props) : getInitialQueryParams;

            var queryBuilders = getQueries(props, queryParams);

            // Set initial queryResults to empty arrays.
            var queryResults = Object.keys(queryBuilders).reduce(function (obj, key) {
              return _extends({}, obj, _defineProperty({}, key, []));
            }, {});

            _this.state = {
              queryResults: queryResults,
              queryParams: queryParams
            };
            return _this;
          }

          /**
           * On mounting (and once the client is ready) call _updateQueries
           */


          // Necessary in order to grab client out of the context.
          // TODO: May want to rename to layerClient to avoid conflicts.


          _createClass(QueryContainer, [{
            key: 'componentWillMount',
            value: function componentWillMount() {
              this.client.on('ready', this._onClientReady);

              if (this.client.isReady) {
                this._updateQueries(this.props, this.state.queryParams);
              }
            }
          }, {
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
              this._updateQueries(nextProps, this.state.queryParams);
            }

            /**
             * Generate the this.queries object to contain
             * layer.Query instances based on the getQueries()
             * QueryBuilders.  If the query already exists, update
             * it rather than replace it.
             *
             * @method _updateQueries
             * @private
             * @param  {Object}   props       Component properties
             * @param  {Object}   queryParams Query properties
             * @param  {Function} callback
             */


            /**
             * Any time the Query's data changes,
             * update this.state.queryResults[queryName]
             * with the new results.  Setting state will cause
             * the render method to pass the updated query data
             * to its ComposedComponent.
             *
             * @method _onQueryChange
             * @param  {string} queryName    - Name of the query (name comes from keys returned by getQueries())
             * @param  {Object[]} newResults - Array of query results
             */

          }, {
            key: 'render',


            /**
             * Pass any properties provided to the QueryContainer
             * to its child container, along with the query results,
             * query parameters, and a setQueryParams function.
             *
             * @method render
             */
            value: function render() {
              var _this2 = this;

              var _state = this.state,
                  queryParams = _state.queryParams,
                  queryResults = _state.queryResults;


              var queryIds = {};
              Object.keys(this.queries).forEach(function (key) {
                queryIds[key] = _this2.queries[key].id;
              });

              var passedProps = _extends({}, queryResults, {
                query: {
                  queryParams: queryParams,
                  setQueryParams: this.setQueryParams,
                  queryIds: queryIds
                }
              });

              return _react2.default.createElement(ComposedComponent, _extends({}, this.props, passedProps));
            }
          }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
              var _this3 = this;

              // When the component unmounts, unsubscribe from all event listeners.
              Object.keys(this.queries).forEach(function (key) {
                var query = _this3.queries[key];
                query.off('change', _this3.callbacks[query.internalId]);
                _this3.client.off('ready', _this3._onClientReady, _this3);
              });
            }
          }]);

          return QueryContainer;
        }(_react.Component), _class.propTypes = {
          client: _propTypes2.default.object }, _class.contextTypes = {
          client: _propTypes2.default.object }, _initialiseProps = function _initialiseProps() {
          var _this4 = this;

          this._onClientReady = function () {
            _this4._updateQueries(_this4.props, _this4.state.queryParams);
          };

          this.setQueryParams = function (nextQueryParams, callback) {
            _this4._updateQueries(_this4.props, nextQueryParams, callback);
          };

          this._updateQueries = function (props, queryParams, callback) {
            var queryBuilders = getQueries(props, queryParams);

            // Remove any queries that no longer exist
            Object.keys(_this4.queries).forEach(function (key) {
              if (!queryBuilders[key]) {
                var query = _this4.queries[key];
                query.off('change', _this4.callbacks[query.internalId]);

                delete _this4.queries[key];
                delete _this4.callbacks[query.internalId];
              }
            });

            // Update existing queries / Create new queries
            Object.keys(queryBuilders).forEach(function (key) {
              var query = _this4.queries[key];
              var builder = queryBuilders[key];

              if (query) {
                query.update(builder.build());
              } else {
                var newQuery = _this4.client.createQuery(builder);

                _this4.queries[key] = newQuery;
                _this4.callbacks[newQuery.internalId] = function () {
                  _this4._onQueryChange(key, newQuery.data);
                };

                newQuery.on('change', _this4.callbacks[newQuery.internalId]);
              }
            });

            _this4.setState({
              queryParams: queryParams
            }, callback);
          };

          this._onQueryChange = function (queryName, newResults) {
            _this4.setState({
              queryResults: _extends({}, _this4.state.queryResults, _defineProperty({}, queryName, newResults))
            });
          };
        }, _temp
      );
    }
  );
};