export const getQuestions = (req, res) => {
    res.send(`get question land here`);
};
const addQuestion = async (req, res) => {
    const questionHttpData = req.body;
    if (!questionHttpData) {
        res.status(404).json("Post data not found or empty");
        return;
    }
};
//# sourceMappingURL=questionController.js.map