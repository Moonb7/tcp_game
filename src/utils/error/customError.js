class CustomError extends Error {
  /**
   * 에러 코드와 에러 메세지
   * @param {*} code
   * @param {*} message
   */
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'CustomError';
  }
}

export default CustomError;
