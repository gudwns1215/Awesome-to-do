import React from 'react';
import { StyleSheet, Text, View, StatusBar, Dimensions, Platform, AsyncStorage, LayoutAnimation, UIManager} from 'react-native';
import {LinearGradient, AppLoading, Font} from 'expo';
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import ToDo from "./ToDo";
import uuidv1 from "uuid/v1";

const {height, width} = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: "",
    toDos : {},
    loadedFonts: false,
    flxValue:0,
  };

  constructor(){
    super();
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  async componentDidMount(){
    await Font.loadAsync({
      'Raleway-ExtraLight': require('./assets/fonts/Raleway-ExtraLight.ttf'),
      'Raleway-Thin': require('./assets/fonts/Raleway-Thin.ttf')
    });
    this.setState({loadedFonts:true});
    setTimeout(this.loadToDo,100);
  }

  render() {
    const {newToDo, toDos, loadedFonts, flxValue} = this.state;
    
    return ((!loadedFonts)?<AppLoading/>:
      <View style={styles.container}>
        <LinearGradient colors={['#121f27', '#416275',  '#6191a8', '#bbcfda', '#e4eef0']} style={styles.gradient}>
          <StatusBar barStyle="light-content"/>
          <Text style={styles.title}>TO DO</Text>
          {<View style={styles.card} flex={flxValue}>
            <TextInput style={styles.tInput} 
            placeholder="New To Do" 
            value={newToDo} 
            onChangeText={this.controlnewToDo} 
            returnKeyType={"done"}
            onSubmitEditing={this.addToDo}/>
            <ScrollView contentContainerStyle={styles.toDoScroll}>
              {Object.values(toDos).reverse().map(toDo => (<ToDo 
              key={toDo.id} 
              {...toDo} 
              deleteFunc={this.deleteToDo} 
              completeToDo={this.completeToDo} 
              unCompleteToDo={this.unCompleteToDo} 
              updateToDo={this.updateToDo}/>))}
            </ScrollView>
          </View>}
        </LinearGradient>
      </View>
    );
  }
  controlnewToDo = text => {
    this.setState({
      newToDo:text,
    })
  }

  loadToDo = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({
        toDos:JSON.parse(toDos),
        flxValue:1,
      });
    }catch(err){
      console.log(err);
    }
  };
  addToDo = () => {
    const {newToDo,toDos} = this.state;
    if(newToDo !== ""){
      const ID = uuidv1();
      const newToDoObj = {[ID]:{
        id:ID,
        isCompleted:false,
        text: newToDo,
        createdAt: Date.now(),
      }};
      newToDos={...toDos,...newToDoObj};
      LayoutAnimation.configureNext(CustomLayoutSpring);
      this.setState({newToDo:"",toDos:newToDos});
      this.saveToDo(newToDos);
    }
  };
  deleteToDo = (id) => {
    const prevToDos = this.state.toDos;
    delete prevToDos[id];
    LayoutAnimation.configureNext(CustomLayoutSpring);
    this.setState({toDos:prevToDos});
    this.saveToDo(prevToDos);
  };

  unCompleteToDo = (id) => {
    const newToDos = this.state.toDos;
    newToDos[id].isCompleted = false;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({toDos:newToDos});
    this.saveToDo(newToDos);
  };
  completeToDo = (id) => {
    const newToDos = this.state.toDos;
    newToDos[id].isCompleted = true;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({toDos:newToDos});
    this.saveToDo(newToDos);
  };

  updateToDo = (id,text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]:{
            ...prevState.toDos[id],
            text : text,
          }
        }
      };
      this.saveToDo(newState.toDos);
      return newState;
    });
  };

  saveToDo = (newToDos) => {
    console.log(JSON.stringify(newToDos));
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
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
    fontSize:50,
    marginTop:40,
    marginBottom:20,
    fontFamily:'Raleway-Thin',
  },
  card:{
    flex:1,
    backgroundColor:'white',
    width:width-25,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    ...Platform.select({
      ios:{
        shadowColor:"rgb(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius:5,
        shadowOffset:{
          height:-1,
          width:0,
        },
      },
      android:{
        elevation:3,
        },
    })
  },
  tInput:{
    padding:20,
    borderBottomColor:"#bbb",
    borderBottomWidth:1,
    fontSize:25,
    fontFamily:'Raleway-ExtraLight',
  },
  toDoScroll:{
    alignItems:"center",
  }
});

var CustomLayoutSpring = {
  duration: 400,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.opacity,
    springDamping: 0.7,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7,
  },
};