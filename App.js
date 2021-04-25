/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Animated,
  useWindowDimensions,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Icon} from 'react-native-eva-icons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const COLORS = {
  red: '#cc0000',
  green: '#4cA64c',
  blue: '#4c4cff',
  white: '#fff',
  grey: '#ddd',
};

const hapticFeedbackOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const VisibleItem = props => {
  const {data, screenWidth, rowKey} = props;

  return (
    <TouchableWithoutFeedback onPress={() => console.log('touched')}>
      <Animated.View
        style={[
          styles.rowFront,
          {
            height: rowAnimatedValues[rowKey].rowHeight,
            transform: [
              {
                translateX: rowAnimatedValues[
                  rowKey
                ].rowFrontTranslate.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-screenWidth, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}>
        <Text>{data.item.text}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const HiddenItemWithActions = props => {
  const {
    leftActionActivated,
    rightActionActivated,
    swipeAnimatedValue,
    onClose,
    onDelete,
    rowKey,
  } = props;

  if (rightActionActivated) {
    ReactNativeHapticFeedback.trigger('impactLight', hapticFeedbackOptions);
    Animated.timing(rowAnimatedValues[rowKey].rowBackWidth, {
      toValue: Math.abs(swipeAnimatedValue.__getValue()),
      duration: 250,
      useNativeDriver: false,
    }).start();
  } else {
    Animated.timing(rowAnimatedValues[rowKey].rowBackWidth, {
      toValue: 100,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }

  return (
    <Animated.View
      style={[styles.rowBack, {height: rowAnimatedValues[rowKey].rowHeight}]}>
      {!rightActionActivated && (
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.backBtn,
              styles.backLeftBtn,
              {
                width: 100,
                transform: [
                  {
                    translateX: swipeAnimatedValue.interpolate({
                      inputRange: [0, 60, 100],
                      outputRange: [-100, -40, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}>
            <View style={styles.backBtnInner}>
              <Icon
                name="arrow-forward-outline"
                fill="#fff"
                width={26}
                height={26}
              />
              <Text style={styles.backBtnText}>Left</Text>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
      {!leftActionActivated && (
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.backBtn,
              styles.backRightBtn,
              styles.backRightBtnLeft,
              {
                width: 100,
                transform: [
                  {
                    translateX: swipeAnimatedValue.interpolate({
                      inputRange: [-200, -120, 0],
                      outputRange: [-100, -20, 100],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}>
            <View style={styles.backBtnInner}>
              <Icon
                name="arrow-back-outline"
                fill="#fff"
                width={26}
                height={26}
              />
              <Text style={styles.backBtnText}>Right</Text>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
      {!leftActionActivated && (
        <TouchableWithoutFeedback onPress={onDelete}>
          <Animated.View
            style={[
              styles.backBtn,
              styles.backRightBtn,
              styles.backRightBtnRight,
              {
                width: rowAnimatedValues[rowKey].rowBackWidth,
                transform: [
                  {
                    translateX: swipeAnimatedValue.interpolate({
                      inputRange: [-200, -120, 0],
                      outputRange: [0, 40, 100],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}>
            <View style={styles.backBtnInner}>
              <Icon name="trash-2-outline" fill="#fff" width={26} height={26} />
              <Text style={styles.backBtnText}>Delete</Text>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </Animated.View>
  );
};

const rowAnimatedValues = {};
Array(20)
  .fill('')
  .forEach((_, i) => {
    rowAnimatedValues[`${i}`] = {
      rowHeight: new Animated.Value(60),
      rowFrontTranslate: new Animated.Value(1),
      rowBackWidth: new Animated.Value(100),
    };
  });

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const {width: screenWidth} = useWindowDimensions();

  const [list, setList] = useState(
    [...new Array(20)].map((_, i) => ({
      key: `${i}`,
      text: `This is list item ${i}`,
    })),
  );

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = rowKey => {
    const newData = list.filter(item => item.key !== rowKey);
    setList(newData);
  };

  const onDelete = rowKey => {
    Animated.timing(rowAnimatedValues[rowKey].rowFrontTranslate, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    Animated.timing(rowAnimatedValues[rowKey].rowBackWidth, {
      toValue: screenWidth + 40,
      duration: 200,
      useNativeDriver: false,
    }).start();
    Animated.timing(rowAnimatedValues[rowKey].rowHeight, {
      toValue: 0,
      delay: 200,
      duration: 200,
      useNativeDriver: false,
    }).start(() => deleteRow(rowKey));
  };

  const onRightActionStatusChange = rowKey => {
    console.log('on right action status change');
  };

  const swipeGestureEnded = (rowKey, data) => {
    if (data.translateX < -200) {
      Animated.timing(rowAnimatedValues[rowKey].rowBackWidth, {
        toValue: screenWidth,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(rowAnimatedValues[rowKey].rowHeight, {
        toValue: 0,
        delay: 200,
        duration: 200,
        useNativeDriver: false,
      }).start(() => deleteRow(rowKey));
    }
  };

  const renderItem = (data, rowMap) => {
    return (
      <VisibleItem
        data={data}
        rowKey={data.item.key}
        screenWidth={screenWidth}
      />
    );
  };

  const renderHiddenItem = (data, rowMap) => (
    <HiddenItemWithActions
      data={data}
      rowMap={rowMap}
      rowKey={data.item.key}
      onClose={() => closeRow(rowMap, data.item.key)}
      onDelete={() => onDelete(data.item.key)}
    />
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SwipeListView
        data={list}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={60}
        rightOpenValue={-120}
        stopLeftSwipe={100}
        stopRightSwipe={-201}
        rightActivationValue={-200}
        rightActionValue={-screenWidth}
        onRightActionStatusChange={onRightActionStatusChange}
        swipeGestureEnded={swipeGestureEnded}
        swipeToOpenPercent={10}
        swipeToClosePercent={10}
        useNativeDriver={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rowFront: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backBtn: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    justifyContent: 'center',
  },
  backLeftBtn: {
    alignItems: 'flex-end',
    backgroundColor: COLORS.green,
    paddingRight: 16,
  },
  backRightBtn: {
    right: 0,
    alignItems: 'flex-start',
    paddingLeft: 12,
  },
  backRightBtnLeft: {
    backgroundColor: COLORS.blue,
  },
  backRightBtnRight: {
    backgroundColor: COLORS.red,
  },
  backBtnInner: {
    alignItems: 'center',
  },
  backBtnText: {
    color: COLORS.white,
    marginTop: 2,
  },
});

export default App;
