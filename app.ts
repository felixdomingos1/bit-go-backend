import express from 'express';
import viagemRoutes from './src/routes/viagemRoutes';

const app = express();
import cors from 'cors';


app.use(cors());
app.use(express.json());
app.use('/viagens', viagemRoutes); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
