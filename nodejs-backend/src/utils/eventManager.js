import EventEmitter from "events";
import { Events } from "../constants";

export default class EventManager extends EventEmitter{

  static #instance;
  
  constructor() {
    super();
    this.#registerEvents();
  }

  static getInstance() {
    if (this.#instance) {
      return this.#instance;
    }

    this.#instance = new EventManager();
    return this.#instance;
  }

  #registerEvents() {
    this.on(Events.NEW_TASK_ASSIGNED, this.#notifyAdmin);
  }

  #notifyAdmin(name) {
    console.log(`${name} has signed up!`);
  }
}