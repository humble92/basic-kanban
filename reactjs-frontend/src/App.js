import {useEffect} from 'react'
import TrelloList from './components/TrelloList'
import TrelloActionButton from './components/TrelloActionButton'
import {DragDropContext, Droppable} from 'react-beautiful-dnd'
import {UpdateCardIndex, UpdateListIndex} from './store/actions'
import styled from 'styled-components'
import {fetchLists} from './store/actions/listActions'
import {useSelector} from 'react-redux'
import {useDispatch} from 'react-redux'


const ListContainer = styled.div`
    display : flex;
    flexDirection : row;
`

const App = () => {
  const lists = useSelector(state =>state.lists)
  const dispatch = useDispatch();
  
  //Backend call to fetch lists from DB
  useEffect(()=> {
    dispatch(fetchLists());
  }, [])

  //This method is called once the drag of the card or list is done, 
  const onDragEnd = (result) => {
    const {destination, source, draggableId, type} = result;
    // if users mistakenly drop list or card to non-droppable area of the webpage
    
    if(!destination) {
      return;
    }
    // if users drop a list
    if(type === 'list') {
      dispatch(UpdateListIndex(
        source.droppableId, 
        destination.droppableId,
        source.index,
        destination.index,
        draggableId,
        type
      ))
    }else {  // if users drop a card
      dispatch(UpdateCardIndex(
        source.droppableId, 
        destination.droppableId,
        source.index,
        destination.index,
        draggableId, 
        type
      ))
    }
    

  }


  return (
    //Wrap the part of the application for drag and drop
    <DragDropContext onDragEnd = {onDragEnd}>
      <div 
        className="App">
        <h1 style = {{textAlign:"center"}}>Share & Inspiration REACT Assignment</h1>
        {/*An area where users can drop list */}
        <Droppable droppableId = "all-lists" direction = 'horizontal' type = 'list'> 
          {provided => (
            <ListContainer 
              {...provided.droppableProps} 
              ref = {provided.innerRef}>
                {lists.map((list, index) => (
                  // 'List id' and 'card id' should not be same on React Beautiful D&D. 
                  // Since they are the same integer type on DB, we differenciate them by adding "list_" and "card_" respectively
                  <TrelloList 
                    key = {"list_"+list.id} 
                    listId = {"list_"+list.id}  
                    title = {list.title} 
                    cards = {list.cards}
                    index = {index}></TrelloList>
                ))} 
                {/*A placeholder to indicate the end of the droppable*/}
                {provided.placeholder} 
            <TrelloActionButton list/>
          </ListContainer>
          )}
        </Droppable>
        
        
      </div>
    </DragDropContext>
  );
}

export default App;
