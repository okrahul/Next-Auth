import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export const POST = async (request: NextRequest) => {
  const userId = await getDataFromToken(request);
  const user = User.findOne({ _id: userId }).select("-password ");
  // check user is here
  return NextResponse.json({
    message: "User found",
    data: user,
  });
};
