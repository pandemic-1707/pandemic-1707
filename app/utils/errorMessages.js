export const isRequired = fieldName => `${fieldName} is required`

export const ruleRunner = (field, name, ...validations) => {
  return (state) => {
    for (let v of validations) {
      let errorMessageFunc = v(state[field], state)
      if (errorMessageFunc) {
        return {[field]: errorMessageFunc(name)}
      }
    }
    return null
  }
}

export const run = (state, runners) => {
  return runners.reduce((memo, runner) => {
    return Object.assign(memo, runner(state))
  }, {})
}

export const required = (text) => {
  if (text) {
    return null
  } else {
    return isRequired
  }
}
