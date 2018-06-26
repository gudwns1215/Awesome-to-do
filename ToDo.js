import React from "react";
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput} from "react-native";
import {Feather, MaterialCommunityIcons} from "@expo/vector-icons"; //ios-radio-button-off, ios-checkmark-circle-outline
import PropTypes from "prop-types";
import {Font} from 'expo';
const {width, height} = Dimensions.get("window");
const actionIconSize = 20;

export default class ToDo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isEditing:false,
            toDoValue:props.text,};
    }
    static propTypes = {
        text : PropTypes.string.isRequired,
        isCompleted : PropTypes.bool.isRequired,
        deleteFunc: PropTypes.func.isRequired,
        completeToDo : PropTypes.func.isRequired,
        unCompleteToDo:PropTypes.func.isRequired,
        updateToDo:PropTypes.func.isRequired,
        id : PropTypes.string.isRequired,
    };

    async componentDidMount(){
        await Font.loadAsync({
            'Raleway-ExtraLight': require('./assets/fonts/Raleway-ExtraLight.ttf'),
        });
    }

    render(){
        const {isEditing, toDoValue} = this.state;
        const {text, isCompleted, deleteFunc, id} = this.props;
        return(
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPress={this.toggleCompleteToDo}>
                        <Feather style={styles.icons} color={isCompleted?'#bbb':'#416275'} size={30} name={isCompleted?'check-circle':'circle'}/>
                    </TouchableOpacity>
                    {isEditing?(
                        <TextInput onChangeText={this.controllInput} 
                        style={[styles.Text,styles.editInput,isCompleted?styles.completedText:styles.uncompletedText]} 
                        value={toDoValue} 
                        multiline={true}
                        returnKeyType={"done"}
                        onBlur={this.finishEditing}/>
                    ):(<Text style={[styles.Text,isCompleted?styles.completedText:styles.uncompletedText]}>{text}</Text>)}
                </View>
                    {isEditing?(
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this.finishEditing}>
                                <View style={styles.actionsContainer}>
                                    <MaterialCommunityIcons size={actionIconSize} name="checkbox-marked" color='#416275' />
                                </View>
                            </TouchableOpacity>
                        </View>
                    ):(
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this.startEditing}>
                                <View style={styles.actionsContainer}>
                                    <MaterialCommunityIcons size={actionIconSize} name="pencil" color='#416275' />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPressOut={(event) => {
                                event.stopPropagation();
                                deleteFunc(id);}}>
                                <View style={styles.actionsContainer}>
                                    <MaterialCommunityIcons size={actionIconSize} name="close-box" color='#416275' />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
            </View>
        );
    }
    toggleCompleteToDo = event => {
        event.stopPropagation();
        const {isCompleted, completeToDo, unCompleteToDo, id} = this.props;
        if(isCompleted){
            
            unCompleteToDo(id);
        }else{
            completeToDo(id);
        }
    };

    startEditing = event => {
        event.stopPropagation();
        this.setState({isEditing: true});
    };

    finishEditing = event =>{
        event.stopPropagation();
        const toDoValue = this.state.toDoValue;
        const {updateToDo, id} = this.props;
        updateToDo(id,toDoValue);
        this.setState({isEditing: false});
    };

    controllInput = text => {
        this.setState({
                toDoValue:text,
        });
    };
}
const styles= StyleSheet.create({
    container:{
        width:width-50,
        borderBottomColor:"#bbb",
        borderBottomWidth:StyleSheet.hairlineWidth,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:"space-between",
    },
    Text:{
        fontSize:20,
        marginVertical:20,
        fontFamily:'Raleway-ExtraLight',
    },
    completedText:{
        color:'#bbb',
        textDecorationLine:"line-through",  
    },
    uncompletedText:{
        color:'#353535',
    },
    btn:{
        width:50,
        height:50,
        borderRadius:15,
        marginRight:20,
        borderColor:"blue",
        borderWidth:3,
    },
    icons:{
        paddingRight:10,
    },
    column:{
        flexDirection:'row',
        alignItems:'center',
        width:width/2,
    },
    actions:{
        flexDirection:'row',
    },
    actionsContainer:{
        margin:10,
    },
    editInput:{
        marginVertical:20,
        width:width/2,
    }
})