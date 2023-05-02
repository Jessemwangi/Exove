class TemplateClass {
    templateTitle;
    preface;
    prefilledQuestions;
    gradingGuidance;
    sections;
    constructor(templateTitle, preface, prefilledQuestions, gradingGuidance, sections) {
        this.templateTitle = templateTitle;
        this.preface = preface;
        this.prefilledQuestions = prefilledQuestions;
        this.gradingGuidance = gradingGuidance;
        this.sections = sections;
    }
}
export const templateConverter = (template) => {
    function toStringArray(string) {
        let arr;
        arr = string.split('/n');
    }
};
//# sourceMappingURL=templateConverter.js.map