import { z } from "zod";
import { DISCORD_WEBHOOK_ID_OTAKUS, DISCORD_WEBHOOK_ID_SDC, DISCORD_WEBHOOK_TOKEN_OTAKUS, DISCORD_WEBHOOK_TOKEN_SDC, DEPLOY_STAGE } from '$env/static/private';


let postMessageURL = ""

if (DEPLOY_STAGE === "production"){
    postMessageURL = "https://discordapp.com/api/webhooks/" + DISCORD_WEBHOOK_ID_OTAKUS + "/" + DISCORD_WEBHOOK_TOKEN_OTAKUS
} else {
    postMessageURL = "https://discordapp.com/api/webhooks/" + DISCORD_WEBHOOK_ID_SDC + "/" + DISCORD_WEBHOOK_TOKEN_SDC
}

const inputSchema = z.object({
    message: z.string(),
    user: z.string()
});

export const postMessage = async (message: unknown, user:unknown) => {
    const input = inputSchema.parse({message, user})

    let payload = {}

    if (input.user == "Ifood do PUBG"){
        payload ={
            "username": input.user,
            "avatar_url": "https://braziljournal.com/wp-content/uploads/2022/06/ff8d8125-4953-33f5-3275-07635092fab6.jpg",
            "content": input.message
            
        }
    } else if (input.user == "Deuses do CS") {
        payload ={
            "username": input.user,
            "avatar_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Cima_da_Conegliano%2C_God_the_Father.jpg/300px-Cima_da_Conegliano%2C_God_the_Father.jpg",
            "content": input.message  
        }
    } else {
        payload ={
            "username": input.user,
            "avatar_url": "https://capitalsocial.cnt.br/wp-content/uploads/2015/01/fiscal.jpg",
            "content": input.message  
        }
    }
    

    const response = await fetch(postMessageURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        redirect: "follow",
        body: JSON.stringify(payload)
    })

    
    
    return response.status
}