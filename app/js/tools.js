
function raise(message) {
  if (typeof message === 'string') {
    error = new Error(message);

  } else {
    error = new Error(JSON.stringify(message, null, 2));
    error.meta = message
  }

  throw error
}
