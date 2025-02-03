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
  console.log('Request path:', event.url.pathname);
  
  // Protect any routes under /discord
  if (event.url.pathname.startsWith("/discord")) {
    const session = await event.locals.getSession();
    console.log('discord session', session);
    
    if (!session) {
      throw redirect(303, "/auth");
    } else if (session.user.role !== "ADMIN"){
      throw redirect(303, "/auth");
    }
  }

  // Protect tracking route
  if (event.url.pathname.startsWith("/tracking")) {
    const session = await event.locals.getSession();
    if (!session) {
      throw redirect(303, "/auth");
    }
  }

  // Protect exercise route
  if (event.url.pathname.startsWith("/exercise")) {
    const session = await event.locals.getSession();
    console.log('Exercise route session:', session);
    if (!session) {
      throw redirect(303, "/auth");
    }
  }

  const response = await resolve(event);
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
    trustHost: true,
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.image = user.image;
          token.role = user.email === 'carlosbueno.contato@gmail.com' ? 'ADMIN' : user.role;
          token.subscription = user.subscription;
          token.accessToken = user.accessToken;
        }
        return token;
      },
      async session({ session, token }) {
        console.log(session, token);
        if (token) {
          session.user.id = token.id;
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.image = token.image;
          session.user.role = token.email === 'carlosbueno.contato@gmail.com' ? 'ADMIN' : token.role;
          session.user.subscription = token.subscription;
          session.user.token = token.accessToken;
        }
        return session;
      }
    }
  }),
  authorization
);


export const handleError = (async ({ error, event }) => {
    const errorId = crypto.randomUUID();
    console.error('Server Error:', {
        error,
        message: error.message,
        stack: error.stack,
        cause: error.cause
    });
    
    return {
        message: error.message || 'An unexpected error occurred',
        errorId
    };
}) satisfies HandleServerError;

function getGoogleMapsUrl() {
    return `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
}

function getWazeUrl() {
    return `https://waze.com/ul?ll=${currentLocation.latitude},${currentLocation.longitude}&navigate=yes`;
}

function updateMap(location) {
    currentLocation = location;
    // Update map view and marker
    map.setView([location.latitude, location.longitude], 13);
    marker.setLatLng([location.latitude, location.longitude])
        .bindPopup(`Location: ${location.displayName}`)
        .openPopup();
    
    searchError = '';
}