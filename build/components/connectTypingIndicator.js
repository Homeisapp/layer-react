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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * The createTypingIndicator module creates a Wrapped Component;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * it takes in a Client (typically via the LayerProvider)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * and a conversationId (the Conversation the user is currently viewing)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * and adds `typing` and `paused` properties to the Wrapped Component
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * allowing for the component to render a typing indicator.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Exports a function that takes as input a Component to wrap and returns a new Component.
 * The new Component takes as input a client and conversationId, and adds `typing` and `paused`
 * properties to the component that was passed as input, allowing for the component to render a typing indicator.
 *
 * @method connectTypingIndicator
 * @return {Function}      Call this function to create a wrapped component which can be
 *                         be rendered and which passes typing indicator data to its child.
 */
exports.default = function () {
  return (
    /**
     * Takes a Component, and wraps it with a TypingIndicatorContainer (makes the
     * input Component a child Component of the TypingIndicatorContainer) and
     * passes in typing indicator data to the wrapped Component in the form of properties.
     *
     * @method
     * @param  {Component} ComposedComponent   The Component to wrap
     * @return {TypingIndicatorContainer}      A Component that wraps the specified Component
     */
    function (ComposedComponent) {
      var _class, _temp;

      return (
        /**
         * The TypingIndicatorContainer listens for typing indicator events from the client that
         * relate to the current conversation, and passes typing and paused properties into its child
         * component.
         *
         * @class TypingIndicatorContainer
         * @extends {react.Component}
         */
        _temp = _class = function (_Component) {
          _inherits(TypingIndicatorContainer, _Component);

          function TypingIndicatorContainer(props, context) {
            _classCallCheck(this, TypingIndicatorContainer);

            var _this = _possibleConstructorReturn(this, (TypingIndicatorContainer.__proto__ || Object.getPrototypeOf(TypingIndicatorContainer)).call(this, props, context));

            _this.onTypingIndicatorChange = function (_ref) {
              var conversationId = _ref.conversationId,
                  typing = _ref.typing,
                  paused = _ref.paused;

              if (conversationId === _this.props.conversationId) {
                _this.setState({
                  typing: typing,
                  paused: paused
                });
              }
            };

            _this.client = props.client || context.client;

            _this.state = {
              typing: [],
              paused: []
            };
            return _this;
          }

          // Necessary in order to grab client out of the context.
          // TODO: May want to rename to layerClient to avoid conflicts.


          _createClass(TypingIndicatorContainer, [{
            key: 'componentWillMount',
            value: function componentWillMount() {
              this.client.on('typing-indicator-change', this.onTypingIndicatorChange);
            }
          }, {
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
              if (this.props.conversationId !== nextProps.conversationId) {
                this.setState({
                  typing: [],
                  paused: []
                });
              }
            }
          }, {
            key: 'render',
            value: function render() {
              return _react2.default.createElement(ComposedComponent, _extends({}, this.props, this.state));
            }
          }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
              this.client.off('typing-indicator-change', this.onTypingIndicatorChange);
            }
          }]);

          return TypingIndicatorContainer;
        }(_react.Component), _class.propTypes = {
          client: _propTypes2.default.object,
          conversationId: _propTypes2.default.string }, _class.contextTypes = {
          client: _propTypes2.default.object
        }, _temp
      );
    }
  );
};