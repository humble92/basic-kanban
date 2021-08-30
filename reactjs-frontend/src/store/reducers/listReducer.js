import {CONSTANTS} from '../actions'

const initialState = []

const listReducer = (state = initialState, action) => {
    switch(action.type) {
        
        case CONSTANTS.SET_LIST:
            action.payload.lists.sort((a, b) => parseInt(a.index) - parseInt(b.index)); //sorting list by index 
            for (const list in action.payload.lists) {
                action.payload.lists[list].cards.sort((a,b)=>parseInt(a.index)-parseInt(b.index)) //sorting each array of cards by index  
            }
            return action.payload.lists

        case CONSTANTS.ADD_LIST:
            const newList = {
                title : action.payload.title,
                cards : [],
                id : action.payload.id,
                index : action.payload.index
            }
            
            return [...state, newList]

        case CONSTANTS.ADD_CARD:{
            const newCard = {
                text : action.payload.text,
                id : action.payload.id
            }
          
            const newState = state.map(list=> { 
                if(list.id ===action.payload.listId) {
                    return {
                        ...list, 
                        cards: [...list.cards, newCard]
                    }
                }else {
                    return list
                }
            })
            return newState;
        }
        case CONSTANTS.EDIT_CARD : {        
            const editState = state.map(list=> {
                if(list.id ===parseInt(action.payload.listId)) {
                    let updatedCard = list.cards.map(card => {
                        if(card.id===action.payload.id) {
                            return {...card, text : action.payload.text}    
                        }else {
                            return card
                        }}
                    )
                    return {...list, cards : updatedCard}
                }else {
                    return list;
                }
            })  
            return editState;
        }
        case CONSTANTS.DELETE_CARD : {
            const newState = state.map(list=> {
                if(list.id ===parseInt(action.payload.listId)) {
                    const newCard = list['cards'].filter(card=> {
                        return card.id !==parseInt(action.payload.id);
                    })
                    return {
                        ...list,
                        cards : newCard
                    }
                }else {
                    return list
                }
            });
            
            return newState;
        }
        case CONSTANTS.DELETE_LIST : {
            let listId = action.payload;
            const newState = state.filter(list => {
                return (list.id !==listId)
            })
            return [...newState];
        }
        case CONSTANTS.DRAG_HAPPENED:
            const {
                droppableIdStart, // origin drppableId
                droppableIdEnd, // destination drppableId
                droppableIndexStart, //origin index
                droppableIndexEnd, // destination index
                type
            } = action.payload;
            const newState = [...state];

            //dragging lists around
            if(type ==='list') {
               /**
                 * TODO 5. 
                 * CONSTANTS.DRAG_HAPPENED 
                 * 1. Update the state when a user drags lists around. 
                 * 2. Change its index based on the result of drop and drag
                 * HINT : See the below (Use Splice method)
                 */
                /////////////////////////////////////////////////////////////////////
                const list = newState.splice(droppableIndexStart, 1);
                newState.splice(droppableIndexEnd, 0, ...list)

                return newState;
            }
            // Dragging Card in the same list
            if(droppableIdStart ===droppableIdEnd) {
                const list = state.find(list => parseInt(droppableIdStart.substring(5)) ===list.id);
                const card = list.cards.splice(droppableIndexStart, 1);
                list.cards.splice(droppableIndexEnd, 0, ...card)
            }

            // Dragging Card to other list
            if(droppableIdStart !==droppableIdEnd) {
                //find the list where drag happened
                const listStart = state.find(list=>parseInt(droppableIdStart.substring(5)) ===list.id)
                // pull out the card from this list
                const card = listStart.cards.splice(droppableIndexStart, 1)
                
                //find the list where drag ends
                const listEnd = state.find(list => parseInt(droppableIdEnd.substring(5)) ===list.id)

                //put the card in the new list
                listEnd.cards.splice(droppableIndexEnd, 0, ...card)
            }

            return newState;

        default:
            return state;
    }
}

export default listReducer
