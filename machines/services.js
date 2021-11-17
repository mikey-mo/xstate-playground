import randomize from "./utils/randomize";

export const ERRORS = [
  { status: 400, message: 'bad request' },
  { status: 401, message: 'unauthorized' },
  { status: 404, message: 'not found' },
  { status: 500, message: 'server error' },
];

export const wildcardFetch = async () => new Promise((resolve, reject) => {
  if (Math.ceil(randomize())) {
    const err = new Error();
    const { status, message } = ERRORS[Math.floor(Math.random() * ERRORS.length)];
    err.status = status;
    err.message = message;
    reject(err);
  }
  return resolve({ data: 'true' });
});
