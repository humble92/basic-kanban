import React, {useState} from 'react';
import Icon from '@material-ui/core/Icon'
import TrelloForm from './TrelloForm'

const TrelloActionButton  = (props) => {
    
    const [formOpen, setFormOpen] = useState(false)
    
    const openForm = ()=> {
        setFormOpen(true)
    }
    
    const closeForm = ()=> {
        setFormOpen(false)
    }
    
    const renderAddButton = () => {
        const {list} = props
        const buttonText = list ? "Add another list" : "Add another Card"
        const buttonTextOpacity = list ? 1 : 0.5;
        const buttonTextColor = list ? "white" : "inherit"
        const buttonTextBackground = list ? "rgba(0,0,0, .15)" : "inherit";
        
        return (
            <div 
                onClick = {openForm}
                style = {{
                ...styles.openFormButtonGroup,
                opacity : buttonTextOpacity, 
                color : buttonTextColor,
                backgroundColor : buttonTextBackground
            }}>
                <Icon>add</Icon>
                <p>{buttonText}</p>
            </div>
        )
    }   
    const renderForm = ()=> {
        const {list}  =props
        const placeholder = list ? "Enter list title..." : "Enter a title for this card..."
        const buttonTitle = list ? "Add List" : "Add Card"
        return <TrelloForm 
                    listId = {props.listId} 
                    placeholder = {placeholder} 
                    buttonTitle = {buttonTitle} 
                    list = {props.list} 
                    closeForm = {closeForm}></TrelloForm>
    }

    return formOpen ? renderForm():renderAddButton();
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

export default TrelloActionButton;