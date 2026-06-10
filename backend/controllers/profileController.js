


export const getMe = async (req,res) => {
    
    try {
    if(!req.user){
        return res.status(404).json({
            message: "User not found"
        })
    }

    return res.status(200).json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role 
    })
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      }) 
    }
}