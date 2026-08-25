import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return Response.json({ message: "Logout is done" });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
