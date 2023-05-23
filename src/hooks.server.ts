/* eslint-disable */
// @ts-nocheck
import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import { GITHUB_ID, GITHUB_SECRET, OWNER_EMAIL } from "$env/static/private";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

async function authorization({ event, resolve }) {
  // Protect any routes under /discord
  if (event.url.pathname.startsWith("/discord")) {
    const session = await event.locals.getSession();
    console.log(session.user.email);
    
    if (!session) {
      throw redirect(303, "/auth");
    }

    if (session.user.email === OWNER_EMAIL){ // I'll change this section for a better way to authorize users
      throw redirect(401, "/auth?message=you are not authorized to access this page");
    }
    
  }

  // If the request is still here, just proceed as normally
  return resolve(event);
}


export const handle: Handle = sequence(
  SvelteKitAuth({
    providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
  }),
  authorization
);
