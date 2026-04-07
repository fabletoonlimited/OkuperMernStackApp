// /api/admin/revoke

export async function POST(req) {
  await dbConnect();

  const { adminId } = await req.json();

  await SuperAdmin.findByIdAndUpdate(adminId, {
    role: "revoked",
  });

  return NextResponse.json({ success: true });
}