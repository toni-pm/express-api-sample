const { validationResult, check } = require('express-validator')

const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    // If in the error we have directly assigned a code, we return the status with the implicit error.
    const errStatus = errors.array().find(err => Number.isInteger(err.msg))
    if (errStatus) {
      res.sendStatus(errStatus.msg)
    } else {
      // Otherwise, we return the error array
      res.status(400).json({
        errors: errors.array()
      })
    }
  }
}

const validatePassword = () => {
  return [
    check('password', 'Password must be at least 16 characters and contain at least: 1 number, 1 symbol, 1 capital letter and 1 lower letter.')
      .notEmpty().isStrongPassword({
        minLength: 16,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
  ]
}

const validateNickname = () => {
  return [
    check('nickname', 'Nickname must be between 4 and 16 characters.').notEmpty().trim().isLength({ min: 4, max: 16 })
      .matches(/^[a-zA-Z0-9^_-]+$/).withMessage('Nickname cannot contain special characters except - or _')
  ]
}

const validateUser = () => {
  return [...validatePassword(), ...validateNickname()]
}

const validateItem = () => {
  return [
    check('name', 'Required field.').notEmpty().trim()
  ]
}

module.exports = {
  validate,
  validateUser,
  validateItem
}
