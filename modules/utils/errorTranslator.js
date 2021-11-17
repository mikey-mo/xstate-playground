const errorTranslator = (errors) => {
  if (errors.input) {
    return 'Input Error';
  }
  return 'Output Error';
};

export default errorTranslator;
