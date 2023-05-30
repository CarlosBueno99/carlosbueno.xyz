/* eslint-disable */
// @ts-nocheck
import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import Cognito from "@auth/core/providers/cognito";
import { 
  GITHUB_ID,
  GITHUB_SECRET, 
  OWNER_EMAIL, 
  GOOGLE_CLIENT_ID, 
  GOOGLE_CLIENT_SECRET,
  COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET,
  COGNITO_ISSUER} from "$env/static/private";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "$lib/server/prisma"
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

async function authorization({ event, resolve }) {
  // Protect any routes under /discord
  if (event.url.pathname.startsWith("/discord")) {
    const session = await event.locals.getSession();
    if (!session) {
      throw redirect(303, "/auth");
    } else if (session.user.email !== OWNER_EMAIL){
      throw redirect(303, "/auth");
    }
  }

  const response = await resolve(event)
  

  
  return response;
}


export const handle: Handle = sequence(
  SvelteKitAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
      GitHub({ 
        clientId: GITHUB_ID, 
        clientSecret: GITHUB_SECRET 
      }),
      Google({ 
        clientId: GOOGLE_CLIENT_ID, 
        clientSecret: GOOGLE_CLIENT_SECRET 
      }),
      Cognito({
        clientId: COGNITO_CLIENT_ID,
        clientSecret: COGNITO_CLIENT_SECRET,
        issuer: COGNITO_ISSUER,
      }),
    ],
  }),
  authorization
);
