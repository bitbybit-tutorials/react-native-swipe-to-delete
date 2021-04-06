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
  Easing,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Icon} from 'react-native-eva-icons';

const VisibleItem = props => {
  const {data, rowKey} = props;

  return (
    <TouchableWithoutFeedback onPress={() => console.log('touched')}>
      <Animated.View
        style={[styles.rowFront, {height: rowAnimatedValues[rowKey].height}]}>
        <View>
          <Text>{data.item.text}</Text>
        </View>
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
    Animated.timing(rowAnimatedValues[rowKey].width, {
      toValue: Math.abs(swipeAnimatedValue.__getValue()),
      duration: 250,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  } else {
    Animated.timing(rowAnimatedValues[rowKey].width, {
      toValue: 100,
      duration: 250,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }

  return (
    <Animated.View
      style={[styles.rowBack, {height: rowAnimatedValues[rowKey].height}]}>
      {!rightActionActivated && (
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
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
              <Text style={styles.backTextWhite}>Left</Text>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
      {!leftActionActivated && (
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
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
              <Text style={styles.backTextWhite}>Right</Text>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
      {!leftActionActivated && (
        <TouchableWithoutFeedback onPress={onDelete}>
          <Animated.View
            style={[
              styles.backRightBtn,
              styles.backRightBtnRight,
              {
                width: rowAnimatedValues[rowKey].width,
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
              <Text style={styles.btnText}>Delete</Text>
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
      height: new Animated.Value(60),
      width: new Animated.Value(100),
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

  const deleteRow = (rowMap, rowKey) => {
    Animated.timing(rowAnimatedValues[rowKey].width, {
      toValue: screenWidth,
      duration: 200,
      useNativeDriver: false,
    }).start();
    Animated.timing(rowAnimatedValues[rowKey].height, {
      toValue: 0,
      delay: 200,
      duration: 200,
      useNativeDriver: false,
    }).start();

    const newData = list.filter(item => item.key !== rowKey);
    setList(newData);
  };

  const onRightActionStatusChange = rowKey => {
    console.log('on right action status change');
  };

  const swipeGestureEnded = (rowKey, data) => {
    if (data.translateX < -200) {
      Animated.timing(rowAnimatedValues[rowKey].width, {
        toValue: screenWidth,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(rowAnimatedValues[rowKey].height, {
        toValue: 0,
        delay: 200,
        duration: 200,
        useNativeDriver: false,
      }).start(() => deleteRow(null, rowKey));
    }
  };

  const renderItem = (data, rowMap) => {
    return (
      <VisibleItem
        data={data}
        rowKey={data.item.key}
        removeRow={() => deleteRow(rowMap, data.item.key)}
      />
    );
  };

  const renderHiddenItem = (data, rowMap) => (
    <HiddenItemWithActions
      data={data}
      rowMap={rowMap}
      rowKey={data.item.key}
      onClose={() => closeRow(rowMap, data.item.key)}
      onDelete={() => deleteRow(rowMap, data.item.key)}
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
        rightActionValue={-500}
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
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  backTextWhite: {
    color: '#fff',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backLeftBtn: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'grey',
    paddingRight: 16,
  },
  backRightBtn: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    right: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
  },
  backRightBtnRight: {
    backgroundColor: 'red',
  },
  backBtnInner: {
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    marginTop: 3,
  },
});

export default App;
