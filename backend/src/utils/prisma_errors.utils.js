import { Prisma } from "../../generated/prisma/client.ts";
import { createError } from "./http_error.utils.js";

function prismaErrors(error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2000":
        return createError("Value Too Long!", "BAD_REQUEST");
      case "P2001":
        return createError("Record Not Found!", "NOT_FOUND");
      case "P2002":
        return createError("Unique Constraint Failed!", "CONFLICT");
      case "P2003":
        return createError("Foreign Key Constraint Failed!", "CONFLICT");
      case "P2004":
        return createError("Constraint Failed!", "BAD_REQUEST");
      case "P2011":
        return createError("Null Constraint Violation!", "BAD_REQUEST");
      case "P2012":
        return createError("Missing Required Value!", "BAD_REQUEST");
      case "P2014":
        return createError("Relation Violation!", "CONFLICT");
      case "P2015":
        return createError("Related Record Not Found!", "NOT_FOUND");
      case "P2017":
        return createError("Relation Connect Failed!", "BAD_REQUEST");
      case "P2020":
        return createError("Value Out Of Range!", "BAD_REQUEST");
      case "P2021":
        return createError("Table Does Not Exist!", "NOT_FOUND");
      case "P2022":
        return createError("Column Does Not Exist!", "NOT_FOUND");
      case "P2024":
        return createError("Connection Pool Timeout!", "CONNECTION_TIMEOUT");
      case "P2025":
        return createError("Record Not Found!", "NOT_FOUND");

      default:
        return createError("Database Error", "INTERNAL_SERVER_ERROR");
    }
  }

  return null;
}

export default prismaErrors;
