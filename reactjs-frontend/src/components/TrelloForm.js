import React, {useState} from 'react'
import Icon from '@material-ui/core/Icon'

import {addList, addCard, editCard} from '../store/actions'
import TextArea from 'react-textarea-autosize'
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import {useDispatch} from 'react-redux'

const TrelloForm = (props) => {
    const dispatch = useDispatch();
    const [text, setText] = useState("")
    const handleAddList = () => {
        dispatch(addList(text))
    }
    const handleInputChange = (e)=> {
        setText(e.target.value)
    }
    const handleAddCard = ()=>{
        dispatch(addCard(props.listId.substring(5), text))
    }
    const handleEditCard = (e)=>{
        dispatch(editCard(props.listId.substring(5), props.id.substring(5), text))            
    }
    return (
        <div>
            <Card style = {{
                overflow : "visible",
                minHeight :80,
                minWidth : 270,
                padding : "6px 8px 2px"
            }}>
                <TextArea
                    placeholder = {props.placeholder}
                    autoFocus
                    onBlur = {props.closeForm} 
                    value = {text}
                    onChange = {handleInputChange}
                    style = {{
                        resize : "none",
                        width: "100%",
                        outline : "none",
                        border: "none",
                        overflow : "hidden"
                    }}/>
            </Card>    
            <div style ={styles.formButtonGroup}>
                {props.buttonTitle!=='EDIT TITLE' ? 
                <Button 
                onMouseDown = {props.list? handleAddList:handleAddCard}
                variant = "contained" 
                style = {{
                    color : "white",
                    backgroundColor : "#5aac44"}}>{props.buttonTitle}{""}
                </Button>  :
                <Button 
                    onMouseDown = {handleEditCard}
                    variant = "contained" 
                    style = {{
                        color : "white",
                        backgroundColor : "#5aac44"}}>{props.buttonTitle}{""}
                </Button>
                
                }
                
                <Icon style = {{marginLeft : 8, cursor : "pointer"}}>close</Icon>
            </div>
        </div> 
    )
}

const styles = {
    openFormButtonGroup : {
        display : 'flex',
        alignItems : 'center',
        cursor : 'pointer',
        borderRadius : 3,
        height: 36,
        width : 270,
        paddingLeft : 10
    }, 
    formButtonGroup : {
        marginTop : 8,
        display : "flex",
        alignItems : "center"
    }
}
export default TrelloForm