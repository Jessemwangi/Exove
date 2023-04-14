export const answer = async (req, res) => {
    try {
        const { answers } = req.body;
        res.status(200).send('Feedback submitted successfully');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
//# sourceMappingURL=c_quesController.js.map