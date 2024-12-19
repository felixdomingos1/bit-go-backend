import express from 'express';
import viagemRoutes from './routes/viagemRoutes';
import emailRoutes from './routes/emailRoutes';

const app = express();
import cors from 'cors';
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:5173', 'https://bit-go.vercel.app'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));


app.use(express.json());
app.use('/viagens', viagemRoutes); 
app.use('/email', emailRoutes); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
