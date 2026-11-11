import { v4 as uuidv4 } from "uuid";

class FileService {
  async saveFile(file) {
    try {
      // проверяем поступил ли файл сюда
      if (!file) {
        throw new Error("Файл не передан");
      }

      const MAX_SIZE = 5 * 1024 * 1024;

      if (file.size > MAX_SIZE) {
        throw new Error("Файл слишком большой.Максимум 5 МБ.");
      }

      const typesImage = ['image/jpeg' , 'image/jpg' , 'image/png' , 'image/gif' , 'image/webp']

      if(!typesImage.includes(file.mimetype)){
        throw new Error("Недопустимый формат. Разрешены только JPG, JPEG, PNG, WEBP, GIF.")
      }

      const fileType = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileType}`;
      const filePath = `./uploads/${fileName}`;



      await file.mv(filePath);

      return filePath;
    } catch (err) {
        throw new Error("Ошибка при добавлении картинки: " + err)
        
    }
  }
}

export default new FileService();
