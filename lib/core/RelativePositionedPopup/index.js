'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactDom = require('react-dom');

var _FocusJail = require('../../utils/FocusJail');

var _FocusJail2 = _interopRequireDefault(_FocusJail);

var _View = require('../View');

var _View2 = _interopRequireDefault(_View);

var _getBestRelativePlacement = require('../../utils/positioning/getBestRelativePlacement');

var _getBestRelativePlacement2 = _interopRequireDefault(_getBestRelativePlacement);

var _toFixedOffset = require('../../utils/positioning/toFixedOffset');

var _toFixedOffset2 = _interopRequireDefault(_toFixedOffset);

var _styles = require('./styles');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var positions = ['bottom', 'bottom_stretch', 'bottom_left', 'bottom_right', 'left', 'left_top', 'left_bottom', 'right', 'right_top', 'right_bottom', 'top', 'top_stretch', 'top_left', 'top_right'];

var rtlMapping = {
  bottom_right: 'bottom_left',
  bottom_left: 'bottom_right',
  left: 'right',
  left_top: 'right_top',
  left_bottom: 'right_bottom',
  right: 'left',
  right_top: 'left_top',
  right_bottom: 'left_bottom',
  top_left: 'top_right',
  top_right: 'top_left'
};

var getCurrentOrigin = function getCurrentOrigin() {
  var location = window.location;
  var origin = location.origin || location.protocol + '//' + location.host;

  return origin;
};

var isIFrameOfCurrentOrigin = function isIFrameOfCurrentOrigin(iframe) {
  var origin = getCurrentOrigin();
  return !iframe.src || iframe.src.indexOf(origin) === 0;
};

var getDocuments = function getDocuments() {
  var iframes = document.querySelectorAll('iframe');

  var iframeDocuments = (0, _from2.default)(iframes).filter(isIFrameOfCurrentOrigin).map(function (iframe) {
    return iframe.contentDocument;
  });

  return [document].concat(iframeDocuments);
};

