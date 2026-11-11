import fileService from "../services/fileService.js";
import User from "../models/User.js";
import hashService from "../services/hashService.js";
import tokenService from "../services/tokenService.js";

class UserController {
  // получение всех пользовталей
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(404).json("Ошибка при получении пользователей: " + err);
    }
  }

  async getUserOne(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        res.status(404).json("Такого пользователя не существует!");
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json("Ошибка при выполнении запроса: " + err);
    }
  }

  async registration(req, res) { // Асинхронный метод обработки регистрации пользователя
    try { // Блок try для отлова возможных ошибок
      let fileName = null; // Переменная для имени сохранённого файла аватара (по умолчанию null)
  
      if (req.files && req.files.avatar) { // Проверяем, был ли загружен файл аватара в запросе
        fileName = await fileService.saveFile(req.files.avatar); // Сохраняем файл и получаем его имя
      }
  
      const { name, lastName, age, email, password } = req.body; // Деструктурируем данные пользователя из тела запроса
  
      const candidate = await User.findOne({ email }); // Ищем в БД пользователя с таким же email
  
      if (candidate) { // Если такой пользователь уже существует
        return res
          .status(400)
          .json({ message: "Пользователь с таким email уже существует" }); // Возвращаем ошибку 400
      }
  
      const hashPassword = await hashService.hashPassword(password); // Хешируем пароль через HashService
    
      const newUser = await User.create({ // Создаём нового пользователя в БД
        name,
        lastName,
        age,
        email,
        password: hashPassword, // Сохраняем именно хеш, а не сам пароль
        avatar: fileName, // Имя файла аватара (может быть null)
      });
  
      res.status(200).json(newUser); // Отправляем клиенту данные созданного пользователя
      newUser.save(); // ⚠️ Лишняя строка: User.create() уже сохранил документ в БД, этот вызов не нужен
    } catch (err) { // Если произошла ошибка
      res.status(500).json("Ошибка при регистрации: " + err); // Отправляем клиенту ошибку 500
      console.log("Ошибка при регистрации!" + err); // Логируем ошибку на сервере
    }
  }
  
  async authorization(req, res) { // Асинхронный метод авторизации (входа) пользователя
    try { // Блок try для отлова ошибок
      const { email, password } = req.body; // Деструктурируем email и пароль из тела запроса
  
      const user = await User.findOne({ email }); // Ищем пользователя по email в БД
      if (!user) { // Если пользователь не найден
        res.status(400).json("Неверный логин или пароль1") // ⚠️ Нет return! Код пойдёт дальше
      }
      const isPassValid = await hashService.comparePassword(password, user.password); // Сравниваем пароль с хешем из БД
  
      if (!isPassValid) { // Если пароль не совпал
        res.status(400).json("Неверный логин или пароль2") // ⚠️ Нет return! Код пойдёт дальше
      }
      const token = tokenService.generateToken({          // создаём JWT: вызываем метод сервиса и передаём объект-payload
        id: user._id                                    // в payload кладём только id пользователя (из MongoDB)
    })                                                  // закрываем вызов; в token сохранится подписанная строка-JWT
    
    return res.status(200).json({token, user:{          // отправляем клиенту 200 OK + JSON; token — сокращённая запись {token: token}
        id:user._id,                                    // в объекте user отдаём id пользователя
        email:user.email                                // и email; пароль/хеш и прочее не отдаём
    } })                                                // закрываем объект user, тело ответа и вызов res.json()
      
    } catch (error) { // Если произошла ошибка
      res.status(500).json("Ошибка при авторизации") // Отправляем клиенту ошибку 500
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, lastName, age } = req.body;
      const updateUser = await User.findByIdAndUpdate(
        id,
        {
          name,
          lastName,
          age,
        },
        { new: true }
      );
      if (!updateUser) {
        res.status(404).json("Такого пользователя не существует!");
      }
      res.status(200).json(updateUser);
    } catch (err) {
      res.status(500).json("Ошибка при обновлении: " + err);
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        res.status(404).json("Такого пользователя не существует!");
      }
      res.status(200).json("Пользователь успешно удален!");
    } catch (err) {
      res.status(500).json("Ошибка при выполнении запроса: " + err);
    }
  }
}

export default new UserController();
