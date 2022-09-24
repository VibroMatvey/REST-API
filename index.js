function randomKeyGenerator() {
    const letters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let word = ''

    for (let i = 0; i < 6; i++) {
        word += letters.charAt(Math.floor(Math.random() * letters.length))
    }

    const randomKey = word.substring(0, 5) + word.substring(5, 5) + word.substring(10, 5)

    return randomKey.toUpperCase()
}

export { randomKeyGenerator }