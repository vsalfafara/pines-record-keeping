import { eq } from "drizzle-orm";
import { db } from "~/db";
import { users } from "~/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    let user: any = null;

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
      user = await db
        .delete(users)
        .where(eq(users.id, parseInt(id)))
        .returning();
      return {
        message: `User ${user.firstName} ${user.lastName} has been deleted`,
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
