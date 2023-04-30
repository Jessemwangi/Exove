/** For creating conversions from mongoose json objects to json objects matching frontend data requirements */
import { ITemplates } from "../dbcontext/Interfaces.js";

/** interfaces in frontend format */
interface ISection {
    name: string,
    questions: IQuestion[]

}

interface IQuestion {
    question: string,
    isFreeForm: boolean

}

class TemplateClass {
    templateTitle: string;
    preface: string[];
    prefilledQuestions: string[];
    gradingGuidance: string[];
    sections: ISection[];

    constructor(
        templateTitle:string, 
        preface:string[], 
        prefilledQuestions: string[], 
        gradingGuidance: string[], 
        sections: ISection[]) 
        {
        this.templateTitle = templateTitle;
        this.preface = preface;
        this.prefilledQuestions = prefilledQuestions;
        this.gradingGuidance = gradingGuidance; 
        this.sections = sections;
    }
}

export const templateConverter = (template:ITemplates)=>{

    /*
    const newTemplate = new TemplateClass(
        template.templateTitle,   
        template.instructions, //assume this is the intro text not grading instructions
        template.categories.prefilled, //prefilledQuestions should perhaps be a separate property in mongodb schema for simplification
        template.instructions, //standin for new gradingGuidance property,
        template.categories
    )
    */

    /* functions for preparing large text blocks so they can be more easily displayed in components. we can join them back together when saving to db.  */ 
    function toStringArray(string:string){
        let arr; 
        arr = string.split('/n')

    }
    
}




