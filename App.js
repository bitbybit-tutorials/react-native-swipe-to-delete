/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SwipeListView } from 'react-native-swipe-list-view';

const App = () => {
  // const [list, setList] = useState(
  //   Array(20)
  //     .fill('')
  //     .map((_, i) => {
  //     return {
  //       key: Math.random,
  //       text: `This is list item ${i}`
  //     };
  //   })
  // );

  const [list, setList] = useState(
    [ ...new Array(20) ].map((_, i) => ({ key: Math.random(), text: `This is list item ${i}` }))
  );

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [ ...list ];
    const prevIndex = list.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setList(newData);
  };

  const renderItem = (data, rowMap) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => console.log('you touched me')}
        style={styles.rowFront}
      >
        <View style={styles.rowFront}>
          <Text>{data.item.text}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
        <View style={styles.rowBack}>
          <Text>Left</Text>
          <TouchableOpacity
            style={[ styles.backRightBtn, styles.backRightBtnLeft ]}
            onPress={() => closeRow(rowMap, data.item.key)}
          >
            <Text style={styles.backTextWhite}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[ styles.backRightBtn, styles.backRightBtnRight ]}
            onPress={() => deleteRow(rowMap, data.item.key)}
          >
            <Text style={styles.backTextWhite}>Delete</Text>
          </TouchableOpacity>
        </View>
    );
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SwipeListView
        data={list}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-150}
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
    borderBottomColor: '#000'
  },
  backTextWhite: {
    color: '#fff'
  },  
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#ddd',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15
  },
  backRightBtn: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    width: 75,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0
  }
});

export default App;
