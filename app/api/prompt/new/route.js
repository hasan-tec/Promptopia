import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const POST = async (req) => {
    try {
        const { userId, prompt, tag } = await req.json();
        await connectToDB();
        
        const newPrompt = new Prompt({
            creator: userId,
            prompt,
            tag
        });

        await newPrompt.save();
        return new Response(JSON.stringify(newPrompt), { status: 200 });
    } catch (error) {
        console.error("Error saving new prompt:", error);
        return new Response(`Failed to create new prompt: ${error.message}`, { status: 500 });
    }
}
