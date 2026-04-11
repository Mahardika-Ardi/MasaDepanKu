import { createError } from "../utils/http_error.js";
import UseranswerRepository from "./useranswer.repository.js";

class UseranswerService {
  async create(data) {
    const saveAnswer = await UseranswerRepository.create(data);

    if (!saveAnswer) {
      return createError("Failed saving answer", "BAD_REQUEST");
    }

    return saveAnswer;
  }

  async findall(id) {
    const showAllAnswer = await UseranswerRepository.findAll(id);

    if (!showAllAnswer) {
      return createError("Failed showing answer!", "NOT_FOUND");
    }

    return showAllAnswer;
  }
}

export default new UseranswerService();
