import { NotFound } from "../error";

/**
 * Catch all exceptions occured while handling request asynchronously
 * without catch those exceptions and pass them to error handler by next(error)
 *
 * @param handler RequestHandler
 */
 export const catchAsync = (handler) => (...args) => {
  handler(...args).catch(args[2]);
};

/**
* Throw NotFound exception when there is no matching route
*/
/* export const notFound = catchAsync(async (req, res) => {
  throw new NotFound();
}); */
export const notFound = (req, res) => {
  res.notFound();
}

/**
* All errors are captured here
*/
export const serverError = (error, req, res, next) => {
  console.error(error.stack);

  res.status(error.status || 500).json({ error: { message: error.message || "Internal Server Error" } });
};
