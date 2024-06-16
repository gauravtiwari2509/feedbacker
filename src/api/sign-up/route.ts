import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User.model";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserUN = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserUN) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }
    const existigUserEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existigUserEmail) {
      if (existigUserEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "user already exist with this email",
          },
          { status: 400 }
        );
      }
      else{
        const hashedPassword=await bcrypt.hash(password,12);
        existigUserEmail.password=hashedPassword;
        existigUserEmail.verifyCode=verifyCode;
        existigUserEmail.verifyCodeExpire=new Date(Date.now()+3600000)
        await existigUserEmail.save()
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpire: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "user registered successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error registering user ", error);
    return Response.json(
      {
        success: false,
        message: "error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
