import express from 'express';
import routes from './src/routes/postsRoutes.js';

const app = express();
app.use(express.static('uploads'));//para servir arquivos estáticos
routes(app);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

