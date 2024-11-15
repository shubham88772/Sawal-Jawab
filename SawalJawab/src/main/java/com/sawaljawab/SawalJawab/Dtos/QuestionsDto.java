package com.sawaljawab.SawalJawab.Dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
@Getter
@Setter
public class QuestionsDto {
    private String title;
    private String content;
    private List<String> tag;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String categoryName;
}
