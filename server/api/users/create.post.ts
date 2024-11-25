import { db } from "~/db";
import { users } from "~/db/schema";
import type { NewUser } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const body: NewUser = await readBody(event);
  const emailExists = await db.query.users.findFirst({
    where: (_, { eq }) => eq(users.email, body.email),
  });

  if (emailExists) {
    setResponseStatus(event, 403);
    return {
      message: "Email already exists",
    };
  }

  const hashedPassword = await hashPassword(body.password);

  try {
    const user = await db
      .insert(users)
      .values({
        ...body,
        password: hashedPassword,
      })
      .returning();
    return {
      message: `User ${user[0].firstName} ${user[0].lastName} has been created`,
    };
  } catch (error) {
    return {
      error,
    };
  }
});
