
const showError = (res) => {
    return res.status(500).json({
        message: "Server error"
    })
}

export default showError;