import { NextResponse, type NextRequest } from "next/server";
export function middleware(req: NextRequest) {
  console.log("middleware call hua hai");
  console.log(req.nextUrl);
  const res = NextResponse.next();
  res.headers.append(
    "ACCESS-CONTROL-ALLOW-ORIGIN",
    "https://www.chotilulli.life"
  );

  res.headers.append(
    "ACCESS-CONTROL-ALLOW-METHODS",
    "GET, DELETE , PATCH, PUT, POST"
  );
  return res;
}

export const config = {
  match: ["api/:path*"],
};
