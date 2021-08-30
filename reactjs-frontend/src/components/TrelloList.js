import React from 'react'
import CustomCard from './CustomCard'
import TrelloActionButton from './TrelloActionButton'
import {Droppable, Draggable} from 'react-beautiful-dnd'
import styled from "styled-components";
import Icon from "@material-ui/core/Icon";
import {deleteList} from '../store/actions'
import {useDispatch} from 'react-redux'

const ListContainer = styled.div`
    background-color : #b2b5b8;
    border-radius:3px;
    width : 300px;
    padding: 10px;
    margin-right: 10px;
    height: 100%;
`

const TitleContainer = styled.div`
    width: 90%;
    display: inline-block;
`

const DeleteButton = styled(Icon)`
  position: relative;
  display: none;
  opacity: 0.5;
  ${ListContainer}:hover & {
    display: inline-block;
    cursor: pointer;
  }
  &:hover {
    opacity: 0.8;
  }
`;

const TrelloList = (props) => {
    const dispatch = useDispatch();
    const handleDeleteList = () => {
        dispatch(deleteList(parseInt(props.listId.substring(5))));
    }
    return (
        //TrelloList should be wrapped by both <Draggable> and <Droppable> 
        <Draggable draggableId = {props.listId} index = {props.index}>
            {provided => (
                <ListContainer {...provided.draggableProps} ref = {provided.innerRef} {...provided.dragHandleProps}>
                    <Droppable droppableId = {props.listId}>
                        {(provided)=> (
                        <div {...provided.droppableProps} ref = {provided.innerRef} style = {{display:"relative"}}>
                                <TitleContainer>
                                    <h4>{props.title}</h4></TitleContainer>
                               
                                <DeleteButton 
                                    fontSize="small"
                                    onMouseDown = {handleDeleteList}>delete</DeleteButton>
                                {props.cards.map((card, index) => (
                                    // 'List id' and 'card id' should not be same on React Beautiful D&D. 
                                    // Since they are the same integer type on DB, we differenciate them by adding "list_" and "card_" respectively
                                    <CustomCard 
                                        key = {"card_" + card.id} 
                                        id = {"card_" + card.id}
                                        listId = {props.listId}
                                        text = {card.text} 
                                        index = {index}></CustomCard>
                                ))}
                                {/*A placeholder to indicate the end of the droppable*/}
                                {provided.placeholder}
                                <TrelloActionButton listId = {props.listId}/>
                            </div>
                        )}
                        
                    </Droppable>
                </ListContainer>
            )}
        </Draggable>
       
        
    )
}


export default TrelloList;