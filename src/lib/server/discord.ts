import { DISCORD_WEBHOOK_ID_OTAKUS, DISCORD_WEBHOOK_ID_SDC, DISCORD_WEBHOOK_TOKEN_OTAKUS, DISCORD_WEBHOOK_TOKEN_SDC, DEPLOY_STAGE } from "$env/static/private";
import { tursoClient } from "$lib/server/client";
import { error } from "@sveltejs/kit";

export async function postMessage(message: string, user: string) {
    let postMessageURL = "";
    if (DEPLOY_STAGE === "production") {
        postMessageURL = "https://discordapp.com/api/webhooks/" + DISCORD_WEBHOOK_ID_OTAKUS + "/" + DISCORD_WEBHOOK_TOKEN_OTAKUS;
    } else {
        postMessageURL = "https://discordapp.com/api/webhooks/" + DISCORD_WEBHOOK_ID_SDC + "/" + DISCORD_WEBHOOK_TOKEN_SDC;
    }

    let payload = {
        username: user,
        content: message,
        avatar_url: ""
    };

    switch (user) {
        case "Ifood do PUBG":
            payload.avatar_url = "https://braziljournal.com/wp-content/uploads/2022/06/ff8d8125-4953-33f5-3275-07635092fab6.jpg";
            break;
        case "Deuses do CS":
            payload.avatar_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Cima_da_Conegliano%2C_God_the_Father.jpg/300px-Cima_da_Conegliano%2C_God_the_Father.jpg";
            break;
        case "Princesa Zelda":
            payload.avatar_url = "https://criticalhits.com.br/wp-content/uploads/2021/04/Zelda.jpg";
            break;
        default:
            payload.avatar_url = "https://capitalsocial.cnt.br/wp-content/uploads/2015/01/fiscal.jpg";
    }

    const response = await fetch(postMessageURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw error(response.status, 'Failed to post message to Discord');
    }

    return { status: response.status };
}

export async function createBot(formData: FormData) {
    const name = formData.get('name')?.toString();
    const token = formData.get('token')?.toString();
    
    if (!name || !token) {
        throw error(400, 'Name and token are required');
    }

    try {
        await tursoClient.execute({
            sql: 'INSERT INTO discord_bots (name, token) VALUES (?, ?)',
            args: [name, token]
        });
    } catch (err) {
        console.error('Error creating bot:', err);
        throw error(500, 'Failed to create bot');
    }
}

export async function deleteBot(formData: FormData) {
    const id = formData.get('id')?.toString();
    
    if (!id) {
        throw error(400, 'Bot ID is required');
    }

    try {
        await tursoClient.execute({
            sql: 'DELETE FROM discord_bots WHERE id = ?',
            args: [id]
        });
    } catch (err) {
        console.error('Error deleting bot:', err);
        throw error(500, 'Failed to delete bot');
    }
}