var RelativePositionedPopup = function (_Component) {
  (0, _inherits3.default)(RelativePositionedPopup, _Component);

  function RelativePositionedPopup() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, RelativePositionedPopup);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.updatePlacement = function () {
      var hidden = _this.props.hidden;


      if (!hidden) {
        _this.anchorRect = _this.anchorElement.firstChild.getBoundingClientRect();
        _this.popupRect = _this.popupElement.firstChild.getBoundingClientRect();
        var placement = (0, _toFixedOffset2.default)(_this.getBestRelativePlacement(), _this.popupElement);
        _this.setState({
          placement: placement
        });
      }
    }, _this.clickOutsideHandler = function (e) {
      var _this$props = _this.props,
          hidden = _this$props.hidden,
          onClickOutside = _this$props.onClickOutside;


      var isLeftClick = e.which === 1;
      if (onClickOutside && !hidden && isLeftClick) {
        var target = e.target || document.elementFromPoint(e.pageX || e.clientX, e.pageY || e.clientY);
        var inSidePopup = _this.popupElement && _this.popupElement.contains(target);
        if (!inSidePopup) {
          setTimeout(function () {
            onClickOutside();
          }, 0);
        }
      }
    }, _this.getPositions = function () {
      var _this$props2 = _this.props,
          dir = _this$props2.dir,
          positioning = _this$props2.positioning;


      var positions = Array.isArray(positioning) ? positioning : [positioning];

      return dir === 'rtl' ? positions.map(function (position) {
        return rtlMapping[position] || position;
      }) : positions;
    }, _this.getAnchorMargins = function () {
      var _this$props3 = _this.props,
          marginBottom = _this$props3.marginBottom,
          marginLeft = _this$props3.marginLeft,
          marginRight = _this$props3.marginRight,
          marginTop = _this$props3.marginTop;


      return {
        bottom: marginBottom,
        left: marginLeft,
        right: marginRight,
        top: marginTop
      };
    }, _this.getBestRelativePlacement = function () {
      var viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      var anchorRect = {
        top: _this.anchorRect.top,
        left: _this.anchorRect.left,
        width: _this.anchorRect.width,
        height: _this.anchorRect.height,
        margins: _this.getAnchorMargins()
      };

      var centerPoint = _this.props.centerPoint;


      var target = {
        top: _this.popupRect.top,
        left: _this.popupRect.left,
        width: _this.popupRect.width,
        height: _this.popupRect.height
      };

      var bestPlacement = (0, _getBestRelativePlacement2.default)({
        positions: _this.getPositions(),
        anchor: anchorRect,
        centerPoint: centerPoint,
        target: target,
        viewport: viewport
      });

      return bestPlacement;
    }, _this.onTab = function (e) {
      _this.tabJail && _this.tabJail.onTab(e);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  RelativePositionedPopup.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    window.addEventListener('resize', this.updatePlacement);
    window.addEventListener('scroll', this.updatePlacement, true);

    getDocuments().forEach(function (doc) {
      doc.addEventListener('click', _this2.clickOutsideHandler, true);
    });
  };

  RelativePositionedPopup.prototype.componentWillUnmount = function componentWillUnmount() {
    var _this3 = this;

    window.removeEventListener('resize', this.updatePlacement);
    window.removeEventListener('scroll', this.updatePlacement, true);

    getDocuments().forEach(function (doc) {
      doc.removeEventListener('click', _this3.clickOutsideHandler, true);
    });
  };

  RelativePositionedPopup.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var _this4 = this;

    var _props = this.props,
        hidden = _props.hidden,
        trapFocus = _props.trapFocus;


    if (hidden && !nextProps.hidden) {
      this.tabJail = trapFocus && new _FocusJail2.default(this.popupElement);
      this.setState({ opening: true });
      setTimeout(function () {
        _this4.setState({ opening: false });
        _this4.updatePlacement();
      }, 0);
    } else if (!hidden && nextProps.hidden) {
      this.setState({ placement: null });
    } else {
      setTimeout(function () {
        _this4.updatePlacement();
      }, 0);
    }
  };

  RelativePositionedPopup.prototype.render = function render() {
    var _classNames,
        _classNames2,
        _this5 = this,
        _classNames3;

    var _props2 = this.props,
        anchor = _props2.anchor,
        children = _props2.children,
        hidden = _props2.hidden,
        testId = _props2.testId,
        stretched = _props2.stretched;

    var _ref = this.state || {},
        opening = _ref.opening,
        placement = _ref.placement;

    var popupStyle = null;
    if (placement) {
      popupStyle = {
        top: placement.rect.top + 'px',
        left: placement.rect.left + 'px',
        height: placement.rect.height + 'px',
        width: placement.rect.width + 'px'
      };
    }

    var position = placement ? placement.position : this.getPositions()[0];

    return _react2.default.createElement(
      _View2.default,
      {
        className: (0, _classnames2.default)(_styles2.default.container, (_classNames = {}, _classNames[_styles2.default.stretched] = stretched, _classNames)),
        testId: testId
      },
      _react2.default.createElement(
        _View2.default,
        {
          className: (0, _classnames2.default)(_styles2.default.trigger, (_classNames2 = {}, _classNames2[_styles2.default.stretched] = stretched, _classNames2)),
          ref: function ref(_ref2) {
            _this5.anchorElement = _this5.anchorElement || (0, _reactDom.findDOMNode)(_ref2);
          }
        },
        anchor
      ),
      _react2.default.createElement(
        _View2.default,
        {
          className: (0, _classnames2.default)(_styles2.default.popup, (_classNames3 = {}, _classNames3[_styles2.default.opening] = opening, _classNames3)),
          hidden: hidden,
          onTab: this.onTab,
          style: popupStyle,
          ref: function ref(_ref3) {
            _this5.popupElement = _this5.popupElement || (0, _reactDom.findDOMNode)(_ref3);
          }
        },
        hidden ? null : typeof children === 'function' ? children(position) : children
      )
    );
  };

  return RelativePositionedPopup;
}(_react.Component);

RelativePositionedPopup.propTypes = {
  anchor: _react.PropTypes.node.isRequired,
  dir: _react.PropTypes.oneOf(['ltr', 'rtl']),
  children: _react.PropTypes.oneOfType([_react.PropTypes.node, _react.PropTypes.func]).isRequired,
  hidden: _react.PropTypes.bool,
  marginBottom: _react.PropTypes.number,
  marginLeft: _react.PropTypes.number,
  marginRight: _react.PropTypes.number,
  marginTop: _react.PropTypes.number,
  centerPoint: _react.PropTypes.number,
  positioning: _react.PropTypes.oneOfType([_react.PropTypes.oneOf(positions), _react.PropTypes.arrayOf(_react.PropTypes.oneOf(positions))]).isRequired,
  testId: _react.PropTypes.string,
  trapFocus: _react.PropTypes.bool,
  stretched: _react.PropTypes.bool,
  onClickOutside: _react.PropTypes.func
};
RelativePositionedPopup.defaultProps = {
  dir: 'ltr',
  hidden: true,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  trapFocus: false
};
exports.default = RelativePositionedPopup;