export const email = (email) => {
  if (email && !/^[A-Z0-9.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    return 'Invalid email address'
  }
  return ''
}

export const password = (password) => {
  if (password && password.length < 8) {
    return 'Password must contain 8 characters or more'
  }
  return ''
}

export const username = (username) => {
  if (username && !/[a-zA-Z0-9-]/.test(username)) {
    return 'Username must only contain alphanumeric characters'
  }
  return ''
}

export const required = value => value ? undefined : 'Required'

export const cleanPassword = (password) => {
  return password.replace(/[ \t]/g, '')
}
