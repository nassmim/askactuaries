/* eslint-disable camelcase */
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@actions/user.actions";
import { NextResponse } from "next/server";
import { pages } from "@constants";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const eventType = evt.type;

  let dataToSend;
  switch (eventType) {
    case "user.created":
    case "user.updated": {
      const {
        id,
        email_addresses,
        image_url,
        username,
        first_name,
        last_name,
      } = evt.data;

      const userData = {
        email: email_addresses[0].email_address,
        name: `${first_name}${last_name ? " " + last_name : ""}`,
        username: username!,
        picture: image_url,
      };

      if (eventType === "user.created") {
        dataToSend = await createUser({
          clerkId: id,
          ...userData,
        });
      } else {
        dataToSend = await updateUser({
          clerkId: id,
          updateData: userData,
          path: `/${pages.profile}/${id}`,
        });
      }
      break;
    }

    case "user.deleted": {
      const { id } = evt.data;
      dataToSend = await deleteUser({
        clerkId: id!,
      });
      break;
    }
  }

  return NextResponse.json({ message: "OK", data: dataToSend });
}
