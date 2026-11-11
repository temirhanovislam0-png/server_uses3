import jwt from "jsonwebtoken"                       // импортируем библиотеку jsonwebtoken (для sign и verify)

const JWT_SECRET = "super_secret_key_123"           // секретный ключ для подписи токенов (⚠️ в проде — process.env.JWT_SECRET)

const JWT_EXPIRES_IN = "24h";                       // срок жизни токена — 24 часа (пойдёт в опцию expiresIn)

class TokenService{                                 // объявляем класс-сервис для работы с JWT
    generateToken(payload){                         // метод создания токена; payload — данные, которые кладём внутрь
        return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN}  /*Срок токена*/ ) // подписываем payload ключом; возвращаем готовую строку-JWT
    }                                               // конец generateToken

    validateAccessToken(token){                     // метод проверки токена; token — строка-JWT от клиента
        try {                                       // пытаемся проверить токен (может бросить ошибку)
            return jwt.verify(token, JWT_SECRET)    // проверяет подпись и срок; при успехе вернёт декодированный payload
        } catch (error) {                           // сюда попадём, если токен битый/поддельный/просрочен
            return null                             // возвращаем null — сигнал «токен невалиден»
        }                                           // конец catch
    }                                               // конец validateAccessToken

}                                                   // конец класса TokenService


export default new TokenService()                   // экспортируем готовый экземпляр (синглтон) — можно сразу вызывать методы