expect.extend({
  toBeValidationError (received, param) {
    if (!param || typeof param !== 'string') {
      throw new Error('Expected param to be a string')
    }
    if (!received.body || !received.body.errors || !Array.isArray(received.body.errors)) {
      throw new Error('Expected received to be a HTTP response with body and an array of errors')
    }
    const pass = received.body.errors.some(error => error.param === param)
    return {
      pass,
      message: () => pass
        ? `Expected not to have ${param} validation error`
        : `Expected to have ${param} validation error`
    }
  }
})
