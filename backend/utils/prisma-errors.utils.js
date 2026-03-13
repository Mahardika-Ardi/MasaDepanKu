import { Prisma } from "../generated/prisma/client.ts";

function prismaErrors(error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2000":
        return {
          message: "Value Too Long!",
          code: "BAD_REQUEST",
        };
      case "P2001":
        return {
          message: "Record Not Found!",
          code: "NOT_FOUND",
        };
      case "P2002":
        return {
          message: "Unique Constraint Failed!",
          code: "CONFLICT",
        };
      case "P2003":
        return {
          message: "Foreign Key Constraint Failed!",
          code: "CONFLICT",
        };
      case "P2004":
        return {
          message: "Constraint Failed!",
          code: "FAILED",
        };
      case "P2011":
        return {
          message: "Null Constraint Violation!",
          code: "UNDEFINED",
        };
      case "P2012":
        return {
          message: "Missing Required Value!",
          code: "MISSING_VALUE",
        };
      case "P2014":
        return {
          message: "Relation Violation!",
          code: "CONFLICT",
        };
      case "P2015":
        return {
          message: "Related Record Not Found!",
          code: "NOT_FOUND",
        };
      case "P2017":
        return {
          message: "Relation Connect Failed!",
          code: "RELATION_FAILED",
        };
      case "P2020":
        return {
          message: "Value Out Of Range!",
          code: "OUT_OF_RANGE",
        };
      case "P2021":
        return {
          message: "Table Does Not Exist!",
          code: "NOT_FOUND",
        };
      case "P2022":
        return {
          message: "Column Does Not Exist!",
          code: "NOT_FOUND",
        };
      case "P2024":
        return {
          message: "Connection Pool Timeout!",
          code: "CONNECTION_TIMEOUT",
        };
      case "P2025":
        return {
          message: "Record Not Found!",
          code: "NOT_FOUND",
        };

      default:
        return {
          message: "Database Error",
          code: "INTERNAL_SERVER_ERROR",
        };
    }
  }
}

export default prismaErrors;
