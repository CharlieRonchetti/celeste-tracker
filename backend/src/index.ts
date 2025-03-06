import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import runsRouter from './routes/runs.ts'
import signupRouter from './routes/signup.ts'
import signinRouter from './routes/signin.ts'
import uploadImageRouter from './routes/uploadImage.ts'

dotenv.config() // Load environment variables

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors()) // Enable CORS for frontend
app.use(express.json()) // Allow JSON requests

// Sample route to test the backend
app.get('/', (req, res) => {
  res.send('Backend is running')
})

app.use('/api/runs', runsRouter)
app.use('/api/signup', signupRouter)
app.use('/api/signin', signinRouter)
app.use('/api/upload-image', uploadImageRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
