const router = require('express').Router()
const User = require('../models/Users')
const jwt = require('jsonwebtoken')
const {registerValidation,loginValidation} = require('../validation')
const bcrypt = require('bcryptjs')



// route pour s'enregistrer sur la plateforme
router.post('/register', async(req,res) => {


    //On valide les donnees avant de les envoyer dans la base de donnnes
    const {error} = registerValidation(req.body)
    
    if(error) return res.status(400).send(error.details[0].message)

    // Verifier si l'email est deja dans la bd

    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send("l'email existe deja")
    

    // crypter le mot de passe

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)



    const user = new User({
        name: req.body.name,
        email : req.body.email,
        password : hashPassword
    });

    try {
        const savedUser = await user.save()
        res.send({user :user.id})
    } catch (error) {
        res.status(400).send(error)
    }

})


// route pour se connecter
router.post('/login', async(req,res) =>{
    const {error} = loginValidation(req.body);

    if(error) return res.status(400).send(error.details[0].message)

    // Verifier si l'email est deja dans la bd

    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send("votre email ou le mot de passe ne corresondent pas!")

    // verifier si le mot de passe est juste
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send("mot de passe incorrect")


    res.send('OK')

     // on use maintenant JWT
     const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
     res.header('auth-token', token).send
 
})

module.exports = router;