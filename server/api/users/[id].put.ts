import { eq } from "drizzle-orm";
import { db } from "~/db";
import { users } from "~/db/schema";
import type { NewUser } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const body: NewUser = await readBody(event);
    const id = getRouterParam(event, "id");
    let user: any = null;
    let hashedPassword = null;

    if (id) {
      user = await db.query.users.findFirst({
        where: eq(users.id, parseInt(id)),
      });
      if (!user) {
        setResponseStatus(event, 404);
        return {
          message: "User not found",
        };
      }

      const userExistingPassword = await db.query.users.findFirst({
        where: eq(users.id, parseInt(id)),
        columns: { password: true },
      });

      if (body.password) {
        hashedPassword = await hashPassword(body.password);
      }
      user = await db
        .update(users)
        .set({
          ...body,
          password: hashedPassword
            ? hashedPassword
            : userExistingPassword?.password,
        })
        .where(eq(users.id, parseInt(id)))
        .returning();

      return {
        message: `User ${user[0].firstName} ${user[0].lastName} has been updated`,
      };
    } else {
      setResponseStatus(event, 403);
      return {
        message: "Something went wrong",
      };
    }
  } catch (error) {
    return {
      error,
    };
  }
});
