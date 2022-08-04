const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.post('/', async (req, res)=>{
    const { name, email, password, confirmpassword } = req.body;

    if(!name){
        return res.status(422).json({msg: "Nome Obrigatório"});
    }
    if(!email){
        return res.status(423).json({msg: "Email Obrigatório"});
    }
    if(!password){
        return res.status(424).json({msg: "Senha Obrigatória"});
    }
    if(password !== confirmpassword){
        return res.status(425).json({msg: "As Senhas devem ser Iguais"});
    }
    const userExists = await User.findOne({email: email});

    if(userExists){
        return res.status(422).json({msg: "Usuário já existe"});
    }


    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);


    const user = new User({
        name,
        email,
        password: hashPassword
    })
    try{
        await User.create(user);
        res.status(201).json({msg: "Usuário criado com sucesso"});
    } catch{
        res.status(500).json({msg: "Erro ao criar usuário"});
    } 
})
//private
router.get('/:id',checkToken , async (req, res)=>{
    const id = req.params.id;
    //check user exists
    const user = await User.findById(id, '-password');
    if(!user){
        return res.status(404).json({msg: "Usuário não existe"});
    }
    res.status(200).json({user});
})


function checkToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // split to get the second value of the header

    if(!token){
        return res.status(401).json({msg: "Não autorizado"});
    }
    try{
        const secret = process.env.SECRET;
        jwt.verify(token, secret);
        next();
    } catch (error){
        console.log(error);
        res.status(400).json({msg: "token invalido"});
    }
}
// should include another mothod to check if the user is logged in
module.exports = router;