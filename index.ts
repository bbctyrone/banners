import definePlugin, { OptionType } from "@vencord/types/plugins";
import { findByPropsLazy } from "@vencord/types/webpack";

const UserStore = findByPropsLazy("getCurrentUser");

export default definePlugin({
    name: "Free Banner",
    description: "Set any banner without Nitro or approval",
    authors: [{ name: "You", id: "0" }],
    
    options: {
        bannerUrl: {
            type: OptionType.STRING,
            description: "Banner image URL",
            default: ""
        }
    },

    commands: [
        {
            name: "banner",
            description: "Set your banner",
            inputType: 1,
            options: [
                {
                    name: "url",
                    description: "Image URL",
                    type: 3,
                    required: true
                }
            ],
            execute: async (args) => {
                const url = args[0]?.value;
                if (!url) return { content: "❌ No URL" };
                
                try {
                    const res = await fetch(url);
                    const blob = await res.blob();
                    const reader = new FileReader();
                    
                    reader.onload = async () => {
                        await fetch("https://discord.com/api/v9/users/@me", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ banner: reader.result })
                        });
                    };
                    reader.readAsDataURL(blob);
                    
                    return { content: "✅ Banner set!" };
                } catch (e) {
                    return { content: `❌ Error: ${e.message}` };
                }
            }
        }
    ]
});
