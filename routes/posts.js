const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const verifyToken = require('../verifyToken')
const verifyUser = require('../verifyUser')

router.post("/",verifyToken, async(req, res)=>{
    const userId = req.user._id;
    const postData = new Post({
        title:req.body.title,
        description:req.body.description,
        createdBy:userId
    })
    try{
        const postToSave = await postData.save()
        res.send(postToSave)
    }catch(err){
        res.send({message:err})
    }
})


router.get('/', async (req,res) =>{
    try{
        const getPosts = await Post.find() 
        res.send(getPosts)
    }catch(err){
        res.send({message:err})
}
})

router.get('/:postId', async(req,res)=>{
    try{
        const postById = await Post.findById(req.params.postId)
        res.send(postById)
    }catch(err){
        res.send({message:err})
    }
})

router.patch('/:postId', verifyUser, async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                title: req.body.title,
                description: req.body.description,
                likes: req.body.likes
            },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).send({ message: 'Post not found' });
        }

        res.send(updatedPost);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
})

router.delete('/:postId', verifyUser, async(req,res)=>{
    try{
        const deletePostById = await Post.deleteOne({_id:req.params.postId})
        res.send(deletePostById)
    }catch(err){
        res.send({message:err})
    }
})
module.exports = router