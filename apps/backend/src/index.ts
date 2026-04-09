import express from 'express';
import cors from 'cors';
import citaRoutes from './infrastructure/http/routes/citaRoutes';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/citas', citaRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(port, () => {
  console.log(`[Backend] Server is running on port ${port}`);
});
