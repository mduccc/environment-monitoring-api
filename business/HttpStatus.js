class HttpStatus {

}

HttpStatus.success_code = 200
HttpStatus.unauthorized_code = 401
HttpStatus.not_found_code = 404
HttpStatus.bad_request_code = 400
HttpStatus.invalid_input_code = 422

HttpStatus.success_message = 'success'
HttpStatus.unauthorized_message = 'unauthorized'
HttpStatus.not_found_message = 'not found'
HttpStatus.bad_request_message = 'bad request'
HttpStatus.invalid_input_message = 'invalid input'

console.log(HttpStatus.success_message)

module.exports = HttpStatus