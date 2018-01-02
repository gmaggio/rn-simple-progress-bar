import React, { Component } from 'react'
import { upperFirst } from 'lodash'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'

const { number, string, bool, oneOf } = React.PropTypes

export default class ProgressBar extends Component {

  static propTypes = {
    value: number.isRequired,
    totalValue: function(props, propName, componentName) {
      if (
        props['valueType'] == 'value' &&
        (props[propName] == undefined ||
        props[propName] < props['value'] ||
        typeof(props[propName]) != 'number')
      ) {
        return new Error(
          'If prop `valueType` of value `value` is supplied to `ProgressBar`, ' +
          'prop `' + propName + '` has to be defined with a number ' +
          'greater than the value of prop `value`.'
        );
      }
    },
    valueType: oneOf(['percent', 'value']),
    height: number,
    barColor: string,
    bgColor: string,
    barRadius: number,
    hideText: bool,
    hideTotal: bool,
    textStyle: Text.propTypes.style,
    textPosition: oneOf(['left', 'right', 'top', 'bottom']),
  }

  static defaultProps = {
    valueType: 'percent',
    height: 10,
    barColor: '#22cd33',
    bgColor: '#e6e6e6',
    barRadius: undefined,
    hideText: false,
    hideTotal: false,
    textStyle: {
      fontSize: 13,
      color: '#191919',
    },
    textPosition: 'right',
  }

  constructor(props){
    super(props)
  }

  render() {
    const {
      value,
      totalValue,
      valueType,
      height,
      barColor,
      bgColor,
      barRadius,
      hideText,
      hideTotal,
      textStyle,
      textPosition
    } = this.props;

    let progressValue = value + (valueType == 'percent' ? '%' : (!hideTotal ? '/' + totalValue : null))
    let valuePercentage = (valueType != 'percent') ? (value / totalValue) * 100 : value

    const progressBarValue = {
      width: valuePercentage + '%',
    };

    const barStyle = {
      height: height,
      borderRadius: barRadius || (height / 2),
    }

    const barContainerStyle = {
      ...barStyle,
      ['margin' + upperFirst(textPosition)]: (textPosition == 'top' || textPosition == 'bottom') ? 0 : 3
    }

    const position = {
      'left': {
        'direction': 'row',
        'order': 'first'
      },
      'right': {
        'direction': 'row',
        'order': 'last'
      },
      'top': {
        'direction': 'column',
        'order': 'first'
      },
      'bottom': {
        'direction': 'column',
        'order': 'last'
      }
    }

    let textBar = !hideText ?
      <Text style={textStyle}>
        {progressValue}
      </Text>
      :
      null

    return(
      <View style={[styles.container, { flexDirection: position[textPosition].direction }]}>
        {position[textPosition].order == 'first' ? textBar : null}
        <View style={[styles.barContainer, barContainerStyle, { backgroundColor: bgColor }]}>
          <View style={[barStyle, progressBarValue, { backgroundColor: barColor }]}></View>
        </View>
        {position[textPosition].order == 'last' ? textBar : null}
      </View>
    )
  }
  
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  barContainer: {
    width: '100%',
    flexGrow: 1,
    flexShrink: 1,
    overflow: 'hidden',
  },
})
