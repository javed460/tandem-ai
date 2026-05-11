# Tandem AI

Compare ChatGPT and Gemini side by side — ask once, get two perspectives instantly.

---

## What it does

Tandem AI sends your prompt to both ChatGPT (GPT-4o) and Gemini (2.0 Flash) simultaneously and displays their responses in a clean split-screen UI. No switching tabs, no multiple subscriptions required on the UI side.

---

## Tech Stack

| Layer | Technology                    |
|-------|-------------------------------|
| Language | Java 21                       |
| Framework | Spring Boot 3.4.1             |
| Templating | Thymeleaf                     |
| Frontend | HTML + CSS + Vanilla JS       |
| Build | Maven                         |
| Utilities | Lombok |
| Database | None                          |


## Prerequisites

- Java 21+
- Maven 3.8+
- An OpenAI API key → [platform.openai.com](https://platform.openai.com)
- A Gemini API key → [aistudio.google.com](https://aistudio.google.com)

---

## Getting Started

### 1. Clone or create the project

Set up the folder structure as shown above and place each file in its correct location.

### 2. Add your API keys

Open `src/main/resources/application.yml` and replace the placeholders:

```yaml
tandemai:
  openai:
    api-key: your-openai-api-key-here
  gemini:
    api-key: your-gemini-api-key-here
```

Or set them as environment variables (recommended for production):

### 3. Run the app

```bash
mvn spring-boot:run
```

### 4. Open in browser

```
http://localhost:8084
```

---

## How it works

```
User types prompt
       │
       ▼
  chat.js (POST /api/chat)
       │
       ▼
  ChatController
       │
       ▼
  ChatService
  ┌────┴────┐
  │         │   (CompletableFuture — runs in parallel)
  ▼         ▼
OpenAI   Gemini
  │         │
  └────┬────┘
       ▼
  ChatResponse (both replies)
       │
       ▼
  chat.js renders both panels
```

Both AI calls are made in parallel using `CompletableFuture`, so you get both responses as fast as the slower of the two — not the sum of both wait times.

---

## Configuration Reference

```yaml
server:
  port: 8084                          # change if 8084 is in use

tandemai:
  openai:
    api-key: ${OPENAI_API_KEY}        # env var or hardcode for local dev
    model: gpt-4o                     # change to gpt-4-turbo, gpt-3.5-turbo etc.
  gemini:
    api-key: ${GEMINI_API_KEY}
    model: gemini-2.0-flash           # change to gemini-1.5-pro etc.
```
