import { createError } from "../utils/http_error.js";
import Testsessionrepository from "./testsession.repository.js";

class TestsessionService {
  async find(id) {
    const find = await Testsessionrepository.find(id);

    if (!find) {
      return null;
    }

    return find;
  }

  async finish(id) {
    const finish = await Testsessionrepository.finish(id);

    if (!finish) {
      throw createError("Failed finishing test session", "BAD_REQUEST");
    }

    return finish;
  }

  async cancel(id) {
    const cancel = await Testsessionrepository.cancel(id);

    if (!cancel) {
      throw createError("Failed canceling test session", "BAD_REQUEST");
    }

    return cancel;
  }
}

export default new TestsessionService();
