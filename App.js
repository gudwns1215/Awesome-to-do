import React from 'react';
import { StyleSheet, Text, View, StatusBar, Dimensions, Platform  } from 'react-native';
import {LinearGradient} from 'expo';
import { TextInput } from 'react-native-gesture-handler';

const {height, width} = Dimensions.get("window");

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#121f27', '#416275',  '#6191a8', '#bbcfda', '#e4eef0']} style={styles.gradient}>
          <StatusBar barStyle="light-content"/>
          <Text style={styles.title}>To Do</Text>
          <View style={styles.card}>
            <TextInput style={styles.tInput} placeholder="New To Do"/>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradient:{
    flex:1,
    alignItems:"center"
  },
  title:{
    color:'white',
    fontSize:30,
    marginTop:50,
    fontWeight:'200',
    marginBottom:30,
  },
  card:{
    flex:1,
    backgroundColor:'white',
    width:width-25,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    padding:10,
    ...Platform.select({
      ios:{
        shadowColor:"rgb(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius:5,
        shadowOffset:{
          height:-1,
          width:0,
        },
      android:{
        elevation:3,
        }
      }
    })
  }
});
