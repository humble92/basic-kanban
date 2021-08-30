import {
    CONSTANTS
} from '../actions'
import axios from 'axios'
import { fetchLists } from './listActions'; 
const API_URL = "http://localhost:3001"

/**
 * Add a card
 * @param {number} listId 
 * @param {string} text 
 * @returns  
 */
export const addCard = (listId, text) => {
    return async (dispatch, getState) => {
        const response = await axios.post(`${API_URL}/card`, {
            "text": text,
            "listId": listId
        })

        dispatch({
            type: CONSTANTS.ADD_CARD,
            payload: {
                "id": response.data.id,
                "text": response.data.text,
                "listId": response.data.list.id
            }
        })
    }
};

/**
 * Delete a card
 * @param {number} id 
 * @param {number} listId 
 * @returns 
 */
export const deleteCard = (id, listId) => {
    return async (dispatch) => {
        const response = await axios.delete(`${API_URL}/card/${id}`)
        if (response.status === 204) {
            dispatch({
                type: CONSTANTS.DELETE_CARD,
                payload: {
                    "id": id,
                    "listId": listId
                }
            })
        }
    }
}
/**
 * Edit a card
 * @param {number} listId 
 * @param {number} id 
 * @param {string} text 
 * @returns 
 */
export const editCard = (listId, id, text) => {
    /**
     * TODO 4. 
     * Complete deleteList function 
     * 1. Use backend endpoint to edit text on the card
     * 2. Get the response of the db (updated Card), dispatch the relevant type  
     */
    /////////////////////////////////////////////////////////////////////
    return async (dispatch) => {
        const response = await axios.patch(`${API_URL}/card/${id}`, {
            "text": text
        })
        dispatch({
            type: CONSTANTS.EDIT_CARD,
            payload: response.data
        })
    }    
}

/**
 * Update index of the card upon the result of the drag and drop
 * @param {string} droppableIdStart // origin drppableId
 * @param {string} droppableIdEnd   // destination drppableId
 * @param {number} droppableIndexStart //origin index
 * @param {number} droppableIndexEnd // destination index
 * @param {string} draggableId // id of the dragged object
 * @param {string} type //Either list or DEFAULT
 * @returns 
 */
export const UpdateCardIndex = (droppableIdStart, droppableIdEnd, droppableIndexStart, droppableIndexEnd, draggableId, type) => {
    return async (dispatch) => {
        // It dispatches DRAG_HAPPENED to change front-end and state immediately 
        dispatch({
            type: CONSTANTS.DRAG_HAPPENED,
            payload: {
                droppableIdStart,
                droppableIdEnd,
                droppableIndexStart,
                droppableIndexEnd,
                draggableId,
                type
            }
        })
    
        //After changing front-end and state, it updates DB based on the change.
        const response = await axios.patch(`${API_URL}/card/${parseInt(draggableId.substring(5))}`, {
            "listId": parseInt(droppableIdEnd.substring(5)),
            "index": droppableIndexEnd
        })
        if (response.status === 200) {
            dispatch(fetchLists())
        }
    }
}