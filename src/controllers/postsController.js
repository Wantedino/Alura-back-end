import {getTodosPosts, criarNovoPost, atualizarPost} from '../models/postsModels.js';
import fs from 'fs';
import gerarDescricaoComGemini from '../services/geminiService.js';


export async function listarPosts (req, res)  {
    const posts = await getTodosPosts();
    res.status(200).json(posts);
}

export async function postarNovo (req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarNovoPost(novoPost);
        res.status(201).json(postCriado);
    }catch(err){
        console.error(err.message)
        res.status(500).json({"erro": "Erro ao criar novo post"});
    }
}

export async function uploadImagem (req, res) {
    const novoPost = {
        descricao: "",
        urlImg: req.file.originalname,
        alt: ""
    }
    try {
        const postCriado = await criarNovoPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        fs.renameSync(req.file.path, imagemAtualizada);
        res.status(201).json(postCriado);
    }catch(err){
        console.error(err.message)
        res.status(500).json({"erro": "Erro ao criar novo post"});
    }
}

export async function atualizarNovoPost (req, res) {
    const id = req.params.id;
    const ulrImagem = `http://localhost:3000/${id}.png`;
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        const post = {
            descricao: descricao,
            urlImg: ulrImagem,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post);
        res.status(201).json(postCriado);
    }catch(err){
        console.error(err.message)
        res.status(500).json({"erro": "Erro ao criar novo post"});
    }
}