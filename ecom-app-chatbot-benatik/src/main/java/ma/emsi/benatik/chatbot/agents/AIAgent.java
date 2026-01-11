package ma.emsi.benatik.chatbot.agents;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;

@Component
public class AIAgent {
        private final ChatClient chatClient;

        public AIAgent(ChatClient.Builder builder,
                        ObjectProvider<ToolCallbackProvider> toolProvider) {

                ToolCallbackProvider tools = toolProvider
                                .getIfAvailable(() -> () -> new org.springframework.ai.tool.ToolCallback[0]);

                this.chatClient = builder
                                .defaultSystem("""
                                                Vous un assistant qui se charge de répondre aux question
                                                de l'utilisateur en fonction du contexte fourni.
                                                Si aucun contexte n'est fourni, répond avec JE NE SAIS PAS
                                                """)
                                .defaultToolCallbacks(tools)
                                .build();
        }

        public String askAgent(String query) {
                return chatClient.prompt()
                                .user(query)
                                .call().content();
        }
}