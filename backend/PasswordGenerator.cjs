const crypto = require('node:crypto')
const util = require('util')

let randomInt = util.promisify(crypto.randomInt)

async function PasswordGenerator(length, requirement) {

    const characterSet = {
        alphabet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        numerals: "0123456789",
        symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?"
    }

    let characterPool = "";
    for (const key in requirement) {
        if (requirement[key]) {
            characterPool += characterSet[key]
        }
    }
    // console.log(characterPool)
    
    let password = "";
    for (let i = 0; i < length; i++) {
        password += characterPool[await randomInt(0, characterPool.length)];
    }
    // console.log(password)

    return password
}

module.exports = {
    PasswordGenerator
}