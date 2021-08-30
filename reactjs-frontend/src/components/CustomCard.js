import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import {Draggable} from 'react-beautiful-dnd'
import styled from 'styled-components';
import Icon from "@material-ui/core/Icon";
import {deleteCard} from '../store/actions'
import TrelloForm from './TrelloForm'
import {useDispatch} from 'react-redux'

const CardContainer = styled.div`
    margin-bottom : 10px;
    position: relative;
    max-width: 100%;
    word-wrap: break-word;
`


const EditButton = styled(Icon)`
  position: absolute;
  display: none;
  right: 5px;
  top: 5px;
  opacity: 0.5;
  ${CardContainer}:hover & {
    display: block;
    cursor: pointer;
  }
  &:hover {
    opacity: 0.8;
  }
`;

const DeleteButton = styled(Icon)`
  position: absolute;
  display: none;
  right: 5px;
  bottom: 5px;
  opacity: 0.5;
  ${CardContainer}:hover & {
    display: block;
    cursor: pointer;
  }
  &:hover {
    opacity: 0.8;
  }
`;


const CustomCard = (props)=> {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const openForm = ()=> {
    setIsEditing(true)
  }
  const closeForm = ()=> {
    setIsEditing(false)
  }

  const handleDeleteCard = ()=> {
    dispatch(deleteCard(parseInt(props.id.substring(5)), parseInt(props.listId.substring(5))));
  }

  const cardContents = ()=> {
    return (
      <Draggable draggableId = {props.id} index = {props.index}>
          {provided => (
              <CardContainer 
                  ref = {provided.innerRef} 
                  {...provided.draggableProps} 
                  {...provided.dragHandleProps} >
                  
                  <Card>

                    <EditButton
                      onMouseDown={openForm}
                      fontSize="small"
                    >
                      edit
                    </EditButton>
                    <DeleteButton 
                      onMouseDown={handleDeleteCard}
                      fontSize="small">
                      delete
                    </DeleteButton>
                      <CardContent style = {styles.cardContent}>
                          <Typography gutterBottom>{props.text}</Typography>
                      </CardContent>
                  </Card>
              </CardContainer>
          )}
          
      </Draggable>
  )}

  const editingCard = ()=> {
    return (
     <TrelloForm 
        id = {props.id}
        listId = {props.listId}
        placeholder = {props.text}
        buttonTitle = "EDIT TITLE"
        list = {props.list}
        closeForm = {closeForm}
      ></TrelloForm>
  )}

    return isEditing ? editingCard() : cardContents();
}


const styles = {
    cardContainer : {
        marginBottom : 10
    },
    cardContent : {
        textAlign : 'left'
    }
}
export default CustomCard;