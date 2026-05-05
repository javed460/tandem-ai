package com.tandemai.service;

import com.tandemai.model.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final OpenAiService openAiService;
    private final GeminiService geminiService;

    public ChatResponse chat(String prompt) {
        CompletableFuture<String> gptFuture = CompletableFuture.supplyAsync(() ->
                openAiService.chat(prompt)
        );

        CompletableFuture<String> geminiFuture = CompletableFuture.supplyAsync(() ->
                geminiService.chat(prompt)
        );

        ChatResponse response = new ChatResponse();

        try {
            response.setGptReply(gptFuture.get());
        } catch (Exception e) {
            response.setGptError("ChatGPT error: " + e.getMessage());
        }

        try {
            response.setGeminiReply(geminiFuture.get());
        } catch (Exception e) {
            response.setGeminiError("Gemini error: " + e.getMessage());
        }

        return response;
    }
}