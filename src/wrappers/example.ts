import Pateo from "pateo";

type Language = "en" | "ru";

export const language = new Pateo.StaticWrapper<Language>("en");

export const greetingButtonTexts = new Pateo.DynamicWrapper(language, language => {
    switch (language) {
        default:
            console.error("No value!");
        case "en":
            return { hide: "Hide", show: "Show" };
        case "ru":
            return { hide: "Спрятать", show: "Показать" };
    }
});

export const greetingText = new Pateo.DynamicWrapper(language, language => {
    switch (language) {
        default:
            console.error("No value!");
        case "en":
            return "Hello World!";
        case "ru":
            return "Привет Мир!";
    }
});

export const greetingVisible = new Pateo.StaticWrapper(true);