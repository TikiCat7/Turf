import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { teams, users } from "@/lib/db/schema";

const webhookSignatureSecret = process.env.CLERK_WEBHOOK_SIGNATURE_SECRET || "";

export async function verifyClerkWebhookSignature(request: Request) {
  const payloadString = await request.text();
  const headerPayload = headers();

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    throw new Error("Error occured -- no svix headers");
  }

  const svixHeaders = {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  };
  const wh = new Webhook(webhookSignatureSecret);
  return wh.verify(payloadString, svixHeaders) as WebhookEvent;
}

export async function POST(req: Request): Promise<Response> {
  console.log("inside the webhook callback /user");
  try {
    const payload = await verifyClerkWebhookSignature(req);
    const { type, data } = payload;

    switch (type) {
      // TODO: Store in user table
      case "user.created":
        console.log("user created!", data);
        await db.insert(users).values({
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          avatarUrl: data.image_url,
        });
        break;
      case "user.updated":
        console.log("user updated!", data);
        break;
      case "user.deleted":
        console.log("user deleted!", data);
        break;
      case "organization.created":
        console.log("organization created!", data);
        await db.insert(teams).values({
          clerkId: data.id,
          name: data.name,
          slug: data.slug!,
        });
        break;
    }
  } catch (e) {
    console.error("Could not verify signature.", e);
    return Response.json({ message: e }, { status: 400 });
  }
  return Response.json({ message: "ok, handled it" }, { status: 200 });
}
