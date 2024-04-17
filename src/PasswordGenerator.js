export default function PasswordGenerator(length, requirement) {
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
        password += characterPool[Math.floor(Math.random() * characterPool.length)];
    }
    // console.log(password)

    return password
}