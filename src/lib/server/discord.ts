import { OWNER_ID ,DISCORD_WEBHOOK_ID_OTAKUS, DISCORD_WEBHOOK_ID_SDC, DISCORD_WEBHOOK_TOKEN_OTAKUS, DISCORD_WEBHOOK_TOKEN_SDC, DEPLOY_STAGE } from '$env/static/private';
import { botMessageInput, botInput, webhookSchema } from "$lib/zodSchemas/discord";
import { prisma } from "$lib/server/prisma"
import type { z } from "zod"


type botInput = z.infer<typeof botInput>;
type discordWebhook = z.infer<typeof webhookSchema>


// -> post message
export const postMessage = async (message: string, user: string) => {
    let postMessageURL = ""
    if (DEPLOY_STAGE === "production") {
        postMessageURL = "https://discordapp.com/api/webhooks/" + DISCORD_WEBHOOK_ID_OTAKUS + "/" + DISCORD_WEBHOOK_TOKEN_OTAKUS
    } else {
        postMessageURL = "https://discordapp.com/api/webhooks/" + DISCORD_WEBHOOK_ID_SDC + "/" + DISCORD_WEBHOOK_TOKEN_SDC
    }

    const input = botMessageInput.parse({ message, user })

    let payload = {}

    if (input.user == "Ifood do PUBG") {
        payload = {
            "username": input.user,
            "avatar_url": "https://braziljournal.com/wp-content/uploads/2022/06/ff8d8125-4953-33f5-3275-07635092fab6.jpg",
            "content": input.message

        }
    } else if (input.user == "Deuses do CS") {
        payload = {
            "username": input.user,
            "avatar_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Cima_da_Conegliano%2C_God_the_Father.jpg/300px-Cima_da_Conegliano%2C_God_the_Father.jpg",
            "content": input.message
        }
    } else {
        payload = {
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



    return { status: response.status }
}

// -> database functions


// -> discord Bots section

export const createBot = async (bot: botInput) => {
    const parsedInput = botInput.parse(bot)

    return await prisma.discordBot.create({ data: parsedInput });
}

export const deleteBot = async (botId: string) => {
    
    try {
        await prisma.discordBot.delete({
            where: {
                id: botId,
            },
        })
        return {
            sucess: true,
            action: "delete",
            message: `you sucessfully deleted bot ${botId}`
          };
    } catch (error) {
        return {
            success: false
        }
    }
}


// -> webhooks section
export const createWebhook = async () => {

    const testInput: discordWebhook = {
        name: "webhook1",
        webhookUrl: "http://asd.com/asd/asd",
        ownerId: OWNER_ID
    }

    const parsedInput = webhookSchema.parse(testInput)

    await prisma.discordWebhook.create({
        data: parsedInput
    })

    return { success: true };
}