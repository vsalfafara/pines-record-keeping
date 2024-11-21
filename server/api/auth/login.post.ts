import { db } from "~/db";
import { users } from "~/db/schema";

type Credentials = {
  email: string;
  password: string;
};

export default defineEventHandler(async (event) => {
  const body = await readBody<Credentials>(event);

  const user = await db.query.users.findFirst({
    where: (_, { eq }) => eq(users.email, body.email),
  });

  if (!user) {
    setResponseStatus(event, 403);
    return {
      message: "Email does not exist",
    };
  }

  const isPasswordCorrect = await verifyPassword(user.password, body.password);

  if (!isPasswordCorrect) {
    setResponseStatus(event, 403);
    return {
      message: "Invalid Credentials",
    };
  }

  const { password: _password, ...data } = user;

  await setUserSession(event, {
    user: {
      ...data,
    },
  });
});
