import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/models/User.model";
import { usernameValidation } from "@/schemas/signupSchema";

const usernameQuerrySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
 
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = { username: searchParams.get("username") };

    //validate with zod
    const result = usernameQuerrySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const user = await UserModel.findOne({ username,isVerified:true });
    if (user) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }
    return Response.json({
      success: true,
      message: "username available",
    });
  } catch (error) {
    console.log("error checking username: ", error);
    return Response.json({
      success: false,
      message: "error checking username",
    });
  }
}
