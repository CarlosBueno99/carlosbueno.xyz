/* eslint-disable */
// @ts-nocheck
import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import Cognito from "@auth/core/providers/cognito";
import { 
  GITHUB_ID,
  GITHUB_SECRET,
  GOOGLE_CLIENT_ID, 
  GOOGLE_CLIENT_SECRET,
  COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET,
  COGNITO_ISSUER} from "$env/static/private";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

async function authorization({ event, resolve }) {
  // Protect any routes under /discord
  if (event.url.pathname.startsWith("/discord")) {
    const session = await event.locals.getSession();

    console.log('discord');
    
    if (!session) {
      throw redirect(303, "/auth");
    } else if (session.user.role !== "ADMIN"){
      throw redirect(303, "/auth");
    }
  }

  const response = await resolve(event)
  

  
  return response;
}


export const handle: Handle = sequence(
  SvelteKitAuth({
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
    callbacks: {
      async session({session, token}) {
        
        if (user){
          session.user.id = token.id,
          session.user.name = token.name,
          session.user.email = token.email,
          session.user.image = token.image,
          session.user.role = token.role,
          session.user.subscription = token.subscription
          session.user.token = token.accessToken
        }
        return session
      }
    }
  }),
  authorization
);


export const handleError = (async ({ error, event }) => {
  const errorId = crypto.randomUUID();
  console.log("that's weird");
  console.log(event.request.headers.get('cf-ipcountry'));
  console.log(event.request.headers.get('cf-ray'));
  console.log(event.request.headers.get('cf-connecting-ip'));
  console.log(event.request.headers)
  console.log(errorId);
  
  return {
      message: 'Whoops!',
      errorId
  };
}) satisfies HandleServerError;