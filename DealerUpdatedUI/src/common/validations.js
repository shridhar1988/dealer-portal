const NAME_REGEX = /^[a-zA-Z]*(([',. -][a-zA-Z])?[a-zA-Z]*)*$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const CONTACT_REGEX = /^(\[\-\s]?)?[0]?(91)?[789]\d{9}$/;


export const isValidName = (name) => {
    return NAME_REGEX.test(String(name))
}

export const isValidEmail = (email) => {
    return EMAIL_REGEX.test(String(email))
}

export const isValidContact = (contact) => {
    return CONTACT_REGEX.test(String(contact))
}
