export class BadRequest extends Error {
    constructor(message = 'Bad Request') {
      super(message);
      this.status = 400;
    }
  }
  
  export class NotFound extends Error {
    constructor(message = 'Resource Not Found') {
      super(message);
      this.status = 404;
    }
  }
  
  export class UserNotFound extends NotFound {
    constructor(id) {
      super(`User does not exist with the given id: ${id}`);
    }
  }
  
  export class ListNotFound extends NotFound {
    constructor(id) {
      super(`List does not exist with the given id: ${id}`);
    }
  }
  
  export class CardNotFound extends NotFound {
    constructor(id) {
      super(`Card does not exist with the given id: ${id}`);
    }
  }