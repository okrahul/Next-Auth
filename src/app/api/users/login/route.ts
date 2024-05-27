import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log("reqBody", reqBody);

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "user does not exist" },
        { status: 400 }
      );
    }

    console.log("user exist");

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "check your credentials" },
        { status: 400 }
      );
    }

    // json web token

    const tokenData = {
      id: user._id,
      name: user.username,
      email: user.email,
    };

    // function sign(payload: string | object | Buffer, secretOrPrivateKey: jwt.Secret, options?: jwt.SignOptions | undefined): string (+4 overloads)

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      { message: "Login success", success: true },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
