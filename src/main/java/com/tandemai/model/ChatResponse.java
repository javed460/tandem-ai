package com.tandemai.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatResponse {
    private String gptReply;
    private String geminiReply;
    private String gptError;
    private String geminiError;
}